import { useState } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import { useWindowStore } from '../../../store/windowStore';
import { projectFiles, projectFileOrder } from '../../../data/projectFiles';
import ProjectViewer from './ProjectViewer';

export default function FileExplorer() {
  const [selected, setSelected] = useState(projectFileOrder[0]);
  const open = useWindowStore(s => s.open);

  const openStandalone = (id) => {
    open(`projectViewer:${id}`, { title: projectFiles[id].filename, appId: 'projectViewer', projectId: id, defaultSize: { width: 820, height: 680 } });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, height: '100%', gap: { xs: 1.5, sm: 2 }, p: { xs: 1.5, sm: 2 }, boxSizing: 'border-box' }}>
      <Box sx={{ width: { xs: '100%', sm: 240 }, maxHeight: { xs: 180, sm: 'none' }, flexShrink: 0, borderRadius: '16px', border: 1, borderColor: 'divider', bgcolor: 'surface.low', overflowY: 'auto' }}>
        <Typography variant="caption" sx={{ display: 'block', px: 2, py: 1.5, color: 'text.secondary', fontFamily: 'var(--font-mono)' }}>
          ~/projects/
        </Typography>
        <List dense sx={{ pt: 0 }}>
          {projectFileOrder.map(id => (
            <ListItemButton
              key={id}
              selected={selected === id}
              onClick={() => setSelected(id)}
              onDoubleClick={() => openStandalone(id)}
            >
              <ListItemIcon sx={{ minWidth: 34 }}><DescriptionRounded fontSize="small" color="primary" /></ListItemIcon>
              <ListItemText primary={projectFiles[id].filename} slotProps={{ primary: { fontFamily: 'var(--font-mono)', fontSize: 13 } }} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', minWidth: 0, borderRadius: '16px', border: 1, borderColor: 'divider', bgcolor: 'surface.low' }}>
        {selected ? <ProjectViewer projectId={selected} /> : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.disabled' }}>
            select a project
          </Box>
        )}
      </Box>
    </Box>
  );
}
