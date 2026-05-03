const STATIC_CACHE = 'splitscreen-static-v6';
const API_CACHE = 'splitscreen-api-v6';

const APP_SHELL = [
    '/',
    '/auth',
    '/offline.html',

    '/css/styles.css',

    '/js/APIClient.js',
    '/js/HTTPClient.js',
    '/js/auth.js',
    '/js/carousel.js',
    '/js/gamePage.js',
    '/js/gamePageAuth.js',
    '/js/home.js',
    '/js/homeAuth.js',
    '/js/login.js',
    '/js/newUser.js',
    '/js/profile.js',
    '/js/search.js',
    '/js/searchAuth.js',
    '/js/user.js',
    '/js/registerSW.js',
    '/manifest.webmanifest',

    '/images/splitscreen-logo.png',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys
                    .filter((key) => key !== STATIC_CACHE && key !== API_CACHE)
                    .map((key) => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

function isStaticAsset(request) {
    const url = new URL(request.url);

    return (
        url.origin === self.location.origin && 
        ['style', 'script', 'image', 'font'].includes(request.destination)
    );
}

function isPublicApiRequest(request) {
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return false;
    }

    return (
        url.pathname.startsWith('/api/games/') || 
        url.pathname === '/api/reviews' || 
        url.pathname.startsWith('/api/reviews/game/')
    );
}

async function cacheFirst(request, cacheName) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }

    const response = await fetch(request);

    if (response.ok || response.type === 'opaque') {
        const cache = await caches.open(cacheName);
        cache.put(request, response.clone());
    }

    return response;
}

async function networkFirst(request, cacheName, isNavigation = false) {
    try {
        const response = await fetch(request);

        if (response.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, response.clone());
        }

        return response;
    } catch (err) {
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }

        if (isNavigation) {
            const url = new URL(request.url);
            return (
                await caches.match(url.pathname) || 
                await caches.match('/offline.html') ||
                await caches.match('/') ||
                Response.error()
            );
        }

        throw err;
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached  = await cache.match(request);

    const networkFetch = fetch(request).then((response) => {
        if (response.ok || response.type === 'opaque') {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);

    return cached || networkFetch;
}

self.addEventListener('fetch', (event) => {
    const {request} = event;
    const url = new URL(request.url);

    if(request.method !== 'GET') {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request, STATIC_CACHE, true));
        return;
    }

    if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
        return;
    }

    if (isPublicApiRequest(request)) {
        event.respondWith(networkFirst(request, API_CACHE));
        return;
    }

    if (url.origin !== self.location.origin && 
        (request.destination === 'script' || request.destination === 'style')) {
            event.respondWith(staleWhileRevalidate(request, STATIC_CACHE));
    }
});