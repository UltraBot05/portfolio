import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import { Icon } from '@iconify/react';
import { ICONS, toneColorsDim } from '../../data/appRegistry';

// Pixel 9 / Android 15 desktop icon: squircle (border-radius 28%) with a
// tonal-dim fill — very low-opacity tint + hairline border. The icon glyph
// is colored with the accent (not white on solid), so it reads as belonging
// TO the container rather than painted ON it.
export default function DesktopIcon({ appId, label, tone, badge, onOpen }) {
  const theme = useTheme();
  const iconId = ICONS[appId];
  const { bg, border, fg } = toneColorsDim(theme, tone);

  const tile = (
    <Box
      sx={{
        width: 60, height: 60,
        borderRadius: '28%',   // squircle — between circle and square
        bgcolor: bg,
        border: `0.5px solid ${border}`,
        color: fg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 120ms cubic-bezier(0.2,0,0,1), filter 120ms cubic-bezier(0.2,0,0,1)',
        '.md-icon:hover &': { transform: 'translateY(-4px)', filter: 'brightness(1.12)' },
        '.md-icon:active &': { transform: 'scale(0.95)' },
      }}
    >
      <Icon icon={iconId} width={28} height={28} />
    </Box>
  );

  return (
    <ButtonBase
      className="md-icon"
      onClick={() => onOpen(appId)}
      focusRipple
      aria-label={`Open ${label}`}
      sx={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        gap: 0.75, width: 84, borderRadius: '16px', p: 0.5,
      }}
    >
      {badge
        ? <Badge color="warning" variant="dot" overlap="circular">{tile}</Badge>
        : tile}
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 400,
          fontSize: '11px',
          textShadow: '0 1px 3px rgba(0,0,0,0.4)',
          maxWidth: 84,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          lineHeight: 1.2,
        }}
      >
        {label}
      </Typography>
    </ButtonBase>
  );
}
