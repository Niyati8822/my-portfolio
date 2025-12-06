import React, { useRef, useEffect } from 'react';
import './index.scss';

// Simple water ripple effect using canvas
const WaterEffect = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const width = window.innerWidth;
  const height = window.innerHeight;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let t = 0;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      for (let y = 0; y < height; y += 2) {
        for (let x = 0; x < width; x += 2) {
          // Water ripple formula
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const wave = Math.sin(dist / 18 - t) * 8;
          const shade = 180 + Math.sin(dist / 30 - t / 2) * 40;
          ctx.fillStyle = `rgba(${shade},${shade + 20},255,0.13)`;
          ctx.fillRect(x + wave, y + wave, 2, 2);
        }
      }
      t += 0.04;
      animationRef.current = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="water-effect-canvas"
      style={{position:'fixed',top:0,left:0,width:'100vw',height:'100vh',zIndex:0,pointerEvents:'none'}}
      aria-hidden="true"
    />
  );
};

export default WaterEffect;
