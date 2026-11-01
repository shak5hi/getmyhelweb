// One number, the visitor's progress through the hero (0 → 1), drives the
// whole story: the camera, the room, the helper, the captions and the cuts.

// The camera passes through the window here, and back out here
export const CUT_IN = 0.27;
export const CUT_OUT = 0.9;

// The helper's part of the story, from the door opening to the last mop stroke
export const HELPER_START = 0.42;
export const HELPER_END = 0.86;

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Fully opaque for a moment either side of each cut, so the swap is never seen
export function flashAt(p: number) {
  const d = Math.min(Math.abs(p - CUT_IN), Math.abs(p - CUT_OUT));
  return smooth(clamp01(1.5 - d / 0.022));
}
