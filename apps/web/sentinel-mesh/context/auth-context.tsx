'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { setAuthToken } from '@/lib/api';

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  login: (nextToken: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = Boolean(token);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (!pathname) return;

    const publicPaths = ['/login', '/signup'];
    const isPublic = publicPaths.some((p) => pathname.startsWith(p));

    if (!isAuthenticated && !isPublic) {
      router.replace('/login');
      return;
    }

    if (isAuthenticated && isPublic) {
      router.replace('/');
    }
  }, [isAuthenticated, pathname, router]);

  const value = useMemo<AuthContextType>(
    () => ({
      token,
      isAuthenticated,
      login: (nextToken: string) => {
        setToken(nextToken);
        router.replace('/');
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
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
