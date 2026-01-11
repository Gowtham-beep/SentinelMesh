'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Monitor } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Plus, Trash2, Edit, Activity, Globe, Clock, Power } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function MonitorsPage() {
    const queryClient = useQueryClient();
    const { data: monitors, isLoading } = useQuery({
        queryKey: ['monitors'],
        queryFn: async () => {
            const res = await api.get<Monitor[]>('/monitors');
            return res.data;
        },
        refetchInterval: 10000, // No polling faster than 10s
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            await api.delete(`/monitors/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monitors'] });
        },
    });

    const toggleMutation = useMutation({
        mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
            await api.patch(`/monitors/${id}`, { enabled });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['monitors'] });
        }
    });

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this monitor?')) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return <div>Loading monitors...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Monitors</h1>
                <Button asChild>
                    <Link href="/monitors/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Monitor
                    </Link>
                </Button>
            </div>

            {(!monitors || monitors.length === 0) ? (
                <Card className="flex flex-col items-center justify-center p-12 text-center text-zinc-500">
                    <Activity className="mb-4 h-12 w-12 opacity-20" />
                    <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No monitors yet</h3>
                    <p className="mb-4 mt-2 max-w-sm text-sm">Create your first monitor to start tracking uptime.</p>
                    <Button asChild variant="outline">
                        <Link href="/monitors/new">Create Monitor</Link>
                    </Button>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {monitors.map((monitor) => (
                        <MonitorCard
                            key={monitor.id}
                            monitor={monitor}
                            onDelete={() => handleDelete(monitor.id)}
                            onToggle={(enabled) => toggleMutation.mutate({ id: monitor.id, enabled })}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function MonitorCard({ monitor, onDelete, onToggle }: { monitor: Monitor; onDelete: () => void; onToggle: (val: boolean) => void }) {
    // Determine status color
    // "Green -> healthy, Yellow -> degraded, Red -> incident"
    let statusColor = "bg-zinc-200 text-zinc-500";
    if (monitor.enabled) {
        if (monitor.currentStatus === 'UP') statusColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
        else if (monitor.currentStatus === 'DEGRADED') statusColor = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
        else if (monitor.currentStatus === 'DOWN') statusColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
    }

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-semibold">
                        <Link href={`/monitors/${monitor.id}`} className="hover:underline">
                            {monitor.name}
                        </Link>
                    </CardTitle>
                    <div className="flex items-center text-xs text-zinc-500">
                        <Globe className="mr-1 h-3 w-3" />
                        <span className="truncate max-w-[200px]">{monitor.url}</span>
                    </div>
                </div>
                <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", statusColor)}>
                    {monitor.enabled ? (monitor.currentStatus || 'UNKNOWN') : 'DISABLED'}
                </div>
            </CardHeader>
            <CardContent>
                <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
                    <div className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {monitor.interval}s interval
                    </div>
                    <div>
                        {/* Last Checked info could go here */}
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onToggle(!monitor.enabled)} title={monitor.enabled ? "Disable" : "Enable"}>
                        <Power className={cn("h-4 w-4", monitor.enabled ? "text-green-600" : "text-zinc-400")} />
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/monitors/${monitor.id}/edit`}>
                            <Edit className="h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
