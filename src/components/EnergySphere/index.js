import './index.scss';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const EnergySphere = ({ skills = [] }) => {
  const mountRef = useRef(null);
  const frameRef = useRef(null);
  const sphereGroupRef = useRef(null);
  const rendererRef = useRef(null);
  const rotationTargetRef = useRef({ x: 0, y: 0 });
  const baseRotationRef = useRef({ x: 0.0015, y: 0.0025 });
  const [error, setError] = useState(null);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    // Test environment fallback
    const isTestEnv = typeof process !== 'undefined' && process.env && process.env.JEST_WORKER_ID;
    if (isTestEnv) {
      mountEl.classList.add('energy-sphere-fallback');
      skills.forEach((skill) => {
        const span = document.createElement('span');
        span.textContent = skill;
        span.className = 'fallback-skill-tag';
        mountEl.appendChild(span);
      });
      return () => {
        while (mountEl.firstChild) mountEl.removeChild(mountEl.firstChild);
      };
    }

    try {
      const width = mountEl.clientWidth || 600;
      const height = mountEl.clientHeight || 600;
      console.log('EnergySphere: Initializing. Container:', width, 'x', height);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 200);
      camera.position.set(0, 0, 40);
      
      // Force context creation with explicit settings
      const renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mountEl.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const sphereGroup = new THREE.Group();
      sphereGroupRef.current = sphereGroup;
      scene.add(sphereGroup);

      // Lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.42));
      const keyLight = new THREE.DirectionalLight(0x87cefa, 0.8);
      keyLight.position.set(30, 20, 40);
      scene.add(keyLight);
      const rimLight = new THREE.DirectionalLight(0xffe08a, 0.6);
      rimLight.position.set(-25, -15, -35);
      scene.add(rimLight);



      const createSkillSprite = (text) => {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
  ctx.font = '600 48px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 8;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        const texture = new THREE.CanvasTexture(canvas);
        texture.minFilter = THREE.LinearFilter;
        const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(12, 3, 1);
        return sprite;
      };

      // Golden angle distribution
      const radius = 17;
      const total = skills.length;
      if (total > 0) {
        const goldenAngle = Math.PI * (3 - Math.sqrt(5));
        skills.forEach((skill, i) => {
          const y = 1 - (i / (total - 1)) * 2;
          const radiusAtY = Math.sqrt(1 - y * y);
          const theta = goldenAngle * i;
          const x = Math.cos(theta) * radiusAtY;
          const z = Math.sin(theta) * radiusAtY;
          const sprite = createSkillSprite(skill);
          sprite.position.set(x * radius, y * radius, z * radius);
          sphereGroup.add(sprite);
        });
      }

      const handleResize = () => {
        if (!mountRef.current) return;
        const newW = mountRef.current.clientWidth || width;
        const newH = mountRef.current.clientHeight || height;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };
      window.addEventListener('resize', handleResize);

      const handleMouseMove = (e) => {
        const rect = mountEl.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        rotationTargetRef.current.x = relY * 0.02;
        rotationTargetRef.current.y = relX * 0.02;
      };
      mountEl.addEventListener('mousemove', handleMouseMove);

      const animate = () => {
        frameRef.current = requestAnimationFrame(animate);
        sphereGroup.rotation.y += baseRotationRef.current.y + rotationTargetRef.current.y;
        sphereGroup.rotation.x += baseRotationRef.current.x + rotationTargetRef.current.x;
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(frameRef.current);
        window.removeEventListener('resize', handleResize);
        mountEl.removeEventListener('mousemove', handleMouseMove);
        sphereGroup.children.forEach((child) => {
          if (child.material && child.material.map) child.material.map.dispose();
          if (child.material) child.material.dispose();
          if (child.geometry) child.geometry.dispose();
        });
        renderer.dispose();
        if (renderer.domElement && renderer.domElement.parentNode === mountEl) {
          mountEl.removeChild(renderer.domElement);
        }
      };
    } catch (e) {
      console.error('EnergySphere initialization failed:', e);
      setError(e);
    }
  }, [skills]);

  if (error) {
    return (
      <div className="energy-sphere-container energy-sphere-fallback" aria-label="Skills tag cloud">
        {skills.map((skill) => (
          <span key={skill} className="fallback-skill-tag">{skill}</span>
        ))}
      </div>
    );
  }

  return <div className="energy-sphere-container" ref={mountRef} aria-label="Skills energy sphere visualization" />;
};

export default EnergySphere;
