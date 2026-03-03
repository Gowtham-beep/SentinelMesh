'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Activity, AlertTriangle, LogOut, Shield, User } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Monitors', href: '/monitors', icon: Activity },
  { name: 'Incidents', href: '/incidents', icon: AlertTriangle },
  { name: 'Profile', href: '/profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-950 bg-dot-grid">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800/60 bg-slate-950/95 backdrop-blur-sm">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-slate-800/60 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 ring-1 ring-cyan-500/30">
            <Shield className="h-4 w-4 text-cyan-400" />
          </div>
          <div>
            <span className="font-bold text-slate-100 tracking-tight">SentinelMesh</span>
            <span className="ml-2 rounded-sm bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-mono text-cyan-400 ring-1 ring-cyan-500/20">v1</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-1 flex-col gap-1 p-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                )}
              >
                <item.icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />
                {item.name}
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 status-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-800/60 p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="pl-64">
        <main className="min-h-screen px-8 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
