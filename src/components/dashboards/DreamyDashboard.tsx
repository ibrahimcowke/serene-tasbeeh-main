import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const DreamyDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-gradient-to-tr from-pink-100 via-purple-100 to-indigo-100 min-h-[85vh] rounded-3xl"
            leftPanelClassName="bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_20px_40px_-10px_rgba(236,72,153,0.15)] rounded-[4rem]"
            rightPanelClassName="bg-white/40 backdrop-blur-3xl border border-white/60 shadow-[0_15px_30px_-10px_rgba(99,102,241,0.1)] rounded-[3rem]"
        >
            {/* Soft Clouds/Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/60 rounded-full blur-3xl z-0 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-pink-300/30 rounded-full blur-3xl z-0 pointer-events-none mix-blend-multiply"></div>
        </DashboardLayoutWrapper>
    );
};

export default DreamyDashboard;
