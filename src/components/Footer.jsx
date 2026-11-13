import { useState } from "react";
import { NAV_LINKS } from "../data/content.js";
import { newsletterMessage, openWhatsApp } from "../lib/whatsapp.js";

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21h3z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
        <path d="M17.7 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.7 3zm-1.1 16.2h1.7L7.5 4.7H5.7l10.9 14.5z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const sub = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setMsg("Please enter a valid email.");
    openWhatsApp(newsletterMessage(email));
    setMsg("Opening WhatsApp… press Send to confirm your subscription."); setEmail("");
  };
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <a href="#top" className="brand">Serenara<span>.</span></a>
          <p>A luxury beachfront retreat where time slows down and memories are made.</p>
          <div className="socials">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div><h4>Explore</h4>{NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}</div>
        <div><h4>Stay</h4><a href="#contact">Garden Villa</a><a href="#contact">Ocean View Villa</a><a href="#contact">Pool Villa</a><a href="#contact">Royal Suite</a></div>
        <div>
          <h4>Newsletter</h4>
          <p>Seasonal offers and travel inspiration.</p>
          <form className="newsletter" onSubmit={sub} noValidate>
            <input type="email" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" />
            <button type="submit" aria-label="Subscribe via WhatsApp">→</button>
          </form>
          <small className="news-msg" role="status">{msg}</small>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} Serenara Resort &amp; Spa. All rights reserved.</span>
        <span><a href="#top">Privacy</a> · <a href="#top">Terms</a></span>
      </div>
    </footer>
  );
}