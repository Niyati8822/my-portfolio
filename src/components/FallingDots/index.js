import { useEffect, useRef } from 'react';
import './index.scss';

const FallingDots = ({ count = 140 }) => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const dotsRef = useRef([]);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const computeCount = () => {
      const w = window.innerWidth;
      if (w < 480) return Math.round(count * 0.45); // very small screens
      if (w < 768) return Math.round(count * 0.65); // tablets / small devices
      if (w < 1024) return Math.round(count * 0.85);
      return count;
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const effective = computeCount();
      // regenerate dots proportionally; spawn some above viewport for immediate motion
      dotsRef.current = Array.from({ length: effective }).map(() => ({
        x: Math.random() * canvas.width,
        y: (Math.random() < 0.55 ? -Math.random() * canvas.height : Math.random() * canvas.height),
        r: Math.random() * 0.65 + 0.25, // smaller radius (0.25 - 0.9)
        speed: Math.random() * 70 + 70, // faster (70 - 140 px/sec)
        alpha: Math.random() * 0.5 + 0.25
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    const step = (time) => {
      const delta = (time - lastTimeRef.current) / 1000; // seconds
      lastTimeRef.current = time;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'lighter';

      for (const d of dotsRef.current) {
        d.y += d.speed * delta;
        if (d.y - d.r > canvas.height) {
          d.y = -d.r; // wrap to top
          d.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${d.alpha})`;
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [count]);

  return <canvas ref={canvasRef} className="falling-dots-canvas" aria-hidden="true" />;
};

export default FallingDots;
