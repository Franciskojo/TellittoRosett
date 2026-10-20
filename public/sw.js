// Self-unregistering fallback Service Worker
// Automatically purges stale service workers left behind by other projects on localhost/127.0.0.1
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.registration
      .unregister()
      .then(() => self.clients.matchAll())
      .then((clients) => {
        // Successfully cleaned up legacy service worker
      })
  );
});
