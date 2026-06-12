# Eleven XI — BUILD PROGRESS (read this first when resuming)

> **Resume rule:** open this file first. It is the single source of truth for what's
> done, what's left, decisions made, and exactly where to pick up. Update it after
> every completed part.

_Last checkpoint: Tasks 0-7 ALL COMPLETE. Cache wcxi-v114. floodlights.css v100, draftvscomputer.js v2 (LINE_OF bug fixed), game.js v86, multiplayer.js v91. Push to GitHub after this checkpoint._

---

## 0. Project facts
- **Project root:** `/Users/ismaeelazhar/worldcup-xi`  (vanilla HTML/CSS/JS, no build step)
- **Run locally:** `python3 -m http.server 8778` from project root → http://localhost:8778/index.html
- **Live production:** https://ismaeelazhar-cmd.github.io/eleven-xi/ (auto-deploys on push to main)
- **GitHub SSH:** `git@github.com:ismaeelazhar-cmd/eleven-xi.git`
- **Cache version:** `wcxi-v114`
- **Current file versions:** style.css v79, tokens.css v74, floodlights.css v100, game.js v86, multiplayer.js v91, floodlights.js v87, ratingswar.js v100, draftvscomputer.js v2, sw.js wcxi-v114

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

## 11. CURRENT FILE VERSIONS (post-tasks 4-7)
- floodlights.css: v100
- draftvscomputer.js: v2 (LINE_OF bug fixed)
- sw.js: wcxi-v114

## 12. REMAINING BACKLOG
- Lazy-load data per mode (~5 MB eager load)
- Supabase persistent leaderboard (deferred — needs external account)
- Staging environment (deferred — needs GitHub branch config)
- Undo last pick (medium effort, high player value)
- Reroll count tooltip / explanation
- Theme persistence (localStorage, 10 min)
- Squad dock FAB detection for DVC mode
- Self-host PeerJS to remove CDN dependency (minor security improvement)
