import { LocalNotifications } from '@capacitor/local-notifications';

export interface Reminder {
  id: string;
  time: string; // "HH:MM"
  label: string;
  enabled: boolean;
  days: number[]; // 0-6 (0 = Sunday, ..., 6 = Saturday)
}



const ENGAGING_MESSAGES = [
  "Do not forget to say Alhamdulilaah 🌟",
  "A mindful moment for Dhikr awaits you ✨",
  "Nourish your soul, it's time for Tasbeeh 📿",
  "Even a single SubhanAllah weighs heavy on the scales! ⚖️",
  "Take a deep breath and remember Allah 🌿",
  "Your daily spiritual boost is ready 💫",
  "Keep your tongue moist with the remembrance of Allah 💧",
  "Time to collect some Hasanat! 🏆",
  "A few moments of Dhikr can brighten your whole day ☀️"
];

export const NotificationManager = {
  /**
   * Request native OS permission to display notifications.
   * Returns true if permission was granted, false otherwise.
   */
  async requestPermission(): Promise<boolean> {
    try {
      const check = await LocalNotifications.checkPermissions();
      if (check.display === 'granted') {
        return true;
      }
      const req = await LocalNotifications.requestPermissions();
      return req.display === 'granted';
    } catch (e) {
      console.warn('Native LocalNotifications check/request permission failed:', e);
      return false;
    }
  },

  /**
   * Syncs the app state reminders to the native OS local notification scheduler.
   */
  async syncReminders(reminders: Reminder[], isEnabled: boolean): Promise<void> {
    try {
      // 1. Cancel all previously scheduled notifications to clean up
      const pending = await LocalNotifications.getPending();
      if (pending.notifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.notifications.map(n => ({ id: n.id }))
        });
      }

      // If reminders are disabled globally, we just clear everything and return
      if (!isEnabled) {
        console.log('[NativeReminders] Cleared all scheduled alarms.');
        return;
      }

      const scheduleList = [];

      // 2. Schedule each active reminder
      for (const reminder of reminders) {
        if (!reminder.enabled) {
          continue;
        }

        const [hours, minutes] = reminder.time.split(':').map(Number);
        
        // Generate a numeric 32-bit ID from the reminder's string ID
        const baseId = parseInt(reminder.id.replace(/\D/g, '')) || Math.floor(Math.random() * 100000);

        // Schedule a recurring alarm for each selected weekday
        for (const day of reminder.days) {
          // JS Date.getDay() uses 0 = Sunday, ..., 6 = Saturday.
          // Capacitor Local Notifications weekday is 1-indexed: 1 = Sunday, ..., 7 = Saturday.
          const capacitorWeekday = day + 1;
          const notificationId = (baseId % 10000) + day * 10000;

          const randomMessage = ENGAGING_MESSAGES[Math.floor(Math.random() * ENGAGING_MESSAGES.length)];

          scheduleList.push({
            id: notificationId,
            title: reminder.label || 'Serene Tasbeeh',
            body: randomMessage,
            schedule: {
              on: {
                weekday: capacitorWeekday,
                hour: hours,
                minute: minutes
              },
              repeats: true,
              allowWhileIdle: true // Ensures notifications fire in Doze mode/background
            },
            sound: 'default',
            actionTypeId: '',
            extra: null
          });
        }
      }

      if (scheduleList.length > 0) {
        await LocalNotifications.schedule({
          notifications: scheduleList as any
        });
        console.log(`[NativeReminders] Scheduled ${scheduleList.length} recurring notification alarms.`);
      }
    } catch (e) {
      console.error('[NativeReminders] Error scheduling local notifications:', e);
    }
  }
};

// --- Web Fallbacks & PWA API Compat (original functions) ---

export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications.');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export async function sendLocalNotification(title: string, options?: NotificationOptions) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      ...options,
    });
  } else {
    new Notification(title, options);
  }
}

export async function registerPeriodicSync() {
  if ('serviceWorker' in navigator && 'periodicSync' in (await navigator.serviceWorker.ready)) {
    const registration = await navigator.serviceWorker.ready;
    try {
      // @ts-ignore
      const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
      if (status.state === 'granted') {
        // @ts-ignore
        await registration.periodicSync.register('daily-reminder', {
          minInterval: 12 * 60 * 60 * 1000, // 12 hours
        });
        console.log('Periodic Sync registered');
      }
    } catch (error) {
      console.error('Periodic Sync registration failed:', error);
    }
  }
}
