/** Compact − / + stepper for the enquiry form (no popup, so nothing can overlap other fields). */
export default function GuestStepper({ id, value, onChange, onBlur, min = 1, max = 10 }) {
  const n = +value || min;
  const set = (v) => onChange(String(Math.min(max, Math.max(min, v))));
  return (
    <div className="stepper" role="group" aria-label="Number of guests" onBlur={onBlur}>
      <button type="button" onClick={() => set(n - 1)} disabled={n <= min} aria-label="Fewer guests">−</button>
      <output id={id} aria-live="polite">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.6-3.6 3.4-5.5 7-5.5s6.4 1.9 7 5.5" /></svg>
        <b>{n}</b> <span>{n === 1 ? "Guest" : "Guests"}</span>
      </output>
      <button type="button" onClick={() => set(n + 1)} disabled={n >= max} aria-label="More guests">+</button>
    </div>
  );
}
