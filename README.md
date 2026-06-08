# World Cup XI

A spin-slot draft + simulator. Spin to draft an all-time XI from real World Cup
squads, pick a formation (which affects tactics), then run a 48-team World Cup or
a full round-robin league — or simulate the 48 nations directly. Installable as a
PWA and works offline.

Plain static site (HTML/CSS/vanilla JS) — no build step.

## Run locally
- **Quickest:** double-click `Launch World Cup XI.command`, or run
  `python3 -m http.server 8800` in this folder and open <http://localhost:8800/>.
- Opening `index.html` directly works too, but Install/offline need a server.

## Put it online (pick one)

### A) Netlify Drop (no account setup beyond a free login)
1. Go to <https://app.netlify.com/drop>.
2. Drag the file `worldcup-xi.zip` (in this folder) onto the page — **or** drag the
   whole folder.
3. You get a public `https://…netlify.app` URL instantly.

### B) GitHub Pages (permanent, on your GitHub)
This repo is already committed locally. Then:
```bash
# create an empty repo on github.com named "worldcup-xi" first, then:
git remote add origin https://github.com/<your-username>/worldcup-xi.git
git branch -M main
git push -u origin main
```
On GitHub: **Settings → Pages → Source: Deploy from a branch → main / root → Save.**
Your site appears at `https://<your-username>.github.io/worldcup-xi/`.

## Files
- `index.html` — app shell / views
- `style.css` — 38-0-style theming
- `data.js` — draftable World Cup squads
- `nations.js` — 48-team field + ratings
- `engine.js` — match sim, group/knockout/league logic
- `game.js` — UI controller (draft, formations, results)
- `manifest.webmanifest`, `sw.js`, `icon*.png/svg` — PWA bits
