import type Lenis from "lenis";

// The page's Lenis instance, when smooth scrolling is active. Components that
// lock the page (the mobile menu) pause it through these helpers.
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function lockScroll() {
  instance?.stop();
  document.body.style.overflow = "hidden";
}

export function unlockScroll() {
  instance?.start();
  document.body.style.overflow = "";
}
