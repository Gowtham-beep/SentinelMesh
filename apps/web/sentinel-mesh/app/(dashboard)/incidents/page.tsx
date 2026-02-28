'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Incident, Monitor } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDuration } from '@/lib/utils';

export default function IncidentsPage() {
  const router = useRouter();
  const [monitorFilter, setMonitorFilter] = useState<string>('all');

  const { data: monitors } = useQuery<Monitor[]>({
    queryKey: ['monitors'],
    queryFn: async () => {
      const res = await api.get<Monitor[]>('/monitors');
      return res.data;
    },
  });

  const { data: incidents, isLoading, isError } = useQuery<Incident[]>({
    queryKey: ['incidents', monitorFilter],
    queryFn: async () => {
      const url = monitorFilter !== 'all'
        ? `/incidents?monitorId=${monitorFilter}`
        : '/incidents';
      const res = await api.get<Incident[]>(url);
      return res.data;
    },
    refetchInterval: 10000,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>
        {/* Filter by monitor */}
        <select
          className="h-9 rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
          value={monitorFilter}
          onChange={(e) => setMonitorFilter(e.target.value)}
        >
          <option value="all">All Monitors</option>
          {monitors?.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : isError ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          Failed to load incidents.
        </div>
      ) : !incidents || incidents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle className="mb-4 h-12 w-12 text-green-400" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">No incidents</h3>
            <p className="mt-2 text-sm text-zinc-500">All systems are operating normally.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Monitor</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Started</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Resolved</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Duration</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500">Alert Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
              {incidents.map((incident) => (
                <tr
                  key={incident.id}
                  onClick={() => router.push(`/monitors/${incident.monitorId}`)}
                  className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50">
                    <div className="flex items-center gap-2">
                      {incident.resolvedAt === null
                        ? <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                        : <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      }
                      {incident.monitorName}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {new Date(incident.startedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {incident.resolvedAt
                      ? new Date(incident.resolvedAt).toLocaleString()
                      : <span className="text-red-500 font-medium">Ongoing</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {formatDuration(incident.startedAt, incident.resolvedAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${incident.alertSent
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}>
                      {incident.alertSent ? 'Yes' : 'No'}
                    </span>
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
