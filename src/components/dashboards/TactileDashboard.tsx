import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const TactileDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-zinc-100 relative overflow-hidden rounded-3xl"
            style={{ backgroundImage: 'radial-gradient(#d4d4d8 1px, transparent 1px)', backgroundSize: '20px 20px' }}>

            <div className="w-full max-w-xl relative z-10 bg-zinc-50 p-8 rounded-[2rem] 
                            shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_#ffffff] border border-white/50">
                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-zinc-50 rounded-[1.5rem] p-4
                            shadow-[inset_4px_4px_8px_#c8c8c8,_inset_-4px_-4px_8px_#ffffff] overflow-hidden hidden sm:block">
                <StatsWidget />
            </div>
        </div>
    );
};

export default TactileDashboard;
