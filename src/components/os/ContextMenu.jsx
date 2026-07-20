import { useColorScheme } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TerminalRounded from '@mui/icons-material/TerminalRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import PersonRounded from '@mui/icons-material/PersonRounded';
import WallpaperRounded from '@mui/icons-material/WallpaperRounded';
import ColorLensRounded from '@mui/icons-material/ColorLensRounded';
import { useWindowStore } from '../../store/windowStore';
import { getApp } from '../../data/appRegistry';
import { useWallpaperStore } from '../../store/wallpaperStore';
import { useThemeStore } from '../../store/themeStore';

// OS-style right-click menu. The parent intercepts contextmenu and blocks the
// browser's native menu; this renders the desktop actions instead.
export default function ContextMenu({ anchor, onClose, onOpenLauncher }) {
  const open = useWindowStore(s => s.open);
  const openWallpaper = useWallpaperStore(s => s.openPicker);
  const openTheme = useThemeStore(s => s.openPicker);
  const { mode, systemMode, setMode } = useColorScheme();
  const resolved = mode === 'system' ? systemMode : mode;

  const launch = (appId) => {
    const a = getApp(appId);
    open(appId, { title: a.label, defaultSize: a.defaultSize });
    onClose();
  };

  return (
    <Menu
      open={anchor != null}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={anchor ? { top: anchor.y, left: anchor.x } : undefined}
      slotProps={{ paper: { sx: { borderRadius: '16px', minWidth: 220, bgcolor: 'surface.high' } } }}
    >
      <MenuItem onClick={() => launch('terminal')}>
        <ListItemIcon><TerminalRounded fontSize="small" /></ListItemIcon>
        <ListItemText>Open Terminal</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { onClose(); openWallpaper(); }}>
        <ListItemIcon><WallpaperRounded fontSize="small" /></ListItemIcon>
        <ListItemText>Change Wallpaper</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { onClose(); openTheme(); }}>
        <ListItemIcon><ColorLensRounded fontSize="small" /></ListItemIcon>
        <ListItemText>Change Theme</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => { onClose(); onOpenLauncher(); }}>
        <ListItemIcon><SearchRounded fontSize="small" /></ListItemIcon>
        <ListItemText>App launcher</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => launch('about')}>
        <ListItemIcon><PersonRounded fontSize="small" /></ListItemIcon>
        <ListItemText>About B3astOS</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={() => { setMode(resolved === 'dark' ? 'light' : 'dark'); onClose(); }}>
        <ListItemIcon>{resolved === 'dark' ? <LightModeRounded fontSize="small" /> : <DarkModeRounded fontSize="small" />}</ListItemIcon>
        <ListItemText>{resolved === 'dark' ? 'Light theme' : 'Dark theme'}</ListItemText>
      </MenuItem>
    </Menu>
  );
}
