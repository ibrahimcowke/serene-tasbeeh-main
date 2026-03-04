import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const CyberpunkDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-yellow-400 relative overflow-hidden rounded-none border-[6px] border-black">
            {/* Cyberpunk Glitch & Grid */}
            <div className="absolute inset-0 opacity-30 pointer-events-none z-0 mix-blend-overlay"
                style={{ backgroundImage: 'linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(0deg, rgba(0,0,0,0.5) 1px, transparent 1px)', backgroundSize: '10px 10px' }}>
            </div>

            <div className="w-full max-w-xl relative z-10 bg-black text-cyan-400 p-8 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.5)] 
                            [clip-path:polygon(0_0,calc(100%-30px)_0,100%_30px,100%_100%,30px_100%,0_calc(100%-30px))]">
                {/* Yellow accent strips */}
                <div className="absolute top-0 right-0 w-8 h-1 bg-yellow-400"></div>
                <div className="absolute bottom-0 left-0 w-8 h-1 bg-yellow-400"></div>
                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-black text-pink-500 rounded-none p-4 
                            border-t-4 border-l-4 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.5)] hidden sm:block
                            [clip-path:polygon(30px_0,100%_0,100%_calc(100%-30px),calc(100%-30px)_100%,0_100%,0_30px)]">
                <StatsWidget />
            </div>
        </div>
    );
};

export default CyberpunkDashboard;
