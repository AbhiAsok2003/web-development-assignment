import { IMAGES, STATS } from "../data/content.js";
import Reveal from "./Reveal.jsx";
import Stat from "./Stat.jsx";

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <div className="about-grid">
          <Reveal dir="left" className="about-media">
            <img className="about-img-main" src={IMAGES.about} alt="Serenara villa overlooking the sea" loading="lazy" />
            <img className="about-img-sub" src={IMAGES.beach} alt="Aerial view of the private beach" loading="lazy" />
            <div className="about-badge"><strong>Since</strong><span>2009</span></div>
          </Reveal>
          <div className="about-copy">
            <Reveal><span className="eyebrow">Our story</span></Reveal>
            <Reveal delay={80}><h2>A sanctuary crafted for <em>slow living</em></h2></Reveal>
            <Reveal delay={160}>
              <p>Nestled between swaying coconut palms and a golden shoreline, Serenara is a 60-villa beachfront resort designed around one idea: the luxury of unhurried time.</p>
              <p>Every villa opens to the sea, every meal is sourced from local farms and fishermen, and every detail is shaped by warm, intuitive service.</p>
            </Reveal>
            <Reveal delay={240}>
              <ul className="ticks">
                <li>Private pool villas with ocean views</li>
                <li>Award-winning Ayurvedic spa &amp; wellness</li>
                <li>Sustainable, eco-conscious design</li>
              </ul>
              <a href="#experiences" className="btn btn-outline">Explore Experiences <span aria-hidden>→</span></a>
            </Reveal>
          </div>
        </div>
        <Reveal className="stats">
          {STATS.map((s) => <Stat key={s.label} {...s} />)}
        </Reveal>
      </div>
    </section>
  );
}
