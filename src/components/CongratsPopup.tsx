import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Trophy, Star, X, CheckCircle2, RefreshCw, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CongratsPopup: React.FC = memo(() => {
    const { showCongrats, congratsData, closeCongrats, reset, switchDhikr } = useTasbeehStore();

    if (!showCongrats || !congratsData) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-sm overflow-hidden bg-card/80 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-2xl"
                >
                    {/* Decorative Sparks */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                    <div className="p-8 flex flex-col items-center text-center space-y-6">
                        {/* Icon/Badge Section */}
                        <motion.div
                            initial={{ rotate: -15, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', damping: 12 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                            <div className="relative bg-gradient-to-br from-primary to-primary-foreground p-4 rounded-2xl shadow-xl shadow-primary/20">
                                <Trophy className="w-10 h-10 text-white" />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-2 -right-2 bg-yellow-400 p-1.5 rounded-full border-2 border-card"
                            >
                                <Star className="w-3 h-3 text-card fill-card" />
                            </motion.div>
                        </motion.div>

                        {/* Content */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                                MashaAllah!
                            </h2>
                            <p className="text-sm text-muted-foreground leading-relaxed px-4">
                                {congratsData.description}
                            </p>
                        </div>

                        {/* Hasanat Counter */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="w-full bg-primary/5 rounded-2xl p-4 border border-primary/10"
                        >
                            <div className="text-xs uppercase tracking-widest text-primary/60 font-medium mb-1">
                                Total Reward (Estimated)
                            </div>
                            <div className="flex items-baseline justify-center gap-1.5">
                                <span className="text-3xl font-black text-primary">
                                    +{congratsData.hasanatEarned.toLocaleString()}
                                </span>
                                <span className="text-sm font-semibold text-primary/80">Hasanat</span>
                            </div>
                        </motion.div>

                        {/* Actions */}
                        <div className="w-full flex flex-col gap-3">
                            <Button
                                onClick={() => {
                                    reset();
                                    closeCongrats();
                                }}
                                className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary hover:bg-primary/90"
                            >
                                <RefreshCw className="mr-2 w-5 h-5" />
                                Repeat Session
                            </Button>
                            
                            <Button
                                variant="outline"
                                onClick={() => {
                                    switchDhikr();
                                    closeCongrats();
                                }}
                                className="w-full h-12 rounded-xl text-lg font-medium border-primary/20 hover:bg-primary/5 active:scale-95 transition-all"
                            >
                                <Settings2 className="mr-2 w-5 h-5" />
                                Switch Dhikr
                            </Button>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={closeCongrats}
                        className="absolute top-4 right-4 p-2 text-muted-foreground/40 hover:text-foreground transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
});
