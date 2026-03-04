import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const MinimalDashboard = () => {
    return (
        <DashboardLayoutWrapper
            leftPanelClassName="opacity-0 pointer-events-none"
            rightPanelClassName="opacity-0 pointer-events-none"
            wrapperClassName="bg-transparent"
        />
    );
};

export default MinimalDashboard;
