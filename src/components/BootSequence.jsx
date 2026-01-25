import { useState, useEffect } from 'react';
import './BootSequence.css';

function BootSequence() {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  
  const bootMessages = [
    { text: 'Initializing kernel...', delay: 100 },
    { text: 'Loading user modules...', delay: 300 },
    { text: 'Mounting /dev/skills...', delay: 600 },
    { text: 'Starting network services...', delay: 900 },
    { text: 'Initializing AI assistant...', delay: 1150 },
    { text: 'AI assistant [ONLINE]', delay: 1400, status: 'success' },
    { text: '', delay: 1650 },
    { text: 'System ready.', delay: 1850, status: 'success' },
  ];

  useEffect(() => {
    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        setLines(prev => [...prev, msg]);
      }, msg.delay);
    });

    // Smooth progress bar - completes in 2.5 seconds
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 4; // Increments smoothly (4% every 100ms = 2500ms to reach 100%)
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="boot-sequence">
      <div className="boot-layout">
        <div className="boot-left">
          {lines.map((line, index) => (
            <div key={index} className={`boot-line ${line.status || ''}`}>
              {line.text && (
                <>
                  <span className="boot-status">
                    {line.status === 'success' ? '[  OK  ]' : '[     ]'}
                  </span>
                  <span className="boot-text">{line.text}</span>
                </>
              )}
              {!line.text && <br />}
            </div>
          ))}
        </div>

        <div className="boot-center">
          <div className="boot-logo">
            <div className="logo-emoji">😎</div>
          </div>
          <div className="progress-container">
            <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="progress-text">{progress}%</div>
        </div>
      </div>
    </div>
  );
}

export default BootSequence;
