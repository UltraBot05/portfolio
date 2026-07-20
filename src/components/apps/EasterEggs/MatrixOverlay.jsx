// Matrix rain overlay (brief §9 - repurposes the MatrixEffect idea as a timed
// full-screen overlay triggered by the `matrix` terminal command). Draws on a
// self-owned canvas and auto-dismisses.
import { useEffect, useRef } from 'react';

export default function MatrixOverlay({ onDone, duration = 4000 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ｱｲｳｴｵ01B3AST<>{}#@$%&/pwn'.split('');
    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 8, 16, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#00e5ff';
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 45);
    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    const timer = setTimeout(() => onDone?.(), duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, [onDone, duration]);

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 99990, cursor: 'pointer' }}
      onClick={onDone}
      title="click to dismiss"
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
}
