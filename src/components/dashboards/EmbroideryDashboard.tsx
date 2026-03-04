import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const EmbroideryDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-[#faf0e6] min-h-[85vh] rounded-[2rem] border-8 border-[#d2b48c]"
            leftPanelClassName="bg-[#faf0e6] border-[6px] border-dashed border-[#cd5c5c] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),_inset_0_4px_6px_-2px_rgba(0,0,0,0.05)] rounded-full pb-8"
            rightPanelClassName="bg-[#faf0e6] border-[4px] border-dashed border-[#4682b4] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] rounded-[3rem]"
            centerContentClassName="bg-[#faf0e6]/80 p-4 rounded-[3rem] border-4 border-dotted border-[#ffb6c1]"
        >
            {/* Fabric Texture */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0 mix-blend-multiply"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'2\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}>
            </div>
        </DashboardLayoutWrapper>
    );
};

export default EmbroideryDashboard;
