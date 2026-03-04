import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const LiquidDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-blue-50 relative overflow-hidden rounded-[40px] shadow-sm">
            {/* Liquid shapes */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/60 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-xl animate-[spin_20s_linear_infinite] pointer-events-none z-0 mix-blend-multiply"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-cyan-200/50 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-xl animate-[spin_25s_linear_infinite_reverse] pointer-events-none z-0 mix-blend-multiply"></div>

            <div className="w-full max-w-xl relative z-10 bg-white/40 backdrop-blur-2xl p-8 rounded-[40px] border border-white/60 shadow-[0_10px_40px_rgba(59,130,246,0.1)]">
                <Counter />
            </div>
            <div className="w-full max-w-2xl relative z-10 bg-white/40 backdrop-blur-2xl rounded-[30px] border border-white/60 shadow-[0_10px_40px_rgba(59,130,246,0.1)] overflow-hidden hidden sm:block">
                <StatsWidget />
            </div>
        </div>
    );
};

export default LiquidDashboard;
