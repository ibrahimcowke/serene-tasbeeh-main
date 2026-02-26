import { BookOpen, Target, ClipboardList, Settings, History, Trophy, BarChart3, AppWindow } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useTasbeehStore } from "@/store/tasbeehStore";
import { DhikrSelector } from "./DhikrSelector";
import { TargetSelector } from "./TargetSelector";
import { RoutinesView } from "./RoutinesView";
import { SettingsView } from "./SettingsView";
import { HistoryView } from "./HistoryView";
import { AchievementsView } from "./AchievementsView";
import { ProgressView } from "./ProgressView";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function AppSidebar() {
    const { setZenMode } = useTasbeehStore();

    return (
        <Sidebar collapsible="icon">
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
