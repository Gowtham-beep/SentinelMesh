'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Incident, Monitor } from '@/types';
import { CheckCircle, AlertTriangle, Loader2, CheckCheck, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { formatDuration } from '@/lib/utils';

export default function IncidentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [monitorFilter, setMonitorFilter] = useState<string>('all');
  const [mutationError, setMutationError] = useState<string | null>(null);

  const { data: monitors } = useQuery<Monitor[]>({
    queryKey: ['monitors'],
    queryFn: async () => (await api.get<Monitor[]>('/monitors')).data,
  });

  const { data: incidents, isLoading, isError } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: async () => (await api.get<Incident[]>('/incidents')).data,
    refetchInterval: 10000,
  });

  const resolveMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/incidents/${id}/resolve`),
    onSuccess: () => {
      setMutationError(null);
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
    onError: (err: any) => {
      setMutationError(err?.response?.data?.message || err?.message || 'Resolve failed');
    },
  });

  const filtered = useMemo(() => {
    if (!incidents) return [];
    if (monitorFilter === 'all') return incidents;
    return incidents.filter(i => i.monitorId === monitorFilter);
  }, [incidents, monitorFilter]);

  const openCount = filtered.filter(i => i.status === 'OPEN').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Incidents</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isLoading ? null : openCount > 0
              ? <span className="text-red-400 font-medium">{openCount} active</span>
              : filtered.length > 0
                ? `${filtered.length} total · all resolved`
                : 'All systems operational'}
          </p>
        </div>
        <select
          className="h-9 rounded-lg border border-slate-700 bg-slate-800/50 px-3 text-sm text-slate-300 outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          value={monitorFilter}
          onChange={e => setMonitorFilter(e.target.value)}
        >
          <option value="all">All Monitors</option>
          {monitors?.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>

      {/* Error banner */}
      {mutationError && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          <span>{mutationError}</span>
          <button onClick={() => setMutationError(null)} className="ml-4 text-red-500 hover:text-red-300">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="flex h-60 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-500" /></div>
      ) : isError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">Failed to load incidents.</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-20 text-center">
          <CheckCircle className="mb-4 h-10 w-10 text-green-500/40" />
          <h3 className="text-base font-semibold text-slate-400">No incidents</h3>
          <p className="mt-1 text-sm text-slate-600">All systems are operating normally.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
          <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Incident Log</span>
            <span className="font-mono text-xs text-slate-600">{filtered.length} total</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60">
                {['Monitor', 'Scope', 'Started', 'Resolved', 'Duration', 'Action'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {filtered.map(incident => (
                <tr key={incident.id} className="transition-colors hover:bg-slate-800/20">
                  {/* Monitor */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      {incident.status === 'OPEN'
                        ? <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0 animate-pulse" />
                        : <CheckCircle className="h-3.5 w-3.5 text-green-500/60 shrink-0" />}
                      <button
                        onClick={() => router.push(`/monitors/${incident.monitorId}`)}
                        className="font-medium text-slate-200 hover:text-cyan-400 transition-colors"
                      >
                        {incident.monitor?.name ?? incident.monitorId.slice(0, 8) + '…'}
                      </button>
                    </div>
                  </td>
                  {/* Scope */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-mono font-medium bg-slate-800 text-slate-400 ring-1 ring-slate-700">
                      {incident.scope}{incident.region ? ` · ${incident.region}` : ''}
                    </span>
                  </td>
                  {/* Started */}
                  <td className="px-4 py-3 font-mono text-xs text-slate-400">
                    {incident.openedAt ? new Date(incident.openedAt).toLocaleString() : '—'}
                  </td>
                  {/* Resolved */}
                  <td className="px-4 py-3 font-mono text-xs">
                    {incident.closedAt
                      ? <span className="text-slate-400">{new Date(incident.closedAt).toLocaleString()}</span>
                      : <span className="text-red-400 font-semibold">Ongoing</span>}
                  </td>
                  {/* Duration */}
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {incident.openedAt ? formatDuration(incident.openedAt, incident.closedAt) : '—'}
                  </td>
                  {/* Action — Resolve only for OPEN incidents */}
                  <td className="px-4 py-3">
                    {incident.status === 'OPEN' ? (
                      <button
                        onClick={() => resolveMutation.mutate(incident.id)}
                        disabled={resolveMutation.isPending}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-green-500/20 bg-green-500/10 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                      >
                        {resolveMutation.isPending
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <CheckCheck className="h-3 w-3" />}
                        Resolve
                      </button>
                    ) : (
                      <span className="text-xs text-slate-700 font-mono">—</span>
                    )}
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
