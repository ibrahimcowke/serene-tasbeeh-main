import React, { useState, lazy, Suspense } from 'react';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { motion } from 'framer-motion';
import { 
  RotateCcw, Minus, Plus, Settings as SettingsIcon, 
  Clock, Heart, BookOpen, Calendar, 
  BarChart2, RefreshCw, Flame, Target, Bell, Compass, Menu, PanelLeft,
  ChevronDown, Volume2, VolumeX, Sparkles
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
  const { t } = useTranslation();
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
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
  const gregorianStr = today.toLocaleDateString('en-US', options);
  
  let hijriStr = '';
  try {
    const h = hijriConverter.toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const hijriMonths = ['Muharram', 'Safar', 'Rabi I', 'Rabi II', 'Jumada I', 'Jumada II', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];
    hijriStr = `${h.hd} ${hijriMonths[h.hm - 1] || 'Safar'} ${h.hy}`;
  } catch {
    hijriStr = '16 Safar 1448';
  }

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

  return (
    <div className="h-dvh w-full bg-background text-foreground flex flex-col items-center justify-between overflow-hidden relative select-none pt-safe pt-4 sm:pt-6 pb-[calc(4.8rem+env(safe-area-inset-bottom,0px))]">
      
      {/* 1. Top Header Bar (With generous top breathing space) */}
      <div className="w-full max-w-md flex items-center justify-between gap-2 z-20 px-3 pt-2 pb-1 shrink-0">
        {/* Left: Menu Sidebar Trigger */}
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-xl shadow-2xs hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-95 transition-all text-xs font-semibold text-emerald-700 dark:text-emerald-300 cursor-pointer group"
          title="Open Sidebar"
        >
          <PanelLeft className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-[10px] text-emerald-700 dark:text-emerald-300">Menu</span>
        </button>

        {/* Center: Date Banner */}
        <div className="flex items-center gap-1.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-xl shadow-2xs text-xs">
          <Calendar className="w-3.5 h-3.5 text-amber-500" />
          <div className="flex flex-col leading-none">
            <span className="font-bold text-[10px] text-amber-700 dark:text-amber-300">{hijriStr}</span>
            <span className="text-[8px] text-slate-500 dark:text-slate-400 font-medium">{gregorianStr}</span>
          </div>
        </div>

        {/* Right: Quick Sound Toggle Shortcut */}
        <button
          onClick={toggleSound}
          className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border shadow-2xs transition-all text-[10px] font-bold cursor-pointer active:scale-95 ${
            themeSettings?.soundEnabled
              ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300'
              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
          }`}
          title={themeSettings?.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {themeSettings?.soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-teal-500" />
              <span>Sound</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
              <span>Muted</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Main Dashboard Content (Positioned towards bottom near bottom menu bar) */}
      <div className="flex-1 w-full max-w-md overflow-y-auto px-3 py-1 space-y-2 custom-scrollbar flex flex-col items-center justify-end z-10 my-auto">
        
        {/* Dhikr Switcher Card */}
        <DhikrSelector>
          <div className="w-full bg-card/95 border border-border/80 shadow-sm rounded-2xl p-2.5 flex flex-col items-center text-center gap-1 cursor-pointer hover:border-emerald-500/40 transition-all group shrink-0">
            <div className="flex items-center gap-1.5 opacity-75">
              <div className="h-px w-5 bg-amber-400" />
              <span className="text-[9px] tracking-widest text-amber-600 dark:text-amber-400 uppercase font-bold">Selected Dhikr</span>
              <div className="h-px w-5 bg-amber-400" />
            </div>

            <motion.h1
              key={currentDhikr.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-arabic text-xl sm:text-2xl text-emerald-800 dark:text-emerald-200 font-bold leading-tight my-0"
            >
              {currentDhikr.arabic}
            </motion.h1>

            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 italic">
              <span>{currentDhikr.transliteration}</span>
              <ChevronDown className="w-3 h-3 text-amber-500 group-hover:translate-y-0.5 transition-transform" />
            </div>
            
            <p className="text-[9px] text-slate-600 dark:text-slate-400 line-clamp-1">
              {currentDhikr.translation}
            </p>
          </div>
        </DhikrSelector>

        {/* 3 Action Utility Cards (Timer, Intention, Wisdom) */}
        <div className="w-full grid grid-cols-3 gap-1.5 shrink-0">
          {/* Card 1: Timer (Sky Blue) */}
          <div className="bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl p-1.5 flex items-center gap-1 shadow-2xs cursor-pointer hover:border-sky-400 transition-all">
            <Clock className="w-3.5 h-3.5 text-sky-500 shrink-0" />
            <div className="flex flex-col min-w-0 leading-none">
              <span className="text-[9px] font-bold text-sky-700 dark:text-sky-300 truncate">Timer</span>
              <span className="text-[7.5px] text-sky-600/80 dark:text-sky-400/80 truncate">Off</span>
            </div>
          </div>

          {/* Card 2: Set Intention (Rose Ruby) */}
          <div
            onClick={() => setShowNiyyah(true)}
            className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl p-1.5 flex items-center gap-1 shadow-2xs cursor-pointer hover:border-rose-400 transition-all"
          >
            <Heart className={`w-3.5 h-3.5 shrink-0 ${niyyah ? 'text-rose-500 fill-rose-500' : 'text-rose-500'}`} />
            <div className="flex flex-col min-w-0 leading-none">
              <span className="text-[9px] font-bold text-rose-700 dark:text-rose-300 truncate">Intention</span>
              <span className="text-[7.5px] text-rose-600/80 dark:text-rose-400/80 truncate">{niyyah ? 'Active' : 'Start'}</span>
            </div>
          </div>

          {/* Card 3: Spiritual Wisdom (Violet Purple) */}
          <div
            onClick={() => setShowWisdom(true)}
            className="bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl p-1.5 flex items-center gap-1 shadow-2xs cursor-pointer hover:border-purple-400 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-500 shrink-0" />
            <div className="flex flex-col min-w-0 leading-none">
              <span className="text-[9px] font-bold text-purple-700 dark:text-purple-300 truncate">Wisdom</span>
              <span className="text-[7.5px] text-purple-600/80 dark:text-purple-400/80 truncate">Insight</span>
            </div>
          </div>
        </div>

        {/* Counter Workspace Box (Renders all shapes & adapts to all themes) */}
        <div className="w-full bg-card/95 border border-border shadow-md rounded-2xl p-3 flex flex-col items-center justify-center relative shrink-0">
          
          {/* Crescent Moon Apex Decor */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-background border border-amber-300 dark:border-amber-700 rounded-full px-2 py-0 text-[10px] text-amber-400 shadow-2xs">
            ✨
          </div>

          {/* Render Counter Shape Visual */}
          <div className="relative w-full flex items-center justify-center min-h-[165px] sm:min-h-[185px] max-h-[200px] overflow-hidden py-1">
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

          {/* Target Progress Pill */}
          <TargetSelector>
            <div className="flex items-center gap-1.5 mt-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-3 py-0.5 rounded-full shadow-2xs cursor-pointer hover:border-emerald-400 transition-colors">
              <Target className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300">
                {currentCount} / {targetCount}
              </span>
            </div>
          </TargetSelector>

          {/* 5 Ergonomic Action Buttons */}
          <div className="w-full flex items-center justify-around gap-1.5 px-1 mt-2">
            {/* Reset (Amber Orange) */}
            <button
              onClick={reset}
              className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 hover:bg-amber-200 active:scale-95 transition-all cursor-pointer shadow-2xs"
              title="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Undo (Rose Pink) */}
            <button
              onClick={decrement}
              className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400 hover:bg-rose-200 active:scale-95 transition-all cursor-pointer shadow-2xs"
              title="Undo"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            {/* Center Main Circular Bead Action Button (Vibrant Emerald Gradient) */}
            <button
              onClick={handleTapCount}
              className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 border-2 border-emerald-300/60 shadow-md shadow-emerald-700/30 flex items-center justify-center text-white active:scale-95 transition-all cursor-pointer"
              title="Tap to Count"
            >
              <span className="text-xl">📿</span>
            </button>

            {/* Add (Emerald Green) */}
            <button
              onClick={increment}
              className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 active:scale-95 transition-all cursor-pointer shadow-2xs"
              title="Add"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>

            {/* Settings (Indigo Blue) */}
            <SettingsView>
              <button
                className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 active:scale-95 transition-all cursor-pointer shadow-2xs"
                title="Settings"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
              </button>
            </SettingsView>
          </div>
        </div>

        {/* Daily Stats Summary Strip */}
        <div className="w-full bg-card border border-border shadow-2xs rounded-xl p-2 grid grid-cols-3 gap-1.5 text-center shrink-0">
          <div className="flex flex-col items-center bg-indigo-50/50 dark:bg-indigo-950/20 p-1 rounded-lg border border-indigo-100 dark:border-indigo-900/40">
            <BarChart2 className="w-3.5 h-3.5 text-indigo-500 mb-0.5" />
            <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300">{totalAllTime}</span>
            <span className="text-[7.5px] font-bold text-indigo-500/80 uppercase">TOTAL Today</span>
          </div>

          <div className="flex flex-col items-center bg-teal-50/50 dark:bg-teal-950/20 p-1 rounded-lg border border-teal-100 dark:border-teal-900/40">
            <RefreshCw className="w-3.5 h-3.5 text-teal-500 mb-0.5" />
            <span className="text-xs font-extrabold text-teal-700 dark:text-teal-300">{roundsDone}</span>
            <span className="text-[7.5px] font-bold text-teal-500/80 uppercase">ROUNDS</span>
          </div>

          <div className="flex flex-col items-center bg-orange-50/50 dark:bg-orange-950/20 p-1 rounded-lg border border-orange-100 dark:border-orange-900/40">
            <Flame className="w-3.5 h-3.5 text-orange-500 mb-0.5" />
            <span className="text-xs font-extrabold text-orange-600 dark:text-orange-400">{streakDays}</span>
            <span className="text-[7.5px] font-bold text-orange-500/80 uppercase">STREAK</span>
          </div>
        </div>

        {/* Quran Verse Inspiration Card */}
        <div className="w-full bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 shadow-2xs rounded-xl p-2 text-center relative overflow-hidden shrink-0">
          <span className="text-base text-amber-500/40 font-serif absolute top-0.5 left-2">“</span>
          <p className="font-arabic text-sm text-emerald-800 dark:text-emerald-200 leading-snug mb-0.5">
            أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ
          </p>
          <p className="text-[9px] text-teal-800/80 dark:text-teal-200/80 italic mb-0.5 leading-tight">
            Verily, in the remembrance of Allah do hearts find rest.
          </p>
          <span className="text-[7.5px] font-bold text-amber-600 dark:text-amber-400 block">(Quran 13:28)</span>
        </div>
      </div>

      {/* 3. Fixed Bottom Navigation Bar (5 Color Accent Themes) */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md bg-card/95 backdrop-blur-md border border-border shadow-lg rounded-2xl p-1.5 grid grid-cols-5 gap-1 text-center z-50">
        <DhikrSelector>
          <button
            onClick={() => setActiveTab('dhikr')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer w-full ${
              activeTab === 'dhikr'
                ? 'bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-md shadow-emerald-700/25 scale-[1.03]'
                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
          >
            <BookOpen className={`w-4 h-4 mt-0.5 ${activeTab === 'dhikr' ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'}`} />
            <span className={`text-[9px] uppercase mt-0.5 ${activeTab === 'dhikr' ? 'font-extrabold text-white tracking-wider' : 'font-bold'}`}>DHIKR</span>
          </button>
        </DhikrSelector>

        <TargetSelector>
          <button
            onClick={() => setActiveTab('target')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer w-full ${
              activeTab === 'target'
                ? 'bg-gradient-to-br from-sky-600 to-blue-700 text-white shadow-md shadow-sky-600/25 scale-[1.03]'
                : 'text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40'
            }`}
          >
            <Target className={`w-4 h-4 mt-0.5 ${activeTab === 'target' ? 'text-sky-200' : 'text-sky-600 dark:text-sky-400'}`} />
            <span className={`text-[9px] uppercase mt-0.5 ${activeTab === 'target' ? 'font-extrabold text-white tracking-wider' : 'font-bold'}`}>TARGET</span>
          </button>
        </TargetSelector>

        <RemindersView>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer w-full ${
              activeTab === 'reminders'
                ? 'bg-gradient-to-br from-amber-500 to-orange-700 text-white shadow-md shadow-amber-600/25 scale-[1.03]'
                : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
            }`}
          >
            <Bell className={`w-4 h-4 mt-0.5 ${activeTab === 'reminders' ? 'text-amber-200' : 'text-amber-600 dark:text-amber-400'}`} />
            <span className={`text-[9px] uppercase mt-0.5 ${activeTab === 'reminders' ? 'font-extrabold text-white tracking-wider' : 'font-bold'}`}>REMINDERS</span>
          </button>
        </RemindersView>

        <QiblaCompass>
          <button
            onClick={() => setActiveTab('qibla')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer w-full ${
              activeTab === 'qibla'
                ? 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-600/25 scale-[1.03]'
                : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40'
            }`}
          >
            <Compass className={`w-4 h-4 mt-0.5 ${activeTab === 'qibla' ? 'text-purple-200' : 'text-purple-600 dark:text-purple-400'}`} />
            <span className={`text-[9px] uppercase mt-0.5 ${activeTab === 'qibla' ? 'font-extrabold text-white tracking-wider' : 'font-bold'}`}>QIBLA</span>
          </button>
        </QiblaCompass>

        <SettingsView>
          <button
            onClick={() => setActiveTab('menu')}
            className={`flex flex-col items-center py-1.5 rounded-xl transition-all duration-200 cursor-pointer w-full ${
              activeTab === 'menu'
                ? 'bg-gradient-to-br from-indigo-600 to-blue-800 text-white shadow-md shadow-indigo-600/25 scale-[1.03]'
                : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
            }`}
          >
            <Menu className={`w-4 h-4 mt-0.5 ${activeTab === 'menu' ? 'text-indigo-200' : 'text-indigo-600 dark:text-indigo-400'}`} />
            <span className={`text-[9px] uppercase mt-0.5 ${activeTab === 'menu' ? 'font-extrabold text-white tracking-wider' : 'font-bold'}`}>MENU</span>
          </button>
        </SettingsView>
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
