'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Monitor } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

const INTERVAL_OPTIONS = [
  { label: '30 seconds', value: '30' },
  { label: '1 minute', value: '60' },
  { label: '5 minutes', value: '300' },
  { label: '10 minutes', value: '600' },
];

const monitorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Must be a valid URL (e.g. https://example.com)'),
  interval: z.coerce.number().refine((v) => [30, 60, 300, 600].includes(v), {
    message: 'Select a valid interval',
  }),
  alertEmail: z.string().email('Must be a valid email address'),
});

type MonitorFormValues = z.infer<typeof monitorSchema>;

export default function EditMonitorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: monitor, isLoading } = useQuery<Monitor>({
    queryKey: ['monitors', id],
    queryFn: async () => {
      const res = await api.get<Monitor>(`/monitors/${id}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MonitorFormValues>({
    resolver: zodResolver(monitorSchema) as any,
  });

  useEffect(() => {
    if (monitor) {
      reset({
        name: monitor.name,
        url: monitor.url,
        interval: monitor.interval,
        alertEmail: (monitor as any).alertEmail ?? '',
      });
    }
  }, [monitor, reset]);

  const onSubmit = async (data: MonitorFormValues) => {
    setServerError(null);
    try {
      await api.put(`/monitors/${id}`, data);
      router.push('/');
    } catch (err: any) {
      setServerError(err.response?.data?.message || err.message || 'Failed to update monitor');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/monitors/${id}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Monitor</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monitor Configuration</CardTitle>
          <CardDescription>Update settings for {monitor?.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
            {serverError && (
              <div className="flex items-center gap-2 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

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
              <Label htmlFor="interval">Check Interval</Label>
              <Controller
                name="interval"
                control={control}
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(val) => field.onChange(Number(val))}
                  >
                    <SelectTrigger id="interval">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent>
                      {INTERVAL_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.interval && <p className="text-xs text-red-500">{errors.interval.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="alertEmail">Alert Email</Label>
              <Input id="alertEmail" type="email" {...register('alertEmail')} />
              {errors.alertEmail && <p className="text-xs text-red-500">{errors.alertEmail.message}</p>}
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <Button type="button" variant="outline" asChild>
                <Link href={`/monitors/${id}`}>Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
