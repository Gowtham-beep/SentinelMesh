'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { setAuthToken } from '@/lib/api';

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    // Initialize axios token when state changes
    useEffect(() => {
        setAuthToken(token);
    }, [token]);

    const login = (newToken: string) => {
        setToken(newToken);
        router.push('/');
    };

    const logout = () => {
        setToken(null);
        router.push('/login');
    };

    const isAuthenticated = !!token;

    // Simple protection: if not authenticated and trying to access protected route, redirect to login.
    // We'll exclude /login and /signup
    useEffect(() => {
        const publicPaths = ['/login', '/signup'];
        if (!isAuthenticated && !publicPaths.includes(pathname)) {
            // We defer this slightly or just allow it to render a "Redirecting..."
            // In this simple in-memory model, refresh = logout -> redirect to login.
            router.push('/login');
        }
    }, [isAuthenticated, pathname, router]);


    return (
        <AuthContext.Provider value={{ token, login, logout, isAuthenticated }}>
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
