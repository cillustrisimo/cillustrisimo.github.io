import { Link } from 'react-router-dom'
import HudChrome from './HudChrome'
import { PROJECTS } from '../data/projects'
import './Projects.css'

export default function Projects() {
  return (
    <section className="projects" id="work">
      <div className="projects__inner">
        <div className="projects__header">
          <h2 className="projects__heading">Selected Work</h2>
          <span className="projects__count">
            [{String(PROJECTS.length).padStart(2, '0')} ENTRIES]
          </span>
        </div>

        <div className="projects__grid">
          {PROJECTS.map((project, i) => (
            <Link
              to={`/project/${project.slug}`}
              key={project.id}
              className="projects__card"
              style={{ '--card-color': project.color } as React.CSSProperties}
            >
              <HudChrome label={project.category}>
                <div className="projects__card-inner">
                  <div className="projects__card-index">
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="projects__card-dither" />
                  <h3 className="projects__card-title">{project.title}</h3>
                  <p className="projects__card-desc">{project.description}</p>
                  <div className="projects__card-meta">
                    <span>{project.year}</span>
                    <span className="projects__card-status">VIEW PROJECT &rarr;</span>
                  </div>
                </div>
              </HudChrome>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
