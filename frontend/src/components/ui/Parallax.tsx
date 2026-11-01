"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Drifts its content against the scroll by `amount` pixels while the parent
// frame passes through the viewport. Still for reduced motion.
export default function Parallax({
  children,
  amount = 60,
  className = "",
}: {
  children: React.ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el,
        { y: -amount / 2 },
        {
          y: amount / 2,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    });
    return () => mm.revert();
  }, [amount]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
