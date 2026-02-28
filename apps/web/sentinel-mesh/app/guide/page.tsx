import Link from 'next/link';
import { ChevronRight, Activity, Bell, AlertTriangle, Shield, CheckCircle } from 'lucide-react';

export const metadata = {
    title: 'User Guide | SentinelMesh',
};

export default function GuidePage() {
    return (
        <div className="min-h-screen bg-slate-950 bg-dot-grid text-slate-200">
            {/* Nav */}
            <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-sm">
                <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
                    <Link href="/" className="font-mono text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-500/10 ring-1 ring-cyan-500/30">
                            <Shield className="h-3.5 w-3.5 text-cyan-400" />
                        </div>
                        SentinelMesh
                    </Link>
                    <Link
                        href="/login"
                        className="rounded-md border border-slate-700 bg-slate-800/30 px-4 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-slate-100"
                    >
                        Sign In
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-3xl px-6 py-16 animate-fade-in">
                <div className="mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-100 mb-4">
                        Getting Started with SentinelMesh
                    </h1>
                    <p className="text-slate-400 leading-relaxed">
                        SentinelMesh is a distributed uptime monitoring system built to eliminate false positives.
                        This guide will walk you through setting up your first monitor, configuring alerts, and understanding how incidents are tracked.
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Step 1 */}
                    <section>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 font-mono text-sm font-bold text-cyan-400 ring-1 ring-cyan-500/30">
                                1
                            </div>
                            <h2 className="text-xl font-semibold text-slate-200">Create a Monitor</h2>
                        </div>
                        <div className="ml-11 rounded-xl border border-slate-800/60 bg-slate-900/40 p-5 shadow-sm">
                            <p className="mb-4 text-sm text-slate-400 leading-relaxed">
                                A monitor defines the endpoint you want to check and the frequency of the checks.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                    <span>Navigate to the <strong>Monitors</strong> tab in your dashboard and click "New Monitor".</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                    <span>Enter the URL you want to track (e.g., <code>https://api.example.com/health</code>).</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                    <span>Choose a <strong>check interval</strong> (how often the scheduler will dispatch requests).</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Step 2 */}
                    <section>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 font-mono text-sm font-bold text-cyan-400 ring-1 ring-cyan-500/30">
                                2
                            </div>
                            <h2 className="text-xl font-semibold text-slate-200">Configure Alerts</h2>
                        </div>
                        <div className="ml-11 rounded-xl border border-slate-800/60 bg-slate-900/40 p-5 shadow-sm">
                            <p className="mb-4 text-sm text-slate-400 leading-relaxed">
                                Alerts ensure you're notified when your endpoint goes down, and when it comes back online.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-300">
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                    <span>While creating or editing a monitor, fill in the <strong>Alert Email</strong> field.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                    <span>When a global incident opens, you will receive exactly <strong>one</strong> email alert.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                    <span>When the monitor recovers and the incident resolves, you'll receive a resolution email.</span>
                                </li>
                            </ul>
                            <div className="mt-4 rounded border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs text-cyan-200/70">
                                <strong>Note:</strong> Alerts are state-based. SentinelMesh will never spam you with repeated emails during an ongoing outage.
                            </div>
                        </div>
                    </section>

                    {/* Step 3 */}
                    <section>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 font-mono text-sm font-bold text-cyan-400 ring-1 ring-cyan-500/30">
                                3
                            </div>
                            <h2 className="text-xl font-semibold text-slate-200">Understanding Incidents</h2>
                        </div>
                        <div className="ml-11 rounded-xl border border-slate-800/60 bg-slate-900/40 p-5 shadow-sm">
                            <p className="mb-4 text-sm text-slate-400 leading-relaxed">
                                SentinelMesh uses a multi-stage consensus algorithm to absolutely verify an outage before waking you up.
                            </p>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded border border-slate-700/50 bg-slate-800/20 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-yellow-500" />
                                        <h3 className="text-sm font-semibold text-slate-300">Regional Incident</h3>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-400">
                                        If 2 consecutive checks fail from a specific region (e.g., US), a REGIONAL incident opens. Alerts are <strong>not</strong> sent yet, as this could be an isolated routing issue.
                                    </p>
                                </div>
                                <div className="rounded border border-slate-700/50 bg-slate-800/20 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-500" />
                                        <h3 className="text-sm font-semibold text-slate-300">Global Incident</h3>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-400">
                                        If 2 or more regions confirm the outage simultaneously, a GLOBAL incident opens. <strong>This triggers your email alert</strong> and marks the monitor as officially DOWN.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="mt-16 flex justify-center border-t border-slate-800/60 pt-10">
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-8 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400"
                    >
                        Create Your First Monitor <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
