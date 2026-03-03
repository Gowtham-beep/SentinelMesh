'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import {
    AlertTriangle, CheckCircle, Zap, ChevronRight,
    Layers, Shield, GitBranch, ArrowRight, Database
} from 'lucide-react';

/* ─── Reusable: sticky nav ─────────────────────────────── */
function Nav() {
    return (
        <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-sm">
            <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
                <span className="font-mono text-sm font-semibold tracking-tight text-slate-100 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-cyan-500/10 ring-1 ring-cyan-500/30">
                        <Shield className="h-3.5 w-3.5 text-cyan-400" />
                    </div>
                    SentinelMesh
                </span>
                <Link
                    href="/login"
                    className="rounded-md border border-slate-700 bg-slate-800/30 px-4 py-1.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-600 hover:text-slate-100"
                >
                    Sign In
                </Link>
            </div>
        </header>
    );
}

/* ─── Hero ──────────────────────────────────────────────── */
function Hero() {
    return (
        <section className="mx-auto max-w-6xl px-6 pt-28 pb-24 relative">
            {/* Glow orb */}
            <div className="absolute left-1/4 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

            <div className="max-w-3xl relative z-10 animate-fade-in">
                {/* Tag */}
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs font-mono text-cyan-400">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500" />
                    </span>
                    All systems operational
                </div>

                <h1 className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
                    Uptime Monitoring<br />
                    <span className="gradient-text-cyan">
                        That Doesn't Lie
                    </span>
                </h1>

                <p className="mb-8 max-w-xl text-base leading-relaxed text-slate-400">
                    SentinelMesh uses multi-stage verification and distributed workers to eliminate false
                    positives — so you only get paged when something is actually down.
                </p>

                <div className="flex flex-wrap items-center gap-4 mb-12">
                    <Link
                        href="/guide"
                        className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400"
                    >
                        Get Started <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                    >
                        Sign In
                    </Link>
                    <a
                        href="https://github.com/Gowtham-beep/SentinelMesh"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-5 py-2.5 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                    >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        Star on GitHub
                    </a>
                </div>

                {/* Proof-in-a-Box */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-2xl backdrop-blur-sm sm:p-6">
                    <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-slate-700" />
                            <div className="h-3 w-3 rounded-full bg-slate-700" />
                            <div className="h-3 w-3 rounded-full bg-slate-700" />
                        </div>
                        <span className="font-mono text-xs text-slate-500">worker.ts</span>
                    </div>
                    <pre className="overflow-x-auto text-sm">
                        <code className="font-mono text-slate-300">
                            <span className="text-slate-500">{'// 1. Scheduler adds idempotent check (deduped by ID)'}</span>{'\n'}
                            <span className="text-cyan-400">await</span> monitorCheckQueue.<span className="text-emerald-400">add</span>({' '}{'\n'}
                            {'  '}<span className="text-amber-300">'check'</span>,{'\n'}
                            {'  '}{'{'} monitorId: <span className="text-amber-300">'app-123'</span>, url: <span className="text-amber-300">'https://api.example.com'</span> {'}'},{'\n'}
                            {'  '}{'{'} jobId: <span className="text-amber-300">'app-123-US-2023-10-25T10:00:00'</span> {'}'}{'\n'}
                            );{'\n'}
                            {'\n'}
                            <span className="text-slate-500">{'// 2. Worker executes check & appends to distributed ledger'}</span>{'\n'}
                            <span className="text-cyan-400">const</span> result = <span className="text-cyan-400">await</span> <span className="text-emerald-400">httpCheck</span>(url);{'\n'}
                            <span className="text-cyan-400">await</span> prisma.checkResult.<span className="text-emerald-400">create</span>({'{'} data: result {'}'});
                        </code>
                    </pre>
                </div>
            </div>
        </section>
    );
}

/* ─── Problem → Solution ────────────────────────────────── */
const problems = [
    {
        icon: AlertTriangle,
        problem: 'Single-point checks cry wolf',
        solution: 'Multi-stage verification before any alert',
    },
    {
        icon: Zap,
        problem: 'Cron scripts don\'t scale',
        solution: 'Distributed stateless workers via BullMQ / Redis',
    },
    {
        icon: Database,
        problem: 'Databases overwrite current status',
        solution: 'Append-only data integrity for forensic logs',
    },
    {
        icon: CheckCircle,
        problem: 'Alert spam burns teams out',
        solution: 'State-based alerting — only on transitions',
    },
];

function ProblemSolution() {
    return (
        <section className="border-t border-slate-800/60 bg-slate-900/30 py-20">
            <div className="mx-auto max-w-6xl px-6">
                <p className="mb-10 font-mono text-xs uppercase tracking-widest text-slate-500">
                    How it's different
                </p>
                <div className="grid gap-4 sm:grid-cols-3">
                    {problems.map(({ icon: Icon, problem, solution }) => (
                        <div
                            key={problem}
                            className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-6 transition-colors hover:border-slate-700"
                        >
                            <Icon className="mb-4 h-5 w-5 text-cyan-400" />
                            <p className="mb-3 text-xs font-mono text-slate-500 line-through decoration-slate-700">
                                {problem}
                            </p>
                            <p className="text-sm font-medium text-slate-200">{solution}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Architecture Pipeline ─────────────────────────────── */
const pipeline = [
    { label: 'Scheduler', desc: 'Per-monitor cadence,\nidempotent dispatch' },
    { label: 'Worker Nodes', desc: 'Stateless,\nhorizontally scalable' },
    { label: 'Check Results', desc: 'TimescaleDB\nappend-only log' },
    { label: 'Verifier', desc: 'State machine\nUP/DOWN transitions' },
    { label: 'Incident', desc: 'Created once,\nresolved on recovery' },
    { label: 'Alert', desc: 'Deduplicated,\nspam-proof notifications' },
];

function Architecture() {
    return (
        <section className="border-t border-slate-800/60 py-24 bg-slate-950">
            <div className="mx-auto max-w-6xl px-6">
                <p className="mb-2 font-mono text-xs uppercase tracking-widest text-slate-500">Architecture</p>
                <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-100">
                    Built like infrastructure, not a side project
                </h2>
                <p className="mb-14 text-sm text-slate-400">
                    A heavy-duty pipeline leveraging PostgreSQL + TimescaleDB for high-throughput time-series data. Every component is stateless, isolated, and replaceable.
                </p>

                {/* Pipeline */}
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <div className="flex min-w-max items-start gap-0">
                        {pipeline.map((node, i) => (
                            <div key={node.label} className="flex items-start">
                                {/* Node */}
                                <div className="flex flex-col items-center">
                                    <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-2 font-mono text-xs font-semibold text-cyan-400 whitespace-nowrap shadow-sm">
                                        {node.label}
                                    </div>
                                    <div className="mt-3 max-w-[110px] text-center font-mono text-[10px] leading-relaxed text-slate-500 whitespace-pre-line">
                                        {node.desc}
                                    </div>
                                </div>
                                {/* Arrow */}
                                {i < pipeline.length - 1 && (
                                    <div className="mt-2.5 flex items-center px-2 text-slate-700">
                                        <div className="h-px w-6 bg-slate-700" />
                                        <ChevronRight className="h-3 w-3 -ml-1" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail grid */}
                <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        { icon: Layers, title: 'BullMQ job queues', body: 'Jobs are deduplicated by ID before enqueue — the scheduler can tick as often as needed without creating duplicate checks.' },
                        { icon: Database, title: 'TimescaleDB persistence', body: 'We don\'t just update a "status" row. Every check is an immutable record, giving you a forensic audit trail of all anomalies at scale.' },
                        { icon: GitBranch, title: 'Multi-region consensus', body: 'A regional outage only becomes a GLOBAL incident after 2+ regions confirm DOWN — eliminating single-node false positives.' },
                        { icon: Shield, title: 'Transition-only alerts', body: 'Alerts fire exactly once when status changes: DOWN → incident opened, UP → incident resolved. No repeat noise.' },
                    ].map(({ icon: Icon, title, body }) => (
                        <div key={title} className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 shadow-sm">
                            <div className="mb-3 flex items-center gap-2">
                                <Icon className="h-4 w-4 text-cyan-400" />
                                <span className="text-sm font-semibold text-slate-200">{title}</span>
                            </div>
                            <p className="text-xs leading-relaxed text-slate-400">{body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Tech Stack ────────────────────────────────────────── */
const stack = ['Node.js', 'Fastify', 'BullMQ', 'Redis', 'PostgreSQL', 'TimescaleDB', 'Next.js', 'TypeScript', 'Prisma'];

function TechStrip() {
    return (
        <section className="border-t border-slate-800/60 bg-slate-900/30 py-10">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="font-mono text-xs text-slate-500">Built with —</span>
                    {stack.map((t, i) => (
                        <span key={t} className="font-mono text-xs text-slate-400">
                            {t}{i < stack.length - 1 && <span className="ml-6 text-slate-700">·</span>}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ─── Footer ────────────────────────────────────────────── */
function Footer() {
    return (
        <footer className="border-t border-slate-800/60 py-8 bg-slate-950">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
                <span className="font-mono text-xs text-slate-500 flex items-center gap-1.5"><Shield className="h-3 w-3" /> SentinelMesh</span>
                <span className="font-mono text-xs text-slate-600">
                    Built by <span className="text-slate-400">Gowtham N</span>
                </span>
            </div>
        </footer>
    );
}

/* ─── Page ──────────────────────────────────────────────── */
export default function LandingPage() {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) router.replace('/dashboard');
    }, [isAuthenticated, router]);

    if (isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-slate-950 bg-dot-grid">
            <Nav />
            <Hero />
            <ProblemSolution />
            <Architecture />
            <TechStrip />
            <Footer />
        </div>
    );
}
