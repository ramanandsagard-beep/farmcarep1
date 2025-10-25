import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '@/lib/api';

type User = { id: string; phone: string; name: string; email: string; role: string; createdAt: string } | null;

type AuthCtx = {
  user: User;
  token: string | null;
  setToken: (t: string | null) => void;
  setUser: (u: User) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({ user: null, token: null, setToken: () => {}, setUser: () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (t) setToken(t);
  }, []);

  useEffect(() => {
    if (!token) { setUser(null); return; }
    localStorage.setItem('token', token);

    console.log('🔐 AuthContext: Processing token:', token.substring(0, 50) + '...');

    try {
      // Decode JWT token to get user data directly
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log('🔍 AuthContext: Raw JWT payload:', payload);
      console.log('🔍 AuthContext: JWT payload keys:', Object.keys(payload));

      // Check if payload has all required fields
      const hasRequiredFields = payload.sub && payload.name && payload.email && payload.phone && payload.role;
      console.log('🔍 AuthContext: Has required fields:', hasRequiredFields);

      if (!hasRequiredFields) {
        console.warn('❌ AuthContext: JWT payload missing required fields:', {
          hasSub: !!payload.sub,
          hasName: !!payload.name,
          hasEmail: !!payload.email,
          hasPhone: !!payload.phone,
          hasRole: !!payload.role
        });
        throw new Error('Missing required fields in JWT');
      }

      const userData = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        createdAt: payload.createdAt || new Date().toISOString()
      };

      console.log('✅ AuthContext: Setting user from JWT:', userData);
      setUser(userData);

    } catch (err) {
      console.error('❌ AuthContext: Error decoding JWT:', err);
      console.log('🔄 AuthContext: Falling back to API call');
      // Fallback to API call if JWT decoding fails
      api('/users/me', {}, token).then(user => {
        console.log('✅ AuthContext: Fetched user from API:', user);
        setUser(user);
      }).catch(err => {
        console.error('❌ AuthContext: Error fetching user from API:', err);
        console.error('🚨 AuthContext: Clearing token due to repeated failures');
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      });
    }
  }, [token]);

  const logout = () => {
    // Clear all storage
    localStorage.clear();
    sessionStorage.clear();
    // Clear state
    setToken(null);
    setUser(null);
  };

  return <Ctx.Provider value={{ user, token, setToken, setUser, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() { return useContext(Ctx); }
