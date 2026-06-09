# World Cup XI — Handoff / Architecture Map

A browser game (vanilla HTML/CSS/JS, no build step, no framework). Spin a slot machine to
draft an all-time XI from real squads, pick a manager + formation, then simulate a tournament.
Two game modes: **World Cup** and **Champions League**. 38-0-inspired look, light/dark theme.

Run it: `cd ~/worldcup-xi && python3 -m http.server 8800` → open `http://localhost:8800/`
(or just open `index.html`, but Install/offline need a server).

State as of this writing: **86 countries / 313 squads / 6,555 WC players**; CL = 36-club
field + 8 seed club-seasons. Service-worker cache version in `sw.js` is `wcxi-vNN` (bump it
on every deploy or the browser serves stale files).

---

## Files

| File | Purpose |
|---|---|
| `index.html` | All views/markup: home, setup, draft, results, leaderboards. Script tags load data files first, then `engine.js`, then `game.js`. |
| `style.css` | All styling. Theme via CSS variables in `:root` (dark) + `body.light` overrides (cream/gold). Surfaces are vars: `--card,--card2,--card3,--reel,--reelbox,--modecard,--line`. |
| `game.js` | The controller (one big IIFE, `"use strict"`). UI, draft logic, reveal/results rendering, theme, leaderboards. |
| `engine.js` | Pure match/competition simulation. Exposes `window.ENGINE`. No DOM. |
| `nations.js` | `window.NATIONS` — 48-team World Cup field (name, flag, rating) used as opponents. |
| `cl_clubs.js` | `window.CL_CLUBS` — 36-club Champions League field (name, flag, rating). |
| **WC squad data** | `data.js` (curated) + `data_extra.js` (2026/legacy) + `data_full.js` (1998–2026 from doc) + `data_legacy.js` (pre-1998) + `data_full2.js` (1986/1994 from doc). All merge into `window.WORLD_CUP_DATA`. |
| `positions.js` | `window.PLAYER_POSITIONS` — name → granular position(s) for WC players that don't carry `gp` inline. |
| `cl_data.js` | `window.CL_DATA` — Champions League draftable squads (seed: 8 iconic winners). Expand from a pasted doc. |
| `sw.js` | Service worker, **network-first**. Lists all assets in `ASSETS[]` + `CACHE` version. |
| `manifest.webmanifest`, `icon*.{svg,png}` | PWA install bits. |
| `Launch World Cup XI.command` | Double-click launcher (starts server + opens browser). |
| `worldcup-xi.zip` | Drag-onto-Netlify bundle (rebuilt each deploy). |

## Data shape (identical for WC and CL)
```js
window.WORLD_CUP_DATA = {
  "Brazil": { flag: "🇧🇷", years: {
    "2002": [ { n:"Ronaldo", p:"FWD", r:95, gp:"ST" }, ... ]
  }}
};
// n=name, p=broad line (GK/DEF/MID/FWD, used for scoring), r=rating, gp=granular position.
// CL_DATA is the same but keyed by club, "years" keys are seasons.
```
Granular positions: `GK, RB, LB, CB, RWB, LWB, CDM, CM, CAM, RM, LM, RW, LW, ST`.
`game.js` maps each to a broad line via `LINE_OF`, and which slots a player can fill via
`SLOT_FILL` (e.g. CM→CDM/CAM, LB→LM). Formations are granular slot lists in `FORMATIONS`,
ordered left→right.

## engine.js (window.ENGINE)
- `runWorldCup(userTeam)` — 48 nations, 12 groups → R32→…→Final. Returns `{groups, rounds, champion, userMatches, userStats, userResult, ...}`.
- `runLeague(userTeam)` — 48-team round robin. `{table, userMatches, userRow, userPos, userStats, expectedPos, squadRating}`.
- `runCLLeague(userTeam)` — 36 clubs, each plays each once.
- `runCLGroups(userTeam)` — 8 groups of 4, home & away, top 2 → R16 → Final.
- `runCLSwiss(userTeam)` — 36-club league phase (8 games) → top 8 to R16, 9–24 playoff, → Final. `leaguePhase:true`, returns a 36-team `table`.
- Difficulty: `DIFFICULTY=10` (WC tax), `KO_ESCALATION` (per-round extra tax), `LEAGUE_DIFFICULTY=-2` (league is easier). Only the user's team is taxed → wins are rare (WC ~0.28%, league 1st ~50% but 47-0 impossible).
- Goal attribution (scorers/assists) + clean sheets only for the user's team (it carries `players`).

## game.js key concepts
- `mode` = `"wc"|"cl"`. `setMode(m)` reassigns `DATA`, `COUNTRIES`, `ALL_YEARS`, rebuilds setup, toggles CL-only UI (`#clFormatRow`, hides continent, relabels pool). Home buttons: `#homeWC`, `#homeCL`.
- `clFormat` = `"swiss"|"league"|"groups"` (`CL_FORMATS`).
- Draft: spin → `renderSquadPicker` → pick player → choose position (always, even if one) → fills a formation slot. Rerolls = difficulty (`Rookie 3 / Pro 1 / Legend 0`). Auto-pick / Auto-fill helpers.
- Results reveal one game at a time: `renderWCStage` (groups/league-phase → standings → "Into the knockouts" → KO, each round shows your result + the round's other results) and `renderLeagueStage` (season game-by-game → final standing + expected-position verdict). `runSim(type,userTeam)` for WC; `runCLSim(format)` for CL.
- Scoring + **leaderboards** persist in `localStorage` (`wcxi_leaderboard_v1`), daily/weekly/all-time. Theme persists (`wcxi_theme`). Otherwise nothing about a run/setup persists — New Game / app close resets options.
- Manager = full-name style grid (bonus styles) + a spin wheel of real managers (`MANAGERS_DB`), **one spin max**.

## Verify (no Node — use macOS JavaScriptCore)
`jsc` lives at `/System/Library/Frameworks/JavaScriptCore.framework/Versions/A/Helpers/jsc`.
Load the data + engine with a `var window={}` shim to sanity-check, or load game.js with a
small DOM stub. (See git history for the exact harnesses used.)

## Deploy loop (every change)
1. Bump `CACHE` in `sw.js` (`wcxi-vNN` → `vNN+1`).
2. `rm -f worldcup-xi.zip && zip -rq worldcup-xi.zip . -x "*.git*" "worldcup-xi.zip" "Launch World Cup XI.command" "README.md" ".gitignore"`
3. `git add -A && git commit -m "..."`
4. Restart server + open. **Hard-refresh the browser** (`Cmd+Shift+R`) — the old worker serves cached files for one load otherwise.

## Adding squad data from a pasted document (the recurring workflow)
The World Cup squads came from ChatGPT-share documents. The pages embed the conversation as
escaped JSON; fetch the HTML with `curl`, unescape `\n`/`\"`, then parse markdown-ish blocks:
`# YYYY FIFA World Cup` (year) / `## Country` or `### Country` (the two docs nested
oppositely!) / `- Player — POS`. Map their codes (`DM→CDM, AM→CAM, FW→ST, DF→CB, MF→CM`),
assign a flag + continent, and rate players: **reuse existing curated ratings by name, else
auto-generate deterministically** (`md5(name)`-based, ~72–89 by line). Emit an add-only file
(`add(country,flag,year,[...])` that skips already-present country/year). See
`data_full.js` / `data_full2.js` for the exact output format and the python generators in git.

**The open task:** the user is preparing a Champions League squad document (clubs by season,
1991→now). When pasted: parse it the same way, write `cl_data2.js` (add-only into
`window.CL_DATA`, keyed by club, season as the year), give clubs flags, reuse/auto ratings,
load it in `index.html` + `sw.js`. That's it — the CL mode + 3 formats already work off
`CL_DATA`/`CL_CLUBS`.

## Still-open / nice-to-haves
- Champions League full squad DB (seed is only 8 clubs).
- Buy-Me-a-Coffee + feedback-form links: footer buttons exist with `href="#"` placeholders
  (`#feedbackBtn`, `#coffeeBtn`) — drop in real URLs when the user provides them.
