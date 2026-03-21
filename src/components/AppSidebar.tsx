import { useState } from 'react';
import { BookOpen, Target, ClipboardList, Settings, History, Trophy, BarChart3, AppWindow, Swords, Palette, Bell } from "lucide-react";
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
import { RemindersView } from "./RemindersView";
import { toast } from "sonner";
import { motion } from "framer-motion";

export function AppSidebar() {
    const { setZenMode } = useTasbeehStore();
    const { state, setOpenMobile } = useSidebar();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="border-b border-border/40 bg-card/20 backdrop-blur-sm p-4">
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
                                <RemindersView>
                                    <SidebarMenuButton asChild tooltip="Reminders">
                                        <button className="w-full justify-start cursor-pointer hover:bg-secondary/50">
                                            <Bell className="text-primary" />
                                            <span>Reminders</span>
                                        </button>
                                    </SidebarMenuButton>
                                </RemindersView>
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
            </SidebarContent>
        </Sidebar>
    );
}
