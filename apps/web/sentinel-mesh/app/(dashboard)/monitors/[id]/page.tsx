'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Monitor, CheckResult, MonitorStats, Incident } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, AlertTriangle, Globe, Loader2, Power, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function StatusDot({ status }: { status?: string }) {
  const colors: Record<string, string> = { UP: 'bg-green-400', DOWN: 'bg-red-400', PENDING: 'bg-amber-400' };
  const bg = colors[status ?? ''] ?? 'bg-slate-500';
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${status ? 'status-pulse' : ''} ${bg}`} />
      <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${bg}`} />
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
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-mono font-medium ${styles[label] ?? 'bg-slate-800 text-slate-400 ring-1 ring-slate-700'}`}>
      <StatusDot status={label} />
      {label}
    </span>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-slate-600">{label}</p>
      <p className={`mt-2 text-3xl font-bold font-mono ${accent ?? 'text-slate-100'}`}>{value}</p>
    </div>
  );
}

function UptimeBar({ checks }: { checks: CheckResult[] }) {
  const today = new Date();
  const days = Array.from({ length: 90 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (89 - i));
    return { date: d.toISOString().split('T')[0], up: 0, total: 0 };
  });
  for (const c of checks) {
    const key = c.checkedAt.split('T')[0];
    const b = days.find(d => d.date === key);
    if (b) { b.total++; if (c.status === 'UP') b.up++; }
  }
  return (
    <div className="space-y-3">
      <div className="flex gap-0.5">
        {days.map(d => {
          const r = d.total === 0 ? null : d.up / d.total;
          const bg = r === null ? 'bg-slate-800' : r === 1 ? 'bg-green-500' : r === 0 ? 'bg-red-500' : 'bg-amber-400';
          return <div key={d.date} title={`${d.date}: ${d.total === 0 ? 'No data' : `${d.up}/${d.total} UP`}`} className={`h-7 flex-1 rounded-sm ${bg} hover:opacity-70 transition-opacity`} />;
        })}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>90 days ago</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-green-500 inline-block" />Up</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-red-500 inline-block" />Down</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm bg-slate-700 inline-block" />No data</span>
        </div>
        <span>Today</span>
      </div>
    </div>
  );
}

const tooltipStyle = { fontSize: 12, borderRadius: 8, border: '1px solid #1e293b', background: '#0f172a', color: '#e2e8f0' };

export default function MonitorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: async (isActive: boolean) => {
      await api.patch(`/monitors/${id}`, { isActive });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['monitors', id] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/monitors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
      router.push('/monitors');
    },
  });

  const { data: monitor, isLoading } = useQuery<Monitor>({
    queryKey: ['monitors', id],
    queryFn: async () => (await api.get<Monitor>(`/monitors/${id}`)).data,
    refetchInterval: 10000,
  });

  const { data: stats } = useQuery<MonitorStats>({
    queryKey: ['monitors', id, 'stats'],
    queryFn: async () => (await api.get<MonitorStats>(`/monitors/${id}/stats`)).data,
    refetchInterval: 30000,
    retry: false,
  });

  const { data: checks } = useQuery<CheckResult[]>({
    queryKey: ['monitors', id, 'checks'],
    queryFn: async () => (await api.get<CheckResult[]>(`/monitors/${id}/checks?limit=100`)).data,
    refetchInterval: 10000,
    retry: false,
  });

  const { data: incidents } = useQuery<Incident[]>({
    queryKey: ['incidents'],
    queryFn: async () => (await api.get<Incident[]>('/incidents')).data,
    refetchInterval: 10000,
  });

  if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-cyan-500" /></div>;
  if (!monitor) return <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">Monitor not found.</div>;

  const sorted = (checks ?? []).slice().sort((a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime());
  const chartData = sorted.map(c => ({
    time: new Date(c.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    latency: c.latencyms,
  }));

  const latencies = sorted.map(c => c.latencyms).filter((x): x is number => x !== null);
  const minLatency = latencies.length ? Math.min(...latencies) : null;
  const maxLatency = latencies.length ? Math.max(...latencies) : null;
  const avgLatency = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : null;

  const activeIncident = (incidents ?? []).find(i => i.monitorId === id && i.status === 'OPEN');
  const recentChecks = sorted.slice().reverse().slice(0, 25);

  return (
    <div className="space-y-6 animate-fade-in">
      {activeIncident && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse" />
          <span><strong>Active Incident</strong> — started {new Date(activeIncident.openedAt).toLocaleString()}</span>
        </div>
      )}

      {/* Inactive warning */}
      {!monitor.isActive && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm text-amber-400">
          <Power className="h-4 w-4 shrink-0" />
          <span><strong>Monitor is inactive</strong> — checks are paused. Toggle to resume.</span>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/monitors"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold gradient-text">{monitor.name}</h1>
              <StatusBadge status={monitor.status} />
            </div>
            <a href={monitor.url} target="_blank" rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1.5 font-mono text-sm text-slate-500 hover:text-cyan-400 transition-colors">
              <Globe className="h-3.5 w-3.5" />{monitor.url}
            </a>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Active/Inactive toggle */}
          <button
            onClick={() => toggleMutation.mutate(!monitor.isActive)}
            disabled={toggleMutation.isPending}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${monitor.isActive ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            title={monitor.isActive ? 'Deactivate monitor' : 'Activate monitor'}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${monitor.isActive ? 'translate-x-6' : 'translate-x-1'
              }`} />
          </button>
          <span className={`text-xs font-medium ${monitor.isActive ? 'text-cyan-400' : 'text-slate-500'}`}>
            {monitor.isActive ? 'Active' : 'Inactive'}
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/monitors/${id}/edit`}><Edit className="mr-1.5 h-3.5 w-3.5" />Edit</Link>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this monitor? All associated checks, incidents, and alerts will be permanently removed.')) {
                deleteMutation.mutate();
              }
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
            Delete
          </Button>
        </div>
      </div>

      {/* Uptime stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Uptime 24h" value={stats?.uptime24h != null ? `${stats.uptime24h.toFixed(2)}%` : '—'} accent={stats?.uptime24h != null ? (stats.uptime24h >= 99 ? 'text-green-400' : stats.uptime24h >= 90 ? 'text-amber-400' : 'text-red-400') : undefined} />
        <StatCard label="Uptime 7d" value={stats?.uptime7d != null ? `${stats.uptime7d.toFixed(2)}%` : '—'} />
        <StatCard label="Uptime 30d" value={stats?.uptime30d != null ? `${stats.uptime30d.toFixed(2)}%` : '—'} />
      </div>

      {/* Latency cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Min Latency" value={minLatency != null ? `${minLatency}ms` : '—'} accent="text-cyan-400" />
        <StatCard label="Avg Latency" value={avgLatency != null ? `${avgLatency}ms` : '—'} accent="text-cyan-300" />
        <StatCard label="Max Latency" value={maxLatency != null ? `${maxLatency}ms` : '—'} accent="text-slate-400" />
      </div>

      {/* Response time chart */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-300">Response Time</p>
          <span className="text-xs text-slate-600 font-mono">last 100 checks</span>
        </div>
        {chartData.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-600">No check data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#475569' }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10, fill: '#475569' }} unit="ms" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => [`${v}ms`, 'Latency']} />
              <Area type="monotone" dataKey="latency" stroke="#06b6d4" strokeWidth={1.5} fill="url(#latencyGrad)" dot={false} connectNulls={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* 90-day bar */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="mb-4"><p className="text-sm font-semibold text-slate-300">90-Day Uptime</p></div>
        {checks ? <UptimeBar checks={checks} /> : <p className="text-sm text-slate-600">No data yet.</p>}
      </div>

      {/* Recent checks table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
        <div className="border-b border-slate-800 px-6 py-4">
          <p className="text-sm font-semibold text-slate-300">Recent Checks</p>
        </div>
        {recentChecks.length === 0 ? (
          <p className="px-6 py-8 text-center text-sm text-slate-600">No check history available.</p>
        ) : (
          <div className="overflow-y-auto max-h-[360px]" style={{ scrollbarWidth: 'thin', scrollbarColor: '#334155 transparent' }}>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60">
                  {['Timestamp', 'Status Code', 'Latency', 'Result'].map(h => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {recentChecks.map(c => (
                  <tr key={c.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs text-slate-400">{new Date(c.checkedAt).toLocaleString()}</td>
                    <td className="px-6 py-3 font-mono text-xs">
                      <span className={c.statusCode && c.statusCode < 400 ? 'text-green-400' : 'text-red-400'}>
                        {c.statusCode ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-3 font-mono text-xs text-cyan-400">
                      {c.latencyms != null ? `${c.latencyms}ms` : '—'}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-mono font-medium ${c.status === 'UP' ? 'bg-green-500/10 text-green-400 ring-1 ring-green-500/20' : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* V2 Roadmap */}
      <div className="border-t border-slate-800/60 pt-8 pb-2">
        <p className="text-xs font-mono font-medium uppercase tracking-widest text-slate-600 mb-5">What&apos;s coming in V2</p>
        <dl className="space-y-4">
          {[
            ['Multi-region verification', 'Checks from Frankfurt, Virginia, and Mumbai. Quorum-based confirmation before any alert fires.'],
            ['WhatsApp alerts', 'Get notified where you actually are.'],
            ['Status pages', 'A public URL your users can check themselves.'],
            ['Performance metrics', 'p50, p95, p99 response times per monitor.'],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-3">
              <span className="mt-0.5 shrink-0 font-mono text-xs text-slate-700">—</span>
              <div>
                <dt className="font-mono text-xs text-slate-500">{title}</dt>
                <dd className="mt-0.5 font-mono text-xs text-slate-700">{desc}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
