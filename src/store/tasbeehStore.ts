import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// Types
export type Dhikr = {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
};

export type SessionMode = 
  | { type: 'free' } // Changed 'single' to 'free'
  | { 
      type: 'tasbih100';
      currentPhase: number;
      phaseCounts: number[];
      isComplete: boolean;
    };

export type DailyRecord = {
  date: string;
  totalCount: number;
  counts: Record<string, number>;
};

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
  theme: 'light' | 'dark' | 'theme-midnight' | 'theme-neon' | 'theme-green' | 'theme-cyberpunk' | 'theme-glass';
  language: 'en' | 'ar';
  
  // Theme-specific settings container
  themeSettings: Record<string, ThemeSettings>;

  // Global preference (not per theme)
  counterShape: 'minimal' | 'classic' | 'beads' | 'flower' | 'waveform' | 'hexagon' | 'orb';
  layout: 'default' | 'focus' | 'ergonomic';
  showTransliteration: boolean;
  
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
  
  setTheme: (theme: 'light' | 'dark' | 'theme-midnight' | 'theme-neon' | 'theme-green' | 'theme-cyberpunk' | 'theme-glass') => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  addCustomDhikr: (dhikr: Omit<Dhikr, 'id'>) => void;
  removeCustomDhikr: (id: string) => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  
  // Session mode actions
  startTasbih100: () => void;
  exitSessionMode: () => void;
  
  updateStreak: () => void;
  toggleFavorite: (id: string) => void;
  
  // New Settings Actions
  setCounterShape: (shape: 'minimal' | 'classic' | 'beads' | 'flower' | 'waveform' | 'hexagon' | 'orb') => void;
  setLayout: (layout: 'default' | 'focus' | 'ergonomic') => void;
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
  'dark': { ...defaultThemeSettings },
  'theme-midnight': { ...defaultThemeSettings },
  'theme-neon': { ...defaultThemeSettings },
  'theme-green': { ...defaultThemeSettings },
  'theme-cyberpunk': { ...defaultThemeSettings },
  'theme-glass': { ...defaultThemeSettings },
};

export const defaultDhikrs: Dhikr[] = [
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللهِ',
    transliteration: 'SubhanAllah',
    meaning: 'Glory be to Allah',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'Alhamdulillah',
    meaning: 'Praise be to Allah',
  },
  {
    id: 'allahuakbar',
    arabic: 'اللهُ أَكْبَرُ',
    transliteration: 'Allahu Akbar',
    meaning: 'Allah is the Greatest',
  },
  {
    id: 'lailaha',
    arabic: 'لَا إِلَٰهَ إِلَّا اللهُ',
    transliteration: 'La ilaha illallah',
    meaning: 'There is no god but Allah',
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللهَ',
    transliteration: 'Astaghfirullah',
    meaning: 'I seek forgiveness from Allah',
  },
];

const getTodayDate = () => new Date().toISOString().split('T')[0];

const getDefaultSessionMode = (): SessionMode => ({
  type: 'free',
});

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
      counterShape: 'minimal', // New
      layout: 'default',
      
      dailyRecords: [],
      totalAllTime: 0,
      
      dhikrs: defaultDhikrs,
      customDhikrs: [],
      
      // Actions
      increment: () => {
        const state = get();
        const today = getTodayDate();
        
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
         root.classList.remove('light', 'dark', 'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass');
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
         } else {
           set({ currentCount: 0, sessionStartTime: null });
         }
      },
      
      setDhikr: (dhikr) => set({ currentDhikr: dhikr, currentCount: 0, sessionStartTime: null }),
      setTarget: (target) => set({ targetCount: target }),
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
        root.classList.remove('light', 'dark', 'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass');
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
             root.classList.remove('light', 'dark', 'theme-midnight', 'theme-neon', 'theme-green', 'theme-cyberpunk', 'theme-glass');
             root.classList.add(parsed.settings.theme);
          }
          
          set((state) => ({
             ...state,
             ...parsed, 
              // Basic merge, real logic might be slightly safer but this works for simple restore
             theme: parsed.settings?.theme || state.theme,
             counterShape: parsed.settings?.counterShape || state.counterShape,
             layout: parsed.settings?.layout || state.layout,
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
    }),
    {
       name: 'tasbeeh-storage',
       partialize: (state) => ({
         currentDhikr: state.currentDhikr,
         currentCount: state.currentCount,
         targetCount: state.targetCount,
         showTransliteration: state.showTransliteration,
         themeSettings: state.themeSettings,
         theme: state.theme,
         language: state.language,
         counterShape: state.counterShape,
         layout: state.layout,
         dailyRecords: state.dailyRecords,
         totalAllTime: state.totalAllTime,
         customDhikrs: state.customDhikrs,
         streakDays: state.streakDays,
         lastActiveDate: state.lastActiveDate,
         longestStreak: state.longestStreak,
         sessionMode: state.sessionMode,
       }),
    }
  )
);
