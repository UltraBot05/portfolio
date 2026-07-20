// PDF/DOCX viewer. Opens via desktop drag-and-drop or the Resume app.
// PDF: browser-native iframe. No explicit sandbox attribute — browsers'
// built-in PDF renderers require same-origin + script access to function;
// an explicit sandbox would break the viewer on Chrome/Firefox/Safari.
// DOCX: mammoth converts to HTML, then DOMPurify sanitizes BEFORE render
// (brief §18.5) - dropping a malicious .docx cannot inject script.
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import DescriptionRounded from '@mui/icons-material/DescriptionRounded';
import DownloadRounded from '@mui/icons-material/DownloadRounded';
import mammoth from 'mammoth/mammoth.browser';
import DOMPurify from 'dompurify';

export default function DocReader({ file }) {
  const isPdf = file?.type === 'application/pdf' || file?.name?.toLowerCase().endsWith('.pdf');
  const isDocx = file?.name?.toLowerCase().endsWith('.docx');
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const [docxHtml, setDocxHtml] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => () => { if (objectUrl) URL.revokeObjectURL(objectUrl); }, [objectUrl]);

  useEffect(() => {
    let cancelled = false;
    if (!isDocx || !file) return;
    setLoading(true);
    file.arrayBuffer()
      .then(buf => mammoth.convertToHtml({ arrayBuffer: buf }))
      .then(({ value }) => {
        if (cancelled) return;
        const clean = DOMPurify.sanitize(value, {
          ALLOWED_TAGS: ['p', 'b', 'i', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'br', 'a'],
          ALLOWED_ATTR: ['href', 'target'],
        });
        setDocxHtml(clean);
      })
      .catch(() => setDocxHtml('<p>Could not read this .docx file.</p>'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [isDocx, file]);

  if (!file) {
    return (
      <Box sx={emptySx}>
        <DescriptionRounded sx={{ fontSize: 32, color: 'text.disabled' }} />
        <Typography variant="body2" color="text.secondary">Drop a .pdf or .docx onto the desktop to open it here</Typography>
      </Box>
    );
  }

  if (isPdf) {
    return <Box component="iframe" src={objectUrl} title={file.name} sx={{ width: '100%', height: '100%', border: 'none', bgcolor: '#525659' }} />;
  }

  if (isDocx) {
    if (loading) return <Box sx={emptySx}><CircularProgress size={24} /></Box>;
    return (
      <Box sx={{ p: 3, '& table': { borderCollapse: 'collapse' }, '& td, & th': { border: 1, borderColor: 'divider', p: 1 }, '& a': { color: 'secondary.main' } }}
        dangerouslySetInnerHTML={{ __html: docxHtml || '' }} />
    );
  }

  return (
    <Box sx={emptySx}>
      <DescriptionRounded sx={{ fontSize: 32, color: 'secondary.main' }} />
      <Typography variant="body2">{file.name}</Typography>
      <Button size="small" variant="outlined" startIcon={<DownloadRounded />} href={objectUrl} download={file.name}>Download</Button>
    </Box>
  );
}

const emptySx = { height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5, p: 3, textAlign: 'center' };
