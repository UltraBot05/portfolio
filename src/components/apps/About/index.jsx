import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { portfolioData } from '../../../data/portfolioData';

const INFO = [
  ['OS', 'EndeavourOS (Hyprland)'],
  ['Shell', 'zsh + starship'],
  ['Role', 'Software Engineer, Systems & Open Source'],
  ['Study', 'B.Tech CSE, PES University (2024-Present)'],
  ['Now', 'Open Source Contributor @ OpenWISP'],
  ['Lead', 'Technical Lead, Team Vegavath'],
  ['GitHub', 'UltraBot05'],
];

const SKILLS = [
  ['Languages', 'C, C++, Python, JavaScript, SQL, Bash'],
  ['Systems', 'Linux, systemd, SSH, ZeroTier, TCP/IP, DNS'],
  ['Tools', 'Git, Pytest, Playwright, CI/CD, Vercel'],
  ['Concepts', 'DSA, distributed systems, concurrency, caching'],
];

function Row({ k, v }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, py: 0.4 }}>
      <Typography variant="body2" sx={{ width: 96, flexShrink: 0, color: 'primary.main', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>{k}</Typography>
      <Typography variant="body2" sx={{ color: 'text.primary' }}>{v}</Typography>
    </Box>
  );
}

export default function About() {
  const { personal } = portfolioData;
  return (
    <Box sx={{ p: 3, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
      <Stack spacing={1.5} sx={{ width: 200, flexShrink: 0, mx: 'auto', alignItems: 'center' }}>
        <Avatar src="/assets/profile.jpg" alt={personal.name} sx={{ width: 150, height: 150, border: 3, borderColor: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontFamily: 'var(--font-mono)' }}>{personal.name}</Typography>
        <Chip label={`@${personal.handle}`} color="secondary" size="small" />
        <Typography variant="caption" color="text.secondary" align="center">{personal.location}</Typography>
      </Stack>

      <Box sx={{ flex: 1, minWidth: 280 }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontFamily: 'var(--font-mono)' }}>abhigyan@b3astos</Typography>
        <Divider sx={{ my: 1 }} />
        {INFO.map(([k, v]) => <Row key={k} k={k} v={v} />)}
        <Divider sx={{ my: 1.5 }} />
        {SKILLS.map(([k, v]) => <Row key={k} k={k} v={v} />)}
        <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic', color: 'text.secondary' }}>
          "I break things to understand them, then fix them for good."
        </Typography>
      </Box>
    </Box>
  );
}
