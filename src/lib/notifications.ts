/**
 * Notification helper for tasbeehdikr
 */

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
  if (Notification.permission !== 'granted') return;

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

export function scheduleDailyReminder(hour: number, minute: number) {
  // Note: True background scheduling in PWAs without a server is limited.
  // This function demonstrates how we might store the preference and 
  // trigger a notification if the app is active or via Periodic Sync if available.
  localStorage.setItem('reminder_time', `${hour}:${minute}`);
  console.log(`Reminder scheduled for ${hour}:${minute} (Local simulated)`);
}
