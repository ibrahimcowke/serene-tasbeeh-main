import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const GlassmorphicDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 min-h-[85vh] rounded-3xl"
            leftPanelClassName="bg-white/20 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] rounded-[40px] relative"
            rightPanelClassName="bg-white/20 backdrop-blur-2xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] rounded-[30px] relative"
        >
            {/* Colorful background shapes */}
            <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-400/40 rounded-full blur-[100px] z-0 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-pink-400/40 rounded-full blur-[100px] z-0 pointer-events-none"></div>
            <div className="absolute top-[40%] left-[20%] w-64 h-64 bg-blue-400/30 rounded-full blur-[80px] z-0 pointer-events-none"></div>

            {/* Global inner highlights that affect the children content - rendered outside panel backgrounds */}
        </DashboardLayoutWrapper>
    );
};

export default GlassmorphicDashboard;
