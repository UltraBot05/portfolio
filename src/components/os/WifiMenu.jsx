// WifiMenu.jsx — Dummy wifi panel for the status bar wifi icon.
// No real network access. Just fun SSIDs with animated signal bars.
import { useState, useRef, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import CircularProgress from '@mui/material/CircularProgress';
import Switch from '@mui/material/Switch';
import WifiRounded from '@mui/icons-material/WifiRounded';
import WifiOffRounded from '@mui/icons-material/WifiOffRounded';
import LockRounded from '@mui/icons-material/LockRounded';

const NETWORKS = [
  { ssid: 'i<3yourwifi',             strength: 4, secured: true,  desc: 'Connected' },
  { ssid: 'WhyFry',                  strength: 3, secured: true,  desc: null },
  { ssid: 'FBI Surveillance Van #7', strength: 4, secured: true,  desc: null },
  { ssid: 'TellMyWifiLoveHer',       strength: 2, secured: true,  desc: null },
  { ssid: 'Bill Wi the Science Fi',  strength: 3, secured: false, desc: null },
  { ssid: 'NoMoreMrWiFiGuy',         strength: 2, secured: true,  desc: null },
  { ssid: 'PrettyFlyForAWifi',       strength: 1, secured: true,  desc: null },
  { ssid: 'HideYoKidsHideYoWifi',    strength: 2, secured: false, desc: null },
  { ssid: 'NETGEAR_1337',            strength: 3, secured: true,  desc: null },
  { ssid: 'Loading...',              strength: 1, secured: true,  desc: null },
];

function SignalBars({ strength, color = 'inherit' }) {
  // 1–4 bars
  const bars = [1, 2, 3, 4];
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: 14 }}>
      {bars.map(b => (
        <Box
          key={b}
          sx={{
            width: 3,
            height: `${(b / 4) * 100}%`,
            borderRadius: '1px',
            bgcolor: b <= strength ? color || 'primary.main' : 'action.disabled',
            opacity: b <= strength ? 1 : 0.35,
          }}
        />
      ))}
    </Box>
  );
}

export default function WifiMenu({ anchorEl, open, onClose }) {
  const [wifiOn, setWifiOn] = useState(true);
  const [connecting, setConnecting] = useState(null);
  const [connected, setConnected] = useState('i<3yourwifi');
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleConnect = (ssid) => {
    if (ssid === connected) return;
    setConnecting(ssid);
    timerRef.current = setTimeout(() => {
      setConnected(ssid);
      setConnecting(null);
    }, 1800);
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: {
            mt: 0.5, width: 280, borderRadius: '16px',
            bgcolor: 'surface.low',
            backgroundImage: 'none',
            backdropFilter: 'blur(16px)',
            border: 1, borderColor: 'divider',
            boxShadow: 6,
          }
        }
      }}
    >
      {/* Header */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {wifiOn ? <WifiRounded sx={{ fontSize: 18, color: 'primary.main' }} /> : <WifiOffRounded sx={{ fontSize: 18, color: 'text.disabled' }} />}
          <Typography variant="body2" fontWeight={700}>Wi-Fi</Typography>
        </Box>
        <Switch
          size="small"
          checked={wifiOn}
          onChange={(e) => setWifiOn(e.target.checked)}
          color="primary"
        />
      </Box>

      <Divider />

      {!wifiOn ? (
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <WifiOffRounded sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
          <Typography variant="caption" color="text.disabled">Wi-Fi is turned off</Typography>
        </Box>
      ) : (
        <>
          <Typography variant="caption" color="text.secondary" sx={{ px: 2, pt: 1.5, display: 'block', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: '0.65rem' }}>
            Available Networks
          </Typography>
          <List dense disablePadding sx={{ pb: 1 }}>
            {NETWORKS.map(net => {
              const isConnected = net.ssid === connected;
              const isConnecting = net.ssid === connecting;
              return (
                <ListItem key={net.ssid} disablePadding>
                  <ListItemButton
                    onClick={() => handleConnect(net.ssid)}
                    sx={{ px: 2, py: 0.75, borderRadius: 0, '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <ListItemText
                      primary={net.ssid}
                      secondary={isConnected ? 'Connected' : isConnecting ? 'Connecting…' : null}
                      slotProps={{
                        primary: { variant: 'body2', fontWeight: isConnected ? 600 : 400, color: isConnected ? 'primary.main' : 'text.primary', sx: { fontSize: '0.82rem' } },
                        secondary: { variant: 'caption', color: isConnected ? 'primary.main' : 'text.secondary' },
                      }}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      {isConnecting && <CircularProgress size={12} thickness={5} />}
                      {net.secured && <LockRounded sx={{ fontSize: 11, color: 'text.disabled' }} />}
                      <SignalBars strength={net.strength} color={isConnected ? '#c3e956' : undefined} />
                    </Box>
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </>
      )}
    </Popover>
  );
}
