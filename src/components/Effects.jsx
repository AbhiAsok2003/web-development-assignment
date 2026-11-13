import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { initSmoothScroll, destroySmoothScroll } from "../lib/smooth.js";

gsap.registerPlugin(ScrollTrigger);

/** Wrap every word of an element (keeping <em> etc.) in a masked span for a rising-words reveal. */
function splitWords(root) {
  if (root.dataset.split) return [...root.querySelectorAll(".wi")];
  root.dataset.split = "1";
  const inners = [];
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part.trim()) { frag.append(part); return; }
          const mask = document.createElement("span"); mask.className = "w";
          const inner = document.createElement("span"); inner.className = "wi"; inner.textContent = part;
          mask.append(inner); frag.append(mask); inners.push(inner);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(root);
  return inners;
}

/** Headless component: smooth scroll + scroll/mouse driven GSAP effects. */
export default function Effects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    initSmoothScroll();

    const offs = [];
    const on = (el, ev, fn) => { el.addEventListener(ev, fn); offs.push(() => el.removeEventListener(ev, fn)); };
    const ctx = gsap.context(() => {
      if (!reduce) {
        // 1. Headings: words rise out of a mask
        document.querySelectorAll(".section h2, .offer h2, .final-cta h2").forEach((h) => {
          const words = splitWords(h);
          if (!words.length) return;
          gsap.from(words, {
            yPercent: 115, rotate: 4, duration: 1, ease: "expo.out", stagger: 0.07,
            scrollTrigger: { trigger: h, start: "top 88%", once: true },
          });
        });

        // 2. Parallax on story images
        gsap.fromTo(".about-img-main", { y: -30 }, { y: 30, ease: "none", scrollTrigger: { trigger: ".about-media", start: "top bottom", end: "bottom top", scrub: 0.6 } });
        gsap.fromTo(".about-img-sub", { y: 50 }, { y: -50, ease: "none", scrollTrigger: { trigger: ".about-media", start: "top bottom", end: "bottom top", scrub: 0.6 } });

        // 3. Marquee reacts to scroll velocity (skew)
        const track = document.querySelector(".marquee-track");
        if (track) {
          const skew = gsap.quickTo(track, "skewX", { duration: 0.4, ease: "power3" });
          ScrollTrigger.create({
            onUpdate: (self) => skew(gsap.utils.clamp(-12, 12, self.getVelocity() / -250)),
          });
        }

        // 3b. Hero background parallax (GSAP, no React re-render)
        gsap.to(".hero-bg", { y: () => window.innerHeight * 0.18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

        // 4. Hero content drifts + fades as you scroll away
        gsap.to(".hero-content", { yPercent: 18, opacity: 0.1, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

        // 4b. Offer background parallax
        gsap.fromTo(".offer-bg", { yPercent: -6 }, { yPercent: 6, ease: "none", scrollTrigger: { trigger: ".offer", start: "top bottom", end: "bottom top", scrub: true } });

        // 5. Offer card scales in with a slight rotation tied to scroll
        gsap.fromTo(".offer-card", { scale: 0.9, rotate: -2 }, { scale: 1, rotate: 0, ease: "none", scrollTrigger: { trigger: ".offer", start: "top 90%", end: "center center", scrub: 0.5 } });

        // 6. Stats pop in sequence
        gsap.from(".stat", { y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".stats", start: "top 90%", once: true } });

        // 7. Contact form fields cascade
        gsap.from(".form-card .field", { y: 24, opacity: 0, duration: 0.7, stagger: 0.07, ease: "power2.out", scrollTrigger: { trigger: ".form-card", start: "top 85%", once: true } });
      }

      // 8. Magnetic buttons + mouse parallax in hero (desktop only)
      if (fine && !reduce) {
        document.querySelectorAll(".btn, .to-top, .socials a, .burger").forEach((el) => {
          el.classList.add("magnetic");
          const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
          const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.45)" });
          on(el, "pointermove", (e) => {
            const r = el.getBoundingClientRect();
            xTo((e.clientX - (r.left + r.width / 2)) * 0.32);
            yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
          });
          on(el, "pointerleave", () => { xTo(0); yTo(0); });
        });

        const hero = document.querySelector(".hero");
        const hx = gsap.quickTo(".hero-content", "x", { duration: 1.2, ease: "power3" });
        if (hero) on(hero, "pointermove", (e) => hx((e.clientX / window.innerWidth - 0.5) * -26));
      }
    });

    const refresh = setTimeout(() => ScrollTrigger.refresh(), 600);
    return () => { clearTimeout(refresh); offs.forEach((f) => f()); ctx.revert(); destroySmoothScroll(); };
  }, []);

  return null;
}
