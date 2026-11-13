# Serenara Resort & Spa — React Landing Page

React 18 + Vite, plain CSS (design tokens), GSAP + ScrollTrigger and Lenis for motion.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

## Structure
```
src/
├── components/   Navbar, Hero, Marquee, About, Stat, Experiences, OfferCTA,
│                 Gallery, Testimonials, Contact, FinalCTA, Footer, BackToTop,
│                 Reveal, SectionHeading, Cursor, Preloader, Effects
├── lib/          smooth.js (Lenis smooth-scroll + GSAP ticker sync)
├── hooks/        useReveal.js (useInView, useCountUp, useScrollY)
├── data/         content.js  (all copy, images, nav links)
└── styles/       index.css   (tokens, components, responsive rules)
public/images/    photography
```

## Motion layer (GSAP / Lenis)
- **Golden sparkle cursor** (`Cursor.jsx`): rotating star, twinkling canvas trail, soft glow, click bursts, "View"/"Explore" pill on gallery & panels. Desktop pointers only.
- **Preloader** (`Preloader.jsx`): letter-by-letter logo reveal + curtain lift; hero animations start after it.
- **Smooth scrolling** with Lenis, synced to ScrollTrigger.
- **Effects.jsx**: split-word heading reveals, image parallax, scroll-velocity marquee skew, hero fade/drift, magnetic buttons, hero mouse-parallax, staggered stats & form fields.
- All of it is disabled/reduced under `prefers-reduced-motion`.

## Highlights
- Cinematic hero with parallax, masked headline reveal and glass booking bar (pre-fills the enquiry form)
- Story section with arch-framed images, floating badge and animated counters
- Experiences: expanding image panels (accordion cards on mobile)
- Parallax offer banner, filterable gallery + keyboard-friendly lightbox
- Auto-playing testimonial slider, validated enquiry form with success state
- Sticky glass navbar, scroll progress bar, active-link highlighting, mobile full-screen menu
- Responsive at desktop / tablet / mobile; honours `prefers-reduced-motion`

## Note
The enquiry form is a working UI with validation; submission is simulated until a backend is connected.

## Form backend
`src/components/Contact.jsx` simulates submission; replace the `setTimeout` with a `fetch()` call.
