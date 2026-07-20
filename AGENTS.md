# Repository Guide

## Project

This is a Vite + React 18 single-page portfolio presented as **B3astOS**, a Material Design 3 desktop/mobile shell for Abhigyan Dutta. The frontend is deployed as a static Vercel build and the optional AI endpoint is implemented as a Vercel Node serverless function (the same Express app can also run locally).

## Important commands

- `npm run dev` — start the Vite development server on port 5000.
- `npm run build` — create the production bundle in `dist/`.
- `npm run preview` — preview the production bundle.
- `npm run server` — run `api/orchestrator.js` locally; it listens on `PORT` or 3001.
- `npm run validate` — run the security validation gate.
- `npm run predeploy` — runs `npm run validate` before deployment.

Run `npm run build` and `npm run validate` after changes that affect application code, deployment configuration, or security-sensitive rendering. There is no automated test suite in the repository; browser smoke testing is the primary UI verification method.

## Architecture

- `src/main.jsx` mounts MUI `ThemeProvider`, `CssBaseline`, analytics, and `App`.
- `src/App.jsx` detects the device once and selects `Desktop` or the mobile shell. It also clears the per-tab CTF unlock flag at page load.
- `src/components/os/` contains the desktop compositor: wallpaper, status bar, icons, dock, windows, launcher, context menu, and lazy app routing.
- `src/components/mobile/MobileOS.jsx` provides the touch shell and browser-history-backed app sheets.
- `src/store/windowStore.js` is the Zustand window manager. App ids and default window sizes live in `src/data/appRegistry.js`.
- `src/components/apps/` contains lazy-loaded apps. `Terminal` reuses `BootSequence`, `CommandLine`, and `Output`.
- `src/data/portfolioData.js` is the structured content source plus terminal-formatted compatibility strings. `src/data/projectFiles.js` owns the Markdown project files.
- `src/utils/commandHandler.js` handles terminal commands; `src/utils/aiOrchestrator.js` calls `/api/orchestrator` and falls back to local keyword mapping.
- `api/orchestrator.js` owns Express middleware, CORS, rate limiting, Gemini calls, prompt-injection rules, fallback responses, and health/HTTP routes. `api/orchestrator-handler.js` adapts it to Vercel.
- `src/theme/md3Theme.js` owns the light/dark Material 3 Expressive palette; `src/index.css` is limited to resets, scrollbars, terminal variables, and motion/accessibility rules.

## Content and security rules

- Treat `docs/Abhigyan_Resume_July26.pdf`, the Phase logs, and the Phase 8 content model as the historical source of truth. Keep factual portfolio claims consistent with `portfolioData.js`.
- Do not put API keys or secrets in client code. Use server-only environment variables such as `GEMINI_API_KEY`.
- Keep Markdown rendered without `rehype-raw`; do not add raw HTML support without a deliberate security review.
- Any HTML produced from DOCX or terminal/AI output must be sanitized with DOMPurify before `dangerouslySetInnerHTML`.
- External URLs must pass `isSafeUrl()` where they come from project data, and `_blank` links must use `rel="noopener noreferrer"`.
- Preserve the strict CSP in `vercel.json`; deployment configuration is security-sensitive.
- The easter eggs are simulations only. Never introduce real shell execution, `eval`, `Function`, or user-controlled HTML interpolation.
- `.env` files are ignored. Never print or commit their contents.

## Editing guidance

- Preserve existing user changes and the intentionally dirty migration worktree; do not use destructive git commands such as `git reset --hard` or `git checkout --`.
- Prefer the existing MUI components and theme tokens over new CSS systems. Explicit pixel strings are used for MUI radii where numeric `sx` values would multiply the theme radius.
- Keep app implementations lazy-loaded through `src/components/os/AppContent.jsx`.
- When changing window geometry, update the matching status-bar constants in `Window.jsx` and `useDraggable.js` together.
- When changing portfolio content, update both structured fields and terminal compatibility fields as needed.
- When changing the API contract, update the client normalizer and both the Gemini and fallback paths.

## Known follow-ups

- `public/og-image.png` is still intentionally missing; `index.html` references it for social cards.
- Live AI requires `GEMINI_API_KEY` in the deployment environment; the client is designed to degrade to local answers.
- The DocReader comments describe a sandboxed PDF iframe, but the current PDF iframe has no explicit `sandbox` attribute; verify the desired browser-PDF behavior before changing it.
- FakePwn still contains a title-scramble selector for the removed legacy `.window .window-title` DOM; the challenge itself works, but that selector is stale.

