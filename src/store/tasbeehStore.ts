import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { counterShapes } from '@/lib/constants';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

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
  | 'theme-oled';

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
  | 'modern-ring' | 'vintage-wood' | 'luminous-ring' 
  | 'ring-light' 
  | 'animated-ripple' | 'bead-ring' | 'halo-ring' | 'vertical-capsules' | 'luminous-beads'
  | 'helix-strand' | 'cyber-hexagon' | 'glass-pill' | 'emerald-loop'
  | 'smart-ring' | 'moon-phase' | 'water-ripple' | 'sand-hourglass' | 'lantern-fanous'
  | 'digital-watch' | 'star-burst' | 'crystal-prism' | 'tally-clicker'
  | 'cyber-3d' | 'crystal-iso' | 'neumorph';

export interface RoutineStep {
  id: string;
  dhikrId: string;
  target: number;
  description?: string;
}

export type SessionMode =
  | { type: 'free' }
  | { type: 'tasbih100'; currentPhase: number; phaseCounts: number[]; isComplete: boolean; challengeId?: string }
  | { type: 'tasbih1000'; currentPhase: number; currentSetCount: number; isComplete: boolean; challengeId?: string }
  | { type: 'routine'; routineId: string; currentStepIndex: number; steps: RoutineStep[]; isComplete: boolean };

interface TasbeehState {
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
  hadithSlideDuration: number;
  hadithSlidePosition: 'top' | 'bottom' | 'none';
  breathingGuideEnabled: boolean;
  breathingGuideSpeed: number;
  streakDays: number;
  lastActiveDate: string | null;
  longestStreak: number;
  unlockedAchievements: string[];
  screenOffMode: boolean;
  sessionStartTime: number | null;
  sessionMode: SessionMode;
  notificationPermission: NotificationPermission | 'not-supported';
  reminderEnabled: boolean;
  reminderTime: string;
  lastCount: number;
  lastDhikrId: string;
  canUndo: boolean;

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

export const defaultDhikrs: Dhikr[] = [
  { id: 'subahanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', transliteration: 'Subhan-Allah', translation: 'Glory be to Allah', hadiths: [{ text: "كلمتان خفيفتان على اللسان، ثقيلتان في الميزان: سبحان الله وبحمده، سبحان الله العظيم", source: "البخاري ومسلم" }, { text: "من قال: سبحان الله وبحمده، في يوم مائة مرة، حطت خطاياه وإن كانت مثل زبد البحر", source: "البخاري" }] },
  { id: 'alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', transliteration: 'Alhamdulillah', translation: 'Praise be to Allah', hadiths: [{ text: "أفضل الدعاء الحمد لله", source: "الترمذي" }, { text: "والحمد لله تملأ الميزان", source: "مسلم" }] },
  { id: 'allahuakbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest', hadiths: [{ text: "أحب الكلام إلى الله أربع: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر", source: "مسلم" }] },
  { id: 'astaghfirullah', arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', transliteration: 'Astaghfirullah', translation: 'I seek forgiveness from Allah', hadiths: [{ text: "من لزم الاستغفار جعل الله له من كل هم فرجا، ومن كل ضيق مخرجا", source: "أبو داود" }] },
  { id: 'la-ilaha-illallah', arabic: 'لَا إِلَٰهَ إِلَّا ٱللَّٰهُ', transliteration: 'La ilaha illallah', translation: 'There is no god but Allah', hadiths: [{ text: "أفضل الذكر لا إله إلا الله", source: "الترمذي" }] },
  { id: 'allahuma-sali', arabic: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ', transliteration: 'Allahumma Salli Ala Sayyidina Muhammad', translation: 'O Allah, send blessings upon our Master Muhammad', hadiths: [{ text: "من صلى علي واحدة صلى الله عليه عشرا", source: "مسلم" }] },
  { id: 'ayat_alkursi', arabic: 'آيَةُ الْكُرْسِيِّ', transliteration: 'Ayat al-Kursi', translation: 'The Throne Verse', hadiths: [{ text: "هي أعظم آية في كتاب الله", source: "مسلم" }] },
  { id: '3_quls', arabic: 'الْمُعَوِّذَاتِ', transliteration: 'The 3 Quls', translation: 'Surah Ikhlas, Falaq, and Nas', hadiths: [{ text: "قل هو الله أحد تعدل ثلث القرآن", source: "البخاري" }] }
];

export const defaultRoutines: any[] = [
  { id: 'post-prayer', label: 'After Prayer', steps: [{ id: 'step1', dhikrId: 'subahanallah', target: 33 }, { id: 'step2', dhikrId: 'alhamdulillah', target: 33 }, { id: 'step3', dhikrId: 'allahuakbar', target: 34 }] }
];

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

export const useTasbeehStore = create<TasbeehState>()(
  persist(
    (set, get) => ({
      count: 0, currentCount: 0, targetCount: 33, totalAllTime: 0, dailyRecords: [], dailyGoal: 100, dhikrs: defaultDhikrs, customDhikrs: [], currentDhikr: defaultDhikrs[0], favoriteDhikrIds: [], theme: 'light', themeSettings: initialThemeSettings, language: 'en', showTransliteration: true, counterShape: 'minimal', countFontSize: 1, dhikrTextPosition: 'middle', verticalOffset: 0, dhikrVerticalOffset: 0, counterVerticalOffset: 0, counterScale: 1, zenMode: false, autoThemeSwitch: false, shakeToReset: true, wakeLockEnabled: true, volumeButtonCounting: false, lastSeenVersion: '0.0.0', hadithSlideDuration: 5, hadithSlidePosition: 'bottom', breathingGuideEnabled: false, breathingGuideSpeed: 4, streakDays: 0, lastActiveDate: null, longestStreak: 0, unlockedAchievements: [], screenOffMode: false, sessionStartTime: null, sessionMode: getDefaultSessionMode(), notificationPermission: 'default', reminderEnabled: false, reminderTime: '18:00', lastCount: 0, lastDhikrId: '', canUndo: false,

      increment: () => {
        const state = get();
        const now = Date.now();
        const today = getTodayDate();
        const currentSettings = state.themeSettings[state.theme] || defaultThemeSettings;
        if (currentSettings.hapticEnabled) {
          try { Haptics.impact({ style: ImpactStyle.Light }); } catch { /* ignore on web */ }
          if (navigator.vibrate) navigator.vibrate(currentSettings.vibrationIntensity || 50);
        }

        const newCount = state.currentCount + 1;
        const newTotal = state.totalAllTime + 1;
        const records = [...state.dailyRecords];
        const todayIdx = records.findIndex(r => r.date === today);

        if (todayIdx > -1) {
          records[todayIdx] = { ...records[todayIdx], totalCount: records[todayIdx].totalCount + 1, counts: { ...records[todayIdx].counts, [state.currentDhikr.id]: (records[todayIdx].counts[state.currentDhikr.id] || 0) + 1 } };
        } else {
          records.push({ date: today, totalCount: 1, counts: { [state.currentDhikr.id]: 1 } });
          setTimeout(() => get().updateStreak(), 0);
        }

        const sessionMode = state.sessionMode;
        if (sessionMode.type === 'tasbih100') {
          const mode = sessionMode; // local variable for narrowing
          const phaseTarget = [33, 33, 34][mode.currentPhase];
          if (newCount >= phaseTarget && mode.currentPhase < 2) {
            const nextPhase = mode.currentPhase + 1;
            const newSessionMode: SessionMode = {
              ...mode,
              currentPhase: nextPhase,
              phaseCounts: mode.phaseCounts.map((c, i) => i === mode.currentPhase ? newCount : c)
            };
            set({ currentCount: 0, currentDhikr: defaultDhikrs[nextPhase], targetCount: [33, 33, 34][nextPhase], sessionMode: newSessionMode });
            return;
          } else if (mode.currentPhase === 2 && newCount >= 34) {
             set({ currentCount: newCount, totalAllTime: newTotal, dailyRecords: records, sessionStartTime: state.sessionStartTime || now, sessionMode: { ...mode, isComplete: true }, lastCount: state.currentCount, lastDhikrId: state.currentDhikr.id, canUndo: true });
             return;
          }
        } else if (sessionMode.type === 'tasbih1000') {
          const mode = sessionMode;
          if (newCount >= 100) {
            const nextSet = mode.currentSetCount + 100;
            if (nextSet >= 1000) {
              set({ currentCount: newCount, totalAllTime: newTotal, dailyRecords: records, sessionStartTime: state.sessionStartTime || now, sessionMode: { ...mode, isComplete: true, currentSetCount: 1000 }, lastCount: state.currentCount, lastDhikrId: state.currentDhikr.id, canUndo: true });
            } else {
              set({ currentCount: 0, totalAllTime: newTotal, dailyRecords: records, sessionStartTime: state.sessionStartTime || now, sessionMode: { ...mode, currentSetCount: nextSet }, lastCount: state.currentCount, lastDhikrId: state.currentDhikr.id, canUndo: true });
            }
            return;
          }
        }

        set({ currentCount: newCount, totalAllTime: newTotal, dailyRecords: records, sessionStartTime: state.sessionStartTime || now, sessionMode, lastCount: state.currentCount, lastDhikrId: state.currentDhikr.id, canUndo: true });
      },

      decrement: () => set((state) => ({ currentCount: Math.max(0, state.currentCount - 1) })),
      reset: () => {
        const state = get();
        const currentSettings = state.themeSettings[state.theme] || defaultThemeSettings;
        if (currentSettings.hapticEnabled) {
          try { Haptics.impact({ style: ImpactStyle.Heavy }); } catch { /* ignore */ }
          if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
        }
        if (state.sessionMode.type === 'tasbih100') {
          set({ currentCount: 0, sessionStartTime: null, sessionMode: { type: 'tasbih100', currentPhase: 0, phaseCounts: [0, 0, 0, 0], isComplete: false, challengeId: state.sessionMode.challengeId }, currentDhikr: defaultDhikrs[0] });
        } else if (state.sessionMode.type === 'tasbih1000') {
          set({ currentCount: 0, sessionStartTime: null, sessionMode: { type: 'tasbih1000', currentPhase: 0, currentSetCount: 0, isComplete: false, challengeId: state.sessionMode.challengeId } });
        } else { set({ currentCount: 0, sessionStartTime: null }); }
      },
      setDhikr: (dhikr) => set({ currentDhikr: dhikr, currentCount: 0, sessionStartTime: null }),
      setTarget: (target) => set((state) => ({ targetCount: target, sessionMode: { type: 'free' }, currentCount: state.sessionMode.type === 'free' ? state.currentCount : 0, sessionStartTime: state.sessionMode.type === 'free' ? state.sessionStartTime : null })),
      toggleTransliteration: () => set((state) => ({ showTransliteration: !state.showTransliteration })),
      setTheme: (theme) => set({ theme }),
      setThemeSettings: (theme, settings) => set((state) => ({ themeSettings: { ...state.themeSettings, [theme]: { ...state.themeSettings[theme], ...settings } } })),
      setLanguage: (language) => set({ language }),
      addCustomDhikr: (dhikr) => set((state) => ({ customDhikrs: [...state.customDhikrs, { ...dhikr, id: `custom_${Date.now()}` }] })),
      removeCustomDhikr: (id) => set((state) => ({ customDhikrs: state.customDhikrs.filter(d => d.id !== id), currentDhikr: state.currentDhikr.id === id ? state.dhikrs[0] : state.currentDhikr })),
      toggleFavorite: (id) => set((state) => ({ favoriteDhikrIds: state.favoriteDhikrIds.includes(id) ? state.favoriteDhikrIds.filter(fid => fid !== id) : [...state.favoriteDhikrIds, id] })),
      clearAllData: () => set({ currentCount: 0, dailyRecords: [], totalAllTime: 0, customDhikrs: [], sessionStartTime: null, streakDays: 0, lastActiveDate: null, longestStreak: 0, sessionMode: getDefaultSessionMode() }),
      resetSettings: () => set({ themeSettings: initialThemeSettings, theme: 'light', counterShape: 'minimal', showTransliteration: true }),
      setCounterShape: (shape) => set({ counterShape: shape }),
      setHadithSlideDuration: (duration) => set({ hadithSlideDuration: duration }),
      setHadithSlidePosition: (position) => set({ hadithSlidePosition: position }),
      setDailyGoal: (goal) => set({ dailyGoal: goal }),
      setVerticalOffset: (offset) => set({ verticalOffset: offset }),
      setDhikrVerticalOffset: (offset) => set({ dhikrVerticalOffset: offset }),
      setCounterVerticalOffset: (offset) => set({ counterVerticalOffset: offset }),
      setCounterScale: (scale) => set({ counterScale: scale }),
      setCountFontSize: (scale) => set({ countFontSize: scale }),
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
      importData: (data) => { try { const p = JSON.parse(data); set(s => ({ ...s, ...p, theme: p.settings?.theme || s.theme, counterShape: p.settings?.counterShape || s.counterShape, themeSettings: p.settings?.themeSettings || s.themeSettings })); return true; } catch { return false; } },
      startTasbih100: (challengeId) => set({ sessionMode: { type: 'tasbih100', currentPhase: 0, phaseCounts: [0, 0, 0, 0], isComplete: false, challengeId }, currentDhikr: defaultDhikrs[0], currentCount: 0, targetCount: 33, sessionStartTime: null }),
      startTasbih1000: (challengeId) => set({ sessionMode: { type: 'tasbih1000', currentPhase: 0, currentSetCount: 0, isComplete: false, challengeId }, currentDhikr: defaultDhikrs[0], currentCount: 0, targetCount: 125, sessionStartTime: null }),
      startRoutine: (routineId) => {
        const r = defaultRoutines.find(rou => rou.id === routineId); if (!r) return;
        const step = r.steps[0]; const d = get().dhikrs.find(dh => dh.id === step.dhikrId) || defaultDhikrs[0];
        set({ sessionMode: { type: 'routine', routineId, currentStepIndex: 0, steps: r.steps, isComplete: false }, currentDhikr: d, currentCount: 0, targetCount: step.target, sessionStartTime: null });
      },
      nextRoutineStep: () => {
        const s = get(); if (s.sessionMode.type !== 'routine') return;
        const nIndex = s.sessionMode.currentStepIndex + 1;
        if (nIndex < s.sessionMode.steps.length) {
          const nStep = s.sessionMode.steps[nIndex]; const d = s.dhikrs.find(dh => dh.id === nStep.dhikrId) || defaultDhikrs[0];
          set({ sessionMode: { ...s.sessionMode, currentStepIndex: nIndex }, currentDhikr: d, currentCount: 0, targetCount: nStep.target });
        } else { set({ sessionMode: { ...s.sessionMode, isComplete: true } }); }
      },
      exitSessionMode: () => set({ sessionMode: getDefaultSessionMode(), currentCount: 0, sessionStartTime: null }),
      undo: () => {
        const s = get(); if (!s.canUndo) return;
        const d = s.dhikrs.find(dh => dh.id === s.lastDhikrId) || s.customDhikrs.find(dh => dh.id === s.lastDhikrId) || s.currentDhikr;
        set({ currentCount: s.lastCount, currentDhikr: d, canUndo: false });
        const settings = s.themeSettings[s.theme] || defaultThemeSettings; if (settings.hapticEnabled && navigator.vibrate) navigator.vibrate([20, 50, 20]);
      },
      setAutoThemeSwitch: (e) => set({ autoThemeSwitch: e }), setShakeToReset: (e) => set({ shakeToReset: e }), setWakeLockEnabled: (e) => set({ wakeLockEnabled: e }), setVolumeButtonCounting: (e) => set({ volumeButtonCounting: e }), setLastSeenVersion: (v) => set({ lastSeenVersion: v }), setNotificationPermission: (p) => set({ notificationPermission: p }), setReminderEnabled: (e) => set({ reminderEnabled: e }), setReminderTime: (t) => set({ reminderTime: t }),
      updateStreak: () => {
        const today = getTodayDate(); const state = get(); if (state.lastActiveDate === today) return;
        const yest = new Date(); yest.setDate(yest.getDate() - 1); const yestStr = yest.toISOString().split('T')[0];
        let nStreak = state.streakDays; if (state.lastActiveDate === yestStr) nStreak += 1; else if (state.lastActiveDate !== today) nStreak = 1;
        set({ streakDays: nStreak, lastActiveDate: today, longestStreak: Math.max(state.longestStreak, nStreak) });
      },
    }),
    {
      name: 'tasbeeh-storage',
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          const history = persistedState.dailyRecords || [];
          const streak = calculateStreakFromHistory(history);
          return { ...persistedState, streakDays: streak, longestStreak: streak, favoriteDhikrIds: persistedState.favoriteDhikrIds || [], dailyGoal: persistedState.dailyGoal || 100 };
        }
        return persistedState as TasbeehState;
      },
      partialize: (state) => ({
        currentDhikr: state.currentDhikr, currentCount: state.currentCount, targetCount: state.targetCount, showTransliteration: state.showTransliteration, themeSettings: state.themeSettings, theme: state.theme, language: state.language, zenMode: state.zenMode, counterShape: state.counterShape, hadithSlideDuration: state.hadithSlideDuration, hadithSlidePosition: state.hadithSlidePosition, dhikrTextPosition: state.dhikrTextPosition, verticalOffset: state.verticalOffset, dhikrVerticalOffset: state.dhikrVerticalOffset, counterVerticalOffset: state.counterVerticalOffset, counterScale: state.counterScale, countFontSize: state.countFontSize, dailyRecords: state.dailyRecords, totalAllTime: state.totalAllTime, customDhikrs: state.customDhikrs, streakDays: state.streakDays, lastActiveDate: state.lastActiveDate, longestStreak: state.longestStreak, sessionMode: state.sessionMode, dailyGoal: state.dailyGoal, favoriteDhikrIds: state.favoriteDhikrIds, lastSeenVersion: state.lastSeenVersion, autoThemeSwitch: state.autoThemeSwitch, shakeToReset: state.shakeToReset, wakeLockEnabled: state.wakeLockEnabled, volumeButtonCounting: state.volumeButtonCounting, unlockedAchievements: state.unlockedAchievements, screenOffMode: state.screenOffMode, notificationPermission: state.notificationPermission, reminderEnabled: state.reminderEnabled, reminderTime: state.reminderTime,
      }),
    }
  )
);
