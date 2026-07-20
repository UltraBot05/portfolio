import { useState, useEffect } from 'react';
import './BootSequence.css';

function BootSequence() {
  const [lines, setLines] = useState([]);
  const [progress, setProgress] = useState(0);
  
  // Total boot ≤1s (brief §8.2) - it runs once per session, speed > drama
  const bootMessages = [
    { text: 'Initializing kernel...', delay: 50 },
    { text: 'Loading user modules...', delay: 160 },
    { text: 'Mounting /dev/skills...', delay: 300 },
    { text: 'Starting network services...', delay: 440 },
    { text: 'Initializing AI assistant...', delay: 570 },
    { text: 'AI assistant [ONLINE]', delay: 700, status: 'success' },
    { text: '', delay: 800 },
    { text: 'System ready.', delay: 880, status: 'success' },
  ];

  useEffect(() => {
    bootMessages.forEach((msg, index) => {
      setTimeout(() => {
        setLines(prev => [...prev, msg]);
      }, msg.delay);
    });

    // Smooth progress bar - completes in ~1 second
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10; // 10% every 95ms ≈ 950ms to reach 100%
      });
    }, 95);

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
