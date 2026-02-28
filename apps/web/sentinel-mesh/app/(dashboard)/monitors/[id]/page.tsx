'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Monitor, CheckResult, MonitorStats, Incident } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, AlertTriangle, Globe } from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

function StatusBadge({ status }: { status: Monitor['status'] }) {
  const map: Record<Monitor['status'], string> = {
    UP: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    DOWN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    PENDING: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
}

function UptimeBar({ checks }: { checks: CheckResult[] }) {
  // Build a day-bucket map for last 90 days
  const today = new Date();
  const days: Array<{ date: string; up: number; total: number }> = [];

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    days.push({ date: key, up: 0, total: 0 });
  }

  for (const check of checks) {
    const key = check.checkedAt.split('T')[0];
    const bucket = days.find((d) => d.date === key);
    if (bucket) {
      bucket.total++;
      if (check.result === 'UP') bucket.up++;
    }
  }

  return (
    <div className="flex gap-px">
      {days.map((day) => {
        const ratio = day.total === 0 ? null : day.up / day.total;
        const color =
          ratio === null
            ? 'bg-zinc-200 dark:bg-zinc-700'
            : ratio === 1
              ? 'bg-green-500'
              : ratio === 0
                ? 'bg-red-500'
                : 'bg-yellow-400';
        return (
          <div
            key={day.date}
            title={`${day.date}: ${day.total === 0 ? 'No data' : `${day.up}/${day.total} UP`}`}
            className={`h-6 flex-1 rounded-sm ${color}`}
          />
        );
      })}
    </div>
  );
}

export default function MonitorDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: monitor, isLoading: monitorLoading } = useQuery<Monitor>({
    queryKey: ['monitors', id],
    queryFn: async () => {
      const res = await api.get<Monitor>(`/monitors/${id}`);
      return res.data;
    },
    refetchInterval: 10000,
  });

  const { data: stats } = useQuery<MonitorStats>({
    queryKey: ['monitors', id, 'stats'],
    queryFn: async () => {
      const res = await api.get<MonitorStats>(`/monitors/${id}/stats`);
      return res.data;
    },
    refetchInterval: 30000,
  });

  const { data: checks } = useQuery<CheckResult[]>({
    queryKey: ['monitors', id, 'checks'],
    queryFn: async () => {
      const res = await api.get<CheckResult[]>(`/monitors/${id}/checks?limit=100`);
      return res.data;
    },
    refetchInterval: 10000,
    retry: false,
  });

  const { data: incidents } = useQuery<Incident[]>({
    queryKey: ['incidents', { monitorId: id }],
    queryFn: async () => {
      const res = await api.get<Incident[]>(`/incidents?monitorId=${id}`);
      return res.data;
    },
    refetchInterval: 10000,
  });

  if (monitorLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!monitor) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
        Monitor not found.
      </div>
    );
  }

  // Build chart data: latest 100 checks sorted by time, map to { time, latency }
  const chartData = (checks ?? [])
    .slice()
    .sort((a, b) => new Date(a.checkedAt).getTime() - new Date(b.checkedAt).getTime())
    .map((c) => ({
      time: new Date(c.checkedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latency: c.latencyMs,
    }));

  const activeIncident = incidents?.find((i) => i.resolvedAt === null);
  const recentChecks = (checks ?? [])
    .slice()
    .sort((a, b) => new Date(b.checkedAt).getTime() - new Date(a.checkedAt).getTime())
    .slice(0, 20);

  return (
    <div className="space-y-6">
      {/* Active incident banner */}
      {activeIncident && (
        <div className="flex items-center gap-3 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            <strong>Ongoing incident</strong> — started{' '}
            {new Date(activeIncident.startedAt).toLocaleString()}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/monitors"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">{monitor.name}</h1>
              <StatusBadge status={monitor.status} />
            </div>
            <a
              href={monitor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-sm text-blue-500 hover:underline"
            >
              <Globe className="h-3.5 w-3.5" />
              {monitor.url}
            </a>
          </div>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/monitors/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      {/* Uptime stat cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Uptime (24h)', value: stats?.uptime24h },
          { label: 'Uptime (7d)', value: stats?.uptime7d },
          { label: 'Uptime (30d)', value: stats?.uptime30d },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {value != null ? `${value.toFixed(2)}%` : '—'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Response time chart */}
      <Card>
        <CardHeader>
          <CardTitle>Response Time (last 100 checks)</CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length === 0 ? (
            <p className="text-sm text-zinc-500">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 11, fill: '#71717a' }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#71717a' }}
                  unit="ms"
                />
                <Tooltip
                  formatter={(val: any) => [`${val}ms`, 'Latency']}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 6,
                    border: '1px solid #e4e4e7',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke="#18181b"
                  strokeWidth={1.5}
                  dot={false}
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 90-day uptime bar */}
      <Card>
        <CardHeader>
          <CardTitle>90-Day Uptime</CardTitle>
        </CardHeader>
        <CardContent>
          {checks ? (
            <>
              <UptimeBar checks={checks} />
              <div className="mt-2 flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-green-500" /> Up
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-red-500" /> Down
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm bg-zinc-200 dark:bg-zinc-700" /> No data
                </span>
                <span className="ml-auto">90 days ago → today</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-zinc-500">No data yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Recent checks table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Checks</CardTitle>
        </CardHeader>
        <CardContent>
          {recentChecks.length === 0 ? (
            <p className="text-sm text-zinc-500">No check history available.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="pb-2 text-left font-medium text-zinc-500">Timestamp</th>
                    <th className="pb-2 text-left font-medium text-zinc-500">Status Code</th>
                    <th className="pb-2 text-left font-medium text-zinc-500">Latency</th>
                    <th className="pb-2 text-left font-medium text-zinc-500">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                  {recentChecks.map((check) => (
                    <tr key={check.id}>
                      <td className="py-2 text-zinc-600 dark:text-zinc-400">
                        {new Date(check.checkedAt).toLocaleString()}
                      </td>
                      <td className="py-2 text-zinc-600 dark:text-zinc-400">
                        {check.statusCode ?? '—'}
                      </td>
                      <td className="py-2 text-zinc-600 dark:text-zinc-400">
                        {check.latencyMs != null ? `${check.latencyMs}ms` : '—'}
                      </td>
                      <td className="py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${check.result === 'UP'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                            }`}
                        >
                          {check.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
