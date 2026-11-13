import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const pad = (n) => String(n).padStart(2, "0");
// Bottom-sheet mode: phones, folds, any touch device (incl. landscape tablets) and short windows,
// i.e. everywhere an anchored popover could run off-screen.
const SHEET_QUERY = "(max-width: 900px), (pointer: coarse), (max-height: 640px)";
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const fromISO = (s) => { if (!s) return null; const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
export const addDays = (s, n) => { const d = fromISO(s); d.setDate(d.getDate() + n); return toISO(d); };
export const todayISO = () => toISO(new Date());

/**
 * Custom calendar date picker (value is "YYYY-MM-DD").
 * variant "glass" = dark hero bar (opens upward) · "light" = white form (opens downward).
 * rangeStart / rangeEnd highlight the stay between check-in and check-out.
 */
export default function DatePicker({ id, value, onChange, onBlur, min, rangeStart, rangeEnd, placeholder = "Select date", variant = "glass", align = "left", invalid, labelledBy }) {
  const wrap = useRef(null);
  const pop = useRef(null);
  const [open, setOpen] = useState(false);
  const [sheet, setSheet] = useState(false); // phones/tablets: show as a bottom sheet in a portal
  const minStr = min || todayISO();
  const minD = fromISO(minStr);
  const sel = fromISO(value);
  const [view, setView] = useState(() => { const b = sel || minD; return new Date(b.getFullYear(), b.getMonth(), 1); });

  useEffect(() => {
    if (!open) return;
    // Popover mode only: close on an outside press. In sheet mode the overlay closes on *click*
    // instead, so the tap that dismisses it can't fall through onto the form underneath.
    const down = (e) => !sheet && !wrap.current?.contains(e.target) && !pop.current?.contains(e.target) && setOpen(false);
    const key = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); };
  }, [open, sheet]);

  // Keep the layout right if the screen changes while open (fold/unfold, rotate, resize).
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia(SHEET_QUERY);
    const sync = () => setSheet(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [open]);

  // Sheet mode: move focus into the dialog so screen readers / keyboards land in it.
  useEffect(() => { if (open && sheet) pop.current?.focus({ preventScroll: true }); }, [open, sheet]);

  const toggle = () => {
    if (!open) {
      setSheet(window.matchMedia(SHEET_QUERY).matches); const b = sel || minD; setView(new Date(b.getFullYear(), b.getMonth(), 1)); }
    setOpen((o) => !o);
  };
  const shift = (n) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1));
  const canPrev = view > new Date(minD.getFullYear(), minD.getMonth(), 1);

  const lead = view.getDay();
  const count = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: count }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1))];
  const today = todayISO();
  const a = rangeStart, b = rangeEnd;

  useEffect(() => {
    if (!(open && sheet)) return;
    document.body.style.overflow = "hidden"; // also pauses Lenis
    return () => { document.body.style.overflow = ""; };
  }, [open, sheet]);

  const pick = (d) => { onChange(toISO(d)); setOpen(false); };
  const label = sel ? sel.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) : placeholder;

  const popup = (
    <div ref={pop} className={`dp-pop ${variant} ${align} ${sheet ? "sheet" : ""}`} role="dialog" aria-modal={sheet || undefined} aria-label="Choose a date" tabIndex={-1} data-lenis-prevent>
          <div className="dp-head">
            <button type="button" className="dp-nav" onClick={() => shift(-1)} disabled={!canPrev} aria-label="Previous month">‹</button>
            <strong>{MONTHS[view.getMonth()]} <span>{view.getFullYear()}</span></strong>
            <button type="button" className="dp-nav" onClick={() => shift(1)} aria-label="Next month">›</button>
          </div>
          <div className="dp-grid dp-dow">{DOW.map((d) => <span key={d}>{d}</span>)}</div>
          <div className="dp-grid">
            {cells.map((d, i) => {
              if (!d) return <span key={`e${i}`} />;
              const s = toISO(d);
              const disabled = d < minD;
              const cls = ["dp-day", s === value && "sel", s === today && "today", a && b && s > a && s < b && "in", a && b && s === a && "edge-start", a && b && s === b && "edge-end"].filter(Boolean).join(" ");
              return <button type="button" key={s} className={cls} disabled={disabled} aria-pressed={s === value} onClick={() => pick(d)}>{d.getDate()}</button>;
            })}
          </div>
          <div className="dp-foot">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}>Clear</button>
            <button type="button" onClick={() => today >= minStr && pick(fromISO(today))} disabled={today < minStr}>Today</button>
          </div>
        </div>
  );

  return (
    <div ref={wrap} className={`dp ${variant} ${open ? "open" : ""} ${invalid ? "invalid" : ""} ${sel ? "has-value" : ""}`}>
      <button type="button" id={id} className="dp-btn" aria-haspopup="dialog" aria-expanded={open} aria-labelledby={labelledBy} onClick={toggle} onBlur={onBlur}>
        <span className="dp-text">{label}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
      </button>

      {open && (sheet
        ? createPortal(<div className="dp-sheet" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>{popup}</div>, document.body)
        : popup)}
    </div>
  );
}
