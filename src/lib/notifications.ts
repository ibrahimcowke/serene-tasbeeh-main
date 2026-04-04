/**
 * Notification helper for Tasbeehly
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
