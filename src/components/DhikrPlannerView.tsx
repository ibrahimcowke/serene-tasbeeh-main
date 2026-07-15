import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, BookOpen, Check, Play, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { toast } from 'sonner';

interface DhikrPlannerViewProps {
  children: React.ReactNode;
}

interface PlannerBlock {
  id: string;
  label: string;
  defaultTime: string;
  dhikrId: string;
  targetCount: number;
}

export function DhikrPlannerView({ children }: DhikrPlannerViewProps) {
  const [open, setOpen] = useState(false);
  const dhikrs = useTasbeehStore((s) => s.dhikrs);
  const setDhikr = useTasbeehStore((s) => s.setDhikr);
  const setTarget = useTasbeehStore((s) => s.setTarget);

  // Initialize planner blocks in local storage or fallback to defaults
  const [blocks, setBlocks] = useState<PlannerBlock[]>(() => {
    const saved = localStorage.getItem('tasbeehly_dhikr_planner');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'morning', label: 'Morning Block (Fajr)', defaultTime: '05:30', dhikrId: 'subahanallah', targetCount: 33 },
      { id: 'midday', label: 'Midday Block (Dhuhr)', defaultTime: '12:30', dhikrId: 'alhamdulillah', targetCount: 33 },
      { id: 'evening', label: 'Evening Block (Asr/Maghrib)', defaultTime: '17:30', dhikrId: 'allahuakbar', targetCount: 33 },
      { id: 'night', label: 'Night Block (Isha)', defaultTime: '21:00', dhikrId: 'la-ilaha-illallah', targetCount: 100 }
    ];
  });

  const saveBlocks = (newBlocks: PlannerBlock[]) => {
    setBlocks(newBlocks);
    localStorage.setItem('tasbeehly_dhikr_planner', JSON.stringify(newBlocks));
  };

  const handleStartBlock = (block: PlannerBlock) => {
    const selectedDhikr = dhikrs.find((d) => d.id === block.dhikrId);
    if (selectedDhikr) {
      setDhikr(selectedDhikr);
      setTarget(block.targetCount);
      toast.success(`Loaded ${selectedDhikr.transliteration} (${block.targetCount}) into counter!`);
      setOpen(false);
    }
  };

  const handleUpdateBlockDhikr = (blockId: string, dhikrId: string) => {
    const updated = blocks.map((b) => (b.id === blockId ? { ...b, dhikrId } : b));
    saveBlocks(updated);
    toast.success('Planner updated.');
  };

  const handleUpdateBlockTarget = (blockId: string, targetCount: number) => {
    const updated = blocks.map((b) => (b.id === blockId ? { ...b, targetCount } : b));
    saveBlocks(updated);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[88vh] flex flex-col">
        <SheetDescription className="sr-only">
          Plan and customize your daily dhikr blocks.
        </SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0">
              <SheetTitle className="text-lg font-medium flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Daily Dhikr Planner
              </SheetTitle>
              <p className="text-xs text-muted-foreground">
                Set targets and assign different adhkar for morning, midday, evening, and bedtime.
              </p>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-8">
              {blocks.map((block) => {
                const activeDhikr = dhikrs.find((d) => d.id === block.dhikrId) || dhikrs[0];
                return (
                  <div
                    key={block.id}
                    className="p-4 rounded-2xl border flex flex-col gap-3 relative overflow-hidden"
                    style={{
                      background: 'hsl(var(--card) / 0.6)',
                      borderColor: 'hsl(var(--border) / 0.4)'
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">{block.label}</span>
                      </div>
                      <span className="text-[10px] bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                        {block.defaultTime}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Dhikr Dropdown Select */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Assigned Dhikr</span>
                        <select
                          value={block.dhikrId}
                          onChange={(e) => handleUpdateBlockDhikr(block.id, e.target.value)}
                          className="px-3 py-2 rounded-xl bg-foreground/5 border border-border/20 text-xs text-foreground focus:outline-none focus:border-primary/50"
                        >
                          {dhikrs.map((d) => (
                            <option key={d.id} value={d.id} className="bg-background text-foreground">
                              {d.transliteration} ({d.arabic})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Target Input */}
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider">Target Count</span>
                        <input
                          type="number"
                          value={block.targetCount}
                          onChange={(e) => handleUpdateBlockTarget(block.id, Math.max(1, parseInt(e.target.value) || 0))}
                          className="px-3 py-2 rounded-xl bg-foreground/5 border border-border/20 text-xs text-foreground focus:outline-none focus:border-primary/50"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleStartBlock(block)}
                      className="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all text-primary flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Start Reciting
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
