import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const GlassmorphicDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 relative overflow-hidden rounded-3xl">
            {/* Colorful background shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-400/40 rounded-full blur-[100px] z-0 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-pink-400/40 rounded-full blur-[100px] z-0 pointer-events-none"></div>
            <div className="absolute top-[40%] left-[20%] w-64 h-64 bg-blue-400/30 rounded-full blur-[80px] z-0 pointer-events-none"></div>

            <div className="w-full max-w-xl relative z-10 bg-white/20 backdrop-blur-2xl p-8 rounded-[40px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]">
                {/* Inner glass highlight */}
                <div className="absolute inset-0 rounded-[40px] border-[1.5px] border-white/60 pointer-events-none"></div>
                <div className="absolute inset-0 rounded-[40px] bg-gradient-to-b from-white/30 to-transparent opacity-50 pointer-events-none"></div>
                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-white/20 backdrop-blur-2xl rounded-[30px] border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] overflow-hidden hidden sm:block">
                <div className="absolute inset-0 rounded-[30px] border-[1.5px] border-white/60 pointer-events-none"></div>
                <StatsWidget />
            </div>
        </div>
    );
};

export default GlassmorphicDashboard;
