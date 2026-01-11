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
  hapticEnabled: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'amoled' | 'theme-midnight' | 'theme-rose' | 'theme-nature';
  language: 'en' | 'ar';
  vibrationIntensity: 'light' | 'medium' | 'heavy';
  counterShape: 'minimal' | 'classic' | 'beads' | 'flower' | 'waveform';
  showTransliteration: boolean;
  
  // Data
  dailyRecords: DailyRecord[];
  totalAllTime: number;
  
  // Available dhikrs
  dhikrs: Dhikr[];
  customDhikrs: Dhikr[];
  
  // Streak tracking
  streakDays: number;
  lastActiveDate: string | null;
  longestStreak: number;
  
  // Actions
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setDhikr: (dhikr: Dhikr) => void;
  setTarget: (target: number) => void;
  toggleTransliteration: () => void;
  toggleHaptic: () => void;
  toggleSound: () => void;
  setTheme: (theme: 'light' | 'dark' | 'amoled' | 'theme-midnight' | 'theme-rose' | 'theme-nature') => void;
  setLanguage: (lang: 'ar' | 'en') => void;
  addCustomDhikr: (dhikr: Omit<Dhikr, 'id'>) => void;
  removeCustomDhikr: (id: string) => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (data: string) => boolean;
  
  // Session mode actions
  startTasbih100: () => void;
  exitSessionMode: () => void;
  
  // Streak actions
  updateStreak: () => void;
  
  // New Settings Actions
  setCounterShape: (shape: 'minimal' | 'classic' | 'beads') => void;
  setVibrationIntensity: (intensity: 'light' | 'medium' | 'heavy') => void;
}

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
      
      showTransliteration: true,
      hapticEnabled: true,
      soundEnabled: false,
      theme: 'light',
      language: 'en', // Keeping language for now
      vibrationIntensity: 'medium', // New
      counterShape: 'minimal', // New
      
      dailyRecords: [],
      totalAllTime: 0,
      
      dhikrs: defaultDhikrs,
      customDhikrs: [],
      
      // Actions
      increment: () => {
        const state = get();
        const today = getTodayDate();
        
        // Trigger haptic if enabled
        if (state.hapticEnabled && navigator.vibrate) {
          const intensity = state.vibrationIntensity === 'light' ? 10 : state.vibrationIntensity === 'medium' ? 15 : 25;
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
      
      reset: () => {
         const state = get();
         if (state.hapticEnabled && navigator.vibrate) {
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
      toggleHaptic: () => set((state) => ({ hapticEnabled: !state.hapticEnabled })),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      
      setTheme: (theme) => {
        set({ theme });
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark', 'amoled', 'theme-midnight', 'theme-rose', 'theme-nature');
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
            // ... existing export structure
            dailyRecords: state.dailyRecords,
            totalAllTime: state.totalAllTime,
            customDhikrs: state.customDhikrs,
            streakDays: state.streakDays,
            settings: {
                theme: state.theme,
                hapticEnabled: state.hapticEnabled,
                soundEnabled: state.soundEnabled,
                counterShape: state.counterShape,
                vibrationIntensity: state.vibrationIntensity,
                target: state.targetCount
            }
        });
      },
      
      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.settings?.theme) {
             const root = window.document.documentElement;
             root.classList.remove('light', 'dark', 'amoled', 'theme-midnight', 'theme-rose', 'theme-nature');
             root.classList.add(parsed.settings.theme);
          }
          
          set((state) => ({
             ...state,
             ...parsed, 
              // Basic merge, real logic might be slightly safer but this works for simple restore
             theme: parsed.settings?.theme || state.theme,
             counterShape: parsed.settings?.counterShape || state.counterShape,
             vibrationIntensity: parsed.settings?.vibrationIntensity || state.vibrationIntensity
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
      setVibrationIntensity: (intensity) => set({ vibrationIntensity: intensity }),
    }),
    {
       name: 'tasbeeh-storage',
       partialize: (state) => ({
         // ... persiste logic
         currentDhikr: state.currentDhikr,
         currentCount: state.currentCount,
         targetCount: state.targetCount,
         showTransliteration: state.showTransliteration,
         hapticEnabled: state.hapticEnabled,
         soundEnabled: state.soundEnabled,
         theme: state.theme,
         language: state.language,
         counterShape: state.counterShape,
         vibrationIntensity: state.vibrationIntensity,
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
