import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const RuggedDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-stone-900 text-stone-100 relative overflow-hidden rounded-md border-4 border-stone-800 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
            {/* Texture/Noise */}
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0 mix-blend-overlay"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
            </div>

            {/* Industrial accents */}
            <div className="absolute top-4 left-4 w-4 h-4 bg-stone-700 rounded-full shadow-inner border border-stone-950 pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-stone-700 rounded-full shadow-inner border border-stone-950 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 bg-stone-700 rounded-full shadow-inner border border-stone-950 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 bg-stone-700 rounded-full shadow-inner border border-stone-950 pointer-events-none"></div>

            <div className="w-full max-w-xl relative z-10 bg-stone-800 p-8 rounded-sm border-2 border-stone-700 shadow-[4px_4px_0_rgba(0,0,0,0.4)]">
                <Counter />
            </div>
            <div className="w-full max-w-2xl relative z-10 bg-stone-800 rounded-sm border-2 border-stone-700 shadow-[4px_4px_0_rgba(0,0,0,0.4)] overflow-hidden">
                <StatsWidget />
            </div>
        </div>
    );
};

export default RuggedDashboard;
