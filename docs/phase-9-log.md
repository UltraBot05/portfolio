# Phase 9: Icons, Blog System, and Wallpaper System

## Completed Tasks

1. **Phase X: Icon Overhaul**
   - Swapped `@mui/icons-material` for `@iconify/react` to use modern Pixel-style Material Symbols.
   - Refactored `DesktopIcon.jsx`, `Dock.jsx`, and `MobileOS.jsx` to use 28% squircles with tonal-dim backgrounds, matching Android 15/Pixel 9 aesthetics.

2. **Phase Y: Local Blog System**
   - Scrapped the old non-functional dev.to fetcher.
   - Built a local markdown-based blog system relying on `public/blog/manifest.json`.
   - Created `/write` (hidden admin route) editor with real-time markdown preview, reading time estimator, and clipboard helpers for easy article authoring.

3. **Phase Z: Wallpaper Changer**
   - Added `zustand` wallpaper store persisting to `localStorage`.
   - Built `WallpaperPicker` dialog with categories (System, Space, Cars).
   - Added "Change Wallpaper" to desktop context menu and long-press on MobileOS home screen.
   - Implemented radial-gradient vignette over image wallpapers to maintain icon legibility.

4. **Additional Fixes**
   - Replaced direct download of `resume.pdf` in Portfolio with `docReader` (`Resume` app) launch.
   - Removed redundant "Open in DocReader" button from `Resume` app.
   - Cleaned up security validator to pass.

## System State
- Build passes (`npm run build`).
- Security validation passes (`npm run validate`). All DOMPurify and `dangerouslySetInnerHTML` checks pass.
