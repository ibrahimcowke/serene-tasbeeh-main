import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const SkeuomorphicDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-stone-200 min-h-[85vh] rounded-3xl"
            leftPanelClassName="bg-stone-100 border border-stone-50 shadow-[inset_0_-4px_10px_rgba(0,0,0,0.1),_0_15px_30px_max(0px,calc(1.5vh-10px))_rgba(0,0,0,0.15),_0_4px_8px_rgba(0,0,0,0.1)]"
            rightPanelClassName="bg-stone-100 border border-stone-50 shadow-[inset_0_-2px_5px_rgba(0,0,0,0.05),_0_10px_20px_rgba(0,0,0,0.1)]"
        >
            {/* Leather texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply rounded-3xl"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
            </div>
        </DashboardLayoutWrapper>
    );
};

export default SkeuomorphicDashboard;
