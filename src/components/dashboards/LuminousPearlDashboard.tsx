import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, RotateCcw, Undo2, MoreHorizontal, Heart, 
  Home, BookOpen, BarChart2, Grid, ChevronDown, 
  Volume2, VolumeX, Sparkles, PanelLeft, Settings as SettingsIcon,
  Maximize2
} from 'lucide-react';
import { SoundManager } from '@/lib/sound';
import hijriConverter from 'hijri-converter';
import { useSidebar } from '@/components/ui/sidebar';

import { DhikrSelector } from '../DhikrSelector';
import { TargetSelector } from '../TargetSelector';
import { RemindersView } from '../RemindersView';
import { QiblaCompass } from '../QiblaCompass';
import { SettingsView } from '../SettingsView';
import { StatsViewContent } from '../StatsViewContent';

const WisdomModal = lazy(() => import('../WisdomModal').then(m => ({ default: m.WisdomModal })));
const NiyyahModal = lazy(() => import('../NiyyahModal').then(m => ({ default: m.NiyyahModal })));

/* ─────────────────────────────────────────────────────────────────────────── */
/* 3D Glowing Pearl Ring Counter SVG Component                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
function PearlBeadRingVisual({
  currentCount,
  targetCount = 33,
  onTap
}: {
  currentCount: number;
  targetCount: number;
  onTap: () => void;
}) {
  const TOTAL_BEADS = 33;
  const radius = 115; // Ring radius inside 300x300 viewBox
  const centerX = 150;
  const centerY = 150;

  // Calculate bead positions
  const beads = useMemo(() => {
    return Array.from({ length: TOTAL_BEADS }, (_, i) => {
      // Start from top (-90 deg / -PI/2) and spread clockwise
      const angle = (i * 2 * Math.PI) / TOTAL_BEADS - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { id: i, x, y };
    });
  }, [TOTAL_BEADS, radius, centerX, centerY]);

  const activeIndex = (currentCount - 1) % TOTAL_BEADS;

  return (
    <div 
      onClick={onTap}
      className="relative w-[290px] h-[290px] sm:w-[320px] sm:h-[320px] flex items-center justify-center cursor-pointer select-none group"
    >
      {/* SVG Pearl Ring */}
      <svg 
        viewBox="0 0 300 300" 
        className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(168,85,247,0.25)]"
      >
        <defs>
          {/* Active 3D Pearl Radial Gradient */}
          <radialGradient id="pearlGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#f472b6" />
            <stop offset="65%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#581c87" />
          </radialGradient>

          {/* Active Marker Head Bead Halo Gradient */}
          <radialGradient id="activeHeadGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#4c1d95" />
          </radialGradient>

          {/* Translucent Bubble Gradient for Incomplete Beads */}
          <radialGradient id="ghostBubble" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="70%" stopColor="rgba(192,132,252,0.04)" />
            <stop offset="100%" stopColor="rgba(15,10,30,0.4)" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="pearlGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="activeHalo" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Inner Counter Guide Circle */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={radius} 
          fill="none" 
          stroke="rgba(244, 114, 182, 0.2)" 
          strokeWidth="1.5" 
          strokeDasharray="4 4"
        />

        {/* Render 33 Pearl Beads */}
        {beads.map((bead, i) => {
          const isDone = i < (currentCount % TOTAL_BEADS === 0 && currentCount > 0 ? TOTAL_BEADS : currentCount % TOTAL_BEADS);
          const isActiveMarker = i === activeIndex && currentCount > 0;

          if (isActiveMarker) {
            return (
              <g key={bead.id}>
                {/* Pulsing Neon Halo Ring behind active bead */}
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="14"
                  fill="none"
                  stroke="#f472b6"
                  strokeWidth="2"
                  className="animate-ping opacity-75"
                />
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="15"
                  fill="none"
                  stroke="#ec4899"
                  strokeWidth="2.5"
                  filter="url(#activeHalo)"
                />
                {/* Active Glowing Pearl */}
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="10"
                  fill="url(#activeHeadGradient)"
                  filter="url(#pearlGlow)"
                />
                <circle
                  cx={bead.x - 2.5}
                  cy={bead.y - 2.5}
                  r="2.5"
                  fill="#ffffff"
                  opacity="0.9"
                />
              </g>
            );
          }

          if (isDone) {
            return (
              <g key={bead.id}>
                {/* Glow shadow under pearl */}
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="9"
                  fill="rgba(236, 72, 153, 0.4)"
                  filter="url(#pearlGlow)"
                />
                {/* Filled 3D Pearl */}
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="8.5"
                  fill="url(#pearlGradient)"
                />
                {/* Specular Light Reflection Highlight */}
                <circle
                  cx={bead.x - 2}
                  cy={bead.y - 2}
                  r="2"
                  fill="#ffffff"
                  opacity="0.85"
                />
              </g>
            );
          }

          {/* Incomplete Ghost Bubble Bead */}
          return (
            <g key={bead.id}>
              <circle
                cx={bead.x}
                cy={bead.y}
                r="7.5"
                fill="url(#ghostBubble)"
                stroke="rgba(244, 114, 182, 0.25)"
                strokeWidth="1.2"
              />
              <circle
                cx={bead.x - 1.5}
                cy={bead.y - 1.5}
                r="1.5"
                fill="#ffffff"
                opacity="0.25"
              />
            </g>
          );
        })}
      </svg>

      {/* Inside Circle Counter Typography & Glowing Indicator */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
        <motion.span
          key={currentCount}
          initial={{ scale: 0.85, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_16px_rgba(244,114,182,0.75)] font-sans"
        >
          {currentCount}
        </motion.span>

        <span className="text-xs sm:text-sm font-bold text-pink-200/80 mt-0.5 tracking-wide">
          of {targetCount}
        </span>

        {/* Small Glowing Dot Indicator */}
        <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_10px_#f472b6] animate-pulse mt-2" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Main Dashboard 3: Luminous Pearl Sanctuary                                  */
/* ─────────────────────────────────────────────────────────────────────────── */
export function LuminousPearlDashboard() {
  const { t } = useTranslation();
  const { toggleSidebar } = useSidebar();
  
  // Dock active tab state
  const [activeTab, setActiveTab] = useState<'home' | 'dhikr' | 'counter' | 'progress' | 'more'>('counter');
  const [showProgressModal, setShowProgressModal] = useState(false);

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
  const toggleSoundAction = useTasbeehStore(state => state.toggleSound);

  // Modals
  const [showWisdom, setShowWisdom] = useState(false);
  const [showNiyyah, setShowNiyyah] = useState(false);

  // Calculate rounds
  const ROUND_SIZE = 33;
  const roundsDone = Math.floor(currentCount / ROUND_SIZE);

  // Date banner calculations
  const today = new Date();
  let hijriStr = '';
  try {
    const h = hijriConverter.toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const hijriMonths = ['Muharram', 'Safar', 'Rabi I', 'Rabi II', 'Jumada I', 'Jumada II', 'Rajab', 'Sha\'ban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];
    hijriStr = `${h.hd} ${hijriMonths[h.hm - 1] || 'Safar'} ${h.hy}`;
  } catch {
    hijriStr = '8 Safar 1448';
  }

  // Handle tap count with sound
  const handleTapCount = () => {
    increment();
    if (themeSettings?.soundEnabled) {
      SoundManager.playClick(themeSettings.soundType as any || 'click');
    }
  };

  // Progress percent for bar
  const progressPercent = Math.min(100, Math.max(0, (currentCount / (targetCount || 33)) * 100));

  return (
    <div className="h-dvh w-full bg-[#0b0617] text-white flex flex-col items-center justify-between overflow-hidden relative select-none pt-safe pt-3 pb-[calc(4.8rem+env(safe-area-inset-bottom,0px))]">
      
      {/* Background Geometric Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-12 pointer-events-none bg-repeat z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f472b6' fill-opacity='0.4'%3E%3Cpath d='M30 30L15 0H0v15l30 30 30-30V0H45L30 30zM0 45h15l15 15 15-15h15v15H45L30 45 15 60H0V45z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient Purple & Pink Glowing Orbs */}
      <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[460px] h-[340px] bg-purple-600/15 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[20%] w-[220px] h-[220px] bg-pink-500/15 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER BAR                                                           */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-md flex items-center justify-between z-20 px-5 pt-1 pb-1 shrink-0">
        {/* Left: Crescent & Hijri Date */}
        <div className="flex items-center gap-2 text-white/90">
          <Moon className="w-4 h-4 text-pink-300" />
          <span className="text-sm font-bold tracking-wide">{hijriStr}</span>
        </div>

        {/* Right: Screen Off / Sidebar Action Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-xl bg-[#1d1238]/80 border border-[#3b236b] flex items-center justify-center text-pink-300 hover:bg-[#28194e] active:scale-95 transition-all shadow-xs cursor-pointer"
            title="Open Menu Sidebar"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN SCROLLABLE CONTENT BODY                                            */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      <div className="flex-1 w-full max-w-md overflow-y-auto px-5 py-1 space-y-3.5 custom-scrollbar flex flex-col justify-between items-center z-10 my-auto">

        {/* Selected Dhikr Section */}
        <DhikrSelector>
          <div className="w-full flex flex-col items-center text-center cursor-pointer group shrink-0 py-1">
            <span className="text-[10px] font-black tracking-widest text-pink-400 uppercase mb-1">
              DHIKR
            </span>

            {/* Arabic Text */}
            <motion.h1
              key={currentDhikr.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-arabic text-3xl sm:text-4xl text-white font-bold leading-tight drop-shadow-[0_0_12px_rgba(244,114,182,0.45)] mb-1"
            >
              {currentDhikr.arabic}
            </motion.h1>

            {/* Transliteration & Translation */}
            <p className="text-sm font-extrabold text-pink-300 tracking-wide">
              {currentDhikr.transliteration}
            </p>
            <p className="text-xs text-purple-250/70 font-medium mt-0.5">
              {currentDhikr.translation}
            </p>

            {/* Inline Action Links: ♡ Intention | ••• More */}
            <div className="flex items-center gap-3 text-xs text-pink-300/80 font-bold mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNiyyah(true);
                }}
                className="flex items-center gap-1 hover:text-pink-200 transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${niyyah ? 'fill-pink-400 text-pink-400' : ''}`} />
                <span>Intention</span>
              </button>

              <span className="text-purple-400/40">|</span>

              <div className="flex items-center gap-1 hover:text-pink-200 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
                <span>More</span>
              </div>
            </div>
          </div>
        </DhikrSelector>

        {/* 3D PEARL RING COUNTER WIDGET */}
        <div className="shrink-0 flex items-center justify-center py-0">
          <PearlBeadRingVisual
            currentCount={currentCount}
            targetCount={targetCount || 33}
            onTap={handleTapCount}
          />
        </div>

        {/* LINEAR PROGRESS BAR */}
        <TargetSelector>
          <div className="w-full flex items-center gap-3 px-1 shrink-0 cursor-pointer">
            <div className="flex-1 h-1.5 rounded-full bg-[#1e113b] overflow-hidden p-0.5 border border-[#3b2169]/50">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.8)]"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-bold text-pink-300 font-mono shrink-0">
              {currentCount} / {targetCount}
            </span>
          </div>
        </TargetSelector>

        {/* CONTROL ACTION BAR (Undo, Reset, Options) */}
        <div className="w-full bg-[#180d30]/90 border border-[#3b1f63]/80 rounded-2xl py-2 px-3 flex items-center justify-around shadow-lg shadow-purple-950/40 shrink-0">
          {/* Undo */}
          <button
            onClick={decrement}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-pink-200 hover:text-white active:scale-92 transition-all cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Undo</span>
          </button>

          <div className="w-px h-4 bg-purple-500/25" />

          {/* Reset */}
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-pink-200 hover:text-white active:scale-92 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
            <span>Reset</span>
          </button>

          <div className="w-px h-4 bg-purple-500/25" />

          {/* Options */}
          <SettingsView>
            <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-pink-200 hover:text-white active:scale-92 transition-all cursor-pointer">
              <MoreHorizontal className="w-4 h-4 text-pink-400" />
              <span>Options</span>
            </button>
          </SettingsView>
        </div>

        {/* STATS SUMMARY CARD (Today, Rounds, Streak) */}
        <div className="w-full bg-[#130a27]/90 border border-[#331a57]/80 rounded-3xl p-3.5 grid grid-cols-3 gap-2 text-center shadow-xl shrink-0">
          {/* Today */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-300/80 mb-0.5">
              <span>📈</span>
              <span>Today</span>
            </div>
            <span className="text-xl font-black text-white tabular-nums">{totalAllTime}</span>
          </div>

          <div className="w-px h-8 bg-purple-500/20 mx-auto self-center" />

          {/* Rounds */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-300/80 mb-0.5">
              <span>🔄</span>
              <span>Rounds</span>
            </div>
            <span className="text-xl font-black text-white tabular-nums">{roundsDone}</span>
          </div>

          <div className="w-px h-8 bg-purple-500/20 mx-auto self-center" />

          {/* Streak */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-purple-300/80 mb-0.5">
              <span>🔥</span>
              <span>Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-pink-400 tabular-nums">{streakDays}</span>
              <span className="text-[10px] font-bold text-pink-300/80">day</span>
            </div>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* 3. FIXED BOTTOM FLOATING NAVIGATION DOCK                                   */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-md z-50 pb-safe">
        <div
          className="flex justify-around items-center h-16 px-2.5 rounded-3xl border transition-all duration-300 shadow-2xl"
          style={{
            background: 'rgba(18, 10, 36, 0.92)',
            borderColor: 'rgba(236, 72, 153, 0.3)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 20px 48px -8px rgba(0, 0, 0, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center flex-1 h-12 gap-0.5 rounded-2xl transition-all ${
              activeTab === 'home' ? 'text-pink-400 font-bold' : 'text-purple-300/60 hover:text-white'
            }`}
          >
            <Home className="w-4.5 h-4.5" />
            <span className="text-[9px] font-extrabold uppercase">Home</span>
          </button>

          {/* 2. Dhikr */}
          <DhikrSelector>
            <button
              onClick={() => setActiveTab('dhikr')}
              className={`flex flex-col items-center justify-center flex-1 h-12 gap-0.5 rounded-2xl transition-all ${
                activeTab === 'dhikr' ? 'text-pink-400 font-bold' : 'text-purple-300/60 hover:text-white'
              }`}
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span className="text-[9px] font-extrabold uppercase">Dhikr</span>
            </button>
          </DhikrSelector>

          {/* 3. Center Raised Counter Button */}
          <button
            onClick={handleTapCount}
            className="relative -top-3 w-14 h-14 rounded-full bg-gradient-to-tr from-purple-800 via-pink-600 to-pink-500 border-2 border-pink-300/60 shadow-[0_0_20px_rgba(236,72,153,0.6)] flex flex-col items-center justify-center text-white active:scale-92 transition-all cursor-pointer"
          >
            <span className="text-lg leading-none">📿</span>
            <span className="text-[8px] font-black tracking-tighter uppercase mt-0.5">Counter</span>
          </button>

          {/* 4. Progress */}
          <button
            onClick={() => {
              setActiveTab('progress');
              setShowProgressModal(true);
            }}
            className={`flex flex-col items-center justify-center flex-1 h-12 gap-0.5 rounded-2xl transition-all ${
              activeTab === 'progress' ? 'text-pink-400 font-bold' : 'text-purple-300/60 hover:text-white'
            }`}
          >
            <BarChart2 className="w-4.5 h-4.5" />
            <span className="text-[9px] font-extrabold uppercase">Progress</span>
          </button>

          {/* 5. More / Options */}
          <SettingsView>
            <button
              onClick={() => setActiveTab('more')}
              className={`flex flex-col items-center justify-center flex-1 h-12 gap-0.5 rounded-2xl transition-all ${
                activeTab === 'more' ? 'text-pink-400 font-bold' : 'text-purple-300/60 hover:text-white'
              }`}
            >
              <Grid className="w-4.5 h-4.5" />
              <span className="text-[9px] font-extrabold uppercase">More</span>
            </button>
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

      {showProgressModal && (
        <AnimatePresence>
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg bg-[#120a24] border border-[#331a57] rounded-t-3xl sm:rounded-3xl p-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-3">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-pink-400" />
                  <span>Dhikr Progress & History</span>
                </h3>
                <button onClick={() => setShowProgressModal(false)} className="p-1 rounded-full bg-purple-900/50 text-pink-300 text-xs font-bold px-2.5">
                  Close
                </button>
              </div>
              <StatsViewContent />
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}
