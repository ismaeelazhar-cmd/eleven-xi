# Eleven XI — BUILD PROGRESS (read this first when resuming)

> **Resume rule:** open this file first. It is the single source of truth for what's
> done, what's left, decisions made, and exactly where to pick up. Update it after
> every completed part.

_Last checkpoint: Catch-up audit complete. All 16 checklist items addressed (3 deferred). Cache wcxi-v104. Next: Phase 2 — 10 Duels features._

---

## 0. Project facts
- **Project root:** `/Users/ismaeelazhar/worldcup-xi`  (vanilla HTML/CSS/JS, no build step)
- **Run locally:** `python3 -m http.server 8778` from project root → http://localhost:8778/index.html
- **Live production:** https://ismaeelazhar-cmd.github.io/eleven-xi/ (auto-deploys on push to main)
- **GitHub SSH:** `git@github.com:ismaeelazhar-cmd/eleven-xi.git`
- **Cache version:** `wcxi-v104`
- **Current file versions:** style.css v79, tokens.css v74, floodlights.css v91, game.js v85, multiplayer.js v89, floodlights.js v86, ratingswar.js v94, sw.js wcxi-v104

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

### ✅ COMPLETED (10/16)
1. ✅ **SVG icons** — manager chips (7 SVGs: shirt/swords/shield/flame/trophy/megaphone/lightning) + theme toggle (sun/moon SVGs)
2. ✅ **Lock XI hidden** — buttons hidden until squad is exactly 11/11
3. ✅ **Auto-fill quality floor ≥ 75** — `if ((pl.r || 0) < 75) return;` in autoFill()
4. ✅ **Champion name/flag in WC Final bracket card** — `.bracket-champion` added to renderBracket() for last round
5. ✅ **sessionStorage draft** — saveDraft/loadDraft/clearDraft, restore hint on draft screen
6. ✅ **Keyboard navigation** — Space=spin, Enter=auto-pick on draft screen
7. ✅ **Share XI PNG** — Canvas-based 900×1200 generation, navigator.share or download
8. ✅ **Half-pitch formation view** — both dark + light themes updated in tokens.css + style.css
9. ✅ **Share game link** — home screen "Share game" button, clipboard copy, fallback prompt
10. ✅ **Summary stat pills centred** — `justify-content: center` on `.stat-grid`
11. ✅ **Player pop-out consistency** — ratingswar.js + multiplayer.js wrapped with `.squad-card`
12. ✅ **Production server** — GitHub Pages, auto-deploys, stays live when MacBook off
13. ✅ **SETUP.md** — deployment, rollback, status check, cache bump checklist

### ⏳ DEFERRED (requires external account/arch work)
14. ⏳ **Supabase leaderboard** — requires Supabase project creation, RLS setup, API keys. Currently localStorage honour-system.
15. ⏳ **Cold load lazy-loading** — ~5 MB eager load; significant architecture refactor of data.js loading
16. ⏳ **Staging environment** — requires GitHub branch + separate Pages URL configuration

## 4. PHASE 2 — DUELS FEATURES (next up)

All 10 toggles go in the Duels setup/lobby menu. Each has an ⓘ info icon with semi-transparent tooltip (hover desktop / tap mobile, dismiss on click-away or mouse-leave). All default to OFF. Base Duels with all off must work perfectly.

**Order to implement:**
1. ⏳ X-Factor Slot — one random position counts double at reveal
2. ⏳ Captain — designate one position; that position scores +2 if won
3. ⏳ Position Ban — each player bans 1 slot before building
4. ⏳ Steal Power-Up — once per match, steal opponent's best player into your XI
5. ⏳ Blind Swap — after lock, secretly swap 2 positions (countdown timer)
6. ⏳ Wildcard Spin — one mystery spin from the full global pool (any era/nation)
7. ⏳ Best of 3 Series — play 3 matches; first to 2 wins takes the series
8. ⏳ Draft from Shared Pool — live pick-order draft, no duplicate players
9. ⏳ Async Online Mode — share-link based async build (each player builds in own time)
10. ⏳ Formation Draft — formation secretly assigned before reveal

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
> Catch-up phase DONE. Push 7423850 is live on GitHub.
> Next: implement Phase 2 Duels features starting with #1 X-Factor Slot.
> Each feature needs: toggle in Duels setup menu + ⓘ tooltip + functional game logic.
