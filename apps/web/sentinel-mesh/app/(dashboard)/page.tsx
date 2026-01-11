'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, AlertTriangle, CheckCircle, Smartphone } from 'lucide-react';
import { Loader2 } from 'lucide-react';

interface Monitor {
    id: string;
    name: string;
    url: string;
    status: 'active' | 'inactive'; // Assuming this means enabled/disabled? Or health?
    // Usually status in list might be health, but prompt says "List monitors (name, URL, interval, status)"
    // and "Clear status colors: Green -> healthy".
    // Let's assume there is a 'healthStatus' or similar, or I'll infer from check results if needed.
    // But prompt says "Frontend is read-only for monitoring data... Do NOT infer... backend is source of truth".
    // I'll assume the monitor object has a status field like 'OK' | 'ERROR' | 'DEGRADED'.
    lastCheck?: {
        status: 'OK' | 'ERROR';
        createdAt: string;
    };
}

interface Incident {
    id: string;
    status: 'OPEN' | 'RESOLVED';
}

export default function DashboardPage() {
    // Fetch Monitors to count total
    const { data: monitors, isLoading: monitorsLoading } = useQuery({
        queryKey: ['monitors'],
        queryFn: async () => {
            const res = await api.get<Monitor[]>('/monitors');
            return res.data;
        },
    });

    // Fetch Incidents to count active
    const { data: incidents, isLoading: incidentsLoading } = useQuery({
        queryKey: ['incidents'],
        queryFn: async () => {
            const res = await api.get<Incident[]>('/incidents');
            return res.data;
        },
    });

    if (monitorsLoading || incidentsLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
            </div>
        )
    }

    const totalMonitors = monitors?.length || 0;
    // Assuming incident status is exactly 'OPEN'
    const activeIncidents = incidents?.filter(i => i.status === 'OPEN').length || 0;
    const resolvedIncidents = incidents?.filter(i => i.status === 'RESOLVED').length || 0;

    // Last check time - logic: find the most recent check from monitors?
    // "Last check time (derived from backend)"
    // I'll assume monitors have a 'lastCheck' field.
    const lastCheckTime = monitors?.reduce((latest, current) => {
        if (!current.lastCheck?.createdAt) return latest;
        const currentTime = new Date(current.lastCheck.createdAt).getTime();
        return currentTime > latest ? currentTime : latest;
    }, 0);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Monitors</CardTitle>
                        <Activity className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalMonitors}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-400">{activeIncidents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Resolved Incidents</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{resolvedIncidents}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Last Check</CardTitle>
                        <Smartphone className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-medium text-zinc-500">
                            {lastCheckTime ? new Date(lastCheckTime).toLocaleTimeString() : 'N/A'}
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
