import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, push, set, serverTimestamp } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEreFktmUV1ZjMZK0M3_jNuBVNoIIz_sA",
  authDomain: "ifis-850b5.firebaseapp.com",
  projectId: "ifis-850b5",
  storageBucket: "ifis-850b5.firebasestorage.app",
  messagingSenderId: "1000757744732",
  appId: "1:1000757744732:web:f9c4097aacda7a7b194299",
  // Note: If databaseURL is missing from your console snippet, ensure you have clicked "Create Database" 
  // in the Firebase Console under Build > Realtime Database.
  databaseURL: "https://ifis-850b5-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Publish a live activity event to the global feed
export function publishActivityEvent(
  type: 'milestone' | 'sprint_complete' | 'new_user' | 'community_goal' | 'streak',
  message: string
) {
  try {
    const feedRef = dbRef(database, 'events/global/feed');
    const newEventRef = push(feedRef);
    set(newEventRef, {
      type,
      message,
      timestamp: Date.now(),
    });
  } catch (e) {
    // Silently fail — non-critical feature
  }
}

// ─── Firebase User Data Persistence ─────────────────────────────────────
function getDeviceId(): string {
  let deviceId = localStorage.getItem('visitor_device_id');
  if (!deviceId) {
    deviceId = 'anon_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('visitor_device_id', deviceId);
  }
  return deviceId;
}

export async function saveUserDataToFirebase(data: Record<string, any>): Promise<boolean> {
  try {
    const deviceId = getDeviceId();
    const userDataRef = dbRef(database, `users/${deviceId}/data`);
    await set(userDataRef, {
      ...data,
      _lastSaved: Date.now(),
    });
    return true;
  } catch (e) {
    console.error('Firebase save failed:', e);
    return false;
  }
}

export async function loadUserDataFromFirebase(): Promise<Record<string, any> | null> {
  try {
    const deviceId = getDeviceId();
    const userDataRef = dbRef(database, `users/${deviceId}/data`);
    const { get: fbGet } = await import('firebase/database');
    const snap = await fbGet(userDataRef);
    if (snap.exists()) {
      return snap.val();
    }
    return null;
  } catch (e) {
    console.error('Firebase load failed:', e);
    return null;
  }
}
