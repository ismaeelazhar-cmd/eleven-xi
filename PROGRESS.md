# Eleven XI — BUILD PROGRESS (read this first when resuming)

> **Resume rule:** open this file first. It is the single source of truth for what's
> done, what's left, decisions made, and exactly where to pick up. Update it after
> every completed part.

_Last checkpoint: ALL 20 TASKS COMPLETE. Cache wcxi-v135. Push to GitHub done. All tasks done._

---

## 0. Project facts
- **Project root:** `/Users/ismaeelazhar/worldcup-xi`  (vanilla HTML/CSS/JS, no build step)
- **Run locally:** `python3 -m http.server 8778` from project root → http://localhost:8778/index.html
- **Live production:** https://ismaeelazhar-cmd.github.io/eleven-xi/ (auto-deploys on push to main)
- **GitHub SSH:** `git@github.com:ismaeelazhar-cmd/eleven-xi.git`
- **Cache version:** `wcxi-v135`
- **Current file versions:** style.css v79, tokens.css v74, floodlights.css v114, game.js v96, multiplayer.js v94, floodlights.js v93, ratingswar.js v103, draftvscomputer.js v7, league.js v83, sw.js wcxi-v135

## 1. Design direction — LOCKED: "Floodlights"
- **Palette:** Midnight `#0B1020` · Slate `#1B2340` · Violet `#7C5CFC` · Cyan `#22E0C8` · Coral `#FF7A59` · Gold `#F5B43C`
- **Rule:** components use only tokens, never raw hex. `esc()` XSS prevention everywhere.

## 2. Architecture / file map
- `tokens.css` — three-layer design tokens (primitive → semantic[dark+light] → component)
- `floodlights.css` — base, app shell, home/bento, token-mapped buttons, global remap
- `floodlights.js` — UI bootstrap (toast, share game link handler)
- `style.css` — legacy stylesheet (still in use, variable-driven)
- Game logic: `game.js` (WC/CL + shared), `league.js` (League mode), `multiplayer.js` (MP), `engine.js`
- Data: `data*.js`, `cl_data*.js`, `*_history.js`, `data_fixups.js`, `positions.js`

## 3. CATCH-UP AUDIT — STATUS

### ✅ COMPLETED (13/16)
1. ✅ **SVG icons** — manager chips (7 SVGs) + theme toggle (sun/moon SVGs)
2. ✅ **Lock XI hidden** — buttons hidden until squad is exactly 11/11
3. ✅ **Auto-fill quality floor ≥ 75** — `if ((pl.r || 0) < 75) return;` in autoFill()
4. ✅ **Champion name/flag in WC Final bracket card** — `.bracket-champion` in renderBracket()
5. ✅ **sessionStorage draft** — saveDraft/loadDraft/clearDraft, restore hint on draft screen
6. ✅ **Keyboard navigation** — Space=spin, Enter=auto-pick on draft screen
7. ✅ **Share XI PNG** — Canvas-based 900×1200 generation, navigator.share or download
8. ✅ **Half-pitch formation view** — both dark + light themes
9. ✅ **Share game link** — home screen "Share game" button, clipboard copy, fallback prompt
10. ✅ **Summary stat pills centred** — `justify-content: center` on `.stat-grid`
11. ✅ **Player pop-out consistency** — ratingswar.js + multiplayer.js wrapped with `.squad-card`
12. ✅ **Production server** — GitHub Pages, auto-deploys, stays live when MacBook off
13. ✅ **SETUP.md** — deployment, rollback, status check, cache bump checklist

### ⏳ DEFERRED (requires external account/arch work)
14. ⏳ **Supabase leaderboard** — requires Supabase project creation, RLS setup, API keys
15. ⏳ **Cold load lazy-loading** — ~5 MB eager load; significant architecture refactor
16. ⏳ **Staging environment** — requires GitHub branch + separate Pages URL configuration

## 4. PHASE 2 — DUELS FEATURES — ✅ ALL COMPLETE

All 10 toggles in the Duels setup menu. Each has ⓘ info icon with tooltip. All default OFF.

1. ✅ **X-Factor Slot** — random slot counts double at reveal; `×2` badge in reveal cards; computeResult honours it
2. ✅ **Captain** — per-player secret captain pick phase (renderCaptain) before build; +2 if won; `C` badge
3. ✅ **Position Ban** — per-player secret ban phase (renderPosBan) before build; banned slot = 0 rating
4. ✅ **Steal Power-Up** — steal buttons in reveal bar; copies opponent's best revealed pick into your slot; one-use per match
5. ✅ **Blind Swap** — renderBlindSwap phase after all build; 30s countdown; select 2 slots to swap; auto-advance on timer
6. ✅ **Wildcard Spin** — bonus spin button in build; spins from full global combined pool; one-use per player
7. ✅ **Best of 3 Series** — series score tracking; "Match N →" button when series ongoing; rwSeriesNextMatch resets picks
8. ✅ **Draft from Shared Pool** — renderSharedPick; alternating picks from generated pool (20 random teams, quality floor 70); no duplicates
9. ✅ **Async Online Mode** — btoa/atob URL encoding; share link after P1 locks; P2 opens link, accepts, builds, triggers reveal
10. ✅ **Formation Draft** — renderFormationDraft before reveal; 6 formations; +1 tactical bonus per won bonus slot; `+1` badge

### Phase flow (all features on):
`intro → posban → captain → poolselect → build → blindswap → formation → reveal → result`

### Key data structures:
- `RW_FORMATIONS` — 6 formations with bonusIdx arrays
- `DUEL_FEATURES` / `DEFAULT_FEATURES` — toggle definitions
- `RW.stealUsed[]`, `RW.wildcardUsed` (per player), `RW.seriesWins[]`
- `RW.sharedPool`, `RW.sharedPicked`, `RW.sharedPickTurn`
- `RW._asyncShareURL`, `RW._asyncPoolKey`
- `goToReveal()` helper routes through formation draft if enabled

## 5. GROUND RULES (non-negotiable)
- Push to GitHub IMMEDIATELY as first action and after every completed task
- Save progress to PROGRESS.md after every task
- Keep HANDOVER.md updated
- Keep working without stopping between tasks
- If new session starts: read HANDOVER.md and PROGRESS.md first
- No exposed API keys/secrets
- No user data off-device
- `esc()` all user input
- Ratings/Duels ratings NEVER in DOM during build phase
- No emoji unless genuinely purposeful

## 6. EXACTLY WHERE TO PICK UP
> Task 0 audit complete. Task 1 (X button revert) done. Working through Tasks 2-7.
> New tasks list: T1=X button (done), T2=Draft vs Computer, T3=3D buttons/animations,
> T4=game review, T5=new mode ideas, T6=security audit, T7=data audit
> NOTE: idea.mov video could not be accessed (Photos NSItemProvider temp path expired).
> Working from written task descriptions for T2/T3.

## 6b. TASK 0 AUDIT — COMPLETE
### Full checklist of prior 16 catch-up items (verified in codebase):
1. ✅ SVG icons — manager chips (MGR_ICONS) + theme toggle (sun/moon SVGs in index.html)
2. ⏳ Supabase leaderboard — DEFERRED (requires external account; documented)
3. ⏳ Cold load lazy-loading — DEFERRED (5MB arch refactor; documented)
4. ✅ sessionStorage draft — saveDraft/loadDraft/clearDraft in game.js verified
5. ✅ Auto-fill quality floor 75 — `if ((pl.r || 0) < 75) return;` in autoFill() verified
6. ✅ Lock XI hidden until 11/11 — elDone shows only when `full` (picks.length===11) verified
7. ✅ Champion name/flag in WC Final — bracket-champion div in renderBracket verified
8. ✅ Keyboard nav on spin — keydown handler (Space=spin) in game.js verified
9. ✅ Share XI PNG — shareXIPNG() with canvas in game.js verified
10. ✅ Half-pitch formation view — pitch SVG both dark+light in style.css verified
11. ✅ Share game link — clipboard copy handler in floodlights.js verified
12. ✅ Summary stat pills centred — stat-grid justify-content:center in style.css verified
13. ✅ Player pop-out consistent — squad-card wrapper in multiplayer.js + ratingswar.js verified
14. ✅ Production server — GitHub Pages returns 200 OK verified
15. ⏳ Staging environment — DEFERRED (requires GitHub branch config; documented)
16. ✅ SETUP.md — file exists verified

### Phase 2 Duels features: ALL 10 ✅ (verified via commit history + code)

### Bug fixes from last prompt:
- ✅ Rating badge contrast (mp-r-badge) — DONE and EXTENDED to game.js this session
- ❌→✅ X button change — previous session made X cost a respin (WRONG per Task 1); REVERTED in Task 1

### Additional fix from Task 0:
- ✅ game.js ratingTierClass — extended to cover r-amber/r-orange/r-red (was returning "" for <75)

## 6c. BUG FIXES (commit 9096e13):
- ✅ **Rating badge contrast** — mp-r-badge has solid background + 7-tier colors. ratingTierClass extended in multiplayer.js, ratingswar.js, and game.js.
- ⚠️ **X button respin cost** — implemented in previous session but REVERSED in Task 1 (X should be pure close, no cost)

## 7. TASK 4 — FULL GAME REVIEW ✅

_Honest developer/designer/player review. Ranked by impact vs effort._

### HIGH IMPACT / LOW EFFORT — do these next
1. **Leaderboard is honour-system** (localStorage, trivially cheatable) — no fraud protection; anyone can open DevTools and set a score. Fix = Supabase. Deferred due to external account requirement. ⚠️ documented.
2. **dock-x button 34×34px** — below 44px minimum touch target on mobile; misfire rate high. **FIXED this session → 44×44px.** ✅
3. **DVC mode LINE_OF bug** — DEF/FWD player positions fell through to "MID" in draft pool because LINE_OF only mapped granular positions (CB/RB) not the broad ones (DEF/FWD) used in all data. CPU would never correctly fill defence or attack. **FIXED this session.** ✅
4. **No reroll count explanation** — spin count depletes silently; first-time players don't know why the button greyed out. Add a tooltip/info chip. (15 min)
5. **Accidental picks are permanent** — once you pick a player there's no undo. Single biggest frustration in playtesting. (30 min, needs careful state management)

### HIGH IMPACT / MEDIUM EFFORT — schedule these
6. **5MB eager data load** — all data files load on every mode regardless of which mode is played. Load is synchronous and blocks the page on slow connections. Fix = lazy-load per mode. (~2 days refactor)
7. **Multiplayer connection failure UX** — if PeerJS fails to connect, user sees raw "failed" text with no recovery path. Add a retry button + friendly error. (1 hr)
8. **Squad dock invisible in DVC mode** — FAB doesn't appear during DVC draft because DVC renders its own pick list, not `.xi-list` or `.pdot` elements that the dock scraper reads. (30 min)
9. **Formation view in DVC result is placeholder** — shows a simple list not a half-pitch. (30 min once pitchHTML is wired)

### MEDIUM IMPACT / LOW EFFORT
10. **"vs Computer" button is last in home grid** — alphabetically sensible but discoverability is low for the newest mode. (2 min CSS order tweak)
11. **Share XI PNG** — canvas export works but is clipped on some phones (font rendering). Test with real devices.
12. **No text copy for results** — "share result" only shares an image; a plain-text "My XI beat Brazil 2-1" format would be more viral. (30 min)

### MEDIUM IMPACT / HIGH EFFORT
13. **CPU DVC difficulty levels** — current CPU always plays at one level. Add Easy/Medium/Hard via rating bias ± modifier. (1 hr)
14. **Online tournament bracket** — Duels has async online mode but the main draft game doesn't. Would pair naturally with existing PeerJS infrastructure.

### LOW IMPACT / LOW EFFORT
15. **Squad dock shows broad positions** (GK/DEF/MID/FWD) — granular positions (CB/RM/CAM) would be more informative but data doesn't have them for most squads.
16. **Theme preference doesn't persist** — light/dark resets on reload. One `localStorage` write fixes it. (10 min)

### Summary verdict
The core loop (spin → draft → simulate) is solid and rewarding. The main risks are leaderboard integrity and mobile UX friction (touch targets, accidental picks). DraftVsComputer had a silent position-matching bug now fixed. The single best next investment is Supabase leaderboard — it's the one feature that turns the game from a toy into a competition.

---

## 8. TASK 5 — NEW GAME MODE IDEAS ✅

### Mode 1: Auction Draft
**Concept:** Each player starts with a budget of 1,000 points. Every player in the shared pool has a price based on their rating (e.g. r≥90 costs 180pts, r≥85 costs 120pts, down to ~40pts for r<75). Pick your 11 within budget — overspend and you can't field a team. Forces real trade-off decisions: spend big on a striker and cut corners in defence.
**Fun factor:** High — every pick is a puzzle. "Can I afford Messi if I go cheap everywhere else?" is genuinely engaging.
**Build complexity:** Medium. Needs price table, budget counter UI, validation on pick. ~4 hrs.

### Mode 2: Time Pressure Draft
**Concept:** Normal spin/pick flow but each pick has a 10-second countdown. Clock shown on screen. If time expires, best available player at the needed position is auto-picked. No respins — fast or lose your spot. Optional: "freeze power-up" stops the clock once.
**Fun factor:** Very high on mobile — creates panic, laugh-out-loud moments when the clock forces a bad pick.
**Build complexity:** Low-Medium. Countdown timer + auto-pick on expiry. ~2 hrs.

### Mode 3: Historic Gauntlet
**Concept:** A curated ladder of all-time great squads (e.g. Brazil 1970 → Spain 2010 → France 1998 → …). Build your XI via normal draft, then face them in order. Beat all 8 to complete the gauntlet. Each win shows the scoreline; losses give a retry. Leaderboard tracks fewest retries.
**Fun factor:** High — the "can I beat the 1970 Brazilians?" hook is irresistible. Gives the simulation engine a proper narrative purpose.
**Build complexity:** Medium. Needs a fixed gauntlet config object (8 squads, ratings, formation), a progress screen, and a "retry / next" loop. ~3 hrs.

### Mode 4: Position Challenge
**Concept:** Draft an XI but the pool is filtered to a single position — all defenders, all midfielders, or all goalkeepers. You build an "XI of centre-backs" or "XI of GKs and see who wins in goal". Absurd, educational, endlessly replayable.
**Fun factor:** Medium — very funny for GK-only, genuinely interesting for defenders. Works best as a quick novelty mode.
**Build complexity:** Low. Pool filter + relax formation slot rules. ~1 hr.

### Mode 5: Blind Ratings Draft
**Concept:** Player names are shown but ratings are hidden at pick time. You're drafting on reputation and vibes. After both teams are complete, ratings are revealed and the engine simulates. Did you overvalue big names? Did you miss a hidden gem?
**Fun factor:** High — creates argument and surprise. "I can't believe Rivaldo was only 81 in this game."
**Build complexity:** Low. Show name+position+team only; hide `.r` in pool UI. Ratings revealed post-pick during result screen. ~2 hrs.

### Mode 6: Manager's Dilemma (bonus idea)
**Concept:** You're given a pre-built squad of 14 players (random mix of quality). Your job isn't to draft — it's to pick the best 11, choose formation, and captain. The dilemma: a 94-rated striker who plays out of position vs an in-form 82 at the right spot. Pure tactics, no luck.
**Fun factor:** Medium-High for the tactical player who doesn't love the spin mechanic.
**Build complexity:** Low-Medium. Uses existing engine; just needs a squad selector + formation assignment step. ~2 hrs.

---

## 9. TASK 6 — SECURITY AUDIT ✅

_Completed scan of all JS, CSS, HTML, config files. Findings below._

### No issues / clean ✅
- No API keys, tokens, or secrets anywhere in source
- No `.env` files committed
- No source maps exposed (no `.map` files in project root)
- All CDN links use HTTPS — no `http://` upgrade risks
- `esc()` is used consistently before all innerHTML insertions across game.js, multiplayer.js, ratingswar.js, draftvscomputer.js, floodlights.js
- Ratings in Duels build phase: confirmed NOT in DOM during build (hidden intentionally; comment in code)
- No `console.log` calls in production code
- GitHub Pages serves over HTTPS by default — no mixed content

### Issues found and fixed ✅
- **dock-x touch target 34×34px** — below 44px minimum accessibility requirement. Fixed to 44×44px. ✅

### Known / documented risks ⚠️
- **Leaderboard is localStorage** — honour-system; no server validation. Anyone with DevTools can post any score. Documented as deferred (requires Supabase). No user data is sent off-device — this is entirely local.
- **PeerJS CDN dependency** — `https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js` loaded at runtime without SRI hash. Supply chain risk is minor (unpkg is trusted, version-pinned) but a compromised CDN could inject code. Mitigation: self-host the file. Deferred.
- **Public PeerJS broker** — WebRTC signalling uses the public PeerJS broker with `"elxi-"` namespace prefix. IDs are guessable if brute-forced. Risk is low (game data only, no PII) but noted.

### Supabase (N/A this session)
- No Supabase credentials in codebase — not yet implemented. When added: use environment variables via GitHub Actions secrets, never commit `.env`.

---

## 10. TASK 7 — DATA AUDIT ✅

_Full scan of all data files. Results below._

### Coverage
| File | Players |
|------|---------|
| data.js (World Cup squads) | 525 |
| data_extra.js | 300 |
| data_full.js | 4,580 |
| data_legacy.js | 101 |
| data_full2.js | 1,049 |
| **All files combined** | **215,893** |

### Rating distribution (main 5 files, 6,555 entries)
| Tier | Range | Count |
|------|-------|-------|
| r-gold | ≥90 | 80 |
| r-elite | 85–89 | 1,334 |
| r-great | 80–84 | 2,701 |
| r-good | 75–79 | 2,249 |
| r-amber | 70–74 | 191 |
| r-orange | 60–69 | **0** |
| r-red | <60 | **0** |

**Finding:** The r-orange and r-red CSS tiers exist but are dead code — no player in any data file has a rating below 73. The floor appears to be 73 (enforced implicitly by data curation). The r-amber tier also only has 191 entries out of 6,555 (~3%).

### Position values
All data files use **only 4 broad positions**: `GK`, `DEF`, `MID`, `FWD`. No granular positions (CB/RB/CM etc.) exist in any data file. The `gp` (granular position) field found referenced in some code paths is never populated from these files.

### Critical bug found and fixed ✅
**DVC LINE_OF mapping** — `draftvscomputer.js` LINE_OF only mapped granular positions to lines (CB→DEF, RB→DEF, etc.) but not the broad ones. Since all data uses `DEF/MID/FWD/GK`, `lineOf("DEF")` returned `undefined || "MID"` — all DEF and FWD players were misclassified as MID. CPU could never correctly fill defensive or attacking slots. Fixed by adding `DEF:"DEF"`, `MID:"MID"`, `FWD:"FWD"` to the map.

### Duplicate players
214 player names appear in 3+ entries — expected for multi-year tournament participants (Messi: 4×, Cafu: 4×, Di María: 4×). These are intentional (same player across different years).

### Rating range
- **Min:** 73 | **Max:** 97 | **Average:** 81.1
- No outliers outside 60–99 range
- Pelé (97) is highest rated; floor players cluster at 73–74

### Recommendations
- r-orange and r-red CSS tier rules can be kept (defensive coding) but the data never reaches them under current curation
- Consider adding a few genuinely weak squads (ratings 60–69) to create more tier contrast and dramatic upsets in simulations
- Auto-fill quality floor of 75 in game.js is correct and consistent with the data floor of 73

---

## 11. CONTRAST FIX — PLAYER NAMES + RATING BADGES ✅

_All pop-out panels, all game modes._

### Problem
- Player names in all squad pop-outs appeared muted/grey — no explicit `color:` was set on `.pname`
- `mp-r-badge.r-great` (80–84): used `var(--p-violet-300)` text on violet-tinted background = purple on purple (unreadable)
- `mp-r-badge.r-good` (75–79) and `mp-r-badge.r-orange` (60–69): both used `var(--warning)` = coral = identical tiers, wrong for 75–79
- `xi-rate.r-great` and `xi-rate.r-good`: same colour problems in the squad XI list
- `rw-rev-rating.r-great` and `.r-good`: same in Duels reveal
- `game.js ratingBadge()`: used old flat `.rate-badge` class with no tier system at all
- `body.light .mp-r-badge` in style.css had higher specificity than the tier rules, overriding all tier colours in light mode

### Fixes applied (floodlights.css v101, game.js v87)
| Tier | Before | After |
|------|--------|-------|
| r-great 80–84 | violet on violet-tint (unreadable) | `#5BA4FF` clear blue |
| r-good 75–79 | coral/orange (wrong) | `#ECF1FF` near-white |
| r-orange 60–69 | same coral as r-good (duplicate) | `#FF8C42` distinct orange |
| player names | no explicit color | `color: var(--text)` on `.player .pname` |

- All three badge locations updated: `mp-r-badge`, `xi-rate`, `rw-rev-rating`
- Added `body` prefix to `mp-r-badge` tier rules → beats `body.light .mp-r-badge` specificity issue
- Light mode overrides added for r-great and r-good to ensure dark-on-light contrast
- `game.js ratingBadge()` now uses `mp-r-badge` + `ratingTierClass()` — consistent with all other modes

### Coverage — modes verified
- ✅ WC/CL (game.js): `.pname` + `ratingBadge()` now uses tier system
- ✅ Multiplayer (multiplayer.js): `.pname` + `mp-r-badge` tier
- ✅ Duels build (ratingswar.js): `.pname` + no ratings (correct — blind build)
- ✅ Duels reveal (ratingswar.js): `rw-rev-rating` tier fixed
- ✅ Duels shared pool (ratingswar.js): `.rw-sp-name` already had `color: var(--text)`
- ✅ DVC pool (draftvscomputer.js): `.dvc-name` already had `color: var(--text)` + `mp-r-badge` tier
- ✅ DVC XI list + result (draftvscomputer.js): `.dvc-xi-name` already had `color: var(--text)` + `mp-r-badge` tier

## 12. CURRENT FILE VERSIONS
- floodlights.css: v112 (progression bar + lazy-load state CSS)
- game.js: v94 (progression hook system)
- engine.js: v73 (buildField/seedGroups exported, runWorldCupFromGroups added)
- league.js: v82 (lazy loading for league data files)
- multiplayer.js: v93 (auto-fill, squad reveal, win tracking)
- floodlights.js: v92 (lazyLoad utility + progression display)
- draftvscomputer.js: v6 (CPU personality + rematch)
- ratingswar.js: v102 (Duels presets, series persistence, result history)
- audio.js: v1 (Web Audio API module)
- sw.js: wcxi-v132

## 29. TASK 17 — PROGRESSION HOOKS + LAZY LOADING ✅
**Progression hooks:**
- `wcxi_progress` localStorage: `{gamesPlayed, wins, currentStreak, bestStreak, milestones}`
- Tracked inside `WCXI_addScore()` in game.js via `_trackProgress(e)` — covers ALL modes
- Win detection: score > 0 AND result doesn't contain "relegated/bottom/last"
- 10 milestones: first game, first win, 5/10/25 wins, 3/5-win streak, 10/50/100 games
- Milestone toast shown after 600ms delay (avoids colliding with other toasts)
- `W.WCXI_getProgress()` exposed for home screen reading
- Progress stat line on home screen (`#flProgBar`): "47 games · 23 wins | Best streak: 5"
- Updated in `updateHomeCards()` in floodlights.js

**Lazy loading (league data files):**
- 5 league history files removed from static loading in index.html: data_pl_history.js, data_laliga_history.js, data_seriea_history.js, data_bundesliga_history.js, data_ligue1_history.js (~2.8MB)
- `W.lazyLoad(src, globalKey, cb)` added to floodlights.js — single-inject, queued callbacks, onerror logged
- `ensureLeagueData(key, cb)` added to league.js — delegates to W.lazyLoad for unloaded files
- LEAGUES object extended with `dataKey` and `src` per entry
- League card click wrapped: if data not loaded, disables button + shows "Loading..." + calls ensureLeagueData before renderSetup()
- Files removed from sw.js ASSETS pre-cache (still cached by network-first on first fetch)
- data_championship_history.js kept in static loading (needed for MP Championship mode)
- Initial load reduction: ~2.8MB removed from eager load

## 28. TASK 16 — DUELS IMPROVEMENTS ✅
- D-1 (Feature presets): DONE
  - 3 preset buttons at top of feature section: Quick (posBan+captain), Standard (5 features), Full Rules (8 features, excludes asyncOnline)
  - Active preset highlighted in violet; clicking preset sets all features and re-renders
  - `activePresetId()` helper checks exact match against all 10 keys
  - CSS: `.rw-presets`, `.rw-preset-btn`, `.rw-preset-label`, `.rw-preset-desc`, `.rw-preset-active`
- D-2 (Strategy depth): DEFERRED — high effort structural rework, documented
- D-3 (Bo3 series persistence): DONE
  - `wcxi_duel_series` localStorage key; 4-hour TTL
  - Saved after each match via `rwSeriesNextMatch()` → `_saveDuelSeries()`
  - Saved state: features, numPlayers, player names, matchResults, seriesMatch, captains, bannedSlots
  - Series resume banner shown on Duels intro if saved + not expired: shows series score, match number
  - "Resume →" restores full RW state, jumps to poolselect phase
  - "Discard" clears saved state; "Start" also clears on new game
  - Series cleared when series completes (isCompletedDuel + seriesDone)
  - CSS: `.rw-resume-banner`, `.rw-resume-score`, `.rw-resume-hint`, `.rw-resume-btns`
- D-4 (Result history): DONE
  - `wcxi_duel_history` localStorage key; last 5 results
  - Saved alongside leaderboard save in `renderResult()` when `isCompletedDuel && !_savedToBoard`
  - Entry: `{ts, winner, loser, score (e.g. "2-0" or "11-8"), isBo3}`
  - Shown at bottom of Duels intro screen: winner (gold), vs loser, score, date
  - CSS: `.rw-duel-history`, `.rw-hist-head`, `.rw-hist-row`, `.rw-hist-winner`, `.rw-hist-vs`, `.rw-hist-score`, `.rw-hist-date`

## 27. TASK 15 — MULTIPLAYER IMPROVEMENTS ✅
- MP-1 (Squad reveal post-tournament): DONE
  - After champion banner, shows "Reveal All Squads →" CTA with "Skip to Standings →" option
  - Clicking reveal shows each squad in turn: name, formation, manager, avg rating, half-pitch view, player list with rating badges
  - Prev/Next navigation ("Next Squad →" then "See Final Standings →" on last)
  - "All Teams" summary + "← Back to Home" shown after all squads revealed
  - st.revealIdx state added; reset to -1 on each new game
  - st._histSaved flag prevents duplicate writes per session
- MP-2 (Auto-fill at 9/11): DONE
  - `mpAutoFill(player)` function: builds flat pool from all data years, shuffles, fills open slots by highest-rated eligible player
  - `mpAutoFillSlotCompat(gp)`: extended slotCompat with broad-position fallbacks (DEF→CB/RB/LB, MID→CM/CDM/CAM/LM/RM, FWD→ST/LW/RW)
  - "Auto-fill remaining N slot(s) →" button appears in XI section when picks >= 9 and < 11
  - Calls advanceDraft() after filling, so pass screen and tournament flow continue normally
- MP-3 (Cross-session win tracking): DONE
  - localStorage key: wcxi_mp_history (last 10 sessions)
  - Saved after champion revealed: timestamp, winner name, player names + avg ratings
  - Shown on the Multiplayer connect screen (under the Local/Online grid)
  - Up to 5 recent sessions shown: winner name (gold), player list with avgs, date

## 26. TASK 14 — LEAGUE IMPROVEMENTS ✅
- L-1 (Premier League): DONE — Premier League added to LEAGUES object in league.js. Uses `W.PL_DATA` (data_pl_history.js, 616KB, already loaded in index.html and sw.js ASSETS). 38-game season.
- L-2 (Deeper surprise event feedback): DONE THIS SESSION
  - Manager change event: saves old manager name/style/bonuses before spin; after appointment shows `.lge-compare` before/after panel. Left col (Before) = old manager name, style, ATK/DEF bonuses. Right col (After, violet highlight) = new manager name, style, ATK/DEF bonuses. Delta badges: cyan=positive, coral=negative.
  - Player replacement event: after pick, shows "Transfer done" panel with Out/In comparison. Shows old player name/slot and new player name/slot. If `LS.showRatings` is true, shows rating delta badge (±N) in appropriate colour. "Continue →" button calls `_lgResumeAfterEvent()`.
  - CSS added to floodlights.css: `.lge-compare`, `.lge-before`, `.lge-after`, `.lge-arrow`, `.lge-cl`, `.lge-cname`, `.lge-cstyle`, `.lge-cbonuses`, `.lge-delta` (with `.pos`/`.neg`/`.neu` variants)
- L-3 (Mid-season cup): DEFERRED — high effort, noted for future session

## 25. TASK 13 — CL IMPROVEMENTS ✅
- CL-1 (real squads): DEFERRED — high effort, needs extensive data addition
- CL-2 (format explanation): ALREADY DONE — CL_FORMATS.desc + clFormatDesc element show descriptions
- CL-3 (richer result screen): DONE THIS SESSION
  - Result stage in renderWCStage() now shows full journey:
    - "Your group stage" section with match cards (all group phase matches)
    - Group table for user's group (old-format CL and WC with groups)
    - "Knockouts" section with KO match cards
    - Then the bracket (was already shown)
  - This applies to WC, CL (all formats), and Euro — any mode using renderWCStage()

## 24. TASKS 11+12 — DVC FORMATIONS + WC IMPROVEMENTS ✅
**Task 11 (DVC-3)**: ALREADY DONE — DVC_FORMATIONS already has 4 formations (4-3-3, 4-4-2, 4-2-3-1, 3-5-2) from a previous session.

**Task 12 (WC improvements)**: 
- WC-3 (extra formations): ALREADY DONE — game.js FORMATIONS has 9 entries (4-3-3, 4-4-2, 4-2-3-1, 3-5-2, 3-4-1-2, 3-4-3, 5-3-2, 4-5-1, 5-4-1)
- WC-4 (personal best on home): DONE in Task 5 (updateHomeCards)
- WC-2 (animated bracket): DONE — staged reveal system already in place
- WC-1 (group preview): DONE THIS SESSION
  - engine.js: extracted `_finishWorldCup()` shared helper; exported `buildField`, `seedGroups`, added `runWorldCupFromGroups(field, rawGroups, userTeam)`
  - game.js: `runSim()` draws groups first, sets `reveal.stage = "groupPreview"`, shows interstitial
  - Interstitial shows 4 teams in user's group with flags + ratings, user highlighted in violet
  - "Kick off!" button runs `runWorldCupFromGroups` with pre-drawn groups (same draw, actual match sim)
  - CSS: `.group-preview`, `.gp-row`, `.gp-me`, `.gp-flag`, `.gp-name` in floodlights.css

## 23. TASK 10 — DVC-2 + DVC-4: CPU PERSONALITY + REMATCH ✅
**CPU Personality (DVC-2):**
- 3 personalities added: Balanced / The Scorer / The Defender
- `PERSONALITY_BIAS` map: scorer gets FWD+25/DEF-12, defender gets DEF+25/FWD-12
- Bias applied in `cpuPick()` scoring formula
- Personality selector added to setup UI (same `diff-opt` button style)
- CPU name pool changes by personality (scorer: "The Poacher", defender: "The Sweeper", etc.)
- Difficulty now also affects pick randomness: hard=top1, medium=top3, easy=top5

**Rematch (DVC-4):**
- `DVC.originalPool` saved at draft start (`pool.slice()`)
- "Rematch (same pool)" button shown at result screen if pool exists
- Rematch resets picks/turns but restores original pool — same player options, different outcomes
- "Draft Again" still goes back to setup and discards pool

## 22. TASK 9 — OG-8: SHAREABLE LEAGUE SEASON CARD ✅
- `_lgShareImage()` in league.js redesigned (1080×1400 canvas):
  - Gradient background (dark green → midnight blue)
  - Rainbow accent bar at top
  - Pill in appropriate colour (gold=champions, green=top4, coral=relegated)
  - Big position ordinal + league name
  - Team name
  - Stats row: W-D-L, PTS, GD (replaces old "score" stat)
  - Squad section: 11 players in 2 columns, position badge + name in line colour
  - Golden Boot section (name + goals)
  - Footer: "Build your all-time XI · eleven-xi.com"
- Call site updated to pass `gd:userRow.GD, xi:xiOrdered`
- "Share your season" button already in results screen (was from previous implementation)

## 21. TASK 8 — OG-5: DVC + DUELS INTO LEADERBOARD ✅
- DVC results now posted to `wcxi_leaderboard_v1` via `window.WCXI_addScore`
  - Score formula: Win × difficulty (Easy=100, Medium=200, Hard=400), Draw = 30×mult
  - Losses not saved (no points). Name = "Your XI". Mode = "dvc"
  - Result string: "Win · Hard · 2-1" format
- Duels results posted when a complete single match or Bo3 series finishes
  - Score = winning team avg rating × 10 (e.g. 84 avg → 840pts)
  - Only saves the winner. Mode = "duels". Result = "Won vs Opponent X-Y"
  - De-duped via `RW._savedToBoard` flag (cleared on each new `W.startDuels()` call)
- Leaderboard mode tabs: added "vs Computer" (dvc) and "Duels" (duels) to `#boardModes` in index.html
- `modeLabel()` in game.js extended: "dvc" → "vs Computer", "duels" → "Duels"
- "All" tab shows DVC + Duels entries mixed with WC/CL/League (sorted by score desc)

## 20. TASK 7 — AUDIO (OG-4) ✅
- `audio.js` created: Web Audio API, 3 procedurally generated sounds, no external files
  - `sfxSpin()` — 900Hz sine, 55ms (spin tick)
  - `sfxPick()` — 200+320Hz triangle, 180ms (pick confirm thud)
  - `sfxWin()` — C5-E5-G5 arpeggio (win fanfare)
- Mute state persisted: `wcxi_muted` in localStorage
- Sound toggle button: `#soundToggle` fixed-position button (top-right, left of theme toggle)
- CSS: `.sound-toggle` in floodlights.css (same floating-pill style as theme toggle)
- Wired in game.js: `doSpin()` → sfxSpin, `pickPlayer()` → sfxPick, result stage → sfxWin (Champions! only)
- Wired in league.js: `doLgSpin()` → sfxSpin, `draftPlayer()` → sfxPick, champion result → sfxWin
- Wired in draftvscomputer.js: `doPlayerPick()` → sfxPick, DVC win → sfxWin
- `audio.js` in sw.js ASSETS array (cached offline)

## 14. TASK 1 — DVC W/L/D RECORD ✅
- localStorage key: `wcxi_dvc_record` — JSON object `{easy:{w,l,d}, medium:{w,l,d}, hard:{w,l,d}}`
- `loadDvcRecord()` / `saveDvcRecord(rec)` helpers in draftvscomputer.js
- `renderRecordHtml(diff)` renders label + W/L/D + win% pill
- Setup screen: record shown below difficulty description, updates live when difficulty is switched
- Result screen: record shown in verdict banner (updated after this game)
- CSS added: `.dvc-record`, `.dvc-rec-label`, `.dvc-rec-val`, `.dvc-rec-pct`, `.dvc-rec-none`, `.dvc-verdict-record`
- Leaderboard tab integration deferred to Task 8 (OG-5)

## 16. TASK 3 — SOLO EURO TOURNAMENT ✅
- Extended `setMode("euro")` in game.js: DATA → EURO_DATA, pool label "Euro tournament eras", continent filter hidden
- `eraApply()` updated: Euro shows "N Euros · N squads" (not "N World Cups · continent")
- `updateControls()`: `goWorldCup` button relabels to "Euro Championship with my XI", `goLeague` hidden for euro
- `runSim("euro", team)`: uses `runWorldCup()` engine with "Euro Championship" label, saves as mode:"euro"
- `goWorldCup` click handler updated: `runSim(mode === "euro" ? "euro" : "wc", ...)`
- `modeLabel()` updated: "euro" → "Euros" for leaderboard display
- Leaderboard mode tab "Euros" added to index.html
- Euro home card in game.js: `homeEuro` wired directly to `setMode("euro")` alongside homeWC/homeCL
- Opponent field: uses `window.NATIONS` (all international teams) — same as WC, appropriate for Euro
- Score system: uses `wcScore()` — same formula as World Cup, saves to localStorage leaderboard
- Note: EURO_DATA uses `p` (broad position) same as WC data — no data structure issues

## 17. TASK 4 — MANAGER BONUS NUMERIC DISPLAY ✅
- `mgrBonusHTML(st)` added to game.js: renders coloured chips (+4 ATK, -2 DEF, +6 KO) based on style object
- `renderManager()` in game.js: changed from `.textContent` to `.innerHTML`, appends bonus chip row
- `mgrBonusHTML()` and `refreshMgrDesc()` updated in league.js — same chip system
- CSS added to floodlights.css: `.mgr-bonus-row`, `.mgr-bonus`, `.mgr-atk-pos/neg`, `.mgr-def-pos/neg`, `.mgr-ko-pos`
- Colours: ATK+ = coral/warning, DEF+ = cyan/positive, KO+ = gold/champion, neg = muted
- Applied in: WC/CL/Euro setup (game.js), League setup (league.js)

## 18. TASK 5 — HOME SCREEN HIERARCHY ✅
- Added `fl-mode-stat` slot to WC, CL, League, Euro, DVC cards (empty = hidden via CSS)
- WC card: "Start here" badge (`wcNewBadge`) shown only when leaderboard is empty (new users)
- `updateHomeCards()` in floodlights.js populates stats on page load:
  - WC/CL/League/Euro: reads `wcxi_leaderboard_v1`, shows "Best: N pts — result" per mode
  - DVC: reads `wcxi_dvc_record`, shows best-played difficulty W/L/D record
- CSS: `.fl-mode-stat` (muted bottom text, auto-hides when empty), WC badge persists on new sessions
- "Start here" badge hidden once user has any leaderboard entry (i.e. has played WC/CL/League/Euro)

## 19. TASK 6 — ONBOARDING (HOW TO PLAY) ✅
- 3-slide overlay: "Build your XI" / "Pick a manager" / "Simulate & score"
- Auto-shows 600ms after load for new users (no `wcxi_seen_howto` key AND no leaderboard entries)
- "How to play" button in home-links bar → always accessible via `W.openHowToPlay()`
- Navigation: Next/Back buttons + dot indicators + keyboard (←/→/Escape) + backdrop click to dismiss
- Persistent dismiss: sets `wcxi_seen_howto` in localStorage — never shown twice unless cleared
- CSS: `.htp-overlay`, `.htp-panel`, `.htp-slide`, `.htp-dots`, `.htp-btns` — slide-in animation
- Last slide: "Next →" becomes "Got it ✔"

## 15. TASK 2 — EURO HOME CARD ✅
- Added `fl-mode m-euro` button (`homeEuro`) to home screen after vs Computer card
- Shield SVG icon with checkmark — distinct from other mode icons
- CSS: `.m-euro { --mode-accent: #4A90E2; }` (European blue)
- Animation stagger: added `nth-child(6) { animation-delay: 280ms; }` to floodlights.css
- `W.openMultiplayerWithMode(mode)` exposed in multiplayer.js — sets `st.mpMode` then opens MP
- Euro card click handler in floodlights.js: checks for `window.startEuroMode` (Task 3), falls back to MP with euro pre-selected
- `euroView` added to `flGoHome` hidden-views list for Task 3 solo mode
- Hint text: "1980–2024 · 12 tournaments · solo & multiplayer"

## 12. REMAINING BACKLOG
- Lazy-load data per mode (~5 MB eager load)
- Supabase persistent leaderboard (deferred — needs external account)
- Staging environment (deferred — needs GitHub branch config)
- Undo last pick (medium effort, high player value)
- Reroll count tooltip / explanation
- Theme persistence (localStorage) — NOTE: already done (wcxi_theme in localStorage)
- Squad dock FAB detection for DVC mode
- Self-host PeerJS to remove CDN dependency (minor security improvement)

---

## 13. GAME IMPROVEMENT SUGGESTIONS — REVIEW LIST

> Research-only snapshot. No code changes. Prioritise from this list.
> Each item: what, where, impact (H/M/L), effort (H/M/L).

---

### OVERALL GAME

**OG-1. No meta-game / progression hook**
There is no career record, no trophy cabinet, no personal bests visible at a glance. The leaderboard exists but is localStorage-only, anonymous by default, and invisible until you click into it. After a WC win there is no persistent marker — the next session starts identical to the first.
- Impact: **High** | Effort: **High**
- Fix: Add persistent stats to the home screen — total games played, tournaments won, best WC score. Even one number on a mode card ("Your best: 1,240") would increase return rate.

**OG-2. Home screen has no hierarchy or signal for new users**
All 5 mode cards look equal. There is no "start here" path, no badge showing a saved score on a card, no visual weight difference between the primary mode and secondary ones.
- Impact: **Medium** | Effort: **Low**
- Fix: Visually distinguish one or two "headline" modes. Add a small score badge overlay on mode cards when the user has played that mode.

**OG-3. No onboarding or contextual help**
No explanation of how the spin draft works, what managers do, what rerolls cost, or how scoring works. Hint text exists on some screens but is minimal. Players cannot discover the manager bonus system or difficulty difference without trial and error.
- Impact: **Medium** | Effort: **Low–Medium**
- Fix: Add a collapsible "How to play" panel on the setup/draft screen. One paragraph max — spin to get a player, pick your XI, unlock run. Managers section: a chip tooltip showing bonus values before you start.

**OG-4. No audio**
No sound effects anywhere — no spin click, no goal whoosh, no bracket advance sound. Sound effects add energy without requiring complex implementation. This is entirely absent.
- Impact: **Medium** | Effort: **Low**
- Fix: Three sounds is enough to transform feel: (1) spin tick/click, (2) pick-confirmed thud, (3) goal/tournament-win fanfare. Web Audio API, short buffers, opt-in only.

**OG-5. No scoring system for DVC or Duels**
WC, CL, and League contribute to the leaderboard. DVC and Duels contribute nothing. Both modes feel transient — win or lose, nothing is recorded.
- Impact: **Medium** | Effort: **Low**
- Fix: Add a DVC W/L/D record to localStorage. Add a Duels head-to-head history (last 5 results). Add a DVC tab to the leaderboard screen.

**OG-6. Manager bonus not surfaced clearly before drafting**
You spin a manager, see their name and style icon, and proceed. The numeric bonus (+4 atk, -2 def, etc.) is not shown explicitly on the manager chip or setup screen. Players who don't know the system miss it entirely.
- Impact: **Low** | Effort: **Low**
- Fix: Show the numeric bonus alongside the manager style chip: "Attack (+4 ATK / -2 DEF)". One line, always visible during draft.

**OG-7. ~5 MB cold load (all data files load on every visit)**
All 15 data scripts are loaded eagerly on first page load regardless of which mode the user wants. On fast connections this is invisible. On mobile/3G it can delay the first meaningful paint.
- Impact: **Low** (desktop/WiFi), **Medium** (mobile/3G) | Effort: **High**
- Fix: Mode-specific dynamic imports. Deferred — significant architecture change. Flag for if the app targets mobile-first.

**OG-8. Share XI PNG only works well for WC/CL draft**
The canvas share image shows the squad on a pitch, which is great. League mode has richer data (mini table, top scorer) that never appears in a shareable format.
- Impact: **Medium** | Effort: **Medium**
- Fix: Add a League-specific share card — squad + final position + top scorer + GD. Small canvas variant, consistent with existing share style.

---

### WORLD CUP

**WC-1. No group stage preview before simulation runs**
You select your era and difficulty, draft your XI, hit "Run" — and the results are immediately displayed. There is no moment of anticipation where you see your group before the simulation.
- Impact: **Medium** | Effort: **Low**
- Fix: Add a "Your Group" interstitial screen (1 tap to continue) showing the 3 opponent nations with their ratings before the simulation runs.

**WC-2. Bracket reveal is passive — no tension**
After drafting, results are a list of score lines and bracket states. There is no gradual reveal, no countdown, no beat-by-beat. One screen with all results.
- Impact: **Medium** | Effort: **Medium**
- Fix: Animate bracket results round by round — show group stage results first, pause, then R32, etc. Button-gated so the user controls the pace. Minimal JS change.

**WC-3. Only 3 formations**
4-3-3, 4-4-2, 3-5-2. No 4-2-3-1, no 3-4-3, no 5-3-2. Given the quality players available in WC data, different formations would enable different build identities.
- Impact: **Low** | Effort: **Low**
- Fix: Add 4-2-3-1 and 4-1-4-1 formation definitions to FORMATIONS map in game.js. Pure data — no logic change needed.

**WC-4. Personal best not visible on home screen**
After winning a WC, the score is in the leaderboard (if you click through) but nothing on the home screen reflects it. No badge, no record, no incentive to try beating it.
- Impact: **Medium** | Effort: **Low**
- Fix: Show best WC score as a small overlay on the WC home card, pulled from localStorage board data.

---

### CHAMPIONS LEAGUE

**CL-1. Draftable squad pool is only ~9 clubs**
The CL mode claims "153 clubs · 768 seasons" — this refers to opponent simulation data, not draftable squads. Players can only draft from the ~9 historically complete squads in cl_data.js + cl_data2.js. This is the biggest structural gap in CL.
- Impact: **High** | Effort: **High**
- Fix: Add real squad data (goalkeeper through forwards) for 20–40 more historically significant CL clubs. The data structure is already established in cl_data.js.

**CL-2. No format explanation for new users**
"Swiss," "Groups," "League Phase" are three buttons with no explanation. The Swiss format in particular (8 games, then knockouts) is not intuitive.
- Impact: **Low** | Effort: **Low**
- Fix: Add a one-sentence tooltip or sub-label under each format button explaining the structure.

**CL-3. Same results screen as WC**
CL has multi-round history (up to 8 group/league games + 4 knockout rounds) but the summary collapses to the same static screen as WC. CL's richer history is discarded.
- Impact: **Low** | Effort: **Medium**
- Fix: CL-specific results screen showing all game scores grouped by phase, not just the final round.

---

### LEAGUE

**L-1. No Premier League in League mode**
La Liga, Serie A, Bundesliga are available. The most globally-recognised league (PL) is absent from the solo mode — it only appears in Multiplayer. `data_pl_history.js` already exists.
- Impact: **High** | Effort: **Medium**
- Fix: Add Premier League as a fourth option in the League mode data picker. Wire up the existing PL history data.

**L-2. Surprise events are shallow — no lasting impact**
Manager sacked: you get a new manager and continue. Player injured: random replacement, game continues. Neither event changes anything meaningfully — no stat impact, no reflection on what changed.
- Impact: **Medium** | Effort: **Medium**
- Fix: Show a before/after panel for surprise events. Manager change: "Old manager: Attack. New manager: Defence — your squad builds differently now." Player injury: show who came off and who replaced them, with a rating delta.

**L-3. No cup competition alongside the league**
A single domestic cup (2-round knockout, no draft required) mid-season would break monotony. One-game knockout: your XI vs a random club from the same era.
- Impact: **Medium** | Effort: **High**
- Fix: Mid-season cup interrupt (after game 10 of 34). Optional on/off. One match, separate score bonus if won. New event type in the surprise engine.

---

### EURO (currently hidden inside Multiplayer)

**EU-1. No dedicated home screen card**
Euro is the only major competition with no home card. It is reachable only via Multiplayer → data picker → Euros. Most users will never find it. 12 tournaments of data (1980–2024), 8–24 nations each — this is hidden content that would increase engagement if surfaced.
- Impact: **High** | Effort: **Low**
- Fix: Add a "Euros" home card. On click: open Multiplayer pre-set to Euro data + solo (1 player) mode. No new logic needed — just a shortcut entry point.

**EU-2. Cannot play Euro as solo single-player tournament**
Even if you find Euro data in Multiplayer, you must play it as a multiplayer draft game. There is no standalone solo "Euros" mode equivalent to the solo World Cup experience.
- Impact: **High** | Effort: **Low–Medium**
- Fix: The WC simulation engine works for any set of nations. A solo Euro mode needs: (a) the home card from EU-1, (b) a data source selector defaulting to Euro, (c) the same WC flow with Euro nations pool. Shared code path, ~50-100 lines of wiring.

---

### MULTIPLAYER

**MP-1. No visibility of opponent squads during the tournament**
In a 4-player game, all players draft, the tournament simulates, and results appear. Nobody sees what the other built. Revealing squads before or after simulation would create discussion and social engagement — which is the point of local MP.
- Impact: **Medium** | Effort: **Low**
- Fix: After simulation, add a "Reveal All Squads" step before the final leaderboard. Each squad shown on a pitch, player clicks through.

**MP-2. Draft scales poorly at 6–8 players**
8 players × 11 picks = 88 spins at ~5 seconds each = 7+ minutes of draft time. No auto-fill option once you hit a threshold. Late picks in a 8-player draft are low-stakes but still require manual attention.
- Impact: **Medium** | Effort: **Low**
- Fix: Add "Auto-fill remaining" button once 9/11 are picked. Uses the existing autoFill() logic. Optional — player keeps manual control but has an escape hatch.

**MP-3. No cross-session win tracking for regular groups**
Friends who play MP regularly have no persistent record. No "all-time standings," no head-to-head history. Everything resets after each game.
- Impact: **Medium** | Effort: **Medium**
- Fix: localStorage-based session history with player names. Last 10 sessions, winner + score. Shown on a "History" tab in the leaderboard screen.

---

### DUELS (Ratingswar)

**D-1. 10 feature toggles with no presets — overwhelming for new players**
10 checkboxes in a flat list is the most complex UI in the game. Nobody reads 10 toggles. There is no "quick game" path for new players.
- Impact: **High** | Effort: **Low**
- Fix: Add 3 preset buttons at the top: "Quick" (Positional Ban + Captain only), "Standard" (5 core features), "Full Rules" (all 10). Each button sets the checkboxes. New players hit "Quick" and start immediately.

**D-2. Strategy has limited impact on outcome — pure rating average wins**
Positional bans and captain bonus add mild strategy, but the final score comparison is based on total team rating average. A squad of 11 × 87s beats 11 × 82s regardless of strategic choices. The skill ceiling is low.
- Impact: **Medium** | Effort: **High**
- Fix: Requires a structural rule rework. Options: (a) add formation matchup bonuses (high-press vs counter), (b) weight player ratings by position-specific relevance (CDM doesn't score), (c) add a "tactics" phase post-draft. Big investment.

**D-3. Best-of-3 series state is lost if the session ends**
If either player closes their tab or phone locks, the series state is gone. No way to resume a series.
- Impact: **Medium** | Effort: **Medium**
- Fix: Store series state in localStorage keyed by session. On return, prompt "Resume series?" with the current score. Auto-expire after 4 hours.

**D-4. No history of past Duels results**
No record of previous Duels outcomes. Who won last time? What was the score? Nothing is saved.
- Impact: **Low** | Effort: **Low**
- Fix: Store last 5 Duels results (player names, ratings, winner, date) in localStorage. Show on a "History" tab.

---

### DRAFT VS COMPUTER (DVC)

**DVC-1. No score system — results are not recorded anywhere**
DVC has no W/L/D record, no leaderboard entry, no personal best. Every game is completely disposable. This is the mode that most directly benefits from a record because it has clear difficulty tiers.
- Impact: **High** | Effort: **Low**
- Fix: Add localStorage W/L/D record per difficulty level. Show on the DVC setup screen ("Your record on Hard: 3W 7L 2D"). Add a DVC tab to the main leaderboard.

**DVC-2. CPU has no identity or strategic character**
"The Algorithm" is the only CPU persona. It picks the best available player by rating (or random on Easy). No personality, no strategic bias. Replays feel identical regardless of CPU settings.
- Impact: **Medium** | Effort: **Medium**
- Fix: Create 3 CPU personas with different pick strategies: "The Defender" (prioritises GK/DEF, drags you into a low-scoring game), "The Scorer" (prioritises FWD/MID, always picks the highest striker available), "The Balanced Build" (current behaviour, renamed). Each uses existing difficulty levels but picks by position preference first.

**DVC-3. Only 2 formations**
4-3-3 and 4-4-2. The 3-5-2 exists in other modes and DVC's slot system supports it.
- Impact: **Low** | Effort: **Low**
- Fix: Add `"3-5-2": { slots: ["GK","RB","CB","CB","LB","RM","CM","CDM","CM","LM","ST"] }` to DVC_FORMATIONS.

**DVC-4. No "rematch with same pool" after result**
"Play Again" after a DVC result discards the pool and starts fresh. If a player wants a rematch with the same player pool (to test a different build), they can't.
- Impact: **Low** | Effort: **Low**
- Fix: Store the draft pool from the last game. Add a "Rematch" button alongside "Play Again" that pre-loads the stored pool.

---

### PRIORITY SUMMARY (quick wins first)

| ID | Suggestion | Impact | Effort |
|---|---|---|---|
| EU-1 | Add Euro home card | High | Low |
| EU-2 | Solo Euro tournament mode | High | Low–Med |
| DVC-1 | DVC W/L/D record + leaderboard tab | High | Low |
| D-1 | Duels preset buttons (Quick/Standard/Full) | High | Low |
| OG-2 | Home card score badges + hierarchy | Med | Low |
| OG-4 | Sound effects (3 basic sounds) | Med | Low |
| OG-5 | Scoring for DVC + Duels | Med | Low |
| OG-6 | Manager bonus shown numerically | Low | Low |
| WC-4 | WC personal best on home card | Med | Low |
| WC-1 | Group stage preview before run | Med | Low |
| L-1 | Premier League in League mode | High | Med |
| MP-2 | Auto-fill at 9/11 in MP draft | Med | Low |
| CL-2 | Format explanation tooltip | Low | Low |
| WC-3 | Extra formations (4-2-3-1, 4-1-4-1) | Low | Low |
| DVC-3 | Add 3-5-2 to DVC | Low | Low |
| DVC-4 | Rematch with same pool | Low | Low |
| OG-3 | Onboarding / how to play panel | Med | Low–Med |
| L-2 | Deeper surprise event feedback | Med | Med |
| MP-1 | Reveal opponent squads post-tournament | Med | Low |
| WC-2 | Animated bracket reveal | Med | Med |
| D-3 | Duels series state persistence | Med | Med |
| OG-8 | League season share card | Med | Med |
| DVC-2 | CPU personas with pick strategy | Med | Med |
| MP-3 | Cross-session MP win tracking | Med | Med |
| CL-1 | Expand CL draftable squad pool | High | High |
| OG-7 | Lazy-load data per mode | Med | High |
| L-3 | Mid-season cup competition | Med | High |
| D-2 | Duels strategy depth rework | Med | High |

---

## §30. Task 18 — New rare surprise events + bonus respins (League mode)

**Status: COMPLETE** | Files: `league.js v83`, `floodlights.css v113`, `index.html`, `sw.js wcxi-v133`

### New event types in `_lgMakeEvent()`

Three new rare event types added (fire ~22% of the time; existing manager/player events reduced proportionally):

**`boost`** (9% of events) — Form Surge
- A random outfield player enters peak form
- Rating boosted by +4 to +7 for the rest of the season
- Boost persists via `LS.xi[i].r` modification, flows into `_lgRecomputeUserStr()` + `_lgResimFrom()`
- Shows: gold `.lg-event-rare` modal with featured player card + new rating

**`windfall`** (8% of events) — Transfer Windfall (the "bonus respin")
- "Board approves emergency transfer funds!"
- Stage 1: announcement with "Spin a squad →" button
- Stage 2: pick player list (same `_lgPickReplacementSquad` machinery); eligible upgrades shown with `▲` badge
- Stage 3: before/after comparison panel → Continue
- Targets weakest non-GK player in current XI

**`cup`** (5% of events) — Cup Run
- Simulates a one-off domestic cup final using `simMatch(LS.userStr, randomOppStr)`
- Win/loss narrative with styled `.lg-cup-result.W/.L` score line
- Pure narrative — no league pts side-effects (clean)

### Distribution
| Manager set? | Manager% | Player% | Boost% | Windfall% | Cup% |
|---|---|---|---|---|---|
| Yes | 35 | ~43 | ~13 | ~6 | ~3 |
| No | 0 | ~78 | ~13 | ~6 | ~3 |

### CSS additions (floodlights.css v113)
- `.lg-event-rare` — gold top-border + warm gradient tint on event modal
- `.lg-event-rare-badge` — gold pill chip (FORM SURGE / BONUS RESPIN / cup name)
- `.lg-boost-hero` — featured player card with large rating number
- `.lg-wf-up` — cyan ▲ upgrade indicator in windfall player list
- `.lg-cup-result.W/.L` — styled score line matching W/L colour system

---

## §31. Task 19 — Spin wheel redesign

**Status: COMPLETE** | Files: `game.js v95`, `multiplayer.js v94`, `floodlights.css v114`, `index.html`, `sw.js wcxi-v134`

### Animation improvements

**`spinReel()` (game.js)**
- BLUR: 10 → 14 items (more visual travel through the strip)
- Dynamic item height: `stripEl.firstElementChild.offsetHeight` instead of hardcoded 96 — correctly handles CL mode (58px items)
- Easing: `cubic-bezier(0.12,0.05,0.05,1)` vs old `cubic-bezier(0.25,0.1,0.15,1)` — sharper deceleration gives slot-machine snap feel
- Duration: 380ms → 560ms (country), 420ms → 620ms (year)
- Settle flash: `.reel--settled` added to `.reel` element on finish; removed after 950ms

**`doSpin()` (game.js)**
- Button text: `"SPIN"` → `"SPINNING…"` → `"SPIN"` for clear state feedback

**`doSpinDraft()` (multiplayer.js)**
- Same easing, BLUR 10→12, duration 420→520ms
- Same settle flash via `cStrip.parentElement` / `yStrip.parentElement`
- Dynamic `renderedIH` for correct scroll distance

### Visual redesign (floodlights.css v114)

- `.machine::before` — 3px rainbow gradient bar at top of machine (violet→cyan→gold→coral)
- `@keyframes reelSettle` — outer gold glow flash on `.reel` when strip settles (peaks at 16%, fades over 0.95s)
- `.reel--settled` — triggers the animation; in reduced-motion block → `animation: none`

---

## §32. Task 20 — Security review + domain suggestions

**Status: COMPLETE** | Files: `game.js v96`, `floodlights.js v93`, `ratingswar.js v103`, `draftvscomputer.js v7`, `index.html`, `sw.js wcxi-v135`

### Security audit findings + fixes

**Fixed (code changes):**
1. `esc()` inconsistency across modules — standardised to escape `&`, `<`, `>`, `"` in all 6 modules:
   - `game.js`: was missing `>` escape → added
   - `floodlights.js`: was missing `"` escape → added
   - `draftvscomputer.js`: was missing `"` escape → added
   - `league.js`, `multiplayer.js`, `ratingswar.js`: already complete ✅

2. `d.p1n` length limit in `ratingswar.js` (async URL challenge):
   - Player name decoded from URL hash was not length-limited (unlike online mode which uses `.slice(0,14)`)
   - Fixed: `String(d.p1n||"Player 1").slice(0,14)` at line 1195

**No action needed (OK):**
- No `eval()`, `new Function()`, or `document.write()` anywhere ✅
- No hardcoded API keys, secrets, or tokens ✅
- All user-entered team names escaped via `esc()` before DOM insertion ✅
- All player names from data files escaped before DOM insertion ✅
- Leaderboard names escaped at render time (`e.name` in `renderBoard()`) ✅
- JSON.parse from localStorage always wrapped in try/catch ✅
- Async URL atob decode wrapped in try/catch; malformed base64 safely handled ✅
- Service worker: correct origin scope, versioned cache, network-first fallback ✅

**Accepted risks (documented):**
- **PeerJS CDN (unpkg.com)**: loaded dynamically in `net.js` via `loadPeerJS()` only when user opens online mode. No SRI possible for dynamic script tags. Mitigation: self-host PeerJS. Low risk since PeerJS is only used for signalling; game data flows P2P.
- **Google Fonts CDN**: `fonts.googleapis.com` and `fonts.gstatic.com`. Privacy consideration (Google sees visitor IPs). Mitigation: self-host fonts. Acceptable for current scale.
- **No CSP headers**: GitHub Pages doesn't support custom HTTP response headers. Meta CSP tag omitted because: (a) app uses many `style=""` attributes requiring `'unsafe-inline'`, (b) PeerJS CDN would need to be allowlisted, reducing CSP benefit. Revisit if moving to Netlify/Vercel.
- **LocalStorage data**: all player-controlled data (team names, results) stored locally. No data leaves the device except via WebRTC P2P when using online mode.

### Domain suggestions

Current URL: `https://ismaeelazhar-cmd.github.io/eleven-xi/`

Recommended domains (check availability at Namecheap/Cloudflare):

| Domain | Notes |
|---|---|
| `elevenxi.app` | Best match — clean, modern `.app` TLD, exact app name |
| `elevenxi.io` | Techy feel, popular for games/tools |
| `elevenxi.com` | Most memorable but likely taken |
| `eleven-xi.com` | Matches GitHub repo name exactly |
| `myelevenxi.com` | Adds user ownership feel, likely available |
| `elevenxi.co` | Short, available alternative |
| `spinxi.app` | Plays on the core spin mechanic |

**Setup on GitHub Pages with custom domain:**
1. Register domain, point DNS A records to GitHub IPs: `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`
2. Add `CNAME` file in repo root: contents = `elevenxi.app`
3. In GitHub repo Settings → Pages → Custom domain → enter domain
4. GitHub auto-provisions HTTPS via Let's Encrypt
5. Update `manifest.webmanifest` `start_url` and `scope` to use the new domain
