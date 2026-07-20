import { useEffect, useRef } from 'react';

const CHARS = '!<>-_\\/[]{}-=+*^?#@$%&abcdefghijklmnopqrstuvwxyz0123456789';

export function scrambleText(element, finalText, duration = 800) {
  let frame = 0;
  const totalFrames = Math.round(duration / 16);
  const chars = finalText.split('');

  const update = () => {
    // Element may have unmounted mid-animation
    if (!element.isConnected) return;

    const progress = frame / totalFrames;
    const resolvedCount = Math.floor(progress * chars.length);

    element.textContent = chars.map((char, i) => {
      if (char === ' ') return ' ';
      if (i < resolvedCount) return char;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');

    frame++;
    if (frame <= totalFrames) requestAnimationFrame(update);
    else element.textContent = finalText;
  };

  requestAnimationFrame(update);
}

// React hook version - returns a ref to attach to the element to scramble
export function useScramble(text, trigger = true, delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    if (!trigger || !ref.current) return;
    const t = setTimeout(() => scrambleText(ref.current, text), delay);
    return () => clearTimeout(t);
  }, [trigger, text, delay]);
  return ref;
}
