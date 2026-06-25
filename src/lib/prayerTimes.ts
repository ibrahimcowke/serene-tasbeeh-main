import { useTasbeehStore } from '@/store/tasbeehStore';

/**
 * Requests geolocation coordinates and updates the default prayer reminders
 * to match local calculated prayer times using the free Aladhan API.
 */
export async function initPrayerTimeReminders(force = false) {
  if (typeof window === 'undefined' || !('geolocation' in navigator)) {
    return;
  }

  const syncEnabled = useTasbeehStore.getState().syncPrayerTimes;
  if (!force && syncEnabled !== true) {
    return;
  }


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
            { label: 'Maghrib Dhikr', time: timings.Maghrib },
            { label: 'Evening Dhikr', time: timings.Isha },
          ];

          for (const item of map) {
            const index = reminders.findIndex((r) => r.label === item.label);
            if (index > -1 && item.time) {
              const formattedTime = item.time.substring(0, 5); // Ensure HH:MM format
              if (reminders[index].time !== formattedTime) {
                reminders[index] = { ...reminders[index], time: formattedTime };
                changed = true;
              }
            }
          }

          if (changed) {
            useTasbeehStore.setState({ reminders });
            // Sync updated reminders with Capacitor Notification engine if enabled
            if (store.reminderEnabled && typeof store.addReminder === 'function') {
              const { NotificationManager } = await import('./notifications');
              NotificationManager.syncReminders(reminders, true);
            }
          }
        }
      } catch (e) {
        console.warn('Geolocation or prayer times sync failed:', e);
      }
    },
    (err) => {
      console.log('Geolocation permission skipped or unavailable for prayer times.', err);
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 86400000 }
  );
}


