import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useTasbeehStore, TasbeehState } from '@/store/tasbeehStore';

let unsubscribeStore: (() => void) | null = null;
let syncTimeout: NodeJS.Timeout | null = null;

export const startCloudSync = (uid: string) => {
  if (unsubscribeStore) {
    unsubscribeStore();
  }

  // Subscribe to changes in the Zustand store
  unsubscribeStore = useTasbeehStore.subscribe((state: TasbeehState, prevState: TasbeehState) => {
    // Basic optimization to not sync if it's the exact same object reference
    if (state === prevState) return;

    // Debounce the writes to avoid hitting Firestore rate limits when user is tapping quickly
    if (syncTimeout) {
      clearTimeout(syncTimeout);
    }

    syncTimeout = setTimeout(() => {
      syncToCloud(uid, state);
    }, 2000); // Wait 2 seconds of inactivity before writing to Firestore
  });
};

export const stopCloudSync = () => {
  if (unsubscribeStore) {
    unsubscribeStore();
    unsubscribeStore = null;
  }
  if (syncTimeout) {
    clearTimeout(syncTimeout);
    syncTimeout = null;
  }
};

export const syncFromCloud = async (uid: string) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Only pull specific keys we want to override local state
      // E.g., counts, history, daily records, dhikrs
      const storeState = useTasbeehStore.getState();
      
      const newState: Partial<TasbeehState> = {};
      
      if (data.totalAllTime !== undefined) newState.totalAllTime = data.totalAllTime;
      if (data.dailyRecords !== undefined) newState.dailyRecords = data.dailyRecords;
      if (data.streakDays !== undefined) newState.streakDays = data.streakDays;
      if (data.lastActiveDate !== undefined) newState.lastActiveDate = data.lastActiveDate;
      if (data.dhikrs !== undefined) newState.dhikrs = data.dhikrs;
      if (data.theme !== undefined) newState.theme = data.theme;
      if (data.language !== undefined) newState.language = data.language;
      if (data.dailyGoal !== undefined) newState.dailyGoal = data.dailyGoal;
      if (data.hasSeenWelcome !== undefined) newState.hasSeenWelcome = data.hasSeenWelcome;
      if (data.syncPrayerTimes !== undefined) newState.syncPrayerTimes = data.syncPrayerTimes;
      
      // Update the local state
      if (Object.keys(newState).length > 0) {
        useTasbeehStore.setState(newState);
      }
      console.log('Successfully synced data from cloud.');
    } else {
      // If it doesn't exist, we do our first sync to cloud
      syncToCloud(uid, useTasbeehStore.getState());
    }
  } catch (error) {
    console.error('Error fetching data from cloud:', error);
  }
};

const syncToCloud = async (uid: string, state: TasbeehState) => {
  try {
    const userDocRef = doc(db, 'users', uid);
    
    // Pick the state that matters
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
      lastSyncedAt: new Date().toISOString()
    };

    await setDoc(userDocRef, dataToSave, { merge: true });
  } catch (error) {
    console.error('Error saving data to cloud:', error);
  }
};
