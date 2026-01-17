// @ts-nocheck
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'New Notification';
  const options = {
    body: data.message || 'You have a new notification!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    data: {
      url: data.url || '/'
    }
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      if (windowClients.length > 0) {
        windowClients[0].focus();
        // Optional: Navigate if URL is different
        // windowClients[0].navigate(event.notification.data.url);
      } else {
        self.clients.openWindow(event.notification.data.url);
      }
    })
  );
});
