
import React, { useEffect, useRef } from 'react'
import './index.scss'

// ConstellationPortrait: builds a constellation network portrait from image silhouette
const ConstellationPortrait = ({ imageSrc }) => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const rafRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = imageSrc

    img.onload = () => {
      // Size canvas
      const targetW = 400
      const scale = targetW / img.width
      const w = targetW
      const h = Math.round(img.height * scale)
      canvas.width = w
      canvas.height = h
      
      // Draw image offscreen to sample
      ctx.drawImage(img, 0, 0, w, h)
      const data = ctx.getImageData(0, 0, w, h)
      const pixels = data.data
      
      // Edge detection + silhouette sampling
      const particles = []
      const step = 6
      
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const idx = (y * w + x) * 4
          const r = pixels[idx]
          const g = pixels[idx + 1]
          const b = pixels[idx + 2]
          const a = pixels[idx + 3]
          
          if (a < 100) continue // skip transparent
          
          const brightness = (r + g + b) / 3
          
          // Edge detection - check neighbors
          let isEdge = false
          if (x < w - step && y < h - step) {
            const rightIdx = (y * w + (x + step)) * 4
            const bottomIdx = ((y + step) * w + x) * 4
            const rightB = (pixels[rightIdx] + pixels[rightIdx + 1] + pixels[rightIdx + 2]) / 3
            const bottomB = (pixels[bottomIdx] + pixels[bottomIdx + 1] + pixels[bottomIdx + 2]) / 3
            const edgeStrength = Math.abs(brightness - rightB) + Math.abs(brightness - bottomB)
            isEdge = edgeStrength > 40
          }
          
          // Include edges + darker areas (silhouette)
          if (isEdge || brightness < 130) {
            particles.push({
              x,
              y,
              originalX: x,
              originalY: y,
              vx: (Math.random() - 0.5) * 0.1,
              vy: (Math.random() - 0.5) * 0.1,
              seedX: Math.random() * Math.PI * 2,
              seedY: Math.random() * Math.PI * 2,
              r: 0.7 + Math.random() * 0.5
            })
          }
        }
      }
      
      particlesRef.current = particles
      
      // Animation loop
      const tick = () => {
        const pts = particlesRef.current
        if (!pts.length) return
        
        ctx.clearRect(0, 0, w, h)
        
        const mx = mouseRef.current.x
        const my = mouseRef.current.y
        const active = mouseRef.current.active
        const time = performance.now() * 0.0004
        
        // Update particles
        for (let p of pts) {
          if (active) {
            const dx = p.x - mx
            const dy = p.y - my
            const dist = Math.sqrt(dx * dx + dy * dy)
            const repelR = 70
            
            if (dist < repelR && dist > 0.001) {
              const force = (1 - dist / repelR) * 1.2
              p.vx += (dx / dist) * force
              p.vy += (dy / dist) * force
            }
          }
          
          // Gentle wander
          const wanderX = Math.sin(time + p.seedX) * 0.15
          const wanderY = Math.cos(time * 1.1 + p.seedY) * 0.15
          
          // Spring back to original
          const springX = (p.originalX - p.x) * 0.02
          const springY = (p.originalY - p.y) * 0.02
          
          p.vx += springX + wanderX * 0.008
          p.vy += springY + wanderY * 0.008
          
          p.vx *= 0.9
          p.vy *= 0.9
          
          p.x += p.vx + wanderX * 0.12
          p.y += p.vy + wanderY * 0.12
          
          // Draw particle
          const pulse = 0.6 + 0.4 * Math.sin(time * 2.5 + p.seedX)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(120, 180, 255, ${0.6 + pulse * 0.3})`
          ctx.fill()
        }
        
        // Draw connections
        const maxDist = 40
        const maxD2 = maxDist * maxDist
        
        for (let i = 0; i < pts.length; i++) {
          const p1 = pts[i]
          // Only check nearby for performance
          for (let j = i + 1; j < Math.min(i + 80, pts.length); j++) {
            const p2 = pts[j]
            const dx = p1.x - p2.x
            const dy = p1.y - p2.y
            const d2 = dx * dx + dy * dy
            
            if (d2 < maxD2) {
              const alpha = (1 - d2 / maxD2) * 0.35
              const pulse = 0.6 + 0.4 * Math.sin(time * 1.8 + p1.seedX + p2.seedY)
              ctx.strokeStyle = `rgba(80, 150, 255, ${alpha * pulse})`
              ctx.lineWidth = 0.6
              ctx.beginPath()
              ctx.moveTo(p1.x, p1.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          }
        }
        
        rafRef.current = requestAnimationFrame(tick)
      }
      
      tick()
    }
    
    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x = (e.clientX - rect.left) * (canvas.width / rect.width)
      mouseRef.current.y = (e.clientY - rect.top) * (canvas.height / rect.height)
      mouseRef.current.active = true
    }
    
    const handleLeave = () => {
      mouseRef.current.active = false
    }
    
    canvas.addEventListener('mousemove', handleMove)
    canvas.addEventListener('mouseleave', handleLeave)
    
    return () => {
      canvas.removeEventListener('mousemove', handleMove)
      canvas.removeEventListener('mouseleave', handleLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [imageSrc])

  return (
    <div className='constellation-portrait'>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default ConstellationPortrait
