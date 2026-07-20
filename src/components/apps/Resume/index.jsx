// The real LaTeX resume PDF lives at public/resume.pdf.
// We render it via <object> instead of <iframe> - this avoids the
// Cross-Origin-Resource-Policy / frame-ancestors restriction that
// was causing Chrome to show "refused to connect" in production.
// The <object> tag is treated as an embedded resource (like <img>),
// not a framed document, so CSP frame-src / X-Frame-Options don't apply.
import { useEffect, useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DownloadRounded from '@mui/icons-material/DownloadRounded';

const checkFile = async (url) => {
  try { const r = await fetch(url, { method: 'HEAD' }); return r.ok; } catch { return false; }
};

export default function Resume() {
  const [pdfOk, setPdfOk] = useState(null); // null = loading
  const objectRef = useRef(null);

  useEffect(() => { checkFile('/resume.pdf').then(setPdfOk); }, []);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack direction="row" spacing={1} sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider', alignItems: 'center' }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<DownloadRounded />}
          href="/resume.pdf"
          download="Abhigyan_Dutta_Resume.pdf"
          disabled={pdfOk === false}
        >
          Download PDF
        </Button>
        <Box sx={{ flex: 1 }} />
        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>
          Abhigyan Dutta, resume
        </Typography>
      </Stack>

      {pdfOk === null ? (
        // Still checking
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
          Loading…
        </Box>
      ) : pdfOk ? (
        // Use <object> to avoid iframe/frame-ancestors CSP restrictions in prod
        <Box
          ref={objectRef}
          component="object"
          data="/resume.pdf"
          type="application/pdf"
          sx={{ flex: 1, width: '100%', border: 'none', display: 'block' }}
        >
          {/* Fallback for browsers that can't embed PDFs */}
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography color="text.secondary">
              Your browser cannot display the PDF inline.
            </Typography>
            <Button variant="contained" startIcon={<DownloadRounded />} href="/resume.pdf" download="Abhigyan_Dutta_Resume.pdf">
              Download Resume PDF
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', p: 3, textAlign: 'center' }}>
          resume.pdf not found in /public. Drop it there and reopen.
        </Box>
      )}
    </Box>
  );
}
