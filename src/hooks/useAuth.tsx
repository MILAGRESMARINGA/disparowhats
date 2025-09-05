import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isDemo } from '../lib/supabase';

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // restaura sessão demo
    const raw = localStorage.getItem('demo_user');
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem('demo_user');
      }
    }

    // Se não é demo, verificar sessão real do Supabase
    if (!isDemo && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0]
          });
        }
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
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      if (isDemo || !supabase) {
        // DEMO: aceita qualquer credencial
        const demoUser = { id: 'demo', email, name: email.split('@')[0] || 'Usuário' };
        localStorage.setItem('demo_user', JSON.stringify(demoUser));
        setUser(demoUser);
        return;
      }
      // REAL: supabase auth
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
    if (isDemo || !supabase) {
      // DEMO: simular cadastro bem-sucedido
      const demoUser = { id: 'demo', email, name: email.split('@')[0] || 'Usuário' };
      localStorage.setItem('demo_user', JSON.stringify(demoUser));
      setUser(demoUser);
      return true;
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
    localStorage.removeItem('demo_user');
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