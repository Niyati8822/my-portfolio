import React, { useEffect, useRef } from 'react';
import './index.scss';

const InteractiveConstellation = ({ imageSrc }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      // Set canvas size
      const maxWidth = 600;
      const scale = maxWidth / img.width;
      const w = maxWidth;
      const h = Math.round(img.height * scale);
      
      canvas.width = w;
      canvas.height = h;

      // Draw image to sample pixels
      ctx.drawImage(img, 0, 0, w, h);
      const imageData = ctx.getImageData(0, 0, w, h);
      const pixels = imageData.data;

      // Create particles from image
      const particles = [];
      const step = 4; // Sample every 4 pixels (denser)

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4;
          const r = pixels[idx];
          const g = pixels[idx + 1];
          const b = pixels[idx + 2];
          const a = pixels[idx + 3];

          // Only create particles for visible pixels
          if (a > 50) {
            const brightness = (r + g + b) / 3;

            // Lighten the sampled color for overall brighter look.
            const lighten = (c) => Math.min(255, Math.round(c * 1.25 + 25));
            const lr = lighten(r);
            const lg = lighten(g);
            const lb = lighten(b);

            particles.push({
              x,
              y,
              originalX: x,
              originalY: y,
              vx: 0,
              vy: 0,
              r: 1.6, // slightly bigger for visibility
              brightness,
              // store original & lightened components
              rComp: lr,
              gComp: lg,
              bComp: lb,
              color: `rgb(${r}, ${g}, ${b})`, // original color retained if needed
              drawColor: `rgb(${lr}, ${lg}, ${lb})`,
              phase: Math.random() * Math.PI * 2
            });
          }
        }
      }

      particlesRef.current = particles;

      // Animation loop
      const animate = () => {
        ctx.clearRect(0, 0, w, h);
  const pts = particlesRef.current;

        // Draw particles (no animation - keep still)
        pts.forEach((p, i) => {
          // Keep particles at original position
          p.x = p.originalX;
          p.y = p.originalY;

          // Draw particle with glow
          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.drawColor;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.drawColor;
          ctx.fill();
          
          // Reset shadow for sharpness
          ctx.shadowBlur = 0;
        });

        // Draw connections with animation
        const maxConnectionDist = 25;
        const maxD2 = maxConnectionDist * maxConnectionDist;

        for (let i = 0; i < pts.length; i++) {
          const p1 = pts[i];
          
          for (let j = i + 1; j < Math.min(i + 50, pts.length); j++) {
            const p2 = pts[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const d2 = dx * dx + dy * dy;

            if (d2 < maxD2) {
              const dist = Math.sqrt(d2);
              let alpha = (1 - dist / maxConnectionDist) * 0.4;

              // Determine line color from particle colors
              const r = Math.round((p1.rComp + p2.rComp) / 2);
              const g = Math.round((p1.gComp + p2.gComp) / 2);
              const b = Math.round((p1.bComp + p2.bComp) / 2);

              // Add glow to lines
              ctx.shadowBlur = 6;
              ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${alpha * 0.85})`;
              
              ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
              
              ctx.shadowBlur = 0;
            }
          }
        }

        rafRef.current = requestAnimationFrame(animate);
      };

      animate();
    };

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [imageSrc]);

  return (
    <div className='interactive-constellation' ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default InteractiveConstellation;
