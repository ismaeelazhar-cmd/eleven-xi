/* data_roulette_pools.js — Transfer Roulette: which nationality/position/
 * decade values are eligible to appear on the spin reels.
 *
 * Deliberately NOT a new player database — Transfer Roulette validates
 * guesses by live-filtering the player data ALREADY loaded from data.js
 * (window.WORLD_CUP_DATA: COUNTRY -> years -> [{n, p, r}]). This file only
 * defines which reel VALUES are allowed to appear, chosen to guarantee
 * every nationality/position/decade combination has real answers. */
window.ROULETTE_POOLS = {
  positions: ["GK", "DEF", "MID", "FWD"],
  /* Nations with deep enough World Cup squad data across multiple
     decades that most nationality×position×decade combos are answerable. */
  nations: [
    "Brazil", "Argentina", "Germany", "Italy", "France", "England",
    "Spain", "Netherlands", "Portugal", "Uruguay", "Belgium", "Croatia",
    "Mexico", "USA", "Japan", "South Korea", "Nigeria", "Senegal",
    "Cameroon", "Morocco", "Colombia", "Chile", "Sweden", "Poland"
  ],
  /* Decades derived from the squad years actually present in the data. */
  decades: ["1970s", "1980s", "1990s", "2000s", "2010s", "2020s"]
};
