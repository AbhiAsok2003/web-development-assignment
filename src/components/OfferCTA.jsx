import { IMAGES } from "../data/content.js";
import Reveal from "./Reveal.jsx";

export default function OfferCTA() {
  return (
    <section className="offer" id="offer">
      <div className="offer-bg" style={{ backgroundImage: `url(${IMAGES.pool})` }} />
      <div className="container offer-inner">
        <Reveal className="offer-card">
          <span className="offer-ribbon">Limited-time offer</span>
          <h2>Stay 3 nights, <em>pay for 2</em></h2>
          <p>Enjoy a complimentary spa session and daily breakfast with every early-booking stay.</p>
          <a href="#contact" className="btn btn-gold">Claim This Offer</a>
        </Reveal>
      </div>
    </section>
  );
}
