import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const OrigamiDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-orange-50 relative overflow-hidden rounded-3xl">
            {/* Origami creases background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[150%] h-[1px] bg-black/5 origin-top-right rotate-45 transform"></div>
                <div className="absolute top-0 left-0 w-[150%] h-[1px] bg-black/5 origin-top-left -rotate-45 transform"></div>
                <div className="absolute bottom-0 right-1/2 w-[1px] h-[150%] bg-white/40 rotate-[30deg] transform"></div>
            </div>

            <div className="w-full max-w-xl relative z-10 bg-white p-8 
                            shadow-[10px_10px_0_rgba(0,0,0,0.05)] border border-orange-100
                            [clip-path:polygon(0_20px,20px_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)]">
                {/* Fold accents */}
                <div className="absolute top-0 left-0 border-[10px] border-b-orange-100 border-r-orange-100 border-t-transparent border-l-transparent"></div>
                <div className="absolute bottom-0 right-0 border-[10px] border-t-orange-100 border-l-orange-100 border-b-transparent border-r-transparent"></div>
                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-white 
                            shadow-[10px_10px_0_rgba(0,0,0,0.05)] border border-orange-100 overflow-hidden hidden sm:block
                            [clip-path:polygon(15px_0,100%_0,100%_100%,0_100%,0_15px)]">
                <StatsWidget />
            </div>
        </div>
    );
};

export default OrigamiDashboard;
