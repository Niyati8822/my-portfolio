import './index.scss';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap-trial';

/*
  EnergySphere Component Contract
  Props:
    skills: string[] - list of skill labels to render as orbiting sprites.
  Behavior:
    Renders a glowing energy sphere with distributed skill labels around it.
    Auto-rotates slowly; mouse movement adjusts rotation direction subtly.
  Cleanup:
    Disposes Three.js objects & event listeners on unmount.
*/

const EnergySphere = ({ skills = [] }) => {
  const mountRef = useRef(null);
  const frameRef = useRef(null);
  const sphereGroupRef = useRef(null);
  const rendererRef = useRef(null);
  const animationTimelineRef = useRef(null);
  const rotationTargetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    // Detect if WebGL is supported (jsdom test environment won't have it)
    const canInitWebGL = (() => {
      if (typeof document === 'undefined') return false;
      try {
        const testCanvas = document.createElement('canvas');
        return !!(
          testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')
        );
      } catch (e) {
        return false;
      }
    })();

    if (!canInitWebGL) {
      // Fallback: render static skill tags without Three.js (test-friendly)
      mountEl.classList.add('energy-sphere-fallback');
      skills.forEach((skill) => {
        const span = document.createElement('span');
        span.textContent = skill;
        span.className = 'fallback-skill-tag';
        mountEl.appendChild(span);
      });
      return () => {
        // Cleanup appended spans
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
      };
    }

    const width = mountEl.clientWidth;
    const height = mountEl.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
    camera.position.set(0, 0, 40);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountEl.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0x88baff, 0.6));
    const pointLight = new THREE.PointLight(0xffffff, 2, 120);
    pointLight.position.set(20, 30, 30);
    scene.add(pointLight);

    // Group for skill sprites
    const sphereGroup = new THREE.Group();
    sphereGroupRef.current = sphereGroup;
    scene.add(sphereGroup);

    // Helper to build a canvas-based texture for text without glow
    const createSkillSprite = (text) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');

      // Text styling - no glow effects
      ctx.font = 'bold 48px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const material = new THREE.SpriteMaterial({ 
        map: texture, 
        transparent: true
      });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(12, 3, 1);
      return sprite;
    };

    // Distribute skills on sphere using Fibonacci sphere algorithm
    const radius = 17; // radius for skill distribution
    skills.forEach((skill, i) => {
      const phi = Math.acos(-1 + (2 * i) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      const sprite = createSkillSprite(skill);
      sprite.position.set(x, y, z);
      sphereGroup.add(sprite);
    });

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Mouse interaction for rotation direction control
    const handleMouseMove = (e) => {
      const rect = mountEl.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      // Map cursor position to rotation speeds
      rotationTargetRef.current.x = relY * 0.02; // up/down cursor movement
      rotationTargetRef.current.y = relX * 0.02; // left/right cursor movement
    };
    mountEl.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      // Rotation follows cursor with smooth interpolation
      sphereGroup.rotation.y += rotationTargetRef.current.y;
      sphereGroup.rotation.x += rotationTargetRef.current.x;
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', handleResize);
      mountEl.removeEventListener('mousemove', handleMouseMove);
      if (animationTimelineRef.current) animationTimelineRef.current.kill();
      sphereGroup.children.forEach((child) => {
        if (child.material && child.material.map) {
          child.material.map.dispose();
        }
        if (child.material) child.material.dispose();
        if (child.geometry) child.geometry.dispose();
      });
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === mountEl) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, [skills]);

  return (
    <div className="energy-sphere-container" ref={mountRef} aria-label="Skills energy sphere visualization" />
  );
};

export default EnergySphere;
