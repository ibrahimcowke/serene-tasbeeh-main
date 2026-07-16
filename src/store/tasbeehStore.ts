import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { counterShapes } from '@/lib/constants';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { defaultRoutines } from '@/data/routines';
import { debouncedStorage } from '@/lib/debouncedStorage';
import { NotificationManager } from '@/lib/notifications';
import { registerPlugin } from '@capacitor/core';
import { achievements } from '@/data/achievements';
import { toast } from 'sonner';

const getTodayDate = () => new Date().toISOString().split('T')[0];

const WidgetBridge = typeof window !== 'undefined' && (window as any).Capacitor?.isPluginAvailable('WidgetBridge')
  ? registerPlugin<any>('WidgetBridge')
  : null;

const syncWidget = (count: number, dhikrName: string) => {
  if (WidgetBridge) {
    WidgetBridge.updateWidgetCount({ count, dhikr: dhikrName }).catch((err: any) => {
      console.warn('Failed to update Android widget:', err);
    });
  }
};

export interface Dhikr {
  id: string;
  arabic: string;
  translation: string;
  transliteration: string;
  category?: string;
  isCustom?: boolean;
  hadiths?: { text: string; source: string }[];
}

export type ThemeType =
  | 'light' | 'theme-midnight' | 'theme-glass' | 'theme-sunset' | 'theme-forest'
  | 'theme-oled'
  | 'theme-mecca-night' | 'theme-desert-starlight' | 'theme-ramadan-lantern' | 'theme-rose-bloom'
  | 'theme-emerald-shine' | 'theme-cyberpunk-zen' | 'theme-ocean-depth' | 'theme-sakura-zen'
  | 'theme-nordic-aurora' | 'theme-cosmic-nebula' | 'theme-solar-flare';

export interface ThemeSettings {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: string;
  textMuted: string;
  border: string;
  hapticEnabled: boolean;
  soundEnabled: boolean;
  vibrationIntensity: number;
  fontScale: number;
  soundType: 'click' | 'bubble' | 'mechanical' | 'digital';
}

export interface DayRecord {
  date: string;
  totalCount: number;
  counts: Record<string, number>;
}

export interface SessionRecord {
  id: string;
  date: string;
  dhikrId: string;
  count: number;
  duration: number; // in seconds
  avgSpeed: number; // taps per minute
  timestamp: number;
}

export type CounterShape =
  | 'plain' | 'minimal' | 'classic' | 'beads' | 'flower' | 'waveform' | 'digital'
  | 'modern-ring' | 'ring-light' 
  | 'bead-ring' | 'halo-ring' | 'vertical-capsules' | 'luminous-beads'
  | 'emerald-loop' | 'smart-ring' | 'moon-phase'
  | 'digital-watch' | 'star-burst' | 'crystal-prism' | 'tally-clicker' | 'digital-tally'
  | 'neumorph' | 'sunset-horizon' | 'crystal-orbit' | 'aurora-glow' | 'diamond-prism' | 'golden-spiral';

export interface Reminder {
  id: string;
  time: string;
  label: string;
  enabled: boolean;
  days: number[]; // 0-6 for Sunday-Saturday
}

export interface RoutineStep {
  id: string;
  dhikrId: string;
  target: number;
  description?: string;
}

export type SessionMode =
  | { type: 'free' }
  | { type: 'tasbih100'; currentPhase: number; phaseCounts: number[]; isComplete: boolean; challengeId?: string }
  | { type: 'tasbih1000'; currentPhase: number; phaseCounts: number[]; isComplete: boolean; challengeId?: string }
  | { type: 'routine'; routineId: string; currentStepIndex: number; steps: RoutineStep[]; isComplete: boolean };

export interface TasbeehState {
  count: number;
  currentCount: number;
  targetCount: number;
  totalAllTime: number;
  dailyRecords: DayRecord[];
  dailyGoal: number;
  currentDhikr: Dhikr;
  dhikrs: Dhikr[];
  customDhikrs: Dhikr[];
  favoriteDhikrIds: string[];
  theme: ThemeType;
  themeSettings: Record<string, ThemeSettings>;
  language: string;
  showTransliteration: boolean;
  counterShape: CounterShape;
  countFontSize: number;
  dhikrFontSize: number;
  dhikrTextPosition: 'top' | 'middle' | 'bottom' | 'none';
  verticalOffset: number;
  dhikrVerticalOffset: number;
  counterVerticalOffset: number;
  counterScale: number;
  zenMode: boolean;
  autoThemeSwitch: boolean;
  shakeToReset: boolean;
  syncPrayerTimes: boolean | null;
  wakeLockEnabled: boolean;
  volumeButtonCounting: boolean;
  lastSeenVersion: string;
  hadithSlideDuration: number;
  hadithSlidePosition: 'top' | 'bottom' | 'none';
  breathingGuideEnabled: boolean;
  breathingGuideSpeed: number;
  streakDays: number;
  lastActiveDate: string | null;
  longestStreak: number;
  unlockedAchievements: string[];
  screenOffMode: boolean;
  setScreenOffMode: (enabled: boolean) => void;
  sessionStartTime: number | null;
  sessionMode: SessionMode;
  notificationPermission: NotificationPermission | 'not-supported';
  reminderEnabled: boolean;
  reminderTime: string;
  reminders: Reminder[];
  lastCount: number;
  lastDhikrId: string;
  canUndo: boolean;

  showCongrats: boolean;
  congratsData: { title: string; description: string; hasanatEarned: number } | null;
  totalHasanat: number;
  showMoodTracker: boolean;
  setShowMoodTracker: (open: boolean) => void;

  autoCountActive: boolean;
  autoCountInterval: number;
  startAutoCount: () => void;
  stopAutoCount: () => void;
  setAutoCountInterval: (ms: number) => void;

  sessions: SessionRecord[];
  deviceUuid: string;
  setDeviceUuid: (uuid: string) => void;
  personalBest: number;
  saveActiveSession: () => void;

  // New v2.1.0 features
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (seen: boolean) => void;

  ambientSoundType: 'none' | 'rain' | 'water' | 'masjid';
  ambientSoundVolume: number;
  setAmbientSound: (type: 'none' | 'rain' | 'water' | 'masjid', volume?: number) => void;
  setAmbientSoundVolume: (volume: number) => void;

  niyyah: string;
  setNiyyah: (text: string) => void;

  sessionMoodRatings: { sessionId: string; mood: string; focus: number; timestamp: number }[];
  addMoodRating: (rating: { sessionId: string; mood: string; focus: number }) => void;

  voiceAnnouncementsEnabled: boolean;
  setVoiceAnnouncements: (enabled: boolean) => void;

  sessionTimerDuration: number; // seconds, 0 = disabled
  sessionTimerActive: boolean;
  setSessionTimerDuration: (seconds: number) => void;
  setSessionTimerActive: (active: boolean) => void;

  hapticPattern: 'default' | 'double' | 'triple';
  setHapticPattern: (pattern: 'default' | 'double' | 'triple') => void;

  autoStartPostPrayerTasbeeh: boolean;
  setAutoStartPostPrayerTasbeeh: (enabled: boolean) => void;

  lazyDayRecoveryEnabled: boolean;
  setLazyDayRecoveryEnabled: (enabled: boolean) => void;

  niyyahPresets: string[];
  dedicatedCounts: Record<string, number>;
  customRoutines: any[];
  favoriteDuaIds: string[];
  addCustomRoutine: (routine: any) => void;
  removeCustomRoutine: (id: string) => void;
  toggleFavoriteDua: (id: string) => void;
  incrementDedicatedCount: (name: string, count: number) => void;

  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setDhikr: (dhikr: Dhikr) => void;
  setTarget: (target: number) => void;
  toggleTransliteration: () => void;
  setTheme: (theme: ThemeType) => void;
  setThemeSettings: (theme: string, settings: Partial<ThemeSettings>) => void;
  setLanguage: (lang: string) => void;
  addCustomDhikr: (dhikr: Omit<Dhikr, 'id' | 'isCustom'>) => void;
  removeCustomDhikr: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearAllData: () => void;
  resetSettings: () => void;
  setCounterShape: (shape: CounterShape) => void;
  setHadithSlideDuration: (duration: number) => void;
  setHadithSlidePosition: (position: 'top' | 'bottom' | 'none') => void;
  setDailyGoal: (goal: number) => void;
  setVerticalOffset: (offset: number) => void;
  setDhikrVerticalOffset: (offset: number) => void;
  setCounterVerticalOffset: (offset: number) => void;
  setCounterScale: (scale: number) => void;
  setCountFontSize: (scale: number) => void;
  setDhikrFontSize: (scale: number) => void;
  setDhikrTextPosition: (pos: 'top' | 'middle' | 'bottom' | 'none') => void;
  setZenMode: (enabled: boolean) => void;
  setBreathingGuide: (enabled: boolean) => void;
  setBreathingGuideSpeed: (speed: number) => void;
  toggleHaptic: () => void;
  toggleSound: () => void;
  setVibrationIntensity: (intensity: number) => void;
  setFontScale: (scale: number) => void;
  setSoundType: (type: 'click' | 'bubble' | 'mechanical' | 'digital') => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  startTasbih100: (challengeId?: string) => void;
  startTasbih1000: (challengeId?: string) => void;
  startLaIlahaWahdahu100: () => void;
  startAstaghfirullah100: () => void;
  startRoutine: (routineId: string) => void;
  nextRoutineStep: () => void;
  exitSessionMode: () => void;
  undo: () => void;
  setAutoThemeSwitch: (enabled: boolean) => void;
  setShakeToReset: (enabled: boolean) => void;
  setSyncPrayerTimes: (enabled: boolean | null) => void;
  setWakeLockEnabled: (enabled: boolean) => void;
  setVolumeButtonCounting: (enabled: boolean) => void;
  setLastSeenVersion: (version: string) => void;
  setNotificationPermission: (perm: NotificationPermission | 'not-supported') => void;
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  removeReminder: (id: string) => void;
  toggleReminder: (id: string) => void;
  updateReminder: (id: string, reminder: Partial<Omit<Reminder, 'id'>>) => void;
  switchDhikr: () => void;
  triggerCongrats: (data: { title: string; description: string; hasanatEarned: number }) => void;
  closeCongrats: () => void;
  updateStreak: () => void;
  checkAchievements: () => void;
}

export const defaultDhikrs: Dhikr[] = [
  { id: 'subahanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', transliteration: 'Subhan-Allah', translation: 'Glory be to Allah', hadiths: [{ text: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان: سبحان الله وبحمده، سبحان الله العظيم", source: "البخاري ومسلم" }, { text: "من قال: سبحان الله وبحمده، في يوم مائة مرة، حطت خطاياه وإن كانت مثل زبد البحر", source: "البخاري" }] },
  { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', transliteration: 'Alhamdulillah', translation: 'Praise be to Allah', hadiths: [{ text: "أفضل الدعاء الحمد لله", source: "الترمذي" }, { text: "والحمد لله تملأ الميزان", source: "مسلم" }] },
  { id: 'allahuakbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest', hadiths: [{ text: "أحب الكلام إلى الله أربع: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر", source: "مسلم" }] },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', transliteration: 'Astaghfirullah', translation: 'I seek forgiveness from Allah', hadiths: [{ text: "من لزم الاستغفار جعل الله له من كل هم فرجا، ومن كل ضيق مخرجا", source: "أبو داود" }] },
  { id: 'la-ilaha-illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', transliteration: 'La ilaha illallah', translation: 'There is no god but Allah', hadiths: [{ text: "أفضل الذكر لا إله إلا الله", source: "الترمذي" }] },
  { id: 'allahuma-sali', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', transliteration: 'Allahumma Salli Ala Muhammad (SCW)', translation: 'O Allah, send blessings upon Muhammad (SCW)', hadiths: [{ text: "من صلى علي واحدة صلى الله عليه عشرا", source: "مسلم" }] },
  { id: 'ayat_alkursi', arabic: 'آيَةُ الْكُرْسِيِّ', transliteration: 'Ayat al-Kursi', translation: 'The Throne Verse', hadiths: [{ text: "هي أعظم آية في كتاب الله", source: "مسلم" }] },
  { id: '3_quls', arabic: 'الْمُعَوِّذَاتِ', transliteration: 'The 3 Quls', translation: 'Surah Ikhlas, Falaq, and Nas', hadiths: [{ text: "قل هو الله أحد تعدل ثلث القرآن", source: "البخاري" }] },
  { id: 'la_ilaha_wahdahu', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ', transliteration: 'La ilaha illallah wahdahu', translation: 'None has the right to be worshipped but Allah alone', hadiths: [{ text: "من قال: لا إله إلا الله وحده لا شريك له... في يوم مائة مرة كانت له عدل عشر رقاب", source: "البخاري ومسلم" }] },
  { id: 'astaghfirullah_atubu', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ وَأَتُوبُ إِلَيْهِ', transliteration: 'Astaghfirullah wa atubu ilayh', translation: 'I seek forgiveness from Allah and repent to Him', hadiths: [{ text: "إني لأستغفر الله وأتوب إليه في اليوم مائة مرة", source: "مسلم" }] }
];

// Imported from data/routines.ts

export const defaultThemeSettings: ThemeSettings = {
  primary: '#60a5fa', secondary: '#1e293b', accent: '#3b82f6', background: '#0a0f1c', card: '#161e31', text: '#f8fafc', textMuted: '#94a3b8', border: '#1e293b', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click'
};

export const initialThemeSettings: Record<string, ThemeSettings> = {
  light: { ...defaultThemeSettings, primary: '#3b82f6', background: '#f8fafc', card: '#ffffff', text: '#1e293b', textMuted: '#64748b', border: '#e2e8f0' },
  'theme-midnight': { ...defaultThemeSettings },
  'theme-glass': { ...defaultThemeSettings, primary: '#0ea5e9', background: '#f0f9ff', card: '#ffffff', text: '#0f172a', textMuted: '#64748b' },
  'theme-sunset': { ...defaultThemeSettings, primary: '#f97316', background: '#fff7ed', card: '#ffffff', text: '#431407', textMuted: '#9a3412' },
  'theme-forest': { ...defaultThemeSettings, primary: '#10b981', background: '#f0fdf4', card: '#ffffff', text: '#064e3b', textMuted: '#059669' },
  'theme-oled': { ...defaultThemeSettings, primary: '#ffffff', background: '#000000', card: '#000000', text: '#ffffff', textMuted: '#a3a3a3' },
  'theme-mecca-night': { ...defaultThemeSettings, primary: '#fbbf24', background: '#0c0714', card: '#160d24', text: '#f3e8ff', textMuted: '#a78bfa', border: '#2e1c4a', accent: '#ec4899', secondary: '#1e112c' },
  'theme-desert-starlight': { ...defaultThemeSettings, primary: '#38bdf8', background: '#150f0d', card: '#221815', text: '#fef3c7', textMuted: '#d97706', border: '#3c2b27', accent: '#f59e0b', secondary: '#271c19' },
  'theme-ramadan-lantern': { ...defaultThemeSettings, primary: '#f59e0b', background: '#170705', card: '#260c09', text: '#fef3c7', textMuted: '#f59e0b', border: '#3f1510', accent: '#10b981', secondary: '#2a0d0a' },
  'theme-rose-bloom': { ...defaultThemeSettings, primary: '#f472b6', background: '#0a110e', card: '#15241f', text: '#fce7f3', textMuted: '#34d399', border: '#20362f', accent: '#10b981', secondary: '#131f1a' },
  'theme-emerald-shine': { ...defaultThemeSettings, primary: '#fbbf24', background: '#021e10', card: '#05341c', text: '#e6fffa', textMuted: '#34d399', border: '#064e26', accent: '#fbbf24', secondary: '#032a17' },
  'theme-cyberpunk-zen': { ...defaultThemeSettings, primary: '#22d3ee', background: '#050508', card: '#0e0e16', text: '#e2e8f0', textMuted: '#f43f5e', border: '#1e1b4b', accent: '#ec4899', secondary: '#131322' },
  'theme-ocean-depth': { ...defaultThemeSettings, primary: '#06b6d4', background: '#040d1a', card: '#081930', text: '#e0f2fe', textMuted: '#06b6d4', border: '#0f2d54', accent: '#22d3ee', secondary: '#0b213f' },
  'theme-sakura-zen': { ...defaultThemeSettings, primary: '#db2777', background: '#fff1f2', card: '#ffffff', text: '#4c0519', textMuted: '#db2777', border: '#e2e8f0', accent: '#10b981', secondary: '#ffe4e6' },
  'theme-nordic-aurora': { ...defaultThemeSettings, primary: '#10b981', background: '#070e1b', card: '#0d172a', text: '#e2e8f0', textMuted: '#94a3b8', border: '#1e293b', accent: '#818cf8', secondary: '#0f1d36' },
  'theme-cosmic-nebula': { ...defaultThemeSettings, primary: '#8b5cf6', background: '#030206', card: '#0d0b14', text: '#faf5ff', textMuted: '#a78bfa', border: '#231c30', accent: '#ec4899', secondary: '#171223' },
  'theme-solar-flare': { ...defaultThemeSettings, primary: '#f97316', background: '#0a0908', card: '#141210', text: '#fffbeb', textMuted: '#f59e0b', border: '#27221d', accent: '#fbbf24', secondary: '#1d1a16' },
};

const getDefaultSessionMode = (): SessionMode => ({ type: 'free' });

const calculateStreakFromHistory = (records: DayRecord[]): number => {
  if (!records.length) return 0;
  const today = getTodayDate();
  const sorted = [...records].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  let currentDate = today;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const lastActive = sorted[0]?.date;
  if (!lastActive || (lastActive !== today && lastActive !== yesterdayStr)) return 0;
  currentDate = lastActive;
  for (const record of sorted) {
    if (record.date === currentDate) {
      streak++;
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      currentDate = d.toISOString().split('T')[0];
    } else { break; }
  }
  return streak;
};

let autoCountTimer: any = null;

// Perf: debounce widget IPC calls so Android bridge isn't hit on every tap
let _widgetSyncTimer: any = null;
const debouncedSyncWidget = (count: number, dhikrName: string) => {
  if (_widgetSyncTimer) clearTimeout(_widgetSyncTimer);
  _widgetSyncTimer = setTimeout(() => { syncWidget(count, dhikrName); _widgetSyncTimer = null; }, 400);
};

// Perf: only run achievement checks every N taps to avoid per-tap loops
let _tapCount = 0;
const ACHIEVEMENT_CHECK_EVERY = 10;

export const useTasbeehStore = create<TasbeehState>()(
  persist(
    (set, get) => ({
      count: 0, currentCount: 0, targetCount: 33, totalAllTime: 0, dailyRecords: [], dailyGoal: 100, dhikrs: defaultDhikrs, customDhikrs: [], currentDhikr: defaultDhikrs[0], favoriteDhikrIds: [], theme: 'theme-midnight', themeSettings: initialThemeSettings, language: 'en', showTransliteration: true, counterShape: 'bead-ring', countFontSize: 1, dhikrFontSize: 1, dhikrTextPosition: 'middle', verticalOffset: 0, dhikrVerticalOffset: 0, counterVerticalOffset: 0, counterScale: 1, zenMode: false, autoThemeSwitch: false, shakeToReset: false, syncPrayerTimes: null, wakeLockEnabled: true, volumeButtonCounting: false, lastSeenVersion: '0.0.0', hadithSlideDuration: 8, hadithSlidePosition: 'bottom', breathingGuideEnabled: false, breathingGuideSpeed: 4, streakDays: 0, lastActiveDate: null, longestStreak: 0, unlockedAchievements: [], screenOffMode: false, sessionStartTime: null, sessionMode: getDefaultSessionMode(), notificationPermission: 'default', reminderEnabled: false, reminderTime: '18:00', reminders: [
        { id: '1', time: '06:00', label: 'Fajr Dhikr', enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
        { id: '2', time: '13:00', label: 'Dhuhr Dhikr', enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
        { id: '3', time: '18:00', label: 'Maghrib Dhikr', enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
        { id: '4', time: '21:00', label: 'Evening Dhikr', enabled: true, days: [0, 1, 2, 3, 4, 5, 6] },
      ], lastCount: 0, lastDhikrId: '', canUndo: false,
      showCongrats: false, congratsData: null, totalHasanat: 0, showMoodTracker: false,
      autoCountActive: false, autoCountInterval: 1000,
      sessions: [],
      deviceUuid: '',
      personalBest: 0,
      // v2.1.0 new state
      hasSeenWelcome: false,
      ambientSoundType: 'none',
      ambientSoundVolume: 0.3,
      niyyah: '',
      sessionMoodRatings: [],
      voiceAnnouncementsEnabled: false,
      sessionTimerDuration: 0,
      sessionTimerActive: false,
      hapticPattern: 'default',
      autoStartPostPrayerTasbeeh: false,
      lazyDayRecoveryEnabled: true,
      niyyahPresets: [
        'For seeking forgiveness (Maghfirah)',
        'For inner peace and patience (Sabr)',
        'For gratitude (Shukr)',
        'For protection and well-being',
        'For parents and family',
        'For the Muslim Ummah'
      ],
      dedicatedCounts: {},
      customRoutines: [],
      favoriteDuaIds: [],

      saveActiveSession: () => {
        const state = get();
        if (state.currentCount > 0 && state.sessionStartTime) {
          const duration = Math.max(1, Math.round((Date.now() - state.sessionStartTime) / 1000));
          const avgSpeed = Math.round((state.currentCount / duration) * 60);
          const newSession: SessionRecord = {
            id: `session_${Date.now()}`,
            date: getTodayDate(),
            dhikrId: state.currentDhikr.id,
            count: state.currentCount,
            duration,
            avgSpeed,
            timestamp: Date.now()
          };
          const updatedSessions = [newSession, ...state.sessions].slice(0, 50);
          const newPersonalBest = state.currentCount > state.personalBest ? state.currentCount : state.personalBest;
          set({ sessions: updatedSessions, sessionStartTime: null, personalBest: newPersonalBest });
        } else {
          set({ sessionStartTime: null });
        }
      },

      // v2.1.0 new actions
      setHasSeenWelcome: (seen) => set({ hasSeenWelcome: seen }),
      setAmbientSound: (type, volume) => set((s) => ({ ambientSoundType: type, ambientSoundVolume: volume ?? s.ambientSoundVolume })),
      setAmbientSoundVolume: (volume) => set({ ambientSoundVolume: volume }),
      setNiyyah: (text) => set({ niyyah: text }),
      addMoodRating: (rating) => set((s) => ({ sessionMoodRatings: [{ ...rating, timestamp: Date.now() }, ...s.sessionMoodRatings].slice(0, 100) })),
      setVoiceAnnouncements: (enabled) => set({ voiceAnnouncementsEnabled: enabled }),
      setSessionTimerDuration: (seconds) => set({ sessionTimerDuration: seconds }),
      setSessionTimerActive: (active) => set({ sessionTimerActive: active }),
      setHapticPattern: (pattern) => set({ hapticPattern: pattern }),
      setAutoStartPostPrayerTasbeeh: (enabled) => set({ autoStartPostPrayerTasbeeh: enabled }),
      setLazyDayRecoveryEnabled: (enabled) => set({ lazyDayRecoveryEnabled: enabled }),
      setShowMoodTracker: (open) => set({ showMoodTracker: open }),

      addCustomRoutine: (routine) => set((s) => ({ customRoutines: [...s.customRoutines, { ...routine, id: `custom_routine_${Date.now()}` }] })),
      removeCustomRoutine: (id) => set((s) => ({ customRoutines: s.customRoutines.filter(r => r.id !== id) })),
      toggleFavoriteDua: (id) => set((s) => ({ favoriteDuaIds: s.favoriteDuaIds.includes(id) ? s.favoriteDuaIds.filter(fid => fid !== id) : [...s.favoriteDuaIds, id] })),
      incrementDedicatedCount: (name, count) => set((s) => {
        const current = s.dedicatedCounts[name] || 0;
        return { dedicatedCounts: { ...s.dedicatedCounts, [name]: current + count } };
      }),

      increment: () => {
        const state = get();
        const now = Date.now();
        const today = getTodayDate();
        const currentSettings = state.themeSettings[state.theme] || defaultThemeSettings;

        const newCount = state.currentCount + 1;
        const newTotal = state.totalAllTime + 1;
        const newHasanat = state.totalHasanat + 10;
        let records = state.dailyRecords;
        const todayIdx = records.findIndex(r => r.date === today);

        // Extended haptic vibration patterns at completion milestones
        if (currentSettings.hapticEnabled) {
          try {
            if (newCount === 33) {
              Haptics.vibrate({ duration: 120 });
              setTimeout(() => { try { Haptics.vibrate({ duration: 120 }); } catch {} }, 250);
            } else if (newCount === 99) {
              Haptics.vibrate({ duration: 200 });
              setTimeout(() => { try { Haptics.vibrate({ duration: 200 }); } catch {} }, 350);
            } else if (newCount === 100) {
              Haptics.vibrate({ duration: 400 });
            } else {
              Haptics.impact({ style: ImpactStyle.Light });
            }
          } catch { /* ignore on web */ }

          if (navigator.vibrate) {
            if (newCount === 33) {
              navigator.vibrate([120, 100, 120]);
            } else if (newCount === 99) {
              navigator.vibrate([200, 100, 200]);
            } else if (newCount === 100) {
              navigator.vibrate(400);
            } else {
              navigator.vibrate(currentSettings.vibrationIntensity || 50);
            }
          }
        }

        if (todayIdx > -1) {
          // Mutate in place to avoid expensive array cloning on every tap
          records[todayIdx].totalCount += 1;
          records[todayIdx].counts[state.currentDhikr.id] = (records[todayIdx].counts[state.currentDhikr.id] || 0) + 1;
        } else {
          records = [...records, { date: today, totalCount: 1, counts: { [state.currentDhikr.id]: 1 } }];
          setTimeout(() => get().updateStreak(), 0);
        }

        const sessionMode = state.sessionMode;
        if (sessionMode.type === 'tasbih100') {
          const mode = sessionMode; 
          const phaseTarget = [33, 33, 33, 1][mode.currentPhase];
          if (newCount >= phaseTarget && mode.currentPhase < 3) {
            const nextPhase = mode.currentPhase + 1;
            const ritualDhikrIds = ['subahanallah', 'alhamdulillah', 'allahuakbar', 'la-ilaha-illallah'];
            const nextDhikrId = ritualDhikrIds[nextPhase];
            const nextDhikr = state.dhikrs.find(d => d.id === nextDhikrId) || defaultDhikrs[0];

            const newSessionMode: SessionMode = {
              ...mode,
              currentPhase: nextPhase,
              phaseCounts: mode.phaseCounts.map((c, i) => i === mode.currentPhase ? newCount : c)
            };
            set({ currentCount: 0, currentDhikr: nextDhikr, targetCount: [33, 33, 33, 1][nextPhase], sessionMode: newSessionMode });
            syncWidget(0, nextDhikr.transliteration);
            return;
          } else if (mode.currentPhase === 3 && newCount >= 1 && !mode.isComplete) {
             set({ currentCount: newCount, totalAllTime: newTotal, totalHasanat: newHasanat + 1000, dailyRecords: records, sessionStartTime: state.sessionStartTime || now, sessionMode: { ...mode, isComplete: true }, lastCount: state.currentCount, lastDhikrId: state.currentDhikr.id, canUndo: true });
             get().saveActiveSession();
             get().triggerCongrats({
               title: "MashaAllah!",
               description: "You have completed the 100 Tasbeeh session. May Allah accept your dhikr.",
               hasanatEarned: 1000
             });
             syncWidget(newCount, state.currentDhikr.transliteration);
             get().checkAchievements();
             return;
          }
        } else if (sessionMode.type === 'tasbih1000') {
          const mode = sessionMode;
          const phaseTarget = [333, 333, 333, 1][mode.currentPhase];
          if (newCount >= phaseTarget && mode.currentPhase < 3) {
            const nextPhase = mode.currentPhase + 1;
            const nextDhikr = state.dhikrs.find(d => d.id === 'allahuma-sali') || defaultDhikrs[5];

            const newSessionMode: SessionMode = {
              ...mode,
              currentPhase: nextPhase,
              phaseCounts: mode.phaseCounts.map((c, i) => i === mode.currentPhase ? newCount : c)
            };
            set({ currentCount: 0, currentDhikr: nextDhikr, targetCount: [333, 333, 333, 1][nextPhase], sessionMode: newSessionMode });
            syncWidget(0, nextDhikr.transliteration);
            return;
          } else if (mode.currentPhase === 3 && newCount >= 1 && !mode.isComplete) {
            set({ currentCount: newCount, totalAllTime: newTotal, totalHasanat: newHasanat + 10000, dailyRecords: records, sessionStartTime: state.sessionStartTime || now, sessionMode: { ...mode, isComplete: true }, lastCount: state.currentCount, lastDhikrId: state.currentDhikr.id, canUndo: true });
            get().saveActiveSession();
            get().triggerCongrats({
              title: "MashaAllah!",
              description: "You have completed the 1000 Tasbeeh session. May Allah reward you immensely.",
              hasanatEarned: 10000
            });
            syncWidget(newCount, state.currentDhikr.transliteration);
            get().checkAchievements();
            return;
          }
        } else if (sessionMode.type === 'routine') {
          const mode = sessionMode;
          const currentStep = mode.steps[mode.currentStepIndex];
          if (newCount >= currentStep.target) {
            const nextIndex = mode.currentStepIndex + 1;
            if (nextIndex < mode.steps.length) {
              const nextStep = mode.steps[nextIndex];
              const nextDhikr = state.dhikrs.find(d => d.id === nextStep.dhikrId) || state.customDhikrs.find(d => d.id === nextStep.dhikrId) || defaultDhikrs[0];
              set({
                currentCount: 0,
                currentDhikr: nextDhikr,
                targetCount: nextStep.target,
                sessionMode: { ...mode, currentStepIndex: nextIndex }
              });
              syncWidget(0, nextDhikr.transliteration);
              return;
            } else if (!mode.isComplete) {
              set({ currentCount: newCount, totalAllTime: newTotal, totalHasanat: newHasanat + 1000, dailyRecords: records, sessionMode: { ...mode, isComplete: true } });
              get().saveActiveSession();
              syncWidget(newCount, state.currentDhikr.transliteration);
              get().checkAchievements();
              return;
            }
          }
        }

        // Handle general completion if targetCount resides in any other session mode
        if (state.targetCount > 0 && newCount >= state.targetCount && sessionMode.type === 'free') {
          set({ currentCount: newCount, totalAllTime: newTotal, totalHasanat: newHasanat + (state.targetCount * 10), dailyRecords: records, sessionStartTime: state.sessionStartTime || now, sessionMode, lastCount: state.currentCount, lastDhikrId: state.currentDhikr.id, canUndo: true });
          get().saveActiveSession();
          syncWidget(newCount, state.currentDhikr.transliteration);
          get().checkAchievements();
          return;
        }

        set({ currentCount: newCount, totalAllTime: newTotal, totalHasanat: newHasanat, dailyRecords: records, sessionStartTime: state.sessionStartTime || now, sessionMode, lastCount: state.currentCount, lastDhikrId: state.currentDhikr.id, canUndo: true });
        debouncedSyncWidget(newCount, state.currentDhikr.transliteration);
        _tapCount++;
        if (_tapCount % ACHIEVEMENT_CHECK_EVERY === 0) get().checkAchievements();
      },

      decrement: () => set((state) => {
        const decCount = Math.max(0, state.currentCount - 1);
        syncWidget(decCount, state.currentDhikr.transliteration);
        return { currentCount: decCount };
      }),
      reset: () => {
        const state = get();
        state.saveActiveSession();
        const currentSettings = state.themeSettings[state.theme] || defaultThemeSettings;
        if (currentSettings.hapticEnabled) {
          try { Haptics.impact({ style: ImpactStyle.Heavy }); } catch { /* ignore */ }
          if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        }
        if (state.sessionMode.type === 'tasbih100') {
          set({ currentCount: 0, sessionStartTime: null, sessionMode: { type: 'tasbih100', currentPhase: 0, phaseCounts: [0, 0, 0, 0], isComplete: false, challengeId: state.sessionMode.challengeId }, currentDhikr: defaultDhikrs[0] });
          syncWidget(0, defaultDhikrs[0].transliteration);
        } else if (state.sessionMode.type === 'tasbih1000') {
          set({ currentCount: 0, sessionStartTime: null, sessionMode: { type: 'tasbih1000', currentPhase: 0, phaseCounts: [0, 0, 0, 0], isComplete: false, challengeId: state.sessionMode.challengeId }, currentDhikr: defaultDhikrs[0], targetCount: 333 });
          syncWidget(0, defaultDhikrs[0].transliteration);
        } else { 
          set({ currentCount: 0, sessionStartTime: null }); 
          syncWidget(0, state.currentDhikr.transliteration);
        }
      },
      setDhikr: (dhikr) => {
        get().saveActiveSession();
        set({ currentDhikr: dhikr, currentCount: 0, sessionStartTime: null });
        syncWidget(0, dhikr.transliteration);
      },
      setTarget: (target) => set((state) => ({ targetCount: target, sessionMode: { type: 'free' }, currentCount: state.sessionMode.type === 'free' ? state.currentCount : 0, sessionStartTime: state.sessionMode.type === 'free' ? state.sessionStartTime : null })),
      toggleTransliteration: () => set((state) => ({ showTransliteration: !state.showTransliteration })),
      setTheme: (theme) => set({ theme }),
      setThemeSettings: (theme, settings) => set((state) => ({ themeSettings: { ...state.themeSettings, [theme]: { ...state.themeSettings[theme], ...settings } } })),
      setLanguage: (language) => set({ language }),
      addCustomDhikr: (dhikr) => set((state) => ({ customDhikrs: [...state.customDhikrs, { ...dhikr, id: `custom_${Date.now()}` }] })),
      removeCustomDhikr: (id) => set((state) => ({ customDhikrs: state.customDhikrs.filter(d => d.id !== id), currentDhikr: state.currentDhikr.id === id ? state.dhikrs[0] : state.currentDhikr })),
      toggleFavorite: (id) => set((state) => ({ favoriteDhikrIds: state.favoriteDhikrIds.includes(id) ? state.favoriteDhikrIds.filter(fid => fid !== id) : [...state.favoriteDhikrIds, id] })),
      clearAllData: () => set({ currentCount: 0, dailyRecords: [], totalAllTime: 0, customDhikrs: [], sessions: [], sessionStartTime: null, streakDays: 0, lastActiveDate: null, longestStreak: 0, unlockedAchievements: [], sessionMode: getDefaultSessionMode() }),
      resetSettings: () => set({ themeSettings: initialThemeSettings, theme: 'light', counterShape: 'minimal', showTransliteration: true }),
      setCounterShape: (shape) => set({ counterShape: shape }),
      setHadithSlideDuration: (duration) => set({ hadithSlideDuration: duration }),
      setHadithSlidePosition: (position) => set({ hadithSlidePosition: position }),
      setDeviceUuid: (uuid) => set({ deviceUuid: uuid }),
      setScreenOffMode: (enabled) => set({ screenOffMode: enabled }),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      setVerticalOffset: (offset) => set({ verticalOffset: offset }),
      setDhikrVerticalOffset: (offset) => set({ dhikrVerticalOffset: offset }),
      setCounterVerticalOffset: (offset) => set({ counterVerticalOffset: offset }),
      setCounterScale: (scale) => set({ counterScale: scale }),
      setCountFontSize: (scale) => set({ countFontSize: scale }),
      setDhikrFontSize: (scale) => set({ dhikrFontSize: scale }),
      setDhikrTextPosition: (pos) => set({ dhikrTextPosition: pos }),
      setZenMode: (enabled) => set({ zenMode: enabled }),
      setBreathingGuide: (enabled) => set({ breathingGuideEnabled: enabled }),
      setBreathingGuideSpeed: (speed) => set({ breathingGuideSpeed: speed }),
      toggleHaptic: () => set((state) => ({ themeSettings: { ...state.themeSettings, [state.theme]: { ...state.themeSettings[state.theme], hapticEnabled: !state.themeSettings[state.theme].hapticEnabled } } })),
      toggleSound: () => set((state) => ({ themeSettings: { ...state.themeSettings, [state.theme]: { ...state.themeSettings[state.theme], soundEnabled: !state.themeSettings[state.theme].soundEnabled } } })),
      setVibrationIntensity: (intensity) => set((state) => ({ themeSettings: { ...state.themeSettings, [state.theme]: { ...state.themeSettings[state.theme], vibrationIntensity: intensity } } })),
      setFontScale: (scale) => set((state) => ({ themeSettings: { ...state.themeSettings, [state.theme]: { ...state.themeSettings[state.theme], fontScale: scale } } })),
      setSoundType: (type) => set((state) => ({ themeSettings: { ...state.themeSettings, [state.theme]: { ...state.themeSettings[state.theme], soundType: type } } })),
      exportData: () => JSON.stringify({ dailyRecords: get().dailyRecords, totalAllTime: get().totalAllTime, customDhikrs: get().customDhikrs, streakDays: get().streakDays, settings: { counterShape: get().counterShape, target: get().targetCount, themeSettings: get().themeSettings } }),
      importData: (data) => {
        try {
          const p = JSON.parse(data);
          set(s => ({
            ...s,
            ...p,
            theme: p.settings?.theme || s.theme,
            counterShape: p.settings?.counterShape || s.counterShape,
            themeSettings: p.settings?.themeSettings || s.themeSettings
          }));
          get().checkAchievements();
          return true;
        } catch {
          return false;
        }
      },
      startTasbih100: (challengeId) => {
        get().saveActiveSession();
        set({ sessionMode: { type: 'tasbih100', currentPhase: 0, phaseCounts: [0, 0, 0, 0], isComplete: false, challengeId }, currentDhikr: defaultDhikrs[0], currentCount: 0, targetCount: 33, sessionStartTime: Date.now() });
        syncWidget(0, defaultDhikrs[0].transliteration);
      },
      startTasbih1000: (challengeId) => {
        get().saveActiveSession();
        const dhikr = get().dhikrs.find(d => d.id === 'allahuma-sali') || defaultDhikrs[5];
        set({ sessionMode: { type: 'tasbih1000', currentPhase: 0, phaseCounts: [0, 0, 0, 0], isComplete: false, challengeId }, currentDhikr: dhikr, currentCount: 0, targetCount: 333, sessionStartTime: Date.now() });
        syncWidget(0, dhikr.transliteration);
      },
      startLaIlahaWahdahu100: () => {
        const dhikr = get().dhikrs.find(d => d.id === 'la_ilaha_wahdahu') || defaultDhikrs[8];
        set({ sessionMode: { type: 'free' }, currentDhikr: dhikr, currentCount: 0, targetCount: 100, sessionStartTime: Date.now() });
        syncWidget(0, dhikr.transliteration);
      },
      startAstaghfirullah100: () => {
        const dhikr = get().dhikrs.find(d => d.id === 'astaghfirullah_atubu') || defaultDhikrs[9];
        set({ sessionMode: { type: 'free' }, currentDhikr: dhikr, currentCount: 0, targetCount: 100, sessionStartTime: Date.now() });
        syncWidget(0, dhikr.transliteration);
      },
      startRoutine: (routineId) => {
        get().saveActiveSession();
        const r = defaultRoutines.find(rou => rou.id === routineId) || get().customRoutines.find(rou => rou.id === routineId); if (!r) return;
        const step = r.steps[0]; const d = get().dhikrs.find(dh => dh.id === step.dhikrId) || get().customDhikrs.find(dh => dh.id === step.dhikrId) || defaultDhikrs[0];
        set({ sessionMode: { type: 'routine', routineId, currentStepIndex: 0, steps: r.steps, isComplete: false }, currentDhikr: d, currentCount: 0, targetCount: step.target, sessionStartTime: Date.now() });
        syncWidget(0, d.transliteration);
      },
      nextRoutineStep: () => {
        const s = get(); if (s.sessionMode.type !== 'routine') return;
        const nIndex = s.sessionMode.currentStepIndex + 1;
        if (nIndex < s.sessionMode.steps.length) {
          const nStep = s.sessionMode.steps[nIndex]; const d = s.dhikrs.find(dh => dh.id === nStep.dhikrId) || defaultDhikrs[0];
          set({ sessionMode: { ...s.sessionMode, currentStepIndex: nIndex }, currentDhikr: d, currentCount: 0, targetCount: nStep.target });
          syncWidget(0, d.transliteration);
        } else { 
          set({ sessionMode: { ...s.sessionMode, isComplete: true } }); 
        }
      },
      exitSessionMode: () => {
        get().saveActiveSession();
        set({ sessionMode: getDefaultSessionMode(), currentCount: 0, sessionStartTime: null });
        syncWidget(0, get().currentDhikr.transliteration);
      },
      undo: () => {
        const s = get(); if (!s.canUndo) return;
        const d = s.dhikrs.find(dh => dh.id === s.lastDhikrId) || s.customDhikrs.find(dh => dh.id === s.lastDhikrId) || s.currentDhikr;
        set({ currentCount: s.lastCount, currentDhikr: d, canUndo: false });
        const settings = s.themeSettings[s.theme] || defaultThemeSettings; if (settings.hapticEnabled && navigator.vibrate) navigator.vibrate([20, 50, 20]);
        syncWidget(s.lastCount, d.transliteration);
      },
      setAutoThemeSwitch: (e) => set({ autoThemeSwitch: e }),
      setShakeToReset: (e) => set({ shakeToReset: e }),
      setSyncPrayerTimes: (e) => set({ syncPrayerTimes: e }),
      setWakeLockEnabled: (e) => set({ wakeLockEnabled: e }),
      setVolumeButtonCounting: (e) => set({ volumeButtonCounting: e }),
      setLastSeenVersion: (v) => set({ lastSeenVersion: v }),
      setNotificationPermission: (p) => set({ notificationPermission: p }),
      setReminderEnabled: (e) => {
        set({ reminderEnabled: e });
        NotificationManager.syncReminders(get().reminders, e);
      },
      setReminderTime: (t) => set({ reminderTime: t }),
      addReminder: (r) => {
        const id = Date.now().toString();
        set((s) => {
          const updated = [...s.reminders, { ...r, id }];
          NotificationManager.syncReminders(updated, s.reminderEnabled);
          return { reminders: updated };
        });
      },
      removeReminder: (id) => {
        set((s) => {
          const updated = s.reminders.filter(rem => rem.id !== id);
          NotificationManager.syncReminders(updated, s.reminderEnabled);
          return { reminders: updated };
        });
      },
      toggleReminder: (id) => {
        set((s) => {
          const updated = s.reminders.map(rem => rem.id === id ? { ...rem, enabled: !rem.enabled } : rem);
          NotificationManager.syncReminders(updated, s.reminderEnabled);
          return { reminders: updated };
        });
      },
      updateReminder: (id, r) => {
        set((s) => {
          const updated = s.reminders.map(rem => rem.id === id ? { ...rem, ...r } : rem);
          NotificationManager.syncReminders(updated, s.reminderEnabled);
          return { reminders: updated };
        });
      },
      startAutoCount: () => {
        const state = get();
        if (state.autoCountActive) return;
        set({ autoCountActive: true });
        const tick = () => {
          if (get().autoCountActive) {
            get().increment();
            autoCountTimer = setTimeout(tick, get().autoCountInterval);
          }
        };
        autoCountTimer = setTimeout(tick, state.autoCountInterval);
      },
      stopAutoCount: () => {
        if (autoCountTimer) {
          clearTimeout(autoCountTimer);
          autoCountTimer = null;
        }
        set({ autoCountActive: false });
      },
      setAutoCountInterval: (ms: number) => {
        set({ autoCountInterval: ms });
        if (get().autoCountActive) {
          get().stopAutoCount();
          get().startAutoCount();
        }
      },
      switchDhikr: () => {
        const s = get();
        const pool = [...s.dhikrs, ...s.customDhikrs].filter(d => d.id !== s.currentDhikr.id);
        if (pool.length > 0) {
          const next = pool[Math.floor(Math.random() * pool.length)];
          set({ currentDhikr: next, currentCount: 0, sessionStartTime: null, sessionMode: getDefaultSessionMode() });
          syncWidget(0, next.transliteration);
        } else {
          set({ currentCount: 0, sessionStartTime: null, sessionMode: getDefaultSessionMode() });
          syncWidget(0, s.currentDhikr.transliteration);
        }
      },
      triggerCongrats: (data) => set((s) => ({ showCongrats: true, congratsData: data, totalHasanat: s.totalHasanat + data.hasanatEarned })),
      closeCongrats: () => set({ showCongrats: false, congratsData: null }),
      updateStreak: () => {
        const today = getTodayDate(); const state = get(); if (state.lastActiveDate === today) return;
        const yest = new Date(); yest.setDate(yest.getDate() - 1); const yestStr = yest.toISOString().split('T')[0];
        let nStreak = state.streakDays; if (state.lastActiveDate === yestStr) nStreak += 1; else if (state.lastActiveDate !== today) nStreak = 1;
        set({ streakDays: nStreak, lastActiveDate: today, longestStreak: Math.max(state.longestStreak, nStreak) });
        get().checkAchievements();
      },
      checkAchievements: () => {
        const state = get();
        const today = getTodayDate();
        const todayRecord = state.dailyRecords.find(r => r.date === today);
        const todayCount = todayRecord ? todayRecord.totalCount : 0;
        const dailyProgress = state.dailyGoal > 0 ? (todayCount / state.dailyGoal) : 0;
        const isFriday = new Date().getDay() === 5;

        // Extended statistics for achievements
        const totalDuration = (state.sessions || []).reduce((sum, s) => sum + s.duration, 0);
        const maxSpeed = Math.max(...(state.sessions || []).map(s => s.avgSpeed), 0);
        const distinctDhikrsCount = new Set((state.sessions || []).map(s => s.dhikrId)).size;
        
        let sameDhikrStreak = 0;
        if (state.sessions && state.sessions.length > 0) {
          const sessionsSorted = [...state.sessions].sort((a, b) => b.timestamp - a.timestamp);
          const lastDhikr = sessionsSorted[0].dhikrId;
          const lastDhikrDates = new Set(sessionsSorted.filter(s => s.dhikrId === lastDhikr).map(s => s.date));
          sameDhikrStreak = lastDhikrDates.size;
        }

        const stateProxy = {
          totalCount: state.totalAllTime,
          streakDays: state.streakDays || 0,
          currentCount: state.currentCount || 0,
          dailyProgress,
          isFriday,
          isDawn: new Date().getHours() >= 4 && new Date().getHours() < 6,
          isNight: new Date().getHours() >= 23 || new Date().getHours() < 4,
          maxSpeed,
          distinctDhikrsCount,
          sameDhikrStreak,
          totalDuration,
        };

        const newlyUnlocked: string[] = [];
        const currentUnlocked = state.unlockedAchievements || [];

        achievements.forEach((ach) => {
          if (!currentUnlocked.includes(ach.id) && ach.condition(stateProxy)) {
            newlyUnlocked.push(ach.id);
          }
        });

        if (newlyUnlocked.length > 0) {
          const updated = [...currentUnlocked, ...newlyUnlocked];
          set({ unlockedAchievements: updated });
          
          newlyUnlocked.forEach((id) => {
            const ach = achievements.find(a => a.id === id);
            if (ach) {
              toast.success(`Award Unlocked: ${ach.title}! 🏆`, {
                description: ach.description,
                duration: 5000,
              });
            }
          });
        }
      },
    }),
    {
      name: 'tasbeeh-storage',
      storage: createJSONStorage(() => debouncedStorage),
      version: 2,
      migrate: (persistedState: any, version: number) => {
        let state = persistedState;
        if (version === 0) {
          const history = state.dailyRecords || [];
          const streak = calculateStreakFromHistory(history);
          state = { ...state, streakDays: streak, longestStreak: streak, favoriteDhikrIds: state.favoriteDhikrIds || [], dailyGoal: state.dailyGoal || 100 };
        }
        if (version < 2) {
          // Ensure themeSettings are fully populated and new states exist
          const repairedSettings = { ...initialThemeSettings, ...state.themeSettings };
          state = { 
            ...state, 
            themeSettings: repairedSettings,
            showCongrats: false,
            congratsData: null
          };
        }
        // v2.1.0 migration: inject new fields with defaults if missing
        state = {
          hasSeenWelcome: false,
          ambientSoundType: 'none',
          ambientSoundVolume: 0.3,
          niyyah: '',
          sessionMoodRatings: [],
          voiceAnnouncementsEnabled: false,
          sessionTimerDuration: 0,
          sessionTimerActive: false,
          hapticPattern: 'default',
          autoStartPostPrayerTasbeeh: false,
          niyyahPresets: [
            'For seeking forgiveness (Maghfirah)',
            'For inner peace and patience (Sabr)',
            'For gratitude (Shukr)',
            'For protection and well-being',
            'For parents and family',
            'For the Muslim Ummah'
          ],
          dedicatedCounts: {},
          customRoutines: [],
          favoriteDuaIds: [],
          ...state,
        };
        return state as TasbeehState;
      },
      partialize: (state) => ({
        currentDhikr: state.currentDhikr, currentCount: state.currentCount, targetCount: state.targetCount, showTransliteration: state.showTransliteration, themeSettings: state.themeSettings, theme: state.theme, language: state.language, zenMode: state.zenMode, counterShape: state.counterShape, hadithSlideDuration: state.hadithSlideDuration, hadithSlidePosition: state.hadithSlidePosition, dhikrTextPosition: state.dhikrTextPosition, verticalOffset: state.verticalOffset, dhikrVerticalOffset: state.dhikrVerticalOffset, counterVerticalOffset: state.counterVerticalOffset, counterScale: state.counterScale, countFontSize: state.countFontSize, dhikrFontSize: state.dhikrFontSize, dailyRecords: state.dailyRecords, totalAllTime: state.totalAllTime, totalHasanat: state.totalHasanat, customDhikrs: state.customDhikrs, streakDays: state.streakDays, lastActiveDate: state.lastActiveDate, longestStreak: state.longestStreak, sessionMode: state.sessionMode, dailyGoal: state.dailyGoal, favoriteDhikrIds: state.favoriteDhikrIds, lastSeenVersion: state.lastSeenVersion, autoThemeSwitch: state.autoThemeSwitch, shakeToReset: state.shakeToReset, syncPrayerTimes: state.syncPrayerTimes, wakeLockEnabled: state.wakeLockEnabled, volumeButtonCounting: state.volumeButtonCounting, unlockedAchievements: state.unlockedAchievements, screenOffMode: state.screenOffMode, notificationPermission: state.notificationPermission, reminderEnabled: state.reminderEnabled, reminderTime: state.reminderTime, reminders: state.reminders, autoCountInterval: state.autoCountInterval,
        sessions: state.sessions, deviceUuid: state.deviceUuid,
        // v2.1.0 persisted fields
        hasSeenWelcome: state.hasSeenWelcome, ambientSoundType: state.ambientSoundType, ambientSoundVolume: state.ambientSoundVolume, niyyah: state.niyyah, sessionMoodRatings: state.sessionMoodRatings, voiceAnnouncementsEnabled: state.voiceAnnouncementsEnabled, sessionTimerDuration: state.sessionTimerDuration, hapticPattern: state.hapticPattern,
        autoStartPostPrayerTasbeeh: state.autoStartPostPrayerTasbeeh,
        niyyahPresets: state.niyyahPresets,
        dedicatedCounts: state.dedicatedCounts,
        customRoutines: state.customRoutines,
        favoriteDuaIds: state.favoriteDuaIds,
      }),
    }
  )
);
