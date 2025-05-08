
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('keto-cache').then(cache => {
            return cache.addAll(['index.html', 'style.css', 'app.js', 'keto-recipes.json']);
        })
    );
});
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => response || fetch(e.request))
    );
});
