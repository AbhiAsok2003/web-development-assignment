import { useEffect, useRef, useState } from "react";

/**
 * Custom number dropdown (replaces the native <select>).
 * Shows numbers only; opens a pill grid. Keyboard: Enter/Space opens, arrows change, Esc closes.
 * variant "glass" = on the dark hero bar (opens upward), "light" = on the white form (opens downward).
 */
export default function GuestSelect({ id, value, onChange, onBlur, max = 6, variant = "glass", labelledBy }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const nums = Array.from({ length: max }, (_, i) => i + 1);
  const cols = max > 6 ? 5 : 3;

  useEffect(() => {
    if (!open) return;
    const down = (e) => !wrap.current?.contains(e.target) && setOpen(false);
    const key = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); };
  }, [open]);

  const pick = (n) => { onChange(String(n)); setOpen(false); };
  const onKeyDown = (e) => {
    const n = +value || 1;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); onChange(String(Math.min(n + 1, max))); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); onChange(String(Math.max(n - 1, 1))); }
  };

  return (
    <div ref={wrap} className={`gsel ${variant} ${open ? "open" : ""}`} style={{ "--cols": cols }}>
      <button
        type="button" id={id} className="gsel-btn"
        aria-haspopup="listbox" aria-expanded={open} aria-labelledby={labelledBy}
        onClick={() => setOpen((o) => !o)} onKeyDown={onKeyDown} onBlur={onBlur}
      >
        <span>{value}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="gsel-pop" role="listbox" aria-labelledby={labelledBy}>
          {nums.map((n) => (
            <button type="button" key={n} role="option" aria-selected={+value === n} className="gsel-opt" onClick={() => pick(n)}>{n}</button>
          ))}
        </div>
      )}
    </div>
  );
}
