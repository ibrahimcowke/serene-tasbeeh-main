import { Counter } from '../Counter';

const ClassicDashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto">
            {/* Main Center Counter handles Dhikr, Counter, Hadith, Stats based on layoutOrder */}
            <div className="w-full h-full flex items-center justify-center relative">
                <Counter />
            </div>
        </div>
    );
};

export default ClassicDashboard;
