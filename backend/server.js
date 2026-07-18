require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceKey.json');
const { createCache } = require('./utils/cache');
const { evaluateTransferRisk } = require('./utils/transferRules');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 5001;
const userCache = createCache({ ttlMs: 15000 });
const virtualCardCache = createCache({ ttlMs: 15000 });

const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

const createVirtualCardForUser = async (userId, existingData = {}) => {
  const cardDigits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10).toString());
  const cardNumber = cardDigits.join('').replace(/(.{4})/g, '$1 ').trim();
  const cardNumberMasked = '**** **** **** ' + cardNumber.slice(-4);
  const date = new Date();
  date.setFullYear(date.getFullYear() + 3);
  const expiry = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear().toString().slice(-2)}`;

  const cardData = {
    userId,
    cardNumber,
    cardNumberMasked,
    expiry,
    status: existingData.status || 'active',
  };

  await db.collection('virtualCards').doc(userId).set(cardData);
  return cardData;
};

const isFullCardNumber = (value) => {
  return typeof value === 'string' && /^\d{4} \d{4} \d{4} \d{4}$/.test(value);
};

const ensureVirtualCardForUser = async (userId) => {
  const cachedCard = virtualCardCache.get(userId);
  if (cachedCard) {
    return cachedCard;
  }

  const cardRef = db.collection('virtualCards').doc(userId);
  const cardSnap = await cardRef.get();

  if (cardSnap.exists) {
    const cardData = cardSnap.data();
    const hasValidCard = cardData
      && isFullCardNumber(cardData.cardNumber)
      && typeof cardData.cardNumberMasked === 'string'
      && typeof cardData.expiry === 'string';

    if (hasValidCard) {
      virtualCardCache.set(userId, cardData);
      return cardData;
    }

    const repairedCard = await createVirtualCardForUser(userId, cardData);
    virtualCardCache.set(userId, repairedCard);
    return repairedCard;
  }

  const newCard = await createVirtualCardForUser(userId);
  virtualCardCache.set(userId, newCard);
  return newCard;
};

const repairVirtualCardForUser = async (userId) => {
  const cardRef = db.collection('virtualCards').doc(userId);
  const cardSnap = await cardRef.get();
  const existingData = cardSnap.exists ? cardSnap.data() : {};
  return await createVirtualCardForUser(userId, existingData);
};

// Middleware
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000,https://smartbank-6may.onrender.com').split(',').map(s => s.trim());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g., server-to-server, mobile, or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy does not allow access from the specified Origin.'), false);
  },
  optionsSuccessStatus: 200,
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'SmartBank Backend Server' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/users', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.uid;
    const cachedUser = userCache.get(userId);
    if (cachedUser) {
      return res.json(cachedUser);
    }

    const { name, email, photoURL } = req.body;
    const userRef = db.collection('users').doc(userId);
    const userSnap = await userRef.get();

    if (userSnap.exists) {
      const userData = userSnap.data();
      userCache.set(userId, userData);
      return res.json(userData);
    }

    const userData = {
      uid: userId,
      name: name || 'Unknown User',
      email: email || '',
      photoURL: photoURL || '',
      balance: 5000,
      role: 'customer',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await userRef.set(userData);
    const savedSnap = await userRef.get();
    const savedUserData = savedSnap.data();
    const responseUser = savedUserData || userData;
    userCache.set(userId, responseUser);
    return res.json(responseUser);
  } catch (error) {
    console.error('Failed to create user profile:', error);
    return res.status(500).json({ error: 'Failed to create user profile' });
  }
});

app.get('/virtual-card', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.uid;
    const card = await ensureVirtualCardForUser(userId);
    return res.json(card);
  } catch (error) {
    console.error('Failed to fetch virtual card:', error);
    return res.status(500).json({ error: 'Failed to fetch virtual card' });
  }
});

app.post('/virtual-card/repair', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.uid;
    const card = await repairVirtualCardForUser(userId);
    return res.json(card);
  } catch (error) {
    console.error('Failed to repair virtual card:', error);
    return res.status(500).json({ error: 'Failed to repair virtual card' });
  }
});

app.patch('/virtual-card', verifyFirebaseToken, async (req, res) => {
  try {
    const userId = req.uid;
    const { status } = req.body;

    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const cardRef = db.collection('virtualCards').doc(userId);
    const cardSnap = await cardRef.get();

    if (!cardSnap.exists) {
      return res.status(404).json({ error: 'Virtual card not found' });
    }

    await cardRef.update({ status });
    const updatedCard = { ...(cardSnap.data() || {}), status };
    virtualCardCache.set(userId, updatedCard);
    return res.json(updatedCard);
  } catch (error) {
    console.error('Failed to update virtual card status:', error);
    return res.status(500).json({ error: 'Failed to update virtual card status' });
  }
});

app.post('/transfer', verifyFirebaseToken, async (req, res) => {
  try {
    const senderId = req.uid;
    const { recipientEmail, amount, category = 'Other', note = '' } = req.body;

    if (!recipientEmail || typeof recipientEmail !== 'string') {
      return res.status(400).json({ error: 'Recipient email is required' });
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const senderRef = db.collection('users').doc(senderId);
    const senderSnap = await senderRef.get();

    if (!senderSnap.exists) {
      return res.status(404).json({ error: 'Sender profile not found' });
    }

    const senderData = senderSnap.data();
    const senderBalance = Number(senderData?.balance || 0);

    if (senderBalance < parsedAmount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    const normalizedRecipientEmail = recipientEmail.toLowerCase();
    const recipientQuery = await db.collection('users').where('email', '==', normalizedRecipientEmail).limit(1).get();
    if (recipientQuery.empty) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    const recipientDoc = recipientQuery.docs[0];
    const recipientId = recipientDoc.id;
    const recipientData = recipientDoc.data();

    const countryCode = typeof req.body?.countryCode === 'string' ? req.body.countryCode.toUpperCase() : '';
    const transferRisk = evaluateTransferRisk({
      amount: parsedAmount,
      category,
      isIncoming: false,
      country: countryCode,
    });

    const ruleResults = transferRisk.ruleResults;
    const flagged = transferRisk.flagged;
    const requiresVerification = transferRisk.requiresVerification;
    const securityNotice = transferRisk.securityNotice;
    const flagReasonText = transferRisk.flagReason;
    const flagReasons = flagged ? [flagReasonText] : [];

    // Batch write: balances, transactions, and audit logs
    const batch = db.batch();
    const senderTxRef = db.collection('transactions').doc();
    const recipientTxRef = db.collection('transactions').doc();

    batch.update(senderRef, { balance: senderBalance - parsedAmount });
    batch.update(db.collection('users').doc(recipientId), { balance: Number(recipientData?.balance || 0) + parsedAmount });

    batch.set(senderTxRef, {
      userId: senderId,
      type: 'transfer',
      amount: parsedAmount,
      recipient: normalizedRecipientEmail,
      category,
      note,
      flagged,
      flagReason: flagReasonText,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    batch.set(recipientTxRef, {
      userId: recipientId,
      type: 'deposit',
      amount: parsedAmount,
      recipient: senderData?.email || normalizedRecipientEmail,
      category: category || 'Transfer',
      note: note ? `Received from ${normalizedRecipientEmail}` : `Received from ${normalizedRecipientEmail}`,
      flagged: false,
      flagReason: '',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Per-rule audit log entries
    for (const r of ruleResults) {
      const auditRef = db.collection('auditLogs').doc();
      batch.set(auditRef, {
        userId: senderId,
        transactionId: senderTxRef.id,
        rule: r.rule,
        threshold: r.threshold,
        outcome: !!r.outcome,
        details: r.details || {},
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    if (requiresVerification) {
      const verificationAuditRef = db.collection('auditLogs').doc();
      batch.set(verificationAuditRef, {
        userId: senderId,
        email: senderData?.email || '',
        country: countryCode || 'Unknown',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        amount: parsedAmount,
        eventType: 'Outside Banking Region',
      });
    }

    // Summary audit log
    const summaryRef = db.collection('auditLogs').doc();
    batch.set(summaryRef, {
      userId: senderId,
      transactionId: senderTxRef.id,
      outcome: flagged || requiresVerification,
      flagReasons,
      amount: parsedAmount,
      recipient: normalizedRecipientEmail,
      category,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      note: requiresVerification ? 'Security verification required' : 'Fraud evaluation summary',
    });

    await batch.commit();

    return res.json({ success: true, message: 'Transfer completed successfully', flagged, requiresVerification, flagReasons, securityNotice });
  } catch (error) {
    console.error('Failed to create transfer:', error);
    return res.status(500).json({ error: 'Failed to create transfer' });
  }
});

// Admin: audit / governance stats
app.get('/admin/audit-stats', verifyFirebaseToken, async (req, res) => {
  try {
    const uid = req.uid;
    const userRef = db.collection('users').doc(uid);
    const userSnap = await userRef.get();
    if (!userSnap.exists) return res.status(403).json({ error: 'Forbidden' });
    const user = userSnap.data();
    if (user?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const txSnap = await db.collection('transactions').get();
    const total = txSnap.size;

    let flaggedCount = 0;
    const flaggedByCategory = {};
    const flaggedByAmountRanges = {
      '0-100': 0,
      '101-500': 0,
      '501-1000': 0,
      '>1000': 0,
    };

    txSnap.docs.forEach((d) => {
      const t = d.data();
      if (t?.flagged) {
        flaggedCount += 1;
        const cat = (t.category || 'Other');
        flaggedByCategory[cat] = (flaggedByCategory[cat] || 0) + 1;
        const amt = Number(t.amount || 0);
        if (amt <= 100) flaggedByAmountRanges['0-100'] += 1;
        else if (amt <= 500) flaggedByAmountRanges['101-500'] += 1;
        else if (amt <= 1000) flaggedByAmountRanges['501-1000'] += 1;
        else flaggedByAmountRanges['>1000'] += 1;
      }
    });

    const flaggedPercentage = total ? Math.round((flaggedCount / total) * 10000) / 100 : 0;

    return res.json({
      totalTransactions: total,
      flaggedCount,
      flaggedPercentage,
      flaggedByCategory,
      flaggedByAmountRanges,
    });
  } catch (error) {
    console.error('Failed to fetch audit stats:', error);
    return res.status(500).json({ error: 'Failed to fetch audit stats' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
