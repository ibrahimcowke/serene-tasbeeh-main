import { DashboardLayoutWrapper } from './DashboardLayoutWrapper';
import { HistoryView } from '../HistoryView';
import { Clock } from 'lucide-react';

const TimelineDashboard = () => {
    return (
        <DashboardLayoutWrapper
            centerPanelExtraElements={
                <div className="w-full bg-card/30 backdrop-blur-xl border border-white/5 rounded-3xl p-6 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="w-5 h-5 text-primary" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">My Activity</h2>
                    </div>
                    <div className="h-[200px] overflow-y-auto custom-scrollbar">
                        <HistoryView>
                            <div />
                        </HistoryView>
                    </div>
                </div>
            }
        />
    );
};

export default TimelineDashboard;
