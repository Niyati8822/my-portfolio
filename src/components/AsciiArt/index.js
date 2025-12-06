import React, { useEffect, useState, useRef } from 'react'
import './index.scss'

const AsciiArt = ({ imageSrc, width = 100 }) => {
  const [asciiArt, setAsciiArt] = useState('')
  const canvasRef = useRef(null)

  useEffect(() => {
    const convertToAscii = () => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      
      img.onload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        
        // Calculate dimensions maintaining aspect ratio
        const aspectRatio = img.height / img.width
        const height = Math.floor(width * aspectRatio * 0.5) // 0.5 for char height/width ratio
        
        canvas.width = width
        canvas.height = height
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height)
        
        // Get pixel data
        const imageData = ctx.getImageData(0, 0, width, height)
        const pixels = imageData.data
        
        // ASCII characters from darkest to lightest (denser characters for better coverage)
        const asciiChars = '█▓▒░@#%*+=-:. '
        
        let ascii = ''
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const offset = (y * width + x) * 4
            const r = pixels[offset]
            const g = pixels[offset + 1]
            const b = pixels[offset + 2]
            
            // Get alpha channel for transparency
            const alpha = pixels[offset + 3]
            
            // Calculate brightness (0-255)
            const brightness = (r + g + b) / 3
            
            // If pixel is very dark or transparent, use space (show background)
            if (alpha < 128 || brightness < 10) {
              ascii += ' '
            } else if (brightness > 240) {
              // Very bright pixels (white) also become spaces
              ascii += ' '
            } else {
              // For colored/mid-tone pixels, map to ASCII characters
              // Invert so darker parts of image become denser characters
              const invertedBrightness = 255 - brightness
              const charIndex = Math.floor((invertedBrightness / 255) * (asciiChars.length - 1))
              ascii += asciiChars[charIndex]
            }
          }
          ascii += '\n'
        }
        
        setAsciiArt(ascii)
      }
      
      img.src = imageSrc
    }
    
    convertToAscii()
  }, [imageSrc, width])

  return (
    <div className="ascii-art-container">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <pre className="ascii-art">{asciiArt}</pre>
    </div>
  )
}

export default AsciiArt
