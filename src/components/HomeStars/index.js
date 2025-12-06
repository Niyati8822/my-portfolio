import React, { useRef, useEffect } from 'react';
import './index.scss';

const LAYERS = [
  { count: 80, minSize: 0.35, maxSize: 0.7, opacity: 0.18, lineAlpha: 0.08, lineWidth: 0.4, neighbor: 3, lineDist: 80 },
  { count: 60, minSize: 0.5, maxSize: 1.0, opacity: 0.11, lineAlpha: 0.04, lineWidth: 0.25, neighbor: 2, lineDist: 60 },
  { count: 40, minSize: 0.7, maxSize: 1.2, opacity: 0.08, lineAlpha: 0.02, lineWidth: 0.18, neighbor: 2, lineDist: 40 },
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const HomeStars = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const dprRef = useRef(window.devicePixelRatio || 1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      dprRef.current = window.devicePixelRatio || 1;
      canvas.width = width * dprRef.current;
      canvas.height = height * dprRef.current;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
    }

    function createStars() {
      let all = [];
      LAYERS.forEach((layer, idx) => {
        all = all.concat(Array.from({ length: layer.count }).map(() => ({
          x: randomBetween(0, width),
          y: randomBetween(0, height),
          r: randomBetween(layer.minSize, layer.maxSize),
          vx: randomBetween(-0.04, 0.04) * (1 + idx * 0.2),
          vy: randomBetween(-0.04, 0.04) * (1 + idx * 0.2),
          layer: idx,
        })));
      });
      starsRef.current = all;
    }

    function updateStars() {
      for (const s of starsRef.current) {
        s.x += s.vx;
        s.y += s.vy;
        // gentle drift, bounce at edge
        if (s.x < 0 || s.x > width) s.vx *= -1;
        if (s.y < 0 || s.y > height) s.vy *= -1;
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dprRef.current, dprRef.current);

      // Draw lines for each layer
      for (let l = 0; l < LAYERS.length; l++) {
        const layerStars = starsRef.current.filter(s => s.layer === l);
        const { neighbor, lineDist, lineAlpha, lineWidth } = LAYERS[l];
        for (let i = 0; i < layerStars.length; i++) {
          const a = layerStars[i];
          // Find nearest neighbors in this layer
          const neighbors = layerStars
            .map((b, j) => ({ b, d: i === j ? Infinity : distance(a, b) }))
            .sort((x, y) => x.d - y.d)
            .slice(0, neighbor);
          for (const { b, d } of neighbors) {
            if (d < lineDist) {
              ctx.globalAlpha = lineAlpha * (1 - d / lineDist);
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = lineWidth;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Cursor interaction: draw lines from cursor to nearby stars (all layers)
      if (mouseRef.current.active) {
        for (let l = 0; l < LAYERS.length; l++) {
          const layerStars = starsRef.current.filter(s => s.layer === l);
          const { lineDist, lineAlpha, lineWidth } = LAYERS[l];
          for (const s of layerStars) {
            const d = distance(mouseRef.current, s);
            if (d < lineDist) {
              ctx.globalAlpha = lineAlpha * 2.2 * (1 - d / lineDist);
              ctx.strokeStyle = '#fff';
              ctx.lineWidth = lineWidth * 1.5;
              ctx.beginPath();
              ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
              ctx.lineTo(s.x, s.y);
              ctx.stroke();
            }
          }
        }
      }

      // Draw stars for each layer
      for (let l = 0; l < LAYERS.length; l++) {
        const layerStars = starsRef.current.filter(s => s.layer === l);
        const { opacity } = LAYERS[l];
        for (const s of layerStars) {
          ctx.globalAlpha = opacity;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.shadowColor = '#fff';
          ctx.shadowBlur = 0.5;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw cursor star
      if (mouseRef.current.active) {
        ctx.globalAlpha = 0.18;
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 0.7;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.restore();
    }

    function animate() {
      updateStars();
      draw();
      animationId = requestAnimationFrame(animate);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left);
      mouseRef.current.y = (e.clientY - rect.top);
      mouseRef.current.active = true;
    }
    function onMouseLeave() {
      mouseRef.current.active = false;
    }
    function onClick(e) {
      onMouseMove(e);
    }

    resize();
    createStars();
    animate();
    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="home-stars-bg"
      style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'auto', background: 'transparent' }}
      aria-hidden="true"
    />
  );
};

export default HomeStars;
