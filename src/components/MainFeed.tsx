import { motion } from 'framer-motion';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Users, Layout, Trophy } from 'lucide-react';

export const MainFeed = () => {
    return (
        <div className="space-y-6">
            <div className="bg-card/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <Users className="w-5 h-5 text-primary" />
                    <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">What's Happening</h2>
                </div>
                <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/5 animate-pulse h-20" />
                    <div className="p-4 rounded-xl bg-white/5 animate-pulse h-20" />
                    <div className="p-4 rounded-xl bg-white/5 animate-pulse h-20" />
                </div>
            </div>
        </div>
    );
};
