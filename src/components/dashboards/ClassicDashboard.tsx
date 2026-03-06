import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';
import { DateBanner } from '../DateBanner';
import { VisitorCounter } from '../VisitorCounter';
import { GlobalChallenges } from '../GlobalChallenges';
import { motion } from 'framer-motion';

const ClassicDashboard = () => {
    return (
        <div className="flex flex-col gap-6 items-center py-2 w-full max-w-2xl mx-auto">
            {/* Top Info Banner */}
            <div className="w-full">
                <DateBanner />
            </div>

            {/* Main Center Counter */}
            <div className="w-full">
                <Counter />
            </div>

            {/* Stats Section */}
            <div className="w-full px-4">
                <StatsWidget />
            </div>

            {/* Mobile Community Hub - Glassmorphism style */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full px-4 mt-2 pb-10"
            >
                <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-[2.5rem] p-5 shadow-xl space-y-6">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Community Hub</h2>
                        <div className="h-px bg-foreground/5 w-12" />
                    </div>

                    <VisitorCounter />

                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Active Challenges</span>
                        </div>
                        <GlobalChallenges />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ClassicDashboard;
