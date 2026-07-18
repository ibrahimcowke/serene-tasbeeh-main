import { useTasbeehStore } from '@/store/tasbeehStore';

export interface PrayerTime {
  name: string;
  time: string; // HH:MM
  label: string;
}

const PRAYER_CACHE_KEY = 'tasbeehly_prayer_times_cache';

interface PrayerCache {
  date: string;
  lat: number;
  lng: number;
  times: PrayerTime[];
}

export async function getPrayerTimesForToday(): Promise<PrayerTime[]> {
  const cached: PrayerCache | null = (() => {
    try { return JSON.parse(localStorage.getItem(PRAYER_CACHE_KEY) || 'null'); } catch { return null; }
  })();
  const todayStr = new Date().toISOString().split('T')[0];
  if (cached && cached.date === todayStr) return cached.times;

  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) { resolve([]); return; }
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://api.aladhan.com/v1/timings/${todayStr}?latitude=${latitude}&longitude=${longitude}&method=2`
          );
          if (!res.ok) throw new Error();
          const json = await res.json();
          const t = json.data?.timings;
          if (!t) throw new Error();
          const times: PrayerTime[] = [
            { name: 'fajr',    time: t.Fajr?.substring(0, 5)    || '', label: 'Fajr' },
            { name: 'dhuhr',   time: t.Dhuhr?.substring(0, 5)   || '', label: 'Dhuhr' },
            { name: 'asr',     time: t.Asr?.substring(0, 5)     || '', label: 'Asr' },
            { name: 'maghrib', time: t.Maghrib?.substring(0, 5) || '', label: 'Maghrib' },
            { name: 'isha',    time: t.Isha?.substring(0, 5)    || '', label: 'Isha' },
          ].filter(p => p.time);
          const cache: PrayerCache = { date: todayStr, lat: latitude, lng: longitude, times };
          localStorage.setItem(PRAYER_CACHE_KEY, JSON.stringify(cache));
          resolve(times);
        } catch {
          resolve(cached?.times || []);
        }
      },
      () => resolve(cached?.times || []),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 86400000 }
    );
  });
}

export function getNextPrayer(times: PrayerTime[]): { prayer: PrayerTime; minutesUntil: number } | null {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const p of times) {
    const [h, m] = p.time.split(':').map(Number);
    const pMins = h * 60 + m;
    if (pMins > nowMins) return { prayer: p, minutesUntil: pMins - nowMins };
  }
  // Wrap to next day's Fajr
  if (times[0]) {
    const [h, m] = times[0].time.split(':').map(Number);
    return { prayer: times[0], minutesUntil: (24 * 60 - nowMins) + h * 60 + m };
  }
  return null;
}

/**
 * Requests geolocation coordinates and updates the default prayer reminders
 * to match local calculated prayer times using the free Aladhan API.
 */
export async function initPrayerTimeReminders(force = false): Promise<boolean> {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return false;
  }

  const syncEnabled = useTasbeehStore.getState().syncPrayerTimes;
  if (!force && syncEnabled !== true) {
    return false;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const todayStr = new Date().toISOString().split('T')[0];
          const res = await fetch(
            `https://api.aladhan.com/v1/timings/${todayStr}?latitude=${latitude}&longitude=${longitude}&method=2`
          );
          if (!res.ok) throw new Error('Failed to fetch prayer times');
          const json = await res.json();
          const timings = json.data?.timings;

          if (timings) {
            const store = useTasbeehStore.getState();
            const reminders = [...store.reminders];
            let changed = false;

            // Map prayer times to existing reminders
            const map = [
              { label: 'Fajr Dhikr', time: timings.Fajr },
              { label: 'Dhuhr Dhikr', time: timings.Dhuhr },
              { label: 'Asr Dhikr', time: timings.Asr },
              { label: 'Maghrib Dhikr', time: timings.Maghrib },
              { label: 'Isha Dhikr', time: timings.Isha },
            ];

            for (const item of map) {
              const index = reminders.findIndex((r) => r.label === item.label);
              if (item.time) {
                const formattedTime = item.time.substring(0, 5); // Ensure HH:MM format
                if (index > -1) {
                  if (reminders[index].time !== formattedTime) {
                    reminders[index] = { ...reminders[index], time: formattedTime };
                    changed = true;
                  }
                } else {
                  // Auto-create missing reminders
                  reminders.push({
                    id: `prayer_${item.label.toLowerCase().replace(' ', '_')}`,
                    time: formattedTime,
                    label: item.label,
                    enabled: true,
                    days: [0, 1, 2, 3, 4, 5, 6]
                  });
                  changed = true;
                }
              }
            }

            if (changed) {
              useTasbeehStore.setState({ reminders });
              // Sync updated reminders with Capacitor Notification engine if enabled
              if (store.reminderEnabled) {
                const { NotificationManager } = await import('./notifications');
                NotificationManager.syncReminders(reminders, true);
              }
            }
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (e) {
          console.warn('Geolocation or prayer times sync failed:', e);
          resolve(false);
        }
      },
      (err) => {
        console.log('Geolocation permission skipped or unavailable for prayer times.', err);
        resolve(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 86400000 }
    );
  });
}


