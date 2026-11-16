const PAGE = 'detishki-chess-page-1';
const ASSETS = ['index.html'];
self.addEventListener('install', e => e.waitUntil(caches.open(PAGE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (e.request.mode !== 'navigate' && !ASSETS.some(p => new URL(p, self.location).pathname === url.pathname)) return;
  e.respondWith((async () => {
    const cache = await caches.open(PAGE);
    try {
      const response = await fetch(e.request);
      if (response.ok) await cache.put(e.request, response.clone());
      return response;
    } catch (error) {
      return await cache.match(e.request, { ignoreSearch: true })
        || await cache.match(new URL('index.html', self.location).href, { ignoreSearch: true })
        || Response.error();
    }
  })());
});
