import HudChrome from './HudChrome'
import './Contact.css'

export default function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <div className="contact__left">
          <h2 className="contact__heading">Open<br />Channel</h2>
          <span className="contact__sub">// TRANSMIT_SIGNAL</span>
        </div>

        <div className="contact__right">
          <HudChrome label="COMM_LINK">
            <div className="contact__terminal">
              <div className="contact__line">
                <span className="contact__prompt">&gt;</span>
                <span className="contact__text">Ready to receive transmissions.</span>
              </div>
              <div className="contact__line">
                <span className="contact__prompt">&gt;</span>
                <span className="contact__text">For inquiries, collaborations, or to say hello:</span>
              </div>

              <div className="contact__links">
                <a href="mailto:hello@example.com" className="contact__link">
                  <span className="contact__link-label">[EMAIL]</span>
                  <span className="contact__link-value">hello@example.com</span>
                </a>
                <a href="#" className="contact__link">
                  <span className="contact__link-label">[GITHUB]</span>
                  <span className="contact__link-value">github.com/username</span>
                </a>
                <a href="#" className="contact__link">
                  <span className="contact__link-label">[LINKEDIN]</span>
                  <span className="contact__link-value">linkedin.com/in/username</span>
                </a>
                <a href="#" className="contact__link">
                  <span className="contact__link-label">[TWITTER]</span>
                  <span className="contact__link-value">@username</span>
                </a>
              </div>

              <div className="contact__line contact__line--dim">
                <span className="contact__prompt">&gt;</span>
                <span className="contact__text">SIGNAL STRENGTH: NOMINAL</span>
              </div>
            </div>
          </HudChrome>

          <div className="contact__coords">
            <span>LAT 34.0522 N</span>
            <span>LON 118.2437 W</span>
            <span>SOL 3</span>
          </div>
        </div>
      </div>

      <footer className="contact__footer">
        <span className="contact__footer-text">MARATHON PORTFOLIO</span>
        <span className="contact__footer-text">// BUILT WITH CARE</span>
      </footer>
    </section>
  )
}
