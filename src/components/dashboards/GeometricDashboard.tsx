import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const GeometricDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-neutral-900 min-h-[85vh] rounded-[2rem]"
            leftPanelClassName="bg-neutral-800/80 backdrop-blur-md border-l-4 border-b-4 border-neutral-700 shadow-2xl rounded-none"
            rightPanelClassName="bg-neutral-800/80 backdrop-blur-md border-t-4 border-r-4 border-neutral-700 shadow-xl rounded-none"
        >
            {/* Geometric Background Patterns */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-5%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rotate-45 transform"></div>
                <div className="absolute bottom-[20%] right-[-10%] w-[30%] h-[50%] bg-rose-600/20 rotate-[-30deg] transform"></div>
                <div className="absolute top-[30%] left-[60%] w-[20%] h-[20%] border-4 border-yellow-500/20 rounded-full"></div>
                <div className="absolute bottom-[-5%] left-[10%] w-0 h-0 border-l-[100px] border-r-[100px] border-b-[173px] border-l-transparent border-r-transparent border-b-emerald-600/20"></div>
            </div>
        </DashboardLayoutWrapper>
    );
};

export default GeometricDashboard;
