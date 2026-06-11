# Eleven XI — BUILD PROGRESS (read this first when resuming)

> **Resume rule:** open this file first. It is the single source of truth for what's
> done, what's left, decisions made, and exactly where to pick up. Update it after
> every completed part.

_Last checkpoint: NEW SESSION — T1 complete (resumed, GitHub confirmed up to date at cd61c01, game open). Next: T2 (shareable HTTPS link)._

---

## 0. Project facts
- **Project root:** `/Users/ismaeelazhar/worldcup-xi`  (vanilla HTML/CSS/JS, no build step)
- **Run locally:** `python3 -m http.server 8777` from project root → http://localhost:8777/index.html
- **Standalone offline app:** `eleven-xi.html` (5.4 MB, self-contained, opens from file://). Rebuild: `python3` inline script.
- **Cache version:** service worker `wcxi-v86`; `index.html` references `?v=` query strings — bump on asset change.
- **Current versions:** style.css v76, league.js v74, data_league.js v74, game.js v75, floodlights.js v82, floodlights.css v85, sw.js cache wcxi-v87

## 1. Design direction — LOCKED: "Floodlights" (Option 1)
3 options were presented; owner picked **Option 1 — Floodlights**.
- **Palette:** Midnight `#0B1020` · Slate `#1B2340` · Violet `#7C5CFC` (primary) · Cyan `#22E0C8` (positive) · Coral `#FF7A59` (CTA) · Gold `#F5B43C` (champions only)
- **Type:** Bricolage Grotesque (display) + Inter (body), fluid clamp() scale
- **Signature:** tactics-board pitch (navy + cyan lines, not grass) · bento home · per-mode accent colours · SVG icons (no emoji)
- (Options B "Claret Editorial" and C "Neon Stadium" were rejected — see DECISIONS.md.)

## 2. Architecture / file map
- `tokens.css` — three-layer design tokens (primitive → semantic[dark+light] → component). **Edit palette/type/spacing here only.**
- `floodlights.css` — base, app shell, home/bento, token-mapped buttons, and a **global remap** of every legacy CSS var → Floodlights token (this is why all old screens inherit the new look).
- `floodlights.js` — UI bootstrap (toast; Ratings War placeholder hook `window.startRatingsWar`).
- `style.css` — legacy stylesheet (still in use; variable-driven so it re-skins via floodlights.css).
- Game logic: `game.js` (WC/CL + shared), `league.js` (League mode), `multiplayer.js` (MP), `engine.js`.
- Data: `data*.js`, `cl_data*.js`, `*_history.js`, `data_fixups.js` (positions+rating tiering), `positions.js`.
- `DECISIONS.md` — autonomous decision log.

## 3. COMPLETED
**Phase 1 (partial):**
- ✅ Design tokens + fonts + redesigned **home/bento** (SVG icons, 5 mode cards incl. "NEW" Ratings War). Verified dark + light.
- ✅ **Global cohesion** — every screen (setup, draft, reels, results, board, modals) now wears Floodlights via the token remap. Tactics-board pitch with colour-coded dots (gold GK / cyan DEF / violet MID / coral FWD). Verified on League draft.
- ✅ Responsive base (dvh, fluid container, ≥44px touch targets, reduced-motion, focus rings).
- ✅ **Compact spin wheel** (CSS in floodlights.css): full reel ONLY on World Cup (#draftView w/o body.mode-cl); Champions League, League, Multiplayer get a 58px slim inline wheel. Verified League 58px vs WC 96px.
- ✅ **Universal squad pop-out** (dock in `floodlights.js`): a slide-in panel + persistent FAB on EVERY mode; reads the live XI from the DOM (pitch/XI-list/RW-slots), grouped by line, full name + club, NO ratings (RW-safe), responsive bottom-sheet on mobile. Verified in League draft.
- ✅ **Ratings War mode built** (`ratingswar.js`): blind build (ratings NEVER in DOM — verified leak-free), pass-and-play handoff, head-to-head position-by-position reveal with sticky scorebar + winner arrows, winner/rematch. Own Floodlights flair. Verified dark+light, full flow 8–3 result.

**Phase 2 (done):**
- ✅ Security audit: no secrets, no outbound calls (only SW cache handler), no external deps, input escaped, HTTPS via tunnel.
- ✅ Fixes: removed nested `./worldcup-xi/` duplicate; neutralised dead footer links.
- ✅ Standalone single-file app `eleven-xi.html` built + verified (boots with all data offline).

**Phase 3 (assessment delivered):** full code/design/gameplay review + top-5 + feature menu given to owner (recorded in §7).

## 4. OUTSTANDING (ranked — pick up here)
1. ~~Ratings War~~ ✅ DONE (`ratingswar.js`). Next priority below.
2. **Permanent hosting** — replace the tunnel. Needs owner's one-time login (GitHub Pages / Netlify / Cloudflare Pages). Until then: tunnel = "works while Mac on", single-file app = portable.
3. ~~Universal squad pop-out~~ ✅ DONE (dock in floodlights.js).
4. ~~Compact spin wheel everywhere except WC~~ ✅ DONE (CSS scoped to mode-cl/leagueView/mpView).
5. ~~Unified results/summary across modes~~ ✅ DONE — League lgr2 redesign + a unification CSS layer brings WC/CL/MP result components (`.champion`,`.score-banner`,`.verdict-card`,`.stats-summary`,`.mcard`,board rows) onto the same Floodlights summary language (token cards, display headings, accent tabular numbers). Verified on World Cup results.
6. **Full QA playthrough** — every mode end-to-end on desktop + 375px mobile; fix broken layouts/dead ends; verify Ratings War rating-hiding.
7. **Performance** — lazy-load the ~5 MB data (load a mode's data file only on entering that mode).
8. **Bespoke polish** — screen transitions, count-ups, confetti; restyle legacy "Install app" pill + theme toggle to tokens.

## 5. DECISION LOG (summary; full in DECISIONS.md)
- Chose Floodlights (most distinctive/premium/durable; furthest from 38-0).
- Re-mapped legacy CSS vars → tokens instead of rewriting markup (max cohesion, min regression risk).
- Built the JS app (viable + valuable; trade-off: no SW from file://, not needed).
- Did NOT rush Ratings War unattended (hidden-ratings must be airtight; flagged as #1).

## 6. NEW SESSION TASK STATUS
- ✅ T1 Resume — GitHub confirmed current (cd61c01), game open at localhost:8777
- ✅ T2 Shareable HTTPS link: https://influenced-contents-facility-hoped.trycloudflare.com (Cloudflare tunnel, live while Mac is on)
- ✅ T3 Security audit complete:
  - FIXED: XSS in whoLabel() — userTeam.name and manager now wrapped in esc()
  - FIXED: c.pick.n in squad list now esc()-wrapped (defence in depth)
  - CLEAN: leaderboard (esc), match cards (esc), RW player names (esc), MP names (esc)
  - CLEAN: no API keys/secrets anywhere, no outbound calls except SW + lazy PeerJS CDN
  - CLEAN: directory listing — root serves index.html, no .env or credential files
  - INFO: PeerJS CDN (versioned unpkg URL) only loads on Online MP click — acceptable
  - game.js → v76, sw cache → wcxi-v88
- ⏳ T4 Harsh bug review
- ⏳ T5 Squad list cleanup (remove list below wheel, keep pop-out)
- ⏳ T6 Spin wheel size reduction
- ⏳ T7 Rating colour system (90+ gold, 85-89 green, etc.)
- ⏳ T8 Visual overhaul (reduce purple, 3D + animation)
- ⏳ T9 Game difficulty tuning
- ⏳ T10 Mid-game events (manager sacked/resigned, transfer clause)
- ⏳ T11 Ratings War power-ups (steal, remove+respin)
- ⏳ T12 Ideas and suggestions

## 6b. PREVIOUS SESSION TASK STATUS (all ✅)
- ✅ T1 Resume from checkpoint
- ✅ T2 SETUP.md terminal instructions
- ✅ T3 Manager card size — compact chips
- ✅ T4 Logo click → home from any screen
- ✅ T5 Rating number inside position circle when ratings visible
- ✅ T6 Squad selection as proper pop-out modal (full untruncated names)
- ✅ T7 Autofill genuinely random (Fisher-Yates shuffle, all years, all clubs)
- ✅ T8 League mode overhaul:
  - (a) autofill fix ✅ (done in T7)
  - (b) layout wider — results 800px (was 680px), setup 660px ✅
  - (c) injury replacement spin ✅ (already coded at 2.5% per game — verified)
  - (d) summary redesign ✅ — hero with huge position, W-D-L strip, mini table shown by default, awards, player stats, score breakdown; completely distinct from 38-0
  - (e) league audit ✅ — removed Metz + Clermont Foot (not in 2024-25 Ligue 1)
- ✅ T9 Summary page audit across ALL game modes:
  - WC result ✅ — added Play Again + ← Home at bottom of long scroll
  - CL result ✅ — same fix (both renderWCStage + renderLeagueStage)
  - League result ✅ — already has lgPlayAgain + lgHomeBtn (T8 work)
  - Multiplayer result ✅ — code-verified "← Back to Home" button present
  - Ratings War result ✅ — code-verified Rematch + ← Home buttons present
- ✅ T10 Final PROGRESS.md + HANDOVER.md updated. Committed (main 15fff9d). GitHub push pending — no remote configured. To push: `git remote add origin <url> && git push -u origin main`.

## 6b. EXACTLY WHERE TO PICK UP
> **NEW TASK LIST received (master prompt).** Working order now:
> - T1 ✅ resumed + results unification checkpointed.
> - T2 ✅ HANDOVER.md written (12 sections + paste-to-orient prompt at top).
> - T3 ✅ DONE — entering Multiplayer now shows a game-type select (Draft Tournament vs Ratings War, native Floodlights cards). Both routes verified. Home RW shortcut kept too.
> - T4 ✅ DONE — dock names wrap in full (no ellipsis) on WC/CL/League/MP/Ratings War; dock also strips rating chips so ratings never leak (RW-safe). All 5 modes verified live.
> - T5 ✅ DONE — Online multiplayer. `net.js` = zero-backend WebRTC P2P over the PeerJS public broker (lazy-loaded). Multiplayer entry now splits Local vs Online; Online lobby = Create Game (4-char code) / Join Game; premium Floodlights lobby (code card, copy, spinner, online tag). Edge cases handled: invalid code, disconnect (toast + back to lobby), no-opponent timeout. **Online Ratings War fully synced** — each builds blind on own device, XIs exchanged, identical reveal both sides, "(you)" label, rematch handshake. Verified across two real browser tabs (matching 6–5 result). Online Draft Tournament deferred (steered to Local/RW).
> - T6 = Animations & 3D pass (flips/tilt, transitions, physics spin, count-ups, confetti, ambient depth). ← NEXT.
> - T4 = squad pop-out on EVERY mode with FULL untruncated names (current dock truncates with ellipsis — must fix to wrap).
> - T5 = online multiplayer with shareable game codes (Online vs Offline split). BIG — needs a realtime transport (PeerJS/WebRTC or a free service); flag hosting/backend implications.
> - T6 = animations & 3D pass. T7 = consistency audit. T8 = player ratings audit. T9 = squad accuracy audit.
> After that, work down §4 in order. Rebuild `eleven-xi.html` after each part (inline script) and bump cache version.

## 7. PHASE 3 REVIEW + FEATURE MENU (saved for reference)
**Verdict:** strong, fun core loop + unmatched historical data; now has a cohesive premium identity; honest gaps = Ratings War, permanent hosting, bespoke per-screen polish + QA.
**Top 5 improvements:** 1) permanent hosting 2) build Ratings War 3) lazy-load 5 MB data 4) one consistent results template across modes 5) codebase cleanup (dedupe reel/pitch logic, automate cache versioning).
**Feature menu:** Gameplay — Ratings War(med), Survival/streak(med), Daily challenge(med), Knockout cup(med). Social — share-image everywhere(quick), H2H share codes(big), online leaderboard(big). Progression — achievements(med), career mode(big). Presentation — transitions/count-ups/confetti(quick-med), sound+haptics(med). Data — real fixtures(big), deeper stats(med). Access — keyboard/SR pass(med), colourblind-safe(quick).
