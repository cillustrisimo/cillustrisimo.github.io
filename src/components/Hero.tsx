import { Canvas } from '@react-three/fiber'
import GlyphDitherScene from './GlyphDither/GlyphDitherScene'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero__canvas">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          dpr={[1, 2]}
          gl={{ antialias: false, alpha: true }}
        >
          <GlyphDitherScene />
        </Canvas>
      </div>

      <div className="hero__content">
        <h1 className="hero__title">
          Carl<br />Illustrisimo
        </h1>
        <div className="hero__content-right">
          <span className="hero__email">carl [dot] illustrisimo [at] berkeley [dot] edu</span>
        </div>
      </div>
    </section>
  )
}
