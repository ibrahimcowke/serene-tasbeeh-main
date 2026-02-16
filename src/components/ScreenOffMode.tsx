import { useTasbeehStore } from '@/store/tasbeehStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Power, Fingerprint } from 'lucide-react';

export function ScreenOffMode() {
    const { screenOffMode, setScreenOffMode, increment, currentCount, currentDhikr, themeSettings, theme } = useTasbeehStore();
    const [touched, setTouched] = useState(false);

    useEffect(() => {
        if (screenOffMode) {
            // Prevent sleep if possible
            if ('wakeLock' in navigator) {
                // @ts-ignore
                navigator.wakeLock.request('screen').catch(console.error);
            }
        }
    }, [screenOffMode]);

    if (!screenOffMode) return null;

    const handleTap = () => {
        increment();
        if (navigator.vibrate) navigator.vibrate(10); // Minimal feedback

        // Show brief visual feedback
        setTouched(true);
        setTimeout(() => setTouched(false), 200);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black text-neutral-800 flex flex-col items-center justify-center touch-manipulation select-none"
                onClick={handleTap}
            >
                {/* Very dim UI elements */}
                <div className="absolute top-10 w-full text-center opacity-20 pointer-events-none">
                    <p className="font-mono text-4xl font-bold text-neutral-700">{currentCount}</p>
                </div>

                {/* Feedback Indicator */}
                <div className={`w-20 h-20 rounded-full border-2 border-neutral-800 transition-all duration-75 ${touched ? 'scale-90 bg-neutral-900' : 'scale-100'}`} />

                {/* Exit Instructions */}
                <div className="absolute bottom-20 w-full text-center opacity-20">
                    <p className="text-xs mb-4">Tap anywhere to count</p>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setScreenOffMode(false);
                            if (navigator.vibrate) navigator.vibrate([50, 50]);
                        }}
                        className="p-4 rounded-full border border-neutral-800 hover:bg-neutral-900 transition-colors"
                    >
                        <Power className="w-8 h-8 text-neutral-700" />
                    </button>
                    <p className="text-[10px] mt-2">Hold to Exit</p>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
