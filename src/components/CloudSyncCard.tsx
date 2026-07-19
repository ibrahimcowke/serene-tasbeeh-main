import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { signInWithCredential, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useTasbeehStore } from '../store/tasbeehStore';
import {
    Cloud, RefreshCw, LogOut, Download, Upload, Wifi, WifiOff,
    CheckCircle2, AlertCircle, Loader2, Trash2, FileText, Camera, History
} from 'lucide-react';
import { toast } from 'sonner';
import {
    manualSyncNow, onSyncStatusChange, getSyncStatus, deleteCloudAccount,
    type SyncStatus
} from '../lib/cloudSync';

function formatRelativeTime(isoString: string | null): string {
    if (!isoString) return 'Never';
    const diff = Date.now() - new Date(isoString).getTime();
    const min = Math.floor(diff / 60000);
    const hr = Math.floor(diff / 3600000);
    const day = Math.floor(diff / 86400000);
    if (min < 1) return 'Just now';
    if (min < 60) return `${min}m ago`;
    if (hr < 24) return `${hr}h ago`;
    return `${day}d ago`;
}

const STATUS_CONFIG: Record<SyncStatus, { icon: React.ReactNode; label: string; color: string }> = {
    idle: { icon: <Cloud size={11} />, label: 'Ready', color: 'hsl(var(--muted-foreground))' },
    syncing: { icon: <Loader2 size={11} className="animate-spin" />, label: 'Syncing…', color: 'hsl(var(--primary))' },
    synced: { icon: <CheckCircle2 size={11} />, label: 'Synced', color: '#34d399' },
    error: { icon: <AlertCircle size={11} />, label: 'Error', color: '#f87171' },
    offline: { icon: <WifiOff size={11} />, label: 'Offline', color: 'hsl(var(--muted-foreground))' },
};

export function CloudSyncCard() {
    const { t } = useTranslation();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleGoToLogin = () => {
        localStorage.removeItem('tasbeehly_guest_mode');
        window.dispatchEvent(new Event('guest-mode-change'));
        toast.info("Switching to login screen…");
    };

    const deviceUuid = useTasbeehStore((s) => s.deviceUuid);
    const setDeviceUuid = useTasbeehStore((s) => s.setDeviceUuid);
    const storeState = useTasbeehStore();

    // Observe auth
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((u) => {
            setUser(u);
            setLoading(false);
            if (u) {
                const cloudUuid = `auth_user_${u.uid}`;
                if (deviceUuid !== cloudUuid) setDeviceUuid(cloudUuid);
            }
        });
        return () => unsub();
    }, []);

    // Observe sync status
    useEffect(() => {
        const { status, lastSyncedAt: lsa } = getSyncStatus();
        setSyncStatus(status);
        setLastSyncedAt(lsa);
        const unsub = onSyncStatusChange((s, lsa) => {
            setSyncStatus(s);
            setLastSyncedAt(lsa);
        });
        return unsub;
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            // webClientId (client_type 3) is required to receive a valid idToken from Google
            const WEB_CLIENT_ID = '207821527708-slddpn0mmr3r5phjn4q75inp21k7h9br.apps.googleusercontent.com';
            const result = await (async () => {
                try {
                    return await FirebaseAuthentication.signInWithGoogle({
                        customParameters: [{ key: 'client_id', value: WEB_CLIENT_ID }]
                    });
                } catch (googleError: any) {
                    const errorStr = (googleError?.message || String(googleError)).toLowerCase();
                    const isCancel = errorStr.includes('cancel') || errorStr.includes('popup-closed-by-user');
                    
                    if (!isCancel) {
                        console.warn("Google Sign-In via Credential Manager failed. Retrying with legacy flow...", googleError);
                        try {
                            return await FirebaseAuthentication.signInWithGoogle({
                                customParameters: [{ key: 'client_id', value: WEB_CLIENT_ID }],
                                useCredentialManager: false
                            });
                        } catch (retryError) {
                            console.error("Legacy Google Sign-In also failed: ", retryError);
                            throw retryError;
                        }
                    } else {
                        throw googleError;
                    }
                }
            })();
            
            let idToken = result.credential?.idToken;
            if (!idToken && (result.credential || result.user)) {
                try {
                    const tokenResult = await FirebaseAuthentication.getIdToken();
                    idToken = tokenResult.token;
                } catch (tokenError) {
                    console.error('Failed to fetch ID token: ', tokenError);
                }
            }

            if (idToken) {
                const credential = GoogleAuthProvider.credential(idToken);
                await signInWithCredential(auth, credential);
                toast.success('Signed in successfully!');
            } else if (result.user) {
                toast.success('Signed in successfully!');
            } else {
                throw new Error('No credential or ID token returned.');
            }
        } catch (e: any) {
            toast.error('Google Sign-In failed: ' + (e.message || e));
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            const newUuid = 'device_' + Math.random().toString(36).substring(2, 15);
            setDeviceUuid(newUuid);
            toast.success('Signed out.');
        } catch (e: any) {
            toast.error('Failed to sign out: ' + e.message);
            setLoading(false);
        }
    };

    const handleManualSync = async () => {
        if (!user || syncing) return;
        setSyncing(true);
        try {
            await manualSyncNow(user.uid);
            toast.success('Sync complete!');
        } catch {
            toast.error('Sync failed. Please try again.');
        } finally {
            setSyncing(false);
        }
    };

    const handleExport = () => {
        const data = {
            exportedAt: new Date().toISOString(),
            totalAllTime: storeState.totalAllTime,
            totalHasanat: storeState.totalHasanat,
            streakDays: storeState.streakDays,
            dailyRecords: storeState.dailyRecords,
            sessions: storeState.sessions,
            customDhikrs: storeState.customDhikrs,
            favoriteDhikrIds: storeState.favoriteDhikrIds,
            reminders: storeState.reminders,
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `serene-tasbeeh-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Backup exported!');
    };

    const handlePdfExport = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast.error('Pop-up blocked. Please allow popups for PDF export.');
            return;
        }

        const dailyRows = storeState.dailyRecords.map((r: any) => `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${r.date}</td>
                <td style="border: 1px solid #ddd; padding: 8px; font-weight: bold;">${r.totalCount.toLocaleString()}</td>
            </tr>
        `).join('');

        const html = `
            <html>
            <head>
                <title>Serene Tasbeeh Progress Report</title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1f2937; padding: 40px; }
                    h1 { color: #d97706; margin-bottom: 5px; }
                    .date { color: #6b7280; font-size: 12px; margin-bottom: 25px; }
                    .stats { display: flex; gap: 15px; margin-bottom: 30px; }
                    .card { border: 1px solid #e5e7eb; padding: 15px; border-radius: 12px; flex: 1; background: #f9fafb; }
                    .card h3 { margin: 0 0 5px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #4b5563; }
                    .card p { margin: 0; font-size: 20px; font-weight: 800; color: #111827; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th { background-color: #f3f4f6; text-align: left; border: 1px solid #e5e7eb; padding: 10px; font-size: 12px; color: #374151; }
                    td { border: 1px solid #e5e7eb; padding: 10px; font-size: 12px; }
                </style>
            </head>
            <body>
                <h1>Tasbeehly Spiritual Progress Report</h1>
                <p class="date">Report generated on: ${new Date().toLocaleDateString()}</p>
                <div class="stats">
                    <div class="card">
                        <h3>Total Recitations</h3>
                        <p>${storeState.totalAllTime.toLocaleString()}</p>
                    </div>
                    <div class="card">
                        <h3>Current Streak</h3>
                        <p>${storeState.streakDays} Days</p>
                    </div>
                    <div class="card">
                        <h3>Longest Streak</h3>
                        <p>${storeState.longestStreak} Days</p>
                    </div>
                </div>
                <h2>Daily Recitation Log</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Dhikr Count</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dailyRows}
                    </tbody>
                </table>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
    };

    // Snapshot versioning states
    const [snapshots, setSnapshots] = useState<{ id: string; timestamp: number; label: string; data: string }[]>(() => {
        const saved = localStorage.getItem('tasbeehly_snapshots');
        return saved ? JSON.parse(saved) : [];
    });
    const [showSnapshots, setShowSnapshots] = useState(false);

    const handleCreateSnapshot = () => {
        const dataStr = useTasbeehStore.getState().exportData();
        const newSnap = {
            id: `snap_${Date.now()}`,
            timestamp: Date.now(),
            label: `Snapshot ${snapshots.length + 1}`,
            data: dataStr
        };
        const updated = [newSnap, ...snapshots].slice(0, 10);
        setSnapshots(updated);
        localStorage.setItem('tasbeehly_snapshots', JSON.stringify(updated));
        toast.success('Snapshot created!');
    };

    const handleRestoreSnapshot = (data: string) => {
        const success = useTasbeehStore.getState().importData(data);
        if (success) {
            toast.success('Restored data from snapshot successfully!');
        } else {
            toast.error('Failed to restore snapshot.');
        }
    };

    const handleDeleteSnapshot = (id: string) => {
        const updated = snapshots.filter(s => s.id !== id);
        setSnapshots(updated);
        localStorage.setItem('tasbeehly_snapshots', JSON.stringify(updated));
        toast.success('Snapshot deleted.');
    };

    const handleDeleteAccount = async () => {
        if (!confirmDelete) { setConfirmDelete(true); return; }
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        setLoading(true);
        try {
            await deleteCloudAccount(currentUser.uid);
            await currentUser.delete();
            const newUuid = 'device_' + Math.random().toString(36).substring(2, 15);
            setDeviceUuid(newUuid);
            toast.success('Account and cloud data deleted.');
        } catch (e: any) {
            if (e.code === 'auth/requires-recent-login') {
                toast.error('Sign out, sign back in, then try deleting again.');
            } else {
                toast.error('Failed to delete account: ' + e.message);
            }
            setLoading(false);
        }
        setConfirmDelete(false);
    };

    const statusCfg = STATUS_CONFIG[syncStatus];

    if (loading) {
        return (
            <div className="flex items-center justify-center p-6 rounded-2xl bg-card/25 border border-border/20">
                <Loader2 size={18} className="text-primary animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div
                className="rounded-2xl p-5 space-y-4"
                style={{
                    background: 'hsl(var(--card) / 0.45)',
                    border: '1px solid hsl(var(--border) / 0.3)',
                    backdropFilter: 'blur(12px)',
                }}
            >
                <div className="flex items-start gap-3">
                    <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                            background: 'hsl(var(--primary) / 0.12)',
                            border: '1px solid hsl(var(--primary) / 0.2)',
                        }}
                    >
                        <Cloud size={16} className="text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-foreground">Cloud Backup & Sync</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                            Sign in to sync your counts, streaks, and achievements across all devices
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleLogin}
                        className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium"
                        style={{
                            background: '#fff',
                            color: '#1a1a1a',
                            border: '1px solid #e2e2e2',
                            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </motion.button>
                    
                    <button
                        onClick={handleGoToLogin}
                        className="w-full text-xs text-primary hover:underline py-1 text-center font-medium mt-1 cursor-pointer"
                    >
                        Sign In with Email / Create Account
                    </button>
                </div>
            </div>
        );
    }

    const name = user.displayName || user.email?.split('@')[0] || 'User';
    const avatar = user.photoURL;

    return (
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                background: 'hsl(var(--card) / 0.45)',
                border: '1px solid hsl(var(--primary) / 0.15)',
                backdropFilter: 'blur(12px)',
            }}
        >
            {/* User row */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/20">
                {avatar ? (
                    <img src={avatar} alt={name} referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full border border-primary/20" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                        {name[0].toUpperCase()}
                    </div>
                )}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                </div>

                {/* Sync status badge */}
                <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0"
                    style={{
                        color: statusCfg.color,
                        borderColor: `${statusCfg.color}33`,
                        background: `${statusCfg.color}15`,
                    }}
                >
                    {statusCfg.icon}
                    <span>{statusCfg.label}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 divide-x divide-border/20 px-0 py-3">
                {[
                    { label: 'All Time', value: storeState.totalAllTime.toLocaleString() },
                    { label: 'Streak', value: `${storeState.streakDays}d` },
                    { label: 'Hasanat', value: storeState.totalHasanat.toLocaleString() },
                ].map((stat) => (
                    <div key={stat.label} className="text-center px-2">
                        <p className="text-base font-bold text-foreground">{stat.value}</p>
                        <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Last synced */}
            <div className="px-4 pb-3 text-[11px] text-muted-foreground flex items-center gap-1">
                <Cloud size={10} />
                Last synced: {formatRelativeTime(lastSyncedAt)}
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 grid grid-cols-2 gap-2">
                {/* Sync Now */}
                <ActionButton
                    icon={syncing ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
                    label={syncing ? 'Syncing…' : 'Sync Now'}
                    onClick={handleManualSync}
                    disabled={syncing}
                    primary
                />

                {/* Export */}
                <ActionButton
                    icon={<Download size={13} />}
                    label="JSON Export"
                    onClick={handleExport}
                />

                {/* PDF Export */}
                <ActionButton
                    icon={<FileText size={13} />}
                    label="PDF Report"
                    onClick={handlePdfExport}
                />

                {/* Snapshots Toggle */}
                <ActionButton
                    icon={<History size={13} />}
                    label="Snapshots"
                    onClick={() => setShowSnapshots(!showSnapshots)}
                />
            </div>

            {/* Collapsible Snapshots Panel */}
            <AnimatePresence>
                {showSnapshots && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border/20 bg-foreground/[0.02] p-4 space-y-3"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase">Data Snapshots ({snapshots.length}/10)</span>
                            <button
                                onClick={handleCreateSnapshot}
                                className="text-[10px] text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                            >
                                <Camera size={11} /> Take Snapshot
                            </button>
                        </div>

                        {snapshots.length === 0 ? (
                            <p className="text-[10px] text-muted-foreground text-center py-4 border border-dashed border-border/30 rounded-xl">
                                No snapshots saved yet.
                            </p>
                        ) : (
                            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                                {snapshots.map((snap) => (
                                    <div key={snap.id} className="flex justify-between items-center p-2 rounded-xl bg-card border border-border/30 text-[10px]">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-foreground">{snap.label}</span>
                                            <span className="text-[8px] text-muted-foreground">{new Date(snap.timestamp).toLocaleString()}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleRestoreSnapshot(snap.data)}
                                                className="text-primary hover:underline font-bold cursor-pointer"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSnapshot(snap.id)}
                                                className="text-rose-500 hover:underline font-bold cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <div className="px-4 pb-3.5 flex items-center justify-between border-t border-border/20 pt-2.5">
                <AnimatePresence mode="wait">
                    {confirmDelete ? (
                        <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                            <span className="text-[11px] text-destructive font-medium">Delete all cloud data?</span>
                            <button onClick={handleDeleteAccount} className="text-[11px] text-destructive font-semibold border border-destructive/30 px-2 py-0.5 rounded-lg">
                                Yes, delete
                            </button>
                            <button onClick={() => setConfirmDelete(false)} className="text-[11px] text-muted-foreground">
                                {t('general.cancel')}
                            </button>
                        </motion.div>
                    ) : (
                        <motion.button
                            key="delete"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={handleDeleteAccount}
                            className="text-[11px] text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                        >
                            <Trash2 size={11} />
                            Delete Account
                        </motion.button>
                    )}
                </AnimatePresence>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                >
                    <LogOut size={11} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

function ActionButton({
    icon, label, onClick, disabled, primary
}: {
    icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; primary?: boolean;
}) {
    return (
        <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onClick}
            disabled={disabled}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-60"
            style={{
                background: primary ? 'hsl(var(--primary) / 0.12)' : 'hsl(var(--border) / 0.2)',
                color: primary ? 'hsl(var(--primary))' : 'hsl(var(--foreground) / 0.7)',
                border: primary ? '1px solid hsl(var(--primary) / 0.2)' : '1px solid hsl(var(--border) / 0.3)',
            }}
        >
            {icon}
            {label}
        </motion.button>
    );
}
