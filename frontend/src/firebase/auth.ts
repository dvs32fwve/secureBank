import { GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { auth } from './config';
import { ensureVirtualCard } from './firestore';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    try {
      await ensureVirtualCard();
    } catch (error) {
      console.error('Error ensuring virtual card on signup', error);
    }

    return user;
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};
