'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { Shield, AlertCircle, Loader2 } from 'lucide-react';

const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'At least 6 characters'),
    confirmPassword: z.string().min(1, 'Required'),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const { login } = useAuth();
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormValues) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.post('/auth/signup', { email: data.email, password: data.password });
            const token = res.data.token || res.data.accessToken;
            if (token) login(token);
            else router.push('/login?registered=1');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
            <div className="absolute inset-0 bg-dot-grid opacity-60" />
            <div className="absolute left-1/3 top-1/3 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/6 blur-3xl" />
            <div className="absolute right-1/4 bottom-1/4 h-48 w-48 rounded-full bg-cyan-500/6 blur-3xl" />

            <div className="relative z-10 w-full max-w-sm animate-fade-in px-4">
                {/* Header */}
                <div className="mb-8 flex flex-col items-center gap-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 ring-1 ring-cyan-500/30 glow-cyan">
                        <Shield className="h-7 w-7 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold gradient-text-cyan tracking-tight">Create Account</h1>
                        <p className="mt-1 text-sm text-slate-500">Join SentinelMesh monitoring</p>
                    </div>
                </div>

                {/* Card */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-sm ring-1 ring-slate-800/50">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-400 ring-1 ring-red-500/20">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Email</label>
                            <input
                                type="email"
                                placeholder="operator@example.com"
                                {...register('email')}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
                            />
                            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
                            />
                            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-medium uppercase tracking-wider text-slate-500">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-slate-200 placeholder-slate-600 outline-none transition-all focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30"
                            />
                            {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            {loading ? 'Creating account…' : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-cyan-500 hover:text-cyan-400 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
