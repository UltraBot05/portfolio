import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useColorScheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import GitHubIcon from '@mui/icons-material/GitHub';
import LaunchRounded from '@mui/icons-material/LaunchRounded';
import CodeRounded from '@mui/icons-material/CodeRounded';
import { projectFiles } from '../../../data/projectFiles';
import { isSafeUrl } from '../../../utils/validateUrl';
import MarkdownBody from '../../common/MarkdownBody';

// SECURITY: react-markdown escapes raw HTML by default. Never add rehype-raw.
export default function ProjectViewer({ projectId }) {
  const [showRaw, setShowRaw] = useState(false);
  const { mode, systemMode } = useColorScheme();
  const project = projectFiles[projectId];
  if (!project) return <Box sx={{ p: 3, color: 'text.secondary' }}>file not found</Box>;

  const resolved = mode === 'system' ? systemMode : mode;
  const hasGithub = isSafeUrl(project.github);
  const hasDemo = isSafeUrl(project.demo);

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" spacing={0.75} useFlexGap sx={{ mb: 1.5, flexWrap: 'wrap' }}>
        {project.tech.map(t => <Chip key={t} label={t} size="small" color="primary" variant="outlined" />)}
      </Stack>

      <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 2, flexWrap: 'wrap' }}>
        {hasGithub && (
          <Button size="small" variant="outlined" startIcon={<GitHubIcon />} href={project.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </Button>
        )}
        {hasDemo && (
          <Button size="small" variant="contained" color="secondary" startIcon={<LaunchRounded />} href={project.demo} target="_blank" rel="noopener noreferrer">
            Live demo
          </Button>
        )}
        <Button size="small" variant="text" startIcon={<CodeRounded />} onClick={() => setShowRaw(r => !r)}>
          {showRaw ? 'Rendered' : 'View raw'}
        </Button>
      </Stack>

      {showRaw ? (
        <Box component="pre" sx={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'text.secondary', bgcolor: 'surface.high', borderRadius: '12px', p: 2, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {project.content}
        </Box>
      ) : (
        <MarkdownBody>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter style={resolved === 'dark' ? oneDark : oneLight} language={match[1]} PreTag="div" {...props}>
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : <code className={className} {...props}>{children}</code>;
              },
            }}
          >
            {project.content}
          </ReactMarkdown>
        </MarkdownBody>
      )}
    </Box>
  );
}
