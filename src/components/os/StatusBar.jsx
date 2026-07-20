import { useEffect, useState } from 'react';
import { useColorScheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import SearchRounded from '@mui/icons-material/SearchRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import WifiRounded from '@mui/icons-material/WifiRounded';
import WifiMenu from './WifiMenu';

const pad = (n) => String(n).padStart(2, '0');

// MD3 top app bar: brand, live clock, cosmetic CPU/RAM, theme toggle, launcher.
export default function StatusBar({ onLauncherClick }) {
  const { mode, systemMode, setMode } = useColorScheme();
  const [time, setTime] = useState(() => new Date());
  const [cpu, setCpu] = useState(12);
  const [wifiAnchor, setWifiAnchor] = useState(null);

  useEffect(() => {
    const clock = setInterval(() => setTime(new Date()), 1000);
    const drift = setInterval(() => setCpu(c => Math.min(38, Math.max(4, c + Math.round((Math.random() - 0.5) * 6)))), 3000);
    return () => { clearInterval(clock); clearInterval(drift); };
  }, []);

  const resolved = mode === 'system' ? systemMode : mode;
  const ram = navigator.deviceMemory ? `${navigator.deviceMemory}G` : '16G';

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{
          height: 44,
          justifyContent: 'center',
          bgcolor: 'surface.low',
          borderBottom: 1,
          borderColor: 'divider',
          backdropFilter: 'blur(8px)',
          zIndex: (t) => t.zIndex.appBar + 10,
        }}
      >
      <Toolbar variant="dense" sx={{ minHeight: 44, gap: 1.5, px: 2 }}>
        <Typography sx={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, color: 'primary.main', letterSpacing: '0.02em' }}>
          B3astOS
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Typography variant="caption" sx={{ fontFamily: 'var(--font-mono)', color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
          CPU {cpu}%
        </Typography>
        <Typography variant="caption" sx={{ fontFamily: 'var(--font-mono)', color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
          RAM {ram}
        </Typography>
        <Tooltip title="Wi-Fi" sx={{ display: { xs: 'none', sm: 'block' } }}>
          <IconButton size="small" onClick={(e) => setWifiAnchor(e.currentTarget)} aria-label="Wi-Fi networks">
            <WifiRounded sx={{ fontSize: 16, color: 'text.secondary' }} />
          </IconButton>
        </Tooltip>
        <Typography variant="body2" sx={{ fontFamily: 'var(--font-mono)', color: 'text.primary', fontWeight: 500 }}>
          {pad(time.getHours())}:{pad(time.getMinutes())}
        </Typography>

        <Tooltip title={resolved === 'dark' ? 'Switch to light' : 'Switch to dark'}>
          <IconButton size="small" onClick={() => setMode(resolved === 'dark' ? 'light' : 'dark')} aria-label="Toggle light/dark theme">
            {resolved === 'dark' ? <LightModeRounded fontSize="small" /> : <DarkModeRounded fontSize="small" />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Search apps (Ctrl+K)">
          <IconButton size="small" onClick={onLauncherClick} aria-label="Open app launcher">
            <SearchRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Toolbar>
      </AppBar>
      <WifiMenu
        anchorEl={wifiAnchor}
        open={Boolean(wifiAnchor)}
        onClose={() => setWifiAnchor(null)}
      />
    </>
  );
}
