import { ReactNode } from 'react'
import './HudChrome.css'

interface HudChromeProps {
  children: ReactNode
  label?: string
  className?: string
}

/**
 * A container with Marathon-style HUD border decoration.
 * Corner brackets, optional top-left label, scanline-textured border.
 */
export default function HudChrome({ children, label, className = '' }: HudChromeProps) {
  return (
    <div className={`hud ${className}`}>
      <div className="hud__corner hud__corner--tl" />
      <div className="hud__corner hud__corner--tr" />
      <div className="hud__corner hud__corner--bl" />
      <div className="hud__corner hud__corner--br" />
      {label && <span className="hud__label">{label}</span>}
      <div className="hud__content">
        {children}
      </div>
    </div>
  )
}
