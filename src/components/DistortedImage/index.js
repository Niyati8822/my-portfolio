import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import './index.scss'

/*
  DistortedImage
  - WebGL (three.js) shader-based image distortion with cursor interaction
  Props:
    - src: base image URL
    - overlaySrc: optional overlay image URL blended for color effect
    - strength: base distortion strength (0.0 - 1.0)
    - radius: radius of cursor influence (0.1 - 1.0, in UV space)
*/

const DistortedImage = ({ src, overlaySrc, strength = 0.6, radius = 0.45, className = '' }) => {
  const containerRef = useRef(null)
  const rendererRef = useRef(null)
  const frameRef = useRef(0)
  const [loaded, setLoaded] = useState(false)
  const [webglFailed, setWebglFailed] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer, scene, camera, mesh, uniforms
    let disposed = false

    const width = container.clientWidth
    const height = container.clientHeight

    // Renderer
    // Attempt WebGL context
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch (e) {
      setWebglFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height, false)
    renderer.setClearColor(0x000000, 0) // transparent
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Scene & Camera
    scene = new THREE.Scene()
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    // Geometry: full-screen quad
    const geometry = new THREE.PlaneGeometry(2, 2, 1, 1)

    // Textures
    const loader = new THREE.TextureLoader()
    const baseTex = loader.load(src, () => {
      if (!overlaySrc) setLoaded(true)
    }, undefined, () => { setWebglFailed(true) })
    baseTex.minFilter = THREE.LinearFilter
    baseTex.magFilter = THREE.LinearFilter
    baseTex.anisotropy = renderer.capabilities.getMaxAnisotropy()

  const overlayTex = overlaySrc ? loader.load(overlaySrc, () => setLoaded(true), undefined, () => { /* ignore overlay failure */ }) : null
    if (overlayTex) {
      overlayTex.minFilter = THREE.LinearFilter
      overlayTex.magFilter = THREE.LinearFilter
      overlayTex.anisotropy = renderer.capabilities.getMaxAnisotropy()
    }

    // Uniforms
    uniforms = {
      uTime: { value: 0 },
      uStrength: { value: strength },
      uRadius: { value: radius },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(width, height) },
      uTexture: { value: baseTex },
      uOverlay: { value: overlayTex },
      uHasOverlay: { value: overlayTex ? 1.0 : 0.0 },
    }

    const vertex = /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `

    // Lightweight noise
    const fragment = /* glsl */`
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uStrength;
      uniform float uRadius;
      uniform vec2 uMouse;
      uniform sampler2D uTexture;
      uniform sampler2D uOverlay;
      uniform float uHasOverlay;

      // hash-based value noise
      float hash(vec2 p){
        p = vec2( dot(p,vec2(127.1,311.7)), dot(p,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(p)*43758.5453123);
      }

      float noise(in vec2 p){
        const float K1 = 0.366025404; // (sqrt(3)-1)/2
        const float K2 = 0.211324865; // (3-sqrt(3))/6
        vec2 i = floor(p + (p.x+p.y)*K1);
        vec2 a = p - i + (i.x+i.y)*K2;
        vec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
        vec2 b = a - o + K2;
        vec2 c = a - 1.0 + 2.0*K2;
        vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
        vec3 n = h*h*h*h*vec3( dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)) );
        return dot(n, vec3(70.0));
      }

      void main(){
        // distance from cursor in UV space
        float d = distance(vUv, uMouse);
        float influence = smoothstep(uRadius, 0.0, d); // 1 at mouse, 0 outside radius
        float t = uTime * 0.25;

        // directional offset away from mouse
        vec2 dir = normalize(vUv - uMouse + 1e-6);
        float n = noise(vUv*6.0 + t) * 0.5 + 0.5; // 0..1
        float amp = uStrength * influence * (0.6 + 0.4*n);
        vec2 offset = dir * amp * 0.06; // UV offset magnitude

        // slight ripple ring
        float ring = sin((d - t*0.8) * 24.0) * 0.002 * influence;
        offset += dir * ring;

        vec4 base = texture2D(uTexture, vUv + offset);
        vec4 col = base;
        if(uHasOverlay > 0.5){
          vec4 over = texture2D(uOverlay, vUv - offset*0.6);
          // screen-like blend
          col.rgb = 1.0 - (1.0 - base.rgb) * (1.0 - over.rgb*0.9);
          // emphasize near cursor
          col.rgb = mix(base.rgb, col.rgb, clamp(influence*0.9, 0.0, 1.0));
        }

        // subtle vignette to focus center
        float vig = smoothstep(0.95, 0.4, length(vUv - vec2(0.5)));
        col.rgb *= mix(0.85, 1.0, vig);

        gl_FragColor = vec4(col.rgb, 1.0);
      }
    `

    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
    })

    mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Mouse handling (normalized UV inside container)
    const onMove = (e) => {
      const rect = container.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      uniforms.uMouse.value.set(x, 1.0 - y)
    }
    container.addEventListener('mousemove', onMove)

    const onLeave = () => {
      uniforms.uMouse.value.set(0.5, 0.5)
    }
    container.addEventListener('mouseleave', onLeave)

    // Resize
    const onResize = () => {
      if (!renderer) return
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h, false)
      uniforms.uResolution.value.set(w, h)
    }
    window.addEventListener('resize', onResize)

    // RAF loop
    const tick = (time) => {
      if (disposed) return
      uniforms.uTime.value = time * 0.001
      renderer.render(scene, camera)
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)

    // Cleanup
    return () => {
      disposed = true
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', onResize)
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      if (mesh) {
        mesh.geometry.dispose()
        mesh.material.dispose()
        scene.remove(mesh)
      }
      if (renderer) {
        renderer.dispose()
        container.removeChild(renderer.domElement)
      }
    }
  }, [src, overlaySrc, strength, radius])

  return (
    <div className={"distorted-image " + className} ref={containerRef}>
      {(!loaded || webglFailed) && (
        <img
          src={src}
          alt="distorted placeholder"
          className={"fallback-image" + (loaded && !webglFailed ? ' hidden' : '')}
        />
      )}
    </div>
  )
}

export default DistortedImage
