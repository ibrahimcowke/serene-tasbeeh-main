import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, Star, Flame, Calendar, Share2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useShallow } from 'zustand/react/shallow';
import { toast } from 'sonner';

interface WeeklyReportViewProps {
  children: React.ReactNode;
}

function getWeekRange(offset = 0) {
  const end = new Date();
  end.setDate(end.getDate() - offset * 7);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { start: fmt(start), end: fmt(end) };
}

function datesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    dates.push(cur.toISOString().split('T')[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

export function WeeklyReportView({ children }: WeeklyReportViewProps) {
  const [open, setOpen] = useState(false);
  const { dailyRecords, streakDays, longestStreak, sessions, dailyGoal, dhikrs } = useTasbeehStore(useShallow(s => ({
    dailyRecords: s.dailyRecords,
    streakDays: s.streakDays,
    longestStreak: s.longestStreak,
    sessions: s.sessions,
    dailyGoal: s.dailyGoal,
    dhikrs: s.dhikrs,
  })));

  const thisWeek = useMemo(() => {
    const { start, end } = getWeekRange(0);
    const dates = datesBetween(start, end);
    return dates.map(d => {
      const rec = dailyRecords.find(r => r.date === d);
      return { date: d, count: rec?.totalCount || 0, label: new Date(d + 'T12:00').toLocaleDateString('en-US', { weekday: 'short' }) };
    });
  }, [dailyRecords]);

  const lastWeek = useMemo(() => {
    const { start, end } = getWeekRange(1);
    const dates = datesBetween(start, end);
    return dates.map(d => {
      const rec = dailyRecords.find(r => r.date === d);
      return { date: d, count: rec?.totalCount || 0 };
    });
  }, [dailyRecords]);

  const thisTotal = thisWeek.reduce((s, d) => s + d.count, 0);
  const lastTotal = lastWeek.reduce((s, d) => s + d.count, 0);
  const pctChange = lastTotal > 0 ? Math.round(((thisTotal - lastTotal) / lastTotal) * 100) : thisTotal > 0 ? 100 : 0;

  const bestDay = thisWeek.reduce((best, d) => d.count > best.count ? d : best, thisWeek[0] || { date: '', count: 0, label: '' });
  const activeDays = thisWeek.filter(d => d.count > 0).length;
  const goalDays = thisWeek.filter(d => d.count >= dailyGoal).length;

  // Most recited dhikr this week
  const weekDates = new Set(thisWeek.map(d => d.date));
  const dhikrTotals: Record<string, number> = {};
  dailyRecords.filter(r => weekDates.has(r.date)).forEach(r => {
    Object.entries(r.counts || {}).forEach(([id, c]) => {
      dhikrTotals[id] = (dhikrTotals[id] || 0) + c;
    });
  });
  const topDhikrEntry = Object.entries(dhikrTotals).sort((a, b) => b[1] - a[1])[0];
  const topDhikr = topDhikrEntry ? dhikrs.find(d => d.id === topDhikrEntry[0]) : null;

  const maxBar = Math.max(...thisWeek.map(d => d.count), 1);

  const handleShare = async () => {
    const text = `📿 My Tasbeehly Weekly Report\n\n` +
      `This week: ${thisTotal.toLocaleString()} dhikr\n` +
      `vs last week: ${pctChange >= 0 ? '+' : ''}${pctChange}%\n` +
      `Active days: ${activeDays}/7\n` +
      `Goal days: ${goalDays}/7\n` +
      `Best day: ${bestDay.label} (${bestDay.count.toLocaleString()})\n` +
      `Current streak: 🔥${streakDays} days\n\n` +
      `Alhamdulillah! Keep going! 🌙`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Weekly Dhikr Report', text });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success('Report copied to clipboard!');
      }
    } catch {}
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[92vh] flex flex-col">
        <SheetDescription className="sr-only">Your weekly dhikr summary and insights.</SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0 border-b border-border/20">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-medium flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Weekly Report
                </SheetTitle>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground/60 hover:text-foreground transition-colors cursor-pointer"
                  title="Share report"
                >
                  <Share2 size={14} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {new Date(thisWeek[0]?.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                {' – '}
                {new Date(thisWeek[6]?.date + 'T12:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 space-y-5 pt-4 pb-8">
              {/* Hero stat */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-3xl border bg-gradient-to-br from-primary/10 to-transparent border-primary/20 text-center"
              >
                <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">This Week</p>
                <p className="text-5xl font-black text-foreground tabular-nums">{thisTotal.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">dhikr recitations</p>
                {pctChange !== 0 && (
                  <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full mt-3 text-[10px] font-black ${
                    pctChange > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    <TrendingUp size={10} className={pctChange < 0 ? 'rotate-180' : ''} />
                    {pctChange > 0 ? '+' : ''}{pctChange}% vs last week
                  </div>
                )}
              </motion.div>

              {/* Bar chart */}
              <div className="space-y-2">
                <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">Daily Breakdown</p>
                <div className="flex items-end gap-1.5 h-24">
                  {thisWeek.map((day, i) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center" style={{ height: '72px' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${Math.max(4, (day.count / maxBar) * 100)}%` }}
                          transition={{ delay: i * 0.05, duration: 0.4 }}
                          className={`w-full rounded-t-lg ${day.count >= dailyGoal ? 'bg-primary' : day.count > 0 ? 'bg-primary/40' : 'bg-foreground/10'}`}
                        />
                      </div>
                      <p className="text-[8px] text-muted-foreground/50 font-bold uppercase">{day.label.slice(0, 1)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { icon: <Calendar className="w-4 h-4 text-blue-400" />, label: 'Active Days', value: `${activeDays}/7`, bg: 'bg-blue-500/5 border-blue-500/15' },
                  { icon: <Star className="w-4 h-4 text-yellow-400" />, label: 'Goal Days', value: `${goalDays}/7`, bg: 'bg-yellow-500/5 border-yellow-500/15' },
                  { icon: <Flame className="w-4 h-4 text-orange-400" />, label: 'Streak', value: `${streakDays} days`, bg: 'bg-orange-500/5 border-orange-500/15' },
                  { icon: <TrendingUp className="w-4 h-4 text-green-400" />, label: 'Best Streak', value: `${longestStreak} days`, bg: 'bg-green-500/5 border-green-500/15' },
                ].map(s => (
                  <div key={s.label} className={`flex items-center gap-2.5 p-3 rounded-2xl border ${s.bg}`}>
                    <div className="p-1.5 rounded-lg bg-foreground/5">{s.icon}</div>
                    <div>
                      <p className="text-sm font-black text-foreground">{s.value}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Best day */}
              {bestDay.count > 0 && (
                <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/8 flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="text-xs font-black text-muted-foreground/50 uppercase tracking-wider">Best Day This Week</p>
                    <p className="text-sm font-bold text-foreground">
                      {new Date(bestDay.date + 'T12:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-xs text-primary font-black">{bestDay.count.toLocaleString()} dhikr</p>
                  </div>
                </div>
              )}

              {/* Top dhikr */}
              {topDhikr && (
                <div className="p-4 rounded-2xl bg-foreground/[0.02] border border-foreground/8 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                    <Star className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-wider">Most Recited This Week</p>
                    <p className="text-sm font-bold text-foreground">{topDhikr.transliteration}</p>
                    <p
                      className="text-base text-primary"
                      style={{ fontFamily: "'Amiri','Traditional Arabic',serif", direction: 'rtl' }}
                    >
                      {topDhikr.arabic}
                    </p>
                  </div>
                  <p className="text-base font-black text-primary tabular-nums">{topDhikrEntry![1].toLocaleString()}</p>
                </div>
              )}

              {/* Zero state */}
              {thisTotal === 0 && (
                <div className="flex flex-col items-center py-8 text-center gap-3">
                  <span className="text-4xl">🌱</span>
                  <p className="text-sm font-bold text-foreground/60">No dhikr recorded this week yet</p>
                  <p className="text-xs text-muted-foreground">Start counting today — every dhikr counts!</p>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
