import { useEffect } from 'react';

// Global keyboard bindings for the desktop shell.
// Ctrl+K (the VS Code / Linear / Vercel command-palette convention) - the
// original Alt+Space gets intercepted by the browser/OS before the app sees it.
export function useKeyboardShortcuts({ onToggleLauncher }) {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey && !e.altKey && !e.shiftKey && e.code === 'KeyK') {
        e.preventDefault();
        onToggleLauncher?.();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onToggleLauncher]);
}
