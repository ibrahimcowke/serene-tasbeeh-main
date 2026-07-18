import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ChevronDown, ChevronUp, Sparkles, Brain, Share2 } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { asmaulHusna, AsmaulHusnaEntry } from '@/data/asmaulHusna';
import { useTranslation } from '@/lib/i18n';
import { toast } from 'sonner';
import { AsmaulHusnaQuiz } from './AsmaulHusnaQuiz';

const formatNumber = (n: number | string, isRTL: boolean): string => {
  if (!isRTL) return n.toString();
  const d = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return n.toString().split('').map(c => d[parseInt(c)] ?? c).join('');
};

interface AsmaulHusnaViewProps {
  children: React.ReactNode;
}

function NameCard({ entry, onCount, onMeditate }: { entry: AsmaulHusnaEntry; onCount: () => void; onMeditate?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const [localCount, setLocalCount] = useState(0);
  const { isRTL } = useTranslation();
  const { t } = useTranslation();

  const handleCount = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalCount((c) => c + 1);
    onCount();
  };

  return (
    <motion.div
      layout
      className="rounded-2xl border overflow-hidden cursor-pointer"
      style={{
        background: 'hsl(var(--card) / 0.6)',
        borderColor: 'hsl(var(--border) / 0.4)',
      }}
      onClick={() => setExpanded((p) => !p)}
    >
      <div className="px-4 py-3 flex items-start gap-3" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Number badge */}
        <div
          className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isRTL ? 'font-arabic' : 'font-sans'}`}
          style={{
            background: 'hsl(var(--primary) / 0.15)',
            color: 'hsl(var(--primary))',
            border: '1px solid hsl(var(--primary) / 0.3)',
          }}
        >
          {formatNumber(entry.number, isRTL)}
        </div>

        <div className="flex-1 min-w-0">
          {/* Arabic name */}
          <p
            className="text-right text-2xl leading-relaxed mb-0.5"
            style={{
              fontFamily: "'Amiri', 'Traditional Arabic', serif",
              color: 'hsl(var(--primary))',
              direction: 'rtl',
            }}
          >
            {entry.arabic}
          </p>
          {/* Transliteration */}
          <p className="text-sm font-medium" style={{ color: 'hsl(var(--foreground) / 0.85)' }}>
            {entry.transliteration}
          </p>
          {/* Meaning */}
          <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
            {entry.meaning}
          </p>
        </div>

        <div className="flex flex-col items-center gap-1 shrink-0">
          {expanded ? (
            <ChevronUp className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
          )}
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              borderTop: '1px solid hsl(var(--border) / 0.3)',
              background: 'hsl(var(--primary) / 0.03)',
            }}
          >
            <div className="px-4 py-3 space-y-2.5">
              <p className="text-xs leading-relaxed" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {entry.brief}
              </p>
              
              <div className="grid grid-cols-2 gap-2 mt-1">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCount}
                  className="py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: 'hsl(var(--primary) / 0.15)',
                    color: 'hsl(var(--primary))',
                    border: '1px solid hsl(var(--primary) / 0.3)',
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {t('names.count_this')}
                  {localCount > 0 && (
                      <span
                        className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${isRTL ? 'font-arabic' : 'font-sans'}`}
                        style={{ background: 'hsl(var(--primary))', color: 'hsl(var(--primary-foreground))' }}
                      >
                        {formatNumber(localCount, isRTL)}
                      </span>
                  )}
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => { e.stopPropagation(); onMeditate?.(); }}
                  className="py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all bg-primary text-primary-foreground cursor-pointer"
                >
                  Meditate
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function AsmaulHusnaView({ children }: AsmaulHusnaViewProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const increment = useTasbeehStore((s) => s.increment);
  const setDhikr = useTasbeehStore((s) => s.setDhikr);
  const { t, isRTL } = useTranslation();

  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const nameOfTheDay = useMemo(() => {
    return asmaulHusna[getDayOfYear() % asmaulHusna.length];
  }, []);

  const handleMeditate = (entry: AsmaulHusnaEntry) => {
    setDhikr({
      id: `name_${entry.number}`,
      arabic: entry.arabic,
      translation: entry.meaning,
      transliteration: entry.transliteration,
      category: 'names'
    });
    toast.success(`${entry.transliteration} loaded into counter! 📿`);
    setOpen(false);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return asmaulHusna;
    return asmaulHusna.filter(
      (e) =>
        e.transliteration.toLowerCase().includes(q) ||
        e.meaning.toLowerCase().includes(q) ||
        e.arabic.includes(q)
    );
  }, [search]);

  const handleCount = () => {
    increment();
    toast.success('سبحان الله', { description: 'Count recorded', duration: 800 });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[90vh] flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        <SheetDescription className="sr-only">Browse and count the 99 Names of Allah.</SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0">
              <SheetTitle className="text-lg font-medium flex items-center gap-2">
                <Star className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                {t('names.title')}
              </SheetTitle>
              <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                {t('names.subtitle')}
              </p>
            </SheetHeader>

            {/* Quiz Mode entry */}
            <div className="px-6 pb-2 shrink-0">
              <AsmaulHusnaQuiz>
                <button className="flex items-center gap-2 w-full py-2.5 px-4 rounded-xl border text-xs font-black uppercase tracking-wider transition-all hover:bg-primary/10 cursor-pointer"
                  style={{ color: 'hsl(var(--primary))', borderColor: 'hsl(var(--primary)/0.25)', background: 'hsl(var(--primary)/0.05)' }}
                >
                  <Brain className="w-4 h-4" />
                  Quiz Mode — Test Your Knowledge
                </button>
              </AsmaulHusnaQuiz>
            </div>

            {/* Name of the Day widget */}
            {!search && (
              <div className="px-6 pb-4 shrink-0">
                <div
                  className="rounded-2xl p-4 border relative overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
                  style={{ borderColor: 'hsl(var(--primary) / 0.3)' }}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">Name of the Day</span>
                      <h3 className="text-sm font-bold text-foreground mt-0.5">{nameOfTheDay.transliteration}</h3>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-normal">{nameOfTheDay.meaning}</p>
                    </div>
                    <p 
                      className="font-arabic text-3xl text-primary"
                      style={{ fontFamily: "'Amiri', 'Traditional Arabic', serif", direction: 'rtl' }}
                    >
                      {nameOfTheDay.arabic}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMeditate(nameOfTheDay)}
                    className="w-full py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-primary text-primary-foreground mt-3 hover:bg-primary/95 transition-all cursor-pointer"
                  >
                    Meditate with this Name
                  </button>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="px-6 pb-3 shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                <Input
                  placeholder={t('names.search')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-xl"
                  style={{ background: 'hsl(var(--card) / 0.6)' }}
                />
              </div>
            </div>

            {/* Stats bar */}
            <div className="px-6 pb-3 shrink-0">
              <div
                className="flex items-center gap-3 px-4 py-2 rounded-xl"
                style={{
                  background: 'hsl(var(--primary) / 0.08)',
                  border: '1px solid hsl(var(--primary) / 0.2)',
                }}
              >
                <Sparkles className="w-4 h-4 shrink-0" style={{ color: 'hsl(var(--primary))' }} />
                <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  {filtered.length} / 99 names — Tap a name to expand, then count
                </p>
              </div>
            </div>

            {/* List */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-3 pb-8">
                {filtered.map((entry) => (
                  <NameCard key={entry.number} entry={entry} onCount={handleCount} onMeditate={() => handleMeditate(entry)} />
                ))}
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
