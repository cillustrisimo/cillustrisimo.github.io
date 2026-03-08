import { ReactNode, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** Delay before the "LOADING MEMORY" text fades and content appears */
  delay?: number
}

/**
 * Wraps a section in a scroll-triggered entrance animation.
 * Shows a brief "LOADING MEMORY" flash, then reveals content
 * with a staggered upward fade.
 */
export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' })

  return (
    <div ref={ref} className={className} style={{ position: 'relative' }}>
      {/* Loading memory overlay */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={isInView ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.4, delay: delay + 0.6 }}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          pointerEvents: 'none',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          color: 'var(--accent-cyan)',
          textTransform: 'uppercase',
        }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: [0, 1, 1, 0] } : { opacity: 0 }}
          transition={{ duration: 0.8, delay, times: [0, 0.1, 0.7, 1] }}
        >
          LOADING MEMORY...
        </motion.span>
      </motion.div>

      {/* Actual content with staggered reveal */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.8, delay: delay + 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {children}
      </motion.div>
    </div>
  )
}
