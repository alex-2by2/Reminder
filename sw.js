const CACHE_NAME = 'master-reminder-v3';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(response => {
            // જો ફાઈલ કેશ (Cache) માં હોય તો તે આપો, નહીંતર ઇન્ટરનેટ પરથી લાવો
            return response || fetch(e.request).catch(() => {
                // જો ઇન્ટરનેટ બંધ હોય (Offline) તો એપ ક્રેશ થવાને બદલે મેઈન પેજ જ ખૂલશે
                if (e.request.mode === 'navigate') {
                    return caches.match('/');
                }
            });
        })
    );
});
