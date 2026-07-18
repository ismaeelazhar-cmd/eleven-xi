/* Service worker: network-first so the latest build always loads when online,
 * falling back to cache when offline (the app still installs + works offline). */
const CACHE = "wcxi-v265";
const ASSETS = [
  "./", "./index.html", "./style.css", "./tokens.css", "./floodlights.css", "./floodlights.js", "./audio.js", "./ratingswar.js", "./draftvscomputer.js",
  "./data.js", "./data_extra.js", "./data_full.js", "./data_legacy.js", "./data_full2.js", "./data_wc_history.js", "./data_patches.js", "./ratings_overrides.js", "./positions.js", "./data_fixups.js", "./cl_clubs.js", "./cl_data.js", "./cl_data2.js", "./nations.js", "./engine.js", "./game.js",
  "./net.js", "./data_mp.js", "./data_euro_history.js", "./data_history.js", "./multiplayer.js",
  "./data_league.js", "./data_championship_history.js", "./league.js", "./daily.js",
  "./football501.js", "./data_501_pl_scorers.js", "./data_501_pl_appearances.js", "./data_501_index.js",
  "./data_501_transfer_fees.js", "./data_501_market_value.js", "./data_501_cl_goals.js", "./data_501_assists.js", "./data_501_clean_sheets.js",
  "./data_501_real_madrid_scorers.js", "./data_501_barcelona_scorers.js", "./data_501_man_utd_scorers.js",
  "./data_501_laliga_scorers.js", "./data_501_seriea_scorers.js", "./data_501_bundesliga_scorers.js",
  "./data_501_cl_appearances.js", "./data_501_intl_caps.js", "./data_501_intl_goals.js",
  "./data_501_bayern_scorers.js", "./data_501_liverpool_scorers.js", "./data_501_juventus_scorers.js",
  "./data_501_arsenal_scorers.js", "./data_501_chelsea_scorers.js", "./data_501_man_city_scorers.js",
  "./data_501_psg_scorers.js", "./data_501_dortmund_scorers.js", "./data_501_ac_milan_scorers.js",
  "./data_501_inter_scorers.js", "./data_501_ajax_scorers.js", "./data_501_atletico_scorers.js",
  "./data_501_ligue1_scorers.js", "./data_501_eredivisie_scorers.js",
  "./data_501_spurs_scorers.js", "./data_501_newcastle_scorers.js", "./data_501_west_ham_scorers.js",
  "./data_501_everton_scorers.js", "./data_501_villa_scorers.js", "./data_501_leeds_scorers.js",
  "./data_501_napoli_scorers.js", "./data_501_roma_scorers.js", "./data_501_sevilla_scorers.js",
  "./data_501_wolves_scorers.js", "./data_501_southampton_scorers.js", "./data_501_crystal_palace_scorers.js",
  "./data_501_fulham_scorers.js", "./data_501_brighton_scorers.js", "./data_501_burnley_scorers.js",
  "./data_501_celtic_scorers.js", "./data_501_rangers_scorers.js", "./data_501_benfica_scorers.js",
  "./data_501_porto_scorers.js", "./data_501_sporting_scorers.js", "./data_501_psv_scorers.js",
  "./data_501_feyenoord_scorers.js", "./data_501_schalke_scorers.js", "./data_501_leverkusen_scorers.js",
  "./data_501_england_scorers.js", "./data_501_brazil_scorers.js", "./data_501_argentina_scorers.js",
  "./data_501_england_caps.js", "./data_501_brazil_caps.js", "./data_501_argentina_caps.js",
  "./data_501_germany_scorers.js", "./data_501_france_scorers.js", "./data_501_spain_scorers.js",
  "./data_501_germany_caps.js", "./data_501_france_caps.js", "./data_501_spain_caps.js",
  "./data_501_italy_scorers.js", "./data_501_netherlands_scorers.js", "./data_501_portugal_scorers.js",
  "./data_501_italy_caps.js", "./data_501_netherlands_caps.js", "./data_501_portugal_caps.js",
  "./data_501_belgium_scorers.js", "./data_501_uruguay_scorers.js", "./data_501_croatia_scorers.js",
  "./data_501_belgium_caps.js", "./data_501_uruguay_caps.js", "./data_501_croatia_caps.js",
  "./data_501_poland_scorers.js", "./data_501_poland_caps.js", "./data_501_sweden_scorers.js",
  "./data_501_sweden_caps.js", "./data_501_denmark_scorers.js", "./data_501_denmark_caps.js",
  "./data_501_wales_scorers.js", "./data_501_wales_caps.js", "./data_501_scotland_scorers.js",
  "./data_501_scotland_caps.js", "./data_501_ireland_scorers.js", "./data_501_ireland_caps.js",
  "./data_501_usa_scorers.js", "./data_501_usa_caps.js", "./data_501_mexico_scorers.js",
  "./data_501_mexico_caps.js", "./data_501_japan_scorers.js", "./data_501_japan_caps.js",
  "./data_501_southkorea_scorers.js", "./data_501_southkorea_caps.js", "./data_501_nigeria_scorers.js",
  "./data_501_nigeria_caps.js", "./data_501_senegal_caps.js",
  "./data_501_egypt_scorers.js", "./data_501_egypt_caps.js", "./data_501_ghana_scorers.js",
  "./data_501_ghana_caps.js", "./data_501_morocco_caps.js",
  "./data_501_cameroon_scorers.js", "./data_501_cameroon_caps.js", "./data_501_colombia_scorers.js",
  "./data_501_colombia_caps.js", "./data_501_chile_scorers.js", "./data_501_chile_caps.js",
  "./data_501_serbia_scorers.js", "./data_501_serbia_caps.js", "./data_501_switzerland_scorers.js",
  "./data_501_switzerland_caps.js", "./data_501_austria_scorers.js", "./data_501_austria_caps.js",
  "./data_501_turkey_scorers.js", "./data_501_turkey_caps.js", "./data_501_ukraine_caps.js", "./data_501_iceland_caps.js",
  "./transferroulette.js", "./data_transfers.js", "./fillthegrid.js",
  "./minefield.js", "./data_minefield_wc_final_scorers.js", "./data_minefield_ballon_dor.js",
  "./data_minefield_cl_final_scorers.js", "./data_minefield_100_caps.js", "./data_minefield_pl_golden_boot.js",
  "./data_minefield_wc_golden_boot.js", "./data_minefield_pl_hattrick.js", "./data_minefield_multi_wc_winner.js",
  "./data_minefield_wc_hattricks.js", "./data_minefield_cl_two_clubs.js", "./data_minefield_two_countries.js",
  "./data_minefield_cl_player_and_manager.js", "./data_minefield_foreign_national_manager.js", "./data_minefield_pfa_player_of_year.js",
  "./topxi.js", "./footballtenable.js",
  /* lazy-loaded on demand — cached by network-first on first access */
  /* "./data_pl_history.js", "./data_laliga_history.js", "./data_seriea_history.js", "./data_bundesliga_history.js", "./data_ligue1_history.js" */
  "./manifest.webmanifest",
  "./icon.svg", "./icon-192.png", "./icon-512.png", "./icon-180.png",
  "./og-image.png", "./logo-full.svg"
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
