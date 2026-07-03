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
