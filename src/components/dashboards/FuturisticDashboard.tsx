import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const FuturisticDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-zinc-950 text-cyan-50 min-h-[85vh] rounded-xl border border-cyan-900/30 shadow-[0_0_30px_rgba(6,182,212,0.15)_inset]"
            leftPanelClassName="bg-zinc-900/80 backdrop-blur-sm border border-cyan-800/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            rightPanelClassName="bg-zinc-900/80 backdrop-blur-sm border border-cyan-800/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
            {/* Cyber Grid */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0"
                style={{ backgroundImage: 'linear-gradient(to right, #0891b2 1px, transparent 1px), linear-gradient(to bottom, #0891b2 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            {/* UI Accents */}
            <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-500/50 rounded-tl-xl pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-cyan-500/50 rounded-br-xl pointer-events-none"></div>
        </DashboardLayoutWrapper>
    );
};

export default FuturisticDashboard;
