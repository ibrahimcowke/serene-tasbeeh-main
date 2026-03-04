import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const FuturisticDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-zinc-950 text-cyan-50 relative overflow-hidden rounded-xl border border-cyan-900/30 shadow-[0_0_30px_rgba(6,182,212,0.15)_inset]">
            {/* Cyber Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0"
                style={{ backgroundImage: 'linear-gradient(to right, #0891b2 1px, transparent 1px), linear-gradient(to bottom, #0891b2 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* UI Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl pointer-events-none"></div>

            <div className="w-full max-w-xl relative z-10 bg-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl border border-cyan-800/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                <Counter />
            </div>
            <div className="w-full max-w-2xl relative z-10 bg-zinc-900/80 backdrop-blur-sm rounded-xl border border-cyan-800/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] overflow-hidden">
                <StatsWidget />
            </div>
        </div>
    );
};

export default FuturisticDashboard;
