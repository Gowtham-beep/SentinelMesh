'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Activity, AlertTriangle, LogOut, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Monitors', href: '/monitors', icon: Activity },
    { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-zinc-200 bg-white px-6 pb-4 dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="flex h-16 shrink-0 items-center gap-2">
                        <ShieldCheck className="h-8 w-8 text-zinc-900 dark:text-zinc-50" />
                        <span className="font-bold text-lg tracking-tight">SentinelMesh</span>
                    </div>
                    <nav className="flex flex-1 flex-col">
                        <ul role="list" className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul role="list" className="-mx-2 space-y-1">
                                    {navigation.map((item) => {
                                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                                        return (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={cn(
                                                        isActive
                                                            ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                                                            : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6'
                                                    )}
                                                >
                                                    <item.icon
                                                        className={cn(
                                                            isActive ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-50',
                                                            'h-6 w-6 shrink-0'
                                                        )}
                                                        aria-hidden="true"
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                            <li className="mt-auto">
                                <Button variant="ghost" className="w-full justify-start gap-x-3 px-2" onClick={logout}>
                                    <LogOut className="h-6 w-6 shrink-0 text-zinc-400 group-hover:text-zinc-900 dark:text-zinc-400" />
                                    Log out
                                </Button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            <div className="pl-72">
                <main className="py-10">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </main>
            </div>
        </div>
    );
}
