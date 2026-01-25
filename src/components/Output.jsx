import { useEffect } from 'react';
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
  
  // Safe HTML rendering - sanitize HTML content
  const createSafeHTML = (html) => {
    // Create a safe version by parsing and filtering
    const temp = document.createElement('div');
    temp.innerHTML = html;
    
    // Remove any potentially dangerous elements
    const dangerous = temp.querySelectorAll('script, iframe, object, embed, link');
    dangerous.forEach(el => el.remove());
    
    // Remove dangerous attributes
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on') || (attr.name === 'href' && attr.value.includes('javascript:'))) {
          el.removeAttribute(attr.name);
        }
      });
    });
    
    return temp.innerHTML;
  };

  return (
    <div className="output">
      {history.map((entry, index) => (
        <div key={index} className={`output-entry ${entry.type}`}>
          {entry.type === 'command' && (
            <div className="command-echo">
              <span className="prompt-user">PortfolioOS@Abhigyan</span>
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
