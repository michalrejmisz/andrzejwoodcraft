const CACHE_NAME = 'woodcalc-v1'
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // Statyczne zasoby Next.js będą automatycznie dodane
]

// Instalacja Service Worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache opened')
        return cache.addAll(urlsToCache)
      })
  )
})

// Przechwytywanie requestów
self.addEventListener('fetch', function(event) {
  // Cachuj tylko GET requesty
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Zwróć z cache jeśli dostępne
        if (response) {
          return response
        }
        
        // Inaczej pobierz z sieci
        return fetch(event.request).then(
          function(response) {
            // Sprawdź czy response jest validy
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Sklonuj response
            var responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then(function(cache) {
                // Cachuj tylko GET requesty
                if (event.request.method === 'GET') {
                  cache.put(event.request, responseToCache)
                }
              })

            return response
          }
        ).catch(function() {
          // Fallback dla offline - zwróć główną stronę
          if (event.request.destination === 'document') {
            return caches.match('/')
          }
        })
      })
  )
})

// Aktualizacja cache
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
}) 