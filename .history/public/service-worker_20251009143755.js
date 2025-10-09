const cacheName = 'express-app-cache-v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/main.js',
    '/offline.html'
  ];
  

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
