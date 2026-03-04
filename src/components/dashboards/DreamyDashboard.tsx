import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const DreamyDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-gradient-to-tr from-pink-100 via-purple-100 to-indigo-100 relative overflow-hidden rounded-3xl">
            {/* Soft Clouds/Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/60 rounded-full blur-3xl z-0 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-300/30 rounded-full blur-3xl z-0 pointer-events-none mix-blend-multiply"></div>

            <div className="w-full max-w-xl relative z-10 bg-white/40 backdrop-blur-3xl p-8 rounded-[4rem] border border-white/60 shadow-[0_20px_40px_-10px_rgba(236,72,153,0.15)]">
                {/* Soft highlight */}
                <div className="absolute top-0 left-10 right-10 h-1 bg-gradient-to-r from-transparent via-white/80 to-transparent blur-sm pointer-events-none"></div>
                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-white/40 backdrop-blur-3xl rounded-[3rem] p-4 
                            border border-white/60 shadow-[0_15px_30px_-10px_rgba(99,102,241,0.1)] hidden sm:block mt-4">
                <StatsWidget />
            </div>
        </div>
    );
};

export default DreamyDashboard;
