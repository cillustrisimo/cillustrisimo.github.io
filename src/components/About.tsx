import './About.css'

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about__grid">
        <div className="about__heading-col">
          <h2 className="about__heading">About</h2>
        </div>

        <div className="about__text-col">
          <p className="about__text">
            My name is Carl Illustrisimo, I am a second year masters student at
            the UC Berkeley School of Information. At Berkeley, I am a Consulting
            Fellow for the D-Lab, and work with Dr. Diag Davenport in the
            Responsibility Lab.
          </p>
          <p className="about__text">
            My interests broadly fall under using and developing 1) machine
            learning to study human behavior, culture, and sociality; and 2)
            studying the social effects of algorithms (ML, AI, etc.), with a
            focus on algorithmic fairness.
          </p>
          <p className="about__text">
            If you're excited about these topics as well, please feel free to
            contact me.
          </p>
        </div>
      </div>
    </section>
  )
}
