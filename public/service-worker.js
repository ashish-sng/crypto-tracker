/* eslint-env serviceworker */
const CACHE_NAME = 'crypto-tracker-cache-v1';
const OFFLINE_URL = '/offline.html';

// List of resources to cache
const RESOURCES_TO_CACHE = [
  OFFLINE_URL,
  '/', // Main route
  '/index.html', // Main app entry
  '/static/js/bundle.js', // App JavaScript bundle
  '/static/css/main.css', // App CSS
  '/offline/Game/offlineGame.css', // Offline animation styles
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(RESOURCES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate the service worker immediately
});

self.addEventListener('activate', (event) => {
  // Cleanup old caches
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (response) {
          return response; // Return cached resource if available
        } else if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL); // Return offline page for navigation requests
        }
      });
    })
  );
});
