// The world renders once for the whole page; the hero listens to it so its
// words stay in step with the picture.
export const storyBus: { hero: ((p: number) => void) | null } = { hero: null };

// Set before first paint by the inline script in the root layout, when the
// browser can draw the world and the visitor hasn't asked for less motion
export function worldEnabled() {
  return document.documentElement.classList.contains("has-world");
}
