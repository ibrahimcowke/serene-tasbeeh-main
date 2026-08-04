import React, { useState, lazy, Suspense, useEffect } from 'react';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, Minus, Plus, Settings as SettingsIcon, 
  Clock, Heart, BookOpen, Calendar, 
  BarChart2, RefreshCw, Flame, Target, Bell, Compass, Menu, PanelLeft,
  ChevronDown, Volume2, VolumeX, Sparkles, ShieldCheck, Check
} from 'lucide-react';
import { SoundManager } from '@/lib/sound';
import hijriConverter from 'hijri-converter';
import { useSidebar } from '@/components/ui/sidebar';
import { getPrayerTimesForToday } from '@/lib/prayerTimes';

import { CounterVisuals } from '../CounterVisuals';
import { DhikrSelector } from '../DhikrSelector';
import { TargetSelector } from '../TargetSelector';
import { RemindersView } from '../RemindersView';
import { QiblaCompass } from '../QiblaCompass';
import { SettingsView } from '../SettingsView';

const WisdomModal = lazy(() => import('../WisdomModal').then(m => ({ default: m.WisdomModal })));
const NiyyahModal = lazy(() => import('../NiyyahModal').then(m => ({ default: m.NiyyahModal })));

// Nav item component with Radix ref forwarding
const SereneNavItem = React.forwardRef<HTMLButtonElement, {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isActive?: boolean;
}>(({ label, icon: Icon, onClick, isActive }, ref) => (
  <motion.button
    ref={ref}
    onClick={onClick}
    whileTap={{ scale: 0.92 }}
    className={`relative flex flex-col items-center justify-center flex-1 h-12 gap-0.5 px-2 rounded-2xl transition-all duration-300 cursor-pointer border-none outline-none group ${
      isActive
        ? 'text-primary font-bold'
        : 'text-muted-foreground hover:text-foreground'
    }`}
  >
    {isActive && (
      <motion.div
        layoutId="activeDockIndicatorSerenePro"
        className="absolute inset-0 rounded-2xl border border-primary/40"
        style={{
          background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.22), hsl(var(--primary) / 0.08))',
          boxShadow: '0 4px 18px 0 hsl(var(--primary) / 0.3)',
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
      />
    )}
    <Icon className={`w-4.5 h-4.5 z-10 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
    <span className={`text-[9px] tracking-wider uppercase z-10 ${isActive ? 'font-extrabold text-primary' : 'font-semibold text-muted-foreground'}`}>{label}</span>
  </motion.button>
));
SereneNavItem.displayName = 'SereneNavItem';

export function SereneArchDashboard() {
  const { t } = useTranslation();
  const { toggleSidebar } = useSidebar();
  
  // Active bottom dock selection
  const [activeTab, setActiveTab] = useState<'dhikr' | 'target' | 'reminders' | 'qibla' | 'menu'>('dhikr');
  
  // Store state & selectors
  const currentCount = useTasbeehStore(state => state.currentCount);
  const targetCount = useTasbeehStore(state => state.targetCount);
  const currentDhikr = useTasbeehStore(state => state.currentDhikr);
  const increment = useTasbeehStore(state => state.increment);
  const decrement = useTasbeehStore(state => state.decrement);
  const reset = useTasbeehStore(state => state.reset);
  const totalAllTime = useTasbeehStore(state => state.totalAllTime);
  const streakDays = useTasbeehStore(state => state.streakDays);
  const niyyah = useTasbeehStore(state => state.niyyah);
  const theme = useTasbeehStore(state => state.theme);
  const themeSettings = useTasbeehStore(state => state.themeSettings[theme] || defaultThemeSettings);
  const toggleSoundAction = useTasbeehStore(state => state.toggleSound);
  const counterShape = useTasbeehStore(state => state.counterShape);
  const counterVerticalOffset = useTasbeehStore(state => state.counterVerticalOffset);
  const counterScale = useTasbeehStore(state => state.counterScale);
  const countFontSize = useTasbeehStore(state => state.countFontSize);

  // Modals
  const [showWisdom, setShowWisdom] = useState(false);
  const [showNiyyah, setShowNiyyah] = useState(false);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; time: string } | null>(null);

  // Calculate rounds
  const ROUND_SIZE = 33;
  const roundsDone = Math.floor(currentCount / ROUND_SIZE);

  // Date banner calculations
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  const gregorianStr = today.toLocaleDateString('en-US', options);
  
  let hijriStr = '';
  try {
    const h = hijriConverter.toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const hijriMonths = ['Muharram', 'Safar', 'Rabi I', 'Rabi II', 'Jumada I', 'Jumada II', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];
    hijriStr = `${h.hd} ${hijriMonths[h.hm - 1] || 'Safar'} ${h.hy}`;
  } catch {
    hijriStr = '16 Safar 1448';
  }

  // Fetch next prayer time
  useEffect(() => {
    getPrayerTimesForToday().then(times => {
      if (!times || times.length === 0) return;
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();
      const upcoming = times.find(p => {
        const [h, m] = p.time.split(':').map(Number);
        return h * 60 + m > currentMin;
      }) || times[0];
      if (upcoming) setNextPrayer(upcoming);
    }).catch(console.error);
  }, []);

  // Handle tap count with sound
  const handleTapCount = () => {
    increment();
    if (themeSettings?.soundEnabled) {
      SoundManager.playClick(themeSettings.soundType as any || 'click');
    }
  };

  // Toggle sound shortcut
  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSoundAction();
  };

  // Progress percent
  const progressPercent = Math.min(100, Math.max(0, (currentCount / (targetCount || 33)) * 100));

  return (
    <div className="h-dvh w-full bg-background text-foreground flex flex-col items-center justify-between overflow-hidden relative select-none pt-safe pt-3 pb-[calc(5.8rem+env(safe-area-inset-bottom,16px))]">
      
      {/* Ambient Arch Glow Orbs */}
      <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[350px] sm:w-[480px] h-[350px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[250px] h-[250px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER BAR                                                           */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 z-20 px-4 pt-1 pb-2 shrink-0">
        
        {/* Left: Menu Sidebar Trigger */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-1.5 bg-card/80 border border-border/60 px-3 py-1.5 rounded-2xl shadow-xs hover:bg-card hover:border-primary/40 active:scale-95 transition-all text-xs font-bold text-foreground cursor-pointer group"
          title="Open Sidebar"
        >
          <PanelLeft className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-extrabold">Menu</span>
        </button>

        {/* Center: Hijri & Gregorian Date Banner */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-primary/10 to-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-2xl shadow-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <div className="flex flex-col items-center leading-none">
            <span className="font-extrabold text-[10px] text-amber-700 dark:text-amber-300 tracking-wide">{hijriStr}</span>
            <span className="text-[8.5px] text-muted-foreground font-semibold mt-0.5">{gregorianStr}</span>
          </div>
        </div>

        {/* Right: Sound Toggle Button */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border shadow-xs transition-all text-[11px] font-bold cursor-pointer active:scale-95 ${
            themeSettings?.soundEnabled
              ? 'bg-primary/15 border-primary/30 text-primary'
              : 'bg-card/60 border-border/50 text-muted-foreground'
          }`}
          title={themeSettings?.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {themeSettings?.soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-primary" />
              <span>Sound</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
              <span>Muted</span>
            </>
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN DASHBOARD CONTENT AREA                                             */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full max-w-md overflow-y-auto px-4 py-1 space-y-3 custom-scrollbar flex flex-col justify-between z-10 my-auto">

        {/* Selected Dhikr Banner Card */}
        <DhikrSelector>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full bg-gradient-to-b from-card/95 to-card/80 border border-primary/25 shadow-md rounded-3xl p-3.5 flex flex-col items-center text-center gap-1.5 cursor-pointer hover:border-primary/50 transition-all group shrink-0 relative overflow-hidden"
          >
            {/* Top Arch Floral Ornament */}
            <div className="flex items-center gap-2 opacity-80">
              <div className="h-px w-8 bg-gradient-to-r from-transparent to-amber-500" />
              <span className="text-[9.5px] tracking-widest text-amber-600 dark:text-amber-400 uppercase font-black">
                ✨ Selected Dhikr
              </span>
              <div className="h-px w-8 bg-gradient-to-l from-transparent to-amber-500" />
            </div>

            {/* Arabic Calligraphy */}
            <motion.h1
              key={currentDhikr.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-arabic text-2xl sm:text-3xl text-foreground font-bold leading-relaxed my-0 drop-shadow-xs"
            >
              {currentDhikr.arabic}
            </motion.h1>

            {/* Transliteration & Switch Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary italic">
              <span>{currentDhikr.transliteration}</span>
              <ChevronDown className="w-3.5 h-3.5 text-primary group-hover:translate-y-0.5 transition-transform" />
            </div>
            
            <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-xs font-medium">
              {currentDhikr.translation}
            </p>
          </motion.div>
        </DhikrSelector>

        {/* PRO ISLAMIC ARCH HERO COUNTER WIDGET */}
        <div className="w-full bg-gradient-to-b from-card/90 via-card/95 to-card/90 border border-border/80 shadow-xl rounded-3xl p-4 flex flex-col items-center justify-between relative shrink-0 overflow-hidden">
          
          {/* Architectural Arch Mihrab Apex Badge */}
          <div className="flex items-center gap-1 bg-background/90 border border-amber-500/40 rounded-full px-3 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-300 shadow-xs z-10">
            <span>🕌</span>
            <span className="uppercase tracking-wider">Mihrab Counter</span>
          </div>

          {/* Mihrab Arch SVG Outline Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <svg width="260" height="260" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5 C25 25 15 40 15 90 L85 90 C85 40 75 25 50 5 Z" stroke="currentColor" strokeWidth="2" className="text-primary" />
            </svg>
          </div>

          {/* Interactive Counter Shape Display */}
          <div className="relative w-full flex items-center justify-center min-h-[175px] sm:min-h-[195px] max-h-[210px] overflow-hidden py-1 z-10">
            <CounterVisuals
              counterShape={counterShape}
              counterVerticalOffset={counterVerticalOffset || 0}
              counterScale={(counterScale || 1) * 0.88}
              progress={progressPercent}
              currentCount={currentCount}
              currentSettings={themeSettings}
              countFontSize={(countFontSize || 1) * 0.9}
              handleTap={handleTapCount}
              showCompletion={currentCount >= targetCount && targetCount > 0}
              disabled={false}
            />
          </div>

          {/* Target Progress Pill & Selector */}
          <TargetSelector>
            <div className="flex items-center gap-2 bg-gradient-to-r from-primary/15 to-emerald-500/15 border border-primary/30 px-4 py-1 rounded-full shadow-xs cursor-pointer hover:border-primary transition-all z-10">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-xs font-black text-foreground">
                {currentCount} / {targetCount}
              </span>
              <span className="text-[10px] text-muted-foreground font-bold font-mono">
                ({Math.round(progressPercent)}%)
              </span>
            </div>
          </TargetSelector>

          {/* 5 Ergonomic Touch Action Buttons */}
          <div className="w-full flex items-center justify-around gap-2 px-1 mt-3 z-10">
            {/* Reset */}
            <button
              onClick={reset}
              className="w-9 h-9 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 active:scale-92 transition-all cursor-pointer shadow-xs"
              title="Reset Counter"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Undo */}
            <button
              onClick={decrement}
              className="w-9 h-9 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 active:scale-92 transition-all cursor-pointer shadow-xs"
              title="Undo Count"
            >
              <Minus className="w-4 h-4" />
            </button>

            {/* Center Master Bead Tap Button */}
            <button
              onClick={handleTapCount}
              className="w-13 h-13 rounded-full bg-gradient-to-br from-primary via-emerald-600 to-teal-700 border-2 border-primary-foreground/30 shadow-lg shadow-primary/30 flex items-center justify-center text-white active:scale-92 transition-all cursor-pointer"
              title="Tap to Count"
            >
              <span className="text-2xl">📿</span>
            </button>

            {/* Add */}
            <button
              onClick={increment}
              className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 active:scale-92 transition-all cursor-pointer shadow-xs"
              title="Add Count"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Settings */}
            <SettingsView>
              <button
                className="w-9 h-9 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 active:scale-92 transition-all cursor-pointer shadow-xs"
                title="Open Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </SettingsView>
          </div>
        </div>

        {/* 4 PRO QUICK UTILITY CARDS GRID */}
        <div className="w-full grid grid-cols-4 gap-2 shrink-0">
          {/* Intention (Niyyah) */}
          <div
            onClick={() => setShowNiyyah(true)}
            className="p-2 rounded-2xl bg-rose-500/10 border border-rose-500/25 flex flex-col items-center justify-center text-center cursor-pointer hover:border-rose-500/50 transition-all shadow-xs"
          >
            <Heart className={`w-4 h-4 mb-0.5 ${niyyah ? 'text-rose-500 fill-rose-500' : 'text-rose-500'}`} />
            <span className="text-[10px] font-extrabold text-foreground leading-none">Intention</span>
            <span className="text-[8px] text-muted-foreground font-semibold mt-0.5">{niyyah ? 'Active' : 'Set'}</span>
          </div>

          {/* Spiritual Wisdom */}
          <div
            onClick={() => setShowWisdom(true)}
            className="p-2 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex flex-col items-center justify-center text-center cursor-pointer hover:border-purple-500/50 transition-all shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-purple-500 mb-0.5" />
            <span className="text-[10px] font-extrabold text-foreground leading-none">Wisdom</span>
            <span className="text-[8px] text-muted-foreground font-semibold mt-0.5">Insight</span>
          </div>

          {/* Reminders View */}
          <RemindersView>
            <div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex flex-col items-center justify-center text-center cursor-pointer hover:border-amber-500/50 transition-all shadow-xs">
              <Bell className="w-4 h-4 text-amber-500 mb-0.5" />
              <span className="text-[10px] font-extrabold text-foreground leading-none">Alarms</span>
              <span className="text-[8px] text-muted-foreground font-semibold mt-0.5">Voice</span>
            </div>
          </RemindersView>

          {/* Qibla Compass */}
          <QiblaCompass>
            <div className="p-2 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex flex-col items-center justify-center text-center cursor-pointer hover:border-teal-500/50 transition-all shadow-xs">
              <Compass className="w-4 h-4 text-teal-500 mb-0.5" />
              <span className="text-[10px] font-extrabold text-foreground leading-none">Qibla</span>
              <span className="text-[8px] text-muted-foreground font-semibold mt-0.5">
                {nextPrayer ? nextPrayer.name : 'Kaaba'}
              </span>
            </div>
          </QiblaCompass>
        </div>

        {/* 3-STAT SUMMARY STRIP */}
        <div className="w-full bg-card/90 border border-border shadow-xs rounded-2xl p-2.5 grid grid-cols-3 gap-2 text-center shrink-0">
          <div className="flex flex-col items-center bg-indigo-500/10 p-1.5 rounded-xl border border-indigo-500/20">
            <BarChart2 className="w-4 h-4 text-indigo-500 mb-0.5" />
            <span className="text-sm font-black text-foreground tabular-nums">{totalAllTime}</span>
            <span className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider">Total Today</span>
          </div>

          <div className="flex flex-col items-center bg-teal-500/10 p-1.5 rounded-xl border border-teal-500/20">
            <RefreshCw className="w-4 h-4 text-teal-500 mb-0.5" />
            <span className="text-sm font-black text-foreground tabular-nums">{roundsDone}</span>
            <span className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider">Rounds (33s)</span>
          </div>

          <div className="flex flex-col items-center bg-orange-500/10 p-1.5 rounded-xl border border-orange-500/20">
            <Flame className="w-4 h-4 text-orange-500 mb-0.5" />
            <span className="text-sm font-black text-foreground tabular-nums">{streakDays}</span>
            <span className="text-[8px] font-extrabold text-muted-foreground uppercase tracking-wider">Day Streak</span>
          </div>
        </div>

        {/* QURANIC VERSE BANNER */}
        <div className="w-full bg-gradient-to-r from-emerald-500/10 via-primary/10 to-amber-500/10 border border-primary/20 shadow-xs rounded-2xl p-2.5 text-center relative overflow-hidden shrink-0">
          <p className="font-arabic text-base text-foreground font-bold leading-tight mb-0.5">
            أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
          </p>
          <p className="text-[10px] text-muted-foreground italic font-medium leading-tight">
            Verily, in the remembrance of Allah do hearts find rest. <span className="text-amber-500 font-bold font-mono text-[9px]">(13:28)</span>
          </p>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* 3. FIXED BOTTOM NAVIGATION GLASS DOCK                                       */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      <div 
        className="fixed left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md z-50 pointer-events-auto"
        style={{
          bottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))'
        }}
      >
        <div
          className="flex justify-around items-center h-15 px-3 rounded-3xl border transition-all duration-300 shadow-2xl"
          style={{
            background: 'hsl(var(--card) / 0.85)',
            borderColor: 'hsl(var(--primary) / 0.3)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 20px 48px -8px rgba(0, 0, 0, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)',
          }}
        >
          <DhikrSelector>
            <SereneNavItem
              label={t('nav.dhikr') || 'DHIKR'}
              icon={BookOpen}
              isActive={activeTab === 'dhikr'}
              onClick={() => setActiveTab('dhikr')}
            />
          </DhikrSelector>

          <TargetSelector>
            <SereneNavItem
              label={t('nav.target') || 'TARGET'}
              icon={Target}
              isActive={activeTab === 'target'}
              onClick={() => setActiveTab('target')}
            />
          </TargetSelector>

          <RemindersView>
            <SereneNavItem
              label={t('nav.reminders') || 'REMINDERS'}
              icon={Bell}
              isActive={activeTab === 'reminders'}
              onClick={() => setActiveTab('reminders')}
            />
          </RemindersView>

          <QiblaCompass>
            <SereneNavItem
              label={t('nav.qibla') || 'QIBLA'}
              icon={Compass}
              isActive={activeTab === 'qibla'}
              onClick={() => setActiveTab('qibla')}
            />
          </QiblaCompass>

          <SettingsView>
            <SereneNavItem
              label={t('nav.menu') || 'MENU'}
              icon={Menu}
              isActive={activeTab === 'menu'}
              onClick={() => setActiveTab('menu')}
            />
          </SettingsView>
        </div>
      </div>

      {/* Modals */}
      {showWisdom && (
        <Suspense fallback={null}>
          <WisdomModal open={showWisdom} onClose={() => setShowWisdom(false)} />
        </Suspense>
      )}

      {showNiyyah && (
        <Suspense fallback={null}>
          <NiyyahModal open={showNiyyah} onClose={() => setShowNiyyah(false)} />
        </Suspense>
      )}
    </div>
  );
}
