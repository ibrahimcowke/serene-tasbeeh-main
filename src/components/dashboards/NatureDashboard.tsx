import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const NatureDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-stone-50 relative overflow-hidden rounded-3xl shadow-inner border border-stone-200">
            {/* Natural gradient ground/sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-teal-50/80 via-yellow-50/50 to-emerald-100/50 pointer-events-none z-0"></div>

            {/* Organic light blobs */}
            <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-300/30 rounded-full blur-[80px] z-0 pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-lime-200/40 rounded-[100px] rotate-45 blur-[80px] z-0 pointer-events-none mix-blend-multiply"></div>

            <div className="w-full max-w-xl relative z-10 bg-white/60 backdrop-blur-md p-8 rounded-[3rem] border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)] shadow-emerald-900/5">
                <Counter />
            </div>
            <div className="w-full max-w-2xl relative z-10 bg-white/60 backdrop-blur-md rounded-3xl border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)] overflow-hidden">
                <StatsWidget />
            </div>
        </div>
    );
};

export default NatureDashboard;
