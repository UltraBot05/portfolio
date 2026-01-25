import { useState, useEffect, useRef } from 'react';
import { portfolioData } from '../data/portfolioData';
import './ControlPanel.css';

function ControlPanel({ onFontIncrease, onFontDecrease, onThemeToggle, isDarkMode, fontSize, isFullscreen }) {
  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef(null);

  // Initialize position when entering fullscreen
  useEffect(() => {
    if (isFullscreen && position === null) {
      // Start at top-right corner
      setPosition({ 
        x: window.innerWidth - 270, // 250px width + 20px margin
        y: 20 
      });
    } else if (!isFullscreen) {
      // Reset position when exiting fullscreen
      setPosition(null);
    }
  }, [isFullscreen, position]);

  // Handle mouse down on drag handle
  const handleMouseDown = (e) => {
    if (!isFullscreen) return;
    
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    e.preventDefault();
  };

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !isFullscreen) return;

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Constrain to viewport
      const panelWidth = panelRef.current?.offsetWidth || 250;
      const panelHeight = panelRef.current?.offsetHeight || 400;
      const maxX = window.innerWidth - panelWidth;
      const maxY = window.innerHeight - panelHeight;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, isFullscreen]);

  // Build socials array only from what exists in portfolioData
  const socials = [];
  
  if (portfolioData.socials.github) {
    socials.push({
      name: 'UltraBot05',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      ),
      url: portfolioData.socials.github,
      color: 'var(--text)'
    });
  }
  
  if (portfolioData.socials.linkedin) {
    socials.push({
      name: 'adutta05',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      url: portfolioData.socials.linkedin,
      color: 'var(--blue)'
    });
  }
  
  if (portfolioData.socials.discord) {
    socials.push({
      name: 'ub05',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
        </svg>
      ),
      url: portfolioData.socials.discord,
      color: 'var(--blue)'
    });
  }
  
  if (portfolioData.socials.email) {
    socials.push({
      name: 'Mail me!',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
          <polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      url: `mailto:${portfolioData.socials.email}`,
      color: 'var(--green)'
    });
  }

  return (
    <div 
      ref={panelRef}
      className={`control-panel ${isFullscreen ? 'fullscreen draggable' : ''}`}
      style={isFullscreen && position ? {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        right: 'auto',
        width: '250px'
      } : {}}
    >
      {isFullscreen && (
        <div 
          className="drag-handle" 
          onMouseDown={handleMouseDown}
          style={{ 
            cursor: isDragging ? 'grabbing' : 'grab',
            padding: '10px',
            textAlign: 'center',
            borderBottom: '1px solid var(--surface0)',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
        >
          <div style={{ 
            width: '40px', 
            height: '4px', 
            background: 'var(--surface2)', 
            borderRadius: '2px',
            margin: '0 auto'
          }}></div>
        </div>
      )}
      
      <div className="control-section">
        <div className="control-label">Font Size</div>
        <div className="control-buttons">
          <button 
            className="control-btn" 
            onClick={onFontDecrease}
            title="Decrease Font Size"
          >
            A-
          </button>
          <span className="font-size-display">{fontSize}px</span>
          <button 
            className="control-btn" 
            onClick={onFontIncrease}
            title="Increase Font Size"
          >
            A+
          </button>
        </div>
      </div>

      <div className="control-section">
        <div className="control-label">Theme</div>
        <button 
          className="control-btn theme-btn" 
          onClick={onThemeToggle}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
          <span>{isDarkMode ? 'Light' : 'Dark'}</span>
        </button>
      </div>

      <div className="control-section socials-section">
        <div className="control-label">Connect</div>
        <div className="social-links">
          {socials.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              title={social.name}
              style={{ color: social.color }}
            >
              {social.icon}
              <span className="social-name">{social.name}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
