import React, { useState, lazy, Suspense, useMemo } from 'react';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, Minus, Plus, Settings as SettingsIcon, 
  Clock, Heart, BookOpen, Calendar, 
  BarChart2, RefreshCw, Flame, Target, Bell, Compass, Menu, PanelLeft,
  ChevronDown, Volume2, VolumeX, Sparkles, Star, Zap
} from 'lucide-react';
import { SoundManager } from '@/lib/sound';
import hijriConverter from 'hijri-converter';
import { useSidebar } from '@/components/ui/sidebar';

import { CounterVisuals } from '../CounterVisuals';
import { DhikrSelector } from '../DhikrSelector';
import { TargetSelector } from '../TargetSelector';
import { RemindersView } from '../RemindersView';
import { QiblaCompass } from '../QiblaCompass';
import { SettingsView } from '../SettingsView';

const WisdomModal = lazy(() => import('../WisdomModal').then(m => ({ default: m.WisdomModal })));
const NiyyahModal = lazy(() => import('../NiyyahModal').then(m => ({ default: m.NiyyahModal })));

export function SereneArchDashboard() {
  const { t, isRTL } = useTranslation();
  const { toggleSidebar } = useSidebar();
  
  // Active tab state for bottom menu bar selection
  const [activeTab, setActiveTab] = useState<'dhikr' | 'target' | 'reminders' | 'qibla' | 'menu'>('dhikr');
  
  // Store selectors
  const currentCount = useTasbeehStore(state => state.currentCount);
  const targetCount = useTasbeehStore(state => state.targetCount);
  const currentDhikr = useTasbeehStore(state => state.currentDhikr);
  const increment = useTasbeehStore(state => state.increment);
  const decrement = useTasbeehStore(state => state.decrement);
  const reset = useTasbeehStore(state => state.reset);
  const totalAllTime = useTasbeehStore(state => state.totalAllTime);
  const streakDays = useTasbeehStore(state => state.streakDays);
  const totalHasanat = useTasbeehStore(state => state.totalHasanat);
  const niyyah = useTasbeehStore(state => state.niyyah);
  const theme = useTasbeehStore(state => state.theme);
  const themeSettings = useTasbeehStore(state => state.themeSettings[theme] || defaultThemeSettings);
  const setSoundEnabled = useTasbeehStore(state => state.setSoundEnabled);
  const counterShape = useTasbeehStore(state => state.counterShape);
  const counterVerticalOffset = useTasbeehStore(state => state.counterVerticalOffset);
  const counterScale = useTasbeehStore(state => state.counterScale);
  const countFontSize = useTasbeehStore(state => state.countFontSize);

  // Modal triggers
  const [showWisdom, setShowWisdom] = useState(false);
  const [showNiyyah, setShowNiyyah] = useState(false);

  // Calculate rounds
  const ROUND_SIZE = 33;
  const roundsDone = Math.floor(currentCount / ROUND_SIZE);

  // Date banner calculations
  const today = useMemo(() => new Date(), []);
  const gregorianStr = useMemo(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    return today.toLocaleDateString('en-US', options);
  }, [today]);
  
  const hijriStr = useMemo(() => {
    try {
      const h = hijriConverter.toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
      const hijriMonths = ['Muharram', 'Safar', 'Rabi I', 'Rabi II', 'Jumada I', 'Jumada II', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];
      return `${h.hd} ${hijriMonths[h.hm - 1] || 'Safar'} ${h.hy}`;
    } catch {
      return '16 Safar 1448';
    }
  }, [today]);

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
    setSoundEnabled(!themeSettings?.soundEnabled);
  };

  // Progress percent
  const progressPercent = Math.min(100, Math.max(0, (currentCount / (targetCount || 33)) * 100));

  // Calculated Hasanat points
  const calculatedHasanat = totalHasanat > 0 ? totalHasanat : (totalAllTime * 10);

  return (
    <div className="h-dvh w-full bg-background text-foreground flex flex-col items-center justify-between overflow-hidden relative select-none pt-safe pt-3 sm:pt-5 pb-[calc(5rem+env(safe-area-inset-bottom,0px))]">
      
      {/* Dynamic Liquid Glass Background Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-24 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-[90px]" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-amber-500/10 blur-[90px]" />
        <div className="absolute -bottom-24 left-1/4 w-96 h-96 rounded-full bg-teal-500/10 blur-[100px]" />
      </div>

      {/* 1. iOS 27 Glass Floating Top Bar */}
      <header className="w-full max-w-md flex items-center justify-between gap-2 z-20 px-3 shrink-0">
        {/* Left: Menu Sidebar Trigger */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={toggleSidebar}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-lg shadow-black/5 hover:bg-white/60 dark:hover:bg-white/10 transition-all text-xs font-semibold text-foreground cursor-pointer group"
          title="Open Sidebar"
        >
          <PanelLeft className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform" />
          <span className="font-bold text-[11px]">Menu</span>
        </motion.button>

        {/* Center: Minimal Date Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-lg shadow-black/5 text-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <div className="flex items-baseline gap-1.5 leading-none">
            <span className="font-extrabold text-[11px] text-foreground">{hijriStr}</span>
            <span className="text-[9px] text-muted-foreground font-medium hidden sm:inline">• {gregorianStr}</span>
          </div>
        </div>

        {/* Right: Quick Sound Toggle */}
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={toggleSound}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border border-white/20 dark:border-white/10 backdrop-blur-xl shadow-lg shadow-black/5 transition-all text-[11px] font-bold cursor-pointer ${
            themeSettings?.soundEnabled
              ? 'bg-primary/20 text-primary border-primary/30'
              : 'bg-white/30 dark:bg-white/5 text-muted-foreground'
          }`}
          title={themeSettings?.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {themeSettings?.soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px]">Sound</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[10px]">Muted</span>
            </>
          )}
        </motion.button>
      </header>

      {/* 2. Main Dashboard Scrollable Content */}
      <main className="flex-1 w-full max-w-md overflow-y-auto px-3 py-2 space-y-2.5 custom-scrollbar flex flex-col items-center justify-between z-10 my-auto">
        
        {/* iOS 27 Hero Dhikr Card */}
        <DhikrSelector>
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-3xl p-3.5 flex flex-col items-center text-center gap-1.5 cursor-pointer border border-white/25 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-2xl shadow-xl shadow-black/5 hover:border-primary/40 transition-all group shrink-0 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-full pointer-events-none" />

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[9px] tracking-widest text-primary uppercase font-black">ACTIVE DHIKR</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            </div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={currentDhikr.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="font-arabic text-2xl sm:text-3xl font-bold leading-relaxed text-foreground tracking-wide my-0.5"
              >
                {currentDhikr.arabic}
              </motion.h1>
            </AnimatePresence>

            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[11px] font-bold text-primary">
              <span>{currentDhikr.transliteration}</span>
              <ChevronDown className="w-3.5 h-3.5 text-primary group-hover:translate-y-0.5 transition-transform" />
            </div>
            
            <p className="text-[10px] text-muted-foreground line-clamp-1 font-medium px-2">
              {currentDhikr.translation}
            </p>
          </motion.div>
        </DhikrSelector>

        {/* iOS 27 Minimal Glass Counter Ring Box */}
        <div className="w-full rounded-3xl p-3 flex flex-col items-center justify-center relative shrink-0 border border-white/25 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/10">
          
          {/* Glass Specular Top Notch */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-full px-3 py-0.5 text-[10px] font-extrabold text-primary shadow-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>iOS 27 Glass</span>
          </div>

          {/* Interactive Counter Ring Container */}
          <div className="relative w-full flex items-center justify-center min-h-[160px] sm:min-h-[180px] max-h-[195px] overflow-hidden py-1">
            <CounterVisuals
              counterShape={counterShape}
              counterVerticalOffset={counterVerticalOffset || 0}
              counterScale={(counterScale || 1) * 0.85}
              progress={progressPercent}
              currentCount={currentCount}
              currentSettings={themeSettings}
              countFontSize={(countFontSize || 1) * 0.9}
              handleTap={handleTapCount}
              showCompletion={currentCount >= targetCount && targetCount > 0}
              disabled={false}
            />
          </div>

          {/* Target Progress Glass Pill */}
          <TargetSelector>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 mt-1.5 px-3.5 py-1 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-md shadow-sm cursor-pointer hover:bg-primary/20 transition-all"
            >
              <Target className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-black text-primary tracking-wide">
                {currentCount} / {targetCount}
              </span>
            </motion.div>
          </TargetSelector>

          {/* iOS 27 Ergonomic Glass Control Pill Dock */}
          <div className="w-full flex items-center justify-around gap-2 px-2 mt-3 pt-2 border-t border-white/15 dark:border-white/5">
            {/* Reset Action */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={reset}
              className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 hover:bg-amber-500/25 transition-all cursor-pointer shadow-sm"
              title="Reset Counter"
            >
              <RotateCcw className="w-4 h-4" />
            </motion.button>

            {/* Undo / Decrement Action */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={decrement}
              className="w-9 h-9 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-500 hover:bg-rose-500/25 transition-all cursor-pointer shadow-sm"
              title="Undo Count"
            >
              <Minus className="w-4 h-4" />
            </motion.button>

            {/* Main Center Floating Glass Count Button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleTapCount}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent border-2 border-white/40 shadow-xl shadow-primary/30 flex items-center justify-center text-white cursor-pointer relative overflow-hidden"
              title="Tap to Count"
            >
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="text-2xl"
              >
                📿
              </motion.span>
            </motion.button>

            {/* Add / Increment Action */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              onClick={increment}
              className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500 hover:bg-emerald-500/25 transition-all cursor-pointer shadow-sm"
              title="Add Count"
            >
              <Plus className="w-4 h-4" />
            </motion.button>

            {/* Settings Action */}
            <SettingsView>
              <motion.button
                whileTap={{ scale: 0.88 }}
                className="w-9 h-9 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-500 hover:bg-indigo-500/25 transition-all cursor-pointer shadow-sm"
                title="Settings"
              >
                <SettingsIcon className="w-4 h-4" />
              </motion.button>
            </SettingsView>
          </div>
        </div>

        {/* 3 Quick Utility Capsules Grid (Timer, Niyyah, Wisdom) */}
        <div className="w-full grid grid-cols-3 gap-2 shrink-0">
          {/* Card 1: Session Timer */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="rounded-2xl p-2 flex items-center gap-2 border border-sky-500/30 bg-sky-500/10 backdrop-blur-xl shadow-sm cursor-pointer hover:bg-sky-500/20 transition-all"
          >
            <div className="w-7 h-7 rounded-xl bg-sky-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="flex flex-col min-w-0 leading-none">
              <span className="text-[10px] font-bold text-sky-400 truncate">Timer</span>
              <span className="text-[8px] text-sky-300/80 truncate">Session</span>
            </div>
          </motion.div>

          {/* Card 2: Intention / Niyyah */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNiyyah(true)}
            className="rounded-2xl p-2 flex items-center gap-2 border border-rose-500/30 bg-rose-500/10 backdrop-blur-xl shadow-sm cursor-pointer hover:bg-rose-500/20 transition-all"
          >
            <div className="w-7 h-7 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
              <Heart className={`w-3.5 h-3.5 ${niyyah ? 'text-rose-400 fill-rose-400' : 'text-rose-400'}`} />
            </div>
            <div className="flex flex-col min-w-0 leading-none">
              <span className="text-[10px] font-bold text-rose-400 truncate">Intention</span>
              <span className="text-[8px] text-rose-300/80 truncate">{niyyah ? 'Active' : 'Set'}</span>
            </div>
          </motion.div>

          {/* Card 3: Spiritual Wisdom */}
          <motion.div
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowWisdom(true)}
            className="rounded-2xl p-2 flex items-center gap-2 border border-purple-500/30 bg-purple-500/10 backdrop-blur-xl shadow-sm cursor-pointer hover:bg-purple-500/20 transition-all"
          >
            <div className="w-7 h-7 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="flex flex-col min-w-0 leading-none">
              <span className="text-[10px] font-bold text-purple-400 truncate">Wisdom</span>
              <span className="text-[8px] text-purple-300/80 truncate">Hadith</span>
            </div>
          </motion.div>
        </div>

        {/* iOS 27 Glass Stats Widget Grid (4 Tiles) */}
        <div className="w-full grid grid-cols-4 gap-2 text-center shrink-0">
          {/* Tile 1: Hasanat */}
          <div className="rounded-2xl p-2 flex flex-col items-center border border-amber-500/25 bg-amber-500/10 backdrop-blur-xl shadow-sm">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400/30 mb-0.5" />
            <span className="text-xs font-black text-amber-400">{calculatedHasanat}</span>
            <span className="text-[7.5px] font-extrabold text-amber-400/80 uppercase">HASANAT</span>
          </div>

          {/* Tile 2: Total Today */}
          <div className="rounded-2xl p-2 flex flex-col items-center border border-indigo-500/25 bg-indigo-500/10 backdrop-blur-xl shadow-sm">
            <BarChart2 className="w-4 h-4 text-indigo-400 mb-0.5" />
            <span className="text-xs font-black text-indigo-400">{totalAllTime}</span>
            <span className="text-[7.5px] font-extrabold text-indigo-400/80 uppercase">TOTAL</span>
          </div>

          {/* Tile 3: Rounds */}
          <div className="rounded-2xl p-2 flex flex-col items-center border border-teal-500/25 bg-teal-500/10 backdrop-blur-xl shadow-sm">
            <RefreshCw className="w-4 h-4 text-teal-400 mb-0.5" />
            <span className="text-xs font-black text-teal-400">{roundsDone}</span>
            <span className="text-[7.5px] font-extrabold text-teal-400/80 uppercase">ROUNDS</span>
          </div>

          {/* Tile 4: Streak */}
          <div className="rounded-2xl p-2 flex flex-col items-center border border-orange-500/25 bg-orange-500/10 backdrop-blur-xl shadow-sm">
            <Flame className="w-4 h-4 text-orange-400 fill-orange-400/30 mb-0.5" />
            <span className="text-xs font-black text-orange-400">{streakDays}d</span>
            <span className="text-[7.5px] font-extrabold text-orange-400/80 uppercase">STREAK</span>
          </div>
        </div>

        {/* Daily Inspiration Glass Quote Block */}
        <div className="w-full rounded-2xl p-2.5 border border-white/20 dark:border-white/10 bg-white/30 dark:bg-white/5 backdrop-blur-xl text-center relative overflow-hidden shrink-0">
          <span className="text-xl text-amber-400/40 font-serif absolute top-0.5 left-2">“</span>
          <p className="font-arabic text-sm text-foreground leading-snug mb-0.5">
            أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
          </p>
          <p className="text-[9px] text-muted-foreground italic leading-tight">
            Verily, in the remembrance of Allah do hearts find rest.
          </p>
          <span className="text-[8px] font-bold text-amber-500 block mt-0.5">(Quran 13:28)</span>
        </div>
      </main>

      {/* 3. Floating iOS 27 Glass Dock (Bottom Nav) */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md rounded-3xl p-1.5 grid grid-cols-5 gap-1 text-center z-50 border border-white/30 dark:border-white/15 bg-white/60 dark:bg-black/60 backdrop-blur-3xl shadow-2xl shadow-black/20">
        <DhikrSelector>
          <button
            onClick={() => setActiveTab('dhikr')}
            className={`flex flex-col items-center py-2 rounded-2xl transition-all duration-300 cursor-pointer w-full ${
              activeTab === 'dhikr'
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-lg shadow-emerald-600/30 scale-[1.04]'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">DHIKR</span>
          </button>
        </DhikrSelector>

        <TargetSelector>
          <button
            onClick={() => setActiveTab('target')}
            className={`flex flex-col items-center py-2 rounded-2xl transition-all duration-300 cursor-pointer w-full ${
              activeTab === 'target'
                ? 'bg-gradient-to-tr from-sky-600 to-blue-700 text-white shadow-lg shadow-sky-600/30 scale-[1.04]'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/5'
            }`}
          >
            <Target className="w-4 h-4" />
            <span className="text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">TARGET</span>
          </button>
        </TargetSelector>

        <RemindersView>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`flex flex-col items-center py-2 rounded-2xl transition-all duration-300 cursor-pointer w-full ${
              activeTab === 'reminders'
                ? 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-600/30 scale-[1.04]'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/5'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span className="text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">NOTIFS</span>
          </button>
        </RemindersView>

        <QiblaCompass>
          <button
            onClick={() => setActiveTab('qibla')}
            className={`flex flex-col items-center py-2 rounded-2xl transition-all duration-300 cursor-pointer w-full ${
              activeTab === 'qibla'
                ? 'bg-gradient-to-tr from-purple-600 to-indigo-700 text-white shadow-lg shadow-purple-600/30 scale-[1.04]'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">QIBLA</span>
          </button>
        </QiblaCompass>

        <SettingsView>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center py-2 rounded-2xl transition-all duration-300 cursor-pointer w-full ${
              activeTab === 'menu'
                ? 'bg-gradient-to-tr from-indigo-600 to-blue-800 text-white shadow-lg shadow-indigo-600/30 scale-[1.04]'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/20 dark:hover:bg-white/5'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span className="text-[9px] font-extrabold uppercase mt-0.5 tracking-wider">MENU</span>
          </button>
        </SettingsView>
      </nav>

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
