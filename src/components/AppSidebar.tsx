import { BookOpen, Target, ClipboardList, Bell, BarChart3, History, HandPlatter, Library, Calendar, Compass, Star, Hash, Share2 } from "lucide-react";
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
} from "@/components/ui/sidebar";
import { DhikrSelector } from "./DhikrSelector";
import { TargetSelector } from "./TargetSelector";
import { RoutinesView } from "./RoutinesView";
import { HistoryView } from "./HistoryView";
import { ProgressView } from "./ProgressView";
import { RemindersView } from "./RemindersView";
import { SettingsView } from "./SettingsView";
import { DuaLibraryView } from "./DuaLibraryView";
import { CalendarView } from "./CalendarView";
import { QiblaCompass } from "./QiblaCompass";
import { AsmaulHusnaView } from "./AsmaulHusnaView";
import { MultiCounterView } from "./MultiCounterView";
import { StatsShareCard } from "./StatsShareCard";
import { useTasbeehStore } from "@/store/tasbeehStore";
import { useTranslation } from "@/lib/i18n";

export function AppSidebar() {
    const startTasbih100 = useTasbeehStore((s) => s.startTasbih100);
    const { t } = useTranslation();
    return (
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
                            </SidebarMenuItem>

                            <SidebarMenuItem>
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
                            </SidebarMenuItem>

                            <SidebarMenuItem>
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
                            </SidebarMenuItem>

                            <SidebarMenuItem>
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
                            </SidebarMenuItem>

                            <SidebarMenuItem>
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
                            </SidebarMenuItem>


                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip={t('sidebar.after_prayer')} size="lg">
                                    <button
                                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                        style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                        onClick={() => startTasbih100()}
                                    >
                                        <HandPlatter className="w-4 h-4 text-primary/70 shrink-0" />
                                        <span className="text-sm font-light tracking-wide">{t('sidebar.after_prayer')}</span>
                                    </button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
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
                            </SidebarMenuItem>

                            <SidebarMenuItem>
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
                            </SidebarMenuItem>

                            <SidebarMenuItem>
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
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <MultiCounterView>
                                    <SidebarMenuButton asChild tooltip={t('nav.multi')} size="lg">
                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all"
                                            style={{ color: "hsl(var(--sidebar-foreground) / 0.85)" }}
                                        >
                                            <Hash className="w-4 h-4 text-primary/70 shrink-0" />
                                            <span className="text-sm font-light tracking-wide">{t('nav.multi')}</span>
                                        </button>
                                    </SidebarMenuButton>
                                </MultiCounterView>
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
                            </SidebarMenuItem>

                            <SidebarMenuItem>
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
                            </SidebarMenuItem>

                            <SidebarMenuItem>
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
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    );
}
