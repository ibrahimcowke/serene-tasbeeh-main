import { Counter } from '../Counter';
import { StatsWidget } from '../StatsWidget';
import { HadithSlider } from '../HadithSlider';
import { useTasbeehStore } from '@/store/tasbeehStore';

const ClassicDashboard = () => {
    const { currentDhikr } = useTasbeehStore();
    return (
        <div className="flex flex-col gap-8 items-center py-4">
            <div className="w-full max-w-xl">
                <Counter />
            </div>
            <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatsWidget />
                <HadithSlider dhikr={currentDhikr} />
            </div>
        </div>
    );
};

export default ClassicDashboard;
