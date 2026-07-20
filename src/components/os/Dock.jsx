import { useTheme } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import ButtonBase from '@mui/material/ButtonBase';
import { Icon } from '@iconify/react';
import { useWindowStore } from '../../store/windowStore';
import { DESKTOP_ICONS, ICONS, toneColorsDim } from '../../data/appRegistry';

// MD3 dock: squircle icon tiles with tonal-dim treatment. Slightly smaller
// than desktop icons (48px vs 60px). Active-dot indicator under open apps.
function DockItem({ app, isOpen, onClick }) {
  const theme = useTheme();
  const iconId = ICONS[app.appId];
  const { bg, border, fg } = toneColorsDim(theme, app.tone);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px' }}>
      <Tooltip title={app.description ?? app.label} enterDelay={200} placement="top">
        <ButtonBase
          onClick={onClick}
          focusRipple
          aria-label={`Open ${app.label}`}
          sx={{
            width: 48, height: 48,
            borderRadius: '28%',
            bgcolor: bg,
            border: `0.5px solid ${border}`,
            color: fg,
            transition: 'transform 120ms cubic-bezier(0.2,0,0,1), filter 120ms cubic-bezier(0.2,0,0,1)',
            '&:hover': { transform: 'translateY(-4px)', filter: 'brightness(1.12)' },
            '&:active': { transform: 'scale(0.95)' },
          }}
        >
          <Icon icon={iconId} width={24} height={24} />
        </ButtonBase>
      </Tooltip>
      {/* Active dot: 4px pill, accent color, centered */}
      <Box
        sx={{
          width: isOpen ? 4 : 0,
          height: 4,
          borderRadius: '50%',
          bgcolor: 'primary.main',
          transition: 'width 200ms cubic-bezier(0.2,0,0,1)',
        }}
      />
    </Box>
  );
}

export default function Dock() {
  const windows = useWindowStore(s => s.windows);
  const { open, unminimize, focus } = useWindowStore();

  const handleClick = (app) => {
    const win = Object.values(windows).find(w => w.appId === app.appId);
    if (!win) open(app.appId, { title: app.label, defaultSize: app.defaultSize });
    else if (win.minimized) unminimize(win.id);
    else focus(win.id);
  };

  return (
    <Paper
      component="nav"
      elevation={6}
      aria-label="Dock"
      sx={{
        position: 'fixed', bottom: 14, left: '50%', transform: 'translateX(-50%)',
        zIndex: (t) => t.zIndex.drawer, display: 'flex', gap: 1, p: 1,
        borderRadius: '999px', bgcolor: 'surface.high', border: 1, borderColor: 'divider',
        maxWidth: 'calc(100vw - 24px)', overflowX: 'auto',
      }}
    >
      {DESKTOP_ICONS.map(app => (
        <DockItem
          key={app.appId}
          app={app}
          isOpen={Object.values(windows).some(w => w.appId === app.appId)}
          onClick={() => handleClick(app)}
        />
      ))}
    </Paper>
  );
}
