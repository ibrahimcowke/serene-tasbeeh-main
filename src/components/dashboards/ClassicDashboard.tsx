import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';

const ClassicDashboard = () => {
    return (
        <div className="flex flex-col gap-8 items-center py-4">
            <div className="w-full max-w-xl">
                <Counter />
            </div>
            <div className="w-full max-w-2xl">
                <StatsWidget />
            </div>
        </div>
    );
};

export default ClassicDashboard;
