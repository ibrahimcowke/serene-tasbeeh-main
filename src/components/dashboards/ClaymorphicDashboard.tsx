import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const ClaymorphicDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-[#f0f0f3] relative overflow-hidden rounded-[3rem]">

            <div className="w-full max-w-xl relative z-10 bg-[#f0f0f3] p-8 rounded-[3rem] 
                            shadow-[inset_-10px_-10px_20px_#ffffff,_inset_10px_10px_20px_#aeaec0,_-10px_-10px_20px_#ffffff,_10px_10px_20px_#aeaec0]
                            transition-all hover:shadow-[inset_-5px_-5px_10px_#ffffff,_inset_5px_5px_10px_#aeaec0,-5px_-5px_10px_#ffffff,_5px_5px_10px_#aeaec0]">
                {/* Inner smooth highlight */}
                <div className="absolute inset-0 rounded-[3rem] border-2 border-white/40 pointer-events-none mx-2 my-2"></div>
                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-[#f0f0f3] rounded-[2.5rem] p-4
                            shadow-[inset_-8px_-8px_16px_#ffffff,_inset_8px_8px_16px_#aeaec0,_-8px_-8px_16px_#ffffff,_8px_8px_16px_#aeaec0] 
                            overflow-hidden hidden sm:block">
                <StatsWidget />
            </div>
        </div>
    );
};

export default ClaymorphicDashboard;
