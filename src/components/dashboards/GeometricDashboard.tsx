import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const GeometricDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-8 px-4 min-h-[85vh] bg-neutral-900 relative overflow-hidden rounded-[2rem]">
            {/* Geometric Background Patterns */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rotate-45 transform"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] bg-rose-600/20 rotate-[-30deg] transform"></div>
                <div className="absolute top-[30%] left-[60%] w-[20%] h-[20%] border-4 border-yellow-500/20 rounded-full"></div>
                <div className="absolute bottom-[-5%] left-[10%] w-0 h-0 border-l-[100px] border-r-[100px] border-b-[173px] border-l-transparent border-r-transparent border-b-emerald-600/20"></div>
            </div>

            <div className="w-full max-w-xl relative z-10 bg-neutral-800/80 backdrop-blur-md p-8 rounded-none border-l-4 border-b-4 border-neutral-700 shadow-2xl">
                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-neutral-800/80 backdrop-blur-md rounded-none border-t-4 border-r-4 border-neutral-700 p-4 shadow-xl hidden sm:block">
                <StatsWidget />
            </div>
        </div>
    );
};

export default GeometricDashboard;
