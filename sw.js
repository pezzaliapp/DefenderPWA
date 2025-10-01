// sw.js — simple offline cache (MIT)
const CACHE = 'defender-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './readme.html',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-180.png'
];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', e=>{
  const req = e.request;
  e.respondWith(
    caches.match(req).then(res => res || fetch(req).then(fr => {
      const copy = fr.clone();
      caches.open(CACHE).then(c=>c.put(req, copy)).catch(()=>{});
      return fr;
    }).catch(()=>caches.match('./index.html')))
  );
});