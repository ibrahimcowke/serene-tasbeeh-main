import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const OrigamiDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-orange-50 min-h-[85vh] rounded-3xl"
            leftPanelClassName="bg-white shadow-[10px_10px_0_rgba(0,0,0,0.05)] border border-orange-100 [clip-path:polygon(0_20px,20px_0,100%_0,100%_calc(100%-20px),calc(100%-20px)_100%,0_100%)] rounded-none"
            rightPanelClassName="bg-white shadow-[10px_10px_0_rgba(0,0,0,0.05)] border border-orange-100 [clip-path:polygon(15px_0,100%_0,100%_100%,0_100%,0_15px)] rounded-none"
        >
            {/* Origami creases background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 right-0 w-[150%] h-[1px] bg-black/5 origin-top-right rotate-45 transform"></div>
                <div className="absolute top-0 left-0 w-[150%] h-[1px] bg-black/5 origin-top-left -rotate-45 transform"></div>
                <div className="absolute bottom-0 right-1/2 w-[1px] h-[150%] bg-white/40 rotate-[30deg] transform"></div>
            </div>
        </DashboardLayoutWrapper>
    );
};

export default OrigamiDashboard;
