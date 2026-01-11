import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Dhikr {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
}

export interface DailyRecord {
  date: string;
  counts: Record<string, number>;
  totalCount: number;
}

export interface SessionMode {
  type: 'single' | 'tasbih100';
  currentPhase: number; // 0: SubhanAllah, 1: Alhamdulillah, 2: Allahu Akbar, 3: La ilaha illallah
  phaseCounts: number[];
  isComplete: boolean;
}

export interface TasbeehState {
  // Current session
  currentDhikr: Dhikr;
  currentCount: number;
  targetCount: number;
  sessionStartTime: number | null;
  
  // Session mode
  sessionMode: SessionMode;
  
  // Streak tracking
  streakDays: number;
  lastActiveDate: string | null;
  longestStreak: number;
  
  // Settings
  showTransliteration: boolean;
  hapticEnabled: boolean;
  soundEnabled: boolean;
  theme: 'light' | 'dark' | 'amoled';
  language: 'ar' | 'en';
  
  // History
  dailyRecords: DailyRecord[];
  totalAllTime: number;
  
  // Available dhikrs
  dhikrs: Dhikr[];
  customDhikrs: Dhikr[];
  
  // Actions
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setDhikr: (dhikr: Dhikr) => void;
  setTarget: (target: number) => void;
  toggleTransliteration: () => void;
  toggleHaptic: () => void;
  toggleSound: () => void;
  setTheme: (theme: 'light' | 'dark' | 'amoled') => void;
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
  type: 'single',
  currentPhase: 0,
  phaseCounts: [0, 0, 0, 0],
  isComplete: false,
});

export const useTasbeehStore = create<TasbeehState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentDhikr: defaultDhikrs[0],
      currentCount: 0,
      targetCount: 33,
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
      language: 'en',
      
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
          navigator.vibrate(10);
        }
        
        set((state) => {
          let newCount = state.currentCount + 1;
          const newTotal = state.totalAllTime + 1;
          
          // Update daily record
          const existingRecordIndex = state.dailyRecords.findIndex(r => r.date === today);
          const updatedRecords = [...state.dailyRecords];
          
          if (existingRecordIndex >= 0) {
            const record = { ...updatedRecords[existingRecordIndex] };
            record.counts[state.currentDhikr.id] = (record.counts[state.currentDhikr.id] || 0) + 1;
            record.totalCount += 1;
            updatedRecords[existingRecordIndex] = record;
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
            const phaseTargets = [33, 33, 33, 1]; // SubhanAllah, Alhamdulillah, Allahu Akbar, La ilaha illallah
            const phaseDhikrs = [
              defaultDhikrs[0], // SubhanAllah
              defaultDhikrs[1], // Alhamdulillah
              defaultDhikrs[2], // Allahu Akbar
              defaultDhikrs[3], // La ilaha illallah
            ];
            
            sessionMode.phaseCounts[sessionMode.currentPhase] = newCount;
            
            // Check if current phase is complete
            if (newCount >= phaseTargets[sessionMode.currentPhase]) {
              if (sessionMode.currentPhase < 3) {
                // Move to next phase
                sessionMode.currentPhase += 1;
                currentDhikr = phaseDhikrs[sessionMode.currentPhase];
                newCount = 0;
              } else {
                // Session complete!
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
        
        // Update streak
        get().updateStreak();
      },
      
      decrement: () => {
        set((state) => ({
          currentCount: Math.max(0, state.currentCount - 1),
        }));
      },
      
      reset: () => {
        const state = get();
        if (state.sessionMode.type === 'tasbih100') {
          // Reset the entire 100 session
          set({ 
            currentCount: 0, 
            sessionStartTime: null,
            sessionMode: {
              type: 'tasbih100',
              currentPhase: 0,
              phaseCounts: [0, 0, 0, 0],
              isComplete: false,
            },
            currentDhikr: defaultDhikrs[0],
          });
        } else {
          set({ currentCount: 0, sessionStartTime: null });
        }
      },
      
      setDhikr: (dhikr) => {
        set({ currentDhikr: dhikr, currentCount: 0, sessionStartTime: null });
      },
      
      setTarget: (target) => {
        set({ targetCount: target });
      },
      
      toggleTransliteration: () => {
        set((state) => ({ showTransliteration: !state.showTransliteration }));
      },
      
      toggleHaptic: () => {
        set((state) => ({ hapticEnabled: !state.hapticEnabled }));
      },
      
      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },
      
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.remove('light', 'dark', 'amoled');
        if (theme !== 'light') {
          document.documentElement.classList.add(theme);
        }
      },
      
      setLanguage: (language) => {
        set({ language });
      },
      
      addCustomDhikr: (dhikr) => {
        const id = `custom_${Date.now()}`;
        set((state) => ({
          customDhikrs: [...state.customDhikrs, { ...dhikr, id }],
        }));
      },
      
      removeCustomDhikr: (id) => {
        set((state) => ({
          customDhikrs: state.customDhikrs.filter(d => d.id !== id),
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
          lastActiveDate: state.lastActiveDate,
          longestStreak: state.longestStreak,
          settings: {
            showTransliteration: state.showTransliteration,
            hapticEnabled: state.hapticEnabled,
            soundEnabled: state.soundEnabled,
            theme: state.theme,
            language: state.language,
          },
        });
      },
      
      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            dailyRecords: parsed.dailyRecords || [],
            totalAllTime: parsed.totalAllTime || 0,
            customDhikrs: parsed.customDhikrs || [],
            streakDays: parsed.streakDays || 0,
            lastActiveDate: parsed.lastActiveDate || null,
            longestStreak: parsed.longestStreak || 0,
            ...parsed.settings,
          });
          return true;
        } catch {
          return false;
        }
      },
      
      // Session mode actions
      startTasbih100: () => {
        set({
          sessionMode: {
            type: 'tasbih100',
            currentPhase: 0,
            phaseCounts: [0, 0, 0, 0],
            isComplete: false,
          },
          currentDhikr: defaultDhikrs[0], // Start with SubhanAllah
          currentCount: 0,
          targetCount: 33,
          sessionStartTime: null,
        });
      },
      
      exitSessionMode: () => {
        set({
          sessionMode: getDefaultSessionMode(),
          currentCount: 0,
          sessionStartTime: null,
        });
      },
      
      // Streak tracking
      updateStreak: () => {
        const today = getTodayDate();
        const state = get();
        
        if (state.lastActiveDate === today) {
          // Already counted for today
          return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        let newStreak = state.streakDays;
        
        if (state.lastActiveDate === yesterdayStr) {
          // Consecutive day
          newStreak += 1;
        } else if (state.lastActiveDate !== today) {
          // Streak broken, start fresh
          newStreak = 1;
        }
        
        set({
          streakDays: newStreak,
          lastActiveDate: today,
          longestStreak: Math.max(state.longestStreak, newStreak),
        });
      },
    }),
    {
      name: 'tasbeeh-storage',
      partialize: (state) => ({
        currentDhikr: state.currentDhikr,
        currentCount: state.currentCount,
        targetCount: state.targetCount,
        showTransliteration: state.showTransliteration,
        hapticEnabled: state.hapticEnabled,
        soundEnabled: state.soundEnabled,
        theme: state.theme,
        language: state.language,
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
