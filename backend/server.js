require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceKey.json');
const { createCache } = require('./utils/cache');

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
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'SecureBank Backend Server' });
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
    const flagged = parsedAmount > 1000;

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
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    batch.set(recipientTxRef, {
      userId: recipientId,
      type: 'deposit',
      amount: parsedAmount,
      recipient: senderData?.email || normalizedRecipientEmail,
      category: category || 'Transfer',
      note: note ? `Received from ${normalizedRecipientEmail}` : `Received from ${normalizedRecipientEmail}`,
      flagged,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    await batch.commit();

    return res.json({
      success: true,
      message: 'Transfer completed successfully',
      flagged,
    });
  } catch (error) {
    console.error('Failed to create transfer:', error);
    return res.status(500).json({ error: 'Failed to create transfer' });
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
