# ELEVEN XI — SESSION HANDOVER

> **NEW SESSION? PASTE THIS TO ORIENT INSTANTLY:**
> You are continuing development on **Eleven XI**, a premium football squad-builder and league-simulation web game (vanilla HTML/CSS/JS, no build step) inspired by but deliberately distinct from 38-0. Read **HANDOVER.md** and **PROGRESS.md** in full before doing anything else, then continue from the last checkpoint. The full brief, the locked "Floodlights" design system, architecture, completed features, decisions, and outstanding tasks are all documented in those two files. Do not restart from scratch, do not re-skin finished screens, and do not re-open locked decisions. Run locally with `python3 -m http.server 8777` from the project root; rebuild the offline `eleven-xi.html` and bump the cache version after each change.

_Living document — update after every significant change. Last updated: T8 full game makeover pass done. Cache wcxi-v101. floodlights.css v90, game.js v82, ratingswar.js v93. Next: T9 deploy + permanent HTTPS link._

---

## 1. Project overview
- **What it is:** Eleven XI — spin/draft an all-time XI from **real historical squads (1950→2026)**, pick a formation + manager, then simulate a full season (or other modes) and get a premium results summary.
- **Inspired by:** 38-0 (draft-an-XI + simulate). **Distinct from it:** different identity (see Design System), far more modes, real multi-era squad data, and richer summaries.
- **Who it's for:** football fans who enjoy "build your dream/era XI and see how it does" — casual, replayable, shareable.
- **Vision:** the most premium, cohesive, content-rich version of this genre — one identity from first screen to final whistle.

## 2. Design system — "Floodlights" (LOCKED — do not change)
- **Palette (semantic tokens in `tokens.css`):** Midnight base `#0B1020` · Slate surface `#1B2340` · **Violet `#7C5CFC`** (primary/interactive) · **Cyan `#22E0C8`** (positive/wins) · **Coral `#FF7A59`** (CTA/warning) · **Gold `#F5B43C`** (champions ONLY). Cool whites `#ECF1FF`/mist/mute for text.
- **Typography:** **Bricolage Grotesque** (display/headings) + **Inter** (body). Fluid `clamp()` type scale (`--t-display`…`--t-2xs`). Tabular figures for all stats/scores.
- **Spacing:** 4/8 rhythm tokens `--sp-1..9`. **Radii:** `--r-sm..xl` + pill. **Elevation:** `--sh-1/2/glow-*`.
- **Motion:** 140/220/340ms tokens; `--ease-out` (enter) and `--ease-spring` (press/settle). Reduced-motion respected globally.
- **Signature element:** the **tactics-board pitch** — dark navy with glowing cyan lines (NOT green grass) and colour-coded position dots: **gold GK, cyan DEF, violet MID, coral FWD**. Plus bento home + per-mode accent colours + SVG icons (no emoji in structural UI).
- **Three-layer tokens:** primitive → semantic (dark + light) → component. **Rule: components never use raw hex** — only tokens, so dark/light stay consistent. Legacy `style.css` vars (`--gold`,`--green`,`--card`,`--txt`…) are **remapped** to Floodlights tokens in `floodlights.css`, which is why every old screen inherits the new look.
- **Rejected directions (do not revisit):** B "Claret Editorial" (serif/heritage — dates badly on stat tables), C "Neon Stadium" (arcade — reads cheap at density).

## 3. Architecture overview
- **Stack:** plain HTML + CSS + JS, no framework, no build. Served static. PWA via `sw.js` (network-first cache). State in module-scoped vars + `localStorage` (`wcxi_theme`, `wcxi_manager`, `wcxi_leaderboard`). No backend, no outbound calls.
- **Load order matters** (`index.html`): fonts → `style.css` → `tokens.css` → `floodlights.css` → data files → `positions.js` → `data_fixups.js` → engine/game/league/multiplayer → `floodlights.js` → `ratingswar.js`.
- **Key files:**
  - `tokens.css` — design tokens (edit palette/type/spacing HERE only).
  - `floodlights.css` — base, app shell, home/bento, button/results unification, compact-wheel rules, squad-dock + Duels styles, legacy-var remap.
  - `floodlights.js` — UI bootstrap: `flToast()`, Duels card hook (`window.startDuels`), and the **universal squad dock** (FAB + slide-in panel, reads XI from DOM).
  - `ratingswar.js` — Duels: local `window.startDuels()` (pass-and-play) **and** online `window.startDuelsOnline(role)` (each device builds blind, XIs exchanged over `ElxiNet`, synced reveal).
  - `game.js` — World Cup + Champions League (shared `#draftView`; `body.mode-cl` toggles CL). Owns leaderboard (`window.WCXI_addScore`), managers (`window.WCXI_MANAGERS`).
  - `league.js` — League mode (La Liga/Serie A/Bundesliga/Ligue 1). Has the redesigned `lgr2-*` results, surprise events, scrollable squad modal.
  - `multiplayer.js` — multiplayer entry: **Online/Offline split**, online **lobby** (create/join codes), mode-select, plus local pass-and-play draft + knockout.
  - `net.js` — **online transport** (`window.ElxiNet`): zero-backend WebRTC P2P over the free PeerJS public broker (lazy-loaded from CDN only when Online is chosen). host()/join(code)/send()/close() + status/data/peer-leave callbacks; 4-char share codes.
  - `engine.js` — simulation engine.
  - Data: `data*.js`, `cl_data*.js`, `*_history.js` (PL/Euro/WC/league histories), `positions.js` (curated granular positions), `data_fixups.js` (fills missing positions + tier-calibrates WC ratings at load).
  - `eleven-xi.html` — generated standalone single-file build (inline everything). Rebuild via the inline python script after each change.
- **Cache versioning is MANUAL:** bump `wcxi-vNN` in `sw.js` AND the `?v=NN` query strings in `index.html` on any asset change, or browsers serve stale files. (Flagged for automation.)

## 4. Game modes
1. **World Cup** — full-size spin wheel; draft XI from 93 nations (1950–2026); simulate a 48-team tournament (group → knockout) with staged reveal → results summary. Keeps the **full** reel.
2. **Champions League** — `body.mode-cl`; club squads (153 clubs/768 seasons); Swiss/league/group formats; **compact** wheel.
3. **League** — La Liga/Serie A/Bundesliga/Ligue 1; draft XI, simulate a full season game-by-game with surprise events (manager sacked, injuries), then the `lgs-*` premium summary (hero with huge position number, W-D-L strip, mini table highlighted with user, awards, player stats); **compact** wheel; scrollable squad modal. Distinct identity from the WC/CL summary. Widened layout: results 800px, setup 660px.
4. **Multiplayer** — entry splits **Local** (pass-and-play; 2–8 draft then knockout) vs **Online** (create/join a game code, then play). **compact** wheel.
5. **Duels** (`ratingswar.js`) — local (pass-and-play) **or online** (each builds blind on their own device, XIs synced over WebRTC, identical reveal both sides with a "(you)" perspective label + rematch handshake). Two players build an XI **blind** (ratings never in the DOM during build), pass-and-play handoff, then **head-to-head position-by-position reveal** (higher rating wins each slot) with sticky scorebar + winner arrows → verdict/rematch. Reachable from BOTH the home bento card AND a native **Multiplayer mode-select** (Draft Tournament vs Duels) — Task 3 done.
- **Universal squad dock:** FAB ("Squad N/11") appears on every mode; opens a slide-in panel grouped GK/DEF/MID/FWD. Names now **wrap in full** (no ellipsis) and the dock **strips ratings** (RW-safe). Verified on all 5 modes — Task 4 done.

## 5. Features completed (confirmed working)
- Floodlights identity + three-layer tokens; redesigned **home/bento** (SVG icons, dark+light verified).
- **Global cohesion** — every screen wears Floodlights via the legacy-var remap.
- Responsive base (dvh, fluid container, ≥44px touch targets, reduced-motion, focus rings).
- **Compact spin wheel** everywhere except World Cup (verified League 58px vs WC 96px).
- **Universal squad pop-out** dock on every mode (verified League).
- **Duels** full flow (blind build verified leak-free; reveal; winner; rematch).
- **Unified results** — WC/CL/MP result components share the League summary language (verified WC results).
- Security audit clean; nested duplicate removed; dead footer links neutralised.
- **Standalone offline app** `eleven-xi.html` (rebuilt at v79).
- **T3:** Duels integrated into the Multiplayer section (game-type select: Draft Tournament vs Duels).
- **T4:** Squad pop-out shows FULL untruncated names on every mode (WC/CL/League/MP/Duels all verified); dock also strips ratings so none leak.
- **T5:** Online multiplayer with shareable game codes — Online/Offline split, Create/Join lobby (real WebRTC P2P, no backend), edge cases (invalid code, disconnect, no-opponent timeout), premium lobby, and a **fully-synced online Duels** (verified across two browsers: matching 6–5 result, perspective labels, rematch).
- **T7:** Autofill genuinely random (Fisher-Yates shuffle across all years/clubs) — fixed the previous sequential bias.
- **T8:** League mode overhaul — layout wider (results 800px, setup 660px), injury replacement spin verified (2.5%/game), complete new `lgs-*` summary design with hero position number + W-D-L strip + mini table + awards + player stats. Ligue 1 data audited (removed Metz + Clermont Foot, now exactly 18 teams for 34-game season).
- **T9:** Summary page audit — added `Play Again` + `← Home` buttons at bottom of WC and CL result pages (`renderWCStage`, `renderLeagueStage`). League/MP/RW already had end-of-page navigation.

## 6. Features in progress
- None mid-edit. Last completed: T8 full game makeover pass.

## 7. Features outstanding (master task list order)
- **T10** Final PROGRESS.md + HANDOVER.md + GitHub push (in progress).
- **T6** Animations & 3D pass (card flips/tilt, screen transitions, physics spin, count-ups, confetti, ambient depth).
- **Online Draft Tournament** — only Duels is synced online so far; deferred.
- Also: **permanent hosting** (needs owner login), lazy-load 5 MB data, automate cache versioning.

## 8. Decisions log (key — full in DECISIONS.md)
- **Floodlights** chosen (most distinctive/premium/durable; furthest from 38-0).
- Re-mapped legacy CSS vars → tokens rather than rewriting markup (cohesion, low regression risk).
- Squad dock reads XI from the **DOM** (no per-mode hooks) — mode-agnostic, zero regression risk. Ratings intentionally hidden in the dock (consistency + RW-safe).
- Compact wheel via CSS height change is safe because modes re-render the final pick explicitly post-animation.
- Results unification via shared CSS language (not a structural rewrite of each sim) to avoid breaking working simulations.
- Built standalone JS app (offline; trade-off: no SW from file://, not needed).
- **T5:** chose **PeerJS public broker + WebRTC** for online (only viable zero-backend P2P; verified the broker is reachable before building). Online is lazy-loaded so the offline game never touches the network. Game code = 4 chars from an unambiguous alphabet, namespaced `elxi-<code>` on the broker. **Scoped online gameplay to Duels** (natural 1v1, each builds on own device then XIs sync) — a synced live draft pool is a larger build, deferred; online Draft Tournament is steered to Local for now. Fixed a message-ordering race (XI sent before peer's handler was ready) with a hello-triggered re-send.
- **T4:** dock names changed from `text-overflow:ellipsis/nowrap` to `overflow-wrap:anywhere` (wrap). Wrapping exposed a pre-existing scrape bug where the rating chip (`.xi-rate`) bled into the name; fixed `scrape()` to strip rating chips + a stray trailing rating number, so the dock stays rating-free (and Duels-safe) on every mode.

## 9. Known issues
- **Hosting is a temporary Cloudflare quick tunnel** — URL changes on restart, dies if the Mac sleeps. Not permanent.
- **Honour-system leaderboard** (client-side; editable via dev tools) — inherent to a serverless game; needs a backend to harden.
- **Manual cache versioning** — easy to forget; ship-stale risk.
- **Online needs internet + the PeerJS public broker** — if the broker is down or a restrictive NAT/firewall blocks WebRTC, Online won't connect (Local always works offline). Online Draft Tournament not yet synced.
- **~5 MB eager data load** — sluggish cold load on mid-range phones (lazy-load outstanding).

## 10. Player ratings (audit status)
- Current ratings are **heuristic**: order-based baselines + a legends bump list + club/nation **tier calibration** (`data_fixups.js` pulls weak WC sides down so minnows aren't near-elite). Positions for history data are line-derived (or curated in `positions.js`).
- **NOT yet individually audited for era accuracy** — that's **Task 8** (full database pass: legends must stand out; correct over/under-rated; positional fairness; bands world-class 88+/elite 83–87/very good 77–82/good 70–76/avg 60–69; era-relative).

## 11. Shareable link & hosting
- **Live (temporary tunnel):** https://investments-classifieds-aka-traditions.trycloudflare.com (serves project dir; `eleven-xi.html` for the offline build).
- Restart tunnel: `/tmp/cloudflared tunnel --url http://localhost:8777` (binary already downloaded; URL changes each run).
- **Permanent hosting needs owner's one-time login** (GitHub Pages / Netlify / Cloudflare Pages) — outstanding.

## 12. How to continue
1. Read **this file**, then **PROGRESS.md** (last checkpoint + exact next step).
2. **Exact next step right now: TASK 10** — Finalize PROGRESS.md + HANDOVER.md (done) and push to GitHub. Owner must add a remote first: `git remote add origin <github-url> && git push -u origin main`.
3. Work task by task; after each, rebuild `eleven-xi.html`, bump cache version, and update **both** PROGRESS.md and this HANDOVER.md.
4. **Current next step:** T10 — finalize docs and push to GitHub. To push: `git remote add origin <url> && git push -u origin main`. The remote has not been configured; owner must supply the GitHub repo URL.
