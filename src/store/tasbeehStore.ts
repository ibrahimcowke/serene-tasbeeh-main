import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase, getCurrentUser } from '@/lib/supabase';
// Types
export type Dhikr = {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  hadiths?: { text: string; source: string }[];
};

export type SessionMode = 
  | { type: 'free' } 
  | { 
      type: 'tasbih100';
      currentPhase: number;
      phaseCounts: number[];
      isComplete: boolean;
    }
  | {
      type: 'tasbih1000';
      currentPhase: number; // 0-9 (10 sets)
      currentSetCount: number;
      isComplete: boolean;
    };



export type DailyRecord = {
  date: string;
  totalCount: number;
  counts: Record<string, number>;
};

export type CounterShape = 
  | 'minimal' | 'classic' | 'beads' | 'flower' | 'waveform' | 'digital' 
  | 'modern-ring' | 'vintage-wood' | 'geometric-star' | 'fluid' | 'radar' 
  | 'real-beads' | 'glass-orb' | 'portal-depth' | 'luminous-ring'
  | 'ring-light' | 'steampunk-nixie' | 'biolum-organic'
  | 'solar-flare' | 'nebula-cloud' | 'infinite-knot' 
  | 'holo-fan'
  | 'animated-ripple' | 'bead-ring' | 'halo-ring' | 'vertical-capsules' | 'luminous-beads'
  | 'helix-strand' | 'cyber-hexagon' | 'blooming-lotus' | 'constellation' | 'glass-pill' | 'emerald-loop'
  | 'smart-ring' | 'moon-phase' | 'water-ripple' | 'sand-hourglass' | 'lantern-fanous';

interface TasbeehState {
  // Counts
  count: number; // Legacy, keep for migration
  currentCount: number;
  targetCount: number; // Keep targetCount for now to avoid breaking changes
  
  // Session
  sessionMode: SessionMode;
  sessionStartTime: number | null;
  
  // Settings
  currentDhikr: Dhikr;
  // hapticEnabled/soundEnabled removed in favor of themeSettings
  theme: 'light' | 'theme-midnight' | 'theme-neon' | 'theme-green' | 'theme-cyberpunk' | 'theme-glass' | 'theme-sunset' | 'theme-forest' | 'theme-oled' | 'theme-biolum' | 'theme-radar-tactical' | 'theme-steampunk' | 'theme-crystal-depth';
  language: 'en' | 'ar';
  
  // Theme-specific settings container
  themeSettings: Record<string, ThemeSettings>;

  // Global preference (not per theme)
  counterShape: CounterShape;
  layout: 'default' | 'focus' | 'ergonomic';
  showTransliteration: boolean;

  // Mindfulness
  breathingGuideEnabled: boolean;
  breathingGuideSpeed: number;
  setBreathingGuide: (enabled: boolean) => void;
  setBreathingGuideSpeed: (speed: number) => void;

  // Zen Mode
  zenMode: boolean;
  setZenMode: (enabled: boolean) => void;
  
  // Hadith slider settings
  hadithSlideDuration: number; // in seconds
  hadithSlidePosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'right' | 'bottom' | 'hidden';
  
  // Dhikr Text Position
  dhikrTextPosition: 'top' | 'above-counter' | 'below-counter' | 'bottom' | 'hidden';
  
  // Data
  dailyRecords: DailyRecord[];
  totalAllTime: number;
  
  // Available dhikrs
  dhikrs: Dhikr[];
  customDhikrs: Dhikr[];
  
  streakDays: number;
  lastActiveDate: string | null;
  longestStreak: number;
  
  favoriteDhikrIds: string[];
  dailyGoal: number;
  
  // Quick Win Features
  lastCount: number;
  lastDhikrId: string | null;
  canUndo: boolean;
  autoThemeSwitch: boolean;
  shakeToReset: boolean;
  motivationalQuotesEnabled: boolean;
  lastShownQuoteId: string | null;
  lastSeenVersion: string | null;
  lastSeenDailyDhikrDate: string | null;
  
  // Actions
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setDhikr: (dhikr: Dhikr) => void;
  resetSettings: () => void;
  setTarget: (target: number) => void;
  toggleTransliteration: () => void;
  // Settings actions now update the specific theme
  toggleHaptic: () => void;
  toggleSound: () => void;
  setVibrationIntensity: (intensity: 'light' | 'medium' | 'heavy') => void;
  setFontScale: (scale: 0.8 | 1 | 1.2) => void;
  setSoundType: (type: 'click' | 'soft' | 'water') => void;
  
  setTheme: (theme: 'light' | 'theme-midnight' | 'theme-neon' | 'theme-green' | 'theme-cyberpunk' | 'theme-glass' | 'theme-sunset' | 'theme-forest' | 'theme-oled' | 'theme-biolum' | 'theme-radar-tactical' | 'theme-steampunk' | 'theme-crystal-depth') => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  addCustomDhikr: (dhikr: Omit<Dhikr, 'id'>) => void;
  removeCustomDhikr: (id: string) => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  
  // Session mode actions
  startTasbih100: () => void;
  startTasbih1000: () => void;
  exitSessionMode: () => void;
  
  updateStreak: () => void;
  toggleFavorite: (id: string) => void;
  
  // Sync
  syncToCloud: () => Promise<boolean>;
  syncFromCloud: () => Promise<boolean>;
  
  // New Settings Actions
  setCounterShape: (shape: CounterShape) => void;
  setLayout: (layout: 'default' | 'focus' | 'ergonomic') => void;
  setHadithSlideDuration: (duration: number) => void;
  setHadithSlidePosition: (position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'right' | 'bottom' | 'hidden') => void;
  setDailyGoal: (goal: number) => void;
  verticalOffset: number;
  setVerticalOffset: (offset: number) => void;
  dhikrVerticalOffset: number;
  setDhikrVerticalOffset: (offset: number) => void;
  counterVerticalOffset: number;
  setCounterVerticalOffset: (offset: number) => void;
  counterScale: number;
  setCounterScale: (scale: number) => void;
  countFontSize: number;
  setCountFontSize: (scale: number) => void;
  setDhikrTextPosition: (position: 'top' | 'above-counter' | 'below-counter' | 'bottom' | 'hidden') => void;
  
  // Layout Ordering
  layoutOrder: string[]; 
  setLayoutOrder: (order: string[]) => void;
  
  // Quick Win Actions
  undo: () => void;
  setAutoThemeSwitch: (enabled: boolean) => void;
  setShakeToReset: (enabled: boolean) => void;
  setMotivationalQuotesEnabled: (enabled: boolean) => void;
  setLastShownQuoteId: (id: string) => void;
  setLastSeenVersion: (version: string) => void;
  setLastSeenDailyDhikrDate: (date: string) => void;
}

export type ThemeSettings = {
  hapticEnabled: boolean;
  soundEnabled: boolean;
  vibrationIntensity: 'light' | 'medium' | 'heavy';
  fontScale: 0.8 | 1 | 1.2;
  soundType: 'click' | 'soft' | 'water';
};

const defaultThemeSettings: ThemeSettings = {
  hapticEnabled: true,
  soundEnabled: false,
  vibrationIntensity: 'medium',
  fontScale: 1,
  soundType: 'click',
};

const initialThemeSettings: Record<string, ThemeSettings> = {
  'light': { ...defaultThemeSettings },
  'theme-midnight': { ...defaultThemeSettings },
  'theme-neon': { ...defaultThemeSettings },
  'theme-green': { ...defaultThemeSettings },
  'theme-cyberpunk': { ...defaultThemeSettings },
  'theme-glass': { ...defaultThemeSettings },
  'theme-sunset': { ...defaultThemeSettings },
  'theme-forest': { ...defaultThemeSettings },
  'theme-oled': { ...defaultThemeSettings },
  'theme-biolum': { ...defaultThemeSettings },
  'theme-radar-tactical': { ...defaultThemeSettings },
  'theme-steampunk': { ...defaultThemeSettings },
  'theme-crystal-depth': { ...defaultThemeSettings },
};




export const defaultDhikrs: Dhikr[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah',
    hadiths: [
      {
        text: "مَنْ سَبَّحَ اللَّهَ فِي دُبُرِ كُلِّ صَلَاةٍ ثَلَاثًا وَثَلَاثِينَ، وَحَمِدَ اللَّهَ ثَلَاثًا وَثَلَاثِينَ، وَكَبَّرَ اللَّهَ ثَلَاثًا وَثَلَاثِينَ، فَتْلِكَ تِسْعَةٌ وَتِسْعُونَ، وَقَالَ تَمَامَ الْمِائَةِ: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ غُفِرَتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ",
        source: "صحيح مسلم"
      },
      {
        text: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        source: "صحيح البخاري"
      },
      {
        text: "مَنْ قَالَ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، فِي يَوْمٍ مِائَةَ مَرَّةٍ، حُطَّتْ خَطَايَاهُ وَإِنْ كَانَتْ مِثْلَ زَبَدِ الْبَحْرِ",
        source: "صحيح البخاري"
      },
      {
        text: "سُبْحَانَ اللَّهِ عَدَدَ خَلْقِهِ، سُبْحَانَ اللَّهِ رِضَا نَفْسِهِ، سُبْحَانَ اللَّهِ زِنَةَ عَرْشِهِ، سُبْحَانَ اللَّهِ مِدَادَ كَلِمَاتِهِ",
        source: "صحيح مسلم"
      },
      {
        text: "أَلَا أُخْبِرُكَ بِأَحَبِّ الْكَلَامِ إِلَى اللَّهِ؟ إِنَّ أَحَبَّ الْكَلَامِ إِلَى اللَّهِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
        source: "صحيح مسلم"
      }
    ]
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Praise be to Allah',
    hadiths: [
      {
        text: "الطُّهُورُ شَطْرُ الْإِيمَانِ، وَالْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ، وَسُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ تَمْلَآنِ - أَوْ تَمْلَأُ - مَا بَيْنَ السَّمَاوَاتِ وَالْأَرْضِ",
        source: "صحيح مسلم"
      },
      {
        text: "إِنَّ اللَّهَ لَيَرْضَى عَنِ الْعَبْدِ أَنْ يَأْكُلَ الْأَكْلَةَ فَيَحْمَدَهُ عَلَيْهَا، أَوْ يَشْرَبَ الشَّرْبَةَ فَيَحْمَدَهُ عَلَيْهَا",
        source: "صحيح مسلم"
      },
      {
        text: "الْحَمْدُ لِلَّهِ تَمْلَأُ الْمِيزَانَ، وَسُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ تَمْلَآنِ مَا بَيْنَ السَّمَاءِ وَالْأَرْضِ",
        source: "صحيح مسلم"
      },
      {
        text: "مَنْ قَالَ: الْحَمْدُ لِلَّهِ عَدَدَ مَا خَلَقَ، وَالْحَمْدُ لِلَّهِ مِلْءَ مَا خَلَقَ، وَالْحَمْدُ لِلَّهِ عَدَدَ مَا فِي السَّمَاوَاتِ وَالْأَرْضِ، وَالْحَمْدُ لِلَّهِ عَدَدَ مَا أَحْصَى كِتَابُهُ، وَالْحَمْدُ لِلَّهِ مِلْءَ مَا أَحْصَى كِتَابُهُ، وَالْحَمْدُ لِلَّهِ عَدَدَ كُلِّ شَيْءٍ، وَالْحَمْدُ لِلَّهِ مِلْءَ كُلِّ شَيْءٍ",
        source: "سنن أبي داود"
      },
      {
        text: "أَفْضَلُ الذِّكْرِ لَا إِلَهَ إِلَّا اللَّهُ، وَأَفْضَلُ الدُّعَاءِ الْحَمْدُ لِلَّهِ",
        source: "سنن الترمذي"
      }
    ]
  },
  {
    id: 'allahuakbar',
    arabic: 'اللهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest',
    hadiths: [
      {
        text: "أَحَبُّ الْكَلَامِ إِلَى اللَّهِ أَرْبَعٌ: سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
        source: "صحيح مسلم"
      },
      {
        text: "مَا أَهَلَّ مُهِلٌّ قَطُّ إِلَّا بُشِّرَ، وَلَا كَبَّرَ مُكَبِّرٌ قَطُّ إِلَّا بُشِّرَ",
        source: "المعجم الكبير للطبراني"
      },
      {
        text: "التَّكْبِيرُ جَزْمٌ، وَالتَّسْبِيحُ نِصْفٌ، وَالتَّحْمِيدُ شُكْرٌ",
        source: "الأدب المفرد للبخاري"
      },
      {
        text: "مَنْ قَالَ: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، فِي يَوْمٍ مِائَةَ مَرَّةٍ، كَانَتْ لَهُ عَدْلَ عَشْرِ رِقَابٍ، وَكُتِبَتْ لَهُ مِائَةُ حَسَنَةٍ، وَمُحِيَتْ عَنْهُ مِائَةُ سَيِّئَةٍ",
        source: "صحيح البخاري"
      },
      {
        text: "الْبَاقِيَاتُ الصَّالِحَاتُ: سُبْحَانَ اللَّهِ، وَالْحَمْدُ لِلَّهِ، وَلَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ",
        source: "سنن النسائي"
      }
    ]
  },
  {
    id: 'lailaha',
    arabic: 'لَا إِلَٰهَ إِلَّا اللهُ',
    transliteration: 'La ilaha illallah',
    meaning: 'There is no god but Allah',
    hadiths: [
      {
        text: "أَفْضَلُ الذِّكْرِ لَا إِلَهَ إِلَّا اللَّهُ",
        source: "سنن الترمذي"
      },
      {
        text: "مَنْ قَالَ: لَا إِلَهَ إِلَّا اللَّهُ مَنْقَذًا لِنَفْسِهِ مِنْ جُرْمٍ، أَوْ قَالَ: مُخْلِصًا دَخَلَ الْجَنَّةَ",
        source: "صحيح البخاري"
      },
      {
        text: "مَنْ قَالَ: لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ، عَشْرَ مَرَّاتٍ، كَانَ كَمَنْ أَعْتَقَ أَرْبَعَةَ أَنْفُسٍ مِنْ وَلَدِ إِسْمَاعِيلَ",
        source: "صحيح البخاري"
      },
      {
        text: "مَنْ كَانَ آخِرُ كَلَامِهِ لَا إِلَهَ إِلَّا اللَّهُ دَخَلَ الْجَنَّةَ",
        source: "سنن أبي داود"
      },
      {
        text: "جَدِّدُوا إِيمَانَكُمْ، قِيلَ: يَا رَسُولَ اللَّهِ، وَكَيْفَ نُجَدِّدُ إِيمَانَنَا؟ قَالَ: أَكْثِرُوا مِنْ قَوْلِ لَا إِلَهَ إِلَّا اللَّهُ",
        source: "مسند أحمد"
      }
    ]
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللهَ',
    transliteration: 'Astaghfirullah',
    meaning: 'I seek forgiveness from Allah',
    hadiths: [
      {
        text: "وَاللَّهِ إِنِّي لَأَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ فِي الْيَوْمِ أَكْثَرَ مِنْ سَبْعِينَ مَرَّةً",
        source: "صحيح البخاري"
      },
      {
        text: "مَنْ لَزِمَ الِاسْتِغْفَارَ جَعَلَ اللَّهُ لَهُ مِنْ كُلِّ ضِيقٍ مَخْرَجًا، وَمِنْ كُلِّ هَمٍّ فَرَجًا، وَرَزَقَهُ مِنْ حَيْثُ لَا يَحْتَسِبُ",
        source: "سنن أبي داود"
      },
      {
        text: "مَنْ قَالَ: أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ، غُفِرَ لَهُ وَإِنْ كَانَ فَرَّ مِنَ الزَّحْفِ",
        source: "سنن أبي داود"
      },
      {
        text: "طُوبَى لِمَنْ وَجَدَ فِي صَحِيفَتِهِ اسْتِغْفَارًا كَثِيرًا",
        source: "سنن ابن ماجه"
      },
      {
        text: "يَا أَيُّهَا النَّاسُ، تُوبُوا إِلَى اللَّهِ، فَإِنِّي أَتُوبُ فِي الْيَوْمِ إِلَيْهِ مِائَةَ مَرَّةٍ",
        source: "صحيح مسلم"
      }
    ]
  },
  {
    id: 'lahawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'La hawla wa la quwwata illa billah',
    meaning: 'There is no power and no strength except with Allah',
    hadiths: [
      {
        text: "يَا عَبْدَ اللَّهِ بْنَ قَيْسٍ، أَلَا أَدُلُّكَ عَلَى كَنْزٍ مِنْ كُنُوزِ الْجَنَّةِ؟ فَقُلْتُ: بَلَى يَا رَسُولَ اللَّهِ، قَالَ: قُلْ: لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
        source: "صحيح البخاري"
      },
      {
         text: "أَكْثِرُوا مِنْ قَوْلِ: لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، فَإِنَّهَا كَنْزٌ مِنْ كُنُوزِ الْجَنَّةِ",
         source: "مسند أحمد"
      }
    ]
  },
  {
    id: 'subhanallah_azeem',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'SubhanAllahi wa bihamdihi, SubhanAllahil Azeem',
    meaning: 'Glory be to Allah and His is the praise, Glory be to Allah, the Magnificent',
    hadiths: [
      {
        text: "كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
        source: "صحيح البخاري"
      }
    ]
  },
  {
      id: 'salawat',
      arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ',
      transliteration: 'Allahumma salli \'ala Muhammad',
      meaning: 'O Allah, send prayers upon Muhammad',
      hadiths: [
          {
              text: "مَنْ صَلَّى عَلَيَّ وَاحِدَةً صَلَّى اللَّهُ عَلَيْهِ عَشْرًا",
              source: "صحيح مسلم"
          },
          {
              text: "أَوْلَى النَّاسِ بِي يَوْمَ الْقِيَامَةِ أَكْثَرُهُمْ عَلَيَّ صَلَاةً",
              source: "سنن الترمذي"
          }
      ]
  }
];

const getTodayDate = () => new Date().toISOString().split('T')[0];

const getDefaultSessionMode = (): SessionMode => ({
  type: 'tasbih100',
  currentPhase: 0,
  phaseCounts: [0, 0, 0, 0],
  isComplete: false,
});

const calculateStreakFromHistory = (history: DailyRecord[]) => {
  let streak = 0;
  const sortedHistory = [...(history || [])].sort((a, b) => b.date.localeCompare(a.date));
  
  if (sortedHistory.length === 0) return 0;

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const latestDate = sortedHistory[0].date;
  if (latestDate !== today && latestDate !== yesterdayStr) return 0;
  
  let current = new Date(latestDate);
  let count = 0;
  
  for (const record of sortedHistory) {
      if (record.date === current.toISOString().split('T')[0]) {
          count++;
          current.setDate(current.getDate() - 1);
      } else {
          break;
      }
  }
  return count;
};

export const useTasbeehStore = create<TasbeehState>()(
  persist(
    (set, get) => ({
      // Initial state
      count: 0, // Legacy support
      currentDhikr: defaultDhikrs[0],
      currentCount: 0,
      targetCount: 33, // Renamed to target in the diff, but keeping targetCount for now
      sessionStartTime: null,
      
      // Session mode
      sessionMode: getDefaultSessionMode(),
      
      // Streak
      streakDays: 0,
      lastActiveDate: null,
      longestStreak: 0,
      
      themeSettings: initialThemeSettings,
      showTransliteration: true,
      
      // Removed top-level haptic/sound/vib in favor of themeSettings, but keeping them accessing current theme would be ideal or we just migrate
      // We will access them via getters or helpers in the components.
      
      theme: 'light',
      language: 'en', // Keeping language for now
      zenMode: false,
      counterShape: 'minimal', // New
      breathingGuideEnabled: false,
      breathingGuideSpeed: 4, // seconds per breath cycle
      layout: 'default',
      hadithSlideDuration: 15, // 15 seconds default
      hadithSlidePosition: 'right', // default position
      dhikrTextPosition: 'below-counter', // Default position
      layoutOrder: ['dhikr', 'counter', 'stats', 'hadith'], // Default order
      verticalOffset: 0,
      dhikrVerticalOffset: 0,
      counterVerticalOffset: 0,
      counterScale: 1,
      countFontSize: 1,
      
      dailyRecords: [],
      totalAllTime: 0,
      
      dhikrs: defaultDhikrs,
      customDhikrs: [],
      dailyGoal: 100,
      
      // Quick Win Features initial state
      lastCount: 0,
      lastDhikrId: null,
      canUndo: false,
      autoThemeSwitch: false,
      shakeToReset: false,
      motivationalQuotesEnabled: true,
      lastShownQuoteId: null,
      lastSeenVersion: null,
      lastSeenDailyDhikrDate: null,
      
      // Actions
      increment: () => {
        const state = get();
        const today = getTodayDate();
        
        // Save state for undo
        set({
          lastCount: state.currentCount,
          lastDhikrId: state.currentDhikr.id,
          canUndo: true,
        });
        
        const currentSettings = state.themeSettings[state.theme] || defaultThemeSettings;
        
        // Trigger haptic if enabled for this theme
        if (currentSettings.hapticEnabled && navigator.vibrate) {
          const intensity = currentSettings.vibrationIntensity === 'light' ? 10 : currentSettings.vibrationIntensity === 'medium' ? 15 : 25;
          navigator.vibrate(intensity);
        }
        
        set((state) => {
          let newCount = state.currentCount + 1;
          const newTotal = state.totalAllTime + 1;
          
          // Update daily record logic... (keeping existing valid logic)
          const updatedRecords = [...state.dailyRecords];
          const lastRecordIndex = updatedRecords.length - 1;
          const lastRecord = updatedRecords[lastRecordIndex];
          
          let targetIndex = -1;
          if (lastRecord && lastRecord.date === today) {
            targetIndex = lastRecordIndex;
          } else {
            targetIndex = updatedRecords.findIndex(r => r.date === today);
          }
          
          if (targetIndex >= 0) {
            const record = { ...updatedRecords[targetIndex] };
            record.counts = { ...record.counts }; 
            record.counts[state.currentDhikr.id] = (record.counts[state.currentDhikr.id] || 0) + 1;
            record.totalCount += 1;
            updatedRecords[targetIndex] = record;
          } else {
            updatedRecords.push({
              date: today,
              counts: { [state.currentDhikr.id]: 1 },
              totalCount: 1,
            });
          }
          
          // Handle 100 session mode
          let sessionMode = { ...state.sessionMode };
          let currentDhikr = state.currentDhikr;
          
          if (sessionMode.type === 'tasbih100') {
             // ... existing 100 logic ...
             const phaseTargets = [33, 33, 33, 1]; 
             const phaseDhikrs = [defaultDhikrs[0], defaultDhikrs[1], defaultDhikrs[2], defaultDhikrs[3]];
             
             sessionMode.phaseCounts[sessionMode.currentPhase] = newCount;
             
             if (newCount >= phaseTargets[sessionMode.currentPhase]) {
              if (sessionMode.currentPhase < 3) {
                sessionMode.currentPhase += 1;
                currentDhikr = phaseDhikrs[sessionMode.currentPhase];
                newCount = 0;
              } else {
                sessionMode.isComplete = true;
              }
            }
          } else if (sessionMode.type === 'tasbih1000') {
             sessionMode.currentSetCount = newCount;
             
             if (newCount >= 100) {
               if (sessionMode.currentPhase < 9) {
                 sessionMode.currentPhase += 1;
                 newCount = 0;
                 sessionMode.currentSetCount = 0;
               } else {
                 sessionMode.isComplete = true;
               }
             }
          }
          
          return {
            currentCount: newCount,
            totalAllTime: newTotal,
            dailyRecords: updatedRecords,
            sessionStartTime: state.sessionStartTime || Date.now(),
            sessionMode,
            currentDhikr,
          };
        });
        
        get().updateStreak();
      },
      
      decrement: () => {
        set((state) => ({
          currentCount: Math.max(0, state.currentCount - 1),
        }));
      },
      
      favoriteDhikrIds: [],
      
      toggleFavorite: (id) => set((state) => ({
        favoriteDhikrIds: state.favoriteDhikrIds.includes(id)
          ? state.favoriteDhikrIds.filter(fid => fid !== id)
          : [...state.favoriteDhikrIds, id]
      })),
      
      resetSettings: () => {
         const root = window.document.documentElement;
         root.classList.remove('light', 'dark', 'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass', 'theme-sunset', 'theme-forest', 'theme-oled', 'theme-biolum', 'theme-radar-tactical', 'theme-steampunk', 'theme-crystal-depth');
         root.classList.add('light');
         
         set({ 
            themeSettings: initialThemeSettings, 
            theme: 'light', 
            counterShape: 'minimal',
            layout: 'default',
            showTransliteration: true 
         });
      },

      reset: () => {
          const state = get();
          const currentSettings = state.themeSettings[state.theme] || defaultThemeSettings;
          if (currentSettings.hapticEnabled && navigator.vibrate) {
             navigator.vibrate([30, 50, 30]);
          }
         
         if (state.sessionMode.type === 'tasbih100') {
           set({ 
             currentCount: 0,
             sessionStartTime: null,
             sessionMode: {
               type: 'tasbih100',
               currentPhase: 0,
               phaseCounts: [0, 0, 0, 0],
               isComplete: false,
             },
             currentDhikr: defaultDhikrs[0]
           });
         } else if (state.sessionMode.type === 'tasbih1000') {
            set({
              currentCount: 0,
              sessionStartTime: null,
              sessionMode: {
                type: 'tasbih1000',
                currentPhase: 0,
                currentSetCount: 0,
                isComplete: false
              }
            });
         } else {
           set({ currentCount: 0, sessionStartTime: null });
         }
      },
      
      setDhikr: (dhikr) => set({ currentDhikr: dhikr, currentCount: 0, sessionStartTime: null }),
      setTarget: (target) => set((state) => {
        const isFreeMode = state.sessionMode.type === 'free';
        return { 
          targetCount: target,
          sessionMode: { type: 'free' },
          currentCount: isFreeMode ? state.currentCount : 0,
          sessionStartTime: isFreeMode ? state.sessionStartTime : null
        };
      }),
      toggleTransliteration: () => set((state) => ({ showTransliteration: !state.showTransliteration })),
      
      toggleHaptic: () => set((state) => ({
        themeSettings: {
          ...state.themeSettings,
          [state.theme]: {
            ...state.themeSettings[state.theme],
            hapticEnabled: !state.themeSettings[state.theme].hapticEnabled
          }
        }
      })),
      
      toggleSound: () => set((state) => ({
        themeSettings: {
          ...state.themeSettings,
          [state.theme]: {
            ...state.themeSettings[state.theme],
            soundEnabled: !state.themeSettings[state.theme].soundEnabled
          }
        }
      })),

      setVibrationIntensity: (intensity) => set((state) => ({
        themeSettings: {
          ...state.themeSettings,
          [state.theme]: {
            ...state.themeSettings[state.theme],
            vibrationIntensity: intensity
          }
        }
      })),

      setFontScale: (scale) => set((state) => ({
        themeSettings: {
          ...state.themeSettings,
          [state.theme]: {
            ...state.themeSettings[state.theme],
            fontScale: scale
          }
        }
      })),

      setSoundType: (type) => set((state) => ({
        themeSettings: {
          ...state.themeSettings,
          [state.theme]: {
            ...state.themeSettings[state.theme],
            soundType: type
          }
        }
      })),
      
      setTheme: (theme) => {
        set({ theme });
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass', 'theme-sunset', 'theme-forest', 'theme-oled', 'theme-biolum', 'theme-radar-tactical', 'theme-steampunk', 'theme-crystal-depth');
        root.classList.add(theme);
      },
      
      setLanguage: (language) => set({ language }),
      
      addCustomDhikr: (dhikr) => {
        const id = `custom_${Date.now()}`;
        set((state) => ({ customDhikrs: [...state.customDhikrs, { ...dhikr, id }] }));
      },
      
      removeCustomDhikr: (id) => {
        set((state) => ({
          customDhikrs: state.customDhikrs.filter(d => d.id !== id),
          currentDhikr: state.currentDhikr.id === id ? state.dhikrs[0] : state.currentDhikr,
        }));
      },
      
      clearAllData: () => {
        set({
          currentCount: 0,
          dailyRecords: [],
          totalAllTime: 0,
          customDhikrs: [],
          sessionStartTime: null,
          streakDays: 0,
          lastActiveDate: null,
          longestStreak: 0,
          sessionMode: getDefaultSessionMode(),
        });
      },
      
      exportData: () => {
        const state = get();
        return JSON.stringify({
            dailyRecords: state.dailyRecords,
            totalAllTime: state.totalAllTime,
            customDhikrs: state.customDhikrs,
            streakDays: state.streakDays,
            settings: {
                counterShape: state.counterShape,
                target: state.targetCount,
                themeSettings: state.themeSettings
            }
        });
      },
      
      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.settings?.theme) {
             const root = window.document.documentElement;
             root.classList.remove('light', 'dark', 'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass', 'theme-sunset', 'theme-forest', 'theme-oled', 'theme-biolum', 'theme-radar-tactical', 'theme-steampunk', 'theme-crystal-depth');
             root.classList.add(parsed.settings.theme);
          }
          
          set((state) => ({
             ...state,
             ...parsed, 
              // Basic merge, real logic might be slightly safer but this works for simple restore
             theme: parsed.settings?.theme || state.theme,
             counterShape: parsed.settings?.counterShape || state.counterShape,
             layout: parsed.settings?.layout || state.layout,
             layoutOrder: parsed.settings?.layoutOrder || state.layoutOrder,
             themeSettings: parsed.settings?.themeSettings || state.themeSettings
          }));
          return true;
        } catch {
          return false;
        }
      },

      startTasbih100: () => {
        set({
          sessionMode: { type: 'tasbih100', currentPhase: 0, phaseCounts: [0, 0, 0, 0], isComplete: false },
          currentDhikr: defaultDhikrs[0],
          currentCount: 0,
          targetCount: 33,
          sessionStartTime: null,
        });
      },

      startTasbih1000: () => {
        set({
          sessionMode: { type: 'tasbih1000', currentPhase: 0, currentSetCount: 0, isComplete: false },
          currentCount: 0,
          targetCount: 100,
          sessionStartTime: null,
        });
      },
      
      exitSessionMode: () => {
        set({ sessionMode: getDefaultSessionMode(), currentCount: 0, sessionStartTime: null });
      },
      
      updateStreak: () => {
        const today = getTodayDate();
        const state = get();
        if (state.lastActiveDate === today) return;
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = state.streakDays;
        if (state.lastActiveDate === yesterdayStr) {
          newStreak += 1;
        } else if (state.lastActiveDate !== today) {
          newStreak = 1;
        }
        
        set({
          streakDays: newStreak,
          lastActiveDate: today,
          longestStreak: Math.max(state.longestStreak, newStreak),
        });
      },
      
      setCounterShape: (shape) => set({ counterShape: shape }),
      setLayout: (layout) => set({ layout }),
      setHadithSlideDuration: (duration) => set({ hadithSlideDuration: duration }),
      setHadithSlidePosition: (position) => set({ hadithSlidePosition: position }),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      setVerticalOffset: (offset) => set({ verticalOffset: offset }),
      setDhikrVerticalOffset: (offset) => set({ dhikrVerticalOffset: offset }),
      setCounterVerticalOffset: (offset) => set({ counterVerticalOffset: offset }),
      setCounterScale: (scale) => set({ counterScale: scale }),
      setCountFontSize: (scale) => set({ countFontSize: scale }),
      setDhikrTextPosition: (position) => set({ dhikrTextPosition: position }),
      setLayoutOrder: (order) => set({ layoutOrder: order }),
      setZenMode: (enabled) => set({ zenMode: enabled }),
      setBreathingGuide: (enabled) => set({ breathingGuideEnabled: enabled }),
      setBreathingGuideSpeed: (speed) => set({ breathingGuideSpeed: speed }),
      
      // Quick Win Actions
      undo: () => {
        const state = get();
        if (!state.canUndo) return;
        
        // Find the dhikr by ID
        const dhikr = state.dhikrs.find(d => d.id === state.lastDhikrId) || 
                      state.customDhikrs.find(d => d.id === state.lastDhikrId) ||
                      state.currentDhikr;
        
        set({
          currentCount: state.lastCount,
          currentDhikr: dhikr,
          canUndo: false,
        });
        
        // Haptic feedback
        const currentSettings = state.themeSettings[state.theme] || defaultThemeSettings;
        if (currentSettings.hapticEnabled && navigator.vibrate) {
          navigator.vibrate([20, 50, 20]);
        }
      },
      
      setAutoThemeSwitch: (enabled) => set({ autoThemeSwitch: enabled }),
      setShakeToReset: (enabled) => set({ shakeToReset: enabled }),
      setMotivationalQuotesEnabled: (enabled) => set({ motivationalQuotesEnabled: enabled }),
      setLastShownQuoteId: (id) => set({ lastShownQuoteId: id }),
      setLastSeenVersion: (version) => set({ lastSeenVersion: version }),
      setLastSeenDailyDhikrDate: (date) => set({ lastSeenDailyDhikrDate: date }),

      syncToCloud: async () => {
        try {
          const user = await getCurrentUser();
          if (!user) {
            console.warn('Cannot sync: No user logged in');
            return false;
          }

          // Validate user ID is a proper UUID
          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
          if (!uuidRegex.test(user.id)) {
            console.error('Invalid user ID format:', user.id);
            return false;
          }

          const state = get();
          const dataToSave = {
             dailyRecords: state.dailyRecords,
             totalAllTime: state.totalAllTime,
             customDhikrs: state.customDhikrs,
             streakDays: state.streakDays,
             lastActiveDate: state.lastActiveDate,
             longestStreak: state.longestStreak,
             settings: {
                 counterShape: state.counterShape,
                 target: state.targetCount,
                 themeSettings: state.themeSettings,
                 showTransliteration: state.showTransliteration,
                 hadithSlideDuration: state.hadithSlideDuration,
                 hadithSlidePosition: state.hadithSlidePosition,
                 verticalOffset: state.verticalOffset,
                 dhikrVerticalOffset: state.dhikrVerticalOffset,
                 counterVerticalOffset: state.counterVerticalOffset,
                 counterScale: state.counterScale,
                 countFontSize: state.countFontSize,
                 dhikrTextPosition: state.dhikrTextPosition,
                 layoutOrder: state.layoutOrder,
                 theme: state.theme,
                 autoThemeSwitch: state.autoThemeSwitch,
                 shakeToReset: state.shakeToReset,
                 motivationalQuotesEnabled: state.motivationalQuotesEnabled,
                 lastSeenVersion: state.lastSeenVersion,
                 lastSeenDailyDhikrDate: state.lastSeenDailyDhikrDate,
             }
          };

          const { error } = await supabase
            .from('profiles')
            .upsert({ 
              id: user.id, 
              tasbeeh_data: dataToSave,
              updated_at: new Date().toISOString()
            });
            
          if (error) {
            console.error('Sync to cloud failed:', error);
            return false;
          }
          
          console.log('✅ Successfully synced to cloud');
          return true;
        } catch (err) {
          console.error('❌ Sync error:', err);
          return false;
        }
      },

      syncFromCloud: async () => {
         const user = await getCurrentUser();
         if (!user) return false;

         const { data, error } = await supabase
           .from('profiles')
           .select('tasbeeh_data')
           .eq('id', user.id)
           .single();
           
         if (error || !data?.tasbeeh_data) return false;
         
         const parsed = data.tasbeeh_data; // It's likely already JSON if using supabase-js
         
         set((state) => ({
             ...state,
             ...parsed,
             // Ensure nested objects are merged or overwritten correctly
             theme: parsed.settings?.theme || state.theme,
             counterShape: parsed.settings?.counterShape || state.counterShape,
             layout: parsed.settings?.layout || state.layout,
             themeSettings: parsed.settings?.themeSettings || state.themeSettings,
             hadithSlideDuration: parsed.settings?.hadithSlideDuration || state.hadithSlideDuration,
             hadithSlidePosition: parsed.settings?.hadithSlidePosition || state.hadithSlidePosition,
             verticalOffset: parsed.settings?.verticalOffset || state.verticalOffset,
             dhikrVerticalOffset: parsed.settings?.dhikrVerticalOffset || state.dhikrVerticalOffset,
             counterVerticalOffset: parsed.settings?.counterVerticalOffset || state.counterVerticalOffset,
             counterScale: parsed.settings?.counterScale || state.counterScale,
             countFontSize: parsed.settings?.countFontSize || state.countFontSize,
             dhikrTextPosition: parsed.settings?.dhikrTextPosition || state.dhikrTextPosition,
             showTransliteration: parsed.settings?.showTransliteration !== undefined ? parsed.settings.showTransliteration : state.showTransliteration,
             autoThemeSwitch: parsed.settings?.autoThemeSwitch !== undefined ? parsed.settings.autoThemeSwitch : state.autoThemeSwitch,
             shakeToReset: parsed.settings?.shakeToReset !== undefined ? parsed.settings.shakeToReset : state.shakeToReset,
             motivationalQuotesEnabled: parsed.settings?.motivationalQuotesEnabled !== undefined ? parsed.settings.motivationalQuotesEnabled : state.motivationalQuotesEnabled,
             lastSeenVersion: parsed.settings?.lastSeenVersion || state.lastSeenVersion,
             lastSeenDailyDhikrDate: parsed.settings?.lastSeenDailyDhikrDate || state.lastSeenDailyDhikrDate,
         }));
         
         // If theme changed, apply it
         if (parsed.settings?.theme) {
             const root = window.document.documentElement;
             root.classList.remove('light', 'dark', 'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass', 'theme-sunset', 'theme-forest', 'theme-oled', 'theme-biolum', 'theme-radar-tactical', 'theme-steampunk', 'theme-crystal-depth');
             root.classList.add(parsed.settings.theme);
         }
         
         return true;
      },
    }),
    {
      name: 'tasbeeh-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          const history = persistedState.dailyRecords || [];
          const streak = calculateStreakFromHistory(history);
          return {
            ...persistedState,
            streakDays: streak,
            longestStreak: streak,
            favoriteDhikrIds: persistedState.favoriteDhikrIds || [],
            dailyGoal: persistedState.dailyGoal || 100,
          };
        }
        return persistedState as TasbeehState;
      },
      partialize: (state) => ({
        currentDhikr: state.currentDhikr,
        currentCount: state.currentCount,
        targetCount: state.targetCount,
        showTransliteration: state.showTransliteration,
        themeSettings: state.themeSettings,
        theme: state.theme,
        language: state.language,
        zenMode: state.zenMode,
        counterShape: state.counterShape,
        layout: state.layout,
        hadithSlideDuration: state.hadithSlideDuration,
        hadithSlidePosition: state.hadithSlidePosition,
        dhikrTextPosition: state.dhikrTextPosition,
        verticalOffset: state.verticalOffset,
        dhikrVerticalOffset: state.dhikrVerticalOffset,
        counterVerticalOffset: state.counterVerticalOffset,
        counterScale: state.counterScale,
        countFontSize: state.countFontSize,
        dailyRecords: state.dailyRecords,
        totalAllTime: state.totalAllTime,
        customDhikrs: state.customDhikrs,
        streakDays: state.streakDays,
        lastActiveDate: state.lastActiveDate,
        longestStreak: state.longestStreak,
        sessionMode: state.sessionMode,
        dailyGoal: state.dailyGoal,
        favoriteDhikrIds: state.favoriteDhikrIds,
        lastSeenVersion: state.lastSeenVersion,
        lastSeenDailyDhikrDate: state.lastSeenDailyDhikrDate,
        lastShownQuoteId: state.lastShownQuoteId,
        autoThemeSwitch: state.autoThemeSwitch,
        shakeToReset: state.shakeToReset,
        motivationalQuotesEnabled: state.motivationalQuotesEnabled,
      }),
    }
  )
);
