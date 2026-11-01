// Where the camera stands in the world for each chapter of the home page.
// Every chapter heading on the page carries data-shot="<key>"; the world
// glides from one station to the next as the visitor scrolls between them.

type V3 = [number, number, number];

export type Station = {
  mode: "ext" | "int";
  pos: V3;
  look: V3;
  // 0 = the warm day of the hero, 1 = night over the society
  night?: number;
  // 0 = flats lit here and there, each on its own; 1 = every flat lit together
  joined?: number;
  // how far the picture sits beside the words, as a share of the screen:
  // positive puts it on the right of them, negative on the left, 0 centres it
  shift?: number;
  // the helper indoors: x, z and the way she faces; left out, she's not in the flat
  helper?: V3;
  // 0 shut, 1 open
  door?: number;
  // the helper seen from outside, walking in through the gate
  walker?: boolean;
  // rate tags hanging on the flats: 0 = a different rate on each, 1 = one society rate; left out, no tags
  tags?: number;
};

const P2 = Math.PI / 2;

// Where the hero story ends: the whole society, every flat lit
export const HERO_END: Station = { mode: "ext", pos: [13, 7.4, 19], look: [0, 2.6, 0], joined: 1, shift: 0.2 };

export const STATIONS: Record<string, Station> = {
  // Every household is solving the same problem. Alone.
  problems: { mode: "ext", pos: [-10.5, 1.8, 13], look: [1.2, 2.9, -0.5], night: 0.1, joined: 0, shift: 0.2 },
  // The fix is an arrangement the whole society shares: night falls, and every flat lights together
  approach: { mode: "ext", pos: [10.5, 8.5, 15.5], look: [0, 2.4, 0], night: 1, joined: 1, shift: -0.2 },
  // A different rate in every flat: a tag on each door, each its own
  rates: { mode: "ext", pos: [4.2, 3.3, 7.2], look: [-0.2, 2.6, -0.3], night: 1, joined: 0, shift: 0.22, tags: 0 },
  // One society-agreed rate card: the tags straighten into one
  ratesAgreed: { mode: "ext", pos: [3.2, 3.9, 7.6], look: [-0.2, 2.7, -0.3], night: 1, joined: 1, shift: 0.22, tags: 1 },
  // Three steps: the committee at the gate, the helper walking in, the flat
  how: { mode: "ext", pos: [5.2, 2.4, 12.5], look: [0, 1.2, 1.6], night: 0.15, joined: 1, shift: -0.2, walker: true },
  // Everyday help: back inside, at the kitchen
  services: { mode: "int", pos: [0.4, 2.4, 5.2], look: [4.8, 1.0, -1.6], shift: 0.16, helper: [4.25, -1.4, P2] },
  // Leave and replacements: the door, and cover arriving at it
  leave: { mode: "int", pos: [-0.8, 1.8, 6.6], look: [-5.8, 1.2, 1.8], shift: -0.16, helper: [-4.9, 1.9, 0.75], door: 1 },
  // Calmer for every home: the flat, quiet and in order
  societies: { mode: "int", pos: [0.6, 2.4, 8.8], look: [0, 1.1, -0.5], shift: 0.16 },
  // Trust, both ways: the helper herself
  trust: { mode: "int", pos: [1.8, 1.8, 8.6], look: [-0.1, 1.0, 2.0], shift: -0.18, helper: [-0.1, 2.4, 0] },
  // Questions: the society again, the evening drawing in
  faq: { mode: "ext", pos: [-12, 4.2, 15], look: [0, 3, 0], night: 0.45, joined: 1, shift: 0.2 },
  // For residents: one flat among many
  waitlist: { mode: "ext", pos: [7.5, 3, 11.5], look: [0, 3.2, -1], night: 0.65, joined: 1, shift: -0.2 },
  // The committee meeting: the whole society from above, at night
  cta: { mode: "ext", pos: [1.5, 15, 16], look: [0, 1.6, -0.8], night: 1, joined: 1, shift: 0 },
};
