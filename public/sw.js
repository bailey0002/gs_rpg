/* Grey Stratum — lightweight service worker
   - Network-first for navigation (HTML)
   - Cache-first for static assets (JS/CSS/images/fonts/video)
*/
const VERSION = 'gs-v1';
const PAGES_CACHE = `${VERSION}-pages`;
const ASSETS_CACHE = `${VERSION}-assets`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => {
      if (k.startsWith('gs-') && k !== PAGES_CACHE && k !== ASSETS_CACHE) {
        return caches.delete(k);
      }
      return undefined;
    }));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Navigation requests: network-first
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(PAGES_CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cache = await caches.open(PAGES_CACHE);
        const cached = await cache.match(req);
        return cached || caches.match('./');
      }
    })());
    return;
  }

  // Static assets: cache-first
  const dest = req.destination;
  if (['script','style','image','font','video'].includes(dest)) {
    event.respondWith((async () => {
      const cache = await caches.open(ASSETS_CACHE);
      const cached = await cache.match(req);
      if (cached) return cached;
      const res = await fetch(req);
      cache.put(req, res.clone());
      return res;
    })());
  }
});
