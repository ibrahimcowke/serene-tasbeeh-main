import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const PopArtDashboard = () => {
    return (
        <div style={{ backgroundImage: 'radial-gradient(black 2px, transparent 2px)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} className="h-full">
            <DashboardLayoutWrapper
                wrapperClassName="bg-yellow-400 min-h-[85vh] rounded-xl border-4 border-black"
                leftPanelClassName="bg-cyan-400 border-4 border-black shadow-[12px_12px_0_#000000] rounded-xl"
                rightPanelClassName="bg-pink-400 border-4 border-black shadow-[12px_12px_0_#000000] rounded-xl"
                centerContentClassName="bg-white/90 p-4 border-4 border-black shadow-[12px_12px_0_#000000] rounded-xl"
                centerPanelExtraElements={
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-500 rounded-full border-4 border-black flex items-center justify-center transform rotate-12 shadow-[6px_6px_0_#000000] z-0 pointer-events-none">
                        <span className="font-black text-white text-3xl">WOW!</span>
                    </div>
                }
            />
        </div>
    );
};

export default PopArtDashboard;
