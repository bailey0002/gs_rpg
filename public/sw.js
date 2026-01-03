self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Basic fetch passthrough (can be expanded later)
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
