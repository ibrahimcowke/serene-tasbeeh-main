import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Copy, Check, Share2, Sparkles, X, ChevronRight } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { hadiths } from '@/data/hadiths';
import { quranVerses } from '@/data/quranVerses';
import { toast } from 'sonner';
import { useTasbeehStore } from '@/store/tasbeehStore';

interface WisdomModalProps {
  open: boolean;
  onClose: () => void;
}

export function WisdomModal({ open, onClose }: WisdomModalProps) {
  const { lang, t, isRTL } = useTranslation();
  const [activeTab, setActiveTab] = useState<'hadith' | 'quran'>('hadith');
  const [copied, setCopied] = useState(false);

  // Selected dhikr from store to get relevant Quran verses
  const currentDhikr = useTasbeehStore((s) => s.currentDhikr);

  // Select initial hadith and verse based on day of the year
  const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  };

  const [hadithIndex, setHadithIndex] = useState(getDayOfYear() % hadiths.length);
  const currentHadith = hadiths[hadithIndex];

  // Filter Quran verses matching the current dhikr tag
  const matchingVerses = quranVerses.filter(v => v.dhikrTag === currentDhikr.id);
  const versesPool = matchingVerses.length > 0 ? matchingVerses : quranVerses;
  const [verseIndex, setVerseIndex] = useState(getDayOfYear() % versesPool.length);
  
  // Re-adjust verse index if pool changes (due to currentDhikr change)
  useEffect(() => {
    setVerseIndex(getDayOfYear() % versesPool.length);
  }, [currentDhikr.id, versesPool.length]);

  const currentVerse = versesPool[verseIndex];

  const handleNextHadith = () => {
    setHadithIndex((prev) => (prev + 1) % hadiths.length);
    setCopied(false);
  };

  const handleNextVerse = () => {
    setVerseIndex((prev) => (prev + 1) % versesPool.length);
    setCopied(false);
  };

  const handleCopy = () => {
    let textToCopy = '';
    if (activeTab === 'hadith') {
      textToCopy = `"${currentHadith.text[lang]}" — ${currentHadith.source[lang]}\n\n(Shared via Tasbeehly)`;
    } else {
      textToCopy = `"${currentVerse.arabic}"\nTranslation: "${currentVerse.translation}"\nSurah ${currentVerse.surah} ${currentVerse.verse}\n\n(Shared via Tasbeehly)`;
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success(t('hadith.copied') || 'Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = activeTab === 'hadith' 
      ? `"${currentHadith.text[lang]}" — ${currentHadith.source[lang]}`
      : `"${currentVerse.arabic}" — Surah ${currentVerse.surah} ${currentVerse.verse}`;
      
    const shareData = {
      title: 'Tasbeehly Spiritual Wisdom',
      text: text,
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
            {/* Header with Tabs */}
            <div className="px-6 pt-5 pb-3 border-b border-border/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen className="w-5 h-5" />
                  <span className="text-sm font-bold uppercase tracking-wider">Spiritual Wisdom</span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 hover:bg-white/5 rounded-full transition-colors cursor-pointer text-muted-foreground/60 hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tab selectors */}
              <div className="flex bg-foreground/5 rounded-xl p-1 gap-1">
                <button
                  onClick={() => { setActiveTab('hadith'); setCopied(false); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'hadith' 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Hadith of the Day
                </button>
                <button
                  onClick={() => { setActiveTab('quran'); setCopied(false); }}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'quran' 
                      ? 'bg-primary text-primary-foreground shadow-lg' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Quran Verse
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col gap-5 min-h-[220px] justify-between">
              <AnimatePresence mode="wait">
                {activeTab === 'hadith' ? (
                  <motion.div
                    key="hadith"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3.5"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    {/* Arabic calligraphic-like text */}
                    <p className="font-arabic text-right text-[17px] sm:text-[19px] leading-loose text-foreground font-semibold">
                      {currentHadith.text.ar}
                    </p>
                    
                    {/* English translation */}
                    {lang !== 'ar' && (
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3">
                        "{currentHadith.text.en}"
                      </p>
                    )}

                    <span className="text-[10px] text-primary/75 font-semibold tracking-wide mt-1">
                      — {currentHadith.source[lang]}
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="quran"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3.5"
                    dir="ltr"
                  >
                    {/* Arabic calligraphic-like text */}
                    <p className="font-arabic text-right text-[17px] sm:text-[19px] leading-loose text-foreground font-semibold" dir="rtl">
                      {currentVerse.arabic}
                    </p>

                    {/* Transliteration */}
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic border-l-2 border-primary/20 pl-3">
                      {currentVerse.transliteration}
                    </p>
                    
                    {/* Translation */}
                    <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-light">
                      "{currentVerse.translation}"
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-primary/75 font-semibold tracking-wide">
                        Surah {currentVerse.surah} • {currentVerse.verse}
                      </span>
                      {matchingVerses.length > 0 && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
                          Matched to Dhikr
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions Row */}
              <div className="flex items-center justify-between border-t border-border/10 pt-4 mt-1">
                <button
                  onClick={activeTab === 'hadith' ? handleNextHadith : handleNextVerse}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-[10px] font-semibold uppercase tracking-wider bg-primary/10 border border-primary/20 hover:bg-primary/15 transition-all text-primary cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Next Wisdom</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={handleCopy}
                    className="p-2.5 rounded-2xl bg-white/5 border border-border/15 hover:bg-white/10 text-foreground/80 transition-all cursor-pointer"
                    title="Copy"
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
                    title="Share"
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
