import { useState, useEffect } from 'react'
import HeadNav from './HeadNav'
import './Nav.css'

export default function Nav() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const sectionIds = ['hero', 'about', 'work']

    const onScroll = () => {
      const viewLine = window.innerHeight * 0.4
      let current = 'hero'

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (el.getBoundingClientRect().top <= viewLine) {
          current = id
        }
      }
      setActive(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="nav">
      <HeadNav active={active} onNavigate={scrollTo} />
    </nav>
  )
}
