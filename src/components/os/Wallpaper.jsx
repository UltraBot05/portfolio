import Box from '@mui/material/Box';

// MD3 wallpaper: soft tonal gradient blobs over the surface. Pure CSS, cheap,
// and theme-aware (reads primary/secondary from the active color scheme).
export default function Wallpaper() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        bgcolor: 'background.default',
        overflow: 'hidden',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: (t) => (t.palette.mode === 'dark' ? 0.35 : 0.5),
        },
        '&::before': {
          width: '55vw', height: '55vw', top: '-10%', left: '-5%',
          background: (t) => `radial-gradient(circle, ${t.vars.palette.primary.main} 0%, transparent 70%)`,
        },
        '&::after': {
          width: '60vw', height: '60vw', bottom: '-15%', right: '-8%',
          background: (t) => `radial-gradient(circle, ${t.vars.palette.secondary.main} 0%, transparent 70%)`,
        },
      }}
    />
  );
}
