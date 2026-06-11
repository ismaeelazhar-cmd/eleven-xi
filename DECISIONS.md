# Eleven XI — Autonomous Build · Decision Log

Decisions made on the owner's behalf (he stepped away and asked me to use best judgement, picking the *best* option, not the safest).

## Design direction
- **Chose Direction 1 — "Floodlights"** (midnight navy + violet/cyan/coral, tactics-board pitch, Bricolage Grotesque + Inter).
  - *Why:* most distinctive and premium of the three, and the furthest from 38-0 (which is black + single green grass). Violet/cyan reads modern and "match-night under floodlights"; the bento layout + tactics-board pitch give it an identity a heritage-serif (B) or neon-arcade (C) direction wouldn't sustain across many data-dense screens. Editorial-serif risks looking dated on stat tables; neon risks looking cheap. Floodlights stays premium at density.

## Architecture
- Built a **three-layer token system** (`tokens.css`) and re-pointed every legacy CSS variable to it (`floodlights.css`), so all existing screens inherit the identity without a risky full markup rewrite. *Why:* maximal cohesion, minimal regression risk, on a large patched codebase.
- Replaced emoji mode icons with **inline SVGs**. *Why:* skills + accessibility — emoji are font-dependent and off-brand.

(Further decisions appended below as the build proceeds.)

## Safety & distribution (Phase 2)
- **Removed** the nested `./worldcup-xi/` duplicate (bloat + would expose an old copy via directory listing).
- **Neutralised** the dead footer links (`href="#" target="_blank"` → no-op) so they don't open junk tabs.
- Confirmed: no API keys/secrets, no outbound network calls (only the SW cache handler), no external deps, HTTPS via the tunnel, user input escaped. Leaderboard is client-side/honour-system — inherent to a serverless game; left as-is (a real anti-cheat needs a backend — flagged, not built).
- **Built the standalone single-file app** (`eleven-xi.html`, 5.4 MB) — judged it viable and worth it: opens offline in any browser, no server. Trade-off: PWA "install"/service-worker won't run from file:// (not needed; caching only). Verified it boots with all data.

## Deployment
- Permanent *hosted* link needs a one-time login (GitHub Pages/Netlify) which I can't do unattended, so for now the live link is the Cloudflare tunnel + the offline single-file is the truly portable artifact. Flagged hosting as the first thing to finish together.

## Judgement calls I deliberately did NOT rush
- **Ratings War** (hidden-ratings mode): left as a styled placeholder. Building the blind-draft + reveal logic so ratings genuinely never leak into the DOM must be airtight; a rushed unattended version risks shipping the headline feature broken. Best judgement: flag as #1 to build together, not half-ship.
