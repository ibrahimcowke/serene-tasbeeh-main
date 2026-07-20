import { useEffect, memo, useState, useRef, useMemo } from 'react';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';
import { SoundManager } from '@/lib/sound';
import { initShakeDetection, isShakeDetectionSupported } from '@/lib/shakeDetection';
import { requestWakeLock, releaseWakeLock, isWakeLockSupported } from '@/lib/wakeLock';
import { initVolumeButtonListener } from '@/lib/volumeButtons';
import { DhikrHeader } from './counter/DhikrHeader';
import { CounterDisplay } from './counter/CounterDisplay';
import { CounterActions } from './counter/CounterActions';
import { CounterFooter } from './counter/CounterFooter';
import { WisdomModal } from './WisdomModal';
import { NiyyahModal } from './NiyyahModal';
import { MoodTracker } from './MoodTracker';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { HadithSlider } from './HadithSlider';
import { HandPlatter } from 'lucide-react';
import { SessionTimer } from './SessionTimer';


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

const toArabicNumerals = (n: number, isRTL: boolean): string => {
  if (!isRTL) return n.toString();
  const d = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return n.toString().split('').map(c => d[parseInt(c)] ?? c).join('');
};

export const Counter = memo(function Counter({ className = "" }: { className?: string }) {
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
  const currentDhikr = useTasbeehStore(state => state.currentDhikr);
  const hadithSlidePosition = useTasbeehStore(state => state.hadithSlidePosition);
  const niyyah = useTasbeehStore(state => state.niyyah);
  const startTasbih100 = useTasbeehStore(state => state.startTasbih100);

  const showMood = useTasbeehStore(state => state.showMoodTracker);
  const setShowMood = useTasbeehStore(state => state.setShowMoodTracker);
  const [showWisdom, setShowWisdom] = useState(false);
  const [showNiyyah, setShowNiyyah] = useState(false);
  const [lastSessionId, setLastSessionId] = useState('');
  const [lastCount, setLastCount] = useState(0);

  // Memoize SVG pattern — avoid recomputing the data-URI string every render
  const geomPattern = useMemo(() =>
    `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${(currentSettings.primary || '#d97706').replace('#', '%23')}' fill-opacity='1'%3E%3Cpath d='M30 0l30 17.32v34.64L30 60 0 51.96V17.32L30 0zm0 4L4 19.2v26.4L30 56l26-10.4V19.2L30 4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
  , [currentSettings.primary]);

  const { t, isRTL } = useTranslation();
  const prevCountRef = useRef(currentCount);

  const totalAllTime = useTasbeehStore(state => state.totalAllTime);
  const streakDays = useTasbeehStore(state => state.streakDays);
  const ROUND_SIZE = 33;
  const roundsDone = Math.floor(currentCount / ROUND_SIZE);

  const [isShortScreen, setIsShortScreen] = useState(false);
  useEffect(() => {
    const checkSize = () => {
      const heightThreshold = sessionModeType !== 'free' ? 820 : 760;
      setIsShortScreen(window.innerHeight < heightThreshold && window.innerWidth < 768);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, [currentCount, sessionModeType]);

  // Voice announcements on milestones
  useEffect(() => {
    if (voiceAnnouncementsEnabled && currentCount > 0) {
      if ([33, 99, 100, 500, 1000].includes(currentCount)) {
        announceMilestone(currentCount, language);
      }
    }
  }, [currentCount, voiceAnnouncementsEnabled, language]);

  useEffect(() => {
    prevCountRef.current = currentCount;
  }, [currentCount]);

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
    <div className={`relative flex flex-col items-center justify-between w-full ${className}`}>

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

      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.025]"
        style={{ backgroundImage: geomPattern }}
      />

      {/* Top section: Dhikr label */}
      <div className="w-full flex flex-col items-center justify-center z-10 pt-2 sm:pt-4 animate-fade-in-down">
        <DhikrHeader />
        
        {/* Session Timer & Wisdom Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-1.5 sm:mt-2.5">
          <SessionTimer />

          {/* Intention Pill */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowNiyyah(true)}
            className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium tracking-wide bg-primary/10 border border-primary/20 text-primary/80 hover:bg-primary/15 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>❤️</span>
            <span>{niyyah ? t('niyyah.intention_set') : t('niyyah.set_intention')}</span>
          </motion.button>


          {/* Wisdom Pill */}
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
      <div className={`relative flex ${(isShortScreen && sessionModeType !== 'tasbih100' && sessionModeType !== 'tasbih1000') ? 'flex-row' : 'flex-col'} sm:flex-row items-center justify-center w-full z-20 flex-1 gap-2 sm:gap-6 px-2`}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
          <CounterDisplay />
          <CounterActions />
        </div>
        {(isShortScreen && sessionModeType !== 'tasbih100' && sessionModeType !== 'tasbih1000') && (
          <div className="flex flex-col justify-center items-center gap-5 pl-3 border-l border-primary/15 min-w-[70px]">
            {/* All time count */}
            <div className="flex flex-col items-center">
              <span
                className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm font-bold`}
                style={{
                  color: 'hsl(var(--primary))',
                  textShadow: '0 0 10px hsl(var(--primary) / 0.4)'
                }}
              >
                {toArabicNumerals(totalAllTime, isRTL)}
              </span>
              <span className="text-foreground/60 text-[8px] font-semibold uppercase tracking-wider text-center">
                {t('counter.total')}
              </span>
            </div>

            {/* Current session rounds */}
            <div className="flex flex-col items-center">
              <span
                className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm font-bold`}
                style={{
                  color: 'hsl(var(--primary))',
                  textShadow: '0 0 10px hsl(var(--primary) / 0.4)'
                }}
              >
                {toArabicNumerals(roundsDone, isRTL)}
              </span>
              <span className="text-foreground/60 text-[8px] font-semibold uppercase tracking-wider text-center">
                {t('counter.rounds')}
              </span>
            </div>

            {/* Streak */}
            <div className="flex flex-col items-center">
              <span
                className={`${isRTL ? 'font-arabic' : 'font-sans'} text-sm font-bold`}
                style={{
                  color: 'hsl(var(--primary))',
                  textShadow: '0 0 10px hsl(var(--primary) / 0.4)'
                }}
              >
                {toArabicNumerals(streakDays, isRTL)}
              </span>
              <span className="text-foreground/60 text-[8px] font-semibold uppercase tracking-wider text-center">
                {t('counter.streak')}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Footer stats */}
      <div className="w-full flex flex-col items-center justify-center z-10 pb-3 sm:pb-2 animate-fade-in-up gap-3 mt-3 sm:mt-6">
        <CounterFooter hideStats={isShortScreen} />
      </div>

      {/* Wisdom Modal */}
      <WisdomModal
        open={showWisdom}
        onClose={() => setShowWisdom(false)}
      />

      {/* Niyyah Modal */}
      <NiyyahModal
        open={showNiyyah}
        onClose={() => setShowNiyyah(false)}
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
