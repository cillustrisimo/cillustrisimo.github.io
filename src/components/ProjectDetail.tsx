import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import HudChrome from './HudChrome'
import { PROJECTS } from '../data/projects'
import './ProjectDetail.css'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = PROJECTS.find((p) => p.slug === slug)
  const projectIndex = PROJECTS.findIndex((p) => p.slug === slug)

  if (!project) return <Navigate to="/" replace />

  const prevProject = projectIndex > 0 ? PROJECTS[projectIndex - 1] : null
  const nextProject = projectIndex < PROJECTS.length - 1 ? PROJECTS[projectIndex + 1] : null

  return (
    <motion.div
      className="detail"
      style={{ '--project-color': project.color } as React.CSSProperties}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Top bar */}
      <nav className="detail__nav">
        <Link to="/#work" className="detail__back">&larr; BACK TO INDEX</Link>
        <span className="detail__nav-id">
          [{String(projectIndex + 1).padStart(2, '0')}/{String(PROJECTS.length).padStart(2, '0')}]
        </span>
      </nav>

      {/* Hero */}
      <header className="detail__hero">
        <div className="detail__hero-dither" />
        {/* Decorative orbital arcs */}
        <svg className="detail__arcs" viewBox="0 0 1400 400" preserveAspectRatio="none">
          <ellipse cx="700" cy="600" rx="600" ry="400" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
          <ellipse cx="700" cy="650" rx="500" ry="350" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
          <ellipse cx="700" cy="700" rx="400" ry="300" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.07" />
        </svg>
        <div className="detail__hero-content">
          <span className="detail__category">{project.category}</span>
          <h1 className="detail__title">{project.title}</h1>
          <p className="detail__tagline">{project.description}</p>
        </div>
      </header>

      {/* Body */}
      <div className="detail__body">
        {/* Sidebar readout */}
        <aside className="detail__sidebar">
          <HudChrome label="READOUT">
            <div className="detail__readout">
              <div className="detail__readout-row">
                <span className="detail__readout-key">YEAR</span>
                <span className="detail__readout-val">{project.year}</span>
              </div>
              <div className="detail__readout-row">
                <span className="detail__readout-key">ROLE</span>
                <span className="detail__readout-val">{project.detail.role}</span>
              </div>
              <div className="detail__readout-row">
                <span className="detail__readout-key">STACK</span>
                <span className="detail__readout-val">{project.detail.tech.join(', ')}</span>
              </div>
            </div>
          </HudChrome>
        </aside>

        {/* Main content */}
        <main className="detail__main">
          <section className="detail__section">
            <h2 className="detail__section-heading">
              <span className="detail__section-prefix">[01]</span> Overview
            </h2>
            <p className="detail__section-text">{project.detail.overview}</p>
          </section>

          <section className="detail__section">
            <h2 className="detail__section-heading">
              <span className="detail__section-prefix">[02]</span> Challenge
            </h2>
            <p className="detail__section-text">{project.detail.challenge}</p>
          </section>

          <section className="detail__section">
            <h2 className="detail__section-heading">
              <span className="detail__section-prefix">[03]</span> Solution
            </h2>
            <p className="detail__section-text">{project.detail.solution}</p>
          </section>

          {/* Placeholder for images/media */}
          <section className="detail__section">
            <HudChrome label="MEDIA">
              <div className="detail__media-placeholder">
                <span>// PROJECT MEDIA PENDING</span>
              </div>
            </HudChrome>
          </section>
        </main>
      </div>

      {/* Prev/Next navigation */}
      <footer className="detail__footer">
        <div className="detail__footer-inner">
          {prevProject ? (
            <Link to={`/project/${prevProject.slug}`} className="detail__footer-link detail__footer-link--prev">
              <span className="detail__footer-label">&larr; PREV</span>
              <span className="detail__footer-name">{prevProject.title}</span>
            </Link>
          ) : <div />}
          {nextProject ? (
            <Link to={`/project/${nextProject.slug}`} className="detail__footer-link detail__footer-link--next">
              <span className="detail__footer-label">NEXT &rarr;</span>
              <span className="detail__footer-name">{nextProject.title}</span>
            </Link>
          ) : <div />}
        </div>
      </footer>
    </motion.div>
  )
}
