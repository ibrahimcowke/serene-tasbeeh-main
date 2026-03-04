import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';

const IsometricDashboard = () => {
    return (
        <div style={{ backgroundImage: 'linear-gradient(30deg, #f0f0f0 12%, transparent 12.5%, transparent 87%, #f0f0f0 87.5%, #f0f0f0), linear-gradient(150deg, #f0f0f0 12%, transparent 12.5%, transparent 87%, #f0f0f0 87.5%, #f0f0f0), linear-gradient(30deg, #f0f0f0 12%, transparent 12.5%, transparent 87%, #f0f0f0 87.5%, #f0f0f0), linear-gradient(150deg, #f0f0f0 12%, transparent 12.5%, transparent 87%, #f0f0f0 87.5%, #f0f0f0), linear-gradient(60deg, #e6e6e6 25%, transparent 25.5%, transparent 75%, #e6e6e6 75%, #e6e6e6), linear-gradient(60deg, #e6e6e6 25%, transparent 25.5%, transparent 75%, #e6e6e6 75%, #e6e6e6)', backgroundSize: '40px 70px', backgroundPosition: '0 0, 0 0, 20px 35px, 20px 35px, 0 0, 20px 35px' }} className="h-full">
            <DashboardLayoutWrapper
                wrapperClassName="bg-[#fdfdfd]/90 backdrop-blur-sm min-h-[85vh] rounded-3xl"
                leftPanelClassName="bg-white border border-gray-100 shadow-[15px_15px_0_#d1d5db] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[18px_18px_0_#d1d5db] transition-transform duration-300 rounded-none transform"
                rightPanelClassName="bg-white border border-gray-100 shadow-[15px_15px_0_#d1d5db] hover:translate-y-[-4px] hover:translate-x-[-4px] hover:shadow-[18px_18px_0_#d1d5db] transition-transform duration-300 rounded-none transform"
                centerContentClassName="bg-white/80 border border-gray-100 shadow-[15px_15px_0_#d1d5db] rounded-none rotate-0"
            />
        </div>
    );
};

export default IsometricDashboard;
