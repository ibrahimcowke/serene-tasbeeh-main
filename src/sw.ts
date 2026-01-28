/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

declare let self: ServiceWorkerGlobalScope

// Cleanup outdated caches
cleanupOutdatedCaches()

// Precache resources
precacheAndRoute(self.__WB_MANIFEST)

// Take control immediately
self.skipWaiting()
clientsClaim()

// Periodic Sync Event
// @ts-ignore
self.addEventListener('periodicsync', (event) => {
  console.log('Periodic Sync fired', event)
  // Logic to update data in background
})

// Background Sync Event
// @ts-ignore
self.addEventListener('sync', (event) => {
  console.log('Background Sync fired', event)
  // Logic to sync data
})

// Push Notification Event
self.addEventListener('push', (event) => {
  console.log('Push received', event)
  const data = event.data?.json() ?? { title: 'Tasbeeh', body: 'Time for Dhikr' }
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
    })
  )
})

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0]
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i]
          }
        }
        return client.focus()
      }
      return self.clients.openWindow('/')
    })
  )
})
