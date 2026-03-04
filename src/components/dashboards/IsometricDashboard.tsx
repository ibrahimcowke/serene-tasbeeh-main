import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const IsometricDashboard = () => {
    return (
        <div className="flex flex-col gap-12 items-center py-16 px-4 min-h-[85vh] bg-[#fdfdfd] relative overflow-hidden rounded-3xl"
            style={{ backgroundImage: 'linear-gradient(30deg, #f0f0f0 12%, transparent 12.5%, transparent 87%, #f0f0f0 87.5%, #f0f0f0), linear-gradient(150deg, #f0f0f0 12%, transparent 12.5%, transparent 87%, #f0f0f0 87.5%, #f0f0f0), linear-gradient(30deg, #f0f0f0 12%, transparent 12.5%, transparent 87%, #f0f0f0 87.5%, #f0f0f0), linear-gradient(150deg, #f0f0f0 12%, transparent 12.5%, transparent 87%, #f0f0f0 87.5%, #f0f0f0), linear-gradient(60deg, #e6e6e6 25%, transparent 25.5%, transparent 75%, #e6e6e6 75%, #e6e6e6), linear-gradient(60deg, #e6e6e6 25%, transparent 25.5%, transparent 75%, #e6e6e6 75%, #e6e6e6)', backgroundSize: '40px 70px', backgroundPosition: '0 0, 0 0, 20px 35px, 20px 35px, 0 0, 20px 35px' }}>

            <div className="w-full max-w-xl relative z-10 bg-white p-8 rounded-none border border-gray-100 shadow-[15px_15px_0_#d1d5db] transform transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[18px_18px_0_#d1d5db]">
                <div className="absolute top-0 right-[-15px] w-[15px] h-full bg-gray-200 transform origin-left skew-y-45 shrink-0 border-r border-gray-300 pointer-events-none"></div>
                <div className="absolute bottom-[-15px] left-0 w-full h-[15px] bg-gray-300 transform origin-top skew-x-45 shrink-0 border-b border-gray-400 pointer-events-none"></div>

                <Counter />
            </div>

            <div className="w-full max-w-2xl relative z-10 bg-white p-4 rounded-none border border-gray-100 shadow-[15px_15px_0_#d1d5db] transform transition-transform hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[18px_18px_0_#d1d5db] hidden sm:block mt-8">
                <div className="absolute top-0 right-[-15px] w-[15px] h-full bg-gray-200 transform origin-left skew-y-45 shrink-0 border-r border-gray-300 pointer-events-none"></div>
                <div className="absolute bottom-[-15px] left-0 w-full h-[15px] bg-gray-300 transform origin-top skew-x-45 shrink-0 border-b border-gray-400 pointer-events-none"></div>

                <StatsWidget />
            </div>
        </div>
    );
};

export default IsometricDashboard;
