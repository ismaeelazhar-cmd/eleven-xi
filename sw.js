/* Service worker: network-first so the latest build always loads when online,
 * falling back to cache when offline (the app still installs + works offline). */
const CACHE = "wcxi-v86";
const ASSETS = [
  "./", "./index.html", "./style.css", "./tokens.css", "./floodlights.css", "./floodlights.js", "./ratingswar.js",
  "./data.js", "./data_extra.js", "./data_full.js", "./data_legacy.js", "./data_full2.js", "./data_wc_history.js", "./data_patches.js", "./ratings_overrides.js", "./positions.js", "./data_fixups.js", "./cl_clubs.js", "./cl_data.js", "./cl_data2.js", "./nations.js", "./engine.js", "./game.js",
  "./net.js", "./data_mp.js", "./data_pl_history.js", "./data_euro_history.js", "./data_history.js", "./multiplayer.js",
  "./data_league.js", "./data_laliga_history.js", "./data_seriea_history.js", "./data_bundesliga_history.js", "./data_ligue1_history.js", "./data_championship_history.js", "./league.js",
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
