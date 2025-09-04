
'use client';

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  Auth,
  UserCredential
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from './use-toast';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PROTECTED_ROUTES = ['/dashboard', '/wallet', '/p2p-betting', '/casino', '/sports-betting', '/review', '/investor'];
const PUBLIC_ROUTES = ['/signin', '/signup', '/', '/blocked'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) return;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
    const isAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup');

    if (!user && isProtectedRoute) {
        router.push('/signin');
    }

    if (user && isAuthRoute) {
        router.push('/dashboard');
    }

  }, [user, loading, pathname, router]);

  const signUp = async (email: string, password: string): Promise<any> => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  const signIn = async (email: string, password: string) => {
     return signInWithEmailAndPassword(auth, email, password);
  }

  const signOutUser = async () => {
    try {
      await signOut(auth);
      // Remove session cookie
      await fetch('/api/auth/session', { method: 'DELETE' });
      // Hard navigate to clear state and re-trigger auth checks
      window.location.href = '/';
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

  if (loading) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    )
  }

  // Prevent rendering of pages that will be redirected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup');
  if ((!user && isProtectedRoute) || (user && isAuthRoute)) {
     return (
        <div className="flex min-h-screen w-full items-center justify-center bg-background">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
