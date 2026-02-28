'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Monitor } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Trash2, Edit, Activity, Globe, Clock, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';

function StatusDot({ status }: { status?: string }) {
  const colors: Record<string, string> = { UP: 'bg-green-400', DOWN: 'bg-red-400', PENDING: 'bg-amber-400' };
  const bg = colors[status ?? ''] ?? 'bg-slate-500';
  return (
    <span className="relative flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${status ? 'status-pulse' : ''} ${bg}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${bg}`} />
    </span>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const styles: Record<string, string> = {
    UP: 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20',
    DOWN: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
    PENDING: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
  };
  const label = status ?? 'PENDING';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-mono font-medium ${styles[label] ?? 'bg-slate-800 text-slate-400 ring-1 ring-slate-700'}`}>
      <StatusDot status={label} />
      {label}
    </span>
  );
}

export default function MonitorsPage() {
  const queryClient = useQueryClient();

  const { data: monitors, isLoading, isError } = useQuery<Monitor[]>({
    queryKey: ['monitors'],
    queryFn: async () => (await api.get<Monitor[]>('/monitors')).data,
    refetchInterval: 10000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await api.delete(`/monitors/${id}`); },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['monitors'] }),
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-500" /></div>;
  if (isError) return <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">Failed to load monitors.</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Monitors</h1>
          <p className="mt-0.5 text-sm text-slate-500">{monitors?.length ?? 0} monitors configured</p>
        </div>
        <Button asChild><Link href="/monitors/new"><Plus className="mr-2 h-4 w-4" />Add Monitor</Link></Button>
      </div>

      {(!monitors || monitors.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-20 text-center">
          <Activity className="mb-4 h-10 w-10 text-slate-700" />
          <h3 className="text-base font-semibold text-slate-400">No monitors yet</h3>
          <p className="mt-1 mb-4 text-sm text-slate-600">Create your first monitor to start tracking uptime.</p>
          <Button variant="outline" asChild><Link href="/monitors/new">Add Monitor</Link></Button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="border-b border-slate-800 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">All Monitors</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60">
                {['Name', 'URL', 'Status', 'Last Check', 'Interval', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {monitors.map((monitor) => (
                <tr key={monitor.id} className="group transition-colors hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/monitors/${monitor.id}`} className="text-slate-200 hover:text-cyan-400 transition-colors">{monitor.name}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                      <Globe className="h-3 w-3 shrink-0 text-slate-600" />
                      <span className="truncate max-w-[200px]">{monitor.url}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={monitor.status} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {monitor.lastCheckedAt ? (
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{formatDistanceToNow(monitor.lastCheckedAt)}</span>
                    ) : <span className="text-slate-700">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {monitor.intervalSeconds
                      ? monitor.intervalSeconds >= 60 ? `${monitor.intervalSeconds / 60}m` : `${monitor.intervalSeconds}s`
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/monitors/${monitor.id}/edit`}><Edit className="h-3.5 w-3.5" /></Link>
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        onClick={() => confirm('Delete this monitor?') && deleteMutation.mutate(monitor.id)}
                        className="text-red-500 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
