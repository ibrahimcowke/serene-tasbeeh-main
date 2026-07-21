import { lazy, Suspense, useState } from "react";
import { BookOpen, Target, ClipboardList, Bell, BarChart3, BarChart2, History, HandPlatter, Library, Calendar, Compass, Star, Hash, Share2, Smile, Users, Sparkles, Wind, Clock, Moon, ScrollText } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    useSidebar,
} from "@/components/ui/sidebar";
import { useTasbeehStore } from "@/store/tasbeehStore";
import { useTranslation } from "@/lib/i18n";
import { AnimatePresence } from "framer-motion";

// Lazy loaded views to speed up app loading & chunk splitting
const DhikrSelector = lazy(() => import("./DhikrSelector").then(m => ({ default: m.DhikrSelector })));
const TargetSelector = lazy(() => import("./TargetSelector").then(m => ({ default: m.TargetSelector })));
const RoutinesView = lazy(() => import("./RoutinesView").then(m => ({ default: m.RoutinesView })));
const HistoryView = lazy(() => import("./HistoryView").then(m => ({ default: m.HistoryView })));
const ProgressView = lazy(() => import("./ProgressView").then(m => ({ default: m.ProgressView })));
const RemindersView = lazy(() => import("./RemindersView").then(m => ({ default: m.RemindersView })));
const SettingsView = lazy(() => import("./SettingsView").then(m => ({ default: m.SettingsView })));
const DuaLibraryView = lazy(() => import("./DuaLibraryView").then(m => ({ default: m.DuaLibraryView })));
const CalendarView = lazy(() => import("./CalendarView").then(m => ({ default: m.CalendarView })));
const QiblaCompass = lazy(() => import("./QiblaCompass").then(m => ({ default: m.QiblaCompass })));
const AsmaulHusnaView = lazy(() => import("./AsmaulHusnaView").then(m => ({ default: m.AsmaulHusnaView })));
const StatsShareCard = lazy(() => import("./StatsShareCard").then(m => ({ default: m.StatsShareCard })));
const DhikrPlannerView = lazy(() => import("./DhikrPlannerView").then(m => ({ default: m.DhikrPlannerView })));
const AiCompanionView = lazy(() => import("./AiCompanionView").then(m => ({ default: m.AiCompanionView })));
const PrayerTimesView = lazy(() => import("./PrayerTimesView").then(m => ({ default: m.PrayerTimesView })));
const SalatulTasbeehView = lazy(() => import("./SalatulTasbeehView").then(m => ({ default: m.SalatulTasbeehView })));
const WeeklyReportView = lazy(() => import("./WeeklyReportView").then(m => ({ default: m.WeeklyReportView })));
const BedtimeModeView = lazy(() => import("./BedtimeModeView").then(m => ({ default: m.BedtimeModeView })));
const JourneyMapView = lazy(() => import("./JourneyMapView").then(m => ({ default: m.JourneyMapView })));

// Zero layout shift Suspense fallback wrapper
function LazyWrapper({ 
  icon, 
  text, 
  children 
}: { 
  icon: React.ReactNode; 
  text: string; 
  children: React.ReactNode; 
}) {
  return (
    <Suspense fallback={
      <SidebarMenuButton size="lg" disabled>
        <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all opacity-50">
          {icon}
          <span className="text-sm font-light tracking-wide">{text}</span>
        </div>
      </SidebarMenuButton>
    }>
      {children}
    </Suspense>
  );
}

export function AppSidebar() {
    const startTasbih100 = useTasbeehStore((s) => s.startTasbih100);
    const { t } = useTranslation();
    const { setOpenMobile } = useSidebar();
    const [showBedtime, setShowBedtime] = useState(false);
    return (
      <>
        <Sidebar collapsible="icon">
            {/* Header with brand */}
            <SidebarHeader
                className="flex items-center justify-center py-4 px-2"
                style={{
                    background: "linear-gradient(to bottom, hsl(var(--sidebar) / 0.98), hsl(var(--sidebar) / 0.95))",
                    borderBottom: "1px solid hsl(var(--sidebar-border) / 0.5)",
                }}
            >
                {/* Single unified app icon — same in both collapsed & expanded */}
                <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                        background: "linear-gradient(135deg, hsl(var(--primary) / 0.18) 0%, hsl(var(--primary) / 0.05) 100%)",
                        border: "1px solid hsl(var(--primary) / 0.35)",
                        boxShadow: "0 0 18px hsl(var(--primary) / 0.2), inset 0 1px 1px hsl(var(--primary-foreground) / 0.1)",
                    }}
                >
                    {/* Tasbeeh bead ring icon */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Ring string */}
                        <circle cx="12" cy="12" r="8" stroke="hsl(var(--primary))" strokeWidth="0.6" strokeDasharray="2 2.2" fill="none" opacity="0.5" />
                        {/* Beads around the ring */}
                        {[0,1,2,3,4,5,6,7,8,9,10].map((i) => {
                            const angle = (i / 11) * 2 * Math.PI - Math.PI / 2;
                            const x = 12 + 8 * Math.cos(angle);
                            const y = 12 + 8 * Math.sin(angle);
                            return <circle key={i} cx={x} cy={y} r="1.5" fill={i < 7 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.25)"} />;
                        })}
                        {/* Center dot */}
                        <circle cx="12" cy="12" r="1.5" fill="hsl(var(--primary))" opacity="0.7" />
                        {/* Top knot */}
                        <circle cx="12" cy="3.5" r="1" fill="hsl(var(--primary))" opacity="0.9" />
                    </svg>
                </div>
            </SidebarHeader>

            {/* Content */}
            <SidebarContent
                style={{
                    background: "linear-gradient(180deg, hsl(var(--sidebar) / 0.97) 0%, hsl(var(--sidebar) / 0.98) 100%)",
                }}
            >
                {/* Tools group */}
                <SidebarGroup>
                    <SidebarGroupLabel
                        className="text-sidebar-foreground/40 uppercase tracking-[0.25em] text-[9px] font-medium px-3 mb-1"
                    >
                        {t('sidebar.practice')}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            <SidebarMenuItem>
                                <LazyWrapper icon={<BookOpen className="w-4 h-4 text-primary shrink-0" />} text={t('sidebar.select_dhikr')}>
                                    <DhikrSelector>
                                        <SidebarMenuButton asChild tooltip={t('sidebar.select_dhikr')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('sidebar.select_dhikr')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </DhikrSelector>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<Target className="w-4 h-4 text-primary/70 shrink-0" />} text={t('sidebar.set_target')}>
                                    <TargetSelector>
                                        <SidebarMenuButton asChild tooltip={t('sidebar.set_target')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Target className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('sidebar.set_target')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </TargetSelector>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<ClipboardList className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.routines')}>
                                    <RoutinesView>
                                        <SidebarMenuButton asChild tooltip={t('nav.routines')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <ClipboardList className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.routines')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </RoutinesView>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<Bell className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.reminders')}>
                                    <RemindersView>
                                        <SidebarMenuButton asChild tooltip={t('nav.reminders')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Bell className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.reminders')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </RemindersView>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<Calendar className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.calendar')}>
                                    <CalendarView>
                                        <SidebarMenuButton asChild tooltip={t('nav.calendar')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.calendar')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </CalendarView>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<Library className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.duas')}>
                                    <DuaLibraryView>
                                        <SidebarMenuButton asChild tooltip={t('nav.duas')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Library className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.duas')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </DuaLibraryView>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<Compass className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.qibla')}>
                                    <QiblaCompass>
                                        <SidebarMenuButton asChild tooltip={t('nav.qibla')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Compass className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.qibla')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </QiblaCompass>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<Star className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.names')}>
                                    <AsmaulHusnaView>
                                        <SidebarMenuButton asChild tooltip={t('nav.names')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Star className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.names')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </AsmaulHusnaView>
                                </LazyWrapper>
                            </SidebarMenuItem>


                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={t('mood.title')} size="lg">
                                    <button 
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                        style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                        onClick={() => {
                                            useTasbeehStore.getState().setShowMoodTracker(true);
                                            setOpenMobile(false);
                                        }}
                                    >
                                        <Smile className="w-4 h-4 text-primary/70 shrink-0" />
                                        <span className="text-sm font-light tracking-wide text-ellipsis overflow-hidden whitespace-nowrap">{t('mood.title')}</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<Calendar className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.planner')}>
                                    <DhikrPlannerView>
                                        <SidebarMenuButton asChild tooltip={t('nav.planner')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Calendar className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.planner')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </DhikrPlannerView>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<Clock className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.prayer_times')}>
                                    <PrayerTimesView>
                                        <SidebarMenuButton asChild tooltip={t('nav.prayer_times')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Clock className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.prayer_times')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </PrayerTimesView>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<BookOpen className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.salatul_tasbeeh')}>
                                    <SalatulTasbeehView>
                                        <SidebarMenuButton asChild tooltip={t('nav.salatul_tasbeeh')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <BookOpen className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.salatul_tasbeeh')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </SalatulTasbeehView>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={t('nav.bedtime_dhikr')} size="lg">
                                    <button
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                        style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                        onClick={() => { setShowBedtime(true); setOpenMobile(false); }}
                                    >
                                        <Moon className="w-4 h-4 text-primary/70 shrink-0" />
                                        <span className="text-sm font-light tracking-wide">{t('nav.bedtime_dhikr')}</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>


                            <SidebarMenuItem>
                                <LazyWrapper icon={<Sparkles className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.ai_companion')}>
                                    <AiCompanionView>
                                        <SidebarMenuButton asChild tooltip={t('nav.ai_companion')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Sparkles className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.ai_companion')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </AiCompanionView>
                                </LazyWrapper>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Divider */}
                <div className="mx-4 h-px" style={{ background: "hsl(var(--sidebar-border))" }} />

                {/* Analytics group */}
                <SidebarGroup>
                    <SidebarGroupLabel
                        className="text-sidebar-foreground/40 uppercase tracking-[0.25em] text-[9px] font-medium px-3 mb-1"
                    >
                        {t('sidebar.insights')}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-0.5">
                            <SidebarMenuItem>
                                <LazyWrapper icon={<BarChart3 className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.stats')}>
                                    <ProgressView>
                                        <SidebarMenuButton asChild tooltip={t('nav.stats')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <BarChart3 className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.stats')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </ProgressView>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<Compass className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.spiritual_journey')}>
                                    <JourneyMapView>
                                        <SidebarMenuButton asChild tooltip={t('nav.spiritual_journey')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Compass className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.spiritual_journey')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </JourneyMapView>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<History className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.history')}>
                                    <HistoryView>
                                        <SidebarMenuButton asChild tooltip={t('nav.history')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <History className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.history')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </HistoryView>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<Share2 className="w-4 h-4 text-primary/70 shrink-0" />} text={t('share.title')}>
                                    <StatsShareCard>
                                        <SidebarMenuButton asChild tooltip={t('share.title')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <Share2 className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('share.title')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </StatsShareCard>
                                </LazyWrapper>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <LazyWrapper icon={<BarChart2 className="w-4 h-4 text-primary/70 shrink-0" />} text={t('nav.weekly_report')}>
                                    <WeeklyReportView>
                                        <SidebarMenuButton asChild tooltip={t('nav.weekly_report')} size="lg">
                                            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                                style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                            >
                                                <BarChart2 className="w-4 h-4 text-primary/70 shrink-0" />
                                                <span className="text-sm font-light tracking-wide">{t('nav.weekly_report')}</span>
                                            </button>
                                        </SidebarMenuButton>
                                    </WeeklyReportView>
                                </LazyWrapper>
                            </SidebarMenuItem>


                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer with settings */}
            <SidebarFooter
                style={{
                    background: "hsl(var(--sidebar))",
                    borderTop: "1px solid hsl(var(--sidebar-border))",
                }}
                className="py-3"
            >
                <SidebarMenuItem>
                    <LazyWrapper icon={
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary/50">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    } text={t('nav.settings')}>
                        <SettingsView defaultTab="appearance">
                            <SidebarMenuButton asChild tooltip={t('nav.settings')} size="lg">
                                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                    style={{ color: "hsl(var(--sidebar-foreground) / 0.6)" }}
                                >
                                    {/* Settings icon */}
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-primary/50">
                                        <circle cx="12" cy="12" r="3" />
                                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                    </svg>
                                    <span className="text-sm font-light tracking-wide">{t('nav.settings')}</span>
                                </button>
                            </SidebarMenuButton>
                        </SettingsView>
                    </LazyWrapper>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>

        <AnimatePresence>
            {showBedtime && (
                <Suspense fallback={null}>
                    <BedtimeModeView onClose={() => setShowBedtime(false)} />
                </Suspense>
            )}
        </AnimatePresence>
      </>
    );
}
