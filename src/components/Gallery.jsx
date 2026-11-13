import { useCallback, useEffect, useState } from "react";
import { GALLERY } from "../data/content.js";
import SectionHeading from "./SectionHeading.jsx";
import Reveal from "./Reveal.jsx";

const CATS = ["All", ...new Set(GALLERY.map((g) => g.cat))];

export default function Gallery() {
  const [cat, setCat] = useState("All");
  const [idx, setIdx] = useState(null);
  const items = GALLERY.filter((g) => cat === "All" || g.cat === cat);

  const close = useCallback(() => setIdx(null), []);
  const step = useCallback((d) => setIdx((i) => (i + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [idx, close, step]);

  return (
    <section className="section gallery" id="gallery">
      <div className="container">
        <SectionHeading eyebrow="Gallery" title="Moments at" accent="Serenara" text="A glimpse of the light, textures and quiet corners that guests remember long after they leave." />
        <Reveal className="filters" role="tablist">
          {CATS.map((c) => (
            <button key={c} role="tab" aria-selected={cat === c} className={cat === c ? "on" : ""} onClick={() => setCat(c)}>{c}</button>
          ))}
        </Reveal>
        <div className="gallery-grid" key={cat}>
          {items.map((g, i) => (
            <figure key={g.src} data-cursor="View" className={`g-item ${g.size}`} style={{ animationDelay: `${i * 70}ms` }} onClick={() => setIdx(i)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setIdx(i)}>
              <img src={g.src} alt={g.alt} loading="lazy" />
              <figcaption><span>{g.cat}</span>{g.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      {idx !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer" onClick={(e) => e.target === e.currentTarget && close()}>
          <button className="lb-btn lb-close" onClick={close} aria-label="Close">×</button>
          <button className="lb-btn lb-prev" onClick={() => step(-1)} aria-label="Previous">‹</button>
          <figure>
            <img src={items[idx].src} alt={items[idx].alt} />
            <figcaption>{items[idx].alt} <small>{idx + 1} / {items.length}</small></figcaption>
          </figure>
          <button className="lb-btn lb-next" onClick={() => step(1)} aria-label="Next">›</button>
        </div>
      )}
    </section>
  );
}
