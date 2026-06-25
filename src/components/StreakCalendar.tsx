import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame, Calendar } from "lucide-react";
import { useTasbeehStore } from "@/store/tasbeehStore";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function StreakCalendar() {
  const dailyRecords = useTasbeehStore((s) => s.dailyRecords);
  const streakDays = useTasbeehStore((s) => s.streakDays);
  const dailyGoal = useTasbeehStore((s) => s.dailyGoal);

  const today = new Date();
  const [viewDate, setViewDate] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const prevMonth = () => {
    setViewDate((v) => {
      const d = new Date(v.year, v.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const nextMonth = () => {
    setViewDate((v) => {
      const d = new Date(v.year, v.month + 1, 1);
      if (d > today) return v;
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  // Build a map of date -> count for fast lookup
  const countMap: Record<string, number> = {};
  dailyRecords.forEach((r) => { countMap[r.date] = r.totalCount; });

  // Find max count for the current month to normalize opacity
  const firstDay = new Date(viewDate.year, viewDate.month, 1);
  const lastDay = new Date(viewDate.year, viewDate.month + 1, 0);
  let maxCount = 1;
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split("T")[0];
    if ((countMap[key] || 0) > maxCount) maxCount = countMap[key];
  }

  // Calendar grid
  const startDow = firstDay.getDay(); // 0=Sun
  const daysInMonth = lastDay.getDate();

  // Monthly stats
  let monthTotal = 0;
  let monthActiveDays = 0;
  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split("T")[0];
    const cnt = countMap[key] || 0;
    monthTotal += cnt;
    if (cnt > 0) monthActiveDays++;
  }

  const todayStr = today.toISOString().split("T")[0];
  const isCurrentMonth = viewDate.year === today.getFullYear() && viewDate.month === today.getMonth();
  const canGoNext = !isCurrentMonth;

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <span className="text-sm font-medium text-foreground/80">
          {MONTHS[viewDate.month]} {viewDate.year}
        </span>
        <button
          onClick={nextMonth}
          disabled={!canGoNext}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary/10 transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-muted-foreground/60 uppercase pb-1">
            {d}
          </div>
        ))}

        {/* Empty cells before first day */}
        {Array.from({ length: startDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateObj = new Date(viewDate.year, viewDate.month, day);
          const dateStr = dateObj.toISOString().split("T")[0];
          const count = countMap[dateStr] || 0;
          const isToday = dateStr === todayStr;
          const metGoal = count >= dailyGoal;
          const opacity = count > 0 ? Math.max(0.2, count / maxCount) : 0;

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.1 }}
              className="relative aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all"
              style={{
                background: count > 0
                  ? `hsl(var(--primary) / ${opacity * 0.8})`
                  : "hsl(var(--card) / 0.3)",
                border: isToday
                  ? "1.5px solid hsl(var(--primary))"
                  : "1px solid hsl(var(--border) / 0.2)",
                color: count > 0
                  ? opacity > 0.5
                    ? "hsl(var(--primary-foreground))"
                    : "hsl(var(--primary))"
                  : "hsl(var(--muted-foreground) / 0.6)",
              }}
              title={count > 0 ? `${count} dhikr${metGoal ? " ✓ Goal met" : ""}` : undefined}
            >
              {day}
              {metGoal && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-green-500" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 justify-center text-[10px] text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-card/30 border border-border/20" />
          No activity
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--primary) / 0.3)" }} />
          Some
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: "hsl(var(--primary) / 0.85)" }} />
          Active
        </div>
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Goal met
        </div>
      </div>

      {/* Monthly summary */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="rounded-xl p-3 text-center border border-border/30" style={{ background: "hsl(var(--card) / 0.5)" }}>
          <p className="text-lg font-semibold text-primary">{monthActiveDays}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Active Days</p>
        </div>
        <div className="rounded-xl p-3 text-center border border-border/30" style={{ background: "hsl(var(--card) / 0.5)" }}>
          <p className="text-lg font-semibold text-primary">{monthTotal.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Total Count</p>
        </div>
        <div className="rounded-xl p-3 text-center border border-border/30" style={{ background: "hsl(var(--card) / 0.5)" }}>
          <div className="flex items-center justify-center gap-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <p className="text-lg font-semibold text-orange-500">{streakDays}</p>
          </div>
          <p className="text-[10px] text-muted-foreground mt-0.5">Day Streak</p>
        </div>
      </div>
    </div>
  );
}
