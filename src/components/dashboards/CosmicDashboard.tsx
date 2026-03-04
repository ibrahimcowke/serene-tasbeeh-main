import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const CosmicDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-slate-950 text-slate-100 relative overflow-hidden rounded-3xl border border-white/10 shadow-[0_0_60px_rgba(139,92,246,0.15)_inset]">
            {/* Deep Space Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950/80 to-black pointer-events-none z-0"></div>

            {/* Glowing Nebulas */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-[100px] z-0 mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] z-0 mix-blend-screen pointer-events-none"></div>

            <div className="w-full max-w-xl relative z-10 bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-black/50">
                <div className="absolute inset-0 rounded-[2.5rem] border border-white/5 pointer-events-none mix-blend-overlay"></div>
                <Counter />
            </div>
            <div className="w-full max-w-2xl relative z-10 bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/10 shadow-xl overflow-hidden">
                <StatsWidget />
            </div>
        </div>
    );
};

export default CosmicDashboard;
