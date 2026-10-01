// Simple Vite + React service worker
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service Worker activated.');
  event.waitUntil(clients.claim());
});

// Optional: basic caching for offline support
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open('arogyavani-cache').then(cache =>
      cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
        return response || fetchPromise;
      })
    )
  );
});
