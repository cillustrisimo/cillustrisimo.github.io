import { useRef, useEffect, useCallback } from 'react'
import './AmbientGlyphField.css'

const CHARS = '.-=+*#%@:;/\\|(){}[]<>!?~^'
const CELL = 20
const BASE_OPACITY = 0.06
const MOUSE_RADIUS = 180
const MOUSE_BOOST = 0.25

export default function AmbientGlyphField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const raf = useRef(0)

  const onMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouse.current.x = e.clientX - rect.left
    mouse.current.y = e.clientY - rect.top
  }, [])

  const onMouseLeave = useCallback(() => {
    mouse.current.x = -9999
    mouse.current.y = -9999
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const parent = canvas.parentElement!

    let cols = 0
    let rows = 0
    // Each cell: charIndex, phase offset
    let cells: { ci: number; phase: number }[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      const w = parent.clientWidth
      const h = parent.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.ceil(w / CELL)
      rows = Math.ceil(h / CELL)
      cells = Array.from({ length: cols * rows }, () => ({
        ci: Math.floor(Math.random() * CHARS.length),
        phase: Math.random() * Math.PI * 2,
      }))
    }

    resize()
    window.addEventListener('resize', resize)
    parent.addEventListener('mousemove', onMouseMove)
    parent.addEventListener('mouseleave', onMouseLeave)

    const draw = (time: number) => {
      const w = parent.clientWidth
      const h = parent.clientHeight
      ctx.clearRect(0, 0, w, h)
      ctx.font = `${CELL * 0.6}px "JetBrains Mono", monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const t = time * 0.001
      const mx = mouse.current.x
      const my = mouse.current.y

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c
          const cell = cells[i]
          const x = c * CELL + CELL / 2
          const y = r * CELL + CELL / 2

          // Slowly cycle characters
          const cycle = Math.sin(t * 0.3 + cell.phase) * 0.5 + 0.5
          if (cycle > 0.98) {
            cell.ci = (cell.ci + 1) % CHARS.length
          }

          // Mouse proximity
          const dx = x - mx
          const dy = y - my
          const dist = Math.sqrt(dx * dx + dy * dy)
          const mouseFactor = dist < MOUSE_RADIUS
            ? (1 - dist / MOUSE_RADIUS) * MOUSE_BOOST
            : 0

          // Subtle wave
          const wave = Math.sin(t * 0.15 + c * 0.08 + r * 0.06) * 0.02

          const opacity = BASE_OPACITY + wave + mouseFactor

          // Color: dim cyan base, brighter near mouse
          const brightness = Math.min(255, 80 + mouseFactor * 400)
          ctx.fillStyle = `rgba(0, ${brightness}, ${brightness}, ${opacity})`
          ctx.fillText(CHARS[cell.ci], x, y)
        }
      }

      raf.current = requestAnimationFrame(draw)
    }

    raf.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      parent.removeEventListener('mousemove', onMouseMove)
      parent.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [onMouseMove, onMouseLeave])

  return <canvas ref={canvasRef} className="glyph-field" />
}
