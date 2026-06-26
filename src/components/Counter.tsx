import { useEffect, memo, useState, useRef } from 'react';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';
import { SoundManager } from '@/lib/sound';
import { initShakeDetection, isShakeDetectionSupported } from '@/lib/shakeDetection';
import { requestWakeLock, releaseWakeLock, isWakeLockSupported } from '@/lib/wakeLock';
import { initVolumeButtonListener } from '@/lib/volumeButtons';
import { DhikrHeader } from './counter/DhikrHeader';
import { CounterDisplay } from './counter/CounterDisplay';
import { CounterActions } from './counter/CounterActions';
import { CounterFooter } from './counter/CounterFooter';
import { DateBanner } from './DateBanner';
import { SessionTimer } from './SessionTimer';
import { HadithOfTheDayModal } from './HadithOfTheDay';
import { MoodTracker } from './MoodTracker';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';


const announceMilestone = (count: number, lang: string) => {
  if (!('speechSynthesis' in window)) return;
  
  // Cancel any ongoing speech
  try { window.speechSynthesis.cancel(); } catch {}

  let text = '';
  if (lang === 'ar') {
    if (count === 33) text = 'ثلاثة وثلاثون';
    else if (count === 99) text = 'تسعة وتسعون';
    else if (count === 100) text = 'مائة';
    else if (count === 500) text = 'خمسمائة';
    else if (count === 1000) text = 'ألف';
  } else {
    if (count === 33) text = 'Thirty-three';
    else if (count === 99) text = 'Ninety-nine';
    else if (count === 100) text = 'One hundred';
    else if (count === 500) text = 'Five hundred';
    else if (count === 1000) text = 'One thousand';
  }

  if (text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ar' ? 'ar-SA' : 'en-US';
    utterance.pitch = 1.0;
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
};

export const Counter = memo(function Counter() {
  const currentCount = useTasbeehStore(state => state.currentCount);
  const reset = useTasbeehStore(state => state.reset);
  const increment = useTasbeehStore(state => state.increment);
  const decrement = useTasbeehStore(state => state.decrement);
  const shakeToReset = useTasbeehStore(state => state.shakeToReset);
  const wakeLockEnabled = useTasbeehStore(state => state.wakeLockEnabled);
  const volumeButtonCounting = useTasbeehStore(state => state.volumeButtonCounting);
  const sessionModeType = useTasbeehStore(state => state.sessionMode.type);
  const theme = useTasbeehStore(state => state.theme);
  const zenMode = useTasbeehStore(state => state.zenMode);
  const currentSettings = useTasbeehStore(state => state.themeSettings[theme] || defaultThemeSettings);

  // New v2.1.0 states & actions
  const language = useTasbeehStore(state => state.language);
  const voiceAnnouncementsEnabled = useTasbeehStore(state => state.voiceAnnouncementsEnabled);
  const sessions = useTasbeehStore(state => state.sessions);

  const [showMood, setShowMood] = useState(false);
  const [showWisdom, setShowWisdom] = useState(false);
  const [lastSessionId, setLastSessionId] = useState('');
  const [lastCount, setLastCount] = useState(0);

  // Live Recitation Pace (BPM) States
  const [bpm, setBpm] = useState(0);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);

  const { t } = useTranslation();
  const prevCountRef = useRef(currentCount);

  // Calculate recitation speed (BPM) on count change
  useEffect(() => {
    if (currentCount > 0) {
      const now = Date.now();
      if (lastTapTime) {
        const diff = now - lastTapTime;
        if (diff > 100 && diff < 4000) {
          const currentBpm = Math.round(60000 / diff);
          setBpm(currentBpm);
        }
      }
      setLastTapTime(now);
    } else {
      setBpm(0);
      setLastTapTime(null);
    }
  }, [currentCount]);

  // Reset BPM to 0 if idle for more than 4 seconds
  useEffect(() => {
    if (bpm > 0) {
      const timer = setTimeout(() => {
        setBpm(0);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [bpm, currentCount]);

  // Voice announcements on milestones
  useEffect(() => {
    if (voiceAnnouncementsEnabled && currentCount > 0) {
      if ([33, 99, 100, 500, 1000].includes(currentCount)) {
        announceMilestone(currentCount, language);
      }
    }
  }, [currentCount, voiceAnnouncementsEnabled, language]);

  // Intercept reset to show MoodTracker
  useEffect(() => {
    if (currentCount === 0 && prevCountRef.current > 0) {
      // It was reset! Get the latest saved session
      const latestSession = sessions[0];
      if (latestSession && Date.now() - latestSession.timestamp < 5000) {
        setLastSessionId(latestSession.id);
        setLastCount(prevCountRef.current);
        setShowMood(true);
      }
    }
    prevCountRef.current = currentCount;
  }, [currentCount, sessions]);

  // Sound
  useEffect(() => {
    if (currentCount > 0 && currentSettings?.soundEnabled) {
      SoundManager.playClick(currentSettings.soundType as any);
    }
  }, [currentCount, currentSettings?.soundEnabled, currentSettings?.soundType]);

  // Shake to reset
  useEffect(() => {
    if (!shakeToReset || !isShakeDetectionSupported()) return;
    const cleanup = initShakeDetection(() => {
      if (currentCount > 0 && window.confirm('Reset counter by shaking?')) reset();
    });
    return cleanup;
  }, [shakeToReset, currentCount, reset]);

  // Wake lock
  useEffect(() => {
    if (!wakeLockEnabled || !isWakeLockSupported()) { releaseWakeLock(); return; }
    const shouldHaveWakeLock = currentCount > 0 || sessionModeType !== 'free';
    if (shouldHaveWakeLock) requestWakeLock();
    else releaseWakeLock();
    return () => { releaseWakeLock(); };
  }, [wakeLockEnabled, currentCount, sessionModeType]);

  // Volume buttons
  useEffect(() => {
    if (!volumeButtonCounting) return;
    const cleanup = initVolumeButtonListener((direction) => {
      if (direction === 'up') increment();
      else if (direction === 'down') decrement();
    });
    return cleanup;
  }, [volumeButtonCounting, increment, decrement]);

  return (
    <div className="relative flex flex-col items-center justify-between h-full w-full overflow-hidden">

      {/* Ambient background glows */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 100%, hsl(var(--primary) / 0.15) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 50% 0%, hsl(var(--primary) / 0.05) 0%, transparent 70%)
          `,
        }}
      />

      {/* Subtle geometric pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${(currentSettings.primary || '#d97706').replace('#', '%23')}' fill-opacity='1'%3E%3Cpath d='M30 0l30 17.32v34.64L30 60 0 51.96V17.32L30 0zm0 4L4 19.2v26.4L30 56l26-10.4V19.2L30 4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Top section: Hijri date banner + Dhikr label */}
      <div className="w-full flex flex-col items-center justify-center z-10 pt-2 sm:pt-4 animate-fade-in-down">
        <DateBanner />
        <DhikrHeader />
        
        {/* Session Timer, Recitation Speed, & Wisdom Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5">
          <SessionTimer />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-light tracking-wide border border-primary/20 backdrop-blur-sm flex items-center gap-1.5 transition-all"
            style={{
              background: bpm > 0 ? "hsl(var(--primary) / 0.12)" : "rgba(255,255,255,0.02)",
              color: 'hsl(var(--primary) / 0.85)'
            }}
            title="Beads Per Minute (Recitation Speed)"
          >
            <span>{bpm > 0 ? '⚡' : '🧘'}</span>
            <span>
              {bpm > 0 ? `${bpm} ${t('counter.bpm')} • ${bpm < 45 ? t('counter.pace_meditative') : bpm <= 75 ? t('counter.pace_steady') : t('counter.pace_fast')}` : t('counter.pace_ready')}
            </span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowWisdom(true)}
            className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wide bg-primary/10 border border-primary/20 text-primary/80 hover:bg-primary/15 transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
          >
            <span>📖</span>
            <span>{t('hadith.title')}</span>
          </motion.button>
        </div>
      </div>

      {/* Center: Bead ring + action buttons */}
      <div className="relative flex flex-col sm:flex-row items-center justify-center w-full z-20 flex-1 gap-2 sm:gap-6 px-2">
        <CounterDisplay />
        <CounterActions />
      </div>

      {/* Bottom: Footer stats */}
      <div className="w-full flex flex-col items-center justify-center z-10 pb-2 animate-fade-in-up">
        <CounterFooter />
      </div>

      {/* Hadith/Wisdom Modal */}
      <HadithOfTheDayModal
        open={showWisdom}
        onClose={() => setShowWisdom(false)}
      />

      {/* Mood Tracker */}
      <MoodTracker
        open={showMood}
        onClose={() => setShowMood(false)}
        sessionId={lastSessionId}
        countCompleted={lastCount}
      />
    </div>
  );
});
