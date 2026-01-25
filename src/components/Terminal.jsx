import { useState, useEffect, useRef } from 'react';
import BootSequence from './BootSequence';
import CommandLine from './CommandLine';
import Output from './Output';
import ControlPanel from './ControlPanel';
import { handleCommand } from '../utils/commandHandler';
import { queryAIOrchestrator } from '../utils/aiOrchestrator';
import MatrixEffect from './MatrixEffect';
import CloseMessage from './CloseMessage';
import './Terminal.css';

function Terminal() {
  const [isBooting, setIsBooting] = useState(true);
  const [history, setHistory] = useState([]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showCloseMessage, setShowCloseMessage] = useState(false);
  const [fontSize, setFontSize] = useState(18);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const terminalRef = useRef(null);
  const outputEndRef = useRef(null);
  const pendingRequestRef = useRef(null);

  useEffect(() => {
    // Boot sequence takes 2.5 seconds
    const timer = setTimeout(() => {
      setIsBooting(false);
      // Add welcome message after boot
      setHistory([{
        type: 'output',
        content: 'Welcome to my portfolio. (v1.0.0)\nType \'help\' to see a list of available commands.\nOr, just ask my AI assistant a question.\n'
      }]);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (outputEndRef.current) {
      outputEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  const processCommand = async (input) => {
    if (!input.trim()) return;

    // Add command to history
    setHistory(prev => [...prev, {
      type: 'command',
      content: input
    }]);

    // Add to command history for up/down arrow navigation
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    // Check if it's a direct command or natural language
    const directCommandResult = handleCommand(input);
    
    if (directCommandResult.isCommand) {
      // It's a recognized command
      setHistory(prev => [...prev, {
        type: 'output',
        content: directCommandResult.output
      }]);
    } else {
      // Create new request tracker with unique ID
      const requestId = Date.now() + Math.random();
      
      // Try AI orchestrator for natural language
      setHistory(prev => [...prev, {
        type: 'output',
        content: '[B3ast] Processing your request...',
        id: requestId
      }]);

      try {
        const aiResult = await queryAIOrchestrator(input);
        
        // Remove the "Processing" message by filtering by ID
        setHistory(prev => prev.filter(entry => entry.id !== requestId));
        
        if (aiResult.response) {
          // Show conversational AI response first
          setHistory(prev => [...prev, {
            type: 'system',
            content: `[B3ast] ${aiResult.response}`
          }]);
          
          // If AI also wants to run a command, show its output
          if (aiResult.command) {
            const commandResult = handleCommand(aiResult.command);
            setHistory(prev => [...prev, {
              type: 'output',
              content: commandResult.output
            }]);
          }
        } else if (aiResult.command) {
          // Only command, no conversational response (old behavior)
          const commandResult = handleCommand(aiResult.command);
          setHistory(prev => [...prev, {
            type: 'output',
            content: commandResult.output
          }]);
        } else {
          // Neither response nor command
          setHistory(prev => [...prev, {
            type: 'output',
            content: 'Command not recognized. Type "help" for available commands.'
          }]);
        }
      } catch (error) {
        console.error('AI Orchestrator error:', error);
        
        // Remove processing message and show error
        setHistory(prev => prev.filter(entry => entry.id !== requestId));
        setHistory(prev => [...prev, {
          type: 'output',
          content: `Command not recognized: "${input}"\nType "help" for available commands.`
        }]);
      }
    }
  };

  const clearTerminal = () => {
    setHistory([]);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
    // Restore after 5 seconds
    setTimeout(() => {
      setIsMinimized(false);
    }, 5000);
  };

  const handleClose = () => {
    setShowCloseMessage(true);
  };

  const handleFontIncrease = () => {
    setFontSize(prev => {
      const newSize = Math.min(prev + 2, 24); // Max 24px
      console.log(`📏 Font increased: ${prev}px → ${newSize}px`);
      return newSize;
    });
  };

  const handleFontDecrease = () => {
    setFontSize(prev => {
      const newSize = Math.max(prev - 2, 10); // Min 10px
      console.log(`📏 Font decreased: ${prev}px → ${newSize}px`);
      return newSize;
    });
  };

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  // Apply theme and font size
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      // Dark Mode - Catppuccin Mocha
      root.style.setProperty('--base', '#1e1e2e');
      root.style.setProperty('--mantle', '#181825');
      root.style.setProperty('--crust', '#11111b');
      root.style.setProperty('--text', '#cdd6f4');
      root.style.setProperty('--subtext0', '#a6adc8');
      root.style.setProperty('--subtext1', '#bac2de');
      root.style.setProperty('--surface0', '#313244');
      root.style.setProperty('--surface1', '#45475a');
      root.style.setProperty('--surface2', '#585b70');
      
      // Dark mode accent colors
      root.style.setProperty('--red', '#f38ba8');
      root.style.setProperty('--yellow', '#f9e2af');
      root.style.setProperty('--green', '#a6e3a1');
      root.style.setProperty('--blue', '#89b4fa');
      root.style.setProperty('--pink', '#f5c2e7');
      root.style.setProperty('--purple', '#cba6f7');
      root.style.setProperty('--mauve', '#cba6f7');
      root.style.setProperty('--sapphire', '#74c7ec');
    } else {
      // Light Mode - Soft Gray with Good Contrast
      root.style.setProperty('--base', '#f5f5f5'); // Soft light gray
      root.style.setProperty('--mantle', '#eeeeee'); // Light gray
      root.style.setProperty('--crust', '#e0e0e0'); // Medium light gray
      root.style.setProperty('--text', '#000000'); // PURE BLACK
      root.style.setProperty('--subtext0', '#1a1a1a'); // Almost black
      root.style.setProperty('--subtext1', '#1a1a1a'); // Almost black (DARK!)
      root.style.setProperty('--surface0', '#d3d3d3'); // Light gray
      root.style.setProperty('--surface1', '#bdbdbd'); // Medium gray
      root.style.setProperty('--surface2', '#9e9e9e'); // Darker gray
      
      // Accent colors for light mode - DARK colors for readability
      root.style.setProperty('--red', '#c62828'); // Dark red
      root.style.setProperty('--yellow', '#f57c00'); // Orange
      root.style.setProperty('--green', '#1b5e20'); // Dark green
      root.style.setProperty('--blue', '#01579b'); // Dark blue
      root.style.setProperty('--pink', '#ad1457'); // Dark pink
      root.style.setProperty('--purple', '#4a148c'); // Dark purple
      root.style.setProperty('--mauve', '#6a1b9a'); // Dark purple
      root.style.setProperty('--sapphire', '#0277bd'); // Dark blue
    }
  }, [isDarkMode]);

  if (isBooting) {
    return <BootSequence />;
  }

  if (showCloseMessage) {
    return <CloseMessage />;
  }

  if (isMinimized) {
    return <MatrixEffect />;
  }

  return (
    <div className="terminal-wrapper">
      <div 
        className={`terminal-container ${isFullscreen ? 'fullscreen' : ''}`} 
        ref={terminalRef}
        style={{ fontSize: `${fontSize}px` }}
      >
        <div className="terminal-header">
          <div className="terminal-buttons">
            <span className="btn btn-close" onClick={handleClose} title="Close"></span>
            <span className="btn btn-minimize" onClick={handleMinimize} title="Minimize"></span>
            <span className="btn btn-maximize" onClick={handleFullscreen} title="Toggle Fullscreen"></span>
          </div>
          <div className="terminal-title">
            Epik Konsole
          </div>
        </div>
        
        <div className="terminal-body">
          <div className="output-container">
            <Output history={history} />
            <div ref={outputEndRef} />
          </div>
          
          <CommandLine 
            onSubmit={processCommand}
            onClear={clearTerminal}
            commandHistory={commandHistory}
            historyIndex={historyIndex}
            setHistoryIndex={setHistoryIndex}
          />
        </div>
      </div>
      
      <ControlPanel 
        onFontIncrease={handleFontIncrease}
        onFontDecrease={handleFontDecrease}
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
        fontSize={fontSize}
        isFullscreen={isFullscreen}
      />
    </div>
  );
}

export default Terminal;
