const CACHE = 'ribbon-v9';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './manifest.webmanifest',
  './icons/icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png',
  './fonts/cormorant-garamond-latin-400-normal.woff2', './fonts/cormorant-garamond-latin-500-normal.woff2', './fonts/cormorant-garamond-latin-600-normal.woff2',
  './fonts/cormorant-garamond-latin-400-italic.woff2', './fonts/cormorant-garamond-latin-500-italic.woff2', './fonts/inter-latin-wght-normal.woff2'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// The app itself (HTML, JS, CSS, manifest) is network-first, so an online visitor never runs a stale or mixed version;
// fonts and icons are cache-first. Offline, everything falls back to the cache.
const STATIC = /\/(fonts|icons)\//;
const timeout = (ms, p) => new Promise((ok, no) => { const t = setTimeout(() => no(new Error('timeout')), ms); p.then(v => { clearTimeout(t); ok(v); }, e => { clearTimeout(t); no(e); }); });
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (STATIC.test(url.pathname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone())); return res; })));
    return;
  }
  e.respondWith(timeout(4000, fetch(req, { cache: 'no-cache' })).then(res => {
    if (res.ok) caches.open(CACHE).then(c => c.put(req, res.clone()));
    return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html'))));
});
