'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const monitorSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    url: z.string().url('Invalid URL'),
    interval: z.coerce.number().min(10, 'Interval must be at least 10 seconds').max(86400),
});

type MonitorFormValues = z.infer<typeof monitorSchema>;

export default function CreateMonitorPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<MonitorFormValues>({
        resolver: zodResolver(monitorSchema) as any,
        defaultValues: {
            interval: 60,
        }
    });

    const onSubmit = async (data: MonitorFormValues) => {
        try {
            await api.post('/monitors', data);
            router.push('/monitors');
        } catch (error) {
            console.error('Failed to create monitor', error);
            alert('Failed to create monitor');
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/monitors"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Create Monitor</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Monitor Details</CardTitle>
                    <CardDescription>Configure what you want to monitor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="e.g. Landing Page" {...register('name')} />
                            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">URL</Label>
                            <Input id="url" placeholder="https://example.com" {...register('url')} />
                            {errors.url && <p className="text-xs text-red-500">{errors.url.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="interval">Interval (seconds)</Label>
                            <Input
                                id="interval"
                                type="number"
                                {...register('interval')}
                            />
                            <p className="text-xs text-zinc-500">Minimum 10 seconds.</p>
                            {errors.interval && <p className="text-xs text-red-500">{errors.interval.message}</p>}
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" isLoading={isSubmitting}>create Monitor</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
