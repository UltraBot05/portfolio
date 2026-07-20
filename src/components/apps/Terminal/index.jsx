import { useState, useEffect, useRef } from 'react';
import BootSequence from '../../BootSequence';
import CommandLine from '../../CommandLine';
import Output from '../../Output';
import { handleCommand } from '../../../utils/commandHandler';
import { queryAIOrchestrator } from '../../../utils/aiOrchestrator';
import { useWindowStore } from '../../../store/windowStore';
import './Terminal.css';

// Boot runs ONCE per session (module-level flag, brief §8.2) - reopening the
// terminal window skips straight to the prompt.
let bootDone = false;

const WELCOME = {
  type: 'output',
  content: "Welcome to B3astOS. (v2.0)\nType 'help' to see available commands, or just ask a question.\n",
};

export default function TerminalApp() {
  const [isBooting, setIsBooting] = useState(!bootDone);
  const [history, setHistory] = useState(bootDone ? [WELCOME] : []);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const outputEndRef = useRef(null);
  const openWindow = useWindowStore(s => s.open);

  // Side-effects for commands that do more than print text (brief §9.2)
  const runAction = (action) => {
    if (action === 'matrix') {
      // Desktop owns the full-screen overlay; terminal just asks for it
      window.dispatchEvent(new CustomEvent('b3ast:matrix'));
    } else if (action === 'xxd') {
      openWindow('hexDump', { title: 'xxd', defaultSize: { width: 640, height: 460 } });
    } else if (action === 'rmrf') {
      // fake dramatic deletion, then the punchline
      setTimeout(() => {
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'just kidding. mkdir /home/b3ast ✓',
        }]);
      }, 1800);
    }
  };

  useEffect(() => {
    if (bootDone) return;
    const timer = setTimeout(() => {
      bootDone = true;
      setIsBooting(false);
      setHistory([WELCOME]);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const processCommand = async (input) => {
    if (!input.trim()) return;

    setHistory(prev => [...prev, { type: 'command', content: input }]);
    setCommandHistory(prev => [...prev, input]);
    setHistoryIndex(-1);

    const directCommandResult = handleCommand(input);

    if (directCommandResult.isCommand) {
      setHistory(prev => [...prev, { type: 'output', content: directCommandResult.output }]);
      if (directCommandResult.action) runAction(directCommandResult.action);
      return;
    }

    // Natural language → AI orchestrator
    const requestId = Date.now() + Math.random();
    setHistory(prev => [...prev, {
      type: 'output',
      content: '[B3ast] Processing your request...',
      id: requestId,
    }]);

    try {
      const aiResult = await queryAIOrchestrator(input);
      setHistory(prev => prev.filter(entry => entry.id !== requestId));

      if (aiResult.response) {
        setHistory(prev => [...prev, { type: 'system', content: `[B3ast] ${aiResult.response}` }]);
        if (aiResult.command) {
          const commandResult = handleCommand(aiResult.command);
          setHistory(prev => [...prev, { type: 'output', content: commandResult.output }]);
        }
      } else if (aiResult.command) {
        const commandResult = handleCommand(aiResult.command);
        setHistory(prev => [...prev, { type: 'output', content: commandResult.output }]);
      } else {
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'Command not recognized. Type "help" for available commands.',
        }]);
      }
    } catch (error) {
      console.error('AI Orchestrator error:', error);
      setHistory(prev => prev.filter(entry => entry.id !== requestId));
      setHistory(prev => [...prev, {
        type: 'output',
        content: `Command not recognized: "${input}"\nType "help" for available commands.`,
      }]);
    }
  };

  if (isBooting) {
    return (
      <div className="terminal-app">
        <BootSequence />
      </div>
    );
  }

  return (
    <div className="terminal-app">
      <div className="terminal-output-scroll">
        <Output history={history} />
        <div ref={outputEndRef} />
      </div>
      <CommandLine
        onSubmit={processCommand}
        onClear={() => setHistory([])}
        commandHistory={commandHistory}
        historyIndex={historyIndex}
        setHistoryIndex={setHistoryIndex}
      />
    </div>
  );
}
