import { lazy, Suspense, useMemo, useState } from 'react';
import { useTasbeehStore, defaultThemeSettings } from '@/store/tasbeehStore';
import { useShallow } from 'zustand/react/shallow';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileNavBar } from '@/components/MobileNavBar';
import { Counter } from '@/components/Counter';
import { DateBanner } from '@/components/DateBanner';
import { LazyDayBanner } from '@/components/LazyDayBanner';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { StreakCalendar } from '@/components/StreakCalendar';
import { Trophy, Star, Flame, Target, ChevronRight, Volume2, VolumeX, Maximize2, Sparkles } from 'lucide-react';

// Lazy-load overlay components — they are never shown on first paint
const ScreenOffMode = lazy(() => import('@/components/ScreenOffMode').then(m => ({ default: m.ScreenOffMode })));
const WhatsNew = lazy(() => import('@/components/WhatsNew').then(m => ({ default: m.WhatsNew })));
const BedtimeModeView = lazy(() => import('@/components/BedtimeModeView').then(m => ({ default: m.BedtimeModeView })));
const SereneArchDashboard = lazy(() => import('@/components/dashboards/SereneArchDashboard').then(m => ({ default: m.SereneArchDashboard })));
const LuminousPearlDashboard = lazy(() => import('@/components/dashboards/LuminousPearlDashboard').then(m => ({ default: m.LuminousPearlDashboard })));

const Index = () => {
  const [showBedtime, setShowBedtime] = useState(false);
  const { t } = useTranslation();

  const {
    theme,
    themeSettings,
    toggleSound,
    zenMode,
    setZenMode,
    screenOffMode,
    totalAllTime,
    streakDays,
    dailyGoal,
    totalHasanat,
    dailyRecords,
    startTasbih100,
    startTasbih1000,
    currentCount,
    dashboardLayout
  } = useTasbeehStore(
    useShallow(state => ({
      theme: state.theme,
      themeSettings: state.themeSettings[state.theme] || defaultThemeSettings,
      toggleSound: state.toggleSound,
      zenMode: state.zenMode,
      setZenMode: state.setZenMode,
      screenOffMode: state.screenOffMode,
      totalAllTime: state.totalAllTime,
      streakDays: state.streakDays,
      dailyGoal: state.dailyGoal,
      totalHasanat: state.totalHasanat,
      dailyRecords: state.dailyRecords,
      startTasbih100: state.startTasbih100,
      startTasbih1000: state.startTasbih1000,
      currentCount: state.currentCount,
      dashboardLayout: state.dashboardLayout,
    }))
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = dailyRecords?.find(r => r.date === todayStr);
  const todayCount = (todayRecord ? todayRecord.totalCount : 0) + currentCount;

  const starfield = useMemo(() => [...Array(35)].map((_, i) => (
    <div
      key={i}
      className="absolute rounded-full"
      style={{
        width: Math.random() * 1.8 + 0.6 + 'px',
        height: Math.random() * 1.8 + 0.6 + 'px',
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        opacity: Math.random() * 0.25 + 0.08,
        backgroundColor: 'hsl(var(--primary))',
        boxShadow: '0 0 6px hsl(var(--primary) / 0.5)',
      }}
    />
  )), []);

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSound();
  };

  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar onTriggerBedtime={() => setShowBedtime(true)} />
        <SidebarInset className="h-dvh overflow-hidden">
          {dashboardLayout === 'serene-arch' ? (
            <Suspense fallback={null}>
              <SereneArchDashboard />
            </Suspense>
          ) : dashboardLayout === 'pearl-luminous' ? (
            <Suspense fallback={null}>
              <LuminousPearlDashboard />
            </Suspense>
          ) : (
            <div
              className="h-dvh w-full flex flex-col overflow-hidden relative select-none"
              style={{
                background: 'radial-gradient(circle at 15% 15%, hsl(var(--primary) / 0.15), transparent 45%), radial-gradient(circle at 85% 85%, hsl(var(--accent) / 0.12), transparent 45%), hsl(var(--background))',
              }}
            >
            {/* Ambient Glass Glow Orbs */}
            <div className="absolute top-[-10%] left-[20%] w-[450px] h-[450px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[15%] w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* Overlays */}
            {screenOffMode && (
              <Suspense fallback={null}>
                <ScreenOffMode />
              </Suspense>
            )}

            <Suspense fallback={null}>
              <WhatsNew />
            </Suspense>

            {/* Particle Overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              {starfield}
            </div>

            {/* iOS Floating Glass Header Bar */}
            {!zenMode && (
              <div className="relative z-50 px-4 sm:px-6 pt-safe pt-3 shrink-0">
                <div
                  className="max-w-7xl mx-auto flex items-center justify-between gap-3 px-4 py-2 rounded-2xl border transition-all shadow-xl"
                  style={{
                    background: 'hsl(var(--card) / 0.45)',
                    borderColor: 'hsl(var(--primary) / 0.2)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
                  }}
                >
                  {/* Left: Date banner */}
                  <div className="flex-1 min-w-0 max-w-sm">
                    <DateBanner className="px-0 py-0" />
                  </div>

                  {/* Right: iOS Quick Action Pills */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Sound Quick Toggle Pill */}
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      onClick={handleToggleSound}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        themeSettings?.soundEnabled
                          ? 'bg-primary/15 border-primary/30 text-primary shadow-sm shadow-primary/10'
                          : 'bg-foreground/5 border-border/40 text-muted-foreground'
                      }`}
                    >
                      {themeSettings?.soundEnabled ? (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-primary" />
                          <span className="hidden sm:inline text-[11px]">Sound On</span>
                        </>
                      ) : (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="hidden sm:inline text-[11px]">Muted</span>
                        </>
                      )}
                    </motion.button>

                    {/* Zen Mode Button */}
                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setZenMode(true)}
                      className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/20 bg-foreground/5 hover:bg-primary/10 text-xs font-semibold text-foreground/80 hover:text-primary transition-all cursor-pointer"
                      title="Enter Zen Mode"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Zen</span>
                    </motion.button>

                    {/* Sidebar Trigger Button */}
                    <SidebarTrigger className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center text-primary/80 hover:text-primary transition-colors shrink-0 bg-foreground/5 border border-primary/20" />
                  </div>
                </div>
              </div>
            )}

            {/* Lazy Day Recovery Banner */}
            {!zenMode && <LazyDayBanner />}

            {/* Main Application Grid: Workspace + Spiritual Dashboard */}
            <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row overflow-hidden">

              {/* Left Workspace: Glass Remembrance Counter */}
              <div className={`w-full ${zenMode ? 'lg:w-full' : 'lg:w-[48%] xl:w-[44%]'} flex flex-col overflow-y-auto px-3 sm:px-6 py-3 lg:py-5 lg:border-r lg:border-white/10 justify-center relative z-10`}>
                <Counter className={`max-w-md sm:max-w-xl mx-auto min-h-full lg:min-h-0 lg:h-full px-2 sm:px-4 ${zenMode ? 'pt-0 pb-0' : 'pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0'}`} />
              </div>

              {/* Right Spiritual Dashboard (Desktop / Large Screens) */}
              {!zenMode && (
                <div className="hidden lg:flex lg:w-[52%] xl:w-[56%] flex-col overflow-y-auto p-5 lg:p-7 gap-4 justify-between relative z-10">

                  {/* Dashboard Header Bar */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary/30 to-accent/20 border border-primary/30 flex items-center justify-center shadow-lg shadow-primary/10">
                        <Sparkles className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black tracking-tight text-foreground" style={{ fontFamily: "'Outfit', sans-serif" }}>
                          Spiritual Dashboard
                        </h2>
                        <p className="text-xs text-muted-foreground">{t('welcome.tagline') || 'Your daily stats and devotion goals'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Top Stats iOS Glass Cards Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Hasanat Card */}
                    <div
                      className="group rounded-3xl p-4.5 flex flex-col justify-between border transition-all duration-300 hover:scale-[1.02] cursor-default"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--card) / 0.5) 0%, hsl(var(--card) / 0.2) 100%)',
                        borderColor: 'hsl(var(--primary) / 0.25)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hasanat</span>
                        <div className="w-8 h-8 rounded-full bg-yellow-500/15 border border-yellow-500/30 flex items-center justify-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400/30" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-2xl xl:text-3xl font-black text-primary tracking-tight">{totalHasanat.toLocaleString()}</span>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">Spiritual rewards earned</p>
                      </div>
                    </div>

                    {/* Streak Card */}
                    <div
                      className="group rounded-3xl p-4.5 flex flex-col justify-between border transition-all duration-300 hover:scale-[1.02] cursor-default"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--card) / 0.5) 0%, hsl(var(--card) / 0.2) 100%)',
                        borderColor: 'rgba(249, 115, 22, 0.3)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('counter.streak')}</span>
                        <div className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center">
                          <Flame className="w-4 h-4 text-orange-500 fill-orange-500/30 animate-pulse" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-2xl xl:text-3xl font-black text-orange-500 tracking-tight">{streakDays} {streakDays === 1 ? 'Day' : 'Days'}</span>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">Keep it up consistently</p>
                      </div>
                    </div>

                    {/* Total Count Card */}
                    <div
                      className="group rounded-3xl p-4.5 flex flex-col justify-between border transition-all duration-300 hover:scale-[1.02] cursor-default"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--card) / 0.5) 0%, hsl(var(--card) / 0.2) 100%)',
                        borderColor: 'hsl(var(--accent) / 0.25)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('counter.total')}</span>
                        <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                          <Trophy className="w-4 h-4 text-primary fill-primary/20" />
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="text-2xl xl:text-3xl font-black text-primary tracking-tight">{totalAllTime.toLocaleString()}</span>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">All-time total count</p>
                      </div>
                    </div>
                  </div>

                  {/* Main Grid: Today's Devotion Widget + Streak Calendar Widget */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-stretch">

                    {/* Today's Devotion Goal Progress Widget */}
                    <div
                      className="rounded-3xl p-5 border flex flex-col justify-between transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--card) / 0.4) 0%, hsl(var(--card) / 0.2) 100%)',
                        borderColor: 'hsl(var(--primary) / 0.2)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Target className="w-4.5 h-4.5 text-primary" />
                            <span className="text-sm font-bold text-foreground">Today's Devotion</span>
                          </div>
                          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                            {dailyGoal > 0 ? Math.round((todayCount / dailyGoal) * 100) : 0}% Goal
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-black text-foreground tracking-tight">{todayCount} / {dailyGoal}</span>
                            <span className="text-xs font-medium text-muted-foreground">target</span>
                          </div>

                          <div className="h-2.5 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/20 p-0.5">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500 shadow-sm"
                              style={{ width: `${Math.min(100, dailyGoal > 0 ? (todayCount / dailyGoal) * 100 : 0)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-white/10 pt-3.5 space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Quick Devotion Challenges</span>
                        <div className="grid grid-cols-2 gap-2.5">
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => startTasbih100()}
                            className="p-3 rounded-2xl bg-foreground/5 border border-border/40 hover:bg-primary/10 hover:border-primary/30 transition-all text-xs font-semibold flex items-center justify-between group cursor-pointer"
                          >
                            <span>100 Sprint</span>
                            <ChevronRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => startTasbih1000()}
                            className="p-3 rounded-2xl bg-foreground/5 border border-border/40 hover:bg-primary/10 hover:border-primary/30 transition-all text-xs font-semibold flex items-center justify-between group cursor-pointer"
                          >
                            <span>1000 Endurance</span>
                            <ChevronRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Streak Calendar Widget */}
                    <div
                      className="rounded-3xl p-5 border flex flex-col justify-center transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--card) / 0.4) 0%, hsl(var(--card) / 0.2) 100%)',
                        borderColor: 'hsl(var(--primary) / 0.2)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <h3 className="text-xs font-bold text-foreground mb-3 px-1 flex items-center gap-2">
                        <span>📅</span> Hijri Devotion Calendar
                      </h3>
                      <StreakCalendar />
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Mobile Bottom Navigation (Floating Glass Pill) */}
            {!zenMode && <MobileNavBar />}

            {/* Zen mode exit pill */}
            {zenMode && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setZenMode(false)}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 px-8 py-3 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-2xl"
                style={{
                  background: 'hsl(var(--card) / 0.6)',
                  border: '1px solid hsl(var(--primary) / 0.3)',
                  color: 'hsl(var(--primary))',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Exit Zen Mode
              </motion.button>
            )}
          </div>
          )}
        </SidebarInset>
      </SidebarProvider>

      <AnimatePresence>
        {showBedtime && (
          <Suspense fallback={null}>
            <BedtimeModeView onClose={() => setShowBedtime(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
