import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ReactNode } from "react";
import { Target } from "lucide-react";
import { GlobalChallenges } from "./GlobalChallenges";

interface ChallengesViewProps {
    children: ReactNode;
}

export function ChallengesView({ children }: ChallengesViewProps) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="bg-background/95 backdrop-blur-xl border-t-0 pb-safe">
                <div className="w-full max-w-sm mx-auto flex flex-col h-[70vh] sm:h-[80vh]">
                    <DrawerHeader className="pb-4 shrink-0 text-left px-6 relative">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Target className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <DrawerTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Global Challenges
                                </DrawerTitle>
                                <p className="text-sm text-muted-foreground mt-0.5">Community dhikr goals</p>
                            </div>
                        </div>

                        {/* Background decorative elements */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute top-10 left-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl -z-10" />
                    </DrawerHeader>

                    <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 hide-scrollbar font-inter relative z-10 space-y-4">
                        <GlobalChallenges />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
}
