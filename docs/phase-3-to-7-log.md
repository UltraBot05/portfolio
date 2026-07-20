# Phases 4–7 Log

**Date:** 2026-07-18

## Phase 4 — Easter eggs
- **FakePwn** (`???` icon) — 3-stage hardcoded CTF text adventure (discovery → enum → exploit). `b3ast` unlocks it; `xor 0x42`/`decode 0x42` reveals FLAG{b3ast_0wns_the_kernel}, flashes, sets `sessionStorage.rootkit_unlocked`, shows trophy + Vegavath car. **Security §18.7:** no eval/Function; user input only matched, never templated into output; the flag echoes input via React text nodes only.
- **Hidden terminal commands** (commandHandler): matrix, xxd, rootkit (gated on the sessionStorage flag), b3ast, vegavath, ctf, ping, neofetch, `uname -a`, `sudo *`, `rm -rf /` (fake), `cat /etc/passwd`, whoami→b3ast. Side-effect commands return an `action` the Terminal interprets.
- **MatrixOverlay** — self-contained matrix rain, triggered by `matrix` via a `b3ast:matrix` window event → Desktop renders a timed full-screen overlay.
- **HexDump** — `xxd` opens a window; fake hex dump with B3AST/VEGAVATH hidden in the ASCII column.
- **Konami** (↑↑↓↓←→←→ B A) — cascade-opens all apps, closes all but terminal after 800ms, "konami. respect." toast.

## Phase 5 — Mobile OS
Real device-aware shell replacing the stub. `MobileOS` picks `MobileIOS` (squircle icons, status pill, dock, swipe bar) or `MobileAndroid` (squarer icons, 3-button nav). Shared `HomeScreen` 4-col grid; `MobileAppShell` full-screen slide-up sheet with swipe-down-to-close and CSS-`filter`-blurred wallpaper (NOT backdrop-filter — §3.4). Apps reuse the same lazy AppContent. **Verified:** Android + iOS at 390×844, both detected, 0 console errors.

## Phase 6 — SEO
`index.html` full meta/OG/Twitter (done in Phase 0). Added `public/robots.txt` + `public/sitemap.xml`. `og-image.png` still TODO (comment in index.html; Abhigyan must create the 1200×630 card).

## Phase 7 — a11y / perf
- aria-labels on window traffic-lights, terminal input, launcher, icon buttons; `main`/`nav` landmarks; skip link; focus-first-element on window open; `prefers-reduced-motion` rule.
- Perf: wallpaper fully in Web Worker; backdrop-filter desktop-only; **apps code-split into per-app lazy chunks** (verified in build output); fonts `display=optional`; Lenis scoped to Portfolio only; GSAP only in the magnetic hook.

## Phase 6.5 — Security: PARTIAL (rest GATED, awaiting approval)
Done (no approval needed):
- `validateUrl.js` allowlist applied to ProjectViewer github/demo links.
- Confirmed: all `target="_blank"` have `rel="noopener noreferrer"`; no `eval`/`new Function`; no `VITE_*KEY/SECRET`; no rehype-raw; react-markdown escapes HTML by default; `.env` gitignored.

**GATED — NOT done, needs explicit approval (touches protected files / new deps):**
1. `vercel.json` security headers rewrite (§18.1) — brief constraint #4 says ask before touching vercel.json; it's live-deploy config.
2. `api/orchestrator.js` hardening audit (§18.3–18.4) — constraint #4 says ask before touching the orchestrator.
3. `mammoth` + `dompurify` installs (§18.5, DocReader DOCX) — global rule: ask before installing. DocReader DOCX currently shows a safe download fallback.
4. `validate-security.js` full-checklist rewrite (§18.10) — brief version imports `glob`, which is not a direct dep (install gated).
