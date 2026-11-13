import Reveal from "./Reveal.jsx";

export default function SectionHeading({ eyebrow, title, accent, text, light, align = "center" }) {
  return (
    <Reveal className={`section-heading ${align} ${light ? "light" : ""}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title} {accent && <em>{accent}</em>}</h2>
      {text && <p>{text}</p>}
    </Reveal>
  );
}
