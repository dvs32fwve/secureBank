import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { getUser, getOrCreateUserProfile, ensureVirtualCard, User } from '../firebase/firestore';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refreshUser: async () => undefined });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    if (!auth.currentUser) return;
    const latestUser = await getUser(auth.currentUser.uid);
    if (latestUser) {
      setUser(latestUser);
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const existingUser = await getUser(firebaseUser.uid);
          if (existingUser) {
            setUser(existingUser);
          } else {
            const localUser: User = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || 'Unknown User',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              balance: 5000,
              role: 'customer',
              createdAt: new Date(),
            };
            setUser(localUser);
          }

          const unsubscribeProfile = onSnapshot(doc(db, 'users', firebaseUser.uid), (snapshot) => {
            if (snapshot.exists()) {
              setUser(snapshot.data() as User);
            }
          });

          try {
            await getOrCreateUserProfile({
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
            });
          } catch (error) {
            console.error('Could not sync profile to backend', error);
          }

          try {
            await ensureVirtualCard();
          } catch (error) {
            console.error('Could not ensure virtual card for user', error);
          }

          setLoading(false);
          return () => unsubscribeProfile();
        } catch (error) {
          console.error('Auth init failed', error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
