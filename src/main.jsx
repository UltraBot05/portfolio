import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import { useThemeStore } from './store/themeStore.js'
import { getTheme } from './theme/md3Theme.js'
import './index.css'

function AppThemeProvider({ children }) {
  const accent = useThemeStore((s) => s.accent);
  const theme = React.useMemo(() => getTheme(accent), [accent]);

  return (
    <ThemeProvider theme={theme} defaultMode="dark" disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

// Note: MUI's InitColorSchemeScript is intentionally omitted - it injects an
// inline <script>, which would force 'unsafe-inline' in the CSP. We keep
// script-src 'self' strict and accept a possible one-frame theme flash on
// reload (the stored mode is applied by ThemeProvider on mount).
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppThemeProvider>
      <CssBaseline />
      <App />
      <Analytics />
    </AppThemeProvider>
  </React.StrictMode>,
)
