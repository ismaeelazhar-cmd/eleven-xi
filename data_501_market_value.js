/* data_501_market_value.js — Football 501 category: highest current
 * market values in world football. Value = € millions (rounded).
 *
 * VERIFICATION (B6 pipeline): Transfermarkt market value rankings (primary),
 * cross-checked against The Canary / RankingTour reporting citing the same
 * June 2026 Transfermarkt update. asOf: 2026-07-08. VERY HIGH
 * re-verification cadence — market values update constantly through a
 * season, this is the most volatile category in the game and should be
 * re-checked before any major push, not just seasonally. */
window.FB501_DATA = window.FB501_DATA || {};
window.FB501_DATA.market_value = {
  label: "Highest market value",
  unit: "£m value",
  asOf: "2026-07-08",
  source: "https://www.transfermarkt.us/spieler-statistik/wertvollstespieler/marktwertetop",
  rows: [
    { n: "Lamine Yamal",       v: 200 },
    { n: "Erling Haaland",     v: 200 },
    { n: "Kylian Mbappe",      v: 200 },
    { n: "Vinicius Junior",    v: 150 },
    { n: "Pedri",              v: 150 },
    { n: "Michael Olise",      v: 150 },
    { n: "Jude Bellingham",    v: 140 },
    { n: "Jamal Musiala",      v: 100 },
    { n: "Alexander Isak",     v: 100 },
    { n: "Fermin Lopez",       v: 100 }
  ]
};
