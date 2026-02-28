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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

const INTERVALS = [
  { label: '30 seconds', value: '30' },
  { label: '1 minute', value: '60' },
  { label: '5 minutes', value: '300' },
  { label: '10 minutes', value: '600' },
];

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Must be a valid URL'),
  intervalSeconds: z.coerce.number().refine(v => [30, 60, 300, 600].includes(v), { message: 'Select a valid interval' }),
  alertEmail: z.string().email('Must be a valid email'),
});
type FormValues = z.infer<typeof schema>;

function FieldRow({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function EditMonitorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: monitor, isLoading } = useQuery<Monitor>({
    queryKey: ['monitors', id],
    queryFn: async () => (await api.get<Monitor>(`/monitors/${id}`)).data,
  });

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
  });

  useEffect(() => {
    if (monitor) {
      reset({
        name: monitor.name,
        url: monitor.url,
        intervalSeconds: monitor.intervalSeconds ?? 60,
        alertEmail: (monitor as any).alertEmail ?? '',
      });
    }
  }, [monitor, reset]);

  const onSubmit = async (data: FormValues) => {
    setServerError(null);
    try {
      // API uses PATCH with intervalSeconds
      await api.patch(`/monitors/${id}`, {
        name: data.name,
        url: data.url,
        intervalSeconds: data.intervalSeconds,
      });
      router.push(`/monitors/${id}`);
    } catch (err: any) {
      setServerError(err.response?.data?.message || err.message || 'Failed to update monitor');
    }
  };

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-500" /></div>;

  return (
    <div className="mx-auto max-w-xl space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/monitors/${id}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold gradient-text">Edit Monitor</h1>
          <p className="text-sm text-slate-500">{monitor?.name}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-600">Monitor Configuration</p>

        {serverError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2.5 text-sm text-red-400 ring-1 ring-red-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />{serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-5">
          <FieldRow label="Name" error={errors.name?.message}>
            <Input {...register('name')} />
          </FieldRow>

          <FieldRow label="URL" error={errors.url?.message}>
            <Input {...register('url')} />
          </FieldRow>

          <FieldRow label="Check Interval" error={errors.intervalSeconds?.message}>
            <Controller
              name="intervalSeconds"
              control={control}
              render={({ field }) => (
                <Select value={String(field.value)} onValueChange={v => field.onChange(Number(v))}>
                  <SelectTrigger><SelectValue placeholder="Select interval" /></SelectTrigger>
                  <SelectContent>
                    {INTERVALS.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            />
          </FieldRow>

          <FieldRow label="Alert Email" error={errors.alertEmail?.message}>
            <Input type="email" {...register('alertEmail')} />
          </FieldRow>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <Button variant="outline" type="button" asChild>
              <Link href={`/monitors/${id}`}>Cancel</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
