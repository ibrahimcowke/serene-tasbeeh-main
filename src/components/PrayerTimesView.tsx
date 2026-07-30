import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, RefreshCw, Sunrise, Sunset, Moon, Sun, Star, Compass, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { getPrayerTimesForToday, getNextPrayer, type PrayerTime } from '@/lib/prayerTimes';
import { getHijriDate } from '@/lib/hijri';
import { QiblaCompass } from '@/components/QiblaCompass';
import { toast } from 'sonner';

interface PrayerTimesViewProps {
  children: React.ReactNode;
}

const PRAYER_ICONS: Record<string, React.ReactNode> = {
  fajr:    <Sunrise className="w-5 h-5 text-blue-400" />,
  dhuhr:   <Sun className="w-5 h-5 text-yellow-400" />,
  asr:     <Sun className="w-5 h-5 text-orange-400" />,
  maghrib: <Sunset className="w-5 h-5 text-rose-400" />,
  isha:    <Moon className="w-5 h-5 text-purple-400" />,
};

const PRAYER_COLORS: Record<string, string> = {
  fajr:    'border-blue-500/30 bg-blue-500/10 text-blue-400',
  dhuhr:   'border-yellow-500/30 bg-yellow-500/10 text-yellow-400',
  asr:     'border-orange-500/30 bg-orange-500/10 text-orange-400',
  maghrib: 'border-rose-500/30 bg-rose-500/10 text-rose-400',
  isha:    'border-purple-500/30 bg-purple-500/10 text-purple-400',
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
  const [nowMins, setNowMins] = useState(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  });

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const hijri = getHijriDate(now);

  const loadTimes = async () => {
    setLoading(true);
    try {
      const result = await getPrayerTimesForToday();
      setTimes(result);
      setLoaded(true);
      setLoadedDate(todayStr);
      if (result.length === 0) {
        toast.error('Could not fetch prayer times. Please grant location access.');
      }
    } catch {
      toast.error('Prayer times service unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && (!loaded || loadedDate !== todayStr)) loadTimes();
  }, [open, loaded, loadedDate, todayStr]);

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
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[90vh] flex flex-col p-0 overflow-hidden">
        <SheetDescription className="sr-only">Today's prayer times and countdown.</SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0 border-b border-border/20">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  Prayer Times & Schedule
                </SheetTitle>
                <div className="flex items-center gap-1.5">
                  <QiblaCompass>
                    <button className="p-2 hover:bg-white/10 rounded-xl border border-border/30 text-xs font-semibold text-primary flex items-center gap-1 cursor-pointer">
                      <Compass size={14} /> Qibla
                    </button>
                  </QiblaCompass>
                  <button
                    onClick={() => { setLoaded(false); loadTimes(); }}
                    disabled={loading}
                    className="p-2 hover:bg-white/5 rounded-xl border border-border/30 text-muted-foreground hover:text-foreground cursor-pointer transition-all"
                    title="Refresh Prayer Times"
                  >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                <p>{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <p className="text-primary font-semibold">{hijri.day} {hijri.monthName} {hijri.year} AH</p>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-8 pt-4 custom-scrollbar">
              {/* Next prayer highlight banner */}
              <AnimatePresence>
                {countdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border bg-primary/10 border-primary/30 flex items-center gap-4 relative overflow-hidden shadow-sm"
                  >
                    <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/30 shrink-0">
                      {PRAYER_ICONS[countdown.prayer.name] || <Star className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1">
                        <Sparkles size={11} /> Next Prayer
                      </p>
                      <p className="text-lg font-bold text-foreground truncate">{countdown.prayer.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTime(countdown.prayer.time)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black text-primary tabular-nums">
                        {formatCountdown(countdown.minutesUntil)}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase font-bold">Remaining</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading state */}
              {loading && times.length === 0 && (
                <div className="flex flex-col items-center py-16 gap-3 text-center">
                  <div className="w-8 h-8 rounded-full border-2 border-transparent animate-spin"
                    style={{ borderTopColor: 'hsl(var(--primary))', borderRightColor: 'hsl(var(--primary)/0.3)' }}
                  />
                  <p className="text-xs text-muted-foreground">Calculating prayer times for your location…</p>
                </div>
              )}

              {/* Prayer time cards */}
              {times.length > 0 && (
                <div className="space-y-2.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                    Today's Prayer Schedule
                  </p>
                  {times.map((p, i) => {
                    const passed = isPassed(p.time);
                    const next = isNext(p);
                    const colorClass = PRAYER_COLORS[p.name] || 'border-primary/20 bg-primary/10 text-primary';
                    return (
                      <motion.div
                        key={p.name}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center gap-3.5 p-4 rounded-2xl border transition-all ${
                          next
                            ? 'bg-primary/10 border-primary shadow-md ring-1 ring-primary/30'
                            : passed
                            ? 'bg-card/40 border-border/30 opacity-50'
                            : 'bg-card border-border/40 hover:bg-card/80'
                        }`}
                      >
                        <div className={`p-2.5 rounded-xl border ${colorClass} ${passed ? 'grayscale opacity-50' : ''}`}>
                          {PRAYER_ICONS[p.name] || <Star className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className={`text-sm font-bold ${passed ? 'text-muted-foreground' : 'text-foreground'}`}>
                              {p.label}
                            </p>
                            {next && (
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary text-primary-foreground font-black uppercase tracking-wider">
                                Next
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {passed ? 'Completed' : next ? `In ${formatCountdown(countdown?.minutesUntil || 0)}` : 'Upcoming'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-base font-black tabular-nums ${passed ? 'text-muted-foreground/60' : 'text-foreground'}`}>
                            {formatTime(p.time)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}

              {/* No times / location retry card */}
              {!loading && times.length === 0 && loaded && (
                <div className="flex flex-col items-center py-12 text-center gap-3 bg-card border border-border/40 p-6 rounded-2xl">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-foreground">Location Access Needed</p>
                  <p className="text-xs text-muted-foreground max-w-xs">
                    We need your location permission to calculate local prayer times.
                  </p>
                  <button
                    onClick={() => { setLoaded(false); loadTimes(); }}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all cursor-pointer shadow-sm"
                  >
                    Enable & Fetch Times
                  </button>
                </div>
              )}

              <p className="text-[10px] text-muted-foreground/50 text-center pt-2">
                Times calculated based on local geolocation · Muslim World League Method
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
