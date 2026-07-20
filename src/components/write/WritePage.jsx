// WritePage — hidden admin blog editor accessible only at /write.
// NOT listed anywhere in the app UI, dock, or search.
// No auth — this is a personal dev tool behind an obscure URL.
// No eval, no raw HTML injection, no shell exec.
// Workflow: write → Copy Markdown → paste to public/blog/posts/{slug}.md
//           → Copy manifest entry → paste into posts[] in public/blog/manifest.json
import { useCallback, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

// --- Reading time estimator --------------------------------------------------
function calcReadingTime(text) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// --- Slug generator ----------------------------------------------------------
function toSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// --- Today's date YYYY-MM-DD -------------------------------------------------
function today() {
  return new Date().toISOString().slice(0, 10);
}

// --- Markdown code renderer (same as Blog) -----------------------------------
const mdComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div"
        customStyle={{ borderRadius: 8, fontSize: '0.8rem', margin: '0.5em 0' }} {...props}>
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code style={{
        padding: '2px 6px', background: 'rgba(255,255,255,0.08)',
        borderRadius: 4, fontFamily: 'monospace', fontSize: '0.85em',
      }} {...props}>{children}</code>
    );
  },
  img({ src, alt }) {
    return <img src={src} alt={alt} loading="lazy" style={{ maxWidth: '100%', borderRadius: 8, marginBlock: 12 }} />;
  },
};

// --- Copy helper -------------------------------------------------------------
function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {
    // Fallback for older browsers or non-HTTPS
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
}

// --- Styles ------------------------------------------------------------------
const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body {
    font-family: 'Roboto Flex', 'Roboto', system-ui, sans-serif;
    background: #0d0e0a;
    color: #e4e3d6;
  }
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 3px; }
  .write-root {
    display: flex; flex-direction: column; height: 100dvh;
  }
  .write-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.08);
    background: #13150f; flex-shrink: 0; gap: 12px; flex-wrap: wrap;
  }
  .write-logo {
    font-family: monospace; font-size: 13px; color: #8fb433; font-weight: 600;
    white-space: nowrap;
  }
  .write-hint {
    font-size: 11px; color: rgba(255,255,255,0.35); flex: 1; text-align: center;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .write-meta {
    display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
  }
  .write-meta input {
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px; padding: 5px 10px; color: inherit; font-size: 12px;
    outline: none; font-family: inherit;
  }
  .write-meta input:focus { border-color: #c3e956; }
  .write-meta input::placeholder { color: rgba(255,255,255,0.3); }
  .write-panes {
    display: flex; flex: 1; overflow: hidden; min-height: 0;
  }
  .write-pane {
    flex: 1; display: flex; flex-direction: column; min-width: 0;
  }
  .write-pane + .write-pane { border-left: 1px solid rgba(255,255,255,0.08); }
  .write-pane-label {
    padding: 6px 14px; font-size: 10px; text-transform: uppercase;
    letter-spacing: 0.1em; color: rgba(255,255,255,0.3); border-bottom: 1px solid rgba(255,255,255,0.06);
    font-weight: 600; background: #111309; flex-shrink: 0;
  }
  .write-textarea {
    flex: 1; width: 100%; background: transparent; border: none;
    color: #e4e3d6; padding: 20px; resize: none; outline: none;
    font-family: 'Roboto Mono', 'Fira Code', ui-monospace, monospace;
    font-size: 13px; line-height: 1.7; tab-size: 2;
    overflow-y: auto;
  }
  .write-preview {
    flex: 1; overflow-y: auto; padding: 20px;
    font-size: 14px; line-height: 1.75;
  }
  .write-preview h1 { font-size: 1.6em; font-weight: 800; margin-top: 1em; margin-bottom: 0.4em; }
  .write-preview h2 { font-size: 1.3em; font-weight: 700; margin-top: 1em; margin-bottom: 0.3em; }
  .write-preview h3 { font-size: 1.1em; font-weight: 700; margin-top: 0.8em; margin-bottom: 0.3em; }
  .write-preview p  { margin-bottom: 0.9em; }
  .write-preview ul,.write-preview ol { padding-left: 1.5em; margin-bottom: 0.9em; }
  .write-preview li { margin-bottom: 0.3em; }
  .write-preview a  { color: #c3e956; }
  .write-preview blockquote {
    border-left: 3px solid #c3e956; padding-left: 1em;
    margin: 0.8em 0; opacity: 0.8; font-style: italic;
  }
  .write-preview img { max-width: 100%; border-radius: 8px; margin-block: 12px; }
  .write-preview table { border-collapse: collapse; width: 100%; margin-bottom: 1em; font-size: 0.9em; }
  .write-preview th,.write-preview td { border: 1px solid rgba(255,255,255,0.1); padding: 6px 12px; }
  .write-preview th { background: rgba(255,255,255,0.05); font-weight: 700; }
  .write-preview hr { border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 1.5em 0; }
  .write-bottombar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 16px; border-top: 1px solid rgba(255,255,255,0.08);
    background: #13150f; flex-shrink: 0; gap: 8px; flex-wrap: wrap;
  }
  .write-rt {
    font-size: 11px; color: rgba(255,255,255,0.4); font-family: monospace;
    white-space: nowrap;
  }
  .write-actions { display: flex; gap: 8px; }
  .write-btn {
    padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.06); color: #e4e3d6; cursor: pointer;
    font-family: inherit; font-size: 12px; font-weight: 600;
    transition: background 150ms, border-color 150ms;
  }
  .write-btn:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.25); }
  .write-btn.primary {
    background: #c3e956; color: #1c2300; border-color: #c3e956;
  }
  .write-btn.primary:hover { background: #d9f987; }
  .write-toast {
    position: fixed; bottom: 60px; left: 50%; transform: translateX(-50%);
    background: #c3e956; color: #1c2300; padding: 6px 16px; border-radius: 20px;
    font-size: 12px; font-weight: 700; pointer-events: none;
    animation: fadeInOut 1.8s ease forwards;
    z-index: 9999;
  }
  @keyframes fadeInOut {
    0%   { opacity: 0; transform: translateX(-50%) translateY(8px); }
    15%  { opacity: 1; transform: translateX(-50%) translateY(0); }
    75%  { opacity: 1; }
    100% { opacity: 0; }
  }
`;

// --- Main WritePage component -------------------------------------------------
export default function WritePage() {
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

  const fullMarkdown = useMemo(() => {
    const fm = [
      '---',
      `title: ${title || 'Untitled'}`,
      `description: ${description}`,
      `date: ${date}`,
      `tags: [${tagList.join(', ')}]`,
      `readingTime: ${readingTime}`,
      '---',
      '',
      body,
    ].join('\n');
    return fm;
  }, [title, description, date, tagList, readingTime, body]);

  const manifestEntry = useMemo(() => {
    return JSON.stringify({
      slug,
      title: title || 'Untitled',
      description,
      date,
      tags: tagList,
      readingTime,
      file: `${slug}.md`,
    }, null, 2);
  }, [slug, title, description, date, tagList, readingTime]);

  const copyMarkdown = () => { copyText(fullMarkdown); showToast('Markdown copied!'); };
  const copyManifest = () => { copyText(manifestEntry); showToast('Manifest entry copied!'); };

  return (
    <>
      <style>{css}</style>
      {toast && <div className="write-toast">{toast}</div>}
      <div className="write-root">

        {/* Top bar: logo + meta fields */}
        <div className="write-topbar">
          <span className="write-logo">b3astos/write</span>
          <span className="write-hint">
            Write → Copy Markdown → save to /public/blog/posts/{slug}.md · Copy manifest entry → add to /public/blog/manifest.json
          </span>
          <div className="write-meta">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Post title"
              style={{ minWidth: 180 }}
            />
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Short description"
              style={{ minWidth: 200 }}
            />
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="tags: linux, systems"
              style={{ minWidth: 160 }}
            />
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{ minWidth: 130 }}
            />
          </div>
        </div>

        {/* Two-pane editor / preview */}
        <div className="write-panes">
          {/* Left: markdown textarea */}
          <div className="write-pane">
            <div className="write-pane-label">Markdown</div>
            <textarea
              className="write-textarea"
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Start writing your post in Markdown…

Use standard Markdown: **bold**, *italic*, ## headings, ```code blocks```, etc.

For images, use standard markdown syntax:
  ![alt text](https://your-image-url.com/image.jpg)

Image hosting is a future milestone — for now, use any CDN or public URL."
              spellCheck
            />
          </div>

          {/* Right: live preview */}
          <div className="write-pane">
            <div className="write-pane-label">Preview · {readingTime} min read</div>
            <div className="write-preview">
              {title && <h1 style={{ marginTop: 0, marginBottom: '0.5em' }}>{title}</h1>}
              {(description || tagList.length > 0 || date) && (
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '1em', fontFamily: 'monospace' }}>
                  {date}{tagList.length > 0 ? ` · ${tagList.map(t => `#${t}`).join(' ')}` : ''}
                </p>
              )}
              {body ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                  {body}
                </ReactMarkdown>
              ) : (
                <p style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
                  Preview appears here as you type…
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bottom bar: stats + actions */}
        <div className="write-bottombar">
          <span className="write-rt">
            {readingTime} min read · {body.trim().split(/\s+/).filter(Boolean).length} words · slug: {slug}
          </span>
          <div className="write-actions">
            <button className="write-btn" onClick={copyManifest}>
              Copy manifest entry
            </button>
            <button className="write-btn primary" onClick={copyMarkdown}>
              Copy Markdown
            </button>
          </div>
        </div>

      </div>
    </>
  );
}
