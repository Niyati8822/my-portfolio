/* Simplified Home hero: centered text, removed per-character & glitch animations.
   Inspired by minimal hero layout; avoids copying proprietary assets from external sites. */



import React, { useEffect, useRef } from 'react';
import './index.scss';

const Home = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Constellation effect with blank spaces and connected clusters
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationId;

    // Define blank (no-star) rectangular regions (e.g., center and corners)
    const BLANKS = [
      // Center blank (adjust size as needed)
      {
        x: width * 0.35,
        y: height * 0.35,
        w: width * 0.3,
        h: height * 0.3,
      },
      // Top left
      // { x: 0, y: 0, w: width * 0.15, h: height * 0.15 },
      // Bottom right
      // { x: width * 0.85, y: height * 0.85, w: width * 0.15, h: height * 0.15 },
    ];

    function isInBlank(x, y) {
      return BLANKS.some(
        b => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h
      );
    }

    function getStarNum() {
  // Fewer constellations, but denser clusters: more stars, fewer connections
  return Math.floor((width * height) / 5000);
    }
    let STAR_NUM = getStarNum();
    let stars = [];
    const STAR_COLOR = '#fff';
    const LINE_COLOR = 'rgba(255,255,255,0.22)';
    const STAR_SIZE = 1.5;
  const STAR_SPEED = 0.18;
  const LINE_DIST = 100; // increase distance to reduce number of constellations

    function initStars() {
      STAR_NUM = getStarNum();
      stars = [];
      let attempts = 0;
      // Distribute stars randomly across the entire canvas
      while (stars.length < STAR_NUM && attempts < STAR_NUM * 10) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        if (!isInBlank(x, y)) {
          stars.push({
            x,
            y,
            vx: (Math.random() - 0.5) * STAR_SPEED,
            vy: (Math.random() - 0.5) * STAR_SPEED,
          });
        }
        attempts++;
      }
    }
    initStars();

    // Mouse interaction for "gravity" effect
    let mouse = { x: null, y: null };
    canvas.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    canvas.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Draw stars
      for (let i = 0; i < stars.length; i++) {
        ctx.beginPath();
        ctx.arc(stars[i].x, stars[i].y, STAR_SIZE, 0, Math.PI * 2);
        ctx.fillStyle = STAR_COLOR;
        ctx.globalAlpha = 0.35;
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.fill();
        ctx.closePath();
        ctx.globalAlpha = 1;
      }
      // Draw lines: connect each star to all others within LINE_DIST
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[j].x - stars[i].x;
          const dy = stars[j].y - stars[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DIST) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = LINE_COLOR;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.7;
            ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1;
          }
        }
      }
      // Draw lines from mouse to nearby stars
      if (mouse.x !== null && mouse.y !== null) {
        for (let i = 0; i < stars.length; i++) {
          const dx = stars[i].x - mouse.x;
          const dy = stars[i].y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINE_DIST * 1.2) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = 'rgba(255,255,255,0.18)';
            ctx.lineWidth = 1.2;
            ctx.globalAlpha = 1 - dist / (LINE_DIST * 1.2);
            ctx.stroke();
            ctx.closePath();
            ctx.globalAlpha = 1;
          }
        }
      }
    }

    function animate() {
      for (let i = 0; i < stars.length; i++) {
        stars[i].x += stars[i].vx;
        stars[i].y += stars[i].vy;
        // Bounce off edges
        if (stars[i].x < 0 || stars[i].x > width) stars[i].vx *= -1;
        if (stars[i].y < 0 || stars[i].y > height) stars[i].vy *= -1;
        // Keep out of blank regions
        if (isInBlank(stars[i].x, stars[i].y)) {
          // Push star out of blank region
          stars[i].vx *= -1.2;
          stars[i].vy *= -1.2;
          stars[i].x += stars[i].vx * 2;
          stars[i].y += stars[i].vy * 2;
        }
      }
      draw();
      animationId = requestAnimationFrame(animate);
    }

    animate();

    // Define resize function to update canvas and variables
    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    // Re-init stars on resize for responsiveness
    const handleResize = () => {
      resize();
      initStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      canvas.removeEventListener('mousemove', () => {});
      canvas.removeEventListener('mouseleave', () => {});
    };
  }, []);

  return (
    <section id="home" className="home section section-home">
      <div className="constellation-bg">
        <canvas ref={canvasRef}></canvas>
            <div className="home-intro">
              <p className="about-paragraph">Hi,</p>
              <p className="about-paragraph">I am Niyati</p>
              <p className="about-paragraph">AI User Researcher</p>
            </div>
      </div>
    </section>
  );
};

export default Home;
