var CACHE = 'rqa-v1';
var ARQUIVOS = ['./', './index.html', './manifest.json'];
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(cache){ return cache.addAll(ARQUIVOS); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys){ return Promise.all(keys.map(function(k){ if(k!==CACHE) return caches.delete(k); })); }).then(function(){ return self.clients.claim(); }));
});
self.addEventListener('fetch', function(e) {
  if (e.request.mode === 'navigate') {
    e.respondWith(caches.match('./index.html').then(function(cached){
      if(cached){ fetch(e.request).then(function(res){ if(res && res.ok){ caches.open(CACHE).then(function(cache){ cache.put('./index.html', res.clone()); }); } }).catch(function(){}); return cached; }
      return fetch(e.request);
    }));
    return;
  }
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }).catch(function(){ return caches.match('./index.html'); }));
});
