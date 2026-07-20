import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CloseRounded from '@mui/icons-material/CloseRounded';
import CheckRounded from '@mui/icons-material/CheckRounded';
import { useThemeStore, THEMES } from '../../store/themeStore';
import { useTheme } from '@mui/material/styles';

export default function ThemePicker() {
  const { accent, setAccent, isPickerOpen, closePicker } = useThemeStore();
  const theme = useTheme();

  return (
    <Dialog open={isPickerOpen} onClose={closePicker} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" component="span" fontWeight={700}>Appearance</Typography>
        <IconButton onClick={closePicker} size="small"><CloseRounded /></IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ pb: 4 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>Accent Theme</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 2 }}>
          {THEMES.map(t => (
            <Box
              key={t.id}
              onClick={() => { setAccent(t.id); }}
              sx={{
                p: 2, borderRadius: '16px', border: 2, cursor: 'pointer',
                borderColor: accent === t.id ? 'primary.main' : 'divider',
                bgcolor: accent === t.id ? 'action.selected' : 'surface.low',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                transition: 'all 0.2s ease',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' }
              }}
            >
              <Typography variant="body2" fontWeight={600} color={accent === t.id ? 'primary.main' : 'text.primary'}>
                {t.label}
              </Typography>
              {accent === t.id && <CheckRounded color="primary" fontSize="small" />}
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
