import React, { useState, useEffect } from 'react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { signInWithCredential, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useTasbeehStore } from '../store/tasbeehStore';
import { LogOut, RefreshCw, Cloud, Check } from 'lucide-react';
import { toast } from 'sonner';

export function GoogleLogin() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const deviceUuid = useTasbeehStore(state => state.deviceUuid);
    const setDeviceUuid = useTasbeehStore(state => state.setDeviceUuid);
    const currentStoreState = useTasbeehStore();

    useEffect(() => {
        // Observe Firebase Auth state
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            
            if (currentUser) {
                const cloudUuid = `auth_user_${currentUser.uid}`;
                if (deviceUuid !== cloudUuid) {
                    setDeviceUuid(cloudUuid);
                }
            }
        });

        return () => unsubscribe();
    }, [deviceUuid, setDeviceUuid]);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const result = await FirebaseAuthentication.signInWithGoogle({
                webClientId: "207821527708-slddpn0mmr3r5phjn4q75inp21k7h9br.apps.googleusercontent.com"
            });
            if (result.credential) {
                const credential = GoogleAuthProvider.credential(result.credential.idToken);
                await signInWithCredential(auth, credential);
                toast.success("Successfully logged in.");
            } else {
                throw new Error("No credential returned.");
            }
        } catch (e: any) {
            console.error("Login error:", e);
            toast.error("Failed to start Google login: " + (e.message || e));
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        try {
            await signOut(auth);
            const newUuid = 'device_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            setDeviceUuid(newUuid);
            toast.success("Logged out successfully.");
        } catch (e: any) {
            toast.error("Failed to log out: " + e.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-6 bg-card/25 backdrop-blur-md rounded-2xl border border-border/20">
                <RefreshCw className="w-5 h-5 text-primary animate-spin" />
            </div>
        );
    }

    if (user) {
        const name = user.displayName || user.email?.split('@')[0] || "User";
        const avatar = user.photoURL;

        return (
            <div className="bg-card/45 backdrop-blur-md border border-primary/15 rounded-2xl p-4 sm:p-5 flex flex-col gap-4 shadow-xl text-start">
                <div className="flex items-center gap-3.5">
                    {avatar ? (
                        <img src={avatar} alt={name} className="w-11 h-11 rounded-full border border-primary/20 shadow-md" />
                    ) : (
                        <div className="w-11 h-11 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-primary text-base font-bold shadow-md">
                            {name[0].toUpperCase()}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-500/20 shrink-0">
                        {syncing ? (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                            <Cloud className="w-3.5 h-3.5" />
                        )}
                        <span>{syncing ? "Syncing..." : "Synced"}</span>
                    </div>
                </div>

                <div className="h-px bg-border/30" />

                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                        <span>All Time Total:</span>
                        <span className="font-semibold text-foreground">{currentStoreState.totalAllTime}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Hasanat Score:</span>
                        <span className="font-semibold text-foreground">{currentStoreState.totalHasanat}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Active Streak:</span>
                        <span className="font-semibold text-foreground">{currentStoreState.streakDays} days</span>
                    </div>
                </div>

                <div className="h-px bg-border/30" />

                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Backup Active</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 text-muted-foreground hover:text-destructive hover:font-medium transition-colors cursor-pointer"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card/45 backdrop-blur-md border border-border/30 rounded-2xl p-5 flex flex-col gap-4 text-center shadow-xl">
            <div className="space-y-1.5 text-start">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-primary" />
                    Cloud Backup & Sync
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Securely log in to sync your Tasbeeh counts, streaks, achievements, and custom dhikrs automatically across all your devices.
                </p>
            </div>

            <button
                onClick={handleLogin}
                className="flex items-center justify-center gap-3 px-4 py-3 bg-white hover:bg-neutral-50 active:scale-[0.98] text-neutral-800 rounded-xl font-medium text-sm transition-all border border-neutral-300 shadow-[0_2px_6px_rgba(0,0,0,0.06)] cursor-pointer"
            >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
            </button>
        </div>
    );
}
