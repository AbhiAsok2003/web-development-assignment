import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Custom "golden sparkle" cursor:
 *  - a small rotating 4-point star that follows the pointer
 *  - a canvas trail of twinkling gold stars + soft light glow
 *  - a pill label ("View", "Explore"…) for elements with data-cursor
 *  - click bursts
 * Disabled on touch devices and when reduced motion is requested.
 */
const COLORS = ["#e3c48f", "#c9a063", "#fff3d6", "#ffd98a"];

/* Pre-render each star once (with its glow) so per-frame drawing is a cheap drawImage. */
const SPRITE = 48;
function makeSprite(color) {
  const c = document.createElement("canvas");
  c.width = c.height = SPRITE;
  const g = c.getContext("2d");
  const cx = SPRITE / 2, r = SPRITE * 0.3;
  g.fillStyle = color; g.shadowColor = color; g.shadowBlur = 8;
  g.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const rad = i % 2 === 0 ? r : r * 0.28;
    g.lineTo(cx + Math.cos(a) * rad, cx + Math.sin(a) * rad);
  }
  g.closePath(); g.fill();
  return c;
}

export default function Cursor() {
  const canvasRef = useRef(null);
  const starRef = useRef(null);
  const labelRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.documentElement.classList.add("has-cursor");
    const canvas = canvasRef.current, ctx = canvas.getContext("2d");
    const starEl = starRef.current, labelEl = labelRef.current, glowEl = glowRef.current;
    const sprites = COLORS.map(makeSprite);
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const mouse = { x: -100, y: -100, px: -100, py: -100 };
        const particles = [];
    let visible = false;

    const spawn = (x, y, burst = false) => {
      const n = burst ? 16 : 1 + (Math.random() < 0.5 ? 1 : 0);
      for (let i = 0; i < n; i++) {
        const ang = burst ? (i / n) * Math.PI * 2 + Math.random() * 0.4 : Math.random() * Math.PI * 2;
        const sp = burst ? 2 + Math.random() * 3.2 : Math.random() * 0.8;
        particles.push({
          x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp + (burst ? 0 : 0.35),
          r: burst ? 4 + Math.random() * 6 : 2.5 + Math.random() * 5,
          life: 1, decay: burst ? 0.018 + Math.random() * 0.012 : 0.015 + Math.random() * 0.015,
          rot: Math.random() * Math.PI, spin: (Math.random() - 0.5) * 0.12,
          sprite: sprites[(Math.random() * sprites.length) | 0],
        });
      }
    };

    const moveX = gsap.quickTo(starEl, "x", { duration: 0.12, ease: "power3" });
    const moveY = gsap.quickTo(starEl, "y", { duration: 0.12, ease: "power3" });
    const lblX = gsap.quickTo(labelEl, "x", { duration: 0.25, ease: "power3" });
    const lblY = gsap.quickTo(labelEl, "y", { duration: 0.25, ease: "power3" });
    const glwX = gsap.quickTo(glowEl, "x", { duration: 0.5, ease: "power3" });
    const glwY = gsap.quickTo(glowEl, "y", { duration: 0.5, ease: "power3" });
    gsap.set([starEl, labelEl, glowEl], { xPercent: -50, yPercent: -50 });
    const spin = gsap.to(starEl.querySelector("svg"), { rotation: 360, duration: 6, ease: "none", repeat: -1 });

    const onMove = (e) => {
      mouse.x = e.clientX; mouse.y = e.clientY;
      if (!visible) { visible = true; gsap.to([starEl, canvas, glowEl], { opacity: 1, duration: 0.3 }); gsap.set(glowEl, { x: mouse.x, y: mouse.y }); }
      moveX(mouse.x); moveY(mouse.y); lblX(mouse.x); lblY(mouse.y); glwX(mouse.x); glwY(mouse.y);
      if (!reduce) {
        const dist = Math.hypot(mouse.x - mouse.px, mouse.y - mouse.py);
        if (dist > 6) { spawn(mouse.x, mouse.y); mouse.px = mouse.x; mouse.py = mouse.y; }
      }
    };
    const onLeave = () => { visible = false; gsap.to([starEl, canvas, glowEl, labelEl], { opacity: 0, duration: 0.3 }); };
    const onDown = () => { gsap.to(starEl, { scale: 0.6, duration: 0.15 }); if (!reduce) spawn(mouse.x, mouse.y, true); };
    const onUp = () => gsap.to(starEl, { scale: hoverState.scale, duration: 0.4, ease: "back.out(3)" });

    const hoverState = { scale: 1 };
    let lastCur = null, lastInteractive = null;
    const updateTarget = (t) => {
      const cur = t?.closest?.("[data-cursor]") || null;
      const interactive = !!t?.closest?.("a, button, input, select, textarea, label, [role='tab'], .panel, .g-item");
      if (cur === lastCur && interactive === lastInteractive) return; // nothing changed
      lastCur = cur; lastInteractive = interactive;
      if (cur) {
        labelEl.textContent = cur.dataset.cursor;
        gsap.to(labelEl, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)", overwrite: "auto" });
        gsap.to(starEl, { scale: 0, duration: 0.25, overwrite: "auto" });
        hoverState.scale = 0;
      } else {
        gsap.to(labelEl, { opacity: 0, scale: 0.6, duration: 0.2, overwrite: "auto" });
        hoverState.scale = interactive ? 1.9 : 1;
        gsap.to(starEl, { scale: hoverState.scale, duration: 0.35, ease: "back.out(2)", overwrite: "auto" });
      }
    };
    const onOver = (e) => updateTarget(e.target);

    // When the page scrolls under a still mouse no pointer event fires, so the
    // label would stay stuck. Re-check what is under the cursor on scroll.
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf || !visible) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        updateTarget(document.elementFromPoint(mouse.x, mouse.y));
      });
    };

    let raf, idle = true;
    const loop = () => {
      if (particles.length) {
        idle = false;
        ctx.clearRect(0, 0, w, h);
        ctx.globalCompositeOperation = "lighter";
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx; p.y += p.vy; p.vx *= 0.97; p.vy *= 0.97; p.rot += p.spin; p.life -= p.decay;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          const size = p.r * 2 * (0.4 + p.life * 0.6) * (SPRITE / (SPRITE * 0.6));
          ctx.globalAlpha = Math.max(p.life, 0);
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          ctx.drawImage(p.sprite, -size / 2, -size / 2, size, size);
          ctx.restore();
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      } else if (!idle) { ctx.clearRect(0, 0, w, h); idle = true; }
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("resize", resize);
    document.addEventListener("pointerover", onOver);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf); cancelAnimationFrame(scrollRaf); spin.kill();
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", resize);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="cursor-canvas" aria-hidden="true" />
      <div ref={glowRef} className="cursor-glow" aria-hidden="true" />
      <div ref={starRef} className="cursor-star" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M12 0l2.6 9.4L24 12l-9.4 2.6L12 24l-2.6-9.4L0 12l9.4-2.6z" /></svg>
      </div>
      <div ref={labelRef} className="cursor-label" aria-hidden="true" />
    </>
  );
}
