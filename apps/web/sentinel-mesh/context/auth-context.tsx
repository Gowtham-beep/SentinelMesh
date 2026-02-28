'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { setAuthToken } from '@/lib/api';

const TOKEN_KEY = 'sm_token';

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  login: (nextToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialise from localStorage so token survives page refresh
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  });

  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = Boolean(token);

  // Keep axios instance in sync
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  // Persist / clear token in localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  // Route guard
  useEffect(() => {
    if (!pathname) return;
    const publicPaths = ['/login', '/signup'];
    // It's a public route if it exactly matches '/' OR starts with a public path
    const isPublic = pathname === '/' || publicPaths.some((p) => pathname.startsWith(p));

    if (!isAuthenticated && !isPublic) {
      router.replace('/login');
      return;
    }
    if (isAuthenticated && isPublic) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  const value = useMemo<AuthContextType>(
    () => ({
      token,
      isAuthenticated,
      login: (nextToken: string) => {
        setToken(nextToken);
        router.replace('/dashboard');
      },
      logout: () => {
        setToken(null);
        router.replace('/login');
      },
    }),
    [isAuthenticated, router, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
