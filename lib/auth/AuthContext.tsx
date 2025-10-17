'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import {
  getCurrentUser,
  getUserTier,
  hasProAccess,
  onAuthStateChange,
  signOut as supabaseSignOut,
  UserTier,
} from './supabase';

interface AuthContextType {
  user: User | null;
  tier: UserTier;
  isPro: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tier, setTier] = useState<UserTier>('free');
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const userTier = await getUserTier(currentUser.id);
        const proAccess = await hasProAccess(currentUser.id);
        setTier(userTier);
        setIsPro(proAccess);
      } else {
        setTier('free');
        setIsPro(false);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();

    const { data: authListener } = onAuthStateChange((user) => {
      setUser(user);
      if (user) {
        getUserTier(user.id).then(setTier);
        hasProAccess(user.id).then(setIsPro);
      } else {
        setTier('free');
        setIsPro(false);
      }
      setLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabaseSignOut();
    setUser(null);
    setTier('free');
    setIsPro(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tier,
        isPro,
        loading,
        signOut: handleSignOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

