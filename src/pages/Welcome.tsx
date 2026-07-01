import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTasbeehStore } from '@/store/tasbeehStore';
import { useTranslation } from '@/lib/i18n';
import { ChevronRight, Globe } from 'lucide-react';

const slides = [
  {
    titleKey: 'welcome.slide1_title',
    bodyKey: 'welcome.slide1_body',
    image: '/onboarding_beads.png',
    gradient: 'from-indigo-900/60 via-purple-900/40 to-transparent',
  },
  {
    titleKey: 'welcome.slide2_title',
    bodyKey: 'welcome.slide2_body',
    image: '/onboarding_qibla.png',
    gradient: 'from-amber-900/60 via-indigo-900/40 to-transparent',
  },
  {
    titleKey: 'welcome.slide3_title',
    bodyKey: 'welcome.slide3_body',
    image: null,
    gradient: 'from-emerald-900/60 via-indigo-900/40 to-transparent',
  },
];

export default function Welcome() {
  const [step, setStep] = useState<'lang' | 'slides'>('lang');
  const [slideIndex, setSlideIndex] = useState(0);
  const navigate = useNavigate();
  const setHasSeenWelcome = useTasbeehStore((s) => s.setHasSeenWelcome);
  const setLanguage = useTasbeehStore((s) => s.setLanguage);
  const language = useTasbeehStore((s) => s.language);
  const { t, isRTL } = useTranslation();

  const handleGetStarted = () => {
    setHasSeenWelcome(true);
    navigate('/');
  };

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex((i) => i + 1);
    } else {
      handleGetStarted();
    }
  };

  const isLast = slideIndex === slides.length - 1;

  return (
    <div
      className="h-dvh w-full overflow-hidden relative flex flex-col"
      dir={isRTL ? 'rtl' : 'ltr'}
      style={{
        background: 'radial-gradient(ellipse at top, #1a0a2e 0%, #0d0621 40%, #050210 100%)',
      }}
    >
      {/* Hero background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/welcome_hero.png"
          alt="Welcome"
          className="w-full h-full object-cover opacity-70"
          style={{ objectPosition: 'center top' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,4,30,0.2) 0%, rgba(10,4,30,0.5) 40%, rgba(10,4,30,0.97) 75%, rgba(10,4,30,1) 100%)',
          }}
        />
      </div>

      {/* Stars overlay */}
      <div className="absolute inset-0 z-0 opacity-40">
        {useMemo(() => [...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 0.5 + 'px',
              height: Math.random() * 2 + 0.5 + 'px',
              top: Math.random() * 55 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 2 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 3 }}
          />
        )), [])}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* App brand at top */}
        <div className="flex flex-col items-center pt-16 pb-4">
          {/* Animated tasbih bead icon */}
          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(251,191,36,0.18) 0%, rgba(167,139,250,0.1) 100%)',
              border: '1px solid rgba(251,191,36,0.35)',
              boxShadow: '0 0 40px rgba(251,191,36,0.25), 0 0 80px rgba(139,92,246,0.15)',
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="8" stroke="rgba(251,191,36,0.5)" strokeWidth="0.6" strokeDasharray="2 2.2" fill="none" />
              {[0,1,2,3,4,5,6,7,8,9,10].map((i) => {
                const angle = (i / 11) * 2 * Math.PI - Math.PI / 2;
                const x = 12 + 8 * Math.cos(angle);
                const y = 12 + 8 * Math.sin(angle);
                return <circle key={i} cx={x} cy={y} r="1.8" fill={i < 7 ? 'rgb(251,191,36)' : 'rgba(251,191,36,0.25)'} />;
              })}
              <circle cx="12" cy="12" r="1.5" fill="rgb(251,191,36)" opacity="0.7" />
              <line x1="12" y1="1" x2="12" y2="4" stroke="rgba(251,191,36,0.7)" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="12" cy="1.5" r="1.2" fill="rgba(251,191,36,0.8)" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold tracking-tight mb-1"
            style={{
              background: 'linear-gradient(135deg, #fbbf24, #f472b6, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Tasbeehly
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm tracking-widest"
            style={{ color: 'rgba(251,191,36,0.6)' }}
          >
            {t('welcome.tagline')}
          </motion.p>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col justify-end pb-10 px-6">
          <AnimatePresence mode="wait">
            {step === 'lang' ? (
              <motion.div
                key="lang"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <Globe className="w-8 h-8 mx-auto mb-3" style={{ color: 'rgba(251,191,36,0.7)' }} />
                  <h2 className="text-xl font-semibold text-white mb-1">{t('welcome.choose_language')}</h2>
                  <p className="text-sm text-white/40">اختر لغتك / Choose your language</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
                    { code: 'ar', label: 'Arabic', native: 'العربية', flag: '🇸🇦' },
                  ].map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setLanguage(lang.code)}
                      className="flex flex-col items-center gap-2 p-5 rounded-2xl transition-all"
                      style={{
                        background: language === lang.code
                          ? 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(167,139,250,0.2))'
                          : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${language === lang.code ? 'rgba(251,191,36,0.6)' : 'rgba(255,255,255,0.1)'}`,
                        boxShadow: language === lang.code ? '0 0 20px rgba(251,191,36,0.15)' : 'none',
                      }}
                    >
                      <span className="text-3xl">{lang.flag}</span>
                      <span className="text-white font-medium text-sm">{lang.native}</span>
                      {language === lang.code && (
                        <motion.div
                          layoutId="lang-check"
                          className="w-2 h-2 rounded-full"
                          style={{ background: 'rgb(251,191,36)' }}
                        />
                      )}
                    </motion.button>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setStep('slides')}
                  className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#1a0a2e',
                    boxShadow: '0 8px 32px rgba(251,191,36,0.35)',
                  }}
                >
                  {t('welcome.next')}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="slides"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* Slide image */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={slideIndex}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="text-center space-y-4"
                  >
                    {slides[slideIndex].image && (
                      <div className="mx-auto w-40 h-40 rounded-3xl overflow-hidden mb-4"
                        style={{
                          boxShadow: '0 0 40px rgba(251,191,36,0.2)',
                          border: '1px solid rgba(251,191,36,0.2)',
                        }}
                      >
                        <img
                          src={slides[slideIndex].image!}
                          alt="slide"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {!slides[slideIndex].image && (
                      <div className="mx-auto w-40 h-40 rounded-3xl flex items-center justify-center mb-4"
                        style={{
                          background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(167,139,250,0.2))',
                          border: '1px solid rgba(16,185,129,0.3)',
                          boxShadow: '0 0 40px rgba(16,185,129,0.15)',
                        }}
                      >
                        <span className="text-6xl">🕌</span>
                      </div>
                    )}
                    <h2
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      {t(slides[slideIndex].titleKey)}
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">
                      {t(slides[slideIndex].bodyKey)}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Progress dots */}
                <div className="flex justify-center gap-2">
                  {slides.map((_, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setSlideIndex(i)}
                      animate={{ width: i === slideIndex ? 24 : 8 }}
                      className="h-2 rounded-full transition-colors"
                      style={{
                        background: i === slideIndex ? 'rgb(251,191,36)' : 'rgba(255,255,255,0.2)',
                      }}
                    />
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleNext}
                  className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2"
                  style={{
                    background: isLast
                      ? 'linear-gradient(135deg, #10b981, #059669)'
                      : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#fff',
                    boxShadow: isLast
                      ? '0 8px 32px rgba(16,185,129,0.35)'
                      : '0 8px 32px rgba(251,191,36,0.35)',
                  }}
                >
                  {isLast ? t('welcome.get_started') : t('welcome.next')}
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
