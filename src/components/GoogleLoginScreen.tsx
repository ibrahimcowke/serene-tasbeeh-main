import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Lock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function GoogleLoginScreen({ onLoginSuccess }: { onLoginSuccess: () => void }) {
    const { t } = useTranslation();
    const [signingIn, setSigningIn] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const [isForgotPassword, setIsForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showGuestWarning, setShowGuestWarning] = useState(false);

    const handleContinueAsGuest = () => {
        setShowGuestWarning(true);
    };

    const confirmContinueAsGuest = () => {
        localStorage.setItem('tasbeehly_guest_mode', 'true');
        window.dispatchEvent(new Event('guest-mode-change'));
        toast.info("Continuing in Offline Guest Mode");
        setShowGuestWarning(false);
    };

    const starfield = React.useMemo(() => [...Array(50)].map((_, i) => (
        <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
                width: Math.random() * 2 + 0.5 + 'px',
                height: Math.random() * 2 + 0.5 + 'px',
                top: Math.random() * 55 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
        />
    )), []);

    const handleLogin = async () => {
        setSigningIn(true);
        try {
            // Trigger Capacitor Native Google Sign-In
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
                    console.error("Failed to fetch ID token: ", tokenError);
                }
            }

            if (idToken) {
                // Exchange native token for Firebase Auth credential (usually needed for Web)
                const credential = GoogleAuthProvider.credential(idToken);
                await signInWithCredential(auth, credential);
                onLoginSuccess();
            } else if (result.user) {
                // On Native Android/iOS, the plugin natively authenticates and syncs with JS SDK
                onLoginSuccess();
            } else {
                throw new Error("No user or credential returned from Google Sign-In.");
            }
        } catch (e: any) {
            console.error("Firebase Login Error: ", e);
            toast.error("Failed to login with Google: " + (e.message || e));
            setSigningIn(false);
        }
    };

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isForgotPassword) {
            if (!email) {
                toast.error("Please enter your email to reset password");
                return;
            }
            setSigningIn(true);
            try {
                await sendPasswordResetEmail(auth, email);
                toast.success("Password reset email sent! Please check your inbox.");
                setIsForgotPassword(false);
            } catch (error: any) {
                console.error("Password Reset Error:", error);
                toast.error(error.message || "Failed to send reset email");
            } finally {
                setSigningIn(false);
            }
            return;
        }

        if (!email || !password) {
            toast.error("Please enter email and password");
            return;
        }
        
        if (isSignUp && password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setSigningIn(true);
        try {
            if (isSignUp) {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                try {
                    await sendEmailVerification(userCredential.user);
                    toast.success("Account created! Please check your email (and spam folder) for a verification link.");
                } catch (verifyError) {
                    console.error("Verification Email Error:", verifyError);
                    toast.error("Account created, but failed to send verification email.");
                }
                await auth.signOut(); // Sign out so they must verify
                setIsSignUp(false); // Switch to sign-in view
                setSigningIn(false);
                return;
            } else {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const isTester = email.trim().toLowerCase() === 'playstore-tester@tasbeehly.com';
                if (!userCredential.user.emailVerified && !isTester) {
                    await auth.signOut();
                    toast.error("Please verify your email first. Check your inbox (or spam folder) for the link.");
                    setSigningIn(false);
                    return;
                }
                toast.success("Signed in successfully!");
            }
            onLoginSuccess();
        } catch (error: any) {
            console.error("Email Auth Error:", error);
            if (error.code === 'auth/email-already-in-use') {
                toast.error("This email is already registered. Please switch to Sign In.");
            } else if (error.code === 'auth/invalid-email') {
                toast.error("Please enter a valid email address.");
            } else if (error.code === 'auth/weak-password') {
                toast.error("Password should be at least 6 characters.");
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                toast.error("Invalid email or password.");
            } else {
                toast.error(error.message || "Authentication failed");
            }
            setSigningIn(false);
        }
    };

    return (
        <div
            className="h-dvh w-full overflow-hidden relative flex flex-col"
            style={{
                background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0d0621 40%, #050210 100%)',
            }}
        >
            {/* Hero background image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/welcome_hero.png"
                    alt="Welcome"
                    className="w-full h-full object-cover opacity-70"
                    style={{ objectPosition: 'center top' }}
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(10,4,30,0.2) 0%, rgba(10,4,30,0.5) 40%, rgba(10,4,30,0.97) 75%, rgba(10,4,30,1) 100%)',
                    }}
                />
            </div>

            {/* Stars overlay */}
            <div className="absolute inset-0 z-1 pointer-events-none">
                {starfield}
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full overflow-y-auto touch-pan-y pt-safe pb-safe px-safe scrollbar-none">
                <div className="flex-1 flex flex-col justify-between py-6 max-w-md mx-auto w-full">
                    {/* App brand at top */}
                    <div className="flex flex-col items-center py-2 shrink-0">
                    <motion.div
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
                        style={{
                            background: 'linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(167,139,250,0.1) 100%)',
                            border: '1px solid rgba(251,191,36,0.35)',
                            boxShadow: '0 0 30px rgba(251,191,36,0.2), 0 0 60px rgba(139,92,246,0.1)',
                        }}
                    >
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="8" stroke="rgba(251,191,36,0.5)" strokeWidth="0.6" strokeDasharray="2 2.2" fill="none" />
                            {[0,1,2,3,4,5,6,7,8,9,10].map((i) => {
                                const angle = (i / 11) * 2 * Math.PI - Math.PI / 2;
                                const x = 12 + 8 * Math.cos(angle);
                                const y = 12 + 8 * Math.sin(angle);
                                return <circle key={i} cx={x} cy={y} r="1.8" fill={i < 7 ? 'rgb(251,191,36)' : 'rgba(251,191,36,0.25)'} />;
                            })}
                            <circle cx="12" cy="12" r="1.5" fill="rgb(251,191,36)" opacity="0.7" />
                            <line x1="12" y1="1" x2="12" y2="4" stroke="rgba(251,191,36,0.7)" strokeWidth="1.2" strokeLinecap="round" />
                            <circle cx="12" cy="1.5" r="1.2" fill="rgba(251,191,36,0.8)" />
                        </svg>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl font-bold tracking-tight mb-0.5"
                        style={{
                            background: 'linear-gradient(135deg, #fbbf24, #f472b6, #a78bfa)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            fontFamily: "'Outfit', sans-serif",
                        }}
                    >
                        Tasbeehly
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-xs tracking-widest animate-pulse"
                        style={{ color: 'rgba(251,191,36,0.6)' }}
                    >
                        Spiritual Journey Sync
                    </motion.p>
                </div>

                {/* Main content area */}
                <div className="flex-1 flex flex-col justify-center px-6 py-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className="space-y-4 w-full max-w-md mx-auto"
                    >
                        <div className="text-center space-y-1">
                            <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2" style={{ fontFamily: "'Outfit', sans-serif" }}>
                                <Lock className="w-4 h-4 text-[#fbbf24] animate-pulse" />
                                App Protected
                            </h2>
                            <p className="text-white/60 text-xs leading-relaxed max-w-xs mx-auto">
                                Please sign in to sync your Tasbeeh counts, streaks, and custom dhikrs automatically.
                            </p>
                        </div>

                        <form onSubmit={handleEmailAuth} className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/50 transition-all text-sm"
                                required
                            />
                            {!isForgotPassword && (
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/50 transition-all text-sm"
                                    required
                                />
                            )}
                            {!isForgotPassword && isSignUp && (
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/50 transition-all text-sm"
                                    required
                                />
                            )}
                            
                            {!isForgotPassword && !isSignUp && (
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => setIsForgotPassword(true)}
                                        className="text-xs text-[#fbbf24]/80 hover:text-[#fbbf24] transition-colors"
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                type="submit"
                                disabled={signingIn}
                                className="w-full py-2.5 rounded-xl font-semibold text-white/90 bg-white/10 border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center text-sm"
                            >
                                {signingIn ? (
                                    <div className="w-4 h-4 border-2 border-white/50 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    isForgotPassword ? "Send Reset Link" : (isSignUp ? "Sign Up" : "Sign In")
                                )}
                            </motion.button>
                        </form>

                        <div className="flex items-center justify-between text-xs text-white/50">
                            <div className="h-px bg-white/10 flex-1" />
                            <span className="px-3">OR</span>
                            <div className="h-px bg-white/10 flex-1" />
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleLogin}
                            disabled={signingIn}
                            type="button"
                            className="w-full py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-[0_6px_24px_rgba(251,191,36,0.2)] border border-[#fbbf24]/40"
                            style={{
                                background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                                color: '#1a0a2e',
                            }}
                        >
                            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="currentColor"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="currentColor"/>
                            </svg>
                            <span className="font-bold">Continue with Google</span>
                        </motion.button>
                        
                        <div className="text-center">
                            {isForgotPassword ? (
                                <button
                                    type="button"
                                    onClick={() => setIsForgotPassword(false)}
                                    className="text-xs text-white/70 hover:text-white transition-colors"
                                >
                                    Back to Sign In
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsSignUp(!isSignUp)}
                                    className="text-xs text-white/70 hover:text-white transition-colors"
                                >
                                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                                </button>
                            )}
                        </div>

                        {!isForgotPassword && (
                            <div className="text-center pt-1.5">
                                <button
                                    type="button"
                                    onClick={handleContinueAsGuest}
                                    className="text-xs font-semibold text-[#fbbf24] hover:text-[#fbbf24]/80 transition-colors cursor-pointer"
                                    style={{ fontFamily: "'Outfit', sans-serif" }}
                                >
                                    Continue as Guest (Offline Mode)
                                </button>
                            </div>
                        )}

                        <div className="text-center pt-3 border-t border-white/10">
                            <Link
                                to="/privacy"
                                className="text-[11px] text-white/40 hover:text-white/70 transition-colors underline underline-offset-4"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>

            <AlertDialog open={showGuestWarning} onOpenChange={setShowGuestWarning}>
                <AlertDialogContent className="w-[90vw] max-w-[400px] rounded-[2rem] bg-card border border-border/80 text-foreground">
                    <AlertDialogHeader className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500 animate-pulse">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <AlertDialogTitle className="text-lg font-bold tracking-tight text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                            Proceed as Guest?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed">
                            Offline guest mode does **not** sync your progress to the cloud. 
                            If you uninstall the app or clear system storage, all your dhikrs, counts, streaks, and achievements will be permanently lost.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-row gap-2 mt-4 sm:flex-row sm:justify-center">
                        <AlertDialogCancel className="flex-1 rounded-xl border border-border/60 hover:bg-muted text-foreground/80">
                            {t('general.cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmContinueAsGuest}
                            className="flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold shadow-md shadow-amber-500/10"
                        >
                            Proceed Offline
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
