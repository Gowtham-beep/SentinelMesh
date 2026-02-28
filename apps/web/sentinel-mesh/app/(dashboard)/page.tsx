'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Monitor, Incident } from '@/types';
import { Plus, Globe, Clock, TrendingUp, Activity, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from '@/lib/utils';

function StatusDot({ status }: { status: Monitor['status'] }) {
  const colors = {
    UP: 'bg-green-400',
    DOWN: 'bg-red-400',
    PENDING: 'bg-amber-400',
  } as const;
  return (
    <span className="relative flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 status-pulse ${colors[status]}`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${colors[status]}`} />
    </span>
  );
}

function StatusBadge({ status }: { status: Monitor['status'] }) {
  const styles = {
    UP: 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20',
    DOWN: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
    PENDING: 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium font-mono ${styles[status]}`}>
      <StatusDot status={status} />
      {status}
    </span>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:border-slate-700">
      <div className="card-shine absolute inset-0 rounded-xl" />
      <p className="text-xs font-medium uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold font-mono tracking-tight ${color ?? 'text-slate-100'}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-600">{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const { data: monitors, isLoading } = useQuery<Monitor[]>({
    queryKey: ['monitors'],
    queryFn: async () => (await api.get<Monitor[]>('/monitors')).data,
    refetchInterval: 10000,
  });

  const { data: incidents } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: async () => (await api.get<Incident[]>('/incidents')).data,
    refetchInterval: 10000,
  });

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  const total = monitors?.length ?? 0;
  const upCount = monitors?.filter(m => m.status === 'UP').length ?? 0;
  const downCount = monitors?.filter(m => m.status === 'DOWN').length ?? 0;
  const pendingCount = monitors?.filter(m => m.status === 'PENDING').length ?? 0;
  const avgUptime = total > 0
    ? (monitors!.reduce((s, m) => s + (m.uptimePercent24h ?? 0), 0) / total).toFixed(2)
    : '—';
  const openIncidents = incidents?.filter(i => i.resolvedAt === null).length ?? 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Overview</h1>
          <p className="mt-0.5 text-sm text-slate-500">Real-time status across all monitors</p>
        </div>
        <Link
          href="/monitors/new"
          className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400 active:scale-95"
        >
          <Plus className="h-4 w-4" />
          Add Monitor
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total" value={total} sub="monitors" />
        <StatCard label="Online" value={upCount} sub="UP" color="text-green-400" />
        <StatCard label="Down" value={downCount} sub="DOWN" color="text-red-400" />
        <StatCard label="Pending" value={pendingCount} sub="checking" color="text-amber-400" />
        <StatCard label="Avg Uptime" value={avgUptime !== '—' ? `${avgUptime}%` : '—'} sub="last 24h" color="text-cyan-400" />
        <StatCard label="Incidents" value={openIncidents} sub="open now" color={openIncidents > 0 ? 'text-red-400' : 'text-slate-100'} />
      </div>

      {/* Monitor table */}
      {(!monitors || monitors.length === 0) ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-20 text-center">
          <Activity className="mb-4 h-10 w-10 text-slate-700" />
          <h3 className="text-base font-semibold text-slate-400">No monitors yet</h3>
          <p className="mt-1 mb-4 text-sm text-slate-600">Add your first monitor to start tracking uptime.</p>
          <Link
            href="/monitors/new"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-400"
          >
            Add Monitor
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
          {/* Table header */}
          <div className="border-b border-slate-800 px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Monitors — {total} total
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">URL</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Uptime 24h</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Last Check</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">Interval</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {monitors.map((monitor, i) => (
                <tr
                  key={monitor.id}
                  className="group transition-colors hover:bg-slate-800/30"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-4 py-3">
                    <Link href={`/monitors/${monitor.id}`} className="font-medium text-slate-200 hover:text-cyan-400 transition-colors">
                      {monitor.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-slate-500 max-w-xs">
                    <span className="flex items-center gap-1.5 font-mono text-xs">
                      <Globe className="h-3 w-3 shrink-0 text-slate-600" />
                      <span className="truncate max-w-[220px]">{monitor.url}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={monitor.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-sm text-slate-300">
                      {monitor.uptimePercent24h != null
                        ? <span className={monitor.uptimePercent24h >= 99 ? 'text-green-400' : monitor.uptimePercent24h >= 90 ? 'text-amber-400' : 'text-red-400'}>
                          {monitor.uptimePercent24h.toFixed(2)}%
                        </span>
                        : <span className="text-slate-600">—</span>
                      }
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {monitor.lastCheckedAt ? (
                      <span className="flex items-center gap-1 font-mono text-xs">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(monitor.lastCheckedAt)}
                      </span>
                    ) : <span className="text-slate-700">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">
                    {monitor.interval >= 60 ? `${monitor.interval / 60}m` : `${monitor.interval}s`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent open incident notice */}
      {openIncidents > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span><strong>{openIncidents}</strong> active incident{openIncidents > 1 ? 's' : ''} — </span>
          <Link href="/incidents" className="underline underline-offset-2 hover:text-red-300">View incidents →</Link>
        </div>
      )}
    </div>
  );
}
