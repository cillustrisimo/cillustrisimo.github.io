import { useRef, useEffect } from 'react'

const CHARS = ' .:-=+*#%@'
const CELL = 5
const BASE_ALPHA = 0.75

export default function GlyphHead() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const parent = canvas.parentElement!

    const img = new Image()
    img.src = '/head_nav.svg'

    let cols = 0
    let rows = 0
    let cells: { ci: number; phase: number; brightness: number }[] = []

    const setup = () => {
      const w = parent.clientWidth
      const h = parent.clientHeight
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Render head SVG to offscreen canvas to sample pixels
      const src = document.createElement('canvas')
      src.width = w
      src.height = h
      const sctx = src.getContext('2d')!
      sctx.drawImage(img, 0, 0, w, h)
      const pixels = sctx.getImageData(0, 0, w, h).data

      cols = Math.ceil(w / CELL)
      rows = Math.ceil(h / CELL)
      cells = []

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          // Sample max brightness in cell region
          let maxLum = 0
          for (let sy = 0; sy < CELL; sy++) {
            for (let sx = 0; sx < CELL; sx++) {
              const px = col * CELL + sx
              const py = row * CELL + sy
              if (px < w && py < h) {
                const idx = (py * w + px) * 4
                const red = pixels[idx]
                const grn = pixels[idx + 1]
                const blu = pixels[idx + 2]
                const alp = pixels[idx + 3]
                const lum = ((red + grn + blu) / 3) * (alp / 255)
                if (lum > maxLum) maxLum = lum
              }
            }
          }

          const brightness = maxLum / 255
          const ci = brightness > 0.08
            ? Math.min(CHARS.length - 1, Math.floor(brightness * (CHARS.length - 1)) + 1)
            : 0

          cells.push({
            ci,
            phase: Math.random() * Math.PI * 2,
            brightness,
          })
        }
      }
    }

    img.onload = () => {
      setup()
      window.addEventListener('resize', setup)

      const draw = (time: number) => {
        const w = parent.clientWidth
        const h = parent.clientHeight
        ctx.clearRect(0, 0, w, h)
        ctx.font = `${CELL * 0.85}px "JetBrains Mono", monospace`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'

        const t = time * 0.001

        for (let row = 0; row < rows; row++) {
          for (let col = 0; col < cols; col++) {
            const i = row * cols + col
            const cell = cells[i]
            if (cell.brightness < 0.08) continue

            const x = col * CELL + CELL / 2
            const y = row * CELL + CELL / 2

            // Subtle character cycling
            const cycle = Math.sin(t * 0.4 + cell.phase)
            if (cycle > 0.95) {
              const base = Math.floor(cell.brightness * (CHARS.length - 1)) + 1
              const jitter = Math.floor(Math.random() * 3) - 1
              cell.ci = Math.max(1, Math.min(CHARS.length - 1, base + jitter))
            }

            const opacity = cell.brightness * BASE_ALPHA
            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.fillText(CHARS[cell.ci], x, y)
          }
        }

        rafRef.current = requestAnimationFrame(draw)
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', setup)
    }
  }, [])

  return <canvas ref={canvasRef} className="head-nav__glyph" />
}
