/* data_fixups.js — runs after all World Cup data + positions.js are loaded.
 * Fixes two issues in WORLD_CUP_DATA:
 *   1) Players missing a granular position (only broad p:"DEF"/"MID"/...) — these
 *      showed an unusable "DEF/MID" badge. We fill a specific gp, preferring the
 *      curated PLAYER_POSITIONS map, then a sensible per-line cycle.
 *   2) Ratings were flat across all tiers (minnows like China sat at ~82 avg, same
 *      as elite sides). We pull each squad down toward a tier-appropriate average.
 *      Elites are untouched; only inflated squads are reduced (never inflated).
 */
(function () {
  "use strict";
  var D = window.WORLD_CUP_DATA;
  if (!D) return;
  var PP = window.PLAYER_POSITIONS || {};

  /* ---- 1) Position fill ---- */
  var DCYC = ["RB", "CB", "LB", "CB", "RB", "LB", "CB", "CB"];
  var MCYC = ["CDM", "CM", "CAM", "RM", "LM", "CM", "CDM", "CM"];
  var FCYC = ["ST", "RW", "LW", "ST", "RW", "LW"];
  function fillPositions(squad) {
    var i = { DEF: 0, MID: 0, FWD: 0 };
    squad.forEach(function (p) {
      if (p.gp) return;                        // already has a granular position
      var listed = PP[p.n];                    // curated real position wins
      if (listed) { p.gp = listed.split(",")[0].trim(); return; }
      var line = p.p;
      if (line === "GK") { p.gp = "GK"; }
      else if (line === "DEF") { p.gp = DCYC[i.DEF++ % DCYC.length]; }
      else if (line === "MID") { p.gp = MCYC[i.MID++ % MCYC.length]; }
      else if (line === "FWD") { p.gp = FCYC[i.FWD++ % FCYC.length]; }
      else { p.gp = "CM"; }
    });
  }

  /* ---- 2) Rating tiers (target squad average) ---- */
  var ELITE = ["Brazil","Argentina","Germany","West Germany","France","Italy","Spain",
    "Netherlands","England","Portugal","Hungary"];
  var STRONG = ["Belgium","Uruguay","Croatia","Mexico","Colombia","Denmark","Sweden",
    "Switzerland","Poland","Serbia","Yugoslavia","Soviet Union","Russia","Ukraine",
    "Czech Republic","Czechoslovakia","Senegal","Morocco","Ghana","Nigeria","Cameroon",
    "Ivory Coast","Japan","South Korea","USA","United States","Chile","Austria","Scotland",
    "Republic of Ireland","Ireland","Wales","Romania","Norway","Bulgaria","Egypt","Turkey",
    "Greece","Australia","Ecuador","Paraguay","Peru","Iran","Tunisia","Algeria","Costa Rica"];
  var ES = {}, SS = {};
  ELITE.forEach(function (n) { ES[n] = 1; });
  STRONG.forEach(function (n) { SS[n] = 1; });
  function targetAvg(nat) { return ES[nat] ? 84 : SS[nat] ? 79 : 73; }

  Object.keys(D).forEach(function (nat) {
    var tgt = targetAvg(nat), yrs = D[nat].years;
    Object.keys(yrs).forEach(function (y) {
      var sq = yrs[y];
      if (!sq || !sq.length) return;
      fillPositions(sq);
      var sum = 0; sq.forEach(function (p) { sum += (p.r || 75); });
      var avg = sum / sq.length;
      var shift = avg - tgt;
      if (shift > 0.5) {                         // only pull down inflated squads
        sq.forEach(function (p) {
          p.r = Math.max(58, Math.min(99, Math.round((p.r || 75) - shift)));
        });
      }
    });
  });
})();
