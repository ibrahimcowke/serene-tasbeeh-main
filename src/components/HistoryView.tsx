import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface HistoryViewProps {
  children: React.ReactNode;
}

export function HistoryView({ children }: HistoryViewProps) {
  const { dailyRecords, totalAllTime, dhikrs, customDhikrs, streakDays, longestStreak } = useTasbeehStore();
  const allDhikrs = [...dhikrs, ...customDhikrs];

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = dailyRecords.find(r => r.date === today);
    
    // Last 7 days
    const last7Days = dailyRecords
      .filter(r => {
        const recordDate = new Date(r.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return recordDate >= weekAgo;
      })
      .reduce((sum, r) => sum + r.totalCount, 0);

    // Last 30 days
    const last30Days = dailyRecords
      .filter(r => {
        const recordDate = new Date(r.date);
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        return recordDate >= monthAgo;
      })
      .reduce((sum, r) => sum + r.totalCount, 0);

    return {
      today: todayRecord?.totalCount || 0,
      week: last7Days,
      month: last30Days,
      allTime: totalAllTime,
    };
  }, [dailyRecords, totalAllTime]);

  // Get last 7 days for streak visualization
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const record = dailyRecords.find(r => r.date === dateStr);
      days.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hasActivity: record && record.totalCount > 0,
        count: record?.totalCount || 0,
      });
    }
    return days;
  }, [dailyRecords]);

  const recentDays = useMemo(() => {
    return [...dailyRecords]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 14);
  }, [dailyRecords]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    }
    if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getDhikrName = (id: string) => {
    const dhikr = allDhikrs.find(d => d.id === id);
    return dhikr?.transliteration || id;
  };

  const getStreakMessage = () => {
    if (streakDays === 0) return "Start your journey today";
    if (streakDays === 1) return "Beautiful start";
    if (streakDays < 7) return "Building consistency";
    if (streakDays < 30) return "Wonderful dedication";
    if (streakDays < 100) return "Blessed persistence";
    return "Truly inspiring";
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[85vh]">
        <div className="sheet-handle" />
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-lg font-medium">Your Progress</SheetTitle>
        </SheetHeader>
        
        <div className="overflow-y-auto pb-8 space-y-6 max-h-[calc(85vh-80px)]">
          {/* Streak card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/30 border border-primary/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center">
                  <Flame className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-light text-foreground">{streakDays}</p>
                  <p className="text-sm text-muted-foreground">day streak</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Best</p>
                <p className="text-lg font-light text-foreground">{longestStreak} days</p>
              </div>
            </div>
            
            <p className="text-sm text-primary mb-4">{getStreakMessage()}</p>
            
            {/* Week visualization */}
            <div className="flex justify-between gap-1">
              {weekDays.map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all
                      ${day.hasActivity 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    {day.hasActivity ? '✓' : ''}
                  </div>
                  <span className="text-xs text-muted-foreground">{day.dayName}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Today', value: stats.today },
              { label: 'This Week', value: stats.week },
              { label: 'This Month', value: stats.month },
              { label: 'All Time', value: stats.allTime },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 + 0.2 }}
                className="p-4 rounded-2xl bg-card"
              >
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-light text-foreground">
                  {stat.value.toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Recent activity */}
          {recentDays.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-3">Recent Activity</p>
              <div className="space-y-2">
                {recentDays.map((record, index) => (
                  <motion.div
                    key={record.date}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 + 0.3 }}
                    className="p-4 rounded-2xl bg-card"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(record.date)}
                      </p>
                      <p className="text-lg font-light text-foreground">
                        {record.totalCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(record.counts).map(([dhikrId, count]) => (
                        <span
                          key={dhikrId}
                          className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground"
                        >
                          {getDhikrName(dhikrId)}: {count}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {recentDays.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No activity yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Start counting to see your progress
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
