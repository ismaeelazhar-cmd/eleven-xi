# Game Review — World Cup XI (working title)

_Reviewed at build v63. This is a living doc; update as items are fixed._

## Overall rating: **7.5 / 10**
A genuinely fun, content-rich spin-draft football game with real historical squads across
World Cup, Champions League, 5 domestic leagues, Euros and multiplayer. The depth of data is
its standout strength. It loses points for inconsistent presentation across modes, a few
unfinished features (per-mode leaderboards), and approximate auto-generated ratings/positions.
With a visual makeover and the planned gameplay extras it's an easy 9.

**Scorecard**
- Concept & fun: 9/10
- Content / data depth: 9/10
- Visual design & polish: 6/10 (inconsistent between modes; light mode needs an audit)
- Gameplay variety: 7/10 (sims are solid; surprise events + per-mode boards would lift it)
- Accessibility: 5/10 (focus states, contrast, keyboard nav need work)
- Stability: 8/10 (no console errors; data all loads cleanly)

---

## Bugs / issues
1. **Leaderboards are shared across all modes** — one `localStorage` key (`wcxi_leaderboard_v1`).
   WC, CL, League and MP scores all mix together. Per-mode boards were requested but never built.
2. **Positions are approximate for historical squads** — source data only gives broad D/M/F, so a
   fullback may display as CB. (Line is always correct; exact sub-role is inferred.)
3. **Ratings are heuristic** — squad order + club tier + a legends bump list. Many mid-tier players
   share identical numbers, and a legend can be missed if the source spells the name differently
   (e.g. accents). Good enough for a sim, not "real" FIFA-style ratings.
4. **"Share your season" only copies text** — not a real image/link share.
5. **Spin can stall if the tab is backgrounded mid-spin** (requestAnimationFrame throttling). Resolves
   on refocus; harmless but noticeable.
6. **Service worker version must be bumped manually** each release — easy to forget and ship a stale UI.
   (Mitigated now with `style.css?v=` busting.)
7. **Light-mode audit needed** — newer components (results page, squad modal) have some light overrides
   but haven't been fully checked for contrast/legibility.
8. **No edit/remove of a placed player** in League mode (only Auto-fill / new game).

## Improvements to make (priority order)
1. **Per-mode leaderboards** (finish the original ask) — separate boards for WC / CL / each League / MP.
2. **Surprise sim events** (1–3%/game): manager sacked → re-spin manager; injury → drop player + re-pick;
   plus red-card suspensions, hot-streak form boosts, cup upsets, transfer rumours.
3. **World Cup squads back to 1982** + a curated set of legacy squads pre-1982.
4. **Visual makeover** — one consistent, clean, accessible theme across every mode; light + dark.
5. **Real share** — render an image of the XI / season to share with friends.
6. **Search box in the squad popup** for large rosters.
7. **Accessibility**: visible focus rings, keyboard navigation, ARIA labels, AA contrast in both themes.
8. **Onboarding** — a 3-step "how to play" the first time.
9. **Save/resume** an in-progress draft.

## Name options
Current leaning: **ElevenXI** or **Eleven11**.
- **Eleven XI** — clean, footbally ("XI" = a starting eleven). Slight redundancy (eleven + XI) but reads as a brand.
- **Eleven11** — modern/sharp; the "11" doubles as a shirt number. Can be hard to say aloud.
- **XI** (just the numeral) — minimal, premium, but hard to search/SEO.
- **Starting XI** — instantly clear what it is.
- **Spin XI** — ties to the slot-machine draft mechanic.
- **Draft XI** — clear genre signal.
- **Galáctico** — glamorous, all-stars vibe.
- **Dream XI / DreamXI** — common but very clear.
- **First XI** — clean footballing term.
- **Pitch Perfect XI** — playful (taken-ish elsewhere).
- **Legacy XI** — fits the historical-squads angle.
- **Wonder XI** — upbeat.
- **GAFFER** — manager fantasy angle.

Recommendation: **Eleven XI** as the spoken/brand name with the mark styled as **11 / XI**. It keeps
the football meaning, is easy to say, and the logo can play on the dual "11 = XI".

## Logo direction
A clean monogram: the digits **11** where the second "1" is formed by/overlaps a roman **XI**, in the
gold→white treatment already used, on a dark roundel for the app icon. Avoid emoji and clip-art. See
`icon-eleven-*.svg` concepts.
