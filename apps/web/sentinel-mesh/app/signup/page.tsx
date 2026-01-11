'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth(); // Optional: Auto-login after signup

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormValues) => {
        setLoading(true);
        setError(null);
        try {
            // Backend expects email/password
            const response = await api.post('/auth/signup', {
                email: data.email,
                password: data.password,
            });

            // If backend returns token on signup, we can auto-login
            // Otherwise redirect to login
            const token = response.data.token || response.data.accessToken;
            if (token) {
                login(token);
            } else {
                router.push('/login?signedUp=true');
            }
        } catch (err: any) {
            console.error('Signup error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>Get started with SentinelMesh monitoring.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                                <AlertCircle className="h-4 w-4" />
                                <span>{error}</span>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="••••••••"
                                {...register('confirmPassword')}
                            />
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" isLoading={loading}>
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-zinc-900 hover:underline dark:text-zinc-50">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
