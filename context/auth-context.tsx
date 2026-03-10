'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api';

interface AuthState {
  userId: number | null;
  username: string | null;
  isLoading: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthState & {
  login: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (username: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    userId: null,
    username: null,
    isLoading: true,
    isLoggedIn: false,
  });

  const refresh = useCallback(async () => {
    const res = await authApi.me();
    setState({
      userId: res.userId ?? null,
      username: res.username ?? null,
      isLoading: false,
      isLoggedIn: res.success && !!res.userId,
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await authApi.login(username, password);
    if (res.success) {
      setState({
        userId: res.userId ?? null,
        username: res.username ?? null,
        isLoading: false,
        isLoggedIn: true,
      });
    }
    return { success: res.success, message: res.message };
  }, []);

  const signup = useCallback(async (username: string, password: string) => {
    const res = await authApi.signup(username, password);
    if (res.success) {
      setState({
        userId: res.userId ?? null,
        username: res.username ?? null,
        isLoading: false,
        isLoggedIn: true,
      });
    }
    return { success: res.success, message: res.message };
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setState({
      userId: null,
      username: null,
      isLoading: false,
      isLoggedIn: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
