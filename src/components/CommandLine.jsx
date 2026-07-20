import { useState, useRef, useEffect } from 'react';
import './CommandLine.css';

function CommandLine({ onSubmit, onClear, commandHistory, historyIndex, setHistoryIndex }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    // Always keep input focused
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      if (input.trim().toLowerCase() === 'clear') {
        onClear();
        setInput('');
      } else {
        onSubmit(input);
        setInput('');
      }
    }
  };

  const handleKeyDown = (e) => {
    // Up arrow - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    }
    
    // Down arrow - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }

    // Ctrl+L - clear screen
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      onClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="command-line">
      <div className="prompt">
        <span className="prompt-user">b3ast@b3astos</span>
        <span className="prompt-separator">:</span>
        <span className="prompt-path">~</span>
        <span className="prompt-symbol">$</span>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="command-input"
        aria-label="Terminal command input"
        placeholder="type 'help' or ask anything..."
        spellCheck="false"
        autoComplete="off"
        autoFocus
        data-cursor="text"
      />
    </form>
  );
}

export default CommandLine;
