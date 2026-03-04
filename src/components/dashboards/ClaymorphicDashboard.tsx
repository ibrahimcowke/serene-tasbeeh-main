import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const ClaymorphicDashboard = () => {
    return (
        <DashboardLayoutWrapper
            wrapperClassName="bg-[#f0f0f3] min-h-[85vh] rounded-[3rem]"
            leftPanelClassName="bg-[#f0f0f3] shadow-[inset_-10px_-10px_20px_#ffffff,_inset_10px_10px_20px_#aeaec0,_-10px_-10px_20px_#ffffff,_10px_10px_20px_#aeaec0]"
            rightPanelClassName="bg-[#f0f0f3] shadow-[inset_-8px_-8px_16px_#ffffff,_inset_8px_8px_16px_#aeaec0,_-8px_-8px_16px_#ffffff,_8px_8px_16px_#aeaec0]"
        >
            {/* Inner smooth highlight for background */}
            <div className="absolute inset-0 rounded-[3rem] border-2 border-white/40 pointer-events-none mx-2 my-2 z-0"></div>
        </DashboardLayoutWrapper>
    );
};

export default ClaymorphicDashboard;
