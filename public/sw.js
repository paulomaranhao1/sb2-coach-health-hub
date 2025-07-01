
const CACHE_NAME = 'sb2coach-v2';
const STATIC_CACHE_URLS = [
  '/',
  '/manifest.json'
];

// Lista de URLs que devem ser ignoradas para evitar erros
const IGNORE_URLS = [
  'facebook.com',
  'facebook.net',
  'fbcdn.net',
  'connect.facebook.net',
  'googleapis.com',
  'google-analytics.com',
  'googletagmanager.com',
  'doubleclick.net',
  'firebase',
  'firestore'
];

// Função para verificar se uma URL deve ser ignorada
function shouldIgnoreUrl(url) {
  return IGNORE_URLS.some(ignored => url.includes(ignored));
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_CACHE_URLS).catch(err => {
          console.warn('SW: Cache addAll failed for some resources:', err);
          return Promise.resolve();
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = request.url;

  // Ignorar requests para URLs externas problemáticas
  if (shouldIgnoreUrl(url)) {
    return;
  }

  // Apenas interceptar requests GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignorar requests para chrome-extension e other protocols
  if (!url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) {
          return response;
        }
        
        return fetch(request).catch(() => {
          // Fallback silencioso para evitar errors no console
          if (request.destination === 'document') {
            return caches.match('/');
          }
          return new Response('', { status: 200 });
        });
      })
  );
});

// Push notifications otimizadas
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do SB2coach.ai',
    icon: '/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png',
    badge: '/lovable-uploads/a9ae0ae0-953a-4e4d-afbd-5f6bf88b1dc6.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 'sb2coach-notification'
    },
    silent: false
  };

  event.waitUntil(
    self.registration.showNotification('SB2coach.ai', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
