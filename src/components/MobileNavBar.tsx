import { BookOpen, Target, Grid, Settings } from "lucide-react";
import { DhikrSelector } from "./DhikrSelector";
import { TargetSelector } from "./TargetSelector";
import { SettingsView } from "./SettingsView";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileNavBar() {
    const { setOpenMobile } = useSidebar();

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1c]/90 backdrop-blur-lg border-t border-white/5 pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                <DhikrSelector>
                    <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-white transition-colors">
                        <BookOpen className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Dhikr</span>
                    </button>
                </DhikrSelector>

                <TargetSelector>
                    <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-white transition-colors">
                        <Target className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Target</span>
                    </button>
                </TargetSelector>

                <button 
                    onClick={() => setOpenMobile(true)}
                    className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-white transition-colors"
                >
                    <Grid className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Menu</span>
                </button>

                <SettingsView>
                    <button className="flex flex-col items-center justify-center w-full h-full gap-1 text-muted-foreground hover:text-white transition-colors">
                        <Settings className="w-5 h-5" />
                        <span className="text-[10px] font-medium">Settings</span>
                    </button>
                </SettingsView>
            </div>
        </div>
    );
}
