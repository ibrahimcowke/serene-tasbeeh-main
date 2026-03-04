import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const RuggedDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-stone-900 text-stone-100 min-h-[85vh] rounded-md border-4 border-stone-800 shadow-[8px_8px_0_rgba(0,0,0,0.5)]"
            leftPanelClassName="bg-stone-800 border-2 border-stone-700 shadow-[4px_4px_0_rgba(0,0,0,0.4)] rounded-sm p-4"
            rightPanelClassName="bg-stone-800 border-2 border-stone-700 shadow-[4px_4px_0_rgba(0,0,0,0.4)] rounded-sm p-4"
        >
            {/* Texture/Noise */}
            <div className="absolute inset-0 opacity-10 pointer-events-none z-0 mix-blend-overlay"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}>
            </div>

            {/* Industrial accents */}
            <div className="absolute top-4 left-4 w-4 h-4 bg-stone-700 rounded-full shadow-inner border border-stone-950 pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-4 h-4 bg-stone-700 rounded-full shadow-inner border border-stone-950 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 bg-stone-700 rounded-full shadow-inner border border-stone-950 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 bg-stone-700 rounded-full shadow-inner border border-stone-950 pointer-events-none"></div>
        </DashboardLayoutWrapper>
    );
};

export default RuggedDashboard;
