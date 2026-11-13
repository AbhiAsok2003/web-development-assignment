import { useScrolledPast } from "../hooks/useReveal.js";
import { scrollToTarget } from "../lib/smooth.js";
export default function BackToTop() {
  const past = useScrolledPast(600);
  return <button className={`to-top ${past ? "show" : ""}`} aria-label="Back to top" onClick={() => scrollToTarget(0, { offset: 0 })}>↑</button>;
}
