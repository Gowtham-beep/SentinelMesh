'use client';

import { useEffect, useState } from 'react';
import { Shield, Zap, AlertTriangle, KeyRound } from 'lucide-react';
import { getUserProfile, changePassword, getApiErrorMessage } from '@/lib/api';

type ProfileStats = {
    totalMonitors: number;
    upMonitors: number;
    downMonitors: number;
};

type UserProfile = {
    id: string;
    email: string;
    createdAt: string;
};

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Password Form State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getUserProfile();
                setProfile(data.user);
                setStats(data.stats);
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);
        setMsg(null);

        try {
            await changePassword({ currentPassword, newPassword });
            setMsg({ type: 'success', text: 'Password successfully updated.' });
            setCurrentPassword('');
            setNewPassword('');
        } catch (err) {
            setMsg({ type: 'error', text: getApiErrorMessage(err) });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-500" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8 animate-fade-in relative">
            <div className="absolute top-0 right-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Profile</h1>
                <p className="text-sm text-slate-400">
                    Account details and your overall monitor analytics
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column: Account Details & Password */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm relative overflow-hidden">
                        {/* decorative accent */}
                        <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-50"></div>

                        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                            <Shield className="h-4 w-4 text-cyan-400" /> Account Info
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
                                <p className="text-sm font-medium text-slate-200">{profile?.email}</p>
                            </div>
                            <div>
                                <p className="text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">Member Since</p>
                                <p className="text-sm font-medium text-slate-200">
                                    {profile ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                            <KeyRound className="h-4 w-4 text-slate-400" /> Settings
                        </h2>
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-xs font-medium text-slate-300">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={8}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-md border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                                />
                            </div>

                            {msg && (
                                <div className={`rounded-md p-3 text-sm ${msg.type === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                    {msg.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                            >
                                {isUpdating ? 'Updating...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Column: Analytics */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-white mb-2 pt-1 border-b border-transparent">
                        Monitor Analytics
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">

                        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 shadow-sm transition-colors hover:border-slate-700">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-400">Total Monitors</span>
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                    <Shield className="h-4 w-4" />
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-white">{stats?.totalMonitors || 0}</div>
                        </div>

                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-sm transition-colors hover:border-emerald-500/30">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="text-sm font-medium text-slate-300">Monitors UP</span>
                                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                                    <Zap className="h-4 w-4" />
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-white">{stats?.upMonitors || 0}</div>
                        </div>

                        <div className={`sm:col-span-2 rounded-xl border p-5 shadow-sm transition-colors ${stats && stats.downMonitors > 0 ? 'border-red-500/30 bg-red-500/10 hover:border-red-500/50' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}>
                            <div className="mb-2 flex items-center justify-between">
                                <span className={`text-sm font-medium ${stats && stats.downMonitors > 0 ? 'text-red-300' : 'text-slate-400'}`}>Monitors DOWN</span>
                                <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${stats && stats.downMonitors > 0 ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-500'}`}>
                                    <AlertTriangle className="h-4 w-4" />
                                </span>
                            </div>
                            <div className="text-3xl font-bold text-white">{stats?.downMonitors || 0}</div>
                            {stats && stats.downMonitors > 0 && (
                                <p className="mt-2 text-xs font-medium text-red-400">
                                    Incidents are currently open. Please check your dashboard.
                                </p>
                            )}
                        </div>

                    </div>

                    <div className="p-4 border border-slate-800 bg-slate-900/40 rounded-lg text-sm text-slate-400 leading-relaxed font-mono">
                        "SentinelMesh uses multi-stage verification and distributed workers to eliminate false positives — so you only get paged when something is actually down."
                    </div>

                </div>
            </div>
        </div>
    );
}
