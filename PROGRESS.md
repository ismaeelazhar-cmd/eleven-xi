# Eleven XI — BUILD PROGRESS (read this first when resuming)

> **Resume rule:** open this file first. It is the single source of truth for what's
> done, what's left, decisions made, and exactly where to pick up. Update it after
> every completed part.

_Last checkpoint: Bug fixes — rating badge contrast + X button respin exploit. Cache wcxi-v110. floodlights.css v97, multiplayer.js v90, ratingswar.js v100. Commit 9096e13._

---

## 0. Project facts
- **Project root:** `/Users/ismaeelazhar/worldcup-xi`  (vanilla HTML/CSS/JS, no build step)
- **Run locally:** `python3 -m http.server 8778` from project root → http://localhost:8778/index.html
- **Live production:** https://ismaeelazhar-cmd.github.io/eleven-xi/ (auto-deploys on push to main)
- **GitHub SSH:** `git@github.com:ismaeelazhar-cmd/eleven-xi.git`
- **Cache version:** `wcxi-v109`
- **Current file versions:** style.css v79, tokens.css v74, floodlights.css v97, game.js v85, multiplayer.js v90, floodlights.js v86, ratingswar.js v100, sw.js wcxi-v110

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
> Bug fixes done (commit 9096e13):
> - Rating badges in player pop-out now have solid backgrounds with 7-tier color system
> - X button on squad panel now costs 1 respin; at 0 rerolls shows toast and blocks close
> Next: tackle remaining backlog (lazy-load, animations, online tournament, etc.)
> Or verify Phase 2 Duels features in live game at https://ismaeelazhar-cmd.github.io/eleven-xi/

## 6b. BUG FIXES COMPLETED
- ✅ **Rating badge contrast** — mp-r-badge has solid background + 7-tier colors (gold/elite/great/good/amber/orange/red). ratingTierClass extended in both multiplayer.js and ratingswar.js.
- ✅ **X button respin exploit** — X now costs 1 respin. At 0 rerolls, toast fires and panel stays open (must pick).

## 7. REMAINING BACKLOG
- Lazy-load data per mode (~5 MB eager load)
- Animations & 3D pass (card flips, transitions, confetti)
- Online Draft Tournament (only Duels synced online currently)
- Automate cache versioning
- Supabase persistent leaderboard (deferred — needs external account)
- Staging environment (deferred — needs GitHub branch config)
