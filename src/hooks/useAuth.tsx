import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type User = { id: string; email: string; name?: string } | null;

type AuthCtx = {
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (!supabase) {
        throw new Error('Sistema de autenticação não configurado');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setUser({ 
        id: data.user?.id || '', 
        email: data.user?.email || '',
        name: data.user?.user_metadata?.name || data.user?.email?.split('@')[0]
      });
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) {
      throw new Error('Sistema de autenticação não configurado');
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      return !!data.user;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    }
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};