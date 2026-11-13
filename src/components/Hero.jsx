import { useState } from "react";
import { IMAGES } from "../data/content.js";
import GuestSelect from "./GuestSelect.jsx";
import DatePicker, { addDays, todayISO } from "./DatePicker.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { availabilityMessage, openWhatsApp } from "../lib/whatsapp.js";

export default function Hero({ onQuickBook }) {
  const today = todayISO();
  const [missing, setMissing] = useState({});
  const [f, setF] = useState({ checkin: "", checkout: "", guests: "2" });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const setDate = (k) => (v) => {
    setMissing((m) => ({ ...m, [k]: false }));
    setF((p) => ({ ...p, [k]: v, ...(k === "checkin" && p.checkout && p.checkout <= v ? { checkout: "" } : {}) }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!f.checkin || !f.checkout) { setMissing({ checkin: !f.checkin, checkout: !f.checkout }); return; }
    onQuickBook?.(f); // keep the enquiry form pre-filled too, in case the guest wants to add more details
    openWhatsApp(availabilityMessage(f));
  };

  return (
    <section className="hero" id="top">
      <div className="hero-bg" style={{ backgroundImage: `url(${IMAGES.hero})` }} />
      <div className="hero-overlay" />
      <div className="container hero-content">
        <span className="eyebrow hero-eyebrow">Kovalam · Kerala · India</span>
        <h1>
          <span className="line"><span>Where the ocean</span></span>
          <span className="line"><span><em>meets</em> serenity</span></span>
        </h1>
        <p className="hero-sub">Sixty private villas, a barefoot shoreline and hospitality shaped by warmth, designed for the luxury of unhurried time.</p>
        <div className="hero-actions">
          <a href="#contact" className="btn btn-gold">Reserve Your Escape</a>
          <a href="#about" className="btn btn-ghost">Discover More</a>
        </div>
      </div>

      <form className="booking-bar" onSubmit={submit}>
        <div className="bb-field">
          <span id="bb-in">Check-in</span>
          <DatePicker id="hero-in" labelledBy="bb-in" placeholder="Add date" min={today} value={f.checkin} onChange={setDate("checkin")} rangeStart={f.checkin} rangeEnd={f.checkout} invalid={missing.checkin} />
        </div>
        <div className="bb-field">
          <span id="bb-out">Check-out</span>
          <DatePicker id="hero-out" labelledBy="bb-out" placeholder="Add date" min={f.checkin ? addDays(f.checkin, 1) : addDays(today, 1)} value={f.checkout} onChange={setDate("checkout")} rangeStart={f.checkin} rangeEnd={f.checkout} invalid={missing.checkout} />
        </div>
        <div className="bb-field">
          <span id="bb-guests">Guests</span>
          <GuestSelect id="hero-guests" labelledBy="bb-guests" value={f.guests} onChange={(v) => setF({ ...f, guests: v })} max={6} />
        </div>
        <button className="btn btn-gold" type="submit" title="Opens WhatsApp"><WhatsAppIcon /> Check Availability</button>
      </form>

      <a href="#about" className="scroll-cue" aria-label="Scroll down"><span /></a>
    </section>
  );
}
