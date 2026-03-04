import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const NeumorphicDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-[#e0e5ec] relative overflow-hidden rounded-[40px]">

            <div className="w-full max-w-xl relative z-10 bg-[#e0e5ec] p-8 rounded-[40px] 
                            shadow-[9px_9px_16px_rgb(163,177,198,0.6),_-9px_-9px_16px_rgba(255,255,255,0.5)] border border-[#e0e5ec]">
                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-[#e0e5ec] rounded-[30px] p-4
                            shadow-[inset_6px_6px_10px_0_rgba(163,177,198,0.7),_inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)] 
                            overflow-hidden hidden sm:block">
                <StatsWidget />
            </div>
        </div>
    );
};

export default NeumorphicDashboard;
