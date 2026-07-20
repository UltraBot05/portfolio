import { useEffect } from 'react';
import DOMPurify from 'dompurify';
import './Output.css';

function Output({ history }) {
  useEffect(() => {
    // Add click handler for color dots
    const handleColorClick = (e) => {
      if (e.target.classList.contains('color-dot')) {
        const color = e.target.getAttribute('data-color');
        navigator.clipboard.writeText(color).then(() => {
          // Visual feedback
          const originalText = e.target.textContent;
          e.target.textContent = '✓';
          setTimeout(() => {
            e.target.textContent = originalText;
          }, 1000);
        });
      }
    };

    document.addEventListener('click', handleColorClick);
    return () => document.removeEventListener('click', handleColorClick);
  }, []);
  
  // Terminal output can include AI-generated text, so sanitize every string
  // with DOMPurify before it reaches the DOM (defense-in-depth XSS guard).
  const createSafeHTML = (html) => DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['span', 'div', 'pre', 'b', 'i', 'strong', 'em', 'br', 'a'],
    ALLOWED_ATTR: ['style', 'class', 'data-color', 'href', 'target', 'rel', 'title'],
  });

  return (
    <div className="output">
      {history.map((entry, index) => (
        <div key={index} className={`output-entry ${entry.type}`}>
          {entry.type === 'command' && (
            <div className="command-echo">
              <span className="prompt-user">b3ast@b3astos</span>
              <span className="prompt-separator">:</span>
              <span className="prompt-path">~</span>
              <span className="prompt-symbol">$</span>
              <span className="command-text">{entry.content}</span>
            </div>
          )}
          
          {entry.type === 'output' && (
            <div className="output-text">
              <pre dangerouslySetInnerHTML={{ __html: createSafeHTML(entry.content) }}></pre>
            </div>
          )}
          
          {entry.type === 'system' && (
            <div className="system-text">
              <pre dangerouslySetInnerHTML={{ __html: createSafeHTML(entry.content) }}></pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Output;
