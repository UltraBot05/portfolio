import { Suspense, useCallback, useEffect, useState, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import { useWindowStore } from '../../store/windowStore';
import { useWallpaperStore } from '../../store/wallpaperStore';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useKonami } from '../../hooks/useKonami';
import { DESKTOP_ICONS } from '../../data/appRegistry';
import { WALLPAPERS } from '../../data/wallpapers';
import Wallpaper from './Wallpaper';
import WallpaperPicker from './WallpaperPicker';
import ThemePicker from './ThemePicker';
import MatrixOverlay from '../apps/EasterEggs/MatrixOverlay';
import StatusBar from './StatusBar';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import Dock from './Dock';
import AppLauncher from './AppLauncher';
import AppContent from './AppContent';
import ContextMenu from './ContextMenu';

export default function Desktop() {
  const windows = useWindowStore(s => s.windows);
  const open = useWindowStore(s => s.open);
  const desktopRef = useRef(null);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [matrix, setMatrix] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [ctxAnchor, setCtxAnchor] = useState(null);
  const { activeId, setWallpaper } = useWallpaperStore();
  const activeWP = WALLPAPERS.find(w => w.id === activeId) || WALLPAPERS[0];

  const toggleLauncher = useCallback(() => setLauncherOpen(o => !o), []);
  useKeyboardShortcuts({ onToggleLauncher: toggleLauncher });

  const openApp = (appId) => {
    const icon = DESKTOP_ICONS.find(i => i.appId === appId);
    open(appId, { title: icon.label, defaultSize: icon.defaultSize });
  };

  const onKonami = useCallback(() => {
    setToast('Konami. Respect. (try: konami in terminal)');
    sessionStorage.setItem('konami_unlocked', 'true');
    DESKTOP_ICONS.forEach(icon => open(icon.appId, { title: icon.label, defaultSize: icon.defaultSize }));
    setTimeout(() => {
      const { windows: ws, close } = useWindowStore.getState();
      Object.values(ws).forEach(w => { if (w.appId !== 'terminal') close(w.id); });
    }, 800);
  }, [open]);
  useKonami(onKonami);

  useEffect(() => {
    const show = () => setMatrix(true);
    window.addEventListener('b3ast:matrix', show);
    return () => window.removeEventListener('b3ast:matrix', show);
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && /\.(pdf|docx)$/i.test(file.name)) {
      open(`docReader:${file.name}`, { title: file.name, appId: 'docReader', file, defaultSize: { width: 860, height: 660 } });
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    setCtxAnchor({ x: e.clientX, y: e.clientY });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  return (
    <Box
      ref={desktopRef}
      onDragOver={handleDragOver}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onContextMenu={handleContextMenu}
      sx={{ position: 'fixed', inset: 0, overflow: 'hidden', bgcolor: 'background.default' }}
    >
      {activeWP.type === 'canvas' ? (
        <Wallpaper />
      ) : (
        <>
          <Box
            sx={{
              position: 'absolute', inset: 0, zIndex: 0,
              backgroundImage: `url(${activeWP.src})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          />
          <Box
            sx={{
              position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
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

      <StatusBar onLauncherClick={toggleLauncher} />

      <Box component="main" sx={{ position: 'absolute', inset: 0 }}>
        <Box sx={{
          position: 'absolute', top: 56, left: 16, zIndex: 1,
          display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: 1.5,
          height: 'calc(100vh - 56px - 96px)', alignContent: 'flex-start',
        }}>
          {DESKTOP_ICONS.map(icon => (
            <DesktopIcon key={icon.appId} {...icon} onOpen={openApp} />
          ))}
        </Box>

        <AnimatePresence>
          {Object.values(windows).map(win =>
            !win.minimized && (
              <Window key={win.id} windowData={win}>
                <Suspense fallback={<Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>}>
                  <AppContent appId={win.appId} props={win.props} />
                </Suspense>
              </Window>
            )
          )}
        </AnimatePresence>
      </Box>

      <Dock />
      <AppLauncher isOpen={launcherOpen} onClose={() => setLauncherOpen(false)} />
      <ContextMenu anchor={ctxAnchor} onClose={() => setCtxAnchor(null)} onOpenLauncher={toggleLauncher} />
      <WallpaperPicker />
      <ThemePicker />

      {matrix && <MatrixOverlay onDone={() => setMatrix(false)} />}

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast(null)}
        message={toast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{ mt: 5 }}
      />

      {dragOver && (
        <Box sx={{
          position: 'fixed', inset: 0, zIndex: 9400, display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', bgcolor: 'action.hover', border: 2, borderStyle: 'dashed', borderColor: 'primary.main',
          fontFamily: 'var(--font-mono)', color: 'primary.main', fontSize: 18,
        }}>
          Drop a .pdf or .docx to open it
        </Box>
      )}
    </Box>
  );
}
