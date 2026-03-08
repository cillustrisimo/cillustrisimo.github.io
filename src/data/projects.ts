export interface Project {
  id: string
  slug: string
  title: string
  category: string
  year: string
  description: string
  color: string
  detail: {
    role: string
    tech: string[]
    overview: string
    challenge: string
    solution: string
  }
}

export const PROJECTS: Project[] = [
  {
    id: 'proj-01',
    slug: 'orbital-dynamics',
    title: 'Orbital Dynamics',
    category: 'INTERACTIVE',
    year: '2025',
    description: 'Real-time WebGL simulation of gravitational n-body systems with generative soundtrack.',
    color: 'var(--accent-blue)',
    detail: {
      role: 'Creative Developer',
      tech: ['Three.js', 'WebGL', 'GLSL', 'Web Audio API', 'React'],
      overview: 'A browser-based gravitational simulation where users spawn celestial bodies and watch emergent orbital patterns unfold. Each body\'s mass and velocity generate unique audio frequencies, creating a generative soundtrack that mirrors the visual choreography.',
      challenge: 'Achieving smooth real-time physics for 500+ bodies while maintaining 60fps and synchronizing audio synthesis with the visual simulation without perceptible latency.',
      solution: 'Implemented Barnes-Hut approximation on GPU via compute-like fragment shaders, with double-buffered position/velocity textures. Audio scheduling uses a lookahead buffer synced to the render loop.',
    },
  },
  {
    id: 'proj-02',
    slug: 'signal-noise',
    title: 'Signal/Noise',
    category: 'DATA VIZ',
    year: '2025',
    description: 'Interactive data visualization exploring urban noise pollution across 50 cities.',
    color: 'var(--accent-green)',
    detail: {
      role: 'Design Engineer',
      tech: ['D3.js', 'React', 'TypeScript', 'MapboxGL', 'Node.js'],
      overview: 'An explorable data story mapping noise pollution levels across 50 global cities, using real sensor data. Users can compare cities, explore temporal patterns, and hear synthesized audio representations of each environment.',
      challenge: 'Rendering millions of data points across geographic and temporal dimensions while keeping the interface intuitive for non-technical audiences.',
      solution: 'Built a custom tile-based aggregation pipeline that pre-computes multiple zoom levels. Used progressive disclosure — overview first, then drill-down — to manage complexity without overwhelming.',
    },
  },
  {
    id: 'proj-03',
    slug: 'phantom-liminal',
    title: 'Phantom Liminal',
    category: 'BRAND',
    year: '2024',
    description: 'Identity and digital experience for an experimental audio label.',
    color: 'var(--accent-magenta)',
    detail: {
      role: 'Brand & Web Developer',
      tech: ['Figma', 'React', 'Framer Motion', 'Three.js', 'Sanity CMS'],
      overview: 'Complete brand identity and web presence for an experimental audio label specializing in ambient and field recording releases. The site features a reactive visual system that responds to audio playback in real-time.',
      challenge: 'Creating a visual identity system flexible enough to represent diverse musical genres while maintaining a cohesive brand presence across physical and digital touchpoints.',
      solution: 'Designed a generative identity system using a base geometric vocabulary that morphs based on audio analysis parameters. The logo, typography, and color all respond to frequency data.',
    },
  },
  {
    id: 'proj-04',
    slug: 'terraform-ui',
    title: 'Terraform UI',
    category: 'PRODUCT',
    year: '2024',
    description: 'Design system and component library for a climate-tech monitoring platform.',
    color: 'var(--accent-cyan)',
    detail: {
      role: 'Design Systems Lead',
      tech: ['React', 'TypeScript', 'Storybook', 'Figma', 'Radix UI'],
      overview: 'A comprehensive design system powering a climate monitoring dashboard used by environmental researchers. Includes 60+ components, real-time data visualization primitives, and accessibility-first patterns.',
      challenge: 'Building components that handle real-time streaming data gracefully — charts that update every second, status indicators that reflect live sensor state, and tables that handle 10k+ rows.',
      solution: 'Architected a virtualized rendering layer with optimistic updates. Used Web Workers for data transformation and requestAnimationFrame-batched DOM updates to keep the main thread free.',
    },
  },
  {
    id: 'proj-05',
    slug: 'deep-field',
    title: 'Deep Field',
    category: 'EXPERIMENT',
    year: '2024',
    description: 'Generative art series using JWST imagery as seed data for particle simulations.',
    color: 'var(--accent-yellow)',
    detail: {
      role: 'Creative Coder',
      tech: ['GLSL', 'Three.js', 'Python', 'FITS Processing', 'Canvas API'],
      overview: 'A generative art project that ingests raw JWST telescope imagery, extracts luminosity and spectral data, and uses it as initial conditions for GPU-accelerated particle simulations. Each piece is a unique evolution from astronomical source data.',
      challenge: 'Processing raw FITS astronomical data files (multi-gigabyte, multi-spectral) and translating scientific measurements into aesthetically meaningful simulation parameters.',
      solution: 'Built a Python preprocessing pipeline that extracts and normalizes spectral bands, then encodes them as floating-point textures consumed by WebGL shaders as force fields and color maps.',
    },
  },
  {
    id: 'proj-06',
    slug: 'meridian',
    title: 'Meridian',
    category: 'WEB',
    year: '2023',
    description: 'Portfolio and editorial platform for an architecture studio. Scroll-driven 3D navigation.',
    color: 'var(--accent-red)',
    detail: {
      role: 'Fullstack Developer',
      tech: ['Next.js', 'Three.js', 'GSAP', 'Prismic CMS', 'Vercel'],
      overview: 'A portfolio website for an architecture firm where projects are navigated through a 3D spatial interface. Scrolling moves through a virtual gallery space, with each project occupying its own architectural volume.',
      challenge: 'Syncing smooth scroll-driven camera movement through 3D space with content loading, while maintaining performance on mid-range devices and ensuring the site remains accessible.',
      solution: 'Used GSAP ScrollTrigger pinned to a virtual scroll container, driving Three.js camera paths. Implemented aggressive LOD and texture streaming with intersection-observer-based preloading.',
    },
  },
]
