'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { Monitor, Incident } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function MonitorDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const { data: monitor, isLoading: monitorLoading } = useQuery({
        queryKey: ['monitors', id],
        queryFn: async () => {
            const res = await api.get<Monitor>(`/monitors/${id}`);
            return res.data;
        },
        refetchInterval: 10000,
    });

    // TODO: Verify endpoint for incidents by monitor. Assuming GET /incidents?monitorId=..., filtering locally if needed
    // Prompt says "Incidents Page... Filter by OPEN/RESOLVED... Region / Global".
    // It doesn't explicitly say we can filter by monitor ID on the main list, but Monitor Detail Page needs "Incident history".
    // I will try to fetch all and filter or guess the API supports query params.
    const { data: incidents, isLoading: incidentsLoading } = useQuery({
        queryKey: ['incidents', id],
        queryFn: async () => {
            // Assuming API supports filtering or we pull all. Since "Backend follows strict architectural boundaries", usually it supports query params.
            // If not, I'll fetch /incidents and filtered client side. Optimistic approach:
            const res = await api.get<Incident[]>('/incidents');
            return res.data.filter(i => i.monitorId === id);
        },
        refetchInterval: 10000,
    });

    // For Check Results, prompt says "Recent check results (read-only)".
    // Assuming /monitors/:id/checks or similar.
    // I'll try /monitors/:id/checks. If 404, I'll handle gracefully.
    const { data: checks } = useQuery({
        queryKey: ['checks', id],
        queryFn: async () => {
            const res = await api.get<any[]>(`/monitors/${id}/checks`);
            return res.data;
        },
        retry: false, // Don't retry if endpoint doesn't exist
    });


    if (monitorLoading) return <div>Loading monitor...</div>;
    if (!monitor) return <div>Monitor not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/monitors"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold tracking-tight">{monitor.name}</h1>
                    <a href={monitor.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">{monitor.url}</a>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-500">Status</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            {monitor.currentStatus === 'UP' ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                            <span className="text-xl font-bold">{monitor.currentStatus || 'UNKNOWN'}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-500">Interval</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <Clock className="text-zinc-500" />
                            <span className="text-xl font-bold">{monitor.interval}s</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-zinc-500">Recent Uptime</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-sm text-zinc-500">Calculated on backend</div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Checks */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Checks</CardTitle>
                </CardHeader>
                <CardContent>
                    {!checks || checks.length === 0 ? (
                        <p className="text-sm text-zinc-500">No check history available.</p>
                    ) : (
                        <div className="space-y-2">
                            {checks.slice(0, 10).map((check: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between border-b border-zinc-100 py-2 last:border-0 dark:border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <div className={cn("h-2 w-2 rounded-full", check.status === 'UP' ? "bg-green-500" : "bg-red-500")} />
                                        <span className="text-sm font-medium">{check.status}</span>
                                    </div>
                                    <span className="text-xs text-zinc-400">{new Date(check.createdAt).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Incidents */}
            <Card>
                <CardHeader>
                    <CardTitle>Incident History</CardTitle>
                </CardHeader>
                <CardContent>
                    {incidentsLoading ? <div>Loading incidents...</div> : (
                        !incidents || incidents.length === 0 ? (
                            <p className="text-sm text-zinc-500">No incidents recorded.</p>
                        ) : (
                            <div className="space-y-4">
                                {incidents.map((incident) => (
                                    <div key={incident.id} className="flex items-center justify-between rounded-md border p-3 border-zinc-200 dark:border-zinc-800">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className={cn("h-5 w-5", incident.status === 'OPEN' ? "text-red-500" : "text-green-500")} />
                                            <div>
                                                <p className="text-sm font-medium">{incident.status} Incident</p>
                                                <p className="text-xs text-zinc-500">Started: {new Date(incident.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        {incident.resolvedAt && (
                                            <div className="text-right text-xs text-zinc-500">
                                                Resolved: {new Date(incident.resolvedAt).toLocaleString()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
