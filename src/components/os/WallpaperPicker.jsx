import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CloseRounded from '@mui/icons-material/CloseRounded';
import { useWallpaperStore } from '../../store/wallpaperStore';
import { WALLPAPERS } from '../../data/wallpapers';

function WallpaperThumb({ wallpaper, active, onClick, onDoubleClick }) {
  const [failed, setFailed] = useState(false);

  return (
    <Box
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      sx={{
        width: '100%', aspectRatio: '140 / 80',
        borderRadius: '6px', cursor: 'pointer',
        overflow: 'hidden', position: 'relative',
        border: active ? 2 : 1,
        borderColor: active ? 'primary.main' : 'divider',
        boxShadow: active ? (t) => `0 0 0 3px ${t.vars?.palette.primary.main || t.palette.primary.main}40` : 'none',
        transition: 'all 150ms',
        bgcolor: 'surface.high',
      }}
    >
      {wallpaper.type === 'canvas' ? (
        <Box sx={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #4d6708, #8b5000)' }} />
      ) : failed ? (
        <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center', textAlign: 'center' }}>
          <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '10px' }}>{wallpaper.name}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '9px' }}>not downloaded yet</Typography>
        </Box>
      ) : (
        <Box
          component="img"
          src={wallpaper.src}
          alt={wallpaper.name}
          onError={() => setFailed(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </Box>
  );
}

export default function WallpaperPicker({ isMobile = false }) {
  const { pickerOpen, closePicker, activeId, setWallpaper } = useWallpaperStore();
  const [category, setCategory] = useState('all');
  const [selected, setSelected] = useState(activeId);

  const handleOpen = () => { setSelected(activeId); };
  const handleApply = () => { setWallpaper(selected); };

  const displayed = category === 'all' ? WALLPAPERS : WALLPAPERS.filter(w => w.category === category || w.type === 'canvas');
  const activeWP = WALLPAPERS.find(w => w.id === selected) || WALLPAPERS[0];

  return (
    <Dialog
      open={pickerOpen}
      onClose={closePicker}
      onTransitionEnter={handleOpen}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: 'surface.main',
          backgroundImage: 'none',
          ...(isMobile ? {} : { backdropFilter: 'blur(12px)', bgcolor: 'rgba(var(--mui-palette-surface-mainChannel) / 0.8)' }),
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2 }}>
        <Typography variant="h6" component="span" fontWeight={700}>Wallpaper</Typography>
        <IconButton size="small" onClick={closePicker}><CloseRounded /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <ToggleButtonGroup
          value={category}
          exclusive
          onChange={(_, v) => { if (v) setCategory(v); }}
          size="small"
          sx={{ alignSelf: 'flex-start' }}
        >
          <ToggleButton value="all" sx={{ px: 2, borderRadius: '8px' }}>All</ToggleButton>
          <ToggleButton value="system" sx={{ px: 2 }}>System</ToggleButton>
          <ToggleButton value="space" sx={{ px: 2 }}>Space</ToggleButton>
          <ToggleButton value="cars" sx={{ px: 2, borderRadius: '8px' }}>Cars</ToggleButton>
        </ToggleButtonGroup>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 1.5 }}>
          {displayed.map(w => (
            <WallpaperThumb
              key={w.id}
              wallpaper={w}
              active={selected === w.id}
              onClick={() => setSelected(w.id)}
              onDoubleClick={() => setWallpaper(w.id)}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          {activeWP.credit ? `Credit: ${activeWP.credit}` : ''}
        </Typography>
        <Button onClick={closePicker} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
        <Button onClick={handleApply} variant="contained" sx={{ fontWeight: 600 }}>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}
