const CACHE_NAME = "pdv-cache-v2"; // Mude o número da versão quando fizer alterações
const urlsToCache = [
  "/",
  "/index.html",
  "/css/style.css",
  "/js/index_script.js",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Instala e adiciona ao cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // força ativação imediata
});

// Remove caches antigos ao ativar nova versão
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // força controle imediato das páginas
});

// Intercepta requisições e usa cache ou busca online
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});