const CACHE_NAME = 'express-pwa-cache-v1';
const ASSETS = [
  '/',
  '/pages/account.html',
  '/pages/chat.html',
  '/pages/help.html',
  '/pages/manifest.json',
  '/pages/offline.html',
  '/pages/personalInfo.html',
  '/pages/profileCentre.html',
  '/pages/signin.html',
  '/pages/sources/css/chat.css',
  '/pages/sources/css/contacts.css',
  '/pages/sources/css/login.css',
  '/pages/sources/js/chat.js',
  '/pages/sources/js/contacts.js',
  '/pages/sources/js/login.js',
];

// --- INSTALL EVENT ---
self.addEventListener('install', event => {
  console.log('[Service Worker] Install event started...');
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        console.log('[Service Worker] Caching assets...');
        await cache.addAll(ASSETS);
        console.log('[Service Worker] All assets cached successfully.');
        await self.skipWaiting();
      } catch (err) {
        console.error('[Service Worker] Install failed:', err);
      }
    })()
  );
});

// --- ACTIVATE EVENT ---
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activate event...');
  event.waitUntil(
    (async () => {
      try {
        const keys = await caches.keys();
        await Promise.all(
          keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        );
        console.log('[Service Worker] Old caches cleared.');
        await self.clients.claim();
      } catch (err) {
        console.error('[Service Worker] Activation failed:', err);
      }
    })()
  );
});

// --- FETCH EVENT ---
self.addEventListener('fetch', event => {
  try {
    // Handle navigation requests first (pages)
    if (event.request.mode === 'navigate') {
      console.log('[Service Worker] Navigation fetch:', event.request.url);
      event.respondWith(
        fetch(event.request).catch(async err => {
          console.warn('[Service Worker] Network failed, serving offline page:', err);
          return await caches.match('/pages/offline.html');
        })
      );
      return;
    }

    // For other requests: try cache first, then network
    event.respondWith(
      (async () => {
        try {
          const cached = await caches.match(event.request);
          if (cached) {
            console.log('[Service Worker] Serving from cache:', event.request.url);
            return cached;
          }

          const resp = await fetch(event.request);
          console.log('[Service Worker] Fetched from network:', event.request.url);
          // optional: runtime caching
          // const cache = await caches.open(CACHE_NAME);
          // cache.put(event.request, resp.clone());
          return resp;
        } catch (err) {
          console.error('[Service Worker] Fetch error:', err);
          return await caches.match('/pages/offline.html');
        }
      })()
    );
  } catch (outerErr) {
    console.error('[Service Worker] Fetch event failed to process:', outerErr);
  }
});
