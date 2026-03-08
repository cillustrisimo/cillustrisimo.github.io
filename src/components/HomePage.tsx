import Nav from './Nav'
import Hero from './Hero'
import About from './About'
import ScrollReveal from './ScrollReveal'

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <ScrollReveal>
        <About />
      </ScrollReveal>
    </>
  )
}
