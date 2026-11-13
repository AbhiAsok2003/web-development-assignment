import { useInView } from "../hooks/useReveal.js";

export default function Reveal({ as: Tag = "div", delay = 0, dir = "up", className = "", children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag ref={ref} className={`reveal reveal-${dir} ${inView ? "in" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...rest}>
      {children}
    </Tag>
  );
}
