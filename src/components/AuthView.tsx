import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Loader2, CheckCircle2, AlertCircle, ShieldCheck, LogIn, ArrowRight } from 'lucide-react';
import { signInWithMagicLink } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function AuthView() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const { toast } = useToast();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const { error } = await signInWithMagicLink(email);
            if (error) throw error;
            setIsSent(true);
            toast({
                title: "Magic Link Sent",
                description: "Check your email for the login link.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Login Failed",
                description: error.message || "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-md mx-auto overflow-hidden border-none shadow-2xl bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
            
            <CardHeader className="text-center space-y-2 pt-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold tracking-tight">Cloud Sync</CardTitle>
                <CardDescription className="text-muted-foreground px-6">
                    Sign in to protect your data and sync across multiple devices.
                </CardDescription>
            </CardHeader>

            <CardContent className="pb-10 px-8">
                <AnimatePresence mode="wait">
                    {!isSent ? (
                        <motion.form
                            key="login-form"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            onSubmit={handleLogin}
                            className="space-y-6"
                        >
                            <div className="space-y-3">
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 h-12 bg-background/50 border-white/5 focus-visible:ring-primary focus-visible:border-primary/50 text-base rounded-xl transition-all"
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground text-center px-4">
                                    We'll send a magic link to your inbox. No passwords required.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Sending Link...
                                    </>
                                ) : (
                                    <>
                                        Get Magic Link
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </>
                                )}
                            </Button>
                        </motion.form>
                    ) : (
                        <motion.div
                            key="sent-message"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6 space-y-6"
                        >
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-500/5">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold">Check your email</h3>
                                <p className="text-sm text-muted-foreground">
                                    We've sent a magic link to <span className="text-foreground font-semibold">{email}</span>. Click the link in the email to sign in.
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => setIsSent(false)}
                                className="w-full h-12 rounded-xl border-white/10"
                            >
                                Try another email
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center text-center space-y-1">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                            <LogIn className="w-4 h-4 text-blue-500" />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Fast Access</span>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-1">
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 text-orange-500" />
                        </div>
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Secure Data</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
