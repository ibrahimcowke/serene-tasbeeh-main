import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const EmbroideryDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-[#faf0e6] relative overflow-hidden rounded-[2rem] border-8 border-[#d2b48c]">
            {/* Fabric Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-multiply"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'2\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}>
            </div>

            <div className="w-full max-w-xl relative z-10 bg-[#faf0e6] p-8 rounded-full border-[6px] border-dashed border-[#cd5c5c] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),_inset_0_4px_6px_-2px_rgba(0,0,0,0.05)]">
                {/* Inner stitch */}
                <div className="absolute inset-2 border-[2px] border-dotted border-[#ffb6c1] rounded-full pointer-events-none"></div>
                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-[#faf0e6] rounded-[3rem] p-4 
                            border-[4px] border-dashed border-[#4682b4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] hidden sm:block mt-4">
                <div className="absolute inset-2 border-[2px] border-dotted border-[#87ceeb] rounded-[2.5rem] pointer-events-none"></div>
                <StatsWidget />
            </div>
        </div>
    );
};

export default EmbroideryDashboard;
