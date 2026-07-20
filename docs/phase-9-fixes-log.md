# Phase 9 — Bug Fixes + Phase 10 — Recruiter Mode + Blog

**Date:** 2026-07-20
**Session context:** B3astOS v2.0 — Phase 9 (bug audit + fixes) + Phase 10 (new features)

## Audit

Completed full pre-fix audit before touching any code.
Build was clean; validate-security.js all 8 passed.
Findings written to docs/audit-pre-fix.md.

---

## Phase B — Bug Fixes

### B1: Mobile wallpaper blur removed

Root cause: MobileOS imported the shared Wallpaper component which applies
filter: blur(80px) via CSS pseudo-elements. Violates brief §3.4.
Fix: Removed Wallpaper import; replaced with a solid opaque Box
(bgcolor: background.default). No blur anywhere on mobile.

Also fixed: MobileOS was ignoring the `device` prop (function had no params).
Now accepts `{ device = 'android' }` and branches on it for the bottom bar.

### B2: FakePwn stale selector removed

Root cause: document.querySelector('.window .window-title') targeted
CSS classes from the legacy pre-Phase-8 shell. MUI Window has no such
classes. scrambleText() was a silent no-op.
Fix: Removed the useEffect entirely + removed the scrambleText import
and unused titleRef. Challenge logic (all 3 stages, XOR decode, trophy)
completely unaffected.

### B3: DocReader comment synced

Root cause: Header comment said "browser-native sandboxed iframe" but the
iframe element had no sandbox attribute.
Fix: Comment now accurately explains that no sandbox attribute is used
because browsers' built-in PDF renderers require same-origin + script
access to function.

### B4: Vite manualChunks added

Root cause: No manualChunks config ? MUI, emotion, framer-motion, and
react-syntax-highlighter landed in shared auto-chunks of 503-863 kB.
Fix: Added manualChunks to vite.config.js splitting:
  - vendor-mui: @mui/material + @emotion/*
  - vendor-mui-icons: @mui/icons-material
  - vendor-motion: framer-motion
  - vendor-md: react-markdown + remark-gfm + react-syntax-highlighter
Result: ProjectViewer chunk dropped from 842 kB -> 36 kB.

### B5: AI chat fallback — verified clean

Phase 8 fix is intact. aiOrchestrator.js catches 404/network errors
and runs localCommandMapping(). AIAssistant runs handleCommand() on the
resolved command and falls back to a canned message. No regression.

---

## Phase C — Recruiter Landing Mode (Portfolio app)

### C1: portfolioData.js updated
- Experience: replaced OpenWISP/Ignition with PGP Glass intern,
  GSSoC '26 mentor, Team Vegavath tech lead (matches brief).
- skillGroups: replaced languages/systems/tools/concepts with
  SYSTEMS/SECURITY/WEB/TOOLS (matches brief).
- vegavath-site tech: updated to Next.js/TypeScript/R3F/Neon/Cloudflare R2.
- Added type field to each experience entry (internship/mentorship/technical)
  for timeline color-coding.

### C2: Portfolio/index.jsx rebuilt
Completely rewritten as a premium recruiter landing page:
- Lenis smooth scroll scoped to the container element (no global)
- Section reveals via Framer Motion whileInView (fade + translateY)
- Hero: name, handle, role line, one-liner, 4 CTA buttons
- Featured Projects: 3 cards in responsive grid
- All Projects: full grid with 5 filter tabs (All/Systems/Security/Web/Android)
  + animated filter transitions
- Experience Timeline: color-coded dots by type
  (amber=internship, violet=mentorship, cyan=technical)
- Skills: 4 groups as chip rows (no skill bars)
- Contact section with email/GitHub/LinkedIn/resume download
- No parallax, no backdrop-filter

### C3: appRegistry.js updated
- Portfolio description ? "View as portfolio — recruiter mode"
- Portfolio defaultSize ? 1100x740 (near-maximized)
- Blog entry added (EditNoteRounded icon, violet tone, 680x540)

### C4: MobileOS auto-open
On first mobile mount, auto-pushes portfolio to history and opens it.
Uses autoOpened ref to fire exactly once. Back button ? home screen.

---

## Phase D — Project SVGs

Created public/assets/projects/ with 6 dark terminal SVGs:
1. tcp-auction-engine.svg    — cyan accent, BID ACCEPTED output
2. linux-container-runtime.svg — violet accent, dmesg kernel output
3. pes-vcs.svg               — amber accent, git-log style output
4. mehnat.svg                — neon mint (#4ade80), Kotlin Compose snippet
5. vegavath-site.svg         — orange (#ef5d08), Next.js/R3F code snippet
6. ai-orchestrator.svg       — violet accent, API request/response JSON

All SVGs: 600x340 viewBox, dark #0d0d1a background, syntax-highlighted.
Wired into Portfolio project cards via <img> tag (graceful onError fallback).
CSP note: existing img-src 'https:' wildcard already covers all HTTPS images.

---

## Phase E — Dev.to Blog App

### E1: Blog/index.jsx created
Full implementation:
- Fetches https://dev.to/api/articles?username=UltraBot05&per_page=30
- sessionStorage cache keyed 'devto_articles', 30-min TTL
- Sorts newest first
- States: skeleton loading (4 pulse cards), error (WifiOff icon + retry),
  empty ("No articles published yet."), and article grid
- Article cards: cover image (16:9, crossOrigin=anonymous), title,
  description (2-line clamp), tag chips, meta row (time/reactions/comments),
  Read on dev.to button (noopener noreferrer)
- Refresh icon in header re-fetches (cache-busting)

### E2: AppContent.jsx — Blog lazy import + APPS map entry
### E3: Dock — Blog appears automatically (DESKTOP_ICONS loop)
### Dock: tooltip now shows app.description for recruiter-friendly labels

---

## Build results (final)

- npm run build: PASS
- node validate-security.js: all 8 checks pass
- Chunk sizes: major improvement from manualChunks split

## Known remaining non-issues

- public/og-image.png: intentionally missing (social card, not code)
- vendor-md chunk: react-syntax-highlighter bundles all grammars by design;
  further splitting would require dynamic grammar imports (future work)
- GEMINI_API_KEY: needed in Vercel env for live AI; degrades gracefully
