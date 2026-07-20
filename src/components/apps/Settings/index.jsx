import { useState } from 'react';
import { useColorScheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import ButtonBase from '@mui/material/ButtonBase';
import PaletteRounded from '@mui/icons-material/PaletteRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import SettingsBrightnessRounded from '@mui/icons-material/SettingsBrightnessRounded';
import WallpaperRounded from '@mui/icons-material/WallpaperRounded';
import CodeRounded from '@mui/icons-material/CodeRounded';
import InfoRounded from '@mui/icons-material/InfoRounded';
import BugReportRounded from '@mui/icons-material/BugReportRounded';
import FlagRounded from '@mui/icons-material/FlagRounded';
import WifiRounded from '@mui/icons-material/WifiRounded';

import { useWallpaperStore } from '../../../store/wallpaperStore';
import WifiMenu from '../../os/WifiMenu';

// Generic settings section title
function SectionTitle({ title }) {
  return (
    <Typography
      variant="overline"
      sx={{
        px: 3, py: 1, display: 'block',
        color: 'primary.main', fontWeight: 700,
        letterSpacing: '0.1em'
      }}
    >
      {title}
    </Typography>
  );
}

// Clickable setting item
function SettingItem({ icon, title, subtitle, onClick, control }) {
  return (
    <ListItem
      component={onClick ? ButtonBase : 'li'}
      onClick={onClick}
      sx={{
        px: 3, py: 2,
        width: '100%', textAlign: 'left',
        justifyContent: 'flex-start',
      }}
    >
      <ListItemIcon sx={{ minWidth: 48, color: 'text.secondary' }}>
        {icon}
      </ListItemIcon>
      <ListItemText
        primary={title}
        secondary={subtitle}
        primaryTypographyProps={{ sx: { fontWeight: 500, fontSize: '1rem', color: 'text.primary' } }}
        secondaryTypographyProps={{ sx: { mt: 0.25, fontSize: '0.875rem' } }}
      />
      {control && <Box sx={{ ml: 2 }}>{control}</Box>}
    </ListItem>
  );
}

export default function SettingsApp() {
  const { mode, systemMode, setMode } = useColorScheme();
  const openPicker = useWallpaperStore(state => state.openPicker);
  const [wifiAnchor, setWifiAnchor] = useState(null);

  const resolved = mode === 'system' ? systemMode : mode;

  // Retrieve CTF flags found from sessionStorage
  const getFlag = (key) => typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key) === 'true';
  const ctf = {
    konami: getFlag('ctf_konami_found'),
    shadow: getFlag('ctf_shadow_found'),
    b64: getFlag('ctf_b64_found'),
    xxd: getFlag('ctf_xxd_found'),
    rootkit: getFlag('rootkit_unlocked'),
  };
  const ctfFound = Object.values(ctf).filter(Boolean).length;
  // NOTE: FakePwn stage 4 (memory map) uses rootkit_unlocked implicitly or we just count total 6.
  // Actually, we added 6 flags. Let's just sum them up generally.

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'background.default', pb: 6 }}>
      {/* Mobile-like header */}
      <Box sx={{ px: 3, pt: 4, pb: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 500 }}>
          Settings
        </Typography>
      </Box>

      <List disablePadding>
        {/* NETWORK */}
        <SectionTitle title="Network & Internet" />
        <SettingItem
          icon={<WifiRounded />}
          title="Internet"
          subtitle="B3astOS-Guest"
          onClick={(e) => setWifiAnchor(e.currentTarget)}
        />
        <WifiMenu
          anchorEl={wifiAnchor}
          open={Boolean(wifiAnchor)}
          onClose={() => setWifiAnchor(null)}
        />

        <Divider sx={{ my: 1, mx: 3 }} />

        {/* APPEARANCE */}
        <SectionTitle title="Display & Style" />
        <SettingItem
          icon={mode === 'dark' ? <DarkModeRounded /> : mode === 'light' ? <LightModeRounded /> : <SettingsBrightnessRounded />}
          title="Theme"
          subtitle={mode === 'system' ? 'System default' : mode === 'dark' ? 'Dark' : 'Light'}
          onClick={() => {
            if (mode === 'system') setMode('dark');
            else if (mode === 'dark') setMode('light');
            else setMode('system');
          }}
        />
        <SettingItem
          icon={<WallpaperRounded />}
          title="Wallpaper"
          subtitle="Tap to change desktop background"
          onClick={openPicker}
        />
        <SettingItem
          icon={<PaletteRounded />}
          title="Colors"
          subtitle="Material You dynamic color (Catppuccin base)"
        />

        <Divider sx={{ my: 1, mx: 3 }} />

        {/* SYSTEM */}
        <SectionTitle title="System" />
        <SettingItem
          icon={<InfoRounded />}
          title="About B3astOS"
          subtitle="v2.0.26 · Web Shell Environment"
        />
        <SettingItem
          icon={<CodeRounded />}
          title="Developer"
          subtitle="Built with React 18, Vite, MUI v9"
        />

        <Divider sx={{ my: 1, mx: 3 }} />

        {/* EASTER EGGS */}
        <SectionTitle title="CTF Progress" />
        <SettingItem
          icon={ctfFound > 0 ? <FlagRounded color="primary" /> : <BugReportRounded />}
          title="Hidden Flags"
          subtitle={ctfFound > 0 ? `${ctfFound} / 6 flags discovered` : 'None discovered yet. Try the terminal?'}
        />
      </List>
    </Box>
  );
}
