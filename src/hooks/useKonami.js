import { useEffect, useRef } from 'react';

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

// Konami code detector (brief §9.3). Calls onKonami() when the full sequence
// is entered; any wrong key resets progress.
export function useKonami(onKonami) {
  const idx = useRef(0);

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[idx.current]) {
        idx.current += 1;
        if (idx.current === SEQUENCE.length) {
          idx.current = 0;
          onKonami();
        }
      } else {
        // allow a wrong key to still start a fresh sequence
        idx.current = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onKonami]);
}
