'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Shield, ArrowRight, ChevronRight, Check, X } from 'lucide-react';

/* ─── Nav ───────────────────────────────────────────────── */
function Nav() {
    const { isAuthenticated } = useAuth();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <span className="font-mono text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-500/10 ring-1 ring-cyan-500/30">
                        <Shield className="h-3.5 w-3.5 text-cyan-400" />
                    </div>
                    SentinelMesh
                </span>
                <div className="min-w-[100px] flex justify-end">
                    {mounted ? (
                        <Link
                            href={isAuthenticated ? "/dashboard" : "/login"}
                            className="rounded-md border border-slate-700 bg-slate-800/30 px-4 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-slate-100"
                        >
                            {isAuthenticated ? "Dashboard" : "Sign In"}
                        </Link>
                    ) : (
                        <div className="h-8 w-20 rounded-md border border-slate-700 bg-slate-800/10" />
                    )}
                </div>
            </div>
        </header>
    );
}

/* ─── Hero ──────────────────────────────────────────────── */
function Hero() {
    const { isAuthenticated } = useAuth();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <section className="relative mx-auto max-w-6xl px-6 pt-32 pb-28">
            {/* Glow orbs */}
            <div className="pointer-events-none absolute left-1/3 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/8 blur-3xl" />
            <div className="pointer-events-none absolute right-1/4 top-20 h-64 w-64 rounded-full bg-violet-500/5 blur-3xl" />

            <div className="relative z-10 max-w-3xl animate-fade-in">
                {/* Status pill */}
                <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/25 bg-emerald-500/8 px-4 py-1.5">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    </span>
                    <span className="font-mono text-xs font-medium text-emerald-400 tracking-wide">
                        All systems operational
                    </span>
                </div>

                {/* Headline */}
                <h1 className="mb-6 text-5xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
                    Monitoring You Can{' '}
                    <span className="gradient-text-cyan">Actually Trust</span>
                </h1>

                {/* Subheadline */}
                <p className="mb-10 max-w-2xl text-lg leading-relaxed text-slate-400">
                    Most monitoring tools page you for blips. SentinelMesh uses multi-stage verification
                    and distributed workers to confirm downtime before waking anyone up — eliminating
                    false positives without missing real outages.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-4">
                    <Link
                        href={mounted && isAuthenticated ? "/dashboard" : "/guide"}
                        className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                        {mounted && isAuthenticated ? "Go to Dashboard" : "Get Started"} <ArrowRight className="h-4 w-4" />
                    </Link>
                    {(!mounted || !isAuthenticated) && (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-6 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                        >
                            Sign In
                        </Link>
                    )}
                </div>

                {/* V2 Note */}
                <div className="mt-12 inline-flex items-center gap-3 rounded-full border border-violet-500/20 bg-violet-500/5 px-4 py-2 text-sm font-medium text-violet-300/90 shadow-sm backdrop-blur-md">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-bold text-violet-400 ring-1 ring-violet-500/40">V2</span>
                    Coming soon: Multi-region quorum, WhatsApp alerts, and public status pages.
                </div>
            </div>
        </section>
    );
}

/* ─── Section 2 — Real Pain, Real Fix ───────────────────── */
const painFixRows = [
    {
        problem: 'False positives wake you at 3 AM',
        solution: 'Multi-stage verification before any alert fires',
    },
    {
        problem: 'Real outages get missed',
        solution: 'Consecutive failure threshold — not a single blip',
    },
    {
        problem: 'Alert spam burns teams out',
        solution: 'State-based alerting — only on UP→DOWN transitions',
    },
    {
        problem: "Your current tool can't scale",
        solution: 'Distributed stateless workers, horizontally scalable',
    },
];

function PainFix() {
    return (
        <section className="border-t border-slate-800/60 bg-slate-900/25 py-24">
            <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-0 sm:grid-cols-2 rounded-2xl border border-slate-800/80 overflow-hidden shadow-2xl">
                    {/* Left header */}
                    <div className="border-b border-slate-800/80 bg-rose-950/20 px-8 py-5">
                        <p className="font-mono text-sm font-semibold uppercase tracking-widest text-rose-400/80">
                            The problem
                        </p>
                    </div>
                    {/* Right header */}
                    <div className="border-b border-slate-800/80 bg-cyan-950/20 px-8 py-5 sm:border-l">
                        <p className="font-mono text-sm font-semibold uppercase tracking-widest text-cyan-400/80">
                            SentinelMesh
                        </p>
                    </div>

                    {/* Rows */}
                    {painFixRows.map(({ problem, solution }, i) => (
                        <React.Fragment key={i}>
                            {/* Problem cell */}
                            <div
                                className={`flex items-start gap-3 px-8 py-5 bg-slate-950/40 ${i < painFixRows.length - 1 ? 'border-b border-slate-800/60' : ''}`}
                            >
                                <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500/70" />
                                <p className="text-sm text-slate-400 leading-relaxed">{problem}</p>
                            </div>
                            {/* Solution cell */}
                            <div
                                className={`flex items-start gap-3 px-8 py-5 bg-slate-950/20 sm:border-l border-slate-800/60 ${i < painFixRows.length - 1 ? 'border-b border-slate-800/60' : ''}`}
                            >
                                <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                <p className="text-sm text-slate-200 font-medium leading-relaxed">{solution}</p>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Section 3 — Architecture Pipeline ─────────────────── */
const pipeline = [
    { label: 'Scheduler', desc: 'Idempotent dispatch, per-monitor cadence' },
    { label: 'Worker Nodes', desc: 'Stateless, horizontally scalable' },
    { label: 'Check Results', desc: 'Append-only, immutable log' },
    { label: 'Verifier', desc: 'State machine, confirms before acting' },
    { label: 'Incident', desc: 'Created once, resolved on recovery' },
    { label: 'Alert', desc: 'Deduplicated, transition-only, spam-proof' },
];

function Architecture() {
    return (
        <section className="border-t border-slate-800/60 py-24 bg-slate-950">
            <div className="mx-auto max-w-6xl px-6">
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
                    Architecture
                </p>
                <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-100">
                    Built like infrastructure, not a side project
                </h2>
                <p className="mb-16 text-base text-slate-400 max-w-xl">
                    Every component has one job. Nothing overlaps.
                </p>

                {/* Pipeline */}
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <div className="flex min-w-max items-start gap-0">
                        {pipeline.map((node, i) => (
                            <div key={node.label} className="flex items-start">
                                {/* Node */}
                                <div className="flex flex-col items-center">
                                    <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/8 ring-1 ring-cyan-500/10 px-5 py-3 font-mono text-sm font-semibold text-cyan-300 whitespace-nowrap shadow-sm hover:border-cyan-500/50 transition-colors">
                                        {node.label}
                                    </div>
                                    <div className="mt-3 max-w-[120px] text-center font-mono text-[11px] leading-relaxed text-slate-500">
                                        {node.desc}
                                    </div>
                                </div>
                                {/* Arrow connector */}
                                {i < pipeline.length - 1 && (
                                    <div className="mt-3.5 flex items-center px-2 text-slate-700">
                                        <div className="h-px w-8 bg-gradient-to-r from-slate-700 to-slate-600" />
                                        <ChevronRight className="h-3.5 w-3.5 -ml-1 text-slate-600" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ─── Section 4 — Comparison Table ──────────────────────── */
type CompareValue = boolean | 'Partial';

const compareRows: { feature: string; uptimeRobot: CompareValue; uptimeKuma: CompareValue; sentinel: CompareValue }[] = [
    { feature: 'Multi-stage verification', uptimeRobot: false, uptimeKuma: false, sentinel: true },
    { feature: 'Distributed workers', uptimeRobot: false, uptimeKuma: false, sentinel: true },
    { feature: 'False positive protection', uptimeRobot: 'Partial', uptimeKuma: 'Partial', sentinel: true },
    { feature: 'Self-hostable', uptimeRobot: false, uptimeKuma: true, sentinel: true },
    { feature: 'Built for scale', uptimeRobot: false, uptimeKuma: false, sentinel: true },
];

function CompareCell({ value }: { value: CompareValue }) {
    if (value === true)
        return (
            <div className="flex justify-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15 ring-1 ring-cyan-500/30">
                    <Check className="h-3.5 w-3.5 text-cyan-400" />
                </div>
            </div>
        );
    if (value === false)
        return (
            <div className="flex justify-center">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800/60">
                    <X className="h-3.5 w-3.5 text-slate-600" />
                </div>
            </div>
        );
    return (
        <div className="flex justify-center">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-amber-400">
                Partial
            </span>
        </div>
    );
}

function CompareTable() {
    return (
        <section className="border-t border-slate-800/60 bg-slate-900/25 py-24">
            <div className="mx-auto max-w-5xl px-6">
                <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
                    Comparison
                </p>
                <h2 className="mb-12 text-3xl font-bold tracking-tight text-slate-100">
                    How it compares
                </h2>

                <div className="overflow-hidden rounded-2xl border border-slate-800/80 shadow-2xl">
                    {/* Header row */}
                    <div className="grid grid-cols-4 border-b border-slate-800/60 bg-slate-900/60">
                        <div className="px-6 py-4" />
                        <div className="px-4 py-4 text-center">
                            <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                UptimeRobot
                            </span>
                        </div>
                        <div className="px-4 py-4 text-center">
                            <span className="font-mono text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                Uptime Kuma
                            </span>
                        </div>
                        <div className="px-4 py-4 text-center bg-cyan-500/4 border-l border-cyan-500/15">
                            <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                                SentinelMesh
                            </span>
                        </div>
                    </div>

                    {/* Data rows */}
                    {compareRows.map(({ feature, uptimeRobot, uptimeKuma, sentinel }, i) => (
                        <div
                            key={feature}
                            className={`grid grid-cols-4 ${i < compareRows.length - 1 ? 'border-b border-slate-800/40' : ''} hover:bg-slate-900/30 transition-colors`}
                        >
                            <div className="flex items-center px-6 py-4">
                                <span className="text-sm font-medium text-slate-300">{feature}</span>
                            </div>
                            <div className="flex items-center justify-center px-4 py-4">
                                <CompareCell value={uptimeRobot} />
                            </div>
                            <div className="flex items-center justify-center px-4 py-4">
                                <CompareCell value={uptimeKuma} />
                            </div>
                            <div className="flex items-center justify-center px-4 py-4 bg-cyan-500/3 border-l border-cyan-500/10">
                                <CompareCell value={sentinel} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Section 5 — Tech Stack ─────────────────────────────── */
const stack = ['Node.js', 'Fastify', 'BullMQ', 'Redis', 'PostgreSQL', 'TimescaleDB', 'Next.js', 'TypeScript'];

function TechStrip() {
    return (
        <section className="border-t border-slate-800/60 bg-slate-950 py-10">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
                    <span className="font-mono text-xs text-slate-500">Built with —</span>
                    {stack.map((t, i) => (
                        <span key={t} className="font-mono text-xs text-slate-400">
                            {t}
                            {i < stack.length - 1 && <span className="mx-2 text-slate-700">·</span>}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Footer ─────────────────────────────────────────────── */
function Footer() {
    return (
        <footer className="border-t border-slate-800/60 py-8 bg-slate-950">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                <span className="font-mono text-xs text-slate-500 flex items-center gap-1.5">
                    <Shield className="h-3 w-3" /> SentinelMesh
                </span>
                <span className="font-mono text-xs text-slate-600">
                    Built by <span className="text-slate-400">Gowtham N</span>
                </span>
            </div>
        </footer>
    );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-950 bg-dot-grid">
            <Nav />
            <Hero />
            <PainFix />
            <Architecture />
            <CompareTable />
            <TechStrip />
            <Footer />
        </div>
    );
}
