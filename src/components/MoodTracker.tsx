import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, X, Star } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';

interface MoodTrackerProps {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  countCompleted: number;
}

const moods = [
  { key: 'peaceful', emoji: '🤲', colorClass: 'bg-blue-500/15 border-blue-500/30 text-blue-400' },
  { key: 'connected', emoji: '✨', colorClass: 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400' },
  { key: 'spiritual', emoji: '🌙', colorClass: 'bg-purple-500/15 border-purple-500/30 text-purple-400' },
  { key: 'grateful', emoji: '❤️', colorClass: 'bg-rose-500/15 border-rose-500/30 text-rose-400' },
  { key: 'distracted', emoji: '😔', colorClass: 'bg-slate-500/15 border-slate-500/30 text-slate-400' },
];

export function MoodTracker({ open, onClose, sessionId, countCompleted }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [focus, setFocus] = useState(4);
  const addMoodRating = useTasbeehStore((s) => s.addMoodRating);
  const { t, isRTL } = useTranslation();

  const handleSave = () => {
    if (selectedMood) {
      addMoodRating({ sessionId, mood: selectedMood, focus });
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl px-6 pt-4 pb-10"
            dir={isRTL ? 'rtl' : 'ltr'}
            style={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border) / 0.3)',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.4)',
            }}
          >
            <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsl(var(--primary) / 0.12)', border: '1px solid hsl(var(--primary) / 0.25)' }}
                >
                  <Smile className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{t('mood.title')}</h3>
                  <p className="text-xs" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {countCompleted} {t('timer.times')} — MashaAllah! 🤲
                  </p>
                </div>
              </div>
              <button onClick={onClose} style={{ color: 'hsl(var(--muted-foreground))' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mood picker */}
            <p className="text-xs font-medium mb-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {t('mood.focus')} — How were you feeling?
            </p>
            <div className="flex gap-2 mb-5 flex-wrap">
              {moods.map(({ key, emoji, colorClass }) => (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setSelectedMood(key)}
                  className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${colorClass}`}
                  style={{
                    opacity: selectedMood && selectedMood !== key ? 0.4 : 1,
                    transform: selectedMood === key ? 'scale(1.06)' : 'scale(1)',
                    boxShadow: selectedMood === key ? '0 0 16px rgba(251,191,36,0.2)' : 'none',
                  }}
                >
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-xs">{t(`mood.${key}`)}</span>
                </motion.button>
              ))}
            </div>

            {/* Focus rating (stars) */}
            <p className="text-xs font-medium mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
              {t('mood.focus')}
            </p>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((n) => (
                <motion.button
                  key={n}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setFocus(n)}
                  className="p-1"
                >
                  <Star
                    className="w-7 h-7 transition-colors"
                    style={{
                      color: n <= focus ? '#fbbf24' : 'hsl(var(--muted-foreground) / 0.3)',
                      fill: n <= focus ? '#fbbf24' : 'none',
                    }}
                  />
                </motion.button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: 'hsl(var(--card) / 0.5)',
                  border: '1px solid hsl(var(--border) / 0.4)',
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                {t('mood.skip')}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleSave}
                className="flex-[2] py-3 rounded-xl text-sm font-semibold"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--primary) / 0.7))',
                  color: 'hsl(var(--primary-foreground))',
                  boxShadow: '0 4px 20px hsl(var(--primary) / 0.3)',
                }}
              >
                {t('mood.save')}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
