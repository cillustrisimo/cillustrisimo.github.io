import './HeadNav.css'

interface HeadNavProps {
  active: string
  onNavigate: (id: string) => void
}

const VB_W = 211
const VB_H = 122

const SECTIONS = [
  {
    id: 'hero',
    label: 'HOME',
    box: { x: 36.5, y: 34.5, w: 12, h: 8 },
    lines: [
      { x1: 48, y1: 37.5, x2: 128, y2: 37.5 },
      { x1: 127.316, y1: 37.6128, x2: 145.392, y2: 52.387 },
    ],
    text: { x: 153, y: 58 },
    zone: { x: 30, y: 25, w: 175, h: 28 },
  },
  {
    id: 'about',
    label: 'ABOUT',
    box: { x: 18.5, y: 74.5, w: 12, h: 8 },
    lines: [
      { x1: 30.006, y1: 78.5, x2: 126.006, y2: 79.5 },
      { x1: 125.316, y1: 79.6128, x2: 143.392, y2: 94.387 },
    ],
    text: { x: 153, y: 100 },
    zone: { x: 12, y: 72, w: 193, h: 30 },
  },
]

export default function HeadNav({ active, onNavigate }: HeadNavProps) {
  return (
    <div className="head-nav">
      <div className="head-nav__img-wrap">
        <img
          src="/head_nav.svg"
          alt=""
          className="head-nav__base"
          draggable={false}
        />
        <div className="head-nav__scanlines" />
      </div>
      <svg
        className="head-nav__overlay"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {SECTIONS.map((s) => {
          const isActive = active === s.id
          return (
            <g
              key={s.id}
              className={`head-nav__section ${isActive ? 'head-nav__section--active' : ''}`}
              onClick={() => onNavigate(s.id)}
              style={{ cursor: 'pointer' }}
              pointerEvents="all"
            >
              {/* Invisible click zone */}
              <rect
                x={s.zone.x}
                y={s.zone.y}
                width={s.zone.w}
                height={s.zone.h}
                fill="transparent"
                pointerEvents="all"
              />

              {/* Connecting lines */}
              {s.lines.map((l, i) => (
                <line
                  key={i}
                  className="head-nav__line"
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="white"
                  strokeWidth="1.5"
                />
              ))}

              {/* Box marker — stroke always visible */}
              <rect
                className="head-nav__box-stroke"
                x={s.box.x}
                y={s.box.y}
                width={s.box.w}
                height={s.box.h}
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />

              {/* Box fill — only visible when active, blinks */}
              <rect
                className="head-nav__box-fill"
                x={s.box.x}
                y={s.box.y}
                width={s.box.w}
                height={s.box.h}
                stroke="none"
                fill="white"
              />

              {/* Label */}
              <text
                className="head-nav__label"
                x={s.text.x}
                y={s.text.y}
                fill="white"
              >
                {s.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
