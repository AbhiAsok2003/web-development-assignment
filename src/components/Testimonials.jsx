import { useEffect, useState } from "react";
import { REVIEWS } from "../data/content.js";
import SectionHeading from "./SectionHeading.jsx";
import Reveal from "./Reveal.jsx";

export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % REVIEWS.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="section section-sand testimonials" id="reviews">
      <div className="container">
        <SectionHeading eyebrow="Guest stories" title="Loved by our" accent="guests" />
        <Reveal className="reviews" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="quote-mark" aria-hidden>“</div>
          <div className="review-viewport">
            <div className="review-track" style={{ transform: `translateX(-${i * 100}%)` }}>
              {REVIEWS.map((r) => (
                <blockquote key={r.name} className="review">
                  <div className="stars" aria-label="5 out of 5 stars">★★★★★</div>
                  <p>{r.quote}</p>
                  <footer><strong>{r.name}</strong><span>{r.role}</span></footer>
                </blockquote>
              ))}
            </div>
          </div>
          <div className="dots">
            {REVIEWS.map((r, n) => <button key={r.name} className={n === i ? "on" : ""} onClick={() => setI(n)} aria-label={`Review ${n + 1}`} />)}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
