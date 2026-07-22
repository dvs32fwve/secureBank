import { db, auth } from './config';
import { collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getIdToken } from 'firebase/auth';

const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001').replace(/\/+$/, '');
const DEFAULT_FALLBACKS = ['https://smartbankbackend-thbc.onrender.com'];
const FALLBACK_URLS = (import.meta.env.VITE_BACKEND_FALLBACKS || DEFAULT_FALLBACKS.join(',')).split(',').map(s => s.trim()).filter(Boolean);

const buildUrl = (baseUrl: string, path: string) => {
  const base = baseUrl.replace(/\/+$/, '');
  const suffix = path.replace(/^\/+/, '');
  return `${base}/${suffix}`;
};

const getAuthToken = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('No authenticated user');
  }
  return await getIdToken(currentUser);
};

const backendRequest = async (path: string, options: RequestInit = {}) => {
  const token = await getAuthToken();

  const makeRequest = async (baseUrl: string) => {
    const res = await fetch(buildUrl(baseUrl, path), {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ error: 'Backend request failed' }));
      throw new Error(errorBody.error || `Request failed with status ${res.status}`);
    }

    return res.json();
  };

  // Try primary URL first, then fallbacks if network-level failure occurs
  try {
    return await makeRequest(BACKEND_URL);
  } catch (err) {
    const isNetworkError = err instanceof TypeError || /Unable to reach backend|NetworkError|Failed to fetch/i.test(String(err));
    if (!isNetworkError) throw err;

    for (const fb of FALLBACK_URLS) {
      try {
        return await makeRequest(fb);
      } catch (innerErr) {
        // continue to next fallback
        console.warn(`Backend fallback ${fb} failed:`, innerErr);
      }
    }

    throw new Error('All backend endpoints are unreachable');
  }
};

export const parseTimestampToDate = (value: TimestampLike | null | undefined): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }
  if (typeof (value as any).toDate === 'function') {
    return (value as any).toDate();
  }

  const seconds = (value as any).seconds ?? (value as any)._seconds;
  const nanoseconds = (value as any).nanoseconds ?? (value as any)._nanoseconds;

  if (typeof seconds === 'number') {
    return new Date(seconds * 1000 + Math.round((nanoseconds || 0) / 1e6));
  }

  return null;
};

export const getOrCreateUserProfile = async (firebaseUser: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}) => {
  return backendRequest('/users', {
    method: 'POST',
    body: JSON.stringify({
      name: firebaseUser.displayName || 'Unknown User',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || '',
    }),
  });
};

export const getAuditStats = async () => {
  return backendRequest('/admin/audit-stats');
};

export type TimestampLike =
  | Timestamp
  | Date
  | string
  | { seconds: number; nanoseconds: number }
  | { _seconds: number; _nanoseconds: number };

export interface User {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  balance: number;
  role: 'customer' | 'admin';
  createdAt: TimestampLike;
}

export interface Transaction {
  id?: string;
  userId: string;
  type: 'transfer' | 'deposit' | 'withdrawal';
  amount: number;
  recipient: string;
  category: string;
  timestamp: Timestamp;
  flagged?: boolean;
  warn?: boolean;
  flagReason?: string;
}

export interface VirtualCard {
  userId: string;
  cardNumber: string;
  cardNumberMasked: string;
  expiry: string;
  status: 'active' | 'blocked';
}

export interface ContactForm {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: Timestamp;
}

export const getUser = async (uid: string): Promise<User | null> => {
  const docRef = doc(db, 'users', uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return docSnap.data() as User;
  }
  return null;
};

export const ensureUserProfile = async (firebaseUser: {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}): Promise<User> => {
  const existingUser = await getUser(firebaseUser.uid);
  if (existingUser) {
    return existingUser;
  }

  const userData: User = {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || 'Unknown User',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || '',
    balance: 5000,
    role: 'customer',
    createdAt: serverTimestamp() as Timestamp,
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), userData);
  return userData;
};

export const updateUser = async (uid: string, data: Partial<User>) => {
  const docRef = doc(db, 'users', uid);
  await updateDoc(docRef, data);
};

export const getAllUsers = async (): Promise<User[]> => {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => doc.data() as User);
};

export const createTransaction = async (userId: string, data: Omit<Transaction, 'id' | 'userId' | 'timestamp'>) => {
  const user = await getUser(userId);
  if (!user) throw new Error("User not found");
  
  if (data.type === 'transfer' || data.type === 'withdrawal') {
    if (user.balance < data.amount) throw new Error("Insufficient funds");
    await updateUser(userId, { balance: user.balance - data.amount });
  } else if (data.type === 'deposit') {
    await updateUser(userId, { balance: user.balance + data.amount });
  }

  const txData = {
    ...data,
    userId,
    timestamp: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, 'transactions'), txData);

  // If the transaction was flagged or has a flagReason, write a summary audit log so store purchases are tracked.
  if (data.flagged || data.flagReason) {
    try {
      await addDoc(collection(db, 'auditLogs'), {
        userId,
        transactionId: docRef.id,
        outcome: !!data.flagged,
        flagReasons: data.flagReason ? [data.flagReason] : [],
        amount: data.amount,
        recipient: data.recipient,
        category: data.category,
        source: 'store',
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      console.error('Failed to write store audit log:', e);
    }
  }
  return docRef.id;
};

export const getUserTransactions = async (userId: string): Promise<Transaction[]> => {
  const q = query(collection(db, 'transactions'), where('userId', '==', userId), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const q = query(collection(db, 'transactions'), orderBy('timestamp', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Transaction));
};

export const clearTransactionFlag = async (transactionId: string) => {
  const transactionRef = doc(db, 'transactions', transactionId);
  await updateDoc(transactionRef, { flagged: false, flagReason: '' });
};

export const getVirtualCard = async (): Promise<VirtualCard> => {
  return backendRequest('/virtual-card');
};

export const ensureVirtualCard = async (): Promise<VirtualCard> => {
  return backendRequest('/virtual-card/repair', {
    method: 'POST',
  });
};

export const createVirtualCard = async (): Promise<VirtualCard> => {
  return getVirtualCard();
};

export const updateVirtualCard = async (data: Partial<VirtualCard>) => {
  return backendRequest('/virtual-card', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

export const saveContactForm = async (data: Omit<ContactForm, 'id' | 'createdAt'>) => {
  const contactData = {
    ...data,
    createdAt: serverTimestamp(),
  };
  
  const docRef = await addDoc(collection(db, 'contact_form'), contactData);
  return docRef.id;
};
