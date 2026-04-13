const CACHE_NAME = 'master-reminder-v4';

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            // Vercel ના 308 રીડાયરેક્ટ પ્રોબ્લેમથી બચવા આપણે માત્ર રૂટ '/' જ કેશ કરીશું
            return cache.addAll(['/']);
        }).catch(err => console.log('Cache error:', err))
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
    // Network First સ્ટ્રેટેજી: પહેલા ઇન્ટરનેટથી લેવાનો પ્રયાસ કરશે, ના મળે તો જ ઓફલાઈન કેશમાંથી આપશે
    e.respondWith(
        fetch(e.request).catch(() => {
            return caches.match(e.request).then(response => {
                // જો માંગેલી વસ્તુ કેશમાં ના હોય, તો સીધું હોમ પેજ ('/') આપી દો
                return response || caches.match('/');
            });
        })
    );
});
