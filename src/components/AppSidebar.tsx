import { BookOpen, Target, ClipboardList, Settings, History, Trophy, BarChart3, AppWindow, Swords, Palette, Shapes } from "lucide-react";
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
    useSidebar,
} from "@/components/ui/sidebar";
import { useTasbeehStore } from "@/store/tasbeehStore";
import { DhikrSelector } from "./DhikrSelector";
import { TargetSelector } from "./TargetSelector";
import { RoutinesView } from "./RoutinesView";
import { SettingsView } from "./SettingsView";
import { HistoryView } from "./HistoryView";
import { AchievementsView } from "./AchievementsView";
import { ProgressView } from "./ProgressView";
import { VisitorCounter } from "./VisitorCounter";
import { NotificationCenter } from "./NotificationCenter";
import { ChallengesView } from "./ChallengesView";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { themes, counterShapes } from "@/lib/constants";

export function AppSidebar() {
    const { setZenMode, theme, setTheme, counterShape, setCounterShape } = useTasbeehStore();
    const { state } = useSidebar();
    const themeIds = themes.map((item) => item.id);
    const shapeIds = counterShapes.map((item) => item.id);

    const cycleTheme = () => {
        const currentIndex = themeIds.indexOf(theme);
        const nextTheme = themeIds[(currentIndex + 1) % themeIds.length] ?? themeIds[0];
        setTheme(nextTheme as Parameters<typeof setTheme>[0]);
    };

    const cycleCounterShape = () => {
        const currentIndex = shapeIds.indexOf(counterShape);
        const nextShape = shapeIds[(currentIndex + 1) % shapeIds.length] ?? shapeIds[0];
        setCounterShape(nextShape as Parameters<typeof setCounterShape>[0]);
    };

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-border/40 bg-card/20 backdrop-blur-sm p-4">
                <motion.div
                    animate={state === "collapsed" ? { opacity: 0, height: 0 } : { opacity: 1, height: "auto" }}
                    className="flex flex-col gap-4 overflow-hidden"
                >
                    <div className="flex items-center justify-between">
                        <VisitorCounter />
                        <NotificationCenter />
                    </div>
                </motion.div>
            </SidebarHeader>
            <SidebarContent>
                {/* Core Actions */}
                <SidebarGroup>
                    <SidebarGroupLabel>Tools</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <DhikrSelector>
                                    <SidebarMenuButton asChild tooltip="Select Dhikr">
                                        <button className="w-full justify-start cursor-pointer hover:bg-secondary/50">
                                            <BookOpen className="text-primary" />
                                            <span>Select Dhikr</span>
                                        </button>
                                    </SidebarMenuButton>
                                </DhikrSelector>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <TargetSelector>
                                    <SidebarMenuButton asChild tooltip="Set Target">
                                        <button className="w-full justify-start cursor-pointer hover:bg-secondary/50">
                                            <Target className="text-muted-foreground" />
                                            <span>Set Target</span>
                                        </button>
                                    </SidebarMenuButton>
                                </TargetSelector>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <RoutinesView>
                                    <SidebarMenuButton asChild tooltip="Routines">
                                        <button className="w-full justify-start cursor-pointer hover:bg-secondary/50">
                                            <ClipboardList className="text-orange-500" />
                                            <span>Routines</span>
                                        </button>
                                    </SidebarMenuButton>
                                </RoutinesView>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <ChallengesView>
                                    <SidebarMenuButton asChild tooltip="Challenges">
                                        <button className="w-full justify-start cursor-pointer hover:bg-secondary/50">
                                            <Swords className="text-orange-500" />
                                            <span>Challenges</span>
                                        </button>
                                    </SidebarMenuButton>
                                </ChallengesView>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Analytics & History */}
                <SidebarGroup>
                    <SidebarGroupLabel>Analytics</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <ProgressView>
                                    <SidebarMenuButton asChild tooltip="Stats">
                                        <button className="w-full justify-start cursor-pointer hover:bg-secondary/50">
                                            <BarChart3 className="text-blue-500" />
                                            <span>Stats</span>
                                        </button>
                                    </SidebarMenuButton>
                                </ProgressView>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <HistoryView>
                                    <SidebarMenuButton asChild tooltip="History">
                                        <button className="w-full justify-start cursor-pointer hover:bg-secondary/50">
                                            <History className="text-green-500" />
                                            <span>History</span>
                                        </button>
                                    </SidebarMenuButton>
                                </HistoryView>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <AchievementsView>
                                    <SidebarMenuButton asChild tooltip="Awards">
                                        <button className="w-full justify-start cursor-pointer hover:bg-secondary/50">
                                            <Trophy className="text-yellow-500" />
                                            <span>Awards</span>
                                        </button>
                                    </SidebarMenuButton>
                                </AchievementsView>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Quick Style</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={cycleTheme} tooltip="Cycle Theme">
                                    <Palette className="text-primary" />
                                    <span>Theme</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={cycleCounterShape} tooltip="Cycle Counter Shape">
                                    <Shapes className="text-muted-foreground" />
                                    <span>Counter Shape</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* App Settings */}
                <SidebarGroup className="pb-10">
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => {
                                        setZenMode(true);
                                        toast.info("Zen Mode Active", { description: "Tap the button at the bottom to exit" });
                                    }}
                                    tooltip="Zen Mode"
                                >
                                    <AppWindow className="text-purple-500" />
                                    <span>Zen Mode</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SettingsView>
                                    <SidebarMenuButton asChild tooltip="Settings">
                                        <button className="w-full justify-start cursor-pointer hover:bg-secondary/50">
                                            <Settings className="text-muted-foreground" />
                                            <span>Settings</span>
                                        </button>
                                    </SidebarMenuButton>
                                </SettingsView>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
