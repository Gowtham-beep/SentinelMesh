import Link from 'next/link';
import {
    Shield, ChevronRight, CheckCircle, Activity, AlertTriangle,
    Bell, BarChart2, Users, ArrowRight, Info,
} from 'lucide-react';

export const metadata = {
    title: 'Get Started | SentinelMesh',
    description: 'Step-by-step guide to set up uptime monitoring with SentinelMesh.',
};

/* ─── Reusable step number badge ──────────────── */
function StepBadge({ n }: { n: number }) {
    return (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 font-mono text-sm font-bold text-cyan-400 ring-1 ring-cyan-500/30">
            {n}
        </div>
    );
}

/* ─── Terminal block ───────────────────────────── */
function Terminal({ lines }: { lines: string[] }) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 shadow-lg">
            <div className="flex items-center gap-1.5 border-b border-slate-800 bg-slate-900/60 px-4 py-2.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/50" />
                <span className="h-3 w-3 rounded-full bg-amber-500/50" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/50" />
                <span className="ml-3 font-mono text-xs text-slate-500">terminal</span>
            </div>
            <div className="p-4">
                {lines.map((line, i) => (
                    <div key={i} className="font-mono text-sm leading-7">
                        {line.startsWith('#') ? (
                            <span className="text-slate-600">{line}</span>
                        ) : line.startsWith('$') ? (
                            <span>
                                <span className="text-cyan-500 select-none">$ </span>
                                <span className="text-slate-200">{line.slice(2)}</span>
                            </span>
                        ) : (
                            <span className="text-slate-400">{line}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Info callout ─────────────────────────────── */
function Callout({ children, variant = 'info' }: { children: React.ReactNode; variant?: 'info' | 'warn' | 'tip' }) {
    const styles = {
        info: 'border-cyan-500/20 bg-cyan-500/6 text-cyan-200/80',
        warn: 'border-amber-500/25 bg-amber-500/8 text-amber-200/80',
        tip: 'border-emerald-500/20 bg-emerald-500/6 text-emerald-200/80',
    };
    const icons = {
        info: <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />,
        warn: <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />,
        tip: <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />,
    };
    return (
        <div className={`mt-4 flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${styles[variant]}`}>
            {icons[variant]}
            <div>{children}</div>
        </div>
    );
}

/* ─── Pipeline mini (inline) ───────────────────── */
const pipelineNodes = ['Scheduler', 'Worker', 'Check Result', 'Verifier', 'Incident', 'Alert'];

function MiniPipeline() {
    return (
        <div className="mt-5 overflow-x-auto pb-2">
            <div className="flex min-w-max items-center gap-0">
                {pipelineNodes.map((n, i) => (
                    <div key={n} className="flex items-center">
                        <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/8 px-3 py-1.5 font-mono text-xs font-semibold text-cyan-300 whitespace-nowrap">
                            {n}
                        </div>
                        {i < pipelineNodes.length - 1 && (
                            <div className="flex items-center px-1.5">
                                <div className="h-px w-4 bg-slate-700" />
                                <ChevronRight className="h-3 w-3 -ml-1 text-slate-600" />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Main ──────────────────────────────────────── */
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

            <main className="mx-auto max-w-3xl px-6 py-16">
                {/* Page header */}
                <div className="mb-14 animate-fade-in">
                    <p className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">Get Started</p>
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-100">
                        From zero to monitored in minutes
                    </h1>
                    <p className="text-base leading-relaxed text-slate-400 max-w-xl">
                        Follow this guide to create an account, add your first monitor, understand how SentinelMesh
                        verifies incidents, and configure your alerts — no noise, no spam.
                    </p>

                    {/* Quick-jump index */}
                    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {[
                            { href: '#create-account', label: '1. Create an account', icon: Users },
                            { href: '#add-monitor', label: '2. Add a monitor', icon: Activity },
                            { href: '#verification', label: '3. How verification works', icon: Shield },
                            { href: '#alerts', label: '4. Configure alerts', icon: Bell },
                            { href: '#dashboard', label: '5. Read your dashboard', icon: BarChart2 },
                            { href: '#architecture', label: '6. Architecture overview', icon: ChevronRight },
                        ].map(({ href, label, icon: Icon }) => (
                            <a
                                key={href}
                                href={href}
                                className="flex items-center gap-2.5 rounded-lg border border-slate-800/80 bg-slate-900/40 px-4 py-3 text-xs font-medium text-slate-400 transition-all hover:border-slate-700 hover:text-slate-200 hover:bg-slate-800/30"
                            >
                                <Icon className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                                {label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* ── STEP 1: Create Account ── */}
                <div className="space-y-14">
                    <section id="create-account">
                        <div className="mb-5 flex items-center gap-3">
                            <StepBadge n={1} />
                            <h2 className="text-xl font-semibold text-slate-100">Create an account</h2>
                        </div>
                        <div className="ml-12 space-y-4">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                SentinelMesh is self-hostable. If your team manages its own deployment, you'll receive
                                an invite link. Otherwise, sign up on the platform hosted by your admin.
                            </p>
                            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-3">
                                {[
                                    'Navigate to /signup on your SentinelMesh instance.',
                                    'Enter your name, email, and a strong password.',
                                    'Submit the form — you\'ll be redirected to your dashboard immediately.',
                                ].map((step, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm">
                                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                        <span className="text-slate-300">{step}</span>
                                    </div>
                                ))}
                            </div>
                            <Callout variant="tip">
                                Already have an account? Head to{' '}
                                <Link href="/login" className="underline underline-offset-2">
                                    /login
                                </Link>{' '}
                                and you'll be redirected to your dashboard automatically.
                            </Callout>
                        </div>
                    </section>

                    {/* ── STEP 2: Add Monitor ── */}
                    <section id="add-monitor">
                        <div className="mb-5 flex items-center gap-3">
                            <StepBadge n={2} />
                            <h2 className="text-xl font-semibold text-slate-100">Add your first monitor</h2>
                        </div>
                        <div className="ml-12 space-y-4">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                A monitor defines the endpoint to check, how often to check it, and who to notify.
                                Every monitor runs on its own cadence and produces an independent stream of check results.
                            </p>
                            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-3">
                                {[
                                    { label: 'From your dashboard, click "New Monitor".', detail: null },
                                    {
                                        label: 'Enter the URL you want to watch.',
                                        detail: 'Use your health-check endpoint (e.g. /health or /ping) for the most reliable signal.',
                                    },
                                    { label: 'Set a check interval — e.g. every 1 minute.', detail: null },
                                    { label: 'Add your alert email (Step 4 covers this in detail).', detail: null },
                                    { label: 'Save. The scheduler picks it up within seconds.', detail: null },
                                ].map(({ label, detail }, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                        <div>
                                            <p className="text-sm text-slate-300">{label}</p>
                                            {detail && <p className="mt-0.5 text-xs text-slate-500">{detail}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Callout variant="info">
                                <strong>URL tip:</strong> Make sure the URL returns a 2xx status for "UP". SentinelMesh
                                treats any non-2xx response (or a timeout) as a failure.
                            </Callout>
                        </div>
                    </section>

                    {/* ── STEP 3: Verification ── */}
                    <section id="verification">
                        <div className="mb-5 flex items-center gap-3">
                            <StepBadge n={3} />
                            <h2 className="text-xl font-semibold text-slate-100">How verification works</h2>
                        </div>
                        <div className="ml-12 space-y-4">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                A single failed HTTP check does <strong className="text-slate-300">not</strong> trigger
                                an alert. SentinelMesh uses a consecutive failure threshold to distinguish blips from real outages.
                            </p>

                            {/* Stage diagram */}
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-700/50 bg-slate-800/20 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-amber-400" />
                                        <h3 className="text-sm font-semibold text-slate-300">Stage 1 — Blip detection</h3>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-400">
                                        One failed check is logged but ignored. Network hiccups happen.
                                    </p>
                                </div>
                                <div className="rounded-xl border border-rose-800/40 bg-rose-950/15 p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-rose-400" />
                                        <h3 className="text-sm font-semibold text-slate-300">Stage 2 — Confirmed outage</h3>
                                    </div>
                                    <p className="text-xs leading-relaxed text-slate-400">
                                        Two or more consecutive failures confirm a real outage. An incident
                                        opens and your alert fires — exactly once.
                                    </p>
                                </div>
                            </div>

                            {/* State transitions */}
                            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5">
                                <p className="mb-3 font-mono text-xs text-slate-500 uppercase tracking-wider">State transitions</p>
                                <div className="space-y-2 font-mono text-xs">
                                    {[
                                        { from: 'UP', event: '1 failure', to: 'UP', note: 'no action' },
                                        { from: 'UP', event: '2+ consecutive failures', to: 'DOWN', note: '→ alert fires' },
                                        { from: 'DOWN', event: 'check passes', to: 'UP', note: '→ resolved email' },
                                    ].map(({ from, event, to, note }, i) => (
                                        <div key={i} className="flex flex-wrap items-center gap-2">
                                            <span className="rounded bg-slate-800 px-2 py-0.5 text-cyan-300">{from}</span>
                                            <ChevronRight className="h-3 w-3 text-slate-600" />
                                            <span className="text-slate-500 italic">{event}</span>
                                            <ChevronRight className="h-3 w-3 text-slate-600" />
                                            <span className={`rounded px-2 py-0.5 ${to === 'DOWN' ? 'bg-rose-950/50 text-rose-400' : 'bg-emerald-950/50 text-emerald-400'}`}>{to}</span>
                                            <span className="text-slate-500">{note}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Callout variant="tip">
                                This means SentinelMesh will <strong>never</strong> wake you up for a transient network
                                blip. Single-region today — multi-region quorum verification is coming in V2.
                            </Callout>
                        </div>
                    </section>

                    {/* ── STEP 4: Alerts ── */}
                    <section id="alerts">
                        <div className="mb-5 flex items-center gap-3">
                            <StepBadge n={4} />
                            <h2 className="text-xl font-semibold text-slate-100">Configure alerts</h2>
                        </div>
                        <div className="ml-12 space-y-4">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Alerts are state-based, meaning they fire exactly <strong className="text-slate-300">once per transition</strong>.
                                No repeat emails during an ongoing outage. No alert storm on recovery.
                            </p>
                            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-3">
                                {[
                                    {
                                        label: 'Open the monitor editor for any existing monitor.',
                                        note: null,
                                    },
                                    {
                                        label: 'Fill in the Alert Email field with your on-call address.',
                                        note: 'Use a distribution list for team-wide alerts.',
                                    },
                                    {
                                        label: 'Save changes.',
                                        note: null,
                                    },
                                ].map(({ label, note }, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                        <div>
                                            <p className="text-sm text-slate-300">{label}</p>
                                            {note && <p className="mt-0.5 text-xs text-slate-500">{note}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Alert email breakdown */}
                            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
                                <div className="border-b border-slate-800/60 bg-slate-800/20 px-5 py-3">
                                    <p className="font-mono text-xs text-slate-500">What emails you'll receive</p>
                                </div>
                                <div className="divide-y divide-slate-800/40">
                                    <div className="flex items-center gap-4 px-5 py-3">
                                        <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-300">Incident opened</p>
                                            <p className="text-xs text-slate-500">Sent once when monitor transitions to DOWN</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 px-5 py-3">
                                        <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-300">Incident resolved</p>
                                            <p className="text-xs text-slate-500">Sent once when monitor recovers to UP</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Callout variant="warn">
                                V1 supports email alerts only. Webhooks, Slack, and WhatsApp coming in V2.
                            </Callout>
                        </div>
                    </section>

                    {/* ── STEP 5: Dashboard ── */}
                    <section id="dashboard">
                        <div className="mb-5 flex items-center gap-3">
                            <StepBadge n={5} />
                            <h2 className="text-xl font-semibold text-slate-100">Read your dashboard</h2>
                        </div>
                        <div className="ml-12 space-y-4">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Once monitors are running, your dashboard gives you a live view of uptime health,
                                recent check results, and open incidents.
                            </p>
                            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
                                <div className="border-b border-slate-800/60 bg-slate-800/20 px-5 py-3">
                                    <p className="font-mono text-xs text-slate-500">Dashboard panels</p>
                                </div>
                                <div className="divide-y divide-slate-800/40">
                                    {[
                                        {
                                            icon: BarChart2,
                                            title: 'Monitors overview',
                                            desc: 'At-a-glance status for every endpoint: UP, DOWN, or DEGRADED. Click any row to drill into its check history.',
                                        },
                                        {
                                            icon: Activity,
                                            title: 'Check result timeline',
                                            desc: 'A time-series log of every HTTP check result — status code, latency in ms, and timestamp. Powered by TimescaleDB for fast range queries.',
                                        },
                                        {
                                            icon: AlertTriangle,
                                            title: 'Active incidents',
                                            desc: 'Open incidents listed with opened-at timestamp and duration. Resolves automatically when checks pass.',
                                        },
                                    ].map(({ icon: Icon, title, desc }) => (
                                        <div key={title} className="flex items-start gap-4 px-5 py-4">
                                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />
                                            <div>
                                                <p className="text-sm font-semibold text-slate-200">{title}</p>
                                                <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── STEP 6: Architecture ── */}
                    <section id="architecture">
                        <div className="mb-5 flex items-center gap-3">
                            <StepBadge n={6} />
                            <h2 className="text-xl font-semibold text-slate-100">Architecture overview</h2>
                        </div>
                        <div className="ml-12 space-y-4">
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Every check you set up flows through six discrete, stateless components. Understanding
                                the pipeline helps you reason about data freshness and latency between check and alert.
                            </p>
                            <MiniPipeline />
                            <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 overflow-hidden">
                                <div className="divide-y divide-slate-800/40">
                                    {[
                                        { node: 'Scheduler', desc: 'Reads all active monitors and enqueues a BullMQ job per monitor on the configured cadence. Jobs are deduplicated by ID — so a scheduler restart never creates duplicate checks.' },
                                        { node: 'Worker Nodes', desc: 'Stateless processes that dequeue jobs, run the HTTP check, and write the result. Scale horizontally by adding workers — no leader election, no shared state.' },
                                        { node: 'Check Results', desc: 'Every result is written as an immutable row in TimescaleDB. Nothing is overwritten. You have a forensic log of every check ever run.' },
                                        { node: 'Verifier', desc: 'Reads the latest N results per monitor per region. Applies the state machine: if consecutive failures ≥ threshold, escalate. Confirms before acting.' },
                                        { node: 'Incident', desc: 'Created once per distinct outage. Stores region, opened-at, and resolved-at. Not duplicated even if Verifier runs multiple times.' },
                                        { node: 'Alert', desc: 'Fires one email on DOWN transition, one on UP recovery. State-based: no repeat alerts for the same open incident.' },
                                    ].map(({ node, desc }) => (
                                        <div key={node} className="flex items-start gap-4 px-5 py-4">
                                            <span className="mt-0.5 shrink-0 rounded-md border border-cyan-500/25 bg-cyan-500/8 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-400 whitespace-nowrap">
                                                {node}
                                            </span>
                                            <p className="text-xs leading-relaxed text-slate-400">{desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <Terminal
                                lines={[
                                    '# Self-host: start all services with Docker Compose',
                                    '$ docker compose up -d',
                                    '',
                                    '# Or start individual services in a monorepo',
                                    '$ pnpm --filter scheduler dev',
                                    '$ pnpm --filter worker dev',
                                    '$ pnpm --filter verifier dev',
                                    '$ pnpm --filter web dev',
                                ]}
                            />
                        </div>
                    </section>
                </div>

                {/* V2 Roadmap */}
                <div className="mt-16 border-t border-slate-800/60 pt-10">
                    <p className="mb-5 font-mono text-xs font-medium uppercase tracking-widest text-slate-600">Coming in V2</p>
                    <dl className="space-y-4">
                        {[
                            ['Multi-region verification', 'Workers in Frankfurt, Virginia, and Mumbai. Quorum-based confirmation (2/3 regions) before any alert fires.'],
                            ['WhatsApp alerts', 'Notifications where your team actually is.'],
                            ['Status pages', 'A public URL your users can check themselves.'],
                            ['Performance metrics', 'p50, p95, p99 response times per monitor.'],
                        ].map(([title, desc]) => (
                            <div key={title} className="flex gap-3">
                                <span className="mt-0.5 shrink-0 font-mono text-xs text-slate-700">—</span>
                                <div>
                                    <dt className="font-mono text-xs text-slate-500">{title}</dt>
                                    <dd className="mt-0.5 font-mono text-xs text-slate-700">{desc}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* CTA Footer */}
                <div className="mt-20 flex flex-col items-center gap-4 border-t border-slate-800/60 pt-12 text-center">
                    <p className="text-sm text-slate-500">Ready to stop firefighting false positives?</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-7 py-3 text-sm font-semibold text-slate-950 transition-all hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
                        >
                            Create your account <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/40 px-7 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-slate-700 hover:text-white"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
