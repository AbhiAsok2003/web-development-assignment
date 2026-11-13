import { useEffect, useState } from "react";
import SectionHeading from "./SectionHeading.jsx";
import Reveal from "./Reveal.jsx";
import GuestStepper from "./GuestStepper.jsx";
import DatePicker, { addDays, todayISO } from "./DatePicker.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";
import { enquiryMessage, openWhatsApp } from "../lib/whatsapp.js";

const EMPTY = { name: "", email: "", phone: "", room: "Garden Villa", checkin: "", checkout: "", guests: "2", message: "" };

function validate(v) {
  const e = {};
  if (v.name.trim().length < 2) e.name = "Please enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email)) e.email = "Enter a valid email address.";
  if (!/^[0-9+\-\s]{10,15}$/.test(v.phone)) e.phone = "Enter a valid phone number (10–15 digits).";
  if (!v.checkin) e.checkin = "Choose a check-in date.";
  if (!v.checkout) e.checkout = "Choose a check-out date.";
  else if (v.checkin && v.checkout <= v.checkin) e.checkout = "Check-out must be after check-in.";
  if (+v.guests < 1 || +v.guests > 10) e.guests = "1 to 10 guests.";
  return e;
}

export default function Contact({ prefill }) {
  const [v, setV] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sent
  const [waLink, setWaLink] = useState(""); // kept so the success card can offer a manual retry
  const errors = validate(v);
  const today = todayISO();

  useEffect(() => { if (prefill) setV((p) => ({ ...p, ...prefill })); }, [prefill]);

  const bind = (k) => ({
    id: k, name: k, value: v[k],
    onChange: (e) => setV({ ...v, [k]: e.target.value }),
    onBlur: () => setTouched({ ...touched, [k]: true }),
    "aria-invalid": touched[k] && errors[k] ? true : undefined,
    className: touched[k] ? (errors[k] ? "invalid" : "valid") : "",
  });
  const err = (k) => touched[k] && errors[k] && <small className="err">{errors[k]}</small>;

  const submit = (e) => {
    e.preventDefault();
    setTouched(Object.fromEntries(Object.keys(EMPTY).map((k) => [k, true])));
    if (Object.keys(errors).length) return;
    // Hand the enquiry to WhatsApp (must run synchronously inside this submit so popup blockers allow it).
    setWaLink(openWhatsApp(enquiryMessage(v)));
    setStatus("sent"); setV(EMPTY); setTouched({});
  };

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <SectionHeading eyebrow="Plan your stay" title="Let's create your" accent="perfect escape" text="Share your dates and preferences and our concierge will reply on WhatsApp with a tailored itinerary." />
        <div className="contact-grid">
          <Reveal dir="left" className="contact-info">
            <h3>Reach us directly</h3>
            <ul>
              <li><span className="ico">⌖</span><div><strong>Visit</strong>Serenara Resort &amp; Spa, Beach Road, Kovalam, Kerala 695527</div></li>
              <li><span className="ico">✆</span><div><strong>Call</strong><a href="tel:+910000000000">+91 00000 00000</a></div></li>
              <li><span className="ico">✉</span><div><strong>Email</strong><a href="mailto:stay@serenara.example">stay@serenara.example</a></div></li>
              <li><span className="ico">◷</span><div><strong>Front desk</strong>Open 24 hours, every day</div></li>
            </ul>
            <div className="info-note">Free airport pickup on stays of 3 nights or more.</div>
          </Reveal>

          <Reveal dir="right">
            {status === "sent" ? (
              <div className="form-card success" role="status">
                <div className="check">✓</div>
                <h3>Your enquiry is ready on WhatsApp</h3>
                <p>Just press <strong>Send</strong> in WhatsApp and our concierge will reply shortly.</p>
                <p className="wa-retry">WhatsApp didn’t open? <a className="wa-fallback" href={waLink} target="_blank" rel="noopener noreferrer">Continue on WhatsApp</a></p>
                <button className="btn btn-outline" onClick={() => setStatus("idle")}>Send another enquiry</button>
              </div>
            ) : (
              <form className="form-card" onSubmit={submit} noValidate>
                <div className="field"><label htmlFor="name">Full name</label><input type="text" placeholder="Your name" {...bind("name")} />{err("name")}</div>
                <div className="field"><label htmlFor="email">Email</label><input type="email" placeholder="you@example.com" {...bind("email")} />{err("email")}</div>
                <div className="field"><label htmlFor="phone">Phone</label><input type="tel" placeholder="Mobile number" {...bind("phone")} />{err("phone")}</div>
                <div className="field"><label htmlFor="room">Villa type</label>
                  <select {...bind("room")}><option>Garden Villa</option><option>Ocean View Villa</option><option>Pool Villa</option><option>Royal Suite</option></select>
                </div>
                <div className="field"><label htmlFor="checkin">Check-in</label><DatePicker id="checkin" variant="light" placeholder="Select date" min={today} value={v.checkin} onChange={(d) => setV((p) => ({ ...p, checkin: d, ...(p.checkout && p.checkout <= d ? { checkout: "" } : {}) }))} onBlur={() => setTouched((t) => ({ ...t, checkin: true }))} rangeStart={v.checkin} rangeEnd={v.checkout} invalid={touched.checkin && errors.checkin} />{err("checkin")}</div>
                <div className="field"><label htmlFor="checkout">Check-out</label><DatePicker id="checkout" variant="light" align="right" placeholder="Select date" min={addDays(v.checkin || today, v.checkin ? 1 : 1)} value={v.checkout} onChange={(d) => setV((p) => ({ ...p, checkout: d }))} onBlur={() => setTouched((t) => ({ ...t, checkout: true }))} rangeStart={v.checkin} rangeEnd={v.checkout} invalid={touched.checkout && errors.checkout} />{err("checkout")}</div>
                <div className="field"><label htmlFor="guests">Guests</label><GuestStepper id="guests" max={10} value={v.guests} onChange={(n) => setV((p) => ({ ...p, guests: n }))} />{err("guests")}</div>
                <div className="field full"><label htmlFor="message">Special requests</label><textarea rows="4" placeholder="Anniversary, dietary needs, airport transfer…" {...bind("message")} /></div>
                <button type="submit" className="btn btn-gold full"><WhatsAppIcon /> Send on WhatsApp</button>
                <p className="wa-note">Opens WhatsApp with your details filled in. Nothing is sent until you press Send.</p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
