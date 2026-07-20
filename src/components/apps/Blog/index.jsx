// Blog — reads from /blog/manifest.json (Abhigyan maintains manually).
// Fetches article markdown from /blog/posts/{slug}.md on click.
// Two views: list (cards) and reading (rendered markdown).
// Image uploads are a later milestone; the manifest supports cover images via URL.
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import AccessTimeRounded from '@mui/icons-material/AccessTimeRounded';
import CalendarTodayRounded from '@mui/icons-material/CalendarTodayRounded';
import WifiOffRounded from '@mui/icons-material/WifiOffRounded';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

// --- Markdown renderers -------------------------------------------------------
const mdComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={vscDarkPlus}
        language={match[1]}
        PreTag="div"
        customStyle={{ borderRadius: 10, fontSize: '0.82rem', margin: '0.75em 0' }}
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <Box
        component="code"
        sx={{
          px: 0.75, py: 0.2,
          bgcolor: 'action.hover',
          borderRadius: '5px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.82em',
        }}
        {...props}
      >
        {children}
      </Box>
    );
  },
  img({ src, alt }) {
    return (
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        sx={{
          maxWidth: '100%',
          borderRadius: '10px',
          display: 'block',
          my: 2,
        }}
        onError={(e) => { e.currentTarget.style.display = 'none'; }}
      />
    );
  },
};

// --- Post card ----------------------------------------------------------------
function PostCard({ post, onClick }) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        display: 'block', width: '100%', textAlign: 'left',
        bgcolor: 'action.hover', border: 1, borderColor: 'divider',
        borderRadius: '16px', p: 2, cursor: 'pointer',
        transition: 'background 180ms, border-color 180ms, transform 180ms',
        '&:hover': { bgcolor: 'action.selected', borderColor: 'primary.main', transform: 'translateY(-2px)' },
      }}
    >
      {/* Cover image if provided */}
      {post.cover && (
        <Box
          component="img"
          src={post.cover}
          alt={post.title}
          loading="lazy"
          sx={{
            width: '100%', aspectRatio: '16/9', objectFit: 'cover',
            borderRadius: '10px', display: 'block', mb: 1.5, bgcolor: 'surface.high',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}

      <Typography
        sx={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.4, mb: 0.5, color: 'text.primary' }}
      >
        {post.title}
      </Typography>

      {post.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1, lineHeight: 1.55,
            overflow: 'hidden', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}
        >
          {post.description}
        </Typography>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap', mb: 1.5 }}>
          {post.tags.slice(0, 5).map(tag => (
            <Chip
              key={tag}
              label={`#${tag}`}
              size="small"
              sx={{
                borderRadius: '6px', height: 20, fontSize: '0.7rem',
                bgcolor: 'secondary.main', color: 'secondary.contrastText',
                '& .MuiChip-label': { px: 1 },
              }}
            />
          ))}
        </Stack>
      )}

      {/* Meta */}
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        {post.date && (
          <Stack direction="row" spacing={0.4} sx={{ alignItems: 'center' }}>
            <CalendarTodayRounded sx={{ fontSize: 12, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{formatDate(post.date)}</Typography>
          </Stack>
        )}
        {post.readingTime && (
          <Stack direction="row" spacing={0.4} sx={{ alignItems: 'center' }}>
            <AccessTimeRounded sx={{ fontSize: 12, color: 'text.secondary' }} />
            <Typography variant="caption" color="text.secondary">{post.readingTime} min read</Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

// --- Reading view -------------------------------------------------------------
function ReadingView({ post, onBack }) {
  const [body, setBody] = useState(null);
  const [loadErr, setLoadErr] = useState(false);

  useEffect(() => {
    // Increment local view count so /write manage panel can show metrics
    try {
      const key = `blog_views_${post.slug}`;
      const prev = parseInt(localStorage.getItem(key) || '0', 10);
      localStorage.setItem(key, String(prev + 1));
    } catch { /* ignore */ }

    fetch(`/blog/posts/${post.file}`)
      .then(r => { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(setBody)
      .catch(() => setLoadErr(true));
  }, [post.file, post.slug]);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Reading header */}
      <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: 'divider', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton size="small" onClick={onBack} aria-label="Back to posts">
          <ArrowBackRounded fontSize="small" />
        </IconButton>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1 }}>
          {post.title}
        </Typography>
      </Box>

      {/* Reading content */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2.5, sm: 3.5 }, pb: 6, pt: 3 }}>
        {/* Post title block */}
        <Typography variant="h4" fontWeight={800} sx={{ mb: 1, lineHeight: 1.25 }}>
          {post.title}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
          {post.date && (
            <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'var(--font-mono)' }}>
              {formatDate(post.date)}
            </Typography>
          )}
          {post.readingTime && (
            <Typography variant="caption" color="text.secondary">
              · {post.readingTime} min read
            </Typography>
          )}
          {post.tags?.slice(0, 4).map(t => (
            <Chip key={t} label={`#${t}`} size="small"
              sx={{ borderRadius: '6px', height: 20, fontSize: '0.68rem', bgcolor: 'secondary.main', color: 'secondary.contrastText', '& .MuiChip-label': { px: 0.75 } }} />
          ))}
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {loadErr ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <WifiOffRounded sx={{ fontSize: 40, mb: 1, color: 'text.disabled' }} />
            <Typography variant="body2">Could not load this post.</Typography>
          </Box>
        ) : body === null ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Box
            sx={{
              '& h1,h2,h3,h4,h5,h6': { mt: 3, mb: 1, fontWeight: 700, lineHeight: 1.3 },
              '& p': { mb: 1.5, lineHeight: 1.75, color: 'text.primary' },
              '& ul,ol': { pl: 2.5, mb: 1.5 },
              '& li': { mb: 0.5, lineHeight: 1.7 },
              '& blockquote': {
                borderLeft: '3px solid', borderColor: 'primary.main',
                pl: 2, ml: 0, my: 2, opacity: 0.85, fontStyle: 'italic',
              },
              '& a': { color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } },
              '& hr': { borderColor: 'divider', my: 3 },
              '& table': { borderCollapse: 'collapse', width: '100%', mb: 2, fontSize: '0.85rem' },
              '& th,td': { border: 1, borderColor: 'divider', p: '6px 12px' },
              '& th': { bgcolor: 'action.hover', fontWeight: 700 },
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {body}
            </ReactMarkdown>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// --- Main Blog component ------------------------------------------------------
export default function BlogApp() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [reading, setReading] = useState(null); // post object or null

  useEffect(() => {
    fetch('/blog/manifest.json')
      .then(r => r.json())
      .then(d => { setPosts(d.posts || []); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  if (reading) {
    return <ReadingView post={reading} onBack={() => setReading(null)} />;
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{
        px: 2.5, py: 1.5, borderBottom: 1, borderColor: 'divider', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        bgcolor: 'surface.high',
      }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline' }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: 'var(--font-mono)' }}>
            blog
          </Typography>
          {!loading && !error && (
            <Typography variant="caption" color="text.secondary">
              {posts.length} post{posts.length !== 1 ? 's' : ''}
            </Typography>
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem' }}>
          abhigyan.is-a.dev/blog
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', pt: 6 }}>
            <CircularProgress size={28} />
          </Box>
        )}

        {!loading && error && (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <WifiOffRounded sx={{ fontSize: 40, mb: 1, color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ mb: 2 }}>Could not load blog posts.</Typography>
            <Button size="small" variant="outlined" sx={{ borderRadius: '10px' }}
              onClick={() => { setError(false); setLoading(true); fetch('/blog/manifest.json').then(r => r.json()).then(d => { setPosts(d.posts || []); setLoading(false); }).catch(() => { setError(true); setLoading(false); }); }}>
              Retry
            </Button>
          </Box>
        )}

        {!loading && !error && posts.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 600 }}>
              No posts yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              First one's coming soon. Write at{' '}
              <Box component="span" sx={{ fontFamily: 'var(--font-mono)', color: 'primary.main' }}>/write</Box>.
            </Typography>
          </Box>
        )}

        {!loading && !error && posts.length > 0 && (
          <Stack spacing={1.5}>
            {posts.map(post => (
              <PostCard key={post.slug} post={post} onClick={() => setReading(post)} />
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
