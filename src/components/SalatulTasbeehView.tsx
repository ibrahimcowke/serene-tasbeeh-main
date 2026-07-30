import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Play, Info, Volume2, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useShallow } from 'zustand/react/shallow';
import { speakArabic } from '@/lib/audioRecitations';
import { toast } from 'sonner';

interface SalatulTasbeehViewProps {
  children: React.ReactNode;
}

interface PhaseDetail {
  id: string;
  name: string;
  nameAr: string;
  count: number;
  desc: string;
  svgPath: string;
}

const PHASES_DETAILED: PhaseDetail[] = [
  {
    id: 'qiyam',
    name: 'Qiyam (Standing)',
    nameAr: 'القيام',
    count: 10,
    desc: 'Recite 10 times after Surah Al-Fatiha and another Surah',
    svgPath: 'M12 4a2 2 0 100-4 2 2 0 000 4zm-1 3.5h2v7.5h1.5a1 1 0 011 1v7a1 1 0 01-2 0v-6h-1v6a1 1 0 01-2 0v-7a1 1 0 011-1h.5V7.5z',
  },
  {
    id: 'ruku',
    name: "Ruku' (Bowing)",
    nameAr: 'الركوع',
    count: 10,
    desc: 'Recite 10 times while bowing in Ruku',
    svgPath: 'M12 4a2 2 0 100-4 2 2 0 000 4zm-4 4.5h6l4 5a1 1 0 11-1.6 1.2L13 10.5V17a1 1 0 01-2 0v-5h-1v10a1 1 0 01-2 0V11H7a1 1 0 01-1-1v-1.5z',
  },
  {
    id: 'itidal',
    name: "I'tidal (Rising)",
    nameAr: 'الاعتدال',
    count: 10,
    desc: 'Recite 10 times standing upright after Ruku',
    svgPath: 'M12 4a2 2 0 100-4 2 2 0 000 4zm-1 3.5h2v8h1.5a1 1 0 011 1v6a1 1 0 01-2 0v-5h-1v5a1 1 0 01-2 0v-6a1 1 0 011-1h.5V7.5z',
  },
  {
    id: 'sujud1',
    name: 'Sujud 1 (Prostration)',
    nameAr: 'السجود الأول',
    count: 10,
    desc: 'Recite 10 times during the first prostration',
    svgPath: 'M6 18a2 2 0 100-4 2 2 0 000 4zm2-3.5h5l4 2h4a1 1 0 010 2h-4.5l-3.5-1.8H9a1 1 0 01-1-1v-1.2z',
  },
  {
    id: 'jalsah',
    name: 'Jalsah (Sitting)',
    nameAr: 'الجلسة',
    count: 10,
    desc: 'Recite 10 times sitting between the two sujuds',
    svgPath: 'M12 5a2 2 0 100-4 2 2 0 000 4zm-3 4h4l3 4v6a1 1 0 01-2 0v-5l-2.5-3.5H9.5L7 19a1 1 0 01-1.8-1l2.8-9z',
  },
  {
    id: 'sujud2',
    name: 'Sujud 2 (Prostration)',
    nameAr: 'السجود الثاني',
    count: 10,
    desc: 'Recite 10 times during the second prostration',
    svgPath: 'M6 18a2 2 0 100-4 2 2 0 000 4zm2-3.5h5l4 2h4a1 1 0 010 2h-4.5l-3.5-1.8H9a1 1 0 01-1-1v-1.2z',
  },
];

const DHIKR_TEXT = 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ';
const DHIKR_TRANSLITERATION = 'SubhanAllah, Walhamdulillah, Wa la ilaha illallah, Wallahu Akbar';
const DHIKR_TRANSLATION = 'Glory be to Allah, Praise be to Allah, There is no god but Allah, Allah is the Greatest.';

export function SalatulTasbeehView({ children }: SalatulTasbeehViewProps) {
  const [open, setOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'format300' | 'format200'>('format300');

  const { startSalatulTasbeeh, sessionMode } = useTasbeehStore(useShallow(s => ({
    startSalatulTasbeeh: s.startSalatulTasbeeh,
    sessionMode: s.sessionMode,
  })));

  const isActive = sessionMode.type === 'salatul-tasbeeh' && !sessionMode.isComplete;
  const activeMode = sessionMode.type === 'salatul-tasbeeh' ? sessionMode : null;

  const handleBegin = () => {
    startSalatulTasbeeh();
    toast.success('🕌 Salatul Tasbeeh started! Counter set for guided prayer.');
    setOpen(false);
  };

  const handlePlayAudio = () => {
    setIsPlayingAudio(true);
    speakArabic(DHIKR_TEXT);
    setTimeout(() => setIsPlayingAudio(false), 4000);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[92vh] flex flex-col p-0 overflow-hidden">
        <SheetDescription className="sr-only">Guided Salatul Tasbeeh — 4 rak'ahs prayer guide and counter.</SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0 border-b border-border/20">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-bold flex items-center gap-2 text-foreground">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Salatul Tasbeeh
                </SheetTitle>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePlayAudio}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isPlayingAudio ? 'bg-primary/20 text-primary border-primary/40 animate-pulse' : 'bg-foreground/5 border-border/40 text-muted-foreground hover:text-foreground'
                    }`}
                    title="Listen to Tasbeeh Recitation"
                  >
                    <Volume2 size={16} />
                  </button>
                  <button
                    onClick={() => setShowInfo(p => !p)}
                    className="p-2 rounded-xl bg-foreground/5 border border-border/40 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    <Info size={16} />
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Guided 4-rak'ah prayer · 300 or 200 total Tasbeeh</p>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-8 pt-4 custom-scrollbar">

              {/* Dhikr card with audio button */}
              <div className="p-5 rounded-2xl border bg-primary/5 border-primary/20 text-center relative overflow-hidden shadow-sm">
                <div className="absolute top-2 right-2 text-[10px] text-primary/70 font-semibold px-2 py-0.5 rounded-full bg-primary/10">
                  Dhikr Formula
                </div>
                <p
                  className="text-2xl leading-loose text-primary font-bold mb-2 pt-2"
                  style={{ fontFamily: "'Amiri','Traditional Arabic',serif", direction: 'rtl' }}
                >
                  {DHIKR_TEXT}
                </p>
                <p className="text-xs text-foreground/90 font-medium italic mb-1">
                  {DHIKR_TRANSLITERATION}
                </p>
                <p className="text-[11px] text-muted-foreground italic">
                  "{DHIKR_TRANSLATION}"
                </p>
              </div>

              {/* Format Switcher */}
              <div className="flex items-center justify-center p-1 rounded-xl bg-muted/20 border border-border/30 gap-1">
                <button
                  onClick={() => setActiveFormat('format300')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeFormat === 'format300' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Traditional (300 Total)
                </button>
                <button
                  onClick={() => setActiveFormat('format200')}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeFormat === 'format200' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  5-Position (200 Total)
                </button>
              </div>

              {/* Info panel */}
              <AnimatePresence>
                {showInfo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-2 text-xs text-muted-foreground leading-relaxed">
                      <p className="font-bold text-foreground flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Virtues of Salatul Tasbeeh
                      </p>
                      <p>
                        The Prophet Muhammad (ﷺ) taught his uncle Abbas (RA) this prayer, stating that Allah forgives all sins—past and future, old and new, unintentional and intentional—for performing it.
                      </p>
                      <p className="font-semibold text-foreground/90">How it works per rak'ah ({activeFormat === 'format300' ? '75 times' : '50 times'}):</p>
                      <ul className="list-disc list-inside space-y-1 pl-1">
                        {activeFormat === 'format300' ? (
                          <>
                            <li>15 times after Sana before Fatiha (or after Surah)</li>
                            <li>10 times in Ruku'</li>
                            <li>10 times standing in I'tidal</li>
                            <li>10 times in 1st Sujud</li>
                            <li>10 times sitting in Jalsah</li>
                            <li>10 times in 2nd Sujud</li>
                            <li>10 times sitting brief rest before standing = 75 total × 4 = 300</li>
                          </>
                        ) : (
                          <>
                            <li>10 times in Qiyam (Standing)</li>
                            <li>10 times in Ruku' (Bowing)</li>
                            <li>10 times in I'tidal (Rising)</li>
                            <li>10 times in Sujud (Prostration)</li>
                            <li>10 times in Jalsah (Sitting) = 50 total × 4 = 200</li>
                          </>
                        )}
                      </ul>
                      <p className="italic opacity-70 border-t border-border/30 pt-2">Narrated in Sunan Abu Dawud (1297), Tirmidhi (481), and Ibn Majah.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Session Status Card */}
              {isActive && activeMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl border bg-emerald-500/10 border-emerald-500/30 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Active Prayer Session
                    </span>
                    <span className="text-xs text-emerald-400 font-bold">Rak'ah {activeMode.rakah} / 4</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-foreground">
                        {PHASES_DETAILED[activeMode.phase]?.name || 'Qiyam'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {PHASES_DETAILED[activeMode.phase]?.desc}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-emerald-400 tabular-nums">{activeMode.totalCompleted}</p>
                      <p className="text-[9px] text-muted-foreground uppercase">total dhikr</p>
                    </div>
                  </div>
                  {/* Rak'ah progress steps */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4].map(r => (
                        <div
                          key={r}
                          className={`flex-1 h-2 rounded-full transition-all ${
                            r < activeMode.rakah ? 'bg-emerald-400' : r === activeMode.rakah ? 'bg-emerald-400/50 animate-pulse' : 'bg-foreground/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Detailed Posture Graphics Grid */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                  Prayer Postures & Sequence
                </p>
                <div className="space-y-2">
                  {PHASES_DETAILED.map((phase, i) => (
                    <div
                      key={phase.id}
                      className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all ${
                        activeMode && activeMode.phase === i
                          ? 'bg-primary/10 border-primary shadow-sm'
                          : 'bg-card border-border/40'
                      }`}
                    >
                      {/* Posture SVG icon */}
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-primary">
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                          <path d={phase.svgPath} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-foreground truncate">{phase.name}</p>
                          <span className="text-xs font-arabic text-primary font-bold">{phase.nameAr}</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{phase.desc}</p>
                      </div>
                      <div className="shrink-0 px-2.5 py-1 rounded-full bg-primary/15 border border-primary/30 text-[10px] font-black text-primary">
                        × {phase.count}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Start / Continue Button */}
              <button
                onClick={handleBegin}
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg mt-4 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                {isActive ? 'Restart Guided Session' : 'Begin Salatul Tasbeeh'}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
