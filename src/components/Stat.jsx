import { useInView, useCountUp } from "../hooks/useReveal.js";

export default function Stat({ value, suffix, label }) {
  const [ref, inView] = useInView({ threshold: 0.5 });
  const n = useCountUp(value, inView);
  return (
    <div className="stat" ref={ref}>
      <strong>{n}{suffix}</strong>
      <span>{label}</span>
    </div>
  );
}
