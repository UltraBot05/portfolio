// The real LaTeX resume PDF lives at public/resume.pdf (copied from
// docs/Abhigyan_Resume_July26.pdf). It renders in a sandboxed native iframe.
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DownloadRounded from '@mui/icons-material/DownloadRounded';

const checkFile = async (url) => {
  try { const r = await fetch(url, { method: 'HEAD' }); return r.ok; } catch { return false; }
};

export default function Resume() {
  const [pdfOk, setPdfOk] = useState(true);

  useEffect(() => { checkFile('/resume.pdf').then(setPdfOk); }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1} sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', alignItems: 'center' }}>
        <Button size="small" variant="contained" startIcon={<DownloadRounded />} href="/resume.pdf" download="Abhigyan_Dutta_Resume.pdf" disabled={!pdfOk}>
          Download PDF
        </Button>
        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Abhigyan Dutta, resume
        </Typography>
      </Stack>

      {pdfOk ? (
        <Box component="iframe" src="/resume.pdf#view=FitH" title="Resume PDF" sx={{ flex: 1, border: 'none', bgcolor: '#525659' }} />
      ) : (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', p: 3, textAlign: 'center' }}>
          resume.pdf not found in /public. Drop it there and reopen.
        </Box>
      )}
    </Box>
  );
}
