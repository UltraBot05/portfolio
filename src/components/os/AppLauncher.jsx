import { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { useWindowStore } from '../../store/windowStore';
import { DESKTOP_ICONS, ICONS } from '../../data/appRegistry';

// MD3 command palette (Ctrl+K). MUI Dialog + filtered list + keyboard nav.
export default function AppLauncher({ isOpen, onClose }) {
  const open = useWindowStore(s => s.open);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const results = DESKTOP_ICONS.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) { setQuery(''); setSelected(0); requestAnimationFrame(() => inputRef.current?.focus()); }
  }, [isOpen]);

  useEffect(() => {
    if (selected >= results.length) setSelected(Math.max(0, results.length - 1));
  }, [results.length, selected]);

  const launch = (app) => {
    open(app.appId, { title: app.label, defaultSize: app.defaultSize });
    onClose();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[selected]) launch(results[selected]);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { borderRadius: '28px', bgcolor: 'surface.low', position: 'absolute', top: '12vh', m: 0 } } }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <TextField
          inputRef={inputRef}
          fullWidth
          value={query}
          onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
          onKeyDown={onKeyDown}
          placeholder="Open app or run command..."
          variant="outlined"
          size="small"
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment>,
              sx: { borderRadius: '14px', fontFamily: 'var(--font-mono)' },
            },
          }}
        />
      </Box>
      <List sx={{ maxHeight: 380, overflowY: 'auto', pt: 0 }}>
        {results.map((app, i) => {
          const Icon = ICONS[app.appId];
          return (
            <ListItemButton
              key={app.appId}
              selected={i === selected}
              onMouseEnter={() => setSelected(i)}
              onClick={() => launch(app)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}><Icon /></ListItemIcon>
              <ListItemText primary={app.label} secondary={app.description} />
            </ListItemButton>
          );
        })}
        {results.length === 0 && (
          <Box sx={{ px: 2, py: 2, color: 'text.secondary', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
            no app matches "{query}"
          </Box>
        )}
      </List>
    </Dialog>
  );
}
