import { motion } from 'framer-motion';
import { Counter } from '../Counter';
import { HistoryView } from '../HistoryView';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Clock } from 'lucide-react';

const TimelineDashboard = () => {
    return (
        <div className="flex flex-col gap-10 py-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-6">
                <Counter />
            </div>
            <div className="bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Clock className="w-5 h-5 text-primary" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Activity</h2>
                </div>
                <div className="h-[400px] overflow-y-auto">
                    <HistoryView>
                        <div />
                    </HistoryView>
                </div>
            </div>
        </div>
    );
};

export default TimelineDashboard;
