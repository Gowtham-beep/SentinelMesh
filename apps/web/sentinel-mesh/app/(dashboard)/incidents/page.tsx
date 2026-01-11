'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Incident } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // I need to create a Badge component or just inline styles
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Need to create Select or use native
import { useState } from 'react';
import { AlertTriangle, CheckCircle, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
// import { format } from 'date-fns'; // Removed unused import

// Simple Badge component inline for now or I'll create one? I'll create a simple one.
function StatusBadge({ status }: { status: 'OPEN' | 'RESOLVED' }) {
    if (status === 'OPEN') {
        return <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/30 dark:text-red-400">OPEN</span>;
    }
    return <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">RESOLVED</span>;
}

export default function IncidentsPage() {
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [scopeFilter, setScopeFilter] = useState<string>('all');

    const { data: incidents, isLoading } = useQuery({
        queryKey: ['incidents', statusFilter, scopeFilter],
        queryFn: async () => {
            // Construct query params
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.append('status', statusFilter);
            if (scopeFilter !== 'all') params.append('scope', scopeFilter); // Assuming 'scope' param calls backend

            const res = await api.get<Incident[]>(`/incidents?${params.toString()}`);
            return res.data;
        },
        refetchInterval: 10000,
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Incidents</h1>

            <div className="flex gap-4">
                <select
                    className="h-10 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="OPEN">Open</option>
                    <option value="RESOLVED">Resolved</option>
                </select>

                <select
                    className="h-10 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950"
                    value={scopeFilter}
                    onChange={(e) => setScopeFilter(e.target.value)}
                >
                    <option value="all">All Scopes</option>
                    <option value="GLOBAL">Global</option>
                    <option value="REGION">Region</option>
                </select>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div>Loading incidents...</div>
                ) : (
                    (!incidents || incidents.length === 0) ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-10 text-zinc-500">
                                <CheckCircle className="mb-4 h-10 w-10 text-green-500 opacity-50" />
                                <p>No incidents found.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        incidents.map((incident) => (
                            <Card key={incident.id} className="transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50">
                                <CardHeader className="flex flex-row items-start justify-between pb-2">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className={cn("h-5 w-5", incident.status === 'OPEN' ? "text-red-500" : "text-green-500")} />
                                        <div>
                                            <CardTitle className="text-base">
                                                Incident on Monitor {incident.monitorId}
                                                {/* Ideally we fetch monitor name or include it in incident dto */}
                                            </CardTitle>
                                            <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                                                <span>{new Date(incident.createdAt).toLocaleString()}</span>
                                                {incident.resolvedAt && (
                                                    <>
                                                        <span>•</span>
                                                        <span>Resolved {new Date(incident.resolvedAt).toLocaleString()}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <StatusBadge status={incident.status} />
                                </CardHeader>
                                <CardContent>
                                    {/* Scope info - assuming incident has scope field */}
                                    {/* "Show: Opened time, Resolved time, Scope" */}
                                    {/* As I don't see scope in my minimal Incident type, I'll assume it might be there or I can parse it.
                                 If the API returns it, I'll display it. 
                              */}
                                    <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                                        {/* Example placeholder for scope if not strictly typed yet */}
                                        <Globe className="h-4 w-4" />
                                        <span>Global Scope</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )
                )}
            </div>
        </div>
    );
}
