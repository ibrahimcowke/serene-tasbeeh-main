import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { auth, googleProvider, db } from '@/lib/firebase';
import { 
    signInWithPopup, 
    signInWithRedirect, 
    getRedirectResult, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut, 
    onAuthStateChanged, 
    User 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { toast } from 'sonner';
import { LogIn, LogOut, Cloud, RefreshCw, Mail, Lock, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Capacitor } from '@capacitor/core';

interface LoginViewProps {
    children: React.ReactNode;
}

export function LoginView({ children }: LoginViewProps) {
    const [user, setUser] = useState<User | null>(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const store = useTasbeehStore();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        const checkRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    toast.success("Signed in with Google!");
                }
            } catch (error: any) {
                console.error("Redirect auth error: ", error);
                if (error.code && error.code !== 'auth/operation-not-supported-in-this-environment') {
                    toast.error(error.message || "Google Redirect Sign-In failed");
                }
            }
        };

        checkRedirectResult();

        return () => unsubscribe();
    }, []);

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            if (Capacitor.isNativePlatform()) {
                // On native, standard popups/redirects fail. We attempt redirect but also warn.
                await signInWithRedirect(auth, googleProvider);
            } else {
                // On Web PWA/browser, check if it's mobile to use redirect
                const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if (isMobile) {
                    await signInWithRedirect(auth, googleProvider);
                } else {
                    await signInWithPopup(auth, googleProvider);
                    toast.success("Signed in with Google!");
                }
            }
        } catch (error: any) {
            console.error("Google sign in error: ", error);
            if (error.code === 'auth/operation-not-supported-in-this-environment') {
                toast.error("Google Sign-In is not supported natively on this device. Please sign in with Email/Password or run as a web app.");
            } else if (error.code === 'auth/popup-blocked') {
                toast.info("Popup blocked. Redirecting to sign in...");
                try {
                    await signInWithRedirect(auth, googleProvider);
                } catch (redirectError: any) {
                    toast.error(redirectError.message || "Failed to redirect");
                }
            } else {
                toast.error(error.message || "Failed to sign in with Google");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
                toast.success("Account created successfully!");
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                toast.success("Signed in successfully!");
            }
        } catch (error: any) {
            toast.error(error.message || "Authentication failed");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address first");
            return;
        }
        setLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success("Password reset email sent! Check your inbox.");
            setIsForgotPassword(false);
        } catch (error: any) {
            toast.error(error.message || "Failed to send password reset email");
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast.success("Signed out successfully");
        } catch (error: any) {
            toast.error("Failed to sign out");
        }
    };

    const handleSyncToCloud = async () => {
        if (!user) return;
        setSyncing(true);
        try {
            const data = store.exportData(); // Export JSON string
            await setDoc(doc(db, "users", user.uid), {
                appData: data,
                lastSync: new Date().toISOString()
            });
            toast.success("Data securely backed up to the cloud!");
        } catch (error: any) {
            toast.error("Failed to backup data to cloud");
        } finally {
            setSyncing(false);
        }
    };

    const handleRestoreFromCloud = async () => {
        if (!user) return;
        setSyncing(true);
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data().appData;
                const success = store.importData(data);
                if (success) {
                    toast.success("Data successfully restored from cloud!");
                } else {
                    toast.error("Failed to parse cloud data");
                }
            } else {
                toast.error("No backup found in the cloud");
            }
        } catch (error: any) {
            toast.error("Failed to restore data from cloud");
        } finally {
            setSyncing(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
                <SheetDescription className="sr-only">
                    Sign in to sync your data securely.
                </SheetDescription>
                <div className="sheet-handle" />
                <SheetHeader className="text-left pb-4">
                    <SheetTitle className="text-lg font-medium">Cloud Sync & Security</SheetTitle>
                </SheetHeader>

                <div className="h-[calc(100%-40px)] overflow-y-auto pb-8 space-y-6">
                    {user ? (
                        <div className="space-y-6">
                            <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-2">
                                <p className="text-sm font-medium text-foreground">Signed in as</p>
                                <p className="text-xs text-primary">{user.email}</p>
                            </div>

                            <div className="space-y-3">
                                <button 
                                    onClick={handleSyncToCloud}
                                    disabled={syncing}
                                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <Cloud className="w-5 h-5 text-primary" />
                                        <span className="text-sm font-medium text-primary">Backup to Cloud</span>
                                    </div>
                                    {syncing && <RefreshCw className="w-4 h-4 text-primary animate-spin" />}
                                </button>

                                <button 
                                    onClick={handleRestoreFromCloud}
                                    disabled={syncing}
                                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-card hover:bg-muted border border-border/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <RefreshCw className="w-5 h-5 text-foreground/80" />
                                        <span className="text-sm font-medium text-foreground/80">Restore from Cloud</span>
                                    </div>
                                </button>
                            </div>

                            <button 
                                onClick={handleSignOut}
                                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm font-medium">Sign Out</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {!isForgotPassword && (
                                <div className="flex p-1 bg-muted/60 backdrop-blur-sm rounded-xl border border-border/40 relative">
                                    <button
                                        type="button"
                                        onClick={() => setIsRegistering(false)}
                                        className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 relative z-10 ${
                                            !isRegistering ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Sign In
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsRegistering(true)}
                                        className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-300 relative z-10 ${
                                            isRegistering ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                                        }`}
                                    >
                                        Create Account
                                    </button>
                                    <motion.div
                                        className="absolute top-1 bottom-1 bg-primary rounded-lg shadow-sm"
                                        initial={false}
                                        animate={{
                                            left: isRegistering ? '50%' : '4px',
                                            right: isRegistering ? '4px' : '50%',
                                        }}
                                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                    />
                                </div>
                            )}

                            {isForgotPassword ? (
                                <form onSubmit={handleForgotPassword} className="space-y-4 p-4 rounded-2xl bg-card border border-border/50">
                                    <div className="space-y-2 pb-2">
                                        <h3 className="text-sm font-semibold text-foreground">Reset Password</h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Enter your email address and we'll send you a secure link to reset your password.
                                        </p>
                                    </div>
                                    
                                    <div className="relative">
                                        <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                        <Input 
                                            type="email" 
                                            placeholder="Email Address" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9 bg-background/50 border-border/50 rounded-xl"
                                            required
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full p-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex justify-center items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                                        Send Reset Link
                                    </button>
                                    
                                    <button 
                                        type="button"
                                        onClick={() => setIsForgotPassword(false)}
                                        className="w-full flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <ArrowLeft className="w-3.5 h-3.5" />
                                        Back to Sign In
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handleEmailAuth} className="space-y-4 p-4 rounded-2xl bg-card border border-border/50">
                                    <div className="space-y-3">
                                        <div className="relative">
                                            <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <Input 
                                                type="email" 
                                                placeholder="Email" 
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="pl-9 bg-background/50 border-border/50 rounded-xl"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                            <Input 
                                                type="password" 
                                                placeholder="Password" 
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="pl-9 bg-background/50 border-border/50 rounded-xl"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {!isRegistering && (
                                        <div className="flex justify-end px-1">
                                            <button 
                                                type="button"
                                                onClick={() => setIsForgotPassword(true)}
                                                className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
                                            >
                                                Forgot password?
                                            </button>
                                        </div>
                                    )}
                                    
                                    <button 
                                        type="submit"
                                        disabled={loading}
                                        className="w-full p-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm flex justify-center items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
                                        {isRegistering ? "Create Account" : "Sign In"}
                                    </button>
                                </form>
                            )}

                            {!isForgotPassword && (
                                <>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-border/50" />
                                        </div>
                                        <div className="relative flex justify-center text-xs uppercase">
                                            <span className="bg-sheet-bg px-2 text-muted-foreground">Or continue with</span>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={handleGoogleSignIn}
                                        disabled={loading}
                                        className="w-full flex items-center justify-center gap-3 p-3.5 rounded-xl bg-card border border-border/50 hover:bg-muted transition-colors disabled:opacity-50"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-5 h-5">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                        </svg>
                                        <span className="text-sm font-medium text-foreground">Sign in with Google</span>
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}

