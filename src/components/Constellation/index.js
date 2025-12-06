import React, { useEffect, useRef } from 'react'
import './index.scss'

// Clean enhanced constellation implementation.
const Constellation = ({
  layers = [
    { count: 70, maxDist: 160, size: [0.6, 1.0], parallax: 1.0, lines: true },
    { count: 120, maxDist: 90, size: [0.4, 0.8], parallax: 0.6, lines: true },
    { count: 160, maxDist: 0, size: [0.25, 0.5], parallax: 0.35, lines: false },
  ],
  repelRadius = 120,
  repelStrength = 1.6,
  extendedFactor = 1.4,
  fpsCap = 60,
  shootingStarInterval = [8000, 14000],
}) => {
  const canvasRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const layersRef = useRef([])
  const rafRef = useRef(null)
  const lastFrameRef = useRef(performance.now())
  const shootingStarRef = useRef(null)
  const starTimerRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(1,0,0,1,0,0) // reset then scale
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const initParticles = () => {
      layersRef.current = layers.map(layer => {
        const [minS, maxS] = layer.size
        return Array.from({ length: layer.count }).map(() => {
          const baseVx = (Math.random() - 0.5) * 0.12 * layer.parallax
          const baseVy = (Math.random() - 0.5) * 0.12 * layer.parallax
          return {
            x: Math.random() * window.innerWidth * extendedFactor,
            y: Math.random() * window.innerHeight * extendedFactor,
            vx: baseVx,
            vy: baseVy,
            baseVx,
            baseVy,
            seedX: Math.random() * Math.PI * 2,
            seedY: Math.random() * Math.PI * 2,
            r: minS + Math.random() * (maxS - minS)
          }
        })
      })
    }
    initParticles()

    const scheduleStar = () => {
      const delay = shootingStarInterval[0] + Math.random() * (shootingStarInterval[1] - shootingStarInterval[0])
      starTimerRef.current = setTimeout(() => {
        const w = window.innerWidth, h = window.innerHeight
        const side = Math.random() < 0.5 ? 'left' : 'top'
        const startX = side === 'left' ? -40 : Math.random() * w
        const startY = side === 'top' ? -40 : Math.random() * h
        const targetX = w + 260
        const targetY = h + 260
        shootingStarRef.current = {
          x: startX,
          y: startY,
          vx: (targetX - startX) / 1400,
            vy: (targetY - startY) / 1400,
          life: 0,
          maxLife: 1400
        }
        scheduleStar()
      }, delay)
    }
    scheduleStar()

    const tick = () => {
      const now = performance.now()
      const frameDelta = now - lastFrameRef.current
      const minFrame = 1000 / fpsCap
      if (frameDelta < minFrame) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      lastFrameRef.current = now

      ctx.clearRect(0,0,window.innerWidth,window.innerHeight)
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mouseRef.current.active
      const time = now * 0.00035

      // Update & draw particles per layer
      layersRef.current.forEach((arr, layerIndex) => {
        const cfg = layers[layerIndex]
        const parallax = cfg.parallax
        const wrapW = window.innerWidth * extendedFactor
        const wrapH = window.innerHeight * extendedFactor
        for (let p of arr) {
          if (mouseActive) {
            const dx = p.x - mx
            const dy = p.y - my
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < repelRadius && dist > 0.0001) {
              const t = 1 - dist / repelRadius
              const f = (t * t) * repelStrength * 0.65
              p.vx += (dx / dist) * f
              p.vy += (dy / dist) * f
            }
          }
          const wanderX = Math.sin(time + p.seedX) * 0.5 * parallax
          const wanderY = Math.cos(time * 1.12 + p.seedY) * 0.5 * parallax
          p.vx += (p.baseVx - p.vx) * 0.02 + wanderX * 0.015
          p.vy += (p.baseVy - p.vy) * 0.02 + wanderY * 0.015
          p.vx *= 0.973
          p.vy *= 0.973
          p.x += p.vx + wanderX * 0.32
          p.y += p.vy + wanderY * 0.32
          if (p.x < -50) p.x = wrapW + 50; else if (p.x > wrapW + 50) p.x = -50
          if (p.y < -50) p.y = wrapH + 50; else if (p.y > wrapH + 50) p.y = -50
          const pulse = 0.5 + 0.5 * Math.sin(time * (2.0 - 0.6 * parallax) + p.seedX)
          const alpha = 0.28 + 0.22 * pulse
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${alpha})`
          ctx.fill()
        }
      })

      // Lines using spatial hashing
      layersRef.current.forEach((arr, layerIndex) => {
        const cfg = layers[layerIndex]
        if (!cfg.lines) return
        const cellSize = cfg.maxDist
        const grid = new Map()
        arr.forEach(p => {
          const gx = Math.floor(p.x / cellSize)
          const gy = Math.floor(p.y / cellSize)
          const key = gx + ',' + gy
          if (!grid.has(key)) grid.set(key, [])
          grid.get(key).push(p)
        })
        const maxD2 = cfg.maxDist * cfg.maxDist
        grid.forEach((bucket, key) => {
          const [gx, gy] = key.split(',').map(Number)
          for (let p1 of bucket) {
            for (let ny = -1; ny <= 1; ny++) {
              for (let nx = -1; nx <= 1; nx++) {
                const nKey = (gx + nx) + ',' + (gy + ny)
                const nb = grid.get(nKey)
                if (!nb) continue
                for (let p2 of nb) {
                  if (p1 === p2) continue
                  const dx = p1.x - p2.x
                  const dy = p1.y - p2.y
                  const d2 = dx * dx + dy * dy
                  if (d2 < maxD2) {
                    const baseAlpha = 1 - d2 / maxD2
                    const pulse = 0.5 + 0.5 * Math.sin(time * (1.1 + 0.3 * cfg.parallax) + p1.seedX + p2.seedY)
                    const alpha = baseAlpha * 0.32 * (0.55 + 0.45 * pulse)
                    ctx.strokeStyle = `rgba(255,255,255,${alpha})`
                    ctx.lineWidth = 0.5 * cfg.parallax
                    ctx.beginPath()
                    ctx.moveTo(p1.x, p1.y)
                    ctx.lineTo(p2.x, p2.y)
                    ctx.stroke()
                  }
                }
              }
            }
          }
        })
      })

      if (mouseActive) {
        ctx.beginPath()
        ctx.arc(mx, my, 2, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        ctx.fill()
      }

      if (shootingStarRef.current) {
        const star = shootingStarRef.current
        star.life += frameDelta
        star.x += star.vx * frameDelta
        star.y += star.vy * frameDelta
        const prog = star.life / star.maxLife
        const alpha = prog < 0.8 ? 0.8 * (1 - prog) : 0
        ctx.beginPath()
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`
        ctx.lineWidth = 2
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - star.vx * 60, star.y - star.vy * 60)
        ctx.stroke()
        if (prog >= 1 || alpha <= 0) shootingStarRef.current = null
      }

      rafRef.current = requestAnimationFrame(tick)
    }
    tick()

    const handleMove = (e) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }
    const handleLeave = () => { mouseRef.current.active = false }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseout', handleLeave)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseout', handleLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (starTimerRef.current) clearTimeout(starTimerRef.current)
    }
  }, [layers, repelRadius, repelStrength, extendedFactor, fpsCap, shootingStarInterval])

  return <canvas ref={canvasRef} className='constellation-canvas' />
}

export default Constellation
