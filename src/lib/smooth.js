import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

/** Starts Lenis smooth-scroll and wires it into GSAP's ticker + ScrollTrigger. */
export function initSmoothScroll() {
  if (lenis) return lenis;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return null;

  lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9, smoothWheel: true, anchors: { offset: -70 } });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  // Pause smooth scrolling while a modal / mobile menu locks the body.
  const sync = () => (document.body.style.overflow === "hidden" ? lenis.stop() : lenis.start());
  const mo = new MutationObserver(sync);
  mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });

  lenis._cleanup = () => { gsap.ticker.remove(tick); mo.disconnect(); };
  return lenis;
}

export function destroySmoothScroll() {
  if (!lenis) return;
  lenis._cleanup?.();
  lenis.destroy();
  lenis = null;
}

/** Smooth scroll to a selector / element / number (falls back to native). */
export function scrollToTarget(target, opts = {}) {
  if (lenis) lenis.scrollTo(target, { offset: -70, duration: 1.4, ...opts });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else (typeof target === "string" ? document.querySelector(target) : target)?.scrollIntoView({ behavior: "smooth" });
}
