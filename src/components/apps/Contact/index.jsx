// Contact card. Excludes phone/Discord - public surface is email/GitHub/LinkedIn/resume.
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailRounded from '@mui/icons-material/MailRounded';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import { useWindowStore } from '../../../store/windowStore';
import { portfolioData } from '../../../data/portfolioData';

export default function Contact() {
  const open = useWindowStore(s => s.open);
  const { personal } = portfolioData;

  return (
    <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Get in touch</Typography>
      <List>
        <ListItemButton component="a" href={`mailto:${personal.email}`}>
          <ListItemIcon><MailRounded color="primary" /></ListItemIcon>
          <ListItemText primary="Email" secondary={personal.email} />
        </ListItemButton>
        <ListItemButton component="a" href={personal.github} target="_blank" rel="noopener noreferrer">
          <ListItemIcon><GitHubIcon color="primary" /></ListItemIcon>
          <ListItemText primary="GitHub" secondary="github.com/UltraBot05" />
        </ListItemButton>
        <ListItemButton component="a" href={personal.linkedin} target="_blank" rel="noopener noreferrer">
          <ListItemIcon><LinkedInIcon color="primary" /></ListItemIcon>
          <ListItemText primary="LinkedIn" secondary="linkedin.com/in/adutta05" />
        </ListItemButton>
        <ListItemButton onClick={() => open('resume', { title: 'Resume', defaultSize: { width: 900, height: 700 } })}>
          <ListItemIcon><DescriptionRounded color="primary" /></ListItemIcon>
          <ListItemText primary="Resume" secondary="Open the resume app" />
        </ListItemButton>
      </List>
      <Typography variant="caption" color="text.secondary" sx={{ mt: 2, fontFamily: 'var(--font-mono)' }}>
        best for internship inquiries, collaboration, or a good bug to chase.
      </Typography>
    </Box>
  );
}
