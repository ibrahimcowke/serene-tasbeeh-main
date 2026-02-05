import { useEffect, useState } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { formatSessionTime } from '@/lib/timeUtils';

/**
 * Session Timer Component
 * Displays elapsed time in current dhikr session
 */
export function SessionTimer() {
    const { sessionStartTime, currentCount } = useTasbeehStore();
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        if (!sessionStartTime) {
            setElapsedSeconds(0);
            return;
        }

        // Calculate initial elapsed time
        const initialElapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
        setElapsedSeconds(initialElapsed);

        // Update every second
        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
            setElapsedSeconds(elapsed);
        }, 1000);

        return () => clearInterval(interval);
    }, [sessionStartTime]);

    // Don't show timer if count is 0 (no session started)
    if (currentCount === 0 && elapsedSeconds === 0) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="font-mono tabular-nums">{formatSessionTime(elapsedSeconds)}</span>
        </div>
    );
}
