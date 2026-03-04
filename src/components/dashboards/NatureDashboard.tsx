import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const NatureDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-stone-50 min-h-[85vh] rounded-3xl shadow-inner border border-stone-200"
            leftPanelClassName="bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)] shadow-emerald-900/5"
            rightPanelClassName="bg-white/60 backdrop-blur-md border border-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"
        >
            {/* Natural gradient ground/sky */}
            <div className="absolute inset-0 bg-gradient-to-b from-teal-50/80 via-yellow-50/50 to-emerald-100/50 pointer-events-none z-0"></div>

            {/* Organic light blobs */}
            <div className="absolute top-10 right-20 w-72 h-72 bg-emerald-300/30 rounded-full blur-[80px] z-0 pointer-events-none mix-blend-multiply"></div>
            <div className="absolute bottom-10 left-10 w-80 h-80 bg-lime-200/40 rounded-[100px] rotate-45 blur-[80px] z-0 pointer-events-none mix-blend-multiply"></div>
        </DashboardLayoutWrapper>
    );
};

export default NatureDashboard;
