import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useColorScheme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ButtonBase from '@mui/material/ButtonBase';
import CircularProgress from '@mui/material/CircularProgress';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import HomeRounded from '@mui/icons-material/HomeRounded';
import AppsRounded from '@mui/icons-material/AppsRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import WifiRounded from '@mui/icons-material/WifiRounded';
import { Icon } from '@iconify/react';
import AppContent from '../os/AppContent';
import WallpaperPicker from '../os/WallpaperPicker';
import ThemePicker from '../os/ThemePicker';
import WifiMenu from '../os/WifiMenu';
import { DESKTOP_ICONS, ICONS, getApp, toneColorsDim } from '../../data/appRegistry';
import { useWallpaperStore } from '../../store/wallpaperStore';
import { WALLPAPERS } from '../../data/wallpapers';

const pad = (n) => String(n).padStart(2, '0');
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// M3 Expressive spatial spring (fast) - matches the Pixel sheet feel.
const SHEET_SPRING = { type: 'spring', stiffness: 380, damping: 34 };

// Pixel-launcher-style hotseat: the 4 primary destinations pinned at the
// bottom, inside thumb reach. The rest live in the home grid above.
const HOTSEAT_IDS = ['terminal', 'fileExplorer', 'aiAssistant', 'contact'];
const HOTSEAT = HOTSEAT_IDS.map(getApp);
const GRID = DESKTOP_ICONS.filter(a => !HOTSEAT_IDS.includes(a.appId));

function AppTile({ app, size = 60, onOpen }) {
  const theme = useTheme();
  const iconId = ICONS[app.appId];
  const { bg, border, fg } = toneColorsDim(theme, app.tone);
  const tile = (
    <Box sx={{
      width: size, height: size,
      borderRadius: '28%', // squircle
      bgcolor: bg,
      border: `0.5px solid ${border}`,
      color: fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Icon icon={iconId} width={size * 0.47} height={size * 0.47} />
    </Box>
  );
  return (
    <ButtonBase
      onClick={() => onOpen(app.appId)}
      aria-label={`Open ${app.label}`}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, borderRadius: '16px', p: 0.5, minWidth: 48, minHeight: 48 }}
    >
      {app.badge ? <Badge color="warning" variant="dot" overlap="circular">{tile}</Badge> : tile}
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 400, fontSize: '10px' }}>{app.label}</Typography>
    </ButtonBase>
  );
}

// Phone shell with real mobile navigation:
// - opening an app pushes a history entry, so the OS back gesture (Android
//   back swipe / iOS edge swipe) closes the app instead of leaving the site
// - a draggable home-indicator pill: swipe up (or tap) to go home
// - safe-area insets for notches and home bars (viewport-fit=cover)
export default function MobileOS({ device = 'android' }) {
  const [active, setActive] = useState(null);
  const touchStartY = useRef(null);
  const pressTimer = useRef(null);
  const [now, setNow] = useState(new Date());
  const { mode, systemMode, setMode } = useColorScheme();
  const { activeId, openPicker, setWallpaper } = useWallpaperStore();
  const [wifiAnchor, setWifiAnchor] = useState(null);
  const autoOpened = useRef(false);

  const isApple = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);

  // Auto-open Portfolio on first mobile load so recruiters land straight in it.
  // Only fires once per mount; the back button returns to the home screen.
  useEffect(() => {
    if (!autoOpened.current && !window.history.state?.b3astApp) {
      autoOpened.current = true;
      window.history.pushState({ b3astApp: 'portfolio' }, '');
      setActive('portfolio');
    }
  }, []);


  // Back-gesture integration: the ONLY place an app is closed is popstate.
  // UI close actions call history.back(), which funnels through here too, so
  // the history stack and the UI can never disagree.
  useEffect(() => {
    const onPop = (e) => setActive(e.state?.b3astApp ?? null);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const openApp = useCallback((appId) => {
    window.history.pushState({ b3astApp: appId }, '');
    setActive(appId);
  }, []);

  const goHome = useCallback(() => {
    if (window.history.state?.b3astApp) window.history.back();
    else setActive(null); // fallback (e.g. reload landed mid-stack)
  }, []);

  const activeApp = active ? getApp(active) : null;
  const isIOS = device === 'ios';
  const activeWP = WALLPAPERS.find(w => w.id === activeId) || WALLPAPERS[0];
  const resolved = mode === 'system' ? systemMode : mode;

  const handleTouchStart = () => {
    pressTimer.current = setTimeout(openPicker, 500);
  };
  const handleTouchEnd = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  return (
    <Box sx={{ position: 'relative', width: '100vw', height: '100dvh', overflowX: 'hidden', overflowY: 'hidden', bgcolor: 'background.default' }}>
      {/* Background layer */}
      {activeWP.type === 'canvas' ? (
        <Box aria-hidden sx={{ position: 'fixed', inset: 0, zIndex: 0, bgcolor: 'background.default' }} />
      ) : (
        <>
          <Box
            sx={{
              position: 'fixed', inset: 0, zIndex: 0,
              backgroundImage: `url(${activeWP.src})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          />
          <Box
            sx={{
              position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
              background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          <img
            src={activeWP.src}
            alt=""
            style={{ display: 'none' }}
            onError={() => setWallpaper('default')}
          />
        </>
      )}

      {/* status bar */}
      <Box sx={{ position: 'relative', zIndex: 2, pt: 'env(safe-area-inset-top)', px: 2, height: 'calc(36px + env(safe-area-inset-top))', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{pad(now.getHours())}:{pad(now.getMinutes())}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton size="small" onClick={(e) => setWifiAnchor(e.currentTarget)} aria-label="Wi-Fi">
            <WifiRounded fontSize="small" sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton size="small" onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
            {resolved === 'dark' ? <LightModeRounded fontSize="small" sx={{ fontSize: 18 }} /> : <DarkModeRounded fontSize="small" sx={{ fontSize: 18 }} />}
          </IconButton>
        </Box>
      </Box>
      <WifiMenu
        anchorEl={wifiAnchor}
        open={Boolean(wifiAnchor)}
        onClose={() => setWifiAnchor(null)}
      />

      {/* home (scrollable if it ever outgrows the screen) */}
      <Box 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchEnd}
        sx={{ position: 'relative', zIndex: 1, height: 'calc(100% - 36px - env(safe-area-inset-top))', display: 'flex', flexDirection: 'column', overflowY: 'auto', overscrollBehavior: 'contain', px: 3, pb: 'calc(16px + env(safe-area-inset-bottom))' }}
      >
        {/* Pixel-style expressive clock / at-a-glance */}
        <Box sx={{ textAlign: 'center', mt: 4, mb: 4 }}>
          <Typography sx={{ fontSize: '3.75rem', fontWeight: 700, lineHeight: 1, letterSpacing: '-0.03em', color: 'primary.main', fontVariantNumeric: 'tabular-nums' }}>
            {pad(now.getHours())}:{pad(now.getMinutes())}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', fontWeight: 500 }}>
            {DAYS[now.getDay()]}, {MONTHS[now.getMonth()]} {now.getDate()}
          </Typography>
          <Typography variant="caption" sx={{ display: 'block', mt: 2, fontFamily: 'var(--font-mono)', color: 'text.secondary' }}>
            B3astOS · Abhigyan Dutta
          </Typography>
        </Box>

        {/* app grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, maxWidth: 380, width: '100%', mx: 'auto' }}>
          {GRID.map(app => <AppTile key={app.appId} app={app} onOpen={openApp} />)}
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* hotseat dock */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mx: 'auto', mt: 3, px: 1.5, py: 1, borderRadius: '999px', bgcolor: 'surface.high', border: 1, borderColor: 'divider' }}>
          {HOTSEAT.map(app => <AppTile key={app.appId} app={app} size={52} onOpen={openApp} />)}
        </Box>
      </Box>

      {/* full-screen app sheet — swipe down (>80 px) to dismiss */}
      <AnimatePresence>
        {active && (
          <Box
            key={active}
            component={motion.div}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={SHEET_SPRING}
            onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
            onTouchEnd={(e) => {
              if (touchStartY.current === null) return;
              const delta = e.changedTouches[0].clientY - touchStartY.current;
              touchStartY.current = null;
              if (delta > 80) goHome();
            }}
            sx={{
              position: 'absolute', inset: 0, zIndex: 10,
              bgcolor: 'background.paper',
              display: 'flex', flexDirection: 'column',
              borderRadius: '24px 24px 0 0',
              overflow: 'hidden',
              touchAction: 'pan-y',
            }}
          >
            {/* App top bar */}
            <Box sx={{ pt: 'env(safe-area-inset-top)', flexShrink: 0, borderBottom: 1, borderColor: 'divider', bgcolor: 'surface.high' }}>
              <Box sx={{ height: 56, display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
                <IconButton onClick={goHome} aria-label="Back" sx={{ width: 48, height: 48, minWidth: 44, minHeight: 44 }}>
                  <ArrowBackRounded />
                </IconButton>
                <Typography
                  variant="subtitle1"
                  component="h1"
                  sx={{ fontWeight: 700, fontSize: '1.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {activeApp?.label}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}>
              <Suspense fallback={<Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>}>
                <AppContent appId={active} props={{}} />
              </Suspense>
            </Box>

            {/* Unified iOS-style floating navbar */}
            {isApple ? (
              <Box sx={{
                flexShrink: 0, height: 'calc(24px + env(safe-area-inset-bottom))',
                pb: 'env(safe-area-inset-bottom)',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                bgcolor: 'rgba(var(--mui-palette-surface-mainChannel) / 0.85)',
                backdropFilter: 'blur(12px)',
                borderTop: 1, borderColor: 'divider',
              }}>
                <Box
                  onClick={goHome}
                  sx={{
                    width: 134, height: 5, borderRadius: 3,
                    bgcolor: 'text.primary', opacity: 0.8,
                    cursor: 'pointer'
                  }}
                />
              </Box>
            ) : (
              <Box sx={{
                flexShrink: 0, height: 'calc(48px + env(safe-area-inset-bottom))',
                pb: 'env(safe-area-inset-bottom)',
                display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6,
                bgcolor: 'rgba(var(--mui-palette-surface-mainChannel) / 0.85)',
                backdropFilter: 'blur(12px)',
                borderTop: 1, borderColor: 'divider',
              }}>
                <IconButton onClick={goHome} aria-label="Back" sx={{ minWidth: 44, minHeight: 44 }}><ArrowBackRounded /></IconButton>
                <IconButton onClick={goHome} aria-label="Home" sx={{ minWidth: 44, minHeight: 44 }}><HomeRounded /></IconButton>
              </Box>
            )}
          </Box>
        )}
      </AnimatePresence>
      <WallpaperPicker isMobile />
      <ThemePicker />
    </Box>
  );
}
