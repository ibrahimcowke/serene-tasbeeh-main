import { createClient } from '@supabase/supabase-js';

// Load Supabase environment variables from Vite
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Initialize client only if variables exist
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Silently synchronizes the user's state payload to the database.
 * Falls back to console simulation logs if credentials are not configured.
 */
export async function syncStateToCloud(deviceUuid: string, payload: any) {
  if (!deviceUuid) return;

  const dataToSync = {
    totalAllTime: payload.totalAllTime,
    streakDays: payload.streakDays,
    longestStreak: payload.longestStreak,
    dailyRecords: payload.dailyRecords,
    customDhikrs: payload.customDhikrs,
    lastActiveDate: payload.lastActiveDate,
    totalHasanat: payload.totalHasanat,
    theme: payload.theme,
    counterShape: payload.counterShape,
    reminders: payload.reminders
  };

  if (!supabase) {
    // Simulated cloud backup
    console.log(
      `[Cloud Sync Simulation] Saved device state for key: ${deviceUuid}`,
      `Total count: ${dataToSync.totalAllTime}, Hasanat: ${dataToSync.totalHasanat}`
    );
    return;
  }

  try {
    const { error } = await supabase
      .from('user_sync')
      .upsert({
        device_uuid: deviceUuid,
        payload: dataToSync,
        updated_at: new Date().toISOString()
      }, { onConflict: 'device_uuid' });

    if (error) {
      console.warn('[Supabase Sync Warning] Failed to update remote records:', error.message);
    } else {
      console.log('[Supabase Sync Success] Device state successfully backed up.');
    }
  } catch (error) {
    console.warn('[Supabase Sync Network Exception] Sync deferred until online:', error);
  }
}

/**
 * Fetches the user's synced payload from the database.
 */
export async function fetchStateFromCloud(deviceUuid: string) {
  if (!supabase || !deviceUuid) return null;

  try {
    const { data, error } = await supabase
      .from('user_sync')
      .select('payload')
      .eq('device_uuid', deviceUuid)
      .maybeSingle();

    if (error) {
      console.warn('[Supabase Sync Warning] Failed to fetch remote record:', error.message);
      return null;
    }
    return data?.payload || null;
  } catch (error) {
    console.warn('[Supabase Sync Network Exception] Failed to fetch remote record:', error);
    return null;
  }
}
