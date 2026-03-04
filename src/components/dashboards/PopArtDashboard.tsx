import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const PopArtDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-yellow-400 relative overflow-hidden rounded-xl border-4 border-black"
            style={{ backgroundImage: 'radial-gradient(black 2px, transparent 2px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}>

            <div className="w-full max-w-xl relative z-10 bg-cyan-400 p-8 rounded-xl border-4 border-black shadow-[12px_12px_0_#000000]">
                {/* Comic burst */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500 rounded-full border-4 border-black flex items-center justify-center transform rotate-12 shadow-[6px_6px_0_#000000] z-[-1]">
                    <span className="font-black text-white text-3xl">WOW!</span>
                </div>
                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-pink-400 p-4 rounded-xl border-4 border-black shadow-[12px_12px_0_#000000] hidden sm:block mt-4">
                <StatsWidget />
            </div>
        </div>
    );
};

export default PopArtDashboard;
