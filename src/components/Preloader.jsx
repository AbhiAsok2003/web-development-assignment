import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Intro curtain: letters rise, gold line fills, curtain lifts to reveal the hero. */
export default function Preloader({ onDone }) {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    document.body.style.overflow = "hidden";
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = "";
          document.body.classList.add("loaded");
          onDone?.();
        },
      });
      tl.from(".pre-letter", { yPercent: 120, rotate: 6, duration: 0.9, ease: "expo.out", stagger: 0.06 })
        .from(".pre-sub", { opacity: 0, y: 14, duration: 0.6 }, "-=0.4")
        .to(".pre-line i", { scaleX: 1, duration: 1, ease: "power2.inOut" }, "-=0.5")
        .to(".pre-inner", { opacity: 0, y: -30, duration: 0.5, ease: "power2.in" })
        .to(el, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.1")
        .set(el, { display: "none" });
    }, el);
    return () => ctx.revert();
  }, [onDone]);

  return (
    <div className="preloader" ref={root} aria-hidden="true">
      <div className="pre-inner">
        <div className="pre-word">
          {"Serenara".split("").map((c, i) => <span className="pre-mask" key={i}><span className="pre-letter">{c}</span></span>)}
          <span className="pre-mask"><span className="pre-letter pre-dot">.</span></span>
        </div>
        <div className="pre-sub">Resort &amp; Spa · Kerala</div>
        <div className="pre-line"><i /></div>
      </div>
      <svg className="pre-curve" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 0 Q50 10 100 0 L100 0 L0 0Z" /></svg>
    </div>
  );
}
