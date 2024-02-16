const files = [
  '/test2/',
  '/test2/console.css',
  '/test2/events.js',
  '/test2/console.js',
  '/test2/metacom.js',
  '/favicon.ico',
  '/favicon.png',
  '/test2/metarhia.png',
  '/test2/metarhia.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('metarhia').then((cache) => cache.addAll(files)));
});

self.addEventListener('fetch', async ({ request }) => {
  const cache = await caches.open('metarhia');
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.status < 400) cache.put(request, response.clone());
  return response;
});
