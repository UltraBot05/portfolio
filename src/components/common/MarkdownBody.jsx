import Box from '@mui/material/Box';

// Shared MD3 styling wrapper for react-markdown output.
export default function MarkdownBody({ children }) {
  return (
    <Box
      sx={{
        color: 'text.primary',
        '& h1': { typography: 'h2', color: 'primary.main', mt: 0, mb: 1.5 },
        '& h2': { typography: 'h4', color: 'primary.main', mt: 2.5, mb: 1 },
        '& h3': { typography: 'h5', mt: 2, mb: 0.5 },
        '& p': { typography: 'body1', mb: 1.5 },
        '& a': { color: 'secondary.main' },
        '& ul, & ol': { pl: 3, mb: 1.5 },
        '& li': { typography: 'body1', mb: 0.5 },
        '& code': { fontFamily: 'var(--font-mono)', fontSize: '0.88em', bgcolor: 'action.hover', px: 0.75, py: 0.25, borderRadius: '6px' },
        '& pre': { mb: 1.5, borderRadius: '10px', overflowX: 'auto' },
        '& pre code': { bgcolor: 'transparent', p: 0 },
        '& blockquote': { borderLeft: 3, borderColor: 'primary.main', pl: 1.5, color: 'text.secondary', my: 1.5 },
      }}
    >
      {children}
    </Box>
  );
}
