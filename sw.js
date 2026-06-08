/* Service worker: network-first so the latest build always loads when online,
 * falling back to cache when offline (the app still installs + works offline). */
const CACHE = "wcxi-v16";
const ASSETS = [
  "./", "./index.html", "./style.css",
  "./data.js", "./data_extra.js", "./data_full.js", "./data_legacy.js", "./positions.js", "./nations.js", "./engine.js", "./game.js",
  "./manifest.webmanifest",
  "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-180.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(function (resp) {
      var copy = resp.clone();
      caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
      return resp;
    }).catch(function () {
      return caches.match(e.request).then(function (cached) { return cached || caches.match("./index.html"); });
    })
  );
});
