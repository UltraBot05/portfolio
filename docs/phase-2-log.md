# Phase 2 Log — Apps

**Date:** 2026-07-18

## Data
- `portfolioData.js` — full §12 rewrite (personal/projects/experience/skillGroups/ctf/system) PLUS terminal-formatted strings (about/skills/contact/help) so the existing commandHandler keeps working. **Deviation:** structured skills live under `skillGroups` (the terminal string keeps the `skills` name); added `terminalProjects` (id/category/description) so the terminal `projects` command format is preserved.
- `commandHandler.js` — repointed `.projects` → `.terminalProjects`; `whoami` now returns `b3ast`.
- `projectFiles.js` — 6 real projects, markdown content. `github: null` where unknown → no link rendered (constraint #8).

## Apps (all lazy-loaded via AppContent)
- **Terminal** — windowed wrapper reusing BootSequence/CommandLine/Output; boot ≤1s and once-per-session (module flag); aria-label + placeholder added; prompt now `b3ast@b3astos`.
- **FileExplorer + ProjectViewer** — two-pane, react-markdown + remark-gfm + Prism (atomDark), tech chips, view-raw toggle, double-click pops project into its own window. **Security:** no rehype-raw; external links gated by `isSafeUrl` + noopener.
- **About** — neofetch layout, real profile.jpg with scanline overlay, scrambled quote.
- **Resume** — HEAD-checks /resume.pdf + /resume.docx; buttons enable when files exist, else "coming soon" disabled; full structured resume from portfolioData.
- **Contact** — email/github/linkedin/resume; emoji icons (brief §8.7 spec — also the lucide brand icons don't exist in v1.25.0); NO Discord/phone.
- **Portfolio** — Lenis smooth scroll scoped to the app container only; whileInView fades; CSS 3D tilt cards; scrambled hero.
- **AIAssistant** — chat UI, suggestion chips, typewriter reveal (orchestrator returns complete JSON, not a stream — brief's documented fallback), session-scoped history.
- **DocReader** — PDF via native sandboxed iframe; DOCX shows download fallback (mammoth+DOMPurify gated, see phase-6.5).

## Cleanup
Deleted dead full-page shell: Terminal.jsx, ControlPanel.*, CloseMessage*, MatrixEffect.* (replaced by windowed Terminal app + MatrixOverlay).

## Note
`lucide-react@1.25.0` lacks brand icons (Github/Linkedin removed upstream) — Contact uses emoji per the brief instead.

## Verified
Build ✓; headless Chrome opened 4 apps (projects/about/resume/portfolio) — **0 console errors**; Portfolio hero scramble, project grid, and null-URL link suppression all correct.
