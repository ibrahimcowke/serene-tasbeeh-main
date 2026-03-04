import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const TactileDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-zinc-100 min-h-[85vh] rounded-3xl"
            leftPanelClassName="bg-zinc-50 border border-white/50 shadow-[8px_8px_16px_#bebebe,_-8px_-8px_16px_#ffffff]"
            rightPanelClassName="bg-zinc-50 shadow-[inset_4px_4px_8px_#c8c8c8,_inset_-4px_-4px_8px_#ffffff]"
        >
            <div className="absolute inset-0 pointer-events-none z-0"
                style={{ backgroundImage: 'radial-gradient(#d4d4d8 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>
        </DashboardLayoutWrapper>
    );
};

export default TactileDashboard;
