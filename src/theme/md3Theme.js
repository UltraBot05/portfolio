import { createTheme } from '@mui/material/styles';

const shape = { borderRadius: 12 };

const typography = {
  fontFamily: '"Roboto Flex", "Roboto", "Segoe UI", system-ui, sans-serif',
  fontFamilyMono: '"Roboto Mono", "Fira Code", ui-monospace, monospace',
  h1: { fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-0.02em' },
  h2: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.015em' },
  h3: { fontSize: '1.5rem', fontWeight: 600, letterSpacing: '-0.01em' },
  h4: { fontSize: '1.2rem', fontWeight: 600 },
  h5: { fontSize: '1.05rem', fontWeight: 700 },
  h6: { fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.01em' },
  subtitle1: { fontWeight: 600 },
  body1: { fontSize: '0.95rem', lineHeight: 1.6 },
  body2: { fontSize: '0.85rem', lineHeight: 1.55 },
  button: { textTransform: 'none', fontWeight: 600, letterSpacing: '0.01em' },
  caption: { fontSize: '0.75rem', letterSpacing: '0.02em' },
};

const PALETTES = {
  default: {
    light: {
      primary:   { main: '#4d6708', light: '#7d9c38', dark: '#354d00', contrastText: '#ffffff' },
      secondary: { main: '#5b6146', light: '#8c9271', dark: '#434928', contrastText: '#ffffff' },
      tertiary:  { main: '#8b5000', light: '#c07f2e', dark: '#6a3b00', contrastText: '#ffffff' },
      background: { default: '#fafaee', paper: '#ffffff' },
      text: { primary: '#1b1c15', secondary: '#47483b' },
      surface: {
        lowest: '#ffffff', low: '#f4f4e8', main: '#fafaee', high: '#e9e9dd', highest: '#e3e3d7',
        onVariant: '#47483b', outline: '#787868', outlineVariant: '#c8c8b6',
      },
    },
    dark: {
      primary:   { main: '#c3e956', light: '#d9f987', dark: '#8fb433', contrastText: '#243600' },
      secondary: { main: '#c6cda6', light: '#e2e9c0', dark: '#8f966f', contrastText: '#2e341b' },
      tertiary:  { main: '#ffb868', light: '#ffd6a8', dark: '#c8873a', contrastText: '#4a2800' },
      background: { default: '#12140d', paper: '#1b1e14' },
      text: { primary: '#e4e3d6', secondary: '#c7c8b5' },
      surface: {
        lowest: '#0d0f07', low: '#191c11', main: '#12140d', high: '#282b1e', highest: '#333628',
        onVariant: '#c7c8b5', outline: '#919282', outlineVariant: '#46483a',
      },
    }
  },
  catppuccin: {
    light: {
      primary:   { main: '#7287fd', light: '#9caafc', dark: '#526cf5', contrastText: '#ffffff' }, // lavender
      secondary: { main: '#ea76cb', light: '#ef9cdb', dark: '#e450bc', contrastText: '#ffffff' }, // pink
      tertiary:  { main: '#179299', light: '#1fbcc6', dark: '#106368', contrastText: '#ffffff' }, // teal
      background: { default: '#eff1f5', paper: '#e6e9ef' },
      text: { primary: '#4c4f69', secondary: '#5c5f77' },
      surface: {
        lowest: '#ffffff', low: '#e6e9ef', main: '#eff1f5', high: '#dce0e8', highest: '#ccd0da',
        onVariant: '#5c5f77', outline: '#7c7f93', outlineVariant: '#9ca0b0',
      },
    },
    dark: {
      primary:   { main: '#b4befe', light: '#cdd6f4', dark: '#929df0', contrastText: '#11111b' }, // lavender
      secondary: { main: '#f5c2e7', light: '#f5e0eb', dark: '#e6a4d1', contrastText: '#11111b' }, // pink
      tertiary:  { main: '#94e2d5', light: '#b8ebe1', dark: '#72d2c1', contrastText: '#11111b' }, // teal
      background: { default: '#1e1e2e', paper: '#181825' },
      text: { primary: '#cdd6f4', secondary: '#bac2de' },
      surface: {
        lowest: '#11111b', low: '#181825', main: '#1e1e2e', high: '#313244', highest: '#45475a',
        onVariant: '#bac2de', outline: '#9399b2', outlineVariant: '#585b70',
      },
    }
  },
  ocean: {
    light: {
      primary:   { main: '#006874', light: '#2096a6', dark: '#004a53', contrastText: '#ffffff' },
      secondary: { main: '#4a6267', light: '#738e94', dark: '#31474b', contrastText: '#ffffff' },
      tertiary:  { main: '#525e7d', light: '#7886a8', dark: '#3a445f', contrastText: '#ffffff' },
      background: { default: '#f8fdff', paper: '#ffffff' },
      text: { primary: '#191c1d', secondary: '#3f484a' },
      surface: {
        lowest: '#ffffff', low: '#f0f5f6', main: '#f8fdff', high: '#e2ebec', highest: '#d5e0e2',
        onVariant: '#3f484a', outline: '#6f797a', outlineVariant: '#bfc8ca',
      },
    },
    dark: {
      primary:   { main: '#4fd8eb', light: '#85ecfa', dark: '#00a3b6', contrastText: '#00363d' },
      secondary: { main: '#b1cbcf', light: '#d5edef', dark: '#869ea2', contrastText: '#1c3438' },
      tertiary:  { main: '#bac6ea', light: '#dbe3fb', dark: '#8d9ac0', contrastText: '#24304d' },
      background: { default: '#191c1d', paper: '#111415' },
      text: { primary: '#e1e3e3', secondary: '#bfc8ca' },
      surface: {
        lowest: '#0f1112', low: '#151718', main: '#191c1d', high: '#292d2e', highest: '#333738',
        onVariant: '#bfc8ca', outline: '#899294', outlineVariant: '#3f484a',
      },
    }
  },
  dracula: {
    light: {
      primary:   { main: '#ff79c6', light: '#ff9ce6', dark: '#c75196', contrastText: '#000000' }, // Pink
      secondary: { main: '#bd93f9', light: '#dfc2fb', dark: '#8d63c9', contrastText: '#000000' }, // Purple
      tertiary:  { main: '#8be9fd', light: '#b9f7fc', dark: '#59b7ca', contrastText: '#000000' }, // Cyan
      background: { default: '#f8f8f2', paper: '#ffffff' },
      text: { primary: '#282a36', secondary: '#44475a' },
      surface: {
        lowest: '#ffffff', low: '#f1f1eb', main: '#f8f8f2', high: '#e5e5df', highest: '#d7d7d0',
        onVariant: '#44475a', outline: '#6272a4', outlineVariant: '#9299b8',
      },
    },
    dark: {
      primary:   { main: '#ff79c6', light: '#ff9ce6', dark: '#c75196', contrastText: '#282a36' },
      secondary: { main: '#bd93f9', light: '#dfc2fb', dark: '#8d63c9', contrastText: '#282a36' },
      tertiary:  { main: '#8be9fd', light: '#b9f7fc', dark: '#59b7ca', contrastText: '#282a36' },
      background: { default: '#282a36', paper: '#1e1f29' },
      text: { primary: '#f8f8f2', secondary: '#bd93f9' },
      surface: {
        lowest: '#1e1f29', low: '#22242e', main: '#282a36', high: '#343746', highest: '#44475a',
        onVariant: '#f1fa8c', outline: '#6272a4', outlineVariant: '#44475a',
      },
    }
  }
};

const components = {
  MuiPaper: {
    styleOverrides: { root: { backgroundImage: 'none' } },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: { root: { borderRadius: 999, paddingInline: 20, minHeight: 40 } },
  },
  MuiTooltip: {
    styleOverrides: { tooltip: { fontSize: '0.72rem', borderRadius: 8 } },
  },
  MuiChip: {
    styleOverrides: { root: { borderRadius: 8, fontWeight: 600 } },
  },
  MuiDialog: {
    styleOverrides: { paper: { borderRadius: 28 } },
  },
  MuiMenu: {
    styleOverrides: { paper: { borderRadius: 16 } },
  },
  MuiLinearProgress: {
    styleOverrides: { root: { borderRadius: 999, height: 6 } },
  },
};

export const getTheme = (accent = 'default') => {
  const p = PALETTES[accent] || PALETTES.default;
  return createTheme({
    cssVariables: { colorSchemeSelector: 'class' },
    shape,
    typography,
    colorSchemes: {
      light: {
        palette: {
          mode: 'light',
          ...p.light,
          error:   { main: '#ba1a1a' },
          warning: { main: '#7d5700' },
          success: { main: '#2e6b2e' },
          divider: 'rgba(0,0,0,0.10)',
        }
      },
      dark: {
        palette: {
          mode: 'dark',
          ...p.dark,
          error:   { main: '#ffb4ab' },
          warning: { main: '#f6c04d' },
          success: { main: '#8fd88f' },
          divider: 'rgba(255,255,255,0.12)',
        }
      }
    },
    components,
  });
};

// Export default md3Theme (static) for backwards compatibility where direct import was used
export const md3Theme = getTheme('default');
export default md3Theme;
