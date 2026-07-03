import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useTasbeehStore, TasbeehState } from '@/store/tasbeehStore';

let unsubscribeStore: (() => void) | null = null;
let syncTimeout: NodeJS.Timeout | null = null;

// ── Sync Status Observable ─────────────────────────────────────────────────
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

let _syncStatus: SyncStatus = 'idle';
let _lastSyncedAt: string | null = null;
const _listeners: Set<(status: SyncStatus, lastSyncedAt: string | null) => void> = new Set();

const setSyncStatus = (status: SyncStatus, lastSyncedAt?: string) => {
  _syncStatus = status;
  if (lastSyncedAt !== undefined) _lastSyncedAt = lastSyncedAt;
  _listeners.forEach((l) => l(_syncStatus, _lastSyncedAt));
};

export const onSyncStatusChange = (
  listener: (status: SyncStatus, lastSyncedAt: string | null) => void
): (() => void) => {
  _listeners.add(listener);
  listener(_syncStatus, _lastSyncedAt);
  return () => _listeners.delete(listener);
};

export const getSyncStatus = () => ({ status: _syncStatus, lastSyncedAt: _lastSyncedAt });

// ── Cloud Sync Start/Stop ──────────────────────────────────────────────────
export const startCloudSync = (uid: string) => {
  if (unsubscribeStore) unsubscribeStore();

  unsubscribeStore = useTasbeehStore.subscribe((state: TasbeehState, prevState: TasbeehState) => {
    if (state === prevState) return;
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      syncToCloud(uid, state);
    }, 2000);
  });
};

export const stopCloudSync = () => {
  if (unsubscribeStore) { unsubscribeStore(); unsubscribeStore = null; }
  if (syncTimeout) { clearTimeout(syncTimeout); syncTimeout = null; }
  setSyncStatus('idle');
};

// ── Manual Force Sync ──────────────────────────────────────────────────────
export const manualSyncNow = async (uid: string): Promise<void> => {
  const state = useTasbeehStore.getState();
  await syncToCloud(uid, state);
};

// ── Sync From Cloud (full state, smart merge) ──────────────────────────────
export const syncFromCloud = async (uid: string) => {
  setSyncStatus('syncing');
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const local = useTasbeehStore.getState();
      const newState: Partial<TasbeehState> = {};

      // ── Cumulative stats: always take the MAX ──────────────────────────
      if (data.totalAllTime !== undefined)
        newState.totalAllTime = Math.max(local.totalAllTime, data.totalAllTime);
      if (data.totalHasanat !== undefined)
        newState.totalHasanat = Math.max(local.totalHasanat, data.totalHasanat);
      if (data.personalBest !== undefined)
        newState.personalBest = Math.max(local.personalBest, data.personalBest);
      if (data.streakDays !== undefined)
        newState.streakDays = Math.max(local.streakDays, data.streakDays);
      if (data.longestStreak !== undefined)
        newState.longestStreak = Math.max(local.longestStreak, data.longestStreak);

      // ── History / Transactions ─────────────────────────────────────────
      // Merge daily records: keep all unique dates, use cloud value if conflict
      if (data.dailyRecords !== undefined) {
        const cloudRecords: typeof local.dailyRecords = data.dailyRecords;
        const merged = [...local.dailyRecords];
        for (const cloudRecord of cloudRecords) {
          const localIdx = merged.findIndex((r) => r.date === cloudRecord.date);
          if (localIdx === -1) {
            merged.push(cloudRecord);
          } else {
            // Take the record with the higher totalCount for that day
            if (cloudRecord.totalCount > merged[localIdx].totalCount) {
              merged[localIdx] = cloudRecord;
            }
          }
        }
        newState.dailyRecords = merged.sort((a, b) => b.date.localeCompare(a.date));
      }

      // Sessions: merge by id, keep all unique sessions
      if (data.sessions !== undefined) {
        const cloudSessions: typeof local.sessions = data.sessions;
        const sessionMap = new Map(local.sessions.map((s) => [s.id, s]));
        for (const s of cloudSessions) {
          if (!sessionMap.has(s.id)) sessionMap.set(s.id, s);
        }
        newState.sessions = Array.from(sessionMap.values())
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 200); // cap at 200
      }

      // Mood ratings: merge by sessionId
      if (data.sessionMoodRatings !== undefined) {
        const cloudRatings: typeof local.sessionMoodRatings = data.sessionMoodRatings;
        const ratingMap = new Map(local.sessionMoodRatings.map((r) => [r.sessionId, r]));
        for (const r of cloudRatings) {
          if (!ratingMap.has(r.sessionId)) ratingMap.set(r.sessionId, r);
        }
        newState.sessionMoodRatings = Array.from(ratingMap.values())
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, 200);
      }

      // ── Awards / Achievements ──────────────────────────────────────────
      // Union merge — never lose an unlocked achievement
      if (data.unlockedAchievements !== undefined) {
        newState.unlockedAchievements = Array.from(
          new Set([...local.unlockedAchievements, ...data.unlockedAchievements])
        );
      }

      // ── User content / Dhikr library ──────────────────────────────────
      if (data.dhikrs !== undefined) newState.dhikrs = data.dhikrs;
      if (data.customDhikrs !== undefined) newState.customDhikrs = data.customDhikrs;
      if (data.favoriteDhikrIds !== undefined) newState.favoriteDhikrIds = data.favoriteDhikrIds;
      if (data.niyyah !== undefined) newState.niyyah = data.niyyah;

      // ── Reminders & notifications ──────────────────────────────────────
      if (data.reminders !== undefined) newState.reminders = data.reminders;
      if (data.reminderEnabled !== undefined) newState.reminderEnabled = data.reminderEnabled;
      if (data.syncPrayerTimes !== undefined) newState.syncPrayerTimes = data.syncPrayerTimes;
      if (data.autoStartPostPrayerTasbeeh !== undefined)
        newState.autoStartPostPrayerTasbeeh = data.autoStartPostPrayerTasbeeh;
      if (data.lazyDayRecoveryEnabled !== undefined)
        newState.lazyDayRecoveryEnabled = data.lazyDayRecoveryEnabled;

      // ── Preferences & UI settings ──────────────────────────────────────
      if (data.theme !== undefined) newState.theme = data.theme;
      if (data.themeSettings !== undefined) newState.themeSettings = data.themeSettings;
      if (data.language !== undefined) newState.language = data.language;
      if (data.dailyGoal !== undefined) newState.dailyGoal = data.dailyGoal;
      if (data.counterShape !== undefined) newState.counterShape = data.counterShape;
      if (data.showTransliteration !== undefined) newState.showTransliteration = data.showTransliteration;
      if (data.dhikrTextPosition !== undefined) newState.dhikrTextPosition = data.dhikrTextPosition;
      if (data.hadithSlidePosition !== undefined) newState.hadithSlidePosition = data.hadithSlidePosition;
      if (data.hadithSlideDuration !== undefined) newState.hadithSlideDuration = data.hadithSlideDuration;
      if (data.breathingGuideEnabled !== undefined) newState.breathingGuideEnabled = data.breathingGuideEnabled;
      if (data.breathingGuideSpeed !== undefined) newState.breathingGuideSpeed = data.breathingGuideSpeed;
      if (data.ambientSoundType !== undefined) newState.ambientSoundType = data.ambientSoundType;
      if (data.ambientSoundVolume !== undefined) newState.ambientSoundVolume = data.ambientSoundVolume;
      if (data.voiceAnnouncementsEnabled !== undefined)
        newState.voiceAnnouncementsEnabled = data.voiceAnnouncementsEnabled;
      if (data.hapticPattern !== undefined) newState.hapticPattern = data.hapticPattern;
      if (data.volumeButtonCounting !== undefined) newState.volumeButtonCounting = data.volumeButtonCounting;
      if (data.wakeLockEnabled !== undefined) newState.wakeLockEnabled = data.wakeLockEnabled;
      if (data.hasSeenWelcome !== undefined) newState.hasSeenWelcome = data.hasSeenWelcome;
      if (data.lastActiveDate !== undefined) newState.lastActiveDate = data.lastActiveDate;
      if (data.lastSeenVersion !== undefined) newState.lastSeenVersion = data.lastSeenVersion;

      if (Object.keys(newState).length > 0) {
        useTasbeehStore.setState(newState);
      }

      const lastSyncedAt = data.lastSyncedAt ?? null;
      setSyncStatus('synced', lastSyncedAt ?? undefined);
      console.log('[CloudSync] Full sync from cloud complete. Fields restored:', Object.keys(newState).length);
    } else {
      // First-time user — push all local state up
      await syncToCloud(uid, useTasbeehStore.getState());
    }
  } catch (error) {
    const isOffline = !navigator.onLine;
    setSyncStatus(isOffline ? 'offline' : 'error');
    console.error('[CloudSync] Error fetching from cloud:', error);
  }
};

// ── Sync To Cloud (full state) ─────────────────────────────────────────────
const syncToCloud = async (uid: string, state: TasbeehState) => {
  setSyncStatus('syncing');
  try {
    const userDocRef = doc(db, 'users', uid);
    const now = new Date().toISOString();

    const dataToSave = {
      // ── Transactions / History ─────────────────────────────────────────
      dailyRecords:           state.dailyRecords,
      sessions:               state.sessions,
      sessionMoodRatings:     state.sessionMoodRatings,

      // ── Status / Stats ─────────────────────────────────────────────────
      totalAllTime:           state.totalAllTime,
      totalHasanat:           state.totalHasanat,
      personalBest:           state.personalBest,
      streakDays:             state.streakDays,
      longestStreak:          state.longestStreak,
      lastActiveDate:         state.lastActiveDate,

      // ── Awards / Achievements ──────────────────────────────────────────
      unlockedAchievements:   state.unlockedAchievements,

      // ── Dhikr Library / User Content ──────────────────────────────────
      dhikrs:                 state.dhikrs,
      customDhikrs:           state.customDhikrs,
      favoriteDhikrIds:       state.favoriteDhikrIds,
      niyyah:                 state.niyyah,

      // ── Reminders & Notifications ──────────────────────────────────────
      reminders:              state.reminders,
      reminderEnabled:        state.reminderEnabled,
      syncPrayerTimes:        state.syncPrayerTimes,
      autoStartPostPrayerTasbeeh: state.autoStartPostPrayerTasbeeh,
      lazyDayRecoveryEnabled: state.lazyDayRecoveryEnabled,

      // ── Preferences & UI Settings ──────────────────────────────────────
      theme:                  state.theme,
      themeSettings:          state.themeSettings,
      language:               state.language,
      dailyGoal:              state.dailyGoal,
      counterShape:           state.counterShape,
      showTransliteration:    state.showTransliteration,
      dhikrTextPosition:      state.dhikrTextPosition,
      hadithSlidePosition:    state.hadithSlidePosition,
      hadithSlideDuration:    state.hadithSlideDuration,
      breathingGuideEnabled:  state.breathingGuideEnabled,
      breathingGuideSpeed:    state.breathingGuideSpeed,
      ambientSoundType:       state.ambientSoundType,
      ambientSoundVolume:     state.ambientSoundVolume,
      voiceAnnouncementsEnabled: state.voiceAnnouncementsEnabled,
      hapticPattern:          state.hapticPattern,
      volumeButtonCounting:   state.volumeButtonCounting,
      wakeLockEnabled:        state.wakeLockEnabled,
      hasSeenWelcome:         state.hasSeenWelcome,
      lastSeenVersion:        state.lastSeenVersion,

      lastSyncedAt:           now,
    };

    await setDoc(userDocRef, dataToSave, { merge: true });
    setSyncStatus('synced', now);
    console.log('[CloudSync] Full sync to cloud complete.');
  } catch (error) {
    const isOffline = !navigator.onLine;
    setSyncStatus(isOffline ? 'offline' : 'error');
    console.error('[CloudSync] Error saving to cloud:', error);
  }
};

// ── Delete Account ─────────────────────────────────────────────────────────
export const deleteCloudAccount = async (uid: string) => {
  try {
    stopCloudSync();
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
    console.log('[CloudSync] Deleted user data from cloud.');
  } catch (error) {
    console.error('[CloudSync] Error deleting user data:', error);
    throw error;
  }
};


let unsubscribeStore: (() => void) | null = null;
let syncTimeout: NodeJS.Timeout | null = null;

// ── Sync Status Observable ─────────────────────────────────────────────────
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

let _syncStatus: SyncStatus = 'idle';
let _lastSyncedAt: string | null = null;
const _listeners: Set<(status: SyncStatus, lastSyncedAt: string | null) => void> = new Set();

const setSyncStatus = (status: SyncStatus, lastSyncedAt?: string) => {
  _syncStatus = status;
  if (lastSyncedAt !== undefined) _lastSyncedAt = lastSyncedAt;
  _listeners.forEach((l) => l(_syncStatus, _lastSyncedAt));
};

export const onSyncStatusChange = (
  listener: (status: SyncStatus, lastSyncedAt: string | null) => void
): (() => void) => {
  _listeners.add(listener);
  // Immediately call with current value
  listener(_syncStatus, _lastSyncedAt);
  return () => _listeners.delete(listener);
};

export const getSyncStatus = () => ({ status: _syncStatus, lastSyncedAt: _lastSyncedAt });

// ── Cloud Sync Start/Stop ──────────────────────────────────────────────────
export const startCloudSync = (uid: string) => {
  if (unsubscribeStore) unsubscribeStore();

  unsubscribeStore = useTasbeehStore.subscribe((state: TasbeehState, prevState: TasbeehState) => {
    if (state === prevState) return;
    if (syncTimeout) clearTimeout(syncTimeout);
    syncTimeout = setTimeout(() => {
      syncToCloud(uid, state);
    }, 2000);
  });
};

export const stopCloudSync = () => {
  if (unsubscribeStore) { unsubscribeStore(); unsubscribeStore = null; }
  if (syncTimeout) { clearTimeout(syncTimeout); syncTimeout = null; }
  setSyncStatus('idle');
};

// ── Manual Force Sync ──────────────────────────────────────────────────────
export const manualSyncNow = async (uid: string): Promise<void> => {
  const state = useTasbeehStore.getState();
  await syncToCloud(uid, state);
};

// ── Sync From Cloud (with smart merge) ─────────────────────────────────────
export const syncFromCloud = async (uid: string) => {
  setSyncStatus('syncing');
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const local = useTasbeehStore.getState();
      const newState: Partial<TasbeehState> = {};

      // For cumulative stats: always take the HIGHER value to avoid losing data
      if (data.totalAllTime !== undefined)
        newState.totalAllTime = Math.max(local.totalAllTime, data.totalAllTime);
      if (data.totalHasanat !== undefined)
        newState.totalHasanat = Math.max(local.totalHasanat, data.totalHasanat);
      if (data.personalBest !== undefined)
        newState.personalBest = Math.max(local.personalBest, data.personalBest);
      if (data.streakDays !== undefined)
        newState.streakDays = Math.max(local.streakDays, data.streakDays);

      // For array data: merge, preferring cloud if timestamps differ
      if (data.dailyRecords !== undefined) newState.dailyRecords = data.dailyRecords;
      if (data.sessions !== undefined) newState.sessions = data.sessions;
      if (data.unlockedAchievements !== undefined) {
        newState.unlockedAchievements = Array.from(
          new Set([...local.unlockedAchievements, ...data.unlockedAchievements])
        );
      }

      // Prefer cloud for settings if they differ
      if (data.dhikrs !== undefined) newState.dhikrs = data.dhikrs;
      if (data.lastActiveDate !== undefined) newState.lastActiveDate = data.lastActiveDate;
      if (data.theme !== undefined) newState.theme = data.theme;
      if (data.language !== undefined) newState.language = data.language;
      if (data.dailyGoal !== undefined) newState.dailyGoal = data.dailyGoal;
      if (data.hasSeenWelcome !== undefined) newState.hasSeenWelcome = data.hasSeenWelcome;
      if (data.syncPrayerTimes !== undefined) newState.syncPrayerTimes = data.syncPrayerTimes;
      if (data.customDhikrs !== undefined) newState.customDhikrs = data.customDhikrs;
      if (data.favoriteDhikrIds !== undefined) newState.favoriteDhikrIds = data.favoriteDhikrIds;
      if (data.reminders !== undefined) newState.reminders = data.reminders;

      if (Object.keys(newState).length > 0) {
        useTasbeehStore.setState(newState);
      }

      const lastSyncedAt = data.lastSyncedAt ?? null;
      setSyncStatus('synced', lastSyncedAt ?? undefined);
      console.log('[CloudSync] Synced from cloud.');
    } else {
      // First-time user: push local state up
      await syncToCloud(uid, useTasbeehStore.getState());
    }
  } catch (error) {
    const isOffline = !navigator.onLine;
    setSyncStatus(isOffline ? 'offline' : 'error');
    console.error('[CloudSync] Error fetching from cloud:', error);
  }
};

// ── Sync To Cloud ──────────────────────────────────────────────────────────
const syncToCloud = async (uid: string, state: TasbeehState) => {
  setSyncStatus('syncing');
  try {
    const userDocRef = doc(db, 'users', uid);
    const now = new Date().toISOString();
    const dataToSave = {
      totalAllTime: state.totalAllTime,
      dailyRecords: state.dailyRecords,
      streakDays: state.streakDays,
      lastActiveDate: state.lastActiveDate,
      dhikrs: state.dhikrs,
      theme: state.theme,
      language: state.language,
      dailyGoal: state.dailyGoal,
      hasSeenWelcome: state.hasSeenWelcome,
      syncPrayerTimes: state.syncPrayerTimes,
      sessions: state.sessions,
      unlockedAchievements: state.unlockedAchievements,
      totalHasanat: state.totalHasanat,
      personalBest: state.personalBest,
      customDhikrs: state.customDhikrs,
      favoriteDhikrIds: state.favoriteDhikrIds,
      reminders: state.reminders,
      lastSyncedAt: now,
    };
    await setDoc(userDocRef, dataToSave, { merge: true });
    setSyncStatus('synced', now);
  } catch (error) {
    const isOffline = !navigator.onLine;
    setSyncStatus(isOffline ? 'offline' : 'error');
    console.error('[CloudSync] Error saving to cloud:', error);
  }
};

// ── Delete Account ─────────────────────────────────────────────────────────
export const deleteCloudAccount = async (uid: string) => {
  try {
    stopCloudSync();
    const userDocRef = doc(db, 'users', uid);
    await deleteDoc(userDocRef);
    console.log('[CloudSync] Deleted user data from cloud.');
  } catch (error) {
    console.error('[CloudSync] Error deleting user data:', error);
    throw error;
  }
};
