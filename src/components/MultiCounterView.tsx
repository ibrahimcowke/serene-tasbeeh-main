import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, BookOpen, Hash } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { DhikrSelectorContent } from './DhikrSelectorContent';
import { defaultDhikrs } from '@/store/tasbeehStore';
import type { Dhikr } from '@/store/tasbeehStore';

const formatNumber = (n: number | string, isRTL: boolean): string => {
  if (!isRTL) return n.toString();
  const d = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return n.toString().split('').map(c => d[parseInt(c)] ?? c).join('');
};

interface CounterState {
  id: string;
  dhikr: Dhikr;
  count: number;
}

function createCounterState(dhikr: Dhikr): CounterState {
  return { id: `multi-${Date.now()}-${Math.random()}`, dhikr, count: 0 };
}

interface MultiCounterViewProps {
  children: React.ReactNode;
}

function SingleCounter({
  counter,
  onIncrement,
  onDecrement,
  onChangeDhikr,
  onRemove,
  canRemove,
}: {
  counter: CounterState;
  onIncrement: () => void;
  onDecrement: () => void;
  onChangeDhikr: (d: Dhikr) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [showSelector, setShowSelector] = useState(false);
  const { t, isRTL } = useTranslation();

  return (
    <motion.div
      layout
      className="rounded-2xl border overflow-hidden"
      style={{
        background: 'hsl(var(--card) / 0.6)',
        borderColor: 'hsl(var(--border) / 0.4)',
      }}
    >
      {/* Dhikr header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid hsl(var(--border) / 0.3)' }}
      >
        <button
          onClick={() => setShowSelector((s) => !s)}
          className="flex-1 text-left"
        >
          <p
            className="text-lg text-right"
            style={{
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              color: 'hsl(var(--primary))',
              direction: 'rtl',
            }}
          >
            {counter.dhikr.arabic}
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'hsl(var(--muted-foreground))' }}>
            <BookOpen className="w-3 h-3" />
            {counter.dhikr.transliteration}
          </p>
        </button>
        {canRemove && (
          <button
            onClick={onRemove}
            className="p-2 rounded-xl ml-3"
            style={{ color: 'hsl(var(--destructive))' }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dhikr selector dropdown */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 240, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
            style={{ borderBottom: '1px solid hsl(var(--border) / 0.3)' }}
          >
            <div className="h-60 overflow-y-auto py-2">
              {defaultDhikrs.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { onChangeDhikr(d); setShowSelector(false); }}
                  className="w-full px-4 py-2 text-left hover:bg-primary/5 transition-colors"
                >
                  <p
                    className="text-base text-right"
                    style={{ fontFamily: "'Amiri', serif", color: 'hsl(var(--primary))', direction: 'rtl' }}
                  >
                    {d.arabic}
                  </p>
                  <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>{d.transliteration}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Count display + controls */}
      <div className="p-4 flex items-center justify-between gap-4">


        <motion.div
          key={counter.count}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="flex-1 text-center"
        >
          <p className={`${isRTL ? 'font-arabic' : 'font-sans'} text-4xl font-bold tabular-nums`} style={{ color: 'hsl(var(--primary))' }}>
            {formatNumber(counter.count, isRTL)}
          </p>
        </motion.div>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onIncrement}
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))',
            boxShadow: '0 4px 20px hsl(var(--primary) / 0.4)',
          }}
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      </div>
    </motion.div>
  );
}

export function MultiCounterView({ children }: MultiCounterViewProps) {
  const [open, setOpen] = useState(false);
  const [counters, setCounters] = useState<CounterState[]>([
    createCounterState(defaultDhikrs[0]),
    createCounterState(defaultDhikrs[1]),
  ]);
  const { t, isRTL } = useTranslation();

  const total = counters.reduce((sum, c) => sum + c.count, 0);

  const handleAdd = () => {
    if (counters.length >= 4) return;
    setCounters((cs) => [...cs, createCounterState(defaultDhikrs[counters.length % defaultDhikrs.length])]);
  };

  const handleRemove = (id: string) => {
    setCounters((cs) => cs.filter((c) => c.id !== id));
  };

  const handleIncrement = (id: string) => {
    setCounters((cs) => cs.map((c) => c.id === id ? { ...c, count: c.count + 1 } : c));
    // Haptic
    try { navigator.vibrate(40); } catch {}
  };

  const handleDecrement = (id: string) => {
    setCounters((cs) => cs.map((c) => c.id === id && c.count > 0 ? { ...c, count: c.count - 1 } : c));
  };

  const handleChangeDhikr = (id: string, dhikr: Dhikr) => {
    setCounters((cs) => cs.map((c) => c.id === id ? { ...c, dhikr } : c));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[90vh] flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <SheetDescription className="sr-only">Count multiple dhikrs simultaneously.</SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0">
              <SheetTitle className="text-lg font-medium flex items-center gap-2">
                <Hash className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                {t('multi.title')}
              </SheetTitle>
            </SheetHeader>

            {/* Total */}
            <div className="px-6 pb-3 shrink-0">
              <div
                className="flex items-center justify-between px-5 py-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.06))',
                  border: '1px solid hsl(var(--primary) / 0.2)',
                }}
              >
                <span className="text-sm font-medium" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {t('multi.total')}
                </span>
                <motion.span
                  key={total}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className={`${isRTL ? 'font-arabic' : 'font-sans'} text-2xl font-bold tabular-nums`}
                  style={{ color: 'hsl(var(--primary))' }}
                >
                  {formatNumber(total, isRTL)}
                </motion.span>
              </div>
            </div>

            <ScrollArea className="flex-1 px-6">
              <div className="space-y-3 pb-4">
                {counters.map((counter) => (
                  <SingleCounter
                    key={counter.id}
                    counter={counter}
                    onIncrement={() => handleIncrement(counter.id)}
                    onDecrement={() => handleDecrement(counter.id)}
                    onChangeDhikr={(d) => handleChangeDhikr(counter.id, d)}
                    onRemove={() => handleRemove(counter.id)}
                    canRemove={counters.length > 1}
                  />
                ))}

                {counters.length < 4 && (
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleAdd}
                    className="w-full py-3 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 border-dashed border-2 transition-colors"
                    style={{
                      borderColor: 'hsl(var(--primary) / 0.3)',
                      color: 'hsl(var(--primary) / 0.7)',
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    {t('multi.add_counter')}
                  </motion.button>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
