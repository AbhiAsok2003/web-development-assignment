import { IMAGES } from "../data/content.js";
import Reveal from "./Reveal.jsx";

export default function FinalCTA() {
  return (
    <section className="final-cta" style={{ backgroundImage: `url(${IMAGES.forest})` }}>
      <div className="final-shade" />
      <Reveal className="container final-inner">
        <span className="eyebrow">Your escape awaits</span>
        <h2>Your slice of <em>paradise</em> is waiting</h2>
        <p>Book direct for the best rates, free airport pick-up and a welcome drink on arrival.</p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-gold">Book Direct</a>
          <a href="tel:+910000000000" className="btn btn-ghost">Call Us</a>
        </div>
      </Reveal>
    </section>
  );
}
