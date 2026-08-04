import React, { useState, useMemo, lazy, Suspense } from 'react';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Moon, RotateCcw, Undo2, MoreHorizontal, Heart, 
  Home, BookOpen, BarChart2, Grid, ChevronDown, 
  Volume2, VolumeX, Sparkles, PanelLeft, Settings as SettingsIcon
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
import { StatsViewContent } from '../StatsViewContent';

const WisdomModal = lazy(() => import('../WisdomModal').then(m => ({ default: m.WisdomModal })));
const NiyyahModal = lazy(() => import('../NiyyahModal').then(m => ({ default: m.NiyyahModal })));

/* ─────────────────────────────────────────────────────────────────────────── */
/* Theme-Adaptive 3D Pearl Ring Counter Visual                                 */
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
  const radius = 115;
  const centerX = 150;
  const centerY = 150;

  const beads = useMemo(() => {
    return Array.from({ length: TOTAL_BEADS }, (_, i) => {
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
      {/* Theme-Adaptive SVG Pearl Ring */}
      <svg 
        viewBox="0 0 300 300" 
        className="w-full h-full overflow-visible drop-shadow-md"
      >
        <defs>
          {/* Active 3D Pearl Radial Gradient using CSS Variable Theme Colors */}
          <radialGradient id="themePearlGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="hsl(var(--primary))" />
            <stop offset="75%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
          </radialGradient>

          {/* Active Marker Head Bead Halo Gradient */}
          <radialGradient id="themeActiveHeadGradient" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="hsl(var(--accent))" />
            <stop offset="70%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--primary) / 0.8)" />
          </radialGradient>

          {/* Translucent Bubble Gradient for Incomplete Beads */}
          <radialGradient id="themeGhostBubble" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="hsl(var(--card) / 0.8)" />
            <stop offset="70%" stopColor="hsl(var(--muted) / 0.4)" />
            <stop offset="100%" stopColor="hsl(var(--border) / 0.3)" />
          </radialGradient>

          {/* Glow Filters */}
          <filter id="themePearlGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <filter id="themeActiveHalo" x="-100%" y="-100%" width="300%" height="300%">
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
          stroke="hsl(var(--primary) / 0.25)" 
          strokeWidth="1.5" 
          strokeDasharray="4 4"
        />

        {/* Render 33 Theme-Adaptive Pearl Beads */}
        {beads.map((bead, i) => {
          const isDone = i < (currentCount % TOTAL_BEADS === 0 && currentCount > 0 ? TOTAL_BEADS : currentCount % TOTAL_BEADS);
          const isActiveMarker = i === activeIndex && currentCount > 0;

          if (isActiveMarker) {
            return (
              <g key={bead.id}>
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="14"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  className="animate-ping opacity-75"
                />
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="15"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2.5"
                  filter="url(#themeActiveHalo)"
                />
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="10"
                  fill="url(#themeActiveHeadGradient)"
                  filter="url(#themePearlGlow)"
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
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="9"
                  fill="hsl(var(--primary) / 0.4)"
                  filter="url(#themePearlGlow)"
                />
                <circle
                  cx={bead.x}
                  cy={bead.y}
                  r="8.5"
                  fill="url(#themePearlGradient)"
                />
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

          return (
            <g key={bead.id}>
              <circle
                cx={bead.x}
                cy={bead.y}
                r="7.5"
                fill="url(#themeGhostBubble)"
                stroke="hsl(var(--border) / 0.6)"
                strokeWidth="1.2"
              />
              <circle
                cx={bead.x - 1.5}
                cy={bead.y - 1.5}
                r="1.5"
                fill="hsl(var(--foreground) / 0.3)"
              />
            </g>
          );
        })}
      </svg>

      {/* Inside Circle Counter Typography */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none z-10">
        <motion.span
          key={currentCount}
          initial={{ scale: 0.85, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className="text-5xl sm:text-6xl font-black text-foreground tracking-tight drop-shadow-sm font-sans"
        >
          {currentCount}
        </motion.span>

        <span className="text-xs sm:text-sm font-bold text-muted-foreground mt-0.5 tracking-wide">
          of {targetCount}
        </span>

        <div className="w-2 h-2 rounded-full bg-primary shadow-xs animate-pulse mt-2" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/* Dashboard 3: Luminous Pearl Sanctuary (Theme & Counter Compatible)           */
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
  const counterShape = useTasbeehStore(state => state.counterShape);
  const counterVerticalOffset = useTasbeehStore(state => state.counterVerticalOffset);
  const counterScale = useTasbeehStore(state => state.counterScale);
  const countFontSize = useTasbeehStore(state => state.countFontSize);

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
    <div className="h-dvh w-full bg-background text-foreground flex flex-col items-center justify-between overflow-hidden relative select-none pt-safe pt-3 pb-[calc(4.8rem+env(safe-area-inset-bottom,0px))]">
      
      {/* Ambient Glow Orbs using Theme Primary Color */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[340px] sm:w-[460px] h-[340px] bg-primary/10 rounded-full blur-[110px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[20%] w-[220px] h-[220px] bg-accent/10 rounded-full blur-[90px] pointer-events-none z-0" />

      {/* ─────────────────────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER BAR                                                           */}
      {/* ─────────────────────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-md flex items-center justify-between z-20 px-5 pt-1 pb-1 shrink-0">
        {/* Left: Crescent & Hijri Date */}
        <div className="flex items-center gap-2 text-foreground font-bold">
          <Moon className="w-4 h-4 text-primary" />
          <span className="text-sm tracking-wide">{hijriStr}</span>
        </div>

        {/* Right: Sidebar Action Trigger & Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSoundAction();
            }}
            className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-primary hover:bg-muted active:scale-95 transition-all shadow-xs cursor-pointer"
            title={themeSettings?.soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {themeSettings?.soundEnabled ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-muted-foreground" />}
          </button>

          <button
            onClick={toggleSidebar}
            className="w-8 h-8 rounded-xl bg-card border border-border flex items-center justify-center text-primary hover:bg-muted active:scale-95 transition-all shadow-xs cursor-pointer"
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
          <div className="w-full flex flex-col items-center text-center cursor-pointer group shrink-0 py-1 bg-card/60 border border-border/50 rounded-3xl p-3 shadow-xs hover:border-primary/40 transition-all">
            <span className="text-[10px] font-black tracking-widest text-primary uppercase mb-1">
              DHIKR
            </span>

            {/* Arabic Text */}
            <motion.h1
              key={currentDhikr.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-arabic text-3xl sm:text-4xl text-foreground font-bold leading-tight drop-shadow-xs mb-1"
            >
              {currentDhikr.arabic}
            </motion.h1>

            {/* Transliteration & Translation */}
            <p className="text-sm font-extrabold text-primary tracking-wide">
              {currentDhikr.transliteration}
            </p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">
              {currentDhikr.translation}
            </p>

            {/* Inline Action Links: ♡ Intention | ••• More */}
            <div className="flex items-center gap-3 text-xs text-primary/80 font-bold mt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNiyyah(true);
                }}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Heart className={`w-3.5 h-3.5 ${niyyah ? 'fill-primary text-primary' : ''}`} />
                <span>Intention</span>
              </button>

              <span className="text-muted-foreground/40">|</span>

              <div className="flex items-center gap-1 hover:text-primary transition-colors">
                <MoreHorizontal className="w-4 h-4" />
                <span>More</span>
              </div>
            </div>
          </div>
        </DhikrSelector>

        {/* COUNTER WIDGET (Supports Pearl Ring & all user-selected counter shapes) */}
        <div className="shrink-0 flex items-center justify-center py-0 w-full">
          {(!counterShape || counterShape === 'bead-ring' || (counterShape as string) === 'pearl-ring') ? (
            <PearlBeadRingVisual
              currentCount={currentCount}
              targetCount={targetCount || 33}
              onTap={handleTapCount}
            />
          ) : (
            <div className="relative w-full flex items-center justify-center min-h-[220px] max-h-[260px] py-1">
              <CounterVisuals
                counterShape={counterShape}
                counterVerticalOffset={counterVerticalOffset || 0}
                counterScale={(counterScale || 1) * 0.9}
                progress={progressPercent}
                currentCount={currentCount}
                currentSettings={themeSettings}
                countFontSize={(countFontSize || 1) * 0.9}
                handleTap={handleTapCount}
                showCompletion={currentCount >= targetCount && targetCount > 0}
                disabled={false}
              />
            </div>
          )}
        </div>

        {/* LINEAR PROGRESS BAR */}
        <TargetSelector>
          <div className="w-full flex items-center gap-3 px-1 shrink-0 cursor-pointer">
            <div className="flex-1 h-1.5 rounded-full bg-muted/60 overflow-hidden p-0.5 border border-border/50">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent shadow-xs"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className="text-xs font-bold text-primary font-mono shrink-0">
              {currentCount} / {targetCount}
            </span>
          </div>
        </TargetSelector>

        {/* CONTROL ACTION BAR (Undo, Reset, Options) */}
        <div className="w-full bg-card/90 border border-border/80 rounded-2xl py-2 px-3 flex items-center justify-around shadow-md shrink-0">
          {/* Undo */}
          <button
            onClick={decrement}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-foreground hover:text-primary active:scale-92 transition-all cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5 text-primary" />
            <span>Undo</span>
          </button>

          <div className="w-px h-4 bg-border/60" />

          {/* Reset */}
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-foreground hover:text-primary active:scale-92 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-primary" />
            <span>Reset</span>
          </button>

          <div className="w-px h-4 bg-border/60" />

          {/* Options */}
          <SettingsView>
            <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold text-foreground hover:text-primary active:scale-92 transition-all cursor-pointer">
              <MoreHorizontal className="w-4 h-4 text-primary" />
              <span>Options</span>
            </button>
          </SettingsView>
        </div>

        {/* STATS SUMMARY CARD (Today, Rounds, Streak) */}
        <div className="w-full bg-card/90 border border-border/80 rounded-3xl p-3.5 grid grid-cols-3 gap-2 text-center shadow-md shrink-0">
          {/* Today */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground mb-0.5">
              <span>📈</span>
              <span>Today</span>
            </div>
            <span className="text-xl font-black text-foreground tabular-nums">{totalAllTime}</span>
          </div>

          <div className="w-px h-8 bg-border/60 mx-auto self-center" />

          {/* Rounds */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground mb-0.5">
              <span>🔄</span>
              <span>Rounds</span>
            </div>
            <span className="text-xl font-black text-foreground tabular-nums">{roundsDone}</span>
          </div>

          <div className="w-px h-8 bg-border/60 mx-auto self-center" />

          {/* Streak */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground mb-0.5">
              <span>🔥</span>
              <span>Streak</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-primary tabular-nums">{streakDays}</span>
              <span className="text-[10px] font-bold text-muted-foreground">day</span>
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
            background: 'hsl(var(--card) / 0.88)',
            borderColor: 'hsl(var(--primary) / 0.3)',
            backdropFilter: 'blur(28px)',
            WebkitBackdropFilter: 'blur(28px)',
            boxShadow: '0 20px 48px -8px rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        >
          {/* 1. Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center flex-1 h-12 gap-0.5 rounded-2xl transition-all ${
              activeTab === 'home' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
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
                activeTab === 'dhikr' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="w-4.5 h-4.5" />
              <span className="text-[9px] font-extrabold uppercase">Dhikr</span>
            </button>
          </DhikrSelector>

          {/* 3. Center Raised Counter Button */}
          <button
            onClick={handleTapCount}
            className="relative -top-3 w-14 h-14 rounded-full bg-gradient-to-br from-primary via-emerald-600 to-teal-700 border-2 border-primary-foreground/30 shadow-lg shadow-primary/30 flex flex-col items-center justify-center text-white active:scale-92 transition-all cursor-pointer"
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
              activeTab === 'progress' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
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
                activeTab === 'more' ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-lg bg-card border border-border rounded-t-3xl sm:rounded-3xl p-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
                <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-primary" />
                  <span>Dhikr Progress & History</span>
                </h3>
                <button onClick={() => setShowProgressModal(false)} className="p-1 rounded-full bg-muted text-foreground text-xs font-bold px-2.5">
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
