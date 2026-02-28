'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Monitor } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, Trash2, Edit, Activity, Globe, Clock } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

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

export default function MonitorsPage() {
  const queryClient = useQueryClient();

  const { data: monitors, isLoading, isError } = useQuery<Monitor[]>({
    queryKey: ['monitors'],
    queryFn: async () => {
      const res = await api.get<Monitor[]>('/monitors');
      return res.data;
    },
    refetchInterval: 10000,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/monitors/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monitors'] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this monitor?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
        Failed to load monitors. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Monitors</h1>
        <Button asChild>
          <Link href="/monitors/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Monitor
          </Link>
        </Button>
      </div>

      {(!monitors || monitors.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="mb-4 h-12 w-12 text-zinc-300 dark:text-zinc-600" />
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">No monitors yet</h3>
            <p className="mt-2 mb-4 max-w-sm text-sm text-zinc-500">
              Create your first monitor to start tracking uptime.
            </p>
            <Button asChild variant="outline">
              <Link href="/monitors/new">Add Monitor</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Name</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">URL</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Status</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Uptime (24h)</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-500 dark:text-zinc-400">Last Checked</th>
                <th className="px-4 py-3 text-right font-medium text-zinc-500 dark:text-zinc-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950">
              {monitors.map((monitor) => (
                <tr key={monitor.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`/monitors/${monitor.id}`} className="hover:underline text-zinc-900 dark:text-zinc-50">
                      {monitor.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 max-w-xs">
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate max-w-[200px]">{monitor.url}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={monitor.status} />
                  </td>
                  <td className="px-4 py-3 text-zinc-600 dark:text-zinc-400">
                    {monitor.uptimePercent24h != null
                      ? `${monitor.uptimePercent24h.toFixed(2)}%`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-zinc-500">
                    {monitor.lastCheckedAt ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {formatDistanceToNow(monitor.lastCheckedAt)}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/monitors/${monitor.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(monitor.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
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
