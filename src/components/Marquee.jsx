import { MARQUEE } from "../data/content.js";

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((t, i) => <span key={i}>{t}<i>✦</i></span>)}
      </div>
    </div>
  );
}
