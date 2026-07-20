// App registry - single source of truth for app ids, Iconify Material Symbols
// icon IDs, MD3 accent tone roles, window defaults, and desktop order.
//
// Icons use @iconify/react with the material-symbols set (Google's current
// icon library, shipped on Pixel 9). Zero runtime network calls — iconify
// bundles each referenced icon as an inline SVG at build time.
import { alpha } from '@mui/material/styles';

// Iconify Material Symbols icon IDs (latest Google Pixel 9 / Android 15 set)
export const ICONS = {
  fileExplorer: 'material-symbols:folder-rounded',
  terminal:     'material-symbols:terminal-rounded',
  about:        'material-symbols:person-rounded',
  resume:       'material-symbols:description-rounded',
  contact:      'material-symbols:mail-rounded',
  portfolio:    'material-symbols:web-rounded',
  aiAssistant:  'material-symbols:smart-toy-rounded',
  blogs:        'material-symbols:edit-note-rounded',
  b3astEgg:     'material-symbols:sports-esports-rounded',
};

// `tone` maps to an MD3 palette role (primary/secondary/tertiary).
// Used by DesktopIcon + Dock for squircle tonal dim treatment.
export const DESKTOP_ICONS = [
  { appId: 'fileExplorer', label: 'Projects',  tone: 'primary',   description: 'Browse project files',             defaultSize: { width: 900, height: 620 } },
  { appId: 'terminal',     label: 'Terminal',  tone: 'secondary', description: 'The shell — type help',             defaultSize: { width: 820, height: 520 } },
  { appId: 'about',        label: 'About',     tone: 'tertiary',  description: 'whoami',                           defaultSize: { width: 720, height: 560 } },
  { appId: 'resume',       label: 'Resume',    tone: 'primary',   description: 'View and download my resume',      defaultSize: { width: 900, height: 700 } },
  { appId: 'contact',      label: 'Contact',   tone: 'secondary', description: 'Email, GitHub, LinkedIn',          defaultSize: { width: 560, height: 460 } },
  { appId: 'portfolio',    label: 'Portfolio', tone: 'tertiary',  description: 'View as portfolio — recruiter mode', defaultSize: { width: 1100, height: 740 } },
  { appId: 'aiAssistant',  label: 'AI Chat',   tone: 'primary',   description: 'Ask B3ast AI anything',            defaultSize: { width: 620, height: 640 } },
  { appId: 'blogs',        label: 'Blog',      tone: 'secondary', description: 'Personal engineering blog',         defaultSize: { width: 700, height: 520 } },
  { appId: 'b3astEgg',     label: '???',       tone: 'secondary', badge: true, description: 'Unauthorized access',  defaultSize: { width: 640, height: 520 } },
];

export const getApp = (appId) => DESKTOP_ICONS.find(a => a.appId === appId);

// Resolve the raw accent hex for a tone from the theme palette.
// Works with both CSS-vars mode (theme.vars) and static palette.
function accentFromTone(theme, tone) {
  // In MUI v9 CSS-vars mode, theme.palette still has resolved hex values
  // for the *default* scheme, but we use mainChannel for CSS-var-aware alpha.
  const p = theme.palette;
  const map = {
    primary:   p.primary.main,
    secondary: p.secondary.main,
    tertiary:  p.tertiary?.main || p.secondary.main,
  };
  return map[tone] || map.primary;
}

// Solid container/on-container colors (used by legacy callers if any).
export function toneColors(theme, tone) {
  const accent = accentFromTone(theme, tone);
  const p = theme.palette;
  const fgMap = {
    primary:   p.primary.contrastText,
    secondary: p.secondary.contrastText,
    tertiary:  p.tertiary?.contrastText || p.secondary.contrastText,
  };
  return { bg: accent, fg: fgMap[tone] || fgMap.primary };
}

// Squircle tonal-dim colors for Pixel 9-style icon containers.
// MUI v9: use mainChannel for CSS-variable-aware RGBA output.
export function toneColorsDim(theme, tone) {
  const vars = theme.vars?.palette;
  const chKey = tone === 'primary' ? 'primary' : tone === 'tertiary' ? 'tertiary' : 'secondary';

  if (vars?.[chKey]?.mainChannel) {
    const ch = vars[chKey].mainChannel;
    return {
      bg:     `rgba(${ch} / 0.13)`,
      border: `rgba(${ch} / 0.24)`,
      fg:     vars[chKey].main,   // CSS var string — works in MUI sx
    };
  }
  // Fallback (no CSS vars): compute directly
  const accent = accentFromTone(theme, tone);
  return {
    bg:     alpha(accent, 0.13),
    border: alpha(accent, 0.24),
    fg:     accent,
  };
}
