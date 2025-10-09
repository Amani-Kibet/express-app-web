const CACHE_NAME = 'express-pwa-cache-v1';
const ASSETS = [
  '/',
  '/pages/chat.html',
  '/pages/offline.html',    // optional
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // network first for navigation, fallback to cache/offline
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() =>
        caches.match('/pages/offline.html')
      )
    );
    return;
  }

  // for other requests, try cache then network
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(resp => {
      // optionally cache new requests
      return caches.open(CACHE_NAME).then(cache => {
        // cache.put(event.request, resp.clone()); // uncomment if you want runtime caching
        return resp;
      });
    }))
  );
});
