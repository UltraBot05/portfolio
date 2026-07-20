# Phase 1 Log — OS Shell

**Date:** 2026-07-18

## Files created

- `src/workers/wallpaper.worker.js` — particle network + hex grid + glow spots, entirely off main thread (removed unused `animId` var from brief version).
- `src/components/wallpaper/WallpaperCanvas.jsx` — **deviation:** canvas is created imperatively inside the effect instead of JSX, because `transferControlToOffscreen()` can only be called once per canvas and React 18 StrictMode remounts effects on the same DOM node in dev (the brief's version throws on second mount). Also added an OffscreenCanvas feature check that falls back to WallpaperStatic.
- `src/components/wallpaper/WallpaperStatic.jsx` — CSS-only mobile/fallback wallpaper.
- `src/utils/textScramble.js` — §6.1 + an `isConnected` guard so scramble frames stop after unmount.
- `src/components/os/StatusBar.jsx/.css` — scrambled B3AST@OS label (8px Press Start 2P), workspace pills, cosmetic CPU (small random walk every 3s so it feels alive), RAM from `navigator.deviceMemory` with fallback, clock, launcher search button.
- `src/components/os/DesktopIcon.jsx/.css` — accents resolved via per-icon CSS custom properties (`--icon-dim`/`--icon-border`) so one stylesheet handles all 5 registry colors.
- `src/hooks/useDraggable.js` — pointer events (mouse+touch in one API), viewport clamping, y ≥ 28px. Exposes `dragging` state.
- `src/components/os/Window.jsx/.css` — glass shell, traffic lights with hover glyphs, scrambled title, maximize, resize handle (min 280×200), focus-on-open (a11y). **Key decision:** geometry (left/top/width/height) uses an instant transition during drag/resize and the spring only for maximize/restore — animating position through a spring while dragging makes the window elastically chase the cursor.
- `src/hooks/useMagneticButton.js` — GSAP magnetic effect (GSAP used here only, per §14.6).
- `src/components/os/Dock.jsx/.css` — magnetic icons, CSS-delay tooltips (200ms anti-flicker), active dots, open/unminimize/focus logic.
- `src/hooks/useKeyboardShortcuts.js` — Alt+Space launcher toggle.
- `src/components/os/AppLauncher.jsx/.css` — Rofi-style overlay, live filter, ↑↓/Enter/Esc, click-outside closes.
- `src/components/cursor/CustomCursor.jsx/.css` — zero-lag dot + spring ring, variants via `data-cursor` (pointer/text/open) with fallback detection for plain buttons/inputs; native cursor hidden via body class only while mounted.
- `src/components/os/AppContent.jsx` — placeholder router; becomes the `React.lazy()` router in Phase 2.
- `src/components/mobile/MobileOS.jsx` — TEMPORARY stub (identity card) so mobile is never a broken desktop; real mobile OS in Phase 5.
- `src/App.jsx` — rewritten to device-detection routing.

## Verified

- `npm run build` ✓ — worker split into its own chunk (confirms OffscreenCanvas wiring).
- Headless Chrome via CDP (scratchpad script, no new deps): desktop renders (wallpaper, status bar, 8 icons + badge, dock); double-click opens a window with title scramble, traffic lights, resize dots, dock active dot. **0 console errors.**
- Known: main JS chunk is 577 kB — expected until Phase 2 adds lazy loading; framer-motion/gsap/lucide are in the main bundle.

## Post-checkpoint fixes (user-requested, 2026-07-18)

1. **Removed duplicate maximize □ button** — cyan traffic light is the only maximize control.
2. **Launcher shortcut Alt+Space → Ctrl+K** — Alt+Space was intercepted by the browser/OS. Verified working via CDP-dispatched real key events.
3. **UI scale-up for 1080p laptops** (tokens untouched, targeted sizes only): desktop icons 44→56px box / 72px width / 11px labels (glyph 20→26 to match); titlebar 28→36px, title 12px, lights 12px; status bar 28→32px (pixel label 9px, items 11px) — `STATUSBAR_H` updated in Window.jsx + useDraggable.js, icon grid top 36→44; dock icons 30→42px (glyph 21), padding 8px 16px; launcher 600px wide with larger rows; all registry defaultSizes ×1.15.

Re-verified: build ✓, desktop + open-window screenshots ✓, Ctrl+K opens launcher ✓, 0 console errors.

## Second scale pass — 125% (user-requested, 2026-07-18)

Everything scaled ×1.25 again via targeted sizes (CSS `zoom` deliberately avoided: it desyncs pointer coordinates from zoomed layout coordinates and breaks the drag/resize math). New key numbers: status bar 40px (label 11px, items 14px), desktop icons 70px box / 90px column / 13px labels, titlebar 44px (title 14px, lights 15px), dock icons 52px, launcher 750px, min window 350×250, `STATUSBAR_H` = 40, registry defaultSizes ×1.25 (heights capped ≤830 for 1080p).

**Added:** desktop icon column now `flex-wrap`s into a second column on short viewports (at this scale 8 icons exceed ~800px of height and the last icon was clipping).

Re-verified: build ✓, screenshots ✓ (icons wrap correctly, nothing clipped), Ctrl+K launcher ✓, 0 console errors.

## Next: Phase 2 — Apps (checkpoint with user first)
