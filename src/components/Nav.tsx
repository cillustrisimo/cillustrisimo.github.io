import { useState, useEffect, useRef, useCallback } from 'react'
import HeadNav from './HeadNav'
import './Nav.css'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('hero')
  const activeRef = useRef('hero')

  const updateActive = useCallback((id: string) => {
    if (activeRef.current !== id) {
      activeRef.current = id
      setActive(id)
    }
  }, [])

  useEffect(() => {
    // Scroll-based background
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    // IntersectionObserver for section detection
    const observers: IntersectionObserver[] = []

    // Hero: active when most of it is visible
    const heroEl = document.getElementById('hero')
    if (heroEl) {
      const heroObs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            updateActive('hero')
          }
        },
        { threshold: [0.5] }
      )
      heroObs.observe(heroEl)
      observers.push(heroObs)
    }

    // About: active when its top enters the viewport
    ;['about'].forEach((id) => {
      const el = document.getElementById(id)
      if (el) {
        const obs = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              updateActive(id)
            }
          },
          { threshold: [0], rootMargin: '-20% 0px -60% 0px' }
        )
        obs.observe(el)
        observers.push(obs)
      }
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observers.forEach((obs) => obs.disconnect())
    }
  }, [updateActive])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <HeadNav active={active} onNavigate={scrollTo} />
    </nav>
  )
}
