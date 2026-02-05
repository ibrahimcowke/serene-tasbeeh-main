import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';

/**
 * Undo Button Component
 * Allows users to undo the last increment
 */
export function UndoButton() {
    const { canUndo, undo } = useTasbeehStore();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (canUndo) {
            setIsVisible(true);

            // Auto-hide after 5 seconds
            const timeout = setTimeout(() => {
                setIsVisible(false);
            }, 5000);

            return () => clearTimeout(timeout);
        } else {
            setIsVisible(false);
        }
    }, [canUndo]);

    const handleUndo = () => {
        undo();
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && canUndo && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleUndo}
                    className="w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center hover:bg-primary/30 transition-colors border border-primary/30"
                    title="Undo last count"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-primary"
                    >
                        <path d="M3 7v6h6" />
                        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
                    </svg>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
