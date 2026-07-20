# B3astOS Repository Context

## Executive summary

This repository is an interactive portfolio for Abhigyan Dutta (`B3ast`), a PES University computer science student focused on systems, Linux, open source, infrastructure, and full-stack tooling. It began as a terminal-only React portfolio with a Gemini-backed natural-language command mapper. The current code is the result of a July 2026 rewrite into B3astOS: a browser-based desktop metaphor with draggable windows, a touch-oriented mobile shell, Material Design 3 light/dark themes, portfolio apps, a terminal, a resume reader, an AI assistant, and programming/CTF-themed easter eggs.

The current build is a static Vite SPA plus an optional serverless Express/Gemini endpoint. The content model is intentionally grounded in the supplied resume, while four additional C/Linux/Android projects from the original brief are retained as real, non-placeholder projects.

## What the documentation says happened

### Phase 0 — setup

The project installed Zustand, Framer Motion, React Markdown, syntax highlighting, remark-gfm, GSAP, Lenis, and Lucide. The first implementation added the window store, device detection, design tokens, SEO metadata, and the app registry. The old terminal UI remained live as a checkpoint. The logs note pre-existing npm audit issues in deployment/dev tooling that were deliberately not auto-fixed.

### Phase 1 — original OS shell

The planned shell included an OffscreenCanvas/Web Worker wallpaper, custom cursor, magnetic dock, draggable windows, launcher, and mobile fallback. Important implementation deviations were made for React StrictMode and pointer accuracy: the OffscreenCanvas was created imperatively, and drag/resize geometry uses instant transitions while maximize/restore uses springs. The shell was scaled twice for laptop readability and icon wrapping was added for short viewports.

### Phase 2 — apps and content

The terminal was wrapped as a windowed app and all apps were lazy-loaded. File Explorer, Project Viewer, About, Resume, Contact, Portfolio, AI Assistant, and DocReader were added. Project content moved into `projectFiles.js`; terminal-specific data remained in `portfolioData.js`. Dead full-page terminal components were removed.

### Phases 3–7 — easter eggs, mobile, SEO, accessibility, performance

The project added the FakePwn challenge, Matrix overlay, hex dump, hidden terminal commands, and Konami sequence. Mobile became a real app-sheet shell with browser history integration. SEO files and metadata were added. Accessibility landmarks, labels, reduced-motion handling, worker-based wallpaper, scoped Lenis, and lazy app chunks were verified in the phase logs.

### Phase 6.5 and Phase 8 — security and MD3 overhaul

The initially gated security work was approved and completed in Phase 8: CSP/security headers were added to `vercel.json`, the Gemini prompt was structurally separated from the user turn, output was capped, DOCX handling was added with Mammoth + DOMPurify, and `validate-security.js` became a dependency-free eight-check gate.

Phase 8 then replaced the cyberpunk visual shell with the current Material 3 Expressive implementation. The old cyan/lavender palette, worker wallpaper, custom cursor, and magnetic dock were removed from the live architecture. The theme now uses warm lime/olive/amber tonal roles, MUI CSS-variable color schemes, Roboto Flex/Mono, gradient wallpaper, MUI app bars/windows/dialogs, and a unified mobile shell. The content was rewritten from `docs/Abhigyan_Resume_July26.pdf`, then the four smaller projects from the brief were re-added.

## Runtime architecture

```text
index.html
  -> src/main.jsx
       -> MUI ThemeProvider + CssBaseline + Analytics
       -> src/App.jsx
            -> desktop: Desktop compositor
            -> mobile/tablet: MobileOS app-sheet shell

Desktop
  -> Wallpaper + StatusBar + desktop icons + Dock
  -> Zustand windowStore
  -> Window shell
       -> Suspense/AppContent lazy route
            -> Terminal, Projects, About, Resume, Contact, Portfolio,
               AI Chat, DocReader, FakePwn, HexDump

Terminal / AI Chat
  -> commandHandler for direct commands
  -> aiOrchestrator client for natural language
  -> /api/orchestrator
       -> Express/Vercel handler
       -> validation, CORS, rate limiting, fallback mapping
       -> Gemini model cascade when GEMINI_API_KEY exists
```

## Entry points and deployment

- `package.json` declares an ESM package with Vite, React 18, MUI 9, Zustand, Framer Motion, Mammoth, DOMPurify, Axios, Express, CORS, dotenv, and Vercel Analytics.
- `vite.config.js` enables the React plugin and serves Vite on port 5000.
- `vercel.json` builds the static app through `@vercel/static-build`, deploys `api/**/*.js` with `@vercel/node`, rewrites `/api/orchestrator` and `/api/health` to the handler, and applies CSP/security/CORS headers.
- `npm run dev` is frontend-only. There is no Vite proxy configured, so `/api/orchestrator` returns a local 404 unless a separate backend/serverless environment is available. The client intentionally catches that failure and uses local keyword mapping.
- `npm run server` runs the Express app locally on port 3001, but the frontend still uses a relative `/api/orchestrator` URL; local full-stack development therefore needs an external proxy or equivalent setup if live backend calls are desired.
- `public/resume.pdf` mirrors the resume PDF in `docs/`. `robots.txt` and `sitemap.xml` point at `abhigyan-site.vercel.app`.
- `index.html` contains title, description, Open Graph, Twitter, viewport, favicon, font, and theme metadata. `og-image.png` is referenced but not present.

## State and interaction model

### Desktop

`Desktop` owns launcher visibility, the Matrix overlay, toast messages, file drag-over state, and the custom context-menu anchor. Desktop icons open apps on a single click. Right-click is intercepted to show the MUI context menu. `Ctrl+K` toggles the launcher. The Konami sequence opens all registered apps and then leaves only Terminal open after 800 ms.

`windowStore` holds a dictionary of windows and a monotonically increasing z-index counter. Opening an already-open app focuses it; opening a minimized app restores it. New windows get offset positions and registry-provided sizes. Windows support focus, minimize, close, maximize, pointer drag, and pointer resize. Dragging clamps to the viewport and keeps the top above the 44px status bar.

### Mobile

`useDeviceDetection` chooses `ios`, `android`, `mobile`, or `desktop` from the user agent and viewport width. The current `MobileOS` implementation is unified rather than visually splitting iOS and Android. It displays a four-column app grid, hotseat apps, clock, theme toggle, safe-area padding, and full-screen app sheets. Opening an app pushes a browser history state; the back button/gesture and the sheet back action funnel through `popstate`.

### Terminal

The terminal boot sequence runs once per module/session opening. Direct commands are handled synchronously. Unknown input is sent to the AI client. The terminal maintains command history and supports Up/Down navigation and Ctrl+L. `clear` is handled by the input component. Output uses DOMPurify because AI-generated text can reach the terminal renderer.

### Document flow

Desktop file drop accepts `.pdf` and `.docx`, creates a `docReader:<filename>` window, and passes the `File` object through window props. Resume checks `/resume.pdf`, embeds it, downloads it, or opens it in DocReader. PDFs use a browser iframe; DOCX files are converted to HTML with Mammoth and sanitized with DOMPurify before rendering.

## App registry and apps

`src/data/appRegistry.js` is the single source for the eight desktop icons, labels, MUI icon components, tones, descriptions, and default sizes:

1. Projects / File Explorer
2. Terminal
3. About
4. Resume
5. Contact
6. Portfolio
7. AI Chat
8. `???` / FakePwn

`AppContent.jsx` lazy-loads each app and also recognizes suffixed ids for standalone project viewers, document readers, and the hex dump window.

- **File Explorer / Project Viewer:** two-pane project list, Markdown/GFM rendering, Prism code highlighting, raw-view toggle, tech chips, safe GitHub/demo links, and standalone project windows.
- **Terminal:** boot screen, command prompt, command history, direct command output, AI natural-language routing, Matrix/hex-dump/fake deletion side effects.
- **About:** profile photo, neofetch-like identity/system facts, skills, education, and handle.
- **Resume:** native PDF view, download, and DocReader handoff.
- **Contact:** email, GitHub, LinkedIn, and Resume; intentionally no phone or Discord.
- **Portfolio:** scrollable structured overview of projects, experience, skills, and social links, with Framer Motion section fades.
- **AI Assistant:** session-scoped chat history, suggestion chips, request state, orchestrator query, command execution, and sanitized plain-text result rendering.
- **DocReader:** dropped PDF/DOCX viewer and download fallback.
- **FakePwn:** hardcoded three-stage CTF text adventure; `b3ast` begins it, enumeration reveals XOR key `0x42`, and decoding unlocks the session-only `rootkit` terminal output.
- **HexDump:** hardcoded visual hex dump opened by `xxd`.
- **MatrixOverlay:** timed canvas-like rain overlay triggered by the `matrix` terminal action.

## Content model

`portfolioData.js` is marked as the source of truth for structured content and contains:

- personal identity, title, location, email, GitHub, LinkedIn, OS, shell, editor, and tagline;
- eight projects;
- OpenWISP contributor, Team Vegavath technical lead, and Ignition hackathon experience;
- language, systems, tools, and concepts skill groups;
- PES University education and coursework;
- simulated system metadata;
- terminal-formatted `about`, `skills`, `contact`, `help`, and derived `terminalProjects` fields.

The eight projects are the resume-backed Network & Media Controller, PESU Content Automation Suite, SemWork, and Vegavath Club Website, plus TCP Auction Engine, Linux Container Runtime, PES-VCS, and Mehnat retained from the original brief. `projectFiles.js` contains the longer Markdown narratives. Most project GitHub URLs are `null`; only the Vegavath demo is currently populated.

## AI orchestrator behavior

The browser posts `{ input }` to `/api/orchestrator` with Axios and a 10-second timeout. The client normalizes every response to `{ response, command, offline }`. On failure it maps keywords locally and can still execute `about`, `skills`, `projects`, `contact`, or `help`.

The server:

- loads `GEMINI_API_KEY` only from server environment variables;
- rejects non-string/empty input and caps JSON payloads at 10 KB plus sanitized input at 500 characters;
- strips HTML tags, `javascript:` and inline-handler-like text;
- applies a simple in-memory 30 requests/minute/IP limit;
- allows configured localhost and production origins, with permissive non-production behavior;
- uses a system instruction and a separate user content turn to reduce prompt injection risk;
- asks Gemini for compact JSON with a response and an allowed command;
- tries a Gemini model cascade and falls back to keyword mapping if the key, request, model, or JSON response fails;
- caps conversational output at 2,000 characters;
- exposes `/api/health`, a root informational route, and a GET-method error for the orchestrator route.

The current fallback means the portfolio remains usable without a backend or API key, but it is not a full conversational model and its keyword coverage differs slightly between server and client mappings.

## Security posture

The repository’s `node validate-security.js` gate checks and currently passes:

1. no API-key patterns in client source;
2. DOMPurify protection for `dangerouslySetInnerHTML`;
3. no active `rehype-raw`;
4. `noopener` on `_blank` links;
5. CSP in `vercel.json`;
6. `.env` in `.gitignore`;
7. no `eval()`/`new Function()` in source;
8. server files do not use client-exposed env prefixes.

The Vercel CSP keeps `script-src 'self'`, permits inline styles for MUI/Emotion, allows Google font resources, limits API connections to the same origin and Gemini, permits same-origin/blob frames, and enables worker/blob sources. Additional headers include frame denial, nosniff, strict referrer policy, permissions policy, HSTS, COOP, and CORP.

External project links are allowlisted by protocol/domain in `validateUrl.js`. React Markdown does not enable raw HTML. DOCX output and terminal output are sanitized. The FakePwn challenge has no shell access, dynamic code execution, or real file operations; `rm -rf /` is only a printed joke.

## Verification performed during this analysis

- `npm run build` passed with Vite 7.3.1 and 2,233 modules transformed.
- `node validate-security.js` passed all eight checks.
- The build emits lazy app chunks, but Vite warns that several minified chunks exceed 500 kB; the largest observed chunks were approximately 864 kB for ProjectViewer and 842 kB for another app/vendor split.
- Git history shows the current checked-out commit is `5e90188 (Update portfolio data)` with earlier API/Vercel/analytics fixes. The worktree contains the large uncommitted migration and generated/documentation additions described by the Phase logs; this appears intentional and must not be reset.

## Known issues and follow-ups

### Confirmed from code

- **Missing social card:** `public/og-image.png` is not present even though `index.html` references it.
- **Local API mismatch:** Vite has no proxy, while the client calls a relative `/api/orchestrator`; local dev therefore exercises the client fallback unless separately proxied.
- **PDF sandbox discrepancy:** `DocReader` comments and phase notes call the PDF iframe sandboxed, but the actual `<iframe>` has no `sandbox` attribute. The browser’s native PDF renderer is still used, but the explicit implementation/documentation do not match.
- **Stale FakePwn selector:** FakePwn tries to scramble `.window .window-title`, a selector from the removed legacy shell. The current MUI `Window` has no such classes, so that title animation is likely a no-op. The challenge logic remains functional.
- **Large lazy chunks:** code splitting exists, but syntax highlighting/MUI/vendor composition still produces chunks above Vite’s warning threshold.

### Documented but not code-blocking

- `GEMINI_API_KEY` must be configured in Vercel for live Gemini behavior; the fallback is intentional.
- Resume source is present as PDF; no DOCX resume is included.
- Most project repositories are not linked because their URLs are unknown; this is intentional rather than placeholder link generation.
- MUI theme flash on reload is accepted because `InitColorSchemeScript` was omitted to preserve strict `script-src 'self'`.
- The repository has no unit/integration test suite; existing phase logs relied on headless browser checks and zero-console-error smoke tests.

## Safe change checklist

1. Read the relevant Phase log and preserve the current MD3 architecture unless the task explicitly asks for a visual rollback.
2. Keep `portfolioData.js`, `projectFiles.js`, terminal strings, and app displays consistent.
3. Keep new app routes lazy-loaded and use the existing window store.
4. Run `npm run build` and `npm run validate`.
5. For UI changes, smoke-test desktop and mobile paths, app opening/closing, theme switching, terminal fallback, resume/document flows, and any affected easter egg.
6. Treat `vercel.json`, `api/orchestrator.js`, dependency changes, and user-generated/AI-generated rendering as security-sensitive changes requiring extra review.

