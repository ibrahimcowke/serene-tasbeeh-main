import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Copy, Check, Share2, Sparkles, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { hadiths } from '@/data/hadiths';
import { toast } from 'sonner';

interface HadithOfTheDayModalProps {
  open: boolean;
  onClose: () => void;
}

export function HadithOfTheDayModal({ open, onClose }: HadithOfTheDayModalProps) {
  const { lang, t, isRTL } = useTranslation();
  const [copied, setCopied] = useState(false);

  // Select initial hadith based on day of the year
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const [currentIndex, setCurrentIndex] = useState(getDayOfYear() % hadiths.length);
  const current = hadiths[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % hadiths.length);
    setCopied(false);
  };

  const handleCopy = () => {
    const textToCopy = `"${current.text[lang]}" — ${current.source[lang]}\n\n(Shared via Tasbeehly)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success(t('hadith.copied'));
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Tasbeehly Spiritual Wisdom',
      text: `"${current.text[lang]}" — ${current.source[lang]}`,
      url: window.location.origin
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopy();
      }
    } catch (e) {
      // Ignore abort
    }
  };

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] border border-border/40 shadow-2xl z-10"
            style={{
              background: 'linear-gradient(135deg, hsl(var(--card) / 0.9) 0%, hsl(var(--card) / 0.75) 100%)',
              backdropFilter: 'blur(30px)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/10">
              <div className="flex items-center gap-2 text-primary">
                <BookOpen className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">{t('hadith.title')}</span>
              </div>
              <button 
                onClick={onClose}
                className="p-1.5 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-muted-foreground/60 hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5">
              <div className="flex flex-col gap-3.5" dir={isRTL ? 'rtl' : 'ltr'}>
                {/* Arabic Calligraphy Style */}
                <p 
                  className="font-arabic text-right text-[17px] sm:text-[19px] leading-loose text-foreground font-semibold"
                  style={{ textShadow: '0 2px 10px rgba(0,0,0,0.15)' }}
                >
                  {current.text.ar}
                </p>
                
                {/* English Translation */}
                {lang !== 'ar' && (
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3">
                    "{current.text.en}"
                  </p>
                )}

                <span className="text-[10px] text-primary/75 font-semibold tracking-wide mt-1">
                  — {current.source[lang]}
                </span>
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between border-t border-border/10 pt-4 mt-1">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-semibold uppercase tracking-wider bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all text-primary cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('hadith.next')}</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCopy}
                    className="p-2.5 rounded-2xl bg-white/5 border border-border/15 hover:bg-white/10 text-foreground/80 transition-all cursor-pointer"
                    title={t('hadith.copy')}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2.5 rounded-2xl bg-white/5 border border-border/15 hover:bg-white/10 text-foreground/80 transition-all cursor-pointer"
                    title={t('hadith.share')}
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
