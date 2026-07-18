import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Trophy, Star, CheckCircle2, XCircle, RotateCcw, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet';
import { asmaulHusna } from '@/data/asmaulHusna';

interface AsmaulHusnaQuizProps {
  children: React.ReactNode;
}

interface Question {
  name: typeof asmaulHusna[0];
  options: string[];
  correctIndex: number;
}

function buildQuestion(pool: typeof asmaulHusna, idx: number): Question {
  const name = pool[idx];
  const wrongPool = pool.filter(n => n.number !== name.number);
  const shuffled = [...wrongPool].sort(() => Math.random() - 0.5).slice(0, 3);
  const options = [...shuffled.map(n => n.meaning), name.meaning].sort(() => Math.random() - 0.5);
  return { name, options, correctIndex: options.indexOf(name.meaning) };
}

export function AsmaulHusnaQuiz({ children }: AsmaulHusnaQuizProps) {
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const shuffledPool = useMemo(() => [...asmaulHusna].sort(() => Math.random() - 0.5), [open]);
  const totalQ = Math.min(asmaulHusna.length, 20);

  const question = useMemo<Question | null>(() => {
    if (!started || qIndex >= totalQ) return null;
    return buildQuestion(shuffledPool, qIndex);
  }, [started, qIndex, shuffledPool]);

  const handleSelect = useCallback((optIdx: number) => {
    if (selected !== null || !question) return;
    setSelected(optIdx);
    const correct = optIdx === question.correctIndex;
    if (correct) {
      setScore(s => s + 1);
      setStreak(s => {
        const next = s + 1;
        setBestStreak(b => Math.max(b, next));
        return next;
      });
    } else {
      setStreak(0);
    }
    setTimeout(() => {
      if (qIndex + 1 >= totalQ) {
        setFinished(true);
      } else {
        setQIndex(i => i + 1);
        setSelected(null);
      }
    }, 900);
  }, [selected, question, qIndex, totalQ]);

  const restart = () => {
    setStarted(false);
    setQIndex(0);
    setScore(0);
    setStreak(0);
    setSelected(null);
    setFinished(false);
  };

  const accuracy = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;

  const getGrade = () => {
    if (accuracy >= 90) return { label: 'Excellent!', color: 'text-yellow-400', emoji: '🏆' };
    if (accuracy >= 70) return { label: 'Great!', color: 'text-green-400', emoji: '⭐' };
    if (accuracy >= 50) return { label: 'Good', color: 'text-blue-400', emoji: '📿' };
    return { label: 'Keep Learning', color: 'text-orange-400', emoji: '📖' };
  };

  return (
    <Sheet open={open} onOpenChange={o => { setOpen(o); if (!o) restart(); }}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="bg-sheet-bg rounded-t-3xl h-[92vh] flex flex-col">
        <SheetDescription className="sr-only">Test your knowledge of the 99 Names of Allah.</SheetDescription>
        {open && (
          <>
            <div className="sheet-handle mx-auto mt-3 mb-1 bg-muted shrink-0 w-10 h-1 rounded-full" />
            <SheetHeader className="text-left px-6 pt-2 pb-3 shrink-0 border-b border-border/20">
              <div className="flex items-center justify-between">
                <SheetTitle className="text-lg font-medium flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" />
                  Asmaul Husna Quiz
                </SheetTitle>
                {started && !finished && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-wider">
                      {qIndex + 1} / {totalQ}
                    </span>
                    {streak >= 3 && (
                      <span className="text-[10px] font-black text-orange-400 flex items-center gap-0.5">
                        🔥 {streak}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">

              {/* Start screen */}
              {!started && !finished && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="flex flex-col items-center py-8 text-center gap-4">
                    <div className="p-5 rounded-3xl bg-primary/10 border border-primary/20">
                      <Brain className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-foreground mb-1">Test Your Knowledge</h2>
                      <p className="text-sm text-muted-foreground max-w-[240px] mx-auto">
                        {totalQ} questions · Arabic name shown · Pick the correct meaning
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    {[['📿', '99 Names', 'in the pool'], ['🎯', '4 choices', 'per question'], ['⚡', 'Instant', 'feedback']].map(([icon, label, sub]) => (
                      <div key={label} className="p-3 rounded-2xl bg-foreground/[0.02] border border-foreground/5">
                        <div className="text-xl mb-1">{icon}</div>
                        <p className="text-[10px] font-black text-foreground">{label}</p>
                        <p className="text-[9px] text-muted-foreground">{sub}</p>
                      </div>
                    ))}
                  </div>
                  {bestStreak > 0 && (
                    <div className="p-3 rounded-xl bg-orange-500/5 border border-orange-500/15 text-center">
                      <p className="text-xs text-orange-400 font-bold">Best streak: 🔥 {bestStreak}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setStarted(true)}
                    className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:bg-primary/95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    <ChevronRight className="w-4 h-4" />
                    Start Quiz
                  </button>
                </motion.div>
              )}

              {/* Question */}
              {started && !finished && question && (
                <motion.div
                  key={qIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-5"
                >
                  {/* Progress bar */}
                  <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${((qIndex) / totalQ) * 100}%` }}
                    />
                  </div>

                  {/* Score display */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Score: <strong className="text-foreground">{score}</strong></span>
                    <span className="text-muted-foreground">Accuracy: <strong className="text-primary">{qIndex > 0 ? Math.round((score / qIndex) * 100) : 0}%</strong></span>
                  </div>

                  {/* Name card */}
                  <div className="p-6 rounded-3xl border bg-foreground/[0.02] border-foreground/8 text-center">
                    <p className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mb-3">Name #{question.name.number}</p>
                    <p
                      className="text-4xl text-primary leading-loose"
                      style={{ fontFamily: "'Amiri','Traditional Arabic',serif", direction: 'rtl' }}
                    >
                      {question.name.arabic}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2 font-medium">{question.name.transliteration}</p>
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {question.options.map((opt, idx) => {
                      const isSelected = selected === idx;
                      const isCorrect = idx === question.correctIndex;
                      let bg = 'bg-foreground/[0.02] border-foreground/8 text-foreground';
                      if (selected !== null) {
                        if (isCorrect) bg = 'bg-green-500/10 border-green-500/30 text-green-400';
                        else if (isSelected) bg = 'bg-red-500/10 border-red-500/30 text-red-400';
                        else bg = 'bg-foreground/[0.02] border-foreground/5 text-muted-foreground/50';
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelect(idx)}
                          disabled={selected !== null}
                          className={`w-full p-4 rounded-2xl border text-left text-sm font-semibold transition-all flex items-center justify-between gap-3 ${bg} ${selected === null ? 'hover:bg-foreground/5 cursor-pointer active:scale-[0.98]' : 'cursor-default'}`}
                        >
                          <span>{opt}</span>
                          {selected !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />}
                          {selected !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Brief */}
                  <AnimatePresence>
                    {selected !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 rounded-xl bg-primary/5 border border-primary/15 text-xs text-muted-foreground leading-relaxed overflow-hidden"
                      >
                        <strong className="text-foreground/80">{question.name.transliteration}: </strong>
                        {question.name.brief}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Results screen */}
              {finished && (
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                  {(() => { const g = getGrade(); return (
                    <div className="flex flex-col items-center py-6 text-center gap-3">
                      <span className="text-5xl">{g.emoji}</span>
                      <h2 className={`text-2xl font-black ${g.color}`}>{g.label}</h2>
                    </div>
                  );})()}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Score', value: `${score}/${totalQ}`, icon: '🎯' },
                      { label: 'Accuracy', value: `${accuracy}%`, icon: '📊' },
                      { label: 'Best Streak', value: `🔥${bestStreak}`, icon: '' },
                    ].map(stat => (
                      <div key={stat.label} className="p-3 rounded-2xl bg-foreground/[0.02] border border-foreground/5 text-center">
                        <p className="text-lg font-black text-foreground">{stat.value}</p>
                        <p className="text-[9px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={restart}
                    className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-widest hover:bg-primary/95 transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                </motion.div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
