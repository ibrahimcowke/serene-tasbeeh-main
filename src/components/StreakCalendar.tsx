import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";
import { useTasbeehStore } from "@/store/tasbeehStore";
import hc from 'hijri-converter';

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HIJRI_MONTHS = [
  "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
  "Jumada al-Awwal", "Jumada al-Thani", "Rajab", "Sha'ban",
  "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
];

export function StreakCalendar() {
  const dailyRecords = useTasbeehStore((s) => s.dailyRecords);
  const streakDays = useTasbeehStore((s) => s.streakDays);
  const dailyGoal = useTasbeehStore((s) => s.dailyGoal);

  // Initialize view date to the current Hijri month
  const today = new Date();
  const currentHijri = useMemo(() => hc.toHijri(today.getFullYear(), today.getMonth() + 1, today.getDate()), []);
  
  const [viewDate, setViewDate] = useState({ year: currentHijri.hy, month: currentHijri.hm });

  const prevMonth = () => {
    setViewDate((v) => {
      let m = v.month - 1;
      let y = v.year;
      if (m < 1) { m = 12; y--; }
      return { year: y, month: m };
    });
  };

  const nextMonth = () => {
    setViewDate((v) => {
      let m = v.month + 1;
      let y = v.year;
      if (m > 12) { m = 1; y++; }
      return { year: y, month: m };
    });
  };

  // Determine how many days are in the current Hijri month
  // We check if day 30 is valid by seeing if it throws an error or maps to the next month
  let daysInMonth = 29;
  try {
      const g = hc.toGregorian(viewDate.year, viewDate.month, 30);
      const test = hc.toHijri(g.gy, g.gm, g.gd);
      if (test.hm === viewDate.month) {
          daysInMonth = 30;
      }
  } catch (e) {
      daysInMonth = 29;
  }

  // Find the Gregorian start date to figure out the weekday
  const firstDayGregorian = hc.toGregorian(viewDate.year, viewDate.month, 1);
  const firstDayObj = new Date(firstDayGregorian.gy, firstDayGregorian.gm - 1, firstDayGregorian.gd);
  const startDow = firstDayObj.getDay();

  // Build a map of Gregorian date -> count for fast lookup
  const countMap: Record<string, number> = {};
  dailyRecords.forEach((r) => { countMap[r.date] = r.totalCount; });

  // Map each Hijri day in the view to its Gregorian equivalent and count
  let maxCount = 1;
  let monthTotal = 0;
  let monthActiveDays = 0;

  const monthDaysData = [];
  for (let d = 1; d <= daysInMonth; d++) {
      let g;
      try {
          g = hc.toGregorian(viewDate.year, viewDate.month, d);
      } catch (e) {
          break; // just in case
      }
      // Format as YYYY-MM-DD
      const dateStr = `${g.gy}-${String(g.gm).padStart(2, '0')}-${String(g.gd).padStart(2, '0')}`;
      const count = countMap[dateStr] || 0;
      
      if (count > maxCount) maxCount = count;
      monthTotal += count;
      if (count > 0) monthActiveDays++;
      
      monthDaysData.push({ day: d, dateStr, count });
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  // Can go next only if current view is before current month
  const canGoNext = viewDate.year < currentHijri.hy || (viewDate.year === currentHijri.hy && viewDate.month < currentHijri.hm);

  return (
    <div className="space-y-4 px-2 pt-2">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="text-center">
            <span className="block text-base font-semibold text-foreground/90">
                {HIJRI_MONTHS[viewDate.month - 1]}
            </span>
            <span className="block text-[11px] text-muted-foreground font-medium">
                {viewDate.year} AH
            </span>
        </div>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1.5 mt-4">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-semibold text-muted-foreground/80 uppercase pb-2">
            {d}
          </div>
        ))}

        {/* Empty cells before first day */}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {monthDaysData.map(({ day, dateStr, count }) => {
          const isToday = dateStr === todayStr;
          const metGoal = count >= dailyGoal;
          const opacity = count > 0 ? Math.max(0.25, count / maxCount) : 0;

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.1 }}
              className="relative aspect-square flex items-center justify-center rounded-[10px] text-[13px] font-semibold transition-all shadow-sm"
              style={{
                background: count > 0
                  ? `hsl(var(--primary) / ${opacity * 0.8})`
                  : "hsl(var(--card))",
                border: isToday
                  ? "2px solid hsl(var(--primary))"
                  : "1px solid hsl(var(--border) / 0.4)",
                color: count > 0
                  ? opacity > 0.5
                    ? "hsl(var(--primary-foreground))"
                    : "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground) / 0.7)",
              }}
              title={count > 0 ? `${count} dhikr${metGoal ? " ✓ Goal met" : ""}` : undefined}
            >
              {day}
              {metGoal && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-green-500 shadow-sm border border-background" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground/80 font-medium pt-2 pb-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[3px] bg-card border border-border/40" />
          No activity
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[3px]" style={{ background: "hsl(var(--primary) / 0.3)" }} />
          Some
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-[3px]" style={{ background: "hsl(var(--primary) / 0.85)" }} />
          Active
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          Goal met
        </div>
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-3.5 text-center bg-card/60 border border-border/40 shadow-sm backdrop-blur-sm">
          <p className="text-xl font-bold text-primary">{monthActiveDays}</p>
          <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">Active Days</p>
        </div>
        <div className="rounded-2xl p-3.5 text-center bg-card/60 border border-border/40 shadow-sm backdrop-blur-sm">
          <p className="text-xl font-bold text-primary">{monthTotal.toLocaleString()}</p>
          <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">Total Count</p>
        </div>
        <div className="rounded-2xl p-3.5 text-center bg-card/60 border border-border/40 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500/20" />
            <p className="text-xl font-bold text-orange-500">{streakDays}</p>
          </div>
          <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">Day Streak</p>
        </div>
      </div>
    </div>
  );
}
