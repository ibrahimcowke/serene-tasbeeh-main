import { lazy, Suspense, useMemo, useState } from 'react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useShallow } from 'zustand/react/shallow';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { MobileNavBar } from '@/components/MobileNavBar';
import { Counter } from '@/components/Counter';
import { DateBanner } from '@/components/DateBanner';
import { LazyDayBanner } from '@/components/LazyDayBanner';
import { AnimatePresence } from 'framer-motion';
import { useTranslation } from '@/lib/i18n';
import { StreakCalendar } from '@/components/StreakCalendar';
import { Trophy, Star, Flame, Target, ChevronRight } from 'lucide-react';

// Lazy-load overlay components — they are never shown on first paint
const ScreenOffMode = lazy(() => import('@/components/ScreenOffMode').then(m => ({ default: m.ScreenOffMode })));
const WhatsNew = lazy(() => import('@/components/WhatsNew').then(m => ({ default: m.WhatsNew })));
const BedtimeModeView = lazy(() => import('@/components/BedtimeModeView').then(m => ({ default: m.BedtimeModeView })));

const Index = () => {
  const [showBedtime, setShowBedtime] = useState(false);
  const { t } = useTranslation();
  const {
    zenMode,
    setZenMode,
    screenOffMode,
    lastSeenVersion,
    totalAllTime,
    streakDays,
    dailyGoal,
    totalHasanat,
    dailyRecords,
    startTasbih100,
    startTasbih1000,
    currentCount
  } = useTasbeehStore(
    useShallow(state => ({
      zenMode: state.zenMode,
      setZenMode: state.setZenMode,
      screenOffMode: state.screenOffMode,
      lastSeenVersion: state.lastSeenVersion,
      totalAllTime: state.totalAllTime,
      streakDays: state.streakDays,
      dailyGoal: state.dailyGoal,
      totalHasanat: state.totalHasanat,
      dailyRecords: state.dailyRecords,
      startTasbih100: state.startTasbih100,
      startTasbih1000: state.startTasbih1000,
      currentCount: state.currentCount,
    }))
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = dailyRecords?.find(r => r.date === todayStr);
  const todayCount = (todayRecord ? todayRecord.totalCount : 0) + currentCount;

  const starfield = useMemo(() => [...Array(40)].map((_, i) => (
    <div
      key={i}
      className="absolute rounded-full"
      style={{
        width: Math.random() * 1.5 + 0.5 + 'px',
        height: Math.random() * 1.5 + 0.5 + 'px',
        top: Math.random() * 100 + '%',
        left: Math.random() * 100 + '%',
        opacity: Math.random() * 0.2 + 0.05,
        backgroundColor: 'hsl(var(--primary))',
      }}
    />
  )), []);

  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar onTriggerBedtime={() => setShowBedtime(true)} />
        <SidebarInset className="h-dvh overflow-hidden">

          {/* Full screen deep background */}
          <div
            className="h-dvh w-full flex flex-col overflow-hidden relative"
            style={{
              background: 'radial-gradient(circle at top left, hsl(var(--primary) / 0.12), transparent 50%), radial-gradient(circle at bottom right, hsl(var(--accent) / 0.08), transparent 50%), hsl(var(--background))',
            }}
          >
            {/* Conditional overlays — only mounted when active */}
            {screenOffMode && (
              <Suspense fallback={null}>
                <ScreenOffMode />
              </Suspense>
            )}

            <Suspense fallback={null}>
              <WhatsNew />
            </Suspense>

            {/* Subtle starfield / particle overlay */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              {starfield}
            </div>

            {/* Top navigation bar */}
            {!zenMode && (
              <div
                className="relative z-50 flex items-center justify-between px-4 sm:px-6 pt-safe gap-4"
                style={{
                  height: 'calc(64px + env(safe-area-inset-top, 0px))',
                  background: 'linear-gradient(to bottom, hsl(var(--background) / 0.95) 0%, transparent 100%)',
                }}
              >
                {/* Date banner */}
                <div className="flex-1 min-w-0 max-w-sm">
                  <DateBanner className="px-0" />
                </div>

                {/* Sidebar trigger */}
                <SidebarTrigger className="lg:hidden h-9 w-9 rounded-full flex items-center justify-center text-primary/80 hover:text-primary transition-colors shrink-0"
                  style={{
                    background: 'hsl(var(--foreground) / 0.05)',
                    border: '1px solid hsl(var(--primary) / 0.2)',
                  }}
                />
              </div>
            )}

            {/* Lazy Day Recovery Banner */}
            {!zenMode && <LazyDayBanner />}

            <div className="flex-1 min-h-0 w-full flex flex-col lg:flex-row overflow-hidden">
              {/* Left Remembrance Workspace */}
              <div className={`w-full ${zenMode ? 'lg:w-full' : 'lg:w-[46%] xl:w-[42%]'} flex flex-col overflow-y-auto px-4 lg:px-8 py-4 lg:py-6 lg:border-r lg:border-border/10 justify-center`}>
                <Counter className={`max-w-md sm:max-w-xl mx-auto min-h-full lg:min-h-0 lg:h-full px-2 sm:px-4 ${zenMode ? 'pt-0 pb-0' : 'pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0'}`} />
              </div>

              {/* Right Spiritual Dashboard (only visible on desktop, lg:flex, when NOT in Zen Mode) */}
              {!zenMode && (
                <div className="hidden lg:flex lg:w-[54%] xl:w-[58%] flex-col overflow-y-auto p-8 gap-6 bg-card/15 backdrop-blur-xl">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-border/20">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        Spiritual Dashboard
                      </h2>
                      <p className="text-xs text-muted-foreground">{t('welcome.tagline') || 'Your daily stats and devotion goals'}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-primary/80 bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        Desktop Workspace
                      </span>
                    </div>
                  </div>

                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Hasanat Card */}
                    <div className="bg-card/30 border border-border/40 rounded-3xl p-5 flex flex-col justify-between shadow-lg shadow-primary/5 hover:border-primary/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Hasanat</span>
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-black text-primary">{totalHasanat.toLocaleString()}</span>
                        <p className="text-[9px] text-muted-foreground mt-1">Spiritual rewards earned</p>
                      </div>
                    </div>

                    {/* Streak Card */}
                    <div className="bg-card/30 border border-border/40 rounded-3xl p-5 flex flex-col justify-between shadow-lg shadow-primary/5 hover:border-primary/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('counter.streak')}</span>
                        <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20 animate-pulse" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-black text-orange-500">{streakDays} {streakDays === 1 ? 'Day' : 'Days'}</span>
                        <p className="text-[9px] text-muted-foreground mt-1">Keep it up consistently</p>
                      </div>
                    </div>

                    {/* Total Count Card */}
                    <div className="bg-card/30 border border-border/40 rounded-3xl p-5 flex flex-col justify-between shadow-lg shadow-primary/5 hover:border-primary/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('counter.total')}</span>
                        <Trophy className="w-5 h-5 text-primary fill-primary/10" />
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-black text-primary">{totalAllTime.toLocaleString()}</span>
                        <p className="text-[9px] text-muted-foreground mt-1">All-time count</p>
                      </div>
                    </div>
                  </div>

                  {/* Daily Goal & Streak Calendar Row */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
                    {/* Today's Progress widget */}
                    <div className="bg-card/30 border border-border/40 rounded-3xl p-6 shadow-lg shadow-primary/5 hover:border-primary/20 transition-all flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-bold text-foreground">Today's Devotion</span>
                          <Target className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-black text-foreground">{todayCount} / {dailyGoal}</span>
                            <span className="text-xs font-semibold text-muted-foreground">
                              {dailyGoal > 0 ? Math.round((todayCount / dailyGoal) * 100) : 0}%
                            </span>
                          </div>
                          <div className="h-2.5 w-full bg-foreground/5 rounded-full overflow-hidden border border-border/20">
                            <div 
                              className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-500"
                              style={{ width: `${Math.min(100, dailyGoal > 0 ? (todayCount / dailyGoal) * 100 : 0)}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-border/20 pt-4 space-y-3">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Quick Challenges</span>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => startTasbih100()}
                            className="p-3 text-left rounded-2xl bg-foreground/5 border border-border/40 hover:bg-foreground/10 hover:border-primary/20 transition-all text-xs font-medium flex items-center justify-between group cursor-pointer"
                          >
                            <span>100 Sprint</span>
                            <ChevronRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" />
                          </button>
                          <button
                            onClick={() => startTasbih1000()}
                            className="p-3 text-left rounded-2xl bg-foreground/5 border border-border/40 hover:bg-foreground/10 hover:border-primary/20 transition-all text-xs font-medium flex items-center justify-between group cursor-pointer"
                          >
                            <span>1000 Endurance</span>
                            <ChevronRight className="w-3.5 h-3.5 text-primary group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Streak Calendar widget */}
                    <div className="bg-card/30 border border-border/40 rounded-3xl p-6 shadow-lg shadow-primary/5 hover:border-primary/20 transition-all flex flex-col justify-center">
                      <h3 className="text-sm font-bold text-foreground mb-2 px-1 flex items-center gap-2">
                        <span>📅</span> Hijri Devotion Calendar
                      </h3>
                      <StreakCalendar />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom navigation */}
            {!zenMode && <MobileNavBar />}

            {/* Zen mode exit */}
            {zenMode && (
              <button
                onClick={() => setZenMode(false)}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 px-8 py-3 rounded-full text-xs transition-all animate-fade-in-up flex items-center gap-2"
                style={{
                  background: 'hsl(var(--foreground) / 0.03)',
                  border: '1px solid hsl(var(--primary) / 0.2)',
                  color: 'hsl(var(--primary) / 0.8)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ backgroundColor: 'hsl(var(--primary))' }} />
                Exit Zen Mode
              </button>
            )}
          </div>
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
