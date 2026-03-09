import { useState } from 'react'
import './Work.css'

const FILTERS = ['ALL', 'RESEARCH', 'PROJECTS', 'ARTICLES'] as const
type Filter = (typeof FILTERS)[number]

interface WorkEntry {
  title: string
  source: string
  year: string
  category: Filter
}

const ENTRIES: WorkEntry[] = [
  {
    title: 'Placeholder — adding work later',
    source: 'Research filler',
    year: '2025',
    category: 'RESEARCH',
  },
  {
    title: 'Placeholder — adding work later',
    source: 'Research filler',
    year: '2025',
    category: 'RESEARCH',
  },
  {
    title: 'Placeholder — adding work later',
    source: 'Project filler',
    year: '2024',
    category: 'PROJECTS',
  },
  {
    title: 'Placeholder — adding work later',
    source: 'Article filler',
    year: '2024',
    category: 'ARTICLES',
  },
  {
    title: 'Placeholder — adding work later',
    source: 'Project filler',
    year: '2024',
    category: 'PROJECTS',
  },
  {
    title: 'Placeholder — adding work later',
    source: 'Article filler',
    year: '2024',
    category: 'ARTICLES',
  },
]

export default function Work() {
  const [filter, setFilter] = useState<Filter>('ALL')

  const visible = filter === 'ALL'
    ? ENTRIES
    : ENTRIES.filter((e) => e.category === filter)

  return (
    <section className="work" id="work">
      <div className="work__grid">
        <div className="work__heading-col">
          <h2 className="work__heading">Work</h2>
          <div className="work__filters">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`work__filter ${filter === f ? 'work__filter--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                [{f}]
              </button>
            ))}
          </div>
        </div>


        <div className="work__list">
          {visible.map((entry, i) => (
            <div key={i} className="work__entry">
              <div className="work__entry-main">
                <span className="work__entry-title">{entry.title}</span>
                <span className="work__entry-source">{entry.source}</span>
              </div>
              <div className="work__entry-meta">
                <span className="work__entry-tag">{entry.category}</span>
                <span className="work__entry-year">{entry.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
