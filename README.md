# B3astOS — Portfolio

A Material Design 3 desktop/mobile shell built as a portfolio for **Abhigyan Dutta** (B3ast). Runs in the browser as a fake OS with real apps, an AI assistant, a blog, and a CTF easter egg chain.

**Live:** [abhigyan-site.vercel.app](https://abhigyan-site.vercel.app)

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite 7, MUI v9 (Material Design 3) |
| Styling | MUI + CSS vars, Roboto Flex, Fira Code |
| Animation | Framer Motion, GSAP, Lenis |
| AI | Google Gemini API (via Vercel serverless) |
| Deploy | Vercel (static build + Node serverless) |

---

## Local Dev

```bash
npm install
npm run dev        # Vite on :5000
npm run server     # AI orchestrator on :3001 (needs GEMINI_API_KEY)
npm run build      # Production bundle
npm run validate   # Security gate
```

Set `GEMINI_API_KEY` in `.env` for live AI (degrades to local keyword matching without it).

---

## Architecture

```
src/
  components/
    os/          # Desktop compositor (StatusBar, Dock, Windows, Icons, Context Menu)
    mobile/      # Mobile OS shell (MobileOS.jsx)
    apps/        # Lazy-loaded apps (Portfolio, Terminal, About, Resume, Blog, …)
  store/         # Zustand stores (windowStore, wallpaperStore, themeStore, …)
  data/          # Content (portfolioData, appRegistry, wallpapers, projectFiles)
  utils/         # commandHandler, aiOrchestrator
  theme/         # md3Theme.js — multi-accent MUI theme
api/             # Vercel serverless (orchestrator.js, orchestrator-handler.js)
public/          # Static assets (resume.pdf, wallpapers/, blog/, assets/)
```

---

## Easter Eggs / CTF

There are **6 hidden CTF flags** across the OS. They're all simulation-only — no real shell, no eval.

| Flag | Location | Hint |
|------|----------|------|
| `FLAG{b3ast_0wns_the_kernel}` | `???` app | Identify yourself, enumerate, exploit XOR |
| `FLAG{h3x_15_just_b4s3_16}` | Terminal | `xxd` reveals a key, but `xxd --flag` finds more |
| `FLAG{sudo_make_me_a_sandwich}` | Terminal | Some `sudo` commands actually work |
| `FLAG{k0nami_1s_s3cr3t}` | Terminal | There is a code. An old one. |
| `FLAG{bas364_goes_brrrr}` | Terminal | The `about` output's last line isn't noise |
| `FLAG{m3m0ry_1s_jus7_arr4ys}` | `???` app | After stage 1, `ls -la` reveals `/proc` |

Full writeup in `help.md` (gitignored — solve it yourself first 😈).

---

## Security Notes

- All easter eggs are hardcoded string responses. No `eval`, no `Function`, no real shell.
- DOMPurify sanitizes all HTML from DOCX/AI output before `dangerouslySetInnerHTML`.
- External URLs validated with `isSafeUrl()` and use `rel="noopener noreferrer"`.
- API keys are server-only. The CSP in `vercel.json` is strict.
- `help.md` is gitignored (CTF spoiler + private).

---

## Wallpapers

Place images in `public/wallpapers/` — see `public/wallpapers/README.md` for the filename spec.

---

Built by [@UltraBot05](https://github.com/UltraBot05)
