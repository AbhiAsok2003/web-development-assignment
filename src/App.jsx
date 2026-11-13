import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Marquee from "./components/Marquee.jsx";
import About from "./components/About.jsx";
import Experiences from "./components/Experiences.jsx";
import OfferCTA from "./components/OfferCTA.jsx";
import Gallery from "./components/Gallery.jsx";
import Testimonials from "./components/Testimonials.jsx";
import Contact from "./components/Contact.jsx";
import FinalCTA from "./components/FinalCTA.jsx";
import Footer from "./components/Footer.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Cursor from "./components/Cursor.jsx";
import Preloader from "./components/Preloader.jsx";
import Effects from "./components/Effects.jsx";

export default function App() {
  const [prefill, setPrefill] = useState(null);
  return (
    <>
      <Preloader />
      <Effects />
      <Cursor />
      <Navbar />
      <main>
        <Hero onQuickBook={setPrefill} />
        <Marquee />
        <About />
        <Experiences onPlan={setPrefill} />
        <OfferCTA />
        <Gallery />
        <Testimonials />
        <Contact prefill={prefill} />
        <FinalCTA />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
