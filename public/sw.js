const CACHE_NAME = 'scrollstop-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.svg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache).catch(function(error) {
          console.log('Cache add failed:', error);
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(function() {
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      }
    )
  );
});