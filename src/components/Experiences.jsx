import { useCallback, useEffect, useRef, useState } from "react";
import { EXPERIENCES } from "../data/content.js";
import { scrollToTarget } from "../lib/smooth.js";
import SectionHeading from "./SectionHeading.jsx";
import Reveal from "./Reveal.jsx";

export default function Experiences({ onPlan }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(null); // index of the experience shown in the popup
  const cardRef = useRef(null);
  const total = EXPERIENCES.length;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((i) => (i + d + total) % total), [total]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden"; // also pauses Lenis
    cardRef.current?.focus({ preventScroll: true }); // focus the dialog (not ×) so no ring shows on open
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, close, step]);

  const plan = (x) => {
    onPlan?.({ message: `Hello! I'd like to know more about the ${x.title} experience and add it to my stay.` });
    close();
    setTimeout(() => scrollToTarget("#contact"), 60);
  };

  const x = open !== null ? EXPERIENCES[open] : null;

  return (
    <section className="section section-dark experiences" id="experiences">
      <div className="container">
        <SectionHeading light eyebrow="Amenities & activities" title="Experiences that" accent="linger" text="From sunrise yoga to candle-lit dinners on the sand, every moment is designed to restore and delight." />
        <Reveal className="panels">
          {EXPERIENCES.map((e, i) => (
            <article
              key={e.id}
              data-cursor="Explore"
              className={`panel ${active === i ? "active" : ""}`}
              style={{ backgroundImage: `url(${e.img})` }}
              onPointerMove={(ev) => ev.pointerType === "mouse" && active !== i && setActive(i)}
              onClick={() => (active === i ? setOpen(i) : setActive(i))}
              onFocus={() => setActive(i)}
              onKeyDown={(ev) => ev.key === "Enter" && setOpen(i)}
              tabIndex={0}
              role="button"
              aria-label={`${e.title}, view details`}
            >
              <div className="panel-shade" />
              <span className="panel-num">0{i + 1}</span>
              <div className="panel-body">
                <span className="panel-tag">{e.tag}</span>
                <h3>{e.title}</h3>
                <p>{e.text}</p>
                <button type="button" className="panel-link" tabIndex={-1} onClick={(ev) => { ev.stopPropagation(); setOpen(i); }}>Explore <span aria-hidden="true">→</span></button>
              </div>
            </article>
          ))}
        </Reveal>
      </div>

      {x && (
        <div className="xmodal" role="dialog" aria-modal="true" aria-label={x.title} onClick={(ev) => ev.target === ev.currentTarget && close()}>
          <div className="xm-card" key={x.id} ref={cardRef} tabIndex={-1}>
            <div className="xm-img" style={{ backgroundImage: `url(${x.img})` }} />
            <div className="xm-body" data-lenis-prevent>
              <span className="xm-tag">{x.tag} · 0{open + 1} / 0{total}</span>
              <h3>{x.title}</h3>
              <p>{x.text}</p>
              <ul className="xm-list">{x.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
              <div className="xm-meta"><span>◷ {x.duration}</span><span>{x.when}</span></div>
              <div className="xm-actions">
                <button type="button" className="btn btn-gold" onClick={() => plan(x)}>Plan this experience</button>
                <button type="button" className="xm-step" onClick={() => step(-1)} aria-label="Previous experience">‹</button>
                <button type="button" className="xm-step" onClick={() => step(1)} aria-label="Next experience">›</button>
              </div>
            </div>
            <button type="button" className="lb-btn xm-close" onClick={close} aria-label="Close">×</button>
          </div>
        </div>
      )}
    </section>
  );
}
