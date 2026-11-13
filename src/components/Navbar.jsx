import { useEffect, useRef, useState } from "react";
import { NAV_LINKS } from "../data/content.js";
import { useScrolledPast } from "../hooks/useReveal.js";

export default function Navbar() {
  const scrolled = useScrolledPast(60);
  const barRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // progress bar: written straight to the DOM so React never re-renders on scroll
  useEffect(() => {
    const on = () => {
      const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(window.scrollY / max, 1)})`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={barRef} className="scroll-progress" style={{ transform: "scaleX(0)" }} />
      <header className={`navbar ${scrolled ? "scrolled" : ""} ${open ? "open" : ""}`}>
        <div className="container nav-inner">
          <a href="#top" className="brand" onClick={() => setOpen(false)}>
            Serenara<span>.</span>
            <small>Resort &amp; Spa</small>
          </a>
          <nav className={`nav-links ${open ? "show" : ""}`} aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <a key={l.href} href={l.href} className={active === l.href.slice(1) ? "active" : ""} onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <a href="#contact" className="btn btn-gold nav-cta" onClick={() => setOpen(false)}>Book Your Stay</a>
          </nav>
          <button className="burger" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
            <span /><span /><span />
          </button>
        </div>
      </header>
    </>
  );
}
