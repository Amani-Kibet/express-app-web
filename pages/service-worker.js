// Service Worker for Express PWA
const cacheName = 'express-app-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/offline.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install Event – caches all assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        console.log('[Service Worker] Caching all assets');
        return cache.addAll(assetsToCache);
      })
  );
  self.skipWaiting();
});

// Activate Event – cleans up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== cacheName).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event – serves cached assets, network fallback, offline page
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Serve cached file
        return cachedResponse;
      }
      // Fetch from network and cache dynamically
      return fetch(event.request)
        .then(networkResponse => {
          return caches.open(cacheName).then(cache => {
            // Only cache GET requests
            if (event.request.method === 'GET') {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          // Offline fallback
          if (event.request.mode === 'navigate' || event.request.destination === 'document') {
            return caches.match('/pages/offline.html');
          }
        });
    })
  );
});
