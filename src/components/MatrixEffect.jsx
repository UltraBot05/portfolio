import { useState, useEffect, useRef } from 'react';
import './MatrixEffect.css';

function MatrixEffect() {
  const canvasRef = useRef(null);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create stars
    const stars = [];
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random(),
        fadeDirection: Math.random() > 0.5 ? 1 : -1
      });
    }

    // Create floating particles
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hue: Math.random() * 60 + 180 // Blue to purple range
      });
    }

    function draw() {
      // Clear with fade effect
      ctx.fillStyle = 'rgba(17, 17, 27, 0.1)'; // var(--crust) with alpha
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(205, 214, 244, ${star.opacity})`; // var(--text)
        ctx.fill();

        // Twinkle effect
        star.opacity += star.fadeDirection * 0.01;
        if (star.opacity <= 0 || star.opacity >= 1) {
          star.fadeDirection *= -1;
        }

        // Drift slowly
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // Draw floating particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        
        // Create gradient for dreamy effect
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        );
        gradient.addColorStop(0, `hsla(${particle.hue}, 70%, 70%, 0.8)`);
        gradient.addColorStop(1, `hsla(${particle.hue}, 70%, 70%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Move particles
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Slowly change hue
        particle.hue += 0.1;
        if (particle.hue > 280) particle.hue = 180;
      });
    }

    const interval = setInterval(draw, 30);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      clearInterval(countdownInterval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="matrix-container">
      <canvas ref={canvasRef} className="matrix-canvas"></canvas>
      <div className="matrix-message">
        <div className="matrix-text">Minimized...</div>
        <div className="matrix-subtext">Restoring terminal in {countdown} second{countdown !== 1 ? 's' : ''}...</div>
      </div>
    </div>
  );
}

export default MatrixEffect;
