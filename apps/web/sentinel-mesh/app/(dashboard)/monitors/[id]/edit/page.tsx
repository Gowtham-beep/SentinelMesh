'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

const monitorSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    url: z.string().url('Invalid URL'),
    interval: z.coerce.number().min(10, 'Interval must be at least 10 seconds').max(86400),
});

type MonitorFormValues = z.infer<typeof monitorSchema>;

export default function EditMonitorPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: monitor, isLoading } = useQuery({
        queryKey: ['monitors', id],
        queryFn: async () => {
            const res = await api.get(`/monitors/${id}`);
            return res.data;
        }
    });

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<MonitorFormValues>({
        resolver: zodResolver(monitorSchema) as any,
    });

    useEffect(() => {
        if (monitor) {
            setValue('name', monitor.name);
            setValue('url', monitor.url);
            setValue('interval', monitor.interval);
        }
    }, [monitor, setValue]);

    const onSubmit = async (data: MonitorFormValues) => {
        try {
            await api.patch(`/monitors/${id}`, data);
            router.push('/monitors');
        } catch (error) {
            console.error('Failed to update monitor', error);
            alert('Failed to update monitor');
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/monitors"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Edit Monitor</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Monitor Configuration</CardTitle>
                    <CardDescription>Update settings for {monitor?.name}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" {...register('name')} />
                            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">URL</Label>
                            <Input id="url" {...register('url')} />
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
                            <Button type="submit" isLoading={isSubmitting}>Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
