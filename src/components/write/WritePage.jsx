// WritePage — hidden admin blog editor accessible only at /write.
// NOT listed anywhere in the app UI, dock, or search.
// Password-gated via VITE_WRITE_SECRET env var.
// Blog management: list posts from manifest.json with local view metrics.
// Image workflow: shows correct /blog/pics/<slug>/ path.
// No eval, no raw HTML injection, no shell exec.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- Reading time estimator ----------------------------------------------------
function calcReadingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
// --- Slug generator ------------------------------------------------------------
function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
function today() {
  return new Date().toISOString().slice(0, 10);
}
// --- localStorage view counts -------------------------------------------------
function getViews(slug) {
  try { return parseInt(localStorage.getItem(`blog_views_${slug}`) || '0', 10); } catch { return 0; }
}

// --- Copy helper ---------------------------------------------------------------
function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

// --- Markdown code renderer ---------------------------------------------------
const mdComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div"
        customStyle={{ borderRadius: 8, fontSize: '0.8rem', margin: '0.5em 0' }} {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code style={{ padding: '2px 6px', background: 'rgba(255,255,255,0.08)', borderRadius: 4, fontFamily: 'monospace', fontSize: '0.85em' }} {...props}>{children}</code>
    );
  },
  img({ src, alt }) {
    return <img src={src} alt={alt} loading="lazy" style={{ maxWidth: '100%', borderRadius: 8, marginBlock: 12 }} />;
  },
};

// --- Styles -------------------------------------------------------------------
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body { font-family: 'Roboto Flex', 'Roboto', system-ui, sans-serif; background: #0d0e0a; color: #e4e3d6; }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }

  /* Layout */
  .wp-root { display: flex; flex-direction: column; height: 100dvh; }
  .wp-topbar {
    display: flex; align-items: center; gap: 12px; padding: 10px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08); background: #13150f; flex-shrink: 0; flex-wrap: wrap;
  }
  .wp-logo { font-family: monospace; font-size: 13px; color: #8fb433; font-weight: 700; white-space: nowrap; }
  .wp-tabs { display: flex; gap: 4px; }
  .wp-tab {
    padding: 5px 14px; border-radius: 8px; border: 1px solid transparent;
    background: transparent; color: rgba(255,255,255,0.45); cursor: pointer;
    font-family: inherit; font-size: 12px; font-weight: 600; transition: all 120ms;
  }
  .wp-tab:hover { background: rgba(255,255,255,0.06); color: #e4e3d6; }
  .wp-tab.active { background: rgba(195,233,86,0.12); border-color: rgba(195,233,86,0.35); color: #c3e956; }

  /* Password gate */
  .wp-gate {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px;
  }
  .wp-gate h2 { font-size: 1.1rem; font-weight: 700; color: #c3e956; }
  .wp-gate p  { font-size: 12px; color: rgba(255,255,255,0.4); text-align: center; max-width: 360px; }
  .wp-gate input {
    padding: 10px 16px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06); color: #e4e3d6; font-size: 14px;
    font-family: monospace; outline: none; width: 280px; text-align: center;
  }
  .wp-gate input:focus { border-color: #c3e956; }
  .wp-gate-err { font-size: 12px; color: #f28b82; }

  /* Meta inputs */
  .wp-meta { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; flex: 1; }
  .wp-meta input {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px; padding: 5px 10px; color: inherit; font-size: 12px; outline: none; font-family: inherit;
  }
  .wp-meta input:focus { border-color: #c3e956; }
  .wp-meta input::placeholder { color: rgba(255,255,255,0.3); }

  /* Panes */
  .wp-panes { display: flex; flex: 1; overflow: hidden; min-height: 0; }
  .wp-pane { flex: 1; display: flex; flex-direction: column; min-width: 0; }
  .wp-pane + .wp-pane { border-left: 1px solid rgba(255,255,255,0.08); }
  .wp-pane-label {
    padding: 6px 14px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;
    color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.06);
    font-weight: 600; background: #111309; flex-shrink: 0;
  }
  .wp-textarea {
    flex: 1; width: 100%; background: transparent; border: none; color: #e4e3d6;
    padding: 20px; resize: none; outline: none;
    font-family: 'Roboto Mono', 'Fira Code', ui-monospace, monospace;
    font-size: 13px; line-height: 1.7; tab-size: 2; overflow-y: auto;
  }
  .wp-preview { flex: 1; overflow-y: auto; padding: 20px; font-size: 14px; line-height: 1.75; }
  .wp-preview h1 { font-size: 1.6em; font-weight: 800; margin-top: 1em; margin-bottom: 0.4em; }
  .wp-preview h2 { font-size: 1.3em; font-weight: 700; margin-top: 1em; margin-bottom: 0.3em; }
  .wp-preview h3 { font-size: 1.1em; font-weight: 700; margin-top: 0.8em; margin-bottom: 0.3em; }
  .wp-preview p  { margin-bottom: 0.9em; }
  .wp-preview ul,.wp-preview ol { padding-left: 1.5em; margin-bottom: 0.9em; }
  .wp-preview li { margin-bottom: 0.3em; }
  .wp-preview a  { color: #c3e956; }
  .wp-preview blockquote { border-left: 3px solid #c3e956; padding-left: 1em; margin: 0.8em 0; opacity: 0.8; font-style: italic; }
  .wp-preview img { max-width: 100%; border-radius: 8px; margin-block: 12px; }
  .wp-preview table { border-collapse: collapse; width: 100%; margin-bottom: 1em; font-size: 0.9em; }
  .wp-preview th,.wp-preview td { border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px; }
  .wp-preview th { background: rgba(255,255,255,0.05); font-weight: 700; }
  .wp-preview hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5em 0; }
  .wp-preview code { padding: 2px 5px; background: rgba(255,255,255,0.08); border-radius: 3px; font-family: monospace; font-size: 0.85em; }

  /* Image path helper */
  .wp-imgpath {
    padding: 8px 14px; background: rgba(195,233,86,0.06); border-top: 1px solid rgba(195,233,86,0.15);
    font-size: 11px; font-family: monospace; color: #c3e956; flex-shrink: 0;
  }

  /* Bottom bar */
  .wp-bottombar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 16px; border-top: 1px solid rgba(255,255,255,0.08);
    background: #13150f; flex-shrink: 0; gap: 8px; flex-wrap: wrap;
  }
  .wp-rt { font-size: 11px; color: rgba(255,255,255,0.4); font-family: monospace; white-space: nowrap; }
  .wp-actions { display: flex; gap: 8px; }
  .wp-btn {
    padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06); color: #e4e3d6; cursor: pointer;
    font-family: inherit; font-size: 12px; font-weight: 600; transition: background 150ms, border-color 150ms;
  }
  .wp-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }
  .wp-btn.primary { background: #c3e956; color: #1c2300; border-color: #c3e956; }
  .wp-btn.primary:hover { background: #d9f987; }
  .wp-btn.danger { border-color: rgba(242,139,130,0.4); color: #f28b82; }
  .wp-btn.danger:hover { background: rgba(242,139,130,0.1); }

  /* Manage panel */
  .wp-manage { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
  .wp-post-card {
    display: flex; align-items: center; gap: 12px; padding: 12px 16px;
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px; transition: border-color 150ms;
  }
  .wp-post-card:hover { border-color: rgba(255,255,255,0.18); }
  .wp-post-info { flex: 1; min-width: 0; }
  .wp-post-title { font-weight: 700; font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .wp-post-meta { font-size: 11px; color: rgba(255,255,255,0.4); margin-top: 2px; font-family: monospace; }
  .wp-badge { 
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;
    background: rgba(195,233,86,0.12); color: #c3e956; white-space: nowrap;
  }
  .wp-empty { text-align: center; padding: 40px 20px; color: rgba(255,255,255,0.3); font-size: 13px; }

  /* Toast */
  .wp-toast {
    position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
    background: #c3e956; color: #1c2300; padding: 6px 16px; border-radius: 20px;
    font-size: 12px; font-weight: 700; pointer-events: none;
    animation: wpFade 1.8s ease forwards; z-index: 9999;
  }
  @keyframes wpFade {
    0%   { opacity: 0; transform: translateX(-50%) translateY(8px); }
    15%  { opacity: 1; transform: translateX(-50%) translateY(0); }
    75%  { opacity: 1; }
    100% { opacity: 0; }
  }
`;

// ================================================================================
// Sub-components
// ================================================================================

function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState('');
  const [err, setErr] = useState(false);
  const secret = import.meta.env.VITE_WRITE_SECRET;

  if (!secret) {
    return (
      <div className="wp-gate">
        <h2>🔒 Writer Not Configured</h2>
        <p>Add <code style={{ color: '#c3e956', fontFamily: 'monospace' }}>VITE_WRITE_SECRET=your-passphrase</code> to your <code>.env</code> and Vercel environment variables, then redeploy.</p>
      </div>
    );
  }

  const attempt = () => {
    if (input === secret) {
      sessionStorage.setItem('write_authed', '1');
      onUnlock();
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 1500);
    }
  };

  return (
    <div className="wp-gate">
      <h2>🔐 b3astos/write</h2>
      <p>Enter the write passphrase to access the blog editor.</p>
      <input
        type="password"
        placeholder="passphrase"
        value={input}
        autoFocus
        onChange={e => { setInput(e.target.value); setErr(false); }}
        onKeyDown={e => { if (e.key === 'Enter') attempt(); }}
        style={{ borderColor: err ? '#f28b82' : undefined }}
      />
      {err && <span className="wp-gate-err">❌ incorrect</span>}
      <button className="wp-btn primary" onClick={attempt}>Unlock</button>
    </div>
  );
}

function ManagePanel({ onEdit }) {
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setErr(false);
    fetch('/blog/manifest.json')
      .then(r => r.json())
      .then(d => { setPosts(d.posts || []); setLoading(false); })
      .catch(() => { setErr(true); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="wp-manage"><div className="wp-empty">Loading…</div></div>;
  if (err) return (
    <div className="wp-manage">
      <div className="wp-empty">Could not load manifest.json. Does /public/blog/manifest.json exist?<br /><br />
        <button className="wp-btn" onClick={load}>Retry</button>
      </div>
    </div>
  );
  if (!posts.length) return (
    <div className="wp-manage">
      <div className="wp-empty">No posts yet. Write your first one in the Editor tab.</div>
    </div>
  );

  return (
    <div className="wp-manage">
      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>
        👁 View counts are local to this browser (localStorage). Not shared across visitors.
      </p>
      {posts.map(p => {
        const views = getViews(p.slug);
        return (
          <div className="wp-post-card" key={p.slug}>
            <div className="wp-post-info">
              <div className="wp-post-title">{p.title}</div>
              <div className="wp-post-meta">/{p.slug} · {p.date} · {p.readingTime}m read</div>
              {p.tags?.length > 0 && (
                <div style={{ marginTop: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                  {p.tags.map(t => `#${t}`).join(' ')}
                </div>
              )}
            </div>
            <span className="wp-badge">👁 {views} view{views !== 1 ? 's' : ''}</span>
            <button className="wp-btn" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => onEdit(p)}>
              Edit
            </button>
          </div>
        );
      })}
    </div>
  );
}

// ================================================================================
// Main WritePage
// ================================================================================
export default function WritePage() {
  const secret = import.meta.env.VITE_WRITE_SECRET;
  const [authed, setAuthed] = useState(
    !secret || sessionStorage.getItem('write_authed') === '1'
  );
  const [tab, setTab] = useState('editor'); // 'editor' | 'manage'

  // Editor state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [date, setDate] = useState(today());
  const [body, setBody] = useState('');
  const [toast, setToast] = useState(null);

  const slug = useMemo(() => toSlug(title || 'untitled'), [title]);
  const readingTime = useMemo(() => calcReadingTime(body), [body]);
  const tagList = useMemo(() => tags.split(',').map(t => t.trim()).filter(Boolean), [tags]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1900);
  }, []);

  const fullMarkdown = useMemo(() => [
    '---',
    `title: ${title || 'Untitled'}`,
    `description: ${description}`,
    `date: ${date}`,
    `tags: [${tagList.join(', ')}]`,
    `readingTime: ${readingTime}`,
    '---',
    '',
    body,
  ].join('\n'), [title, description, date, tagList, readingTime, body]);

  const manifestEntry = useMemo(() => JSON.stringify({
    slug,
    title: title || 'Untitled',
    description,
    date,
    tags: tagList,
    readingTime,
    file: `${slug}.md`,
  }, null, 2), [slug, title, description, date, tagList, readingTime]);

  const copyMarkdown = () => { copyText(fullMarkdown); showToast('Markdown copied!'); };
  const copyManifest = () => { copyText(manifestEntry); showToast('Manifest entry copied!'); };
  const downloadMd = () => {
    const blob = new Blob([fullMarkdown], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${slug}.md`;
    a.click();
  };

  const loadForEdit = (post) => {
    setTab('editor');
    setTitle(post.title || '');
    setDescription(post.description || '');
    setTags((post.tags || []).join(', '));
    setDate(post.date || today());
    fetch(`/blog/posts/${post.file}`)
      .then(r => r.text())
      .then(txt => {
        // Strip frontmatter if present
        const match = txt.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
        setBody(match ? match[1].trimStart() : txt);
      })
      .catch(() => showToast('Could not load post body'));
  };

  return (
    <>
      <style>{css}</style>
      {toast && <div className="wp-toast">{toast}</div>}
      <div className="wp-root">
        {/* Top bar */}
        <div className="wp-topbar">
          <span className="wp-logo">b3astos/write</span>
          <div className="wp-tabs">
            <button className={`wp-tab${tab === 'editor' ? ' active' : ''}`} onClick={() => setTab('editor')}>Editor</button>
            <button className={`wp-tab${tab === 'manage' ? ' active' : ''}`} onClick={() => setTab('manage')}>Manage Posts</button>
          </div>
          {tab === 'editor' && authed && (
            <div className="wp-meta">
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Post title" style={{ minWidth: 180 }} />
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" style={{ minWidth: 200 }} />
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="tags: linux, ctf" style={{ minWidth: 140 }} />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ minWidth: 130 }} />
            </div>
          )}
        </div>

        {/* Body */}
        {!authed ? (
          <PasswordGate onUnlock={() => setAuthed(true)} />
        ) : tab === 'manage' ? (
          <ManagePanel onEdit={loadForEdit} />
        ) : (
          <>
            <div className="wp-panes">
              {/* Markdown editor */}
              <div className="wp-pane">
                <div className="wp-pane-label">Markdown — {body.trim().split(/\s+/).filter(Boolean).length} words</div>
                <textarea
                  className="wp-textarea"
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder={`Start writing in Markdown…\n\n## Your heading\n\nYour paragraph.\n\n\`\`\`js\nconsole.log("code block")\n\`\`\`\n\nFor images stored in this repo:\n  ![alt text](/blog/pics/${slug || 'your-post-slug'}/image.jpg)\n\nPlace images in: public/blog/pics/${slug || 'your-post-slug'}/`}
                  spellCheck
                />
                {slug && (
                  <div className="wp-imgpath">
                    📁 Image folder: <strong>public/blog/pics/{slug}/</strong> → reference as: <strong>![alt](/blog/pics/{slug}/filename.jpg)</strong>
                  </div>
                )}
              </div>

              {/* Live preview */}
              <div className="wp-pane">
                <div className="wp-pane-label">Preview · {readingTime} min read</div>
                <div className="wp-preview">
                  {title && <h1 style={{ marginTop: 0, marginBottom: '0.5em' }}>{title}</h1>}
                  {(description || tagList.length > 0 || date) && (
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '1em', fontFamily: 'monospace' }}>
                      {date}{tagList.length > 0 ? ` · ${tagList.map(t => `#${t}`).join(' ')}` : ''}
                    </p>
                  )}
                  {body ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{body}</ReactMarkdown>
                  ) : (
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>Preview appears here as you type…</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="wp-bottombar">
              <span className="wp-rt">
                {readingTime} min read · slug: <strong style={{ color: '#c3e956' }}>{slug}</strong>
                {' '}· save to: <em>public/blog/posts/{slug}.md</em>
              </span>
              <div className="wp-actions">
                <button className="wp-btn" onClick={copyManifest} title="Copy the JSON entry to paste into manifest.json">Copy manifest entry</button>
                <button className="wp-btn" onClick={copyMarkdown}>Copy Markdown</button>
                <button className="wp-btn primary" onClick={downloadMd}>⬇ Download .md</button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
