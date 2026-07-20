# Phase 0 Log — Setup

**Date:** 2026-07-18

## Installed (one at a time, each confirmed)

zustand@5.0.14 · framer-motion@12.42.2 · react-markdown@10.1.0 · react-syntax-highlighter@16.1.1 · remark-gfm@4.0.1 · gsap@3.15.0 · lenis@1.3.25 · lucide-react@1.25.0 (approved addition — brief §7.3 requires Lucide but §2 omitted it)

Deferred: `mammoth` (Phase 2, Vite compat test first), `dompurify` (security phase, needs approval).

## npm audit note (user decision pending)

20 vulnerabilities (11 high) — **all pre-existing**, in `undici` (via `@vercel/node`, dev/deploy tooling) and `vite` dev server. None ship in the client bundle. Fix requires `npm audit fix` (bumps vite) and a breaking `@vercel/node@4` upgrade. Not applied per no-unapproved-dependency-changes rule.

## Files created/updated

- `src/store/windowStore.js` — Zustand window manager per brief §4.2. **Deviation:** `open()` also restores a minimized window of the same app instead of spawning a duplicate (brief version only checked non-minimized windows).
- `src/hooks/useDeviceDetection.js` — verbatim from brief §4.3.
- `src/index.css` — full B3astOS token system, resets, glass classes, CRT mode, reduced-motion rule. **Kept legacy Catppuccin tokens** in a marked block so the old terminal CSS keeps working until Phase 2 wraps it; remove then. Added derived `-dim`/`-border` tokens for red/amber/gray so any registry accent styles uniformly.
- `index.html` — full §11 SEO/meta version (done early since it was being touched for fonts anyway). Fixed the commented-out doctype (page was in quirks mode). `og-image.png` still TODO (comment added).
- `src/data/appRegistry.js` — DESKTOP_ICONS per §7.3 + `ICONS` Lucide component map + `description` field (needed by AppLauncher rows §7.6) + `getApp()` helper.

## Verify

- `npm run build` ✓ (96 modules, no errors)
- `npm run dev` boots ✓ — old terminal app untouched, still the live UI.

## Next: Phase 1 — OS shell

wallpaper worker → WallpaperCanvas/Static → StatusBar → DesktopIcon → useDraggable → Window → Dock → AppLauncher → App.jsx routing → Desktop compositor.
