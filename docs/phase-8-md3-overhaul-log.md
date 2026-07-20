# Phase 8 - MD3 Overhaul + Content Truth + Fixes

**Date:** 2026-07-19

## Design: full Material Design 3 via MUI, both light + dark
- Installed @mui/material, @emotion/react, @emotion/styled, @mui/icons-material (approved).
- `src/theme/md3Theme.js`: MD3 tonal roles for light AND dark color schemes (MUI CSS-variable theming), MD3 type scale + shape. Theme toggle in the status bar and right-click menu; persists via MUI's color-scheme storage.
- Dropped the cyberpunk shell (custom cursor, particle Web Worker, magnetic dock, glass tokens) - replaced with a clean Material desktop: gradient Wallpaper, MUI AppBar status bar, tonal DesktopIcon tiles, Paper windows with elevation + Material title bars, elevated Dock, MUI Dialog command palette.
- Fonts switched to Roboto Flex / Roboto Mono (Fira Code kept for the terminal).
- `InitColorSchemeScript` intentionally omitted to keep CSP `script-src 'self'` strict (minor: possible one-frame theme flash on reload).

## Content = real resume (source of truth)
- Rewrote portfolioData + projectFiles from docs/Abhigyan_Resume_July26.pdf: OpenWISP contribution, Vegavath (Tech Lead + the vegavath.live site), Ignition Hackathon, and the resume projects (Network/Media Controller, PESU Content Automation, SemWork).
- Per user correction, RE-ADDED the 4 smaller real projects the brief listed (TCP Auction Engine, Linux Container Runtime, PES-VCS, Mehnat) - they are real, just not on the 1-page resume. 8 projects total.
- Removed the "AI Orchestrator" project (the terminal IS that old site).
- No CTF competitor claims in factual copy; B3ast stays as the handle and the CTF flavor lives only in hidden easter-egg commands.
- Real resume PDF copied to public/resume.pdf; Resume app embeds it (native iframe) + Download + Open-in-DocReader; DocReader also renders dropped PDFs and DOCX (mammoth -> DOMPurify-sanitized HTML).

## UX fixes
- Desktop icons open on SINGLE click (was double).
- Right-click shows an OS context menu (Open Terminal / App launcher / About / theme) and blocks the browser's native menu.
- Em dashes removed repo-wide.
- Mobile rebuilt as one clean MD3 shell (both modes) with full-screen app sheets - fixes the broken split iOS/Android layout.

## AI chat fix (was fully broken - "I couldn't respond")
- Root cause: no serverless function in dev (404) and, when the key is missing, the backend returns only a `command` with no `response`, which the old UI ignored.
- `aiOrchestrator.js` now normalizes the response and falls back to local keyword->command mapping when the API is unreachable.
- AIAssistant runs the resolved command through handleCommand and renders its (plain-ified) output, so the chat answers in dev and prod. Verified answering in dev with no backend.

## Security (all 4 gated items done, approved)
1. `vercel.json`: full security-header set + strict CSP (script-src 'self'; style-src allows inline for MUI/emotion; connect/img/frame scoped).
2. `api/orchestrator.js`: injection hard-rules in the system prompt; user message moved to a separate `contents` user turn via `systemInstruction` (structural separation); output length cap; no-key path now returns a response too.
3. DocReader DOCX via mammoth + DOMPurify sanitization before render.
4. `validate-security.js` rewritten (no `glob` dep) - 8 checks, all passing. Terminal Output.jsx now sanitizes with DOMPurify.

## Verified
- `npm run build` clean; `node validate-security.js` all pass.
- Headless Chrome: desktop dark + light (theme toggle), 3 apps open, mobile shell, AI chat answering - **0 console errors**.

## Still TODO for Abhigyan (not code)
- public/og-image.png (1200x630 card) still needs creating.
- Confirm/adjust the Vegavath project tech stack (kept conservative: React / Full-stack / CI/CD / Vercel).
- GEMINI_API_KEY in Vercel env for live AI (chat already degrades gracefully without it).
