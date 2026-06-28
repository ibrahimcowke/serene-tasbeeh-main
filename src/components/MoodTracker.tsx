import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, X, Star, Sparkles, BookOpen } from 'lucide-react';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { toast } from 'sonner';

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
  { key: 'repentant', emoji: '🥺', colorClass: 'bg-amber-500/15 border-amber-500/30 text-amber-400' },
];

interface Recommendation {
  title: { en: string; ar: string };
  arabic: string;
  transliteration: { en: string; ar: string };
  translation: { en: string; ar: string };
  dhikr: {
    arabic: string;
    translation: string;
    transliteration: string;
  };
}

const recommendations: Record<string, Recommendation> = {
  repentant: {
    title: { en: "Seek Forgiveness (Istighfar)", ar: "طلب المغفرة (الاستغفار)" },
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ",
    transliteration: {
      en: "Astaghfirullah al-Adheemal-ladhi la ilaha illa Huwal-Hayyul-Qayyumu wa atubu ilayh",
      ar: "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه"
    },
    translation: {
      en: "I seek the forgiveness of Allah the Mighty, whom there is no deity except Him, the Living, the Eternal, and I repent to Him.",
      ar: "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه"
    },
    dhikr: {
      arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ وَأَتُوبُ إِلَيْهِ",
      transliteration: "Astaghfirullah al-Adheem wa atubu ilayh",
      translation: "I seek the forgiveness of Allah the Mighty and I repent to Him."
    }
  },
  distracted: {
    title: { en: "Seek Refuge & Focus", ar: "الاستعاذة والتركيز" },
    arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
    transliteration: {
      en: "A'udhu billahi min ash-shaytan ir-rajim",
      ar: "أعوذ بالله من الشيطان الرجيم"
    },
    translation: {
      en: "I seek refuge in Allah from Satan the outcast.",
      ar: "أعوذ بالله من الشيطان الرجيم"
    },
    dhikr: {
      arabic: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
      transliteration: "A'udhu billahi min ash-shaytan ir-rajim",
      translation: "I seek refuge in Allah from Satan the outcast."
    }
  },
  grateful: {
    title: { en: "Show Gratitude (Shukr)", ar: "شكر النعمة" },
    arabic: "رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ",
    transliteration: {
      en: "Rabbi awzi'ni an ashkura ni'matakal-lati an'amta 'alayya",
      ar: "رب أوزعني أن أشكر نعمتك التي أنعمت علي"
    },
    translation: {
      en: "My Lord, enable me to be grateful for Your favor which You have bestowed upon me.",
      ar: "رب أوزعني أن أشكر نعمتك التي أنعمت علي"
    },
    dhikr: {
      arabic: "الْحَمْدُ لِلَّهِ حَمْدًا كَثِيرًا طَيِّبًا مُبَارَكًا فِيهِ",
      transliteration: "Alhamdulillah hamdan kathiran tayyiban mubarakan fih",
      translation: "Praise be to Allah, much good and blessed praise."
    }
  },
  peaceful: {
    title: { en: "Praise of Serenity", ar: "طمأنينة القلب" },
    arabic: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ",
    transliteration: {
      en: "Ala bi-dhikrillahi tatma'innul-qulub",
      ar: "ألا بذكر الله تطمئن القلوب"
    },
    translation: {
      en: "Verily, in the remembrance of Allah do hearts find rest.",
      ar: "ألا بذكر الله تطمئن القلوب"
    },
    dhikr: {
      arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ",
      transliteration: "Subhanallahi wa bihamdihi, Subhanallahil-Adheem",
      translation: "Glory be to Allah and His praise, Glory be to Allah the Supreme."
    }
  },
  connected: {
    title: { en: "Send Blessings upon the Prophet", ar: "الصلاة على النبي" },
    arabic: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    transliteration: {
      en: "Allahumma salli wa sallim 'ala Nabiyyina Muhammad",
      ar: "اللهم صل وسلم على نبينا محمد"
    },
    translation: {
      en: "O Allah, send blessings and peace upon our Prophet Muhammad.",
      ar: "اللهم صل وسلم على نبينا محمد"
    },
    dhikr: {
      arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
      transliteration: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammad",
      translation: "O Allah, send blessings upon Muhammad and the family of Muhammad."
    }
  },
  spiritual: {
    title: { en: "Affirmation of Tawheed", ar: "توحيد الله" },
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: {
      en: "La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu, wa Huwa 'ala kulli shay'in Qadir",
      ar: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير"
    },
    translation: {
      en: "There is no deity except Allah alone, without partner. To Him belongs sovereignty and to Him belongs praise, and He is over all things Omnipotent.",
      ar: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد، وهو على كل شيء قدير"
    },
    dhikr: {
      arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
      transliteration: "La ilaha illallahu wahdahu la sharika lahu",
      translation: "There is no deity except Allah alone, without partner."
    }
  }
};

export function MoodTracker({ open, onClose, sessionId, countCompleted }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [focus, setFocus] = useState(4);
  const addMoodRating = useTasbeehStore((s) => s.addMoodRating);
  const setDhikr = useTasbeehStore((s) => s.setDhikr);
  const { t, isRTL } = useTranslation();

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  const handleSave = () => {
    if (selectedMood && sessionId) {
      addMoodRating({ sessionId, mood: selectedMood, focus });
    }
    onClose();
  };

  const handleSetDhikr = (rec: Recommendation) => {
    setDhikr({
      id: `rec_${Date.now()}`,
      arabic: rec.dhikr.arabic,
      transliteration: rec.dhikr.transliteration,
      translation: rec.dhikr.translation,
      isCustom: true
    });
    toast.success(isRTL ? "تم تحديث الذكر النشط!" : "Dhikr updated. Start reciting!");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md overflow-y-auto max-h-[90vh] rounded-[2rem] border border-border/40 p-6 shadow-2xl z-10 custom-overlay-open custom-scrollbar"
            dir={isRTL ? 'rtl' : 'ltr'}
            style={{
              background: 'hsl(var(--card))',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          >
            {/* Absolute close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 rtl:right-auto rtl:left-5 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer text-muted-foreground/60 hover:text-foreground z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-between mb-5 pr-8 rtl:pr-0 rtl:pl-8">
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'hsl(var(--primary) / 0.12)', border: '1px solid hsl(var(--primary) / 0.25)' }}
                >
                  <Smile className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{t('mood.title')}</h3>
                  {countCompleted && countCompleted > 0 ? (
                    <p className="text-xs font-medium text-primary">
                      {countCompleted} {t('timer.times')} — MashaAllah! 🤲
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-muted-foreground">
                      {isRTL ? "اختر مزاجك لبدء جلسة ذكر مخصصة" : "Select your mood to begin a custom session"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Mood picker */}
            <p className="text-xs font-semibold mb-3 text-muted-foreground">
              {isRTL ? "كيف تشعر الآن؟" : "How are you feeling right now?"}
            </p>
            <div className="flex gap-2 mb-5 flex-wrap">
              {moods.map(({ key, emoji, colorClass }) => (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setSelectedMood(key);
                    if (recommendations[key]) {
                      setDhikr({
                        id: `rec_${Date.now()}`,
                        arabic: recommendations[key].dhikr.arabic,
                        transliteration: recommendations[key].dhikr.transliteration,
                        translation: recommendations[key].dhikr.translation,
                        isCustom: true
                      });
                      toast.success(isRTL ? "تم تحديث الذكر النشط!" : "Dhikr updated. Start reciting!");
                    }
                  }}
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

            {/* Dynamic Recommendation Card (Hardware accelerated, no janky height animation) */}
            <AnimatePresence mode="wait">
              {selectedMood && recommendations[selectedMood] && (
                <motion.div
                  key={selectedMood}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="mb-6 p-4 rounded-2xl border bg-primary/5 border-primary/20 backdrop-blur-md relative overflow-hidden shadow-lg shadow-primary/5 flex flex-col gap-3"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-primary text-xs font-semibold uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isRTL ? "توصية ذكر" : "Dhikr Recommendation"}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-semibold px-2 py-0.5 rounded-full bg-foreground/5">
                      {recommendations[selectedMood].title[isRTL ? 'ar' : 'en']}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 text-center" dir={isRTL ? 'rtl' : 'ltr'}>
                    <p className="font-arabic text-[18px] sm:text-[20px] leading-loose text-foreground font-bold mt-1">
                      {recommendations[selectedMood].arabic}
                    </p>
                    <p className={`text-[11px] text-primary/80 italic font-medium leading-normal pl-2 border-l-2 border-primary/30 ${isRTL ? 'text-right pr-2 pl-0 border-l-0 border-r-2' : 'text-left'}`}>
                      {recommendations[selectedMood].transliteration[isRTL ? 'ar' : 'en']}
                    </p>
                    <p className={`text-[11px] text-muted-foreground leading-normal italic ${isRTL ? 'text-right' : 'text-left'}`}>
                      "{recommendations[selectedMood].translation[isRTL ? 'ar' : 'en']}"
                    </p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSetDhikr(recommendations[selectedMood])}
                    className="mt-1 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>{isRTL ? "تلاوة هذا الذكر الآن ⚡" : "⚡ Set as Active Dhikr"}</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Focus rating (stars) */}
            <p className="text-xs font-medium mb-2 text-muted-foreground">
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
        </div>
      )}
    </AnimatePresence>
  );
}
