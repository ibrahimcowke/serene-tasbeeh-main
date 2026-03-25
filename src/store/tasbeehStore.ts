import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { counterShapes } from '@/lib/constants';

const getTodayDate = () => new Date().toISOString().split('T')[0];

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
  | 'theme-oled' | 'theme-mecca-night' | 'theme-medina-rose' | 'theme-blue-mosque'
  | 'theme-sahara-warmth' | 'theme-andalusia-earth' | 'theme-taj-marble'
  | 'theme-royal-persian' | 'theme-ramadan-lantern';

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

export type CounterShape =
  | 'plain' | 'minimal' | 'classic' | 'beads' | 'flower' | 'waveform' | 'digital'
  | 'modern-ring' | 'vintage-wood' | 'geometric-star' | 'fluid' | 'radar'
  | 'real-beads' | 'glass-orb' | 'portal-depth' | 'luminous-ring'
  | 'ring-light' | 'steampunk-nixie' | 'biolum-organic'
  | 'solar-flare' | 'nebula-cloud' | 'infinite-knot'
  | 'holo-fan'
  | 'animated-ripple' | 'bead-ring' | 'halo-ring' | 'vertical-capsules' | 'luminous-beads'
  | 'helix-strand' | 'cyber-hexagon' | 'glass-pill' | 'emerald-loop'
  | 'smart-ring' | 'moon-phase' | 'water-ripple' | 'sand-hourglass' | 'lantern-fanous'
  | 'digital-watch' | 'star-burst' | 'crystal-prism' | 'tally-clicker'
  | 'cyber-3d' | 'crystal-iso' | 'neumorph'
  | 'sunset-horizon' | 'retro-lcd';

interface TasbeehState {
  // Counts
  count: number; // Legacy, keep for migration
  currentCount: number;
  targetCount: number;
  totalAllTime: number;
  dailyRecords: DayRecord[];
  dailyGoal: number;

  // Dhikr
  currentDhikr: Dhikr;
  dhikrs: Dhikr[];
  customDhikrs: Dhikr[];
  favoriteDhikrIds: string[];

  // Settings
  theme: ThemeType;
  themeSettings: Record<string, ThemeSettings>;
  language: string;
  showTransliteration: boolean;
  counterShape: CounterShape;
  countFontSize: number;
  dhikrTextPosition: 'top' | 'middle' | 'bottom' | 'none';
  verticalOffset: number;
  dhikrVerticalOffset: number;
  counterVerticalOffset: number;
  counterScale: number;
  zenMode: boolean;
  autoThemeSwitch: boolean;
  shakeToReset: boolean;
  wakeLockEnabled: boolean;
  volumeButtonCounting: boolean;
  lastSeenVersion: string;

  // Appearance & Behavior
  hadithSlideDuration: number;
  hadithSlidePosition: 'top' | 'bottom' | 'none';
  breathingGuideEnabled: boolean;
  breathingGuideSpeed: number;

  // Experience
  streakDays: number;
  lastActiveDate: string | null;
  longestStreak: number;
  unlockedAchievements: string[];
  screenOffMode: boolean; // Keep screen on during active session

  // Session
  sessionStartTime: number | null;
  sessionMode: SessionMode;

  // Notification Status
  notificationPermission: NotificationPermission | 'not-supported';
  reminderEnabled: boolean;
  reminderTime: string; // "HH:mm"

  // Quick Undo
  lastCount: number;
  lastDhikrId: string;
  canUndo: boolean;

  // Actions
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
  setCounterShape: (shape: CounterShape) => void;
  setHadithSlideDuration: (duration: number) => void;
  setHadithSlidePosition: (position: 'top' | 'bottom' | 'none') => void;
  setDailyGoal: (goal: number) => void;
  setVerticalOffset: (offset: number) => void;
  setDhikrVerticalOffset: (offset: number) => void;
  setCounterVerticalOffset: (offset: number) => void;
  setCounterScale: (scale: number) => void;
  setCountFontSize: (scale: number) => void;
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
  startRoutine: (routineId: string) => void;
  nextRoutineStep: () => void;
  exitSessionMode: () => void;
  undo: () => void;
  setAutoThemeSwitch: (enabled: boolean) => void;
  setShakeToReset: (enabled: boolean) => void;
  setWakeLockEnabled: (enabled: boolean) => void;
  setVolumeButtonCounting: (enabled: boolean) => void;
  setLastSeenVersion: (version: string) => void;
  setNotificationPermission: (perm: NotificationPermission | 'not-supported') => void;
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
  updateStreak: () => void;
}

export type SessionMode =
  | { type: 'free' }
  | { type: 'tasbih100'; currentPhase: number; phaseCounts: number[]; isComplete: boolean; challengeId?: string }
  | { type: 'tasbih1000'; currentPhase: number; currentSetCount: number; isComplete: boolean; challengeId?: string }
  | { type: 'routine'; routineId: string; currentStepIndex: number; steps: RoutineStep[]; isComplete: boolean };

export interface RoutineStep {
  dhikrId: string;
  target: number;
}

export const defaultDhikrs: Dhikr[] = [
  { id: 'subahanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', transliteration: 'Subhan-Allah', translation: 'Glory be to Allah' },
  { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', transliteration: 'Alhamdulillah', translation: 'Praise be to Allah' },
  { id: 'allahuakbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest' },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', transliteration: 'Astaghfirullah', translation: 'I seek forgiveness from Allah' },
  { id: 'la-ilaha-illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', transliteration: 'La ilaha illallah', translation: 'There is no god but Allah' },
  { id: 'allahuma-sali', arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ', transliteration: 'Allahumma Salli Ala Sayyidina Muhammad', translation: 'O Allah, send blessings upon our Master Muhammad' },
];

const defaultRoutines = [
  {
    id: 'post-prayer',
    label: 'After Prayer',
    steps: [
      { dhikrId: 'subahanallah', target: 33 },
      { dhikrId: 'alhamdulillah', target: 33 },
      { dhikrId: 'allahuakbar', target: 34 }
    ]
  }
];

const defaultThemeSettings: ThemeSettings = {
  primary: '#60a5fa',
  secondary: '#1e293b',
  accent: '#3b82f6',
  background: '#0a0f1c',
  card: '#161e31',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  border: '#1e293b',
  hapticEnabled: true,
  soundEnabled: true,
  vibrationIntensity: 50,
  fontScale: 1,
  soundType: 'click'
};

const initialThemeSettings: Record<string, ThemeSettings> = {
  light: { ...defaultThemeSettings, primary: '#3b82f6', background: '#f8fafc', card: '#ffffff', text: '#1e293b', textMuted: '#64748b', border: '#e2e8f0' },
  'theme-midnight': { ...defaultThemeSettings },
  'theme-biolum': { ...defaultThemeSettings, primary: '#2dd4bf', background: '#020617', card: '#0f172a', text: '#ccfbf1', textMuted: '#5eead4' },
  'theme-green': { ...defaultThemeSettings, primary: '#22c55e', background: '#050505', card: '#0a0a0a', text: '#dcfce7', textMuted: '#4ade80' },
  'theme-oled': { ...defaultThemeSettings, primary: '#ffffff', background: '#000000', card: '#000000', text: '#ffffff', textMuted: '#a3a3a3' },
  'theme-mecca-night': { primary: '#fbbf24', background: '#050505', card: '#0f0f0f', text: '#ffffff', textMuted: '#a1a1aa', secondary: '#18181b', accent: '#f59e0b', border: '#27272a', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click' },
  'theme-medina-rose': { primary: '#ec4899', background: '#fdf2f8', card: '#ffffff', text: '#1e293b', textMuted: '#64748b', secondary: '#fbcfe8', accent: '#db2777', border: '#fae8f0', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click' },
  'theme-blue-mosque': { primary: '#0ea5e9', background: '#f0f9ff', card: '#ffffff', text: '#0f172a', textMuted: '#64748b', secondary: '#bae6fd', accent: '#0284c7', border: '#e0f2fe', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click' },
  'theme-desert-starlight': { primary: '#818cf8', background: '#0f172a', card: '#1e293b', text: '#f1f5f9', textMuted: '#94a3b8', secondary: '#312e81', accent: '#6366f1', border: '#334155', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click' },
  'theme-sahara-warmth': { primary: '#f97316', background: '#fff7ed', card: '#ffffff', text: '#431407', textMuted: '#9a3412', secondary: '#fed7aa', accent: '#ea580c', border: '#ffedd5', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click' },
  'theme-andalusia-earth': { primary: '#10b981', background: '#f0fdf4', card: '#ffffff', text: '#064e3b', textMuted: '#059669', secondary: '#bbf7d0', accent: '#059669', border: '#dcfce7', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click' },
  'theme-istanbul-sunset': { primary: '#d946ef', background: '#fdf4ff', card: '#ffffff', text: '#4a044e', textMuted: '#c026d3', secondary: '#fae8ff', accent: '#c026d3', border: '#f5d0fe', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click' },
  'theme-taj-marble': { primary: '#71717a', background: '#fafafa', card: '#ffffff', text: '#18181b', textMuted: '#71717a', secondary: '#f4f4f5', accent: '#52525b', border: '#e4e4e7', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click' },
  'theme-royal-persian': { primary: '#0d9488', background: '#f0fdfa', card: '#ffffff', text: '#134e4a', textMuted: '#0d9488', secondary: '#ccfbf1', accent: '#0f766e', border: '#99f6e4', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click' },
  'theme-ramadan-lantern': { primary: '#f59e0b', background: '#0c0a09', card: '#1c1917', text: '#fef3c7', textMuted: '#d97706', secondary: '#451a03', accent: '#d97706', border: '#292524', hapticEnabled: true, soundEnabled: true, vibrationIntensity: 50, fontScale: 1, soundType: 'click' },
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

  // Start from today or yesterday
  const lastActive = sorted[0].date;
  if (lastActive !== today && lastActive !== yesterdayStr) return 0;

  currentDate = lastActive;

  for (const record of sorted) {
    if (record.date === currentDate) {
      streak++;
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      currentDate = d.toISOString().split('T')[0];
    } else {
      break;
    }
  }
  return streak;
};

export const useTasbeehStore = create<TasbeehState>()(
  persist(
    (set, get) => ({
      count: 0,
      currentCount: 0,
      targetCount: 33,
      totalAllTime: 0,
      dailyRecords: [],
      dailyGoal: 100,
      dhikrs: defaultDhikrs,
      customDhikrs: [],
      currentDhikr: defaultDhikrs[0],
      favoriteDhikrIds: [],
      theme: 'light',
      themeSettings: initialThemeSettings,
      language: 'en',
      showTransliteration: true,
      counterShape: 'minimal',
      countFontSize: 1,
      dhikrTextPosition: 'middle',
      verticalOffset: 0,
      dhikrVerticalOffset: 0,
      counterVerticalOffset: 0,
      counterScale: 1,
      zenMode: false,
      autoThemeSwitch: false,
      shakeToReset: true,
      wakeLockEnabled: true,
      volumeButtonCounting: false,
      lastSeenVersion: '0.0.0',
      hadithSlideDuration: 5,
      hadithSlidePosition: 'bottom',
      breathingGuideEnabled: false,
      breathingGuideSpeed: 4,
      streakDays: 0,
      lastActiveDate: null,
      longestStreak: 0,
      unlockedAchievements: [],
      screenOffMode: false,
      sessionStartTime: null,
      sessionMode: getDefaultSessionMode(),
      notificationPermission: 'default',
      reminderEnabled: false,
      reminderTime: '18:00',
      lastCount: 0,
      lastDhikrId: '',
      canUndo: false,

      increment: () => {
        const state = get();
        const now = Date.now();
        const today = getTodayDate();

        const currentSettings = state.themeSettings[state.theme] || defaultThemeSettings;
        if (currentSettings.hapticEnabled && navigator.vibrate) {
          navigator.vibrate(currentSettings.vibrationIntensity || 50);
        }

        const newCount = state.currentCount + 1;
        const newTotal = state.totalAllTime + 1;

        // Update daily records
        const records = [...state.dailyRecords];
        const todayIdx = records.findIndex(r => r.date === today);

        if (todayIdx > -1) {
          records[todayIdx] = {
            ...records[todayIdx],
            totalCount: records[todayIdx].totalCount + 1,
            counts: {
              ...records[todayIdx].counts,
              [state.currentDhikr.id]: (records[todayIdx].counts[state.currentDhikr.id] || 0) + 1
            }
          };
        } else {
          records.push({
            date: today,
            totalCount: 1,
            counts: { [state.currentDhikr.id]: 1 }
          });
          // Update streak when starting first dhikr of the day
          setTimeout(() => get().updateStreak(), 0);
        }

        // Handle Session Modes
        let { sessionMode } = state;
        if (sessionMode.type === 'tasbih100') {
          const phaseTarget = [33, 33, 34, 0][sessionMode.currentPhase];
          if (newCount >= phaseTarget && sessionMode.currentPhase < 2) {
            const currentPhase = sessionMode.currentPhase;
            const nextPhase = currentPhase + 1;
            sessionMode = {
              ...sessionMode,
              currentPhase: nextPhase,
              phaseCounts: sessionMode.phaseCounts.map((c, i) => i === currentPhase ? newCount : c)
            };
            set({
              currentCount: 0,
              currentDhikr: defaultDhikrs[nextPhase],
              targetCount: [33, 33, 34][nextPhase],
              sessionMode
            });
            return;
          } else if (sessionMode.currentPhase === 2 && newCount >= 34) {
            sessionMode = { ...sessionMode, isComplete: true };
          }
        } else if (sessionMode.type === 'tasbih1000') {
          if (newCount >= 100) {
            const nextSet = sessionMode.currentSetCount + 100;
            if (nextSet >= 1000) {
              sessionMode = { ...sessionMode, isComplete: true, currentSetCount: 1000 };
            } else {
              sessionMode = { ...sessionMode, currentSetCount: nextSet };
              set({ currentCount: 0, sessionMode });
              return;
            }
          }
        } else if (sessionMode.type === 'routine') {
          if (newCount >= state.targetCount) {
            // Routine step complete, wait for manual next if needed or auto-advance
            // For now, let UI handle the "Next" button or auto-advance
          }
        }

        set({
          currentCount: newCount,
          totalAllTime: newTotal,
          dailyRecords: records,
          sessionStartTime: state.sessionStartTime || now,
          sessionMode,
          lastCount: state.currentCount,
          lastDhikrId: state.currentDhikr.id,
          canUndo: true,
        });
      },

      setThemeSettings: (theme, settings) => {
        set((state) => ({
          themeSettings: {
            ...state.themeSettings,
            [theme]: {
              ...state.themeSettings[theme],
              ...settings
            }
          }
        }));
      },

      decrement: () => {
        set((state) => ({
          currentCount: Math.max(0, state.currentCount - 1),
        }));
      },

      toggleFavorite: (id) => set((state) => ({
        favoriteDhikrIds: state.favoriteDhikrIds.includes(id)
          ? state.favoriteDhikrIds.filter(fid => fid !== id)
          : [...state.favoriteDhikrIds, id]
      })),

      resetSettings: () => {
        set({
          themeSettings: initialThemeSettings,
          theme: 'light',
          counterShape: 'minimal',
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

      setTheme: (theme) => set({ theme }),

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

          set((state) => ({
            ...state,
            ...parsed,
            // Basic merge, real logic might be slightly safer but this works for simple restore
            theme: parsed.settings?.theme || state.theme,
            counterShape: parsed.settings?.counterShape || state.counterShape,
            themeSettings: parsed.settings?.themeSettings || state.themeSettings
          }));
          return true;
        } catch {
          return false;
        }
      },

      startTasbih100: (challengeId) => {
        set({
          sessionMode: { type: 'tasbih100', currentPhase: 0, phaseCounts: [0, 0, 0, 0], isComplete: false, challengeId },
          currentDhikr: defaultDhikrs[0],
          currentCount: 0,
          targetCount: 33,
          sessionStartTime: null,
        });
      },

      startTasbih1000: (challengeId) => {
        set({
          sessionMode: { type: 'tasbih1000', currentPhase: 0, currentSetCount: 0, isComplete: false, challengeId },
          currentDhikr: defaultDhikrs[0],
          currentCount: 0,
          targetCount: 125,
          sessionStartTime: null,
        });
      },

      startRoutine: (routineId) => {
        const routine = defaultRoutines.find(r => r.id === routineId);
        if (!routine) return;

        const firstStep = routine.steps[0];
        // Find the full dhikr object
        const fullDhikr = get().dhikrs.find(d => d.id === firstStep.dhikrId) || defaultDhikrs[0];

        set({
          sessionMode: {
            type: 'routine',
            routineId,
            currentStepIndex: 0,
            steps: routine.steps,
            isComplete: false
          },
          currentDhikr: fullDhikr,
          currentCount: 0,
          targetCount: firstStep.target,
          sessionStartTime: null
        });
      },

      nextRoutineStep: () => {
        const state = get();
        if (state.sessionMode.type !== 'routine') return;

        const nextIndex = state.sessionMode.currentStepIndex + 1;
        if (nextIndex < state.sessionMode.steps.length) {
          const nextStep = state.sessionMode.steps[nextIndex];
          const fullDhikr = state.dhikrs.find(d => d.id === nextStep.dhikrId) || defaultDhikrs[0];

          set({
            sessionMode: { ...state.sessionMode, currentStepIndex: nextIndex },
            currentDhikr: fullDhikr,
            currentCount: 0,
            targetCount: nextStep.target
          });
        } else {
          // Routine Complete
          set({
            sessionMode: { ...state.sessionMode, isComplete: true }
          });
        }
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
      setHadithSlideDuration: (duration) => set({ hadithSlideDuration: duration }),
      setHadithSlidePosition: (position) => set({ hadithSlidePosition: position }),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      setVerticalOffset: (offset) => set({ verticalOffset: offset }),
      setDhikrVerticalOffset: (offset) => set({ dhikrVerticalOffset: offset }),
      setCounterVerticalOffset: (offset) => set({ counterVerticalOffset: offset }),
      setCounterScale: (scale) => set({ counterScale: scale }),
      setCountFontSize: (scale) => set({ countFontSize: scale }),
      setDhikrTextPosition: (position) => set({ dhikrTextPosition: position }),
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
      setWakeLockEnabled: (enabled) => set({ wakeLockEnabled: enabled }),
      setVolumeButtonCounting: (enabled) => set({ volumeButtonCounting: enabled }),
      setLastSeenVersion: (version) => set({ lastSeenVersion: version }),

      // Notification Actions
      setNotificationPermission: (permission) => set({ notificationPermission: permission }),
      setReminderEnabled: (enabled) => set({ reminderEnabled: enabled }),
      setReminderTime: (time) => set({ reminderTime: time }),

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
        autoThemeSwitch: state.autoThemeSwitch,
        shakeToReset: state.shakeToReset,
        wakeLockEnabled: state.wakeLockEnabled,
        volumeButtonCounting: state.volumeButtonCounting,
        // Previously missing - now persisted:
        unlockedAchievements: state.unlockedAchievements,
        screenOffMode: state.screenOffMode,
        notificationPermission: state.notificationPermission,
        reminderEnabled: state.reminderEnabled,
        reminderTime: state.reminderTime,
      }),
    }
  )
);

// End of store

