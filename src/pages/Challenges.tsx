import { ChallengesViewContent } from "@/components/ChallengesView";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { motion } from "framer-motion";

const ChallengesPage = () => {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background overflow-hidden font-sans selection:bg-primary/20">
                <AppSidebar />
                <main className="flex-1 relative flex flex-col h-screen overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="mb-8">
                                <h1 className="text-3xl font-black text-foreground tracking-tight">Challenges Center</h1>
                                <p className="text-muted-foreground font-medium">Complete solo sprints and endurance sessions to stay consistent and earn rewards.</p>
                            </div>

                            <div className="bg-card/30 backdrop-blur-xl border border-border/50 rounded-[2.5rem] overflow-hidden p-1 shadow-2xl shadow-primary/5">
                                <div className="p-6 md:p-8">
                                    <ChallengesViewContent isPage={true} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default ChallengesPage;
