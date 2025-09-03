
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  Auth
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from './use-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<any>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string): Promise<any> => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  const signIn = async (email: string, password: string) => {
     return signInWithEmailAndPassword(auth, email, password);
  }

  const signOutUser = async () => {
    try {
      await signOut(auth);
      router.push('/');
      toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
    } catch (error: any) {
      toast({ title: 'Sign Out Error', description: error.message, variant: 'destructive' });
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOutUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
