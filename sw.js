// sw.js - Simple Caching Service Worker

const CACHE_NAME = 'keto-plan-cache-v1';
// List all the files you want to cache
const urlsToCache = [
  './', // Often caches index.html implicitly
  './index.html',
  './meals.html',
  './snacks.html',
  './drinks.html',
  './notes.html',
  './style.css',
  './script.js',
  './manifest.json',
  // Add paths to your icons here!
  './images/icon-192.png',
  './images/icon-512.png' 
];

// Install event: Cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Serve cached files first, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request); 
      }
    )
  );
});

// Activate event: Clean up old caches (optional but good practice)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME]; // Keep only the current cache
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});