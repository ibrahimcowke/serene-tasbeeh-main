import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const NeumorphicDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-[#e0e5ec] min-h-[85vh] rounded-[40px]"
            leftPanelClassName="bg-[#e0e5ec] shadow-[9px_9px_16px_rgb(163,177,198,0.6),_-9px_-9px_16px_rgba(255,255,255,0.5)] border border-[#e0e5ec]"
            rightPanelClassName="bg-[#e0e5ec] shadow-[inset_6px_6px_10px_0_rgba(163,177,198,0.7),_inset_-6px_-6px_10px_0_rgba(255,255,255,0.8)] border border-[#e0e5ec]"
        />
    );
};

export default NeumorphicDashboard;
