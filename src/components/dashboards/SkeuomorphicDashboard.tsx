import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const SkeuomorphicDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-stone-200 relative overflow-hidden rounded-3xl"
            style={{ backgroundImage: 'linear-gradient(to bottom, #e5e5e5, #d4d4d4)' }}>

            <div className="w-full max-w-xl relative z-10 bg-stone-100 p-8 rounded-[3rem] border border-stone-50 
                            shadow-[inset_0_-4px_10px_rgba(0,0,0,0.1),_0_15px_30px_max(0px,calc(1.5vh-10px))_rgba(0,0,0,0.15),_0_4px_8px_rgba(0,0,0,0.1)]">
                {/* Leather texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply rounded-[3rem]"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
                </div>

                {/* Stitching effect */}
                <div className="absolute inset-3 border border-stone-300 border-dashed rounded-[2.5rem] opacity-50 pointer-events-none"></div>

                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-stone-100 rounded-[2rem] border border-stone-50 
                            shadow-[inset_0_-2px_5px_rgba(0,0,0,0.05),_0_10px_20px_rgba(0,0,0,0.1)] overflow-hidden hidden sm:block">
                <div className="absolute inset-2 border border-stone-300 border-dashed rounded-[1.5rem] opacity-50 pointer-events-none"></div>
                <div className="relative z-10 p-2">
                    <StatsWidget />
                </div>
            </div>
        </div>
    );
};

export default SkeuomorphicDashboard;
