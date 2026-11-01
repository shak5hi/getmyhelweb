"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Marks [data-reveal] elements with data-shown as they enter the viewport.
// A data attribute rather than a class, so React re-rendering an element's
// className (an accordion opening, say) never hides it again.
// Elements that enter together are staggered, so a section's heading, text
// and picture arrive in reading order. Styling lives in globals.css and is
// skipped entirely for reduced motion.
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.style.setProperty("--reveal-delay", `${Math.min(order, 5) * 80}ms`);
          el.setAttribute("data-shown", "");
          observer.unobserve(el);
          order += 1;
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
