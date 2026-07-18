import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, RefreshCw, Sunrise, Sunset, Moon, Sun, Star } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { getPrayerTimesForToday, getNextPrayer, type PrayerTime } from '@/lib/prayerTimes';
import { toast } from 'sonner';

interface PrayerTimesViewProps {
  children: React.ReactNode;
}

const PRAYER_ICONS: Record<string, React.ReactNode> = {
  fajr:    <Sunrise className="w-4 h-4" />,
  dhuhr:   <Sun className="w-4 h-4" />,
  asr:     <Sun className="w-4 h-4 opacity-70" />,
  maghrib: <Sunset className="w-4 h-4" />,
  isha:    <Moon className="w-4 h-4" />,
};

const PRAYER_COLORS: Record<string, string> = {
  fajr:    'text-blue-400 bg-blue-500/10 border-blue-500/20',
  dhuhr:   'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  asr:     'text-orange-400 bg-orange-500/10 border-orange-500/20',
  maghrib: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  isha:    'text-purple-400 bg-purple-500/10 border-purple-500/20',
};

function formatCountdown(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

function formatTime(time: string): string {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${period}`;
}

export function PrayerTimesView({ children }: PrayerTimesViewProps) {
  const [open, setOpen] = useState(false);
  const [times, setTimes] = useState<PrayerTime[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadedDate, setLoadedDate] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<{ prayer: PrayerTime; minutesUntil: number } | null>(null);
  // Ticking "now" so isPassed stays accurate while the sheet is open
  const [nowMins, setNowMins] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const loadTimes = async () => {
    setLoading(true);
    try {
      const result = await getPrayerTimesForToday();
      setTimes(result);
      setLoaded(true);
      setLoadedDate(todayStr);
      if (result.length === 0) {
        toast.error('Could not get prayer times. Please allow location access.');
      }
    } catch {
      toast.error('Prayer times unavailable. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load if: not loaded yet, or the date has changed since last load
    if (open && (!loaded || loadedDate !== todayStr)) loadTimes();
  }, [open, loaded, loadedDate, todayStr]);

  // Update countdown and nowMins every minute
  useEffect(() => {
    if (!open || times.length === 0) return;
    const update = () => {
      setCountdown(getNextPrayer(times));
      const n = new Date();
      setNowMins(n.getHours() * 60 + n.getMinutes());
    };
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [open, times]);

  const isPassed = (time: string) => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m < nowMins;
  };

  const isNext = (p: PrayerTime) => countdown?.prayer.name === p.name;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[88vh] flex flex-col">
        <SheetDescription className="sr-only">Today's prayer times and next prayer countdown.</SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-medium flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Prayer Times
                </SheetTitle>
                <button
                  onClick={() => { setLoaded(false); loadTimes(); }}
                  disabled={loading}
                  className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground/60 hover:text-foreground cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-8">
              {/* Next prayer banner */}
              <AnimatePresence>
                {countdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border bg-primary/5 border-primary/20 flex items-center gap-3"
                  >
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      {PRAYER_ICONS[countdown.prayer.name] || <Star className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">Next Prayer</p>
                      <p className="text-base font-bold text-foreground">{countdown.prayer.label}</p>
                      <p className="text-xs text-primary font-semibold">
                        in {formatCountdown(countdown.minutesUntil)} · {formatTime(countdown.prayer.time)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-primary tabular-nums">{formatCountdown(countdown.minutesUntil)}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading state */}
              {loading && times.length === 0 && (
                <div className="flex flex-col items-center py-12 gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
                    style={{ borderTopColor: 'hsl(var(--primary))', borderRightColor: 'hsl(var(--primary)/0.3)' }}
                  />
                  <p className="text-xs text-muted-foreground">Fetching prayer times…</p>
                  <p className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
                    <MapPin size={10} /> Requires location access
                  </p>
                </div>
              )}

              {/* Prayer time cards */}
              {times.length > 0 && (
                <div className="space-y-2">
                  {times.map((p, i) => {
                    const passed = isPassed(p.time);
                    const next = isNext(p);
                    const colorClass = PRAYER_COLORS[p.name] || 'text-primary bg-primary/10 border-primary/20';
                    return (
                      <motion.div
                        key={p.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                          next
                            ? 'bg-primary/8 border-primary/30 shadow-sm'
                            : passed
                            ? 'bg-foreground/[0.02] border-foreground/5 opacity-50'
                            : 'bg-foreground/[0.02] border-foreground/8'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border ${colorClass} ${passed ? 'grayscale opacity-40' : ''}`}>
                          {PRAYER_ICONS[p.name] || <Star className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${passed ? 'text-muted-foreground' : 'text-foreground'}`}>
                            {p.label}
                          </p>
                          {next && (
                            <p className="text-[10px] text-primary font-semibold uppercase tracking-wider">Next prayer</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className={`text-base font-black tabular-nums ${passed ? 'text-muted-foreground/50' : 'text-foreground'}`}>
                            {formatTime(p.time)}
                          </p>
                          {passed && <p className="text-[9px] text-muted-foreground/40 font-bold uppercase">Passed</p>}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* No times / permission prompt */}
              {!loading && times.length === 0 && loaded && (
                <div className="flex flex-col items-center py-12 text-center gap-3">
                  <div className="p-4 rounded-2xl bg-foreground/[0.03] border border-foreground/5">
                    <MapPin className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <p className="text-sm font-bold text-foreground/60">Location Access Required</p>
                  <p className="text-xs text-muted-foreground max-w-[220px]">
                    Prayer times are calculated using your location. Please allow location access and tap refresh.
                  </p>
                  <button
                    onClick={() => { setLoaded(false); loadTimes(); }}
                    className="mt-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider hover:bg-primary/90 transition-all"
                  >
                    Allow & Load
                  </button>
                </div>
              )}

              {/* Footer note */}
              {times.length > 0 && (
                <p className="text-[9px] text-muted-foreground/40 text-center pb-2">
                  Times calculated via Aladhan API · Method: Muslim World League · Cached daily
                </p>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
