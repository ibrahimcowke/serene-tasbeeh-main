import { LocalNotifications } from '@capacitor/local-notifications';
import { useTasbeehStore } from '@/store/tasbeehStore';

const LAZY_DAY_NOTIFICATION_ID = 999001;

const LAZY_DAY_MESSAGES = [
  "You haven't started your dhikr yet today 🌙 — a few moments can brighten your day.",
  "Don't let today pass without remembrance. Your soul is waiting 📿",
  "Even one SubhanAllah counts today ✨ — open Serene Tasbeeh now.",
  "The angels are waiting for your dhikr tonight 🌟",
  "A gentle nudge: your daily dhikr is still waiting 💫",
];

/**
 * Schedules a native local notification at 8:30 PM every day.
 * The notification fires regardless of whether the user has done dhikr —
 * the banner inside the app (LazyDayBanner) handles the conditional display.
 */
export async function scheduleLazyDayNotification(): Promise<void> {
  try {
    // Cancel any existing lazy day notification first
    await cancelLazyDayNotification();

    const check = await LocalNotifications.checkPermissions();
    if (check.display !== 'granted') return;

    const randomMsg = LAZY_DAY_MESSAGES[Math.floor(Math.random() * LAZY_DAY_MESSAGES.length)];

    await LocalNotifications.schedule({
      notifications: [
        {
          id: LAZY_DAY_NOTIFICATION_ID,
          title: 'Serene Tasbeeh 🌙',
          body: randomMsg,
          schedule: {
            on: { hour: 20, minute: 30 },
            repeats: true,
            allowWhileIdle: true,
          },
          sound: 'default',
          actionTypeId: '',
          extra: { type: 'lazy_day' },
        } as any,
      ],
    });
    console.log('[LazyDay] Scheduled nightly 8:30 PM recovery notification.');
  } catch (e) {
    // Silently fail on web — the in-app banner handles it there
    console.warn('[LazyDay] Could not schedule native notification:', e);
  }
}

export async function cancelLazyDayNotification(): Promise<void> {
  try {
    await LocalNotifications.cancel({
      notifications: [{ id: LAZY_DAY_NOTIFICATION_ID }],
    });
  } catch {
    // ignore
  }
}

/**
 * Returns true if the user has NOT done any dhikr today.
 */
export function isLazyDay(): boolean {
  const { dailyRecords } = useTasbeehStore.getState();
  const today = new Date().toISOString().split('T')[0];
  const todayRecord = dailyRecords.find((r) => r.date === today);
  return !todayRecord || todayRecord.totalCount === 0;
}

/**
 * Returns true if the current time is at or after 17:00 (5 PM).
 */
export function isEveningOrLater(): boolean {
  return new Date().getHours() >= 17;
}
