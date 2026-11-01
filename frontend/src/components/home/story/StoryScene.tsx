"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Environment, Lightformer, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { CUT_IN, CUT_OUT, HELPER_END, HELPER_START, clamp01, lerp, range, smooth } from "./timeline";
import { HERO_END, STATIONS, type Station } from "./stations";

type V3 = [number, number, number];
type Pose = { x: number; z: number; heading: number | null; visible: boolean };

// What the world shows this frame, shared with everything inside it
type SceneState = {
  hero: boolean; // still inside the hero story
  t: number; // hero progress; 1 once the story has played
  joined: number;
  night: number;
  door: number | null;
  tags: number; // how far the rate tags are showing
  agreed: number; // how far they've become one rate
  helper: Pose;
  walker: Pose;
};
type StateRef = { current: SceneState };

export type WorldFrame = { hero: number; shot: number; flash: number };

const PAPER = "#f7f4ee";

// Same layout on every visit: a small seeded generator instead of Math.random
function seeded(seed: number) {
  let n = seed;
  return () => (n = (n * 16807) % 2147483647) / 2147483647;
}

export default function WorldScene({ live, onFrame }: { live: boolean; onFrame: (f: WorldFrame) => void }) {
  return (
    <Canvas
      shadows="soft"
      frameloop={live ? "always" : "never"}
      dpr={[1, 1.75]}
      camera={{ fov: 35, near: 0.05, far: 160, position: [15, 8, 21] }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={[PAPER]} />
      <fog attach="fog" args={[PAPER, 22, 72]} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2} position={[0, 6, 6]} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={1} color="#e9dcff" position={[-8, 3, 0]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1} color="#ffe6cc" position={[8, 3, 0]} rotation-y={-Math.PI / 2} scale={[8, 4, 1]} />
      </Environment>
      <Story onFrame={onFrame} />
    </Canvas>
  );
}

/* ------------------------------------------------------------------ camera */

type Track = { times: number[]; pos: THREE.CatmullRomCurve3; look: THREE.CatmullRomCurve3 };

function track(keys: [number, V3, V3][]): Track {
  return {
    times: keys.map((k) => k[0]),
    pos: new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k[1])), false, "centripetal"),
    look: new THREE.CatmullRomCurve3(keys.map((k) => new THREE.Vector3(...k[2])), false, "centripetal"),
  };
}

function sample(tr: Track, t: number, pos: THREE.Vector3, look: THREE.Vector3) {
  const { times } = tr;
  let k = 0;
  while (k < times.length - 2 && t >= times[k + 1]) k++;
  const u = clamp01((t - times[k]) / (times[k + 1] - times[k]));
  const s = (k + u) / (times.length - 1);
  tr.pos.getPoint(s, pos);
  tr.look.getPoint(s, look);
}

// Your flat: the middle window of the seventh floor of the middle tower
const FH = 0.42;
const TARGET: V3 = [0, 6 * FH + FH * 0.52, -0.088];

const APPROACH = track([
  [0, [15, 8.2, 21], [0, 2.6, 0]],
  [0.08, [13, 6.6, 17.5], [0, 2.6, -0.4]],
  [0.17, [5, 3.7, 9], [0, 2.8, -1]],
  [0.235, [0.7, 2.85, 2.2], [0, TARGET[1], -1]],
  [CUT_IN, [0, TARGET[1], 0.3], [0, TARGET[1], -2]],
]);

const INSIDE = track([
  [CUT_IN, [0, 1.75, 8.2], [0, 1.4, 0]],
  [0.36, [-1.1, 2.4, 8.4], [0.2, 1.0, 0]],
  [0.46, [-2.2, 2.7, 8.2], [-1.6, 1.0, 0.6]],
  [0.6, [0.6, 3.1, 8.6], [0.6, 0.9, 0]],
  [0.76, [2.4, 2.8, 8.4], [0, 0.8, 0.8]],
  [0.86, [0.2, 2.1, 8.4], [0, 1.2, 0.4]],
  [CUT_OUT, [0, 1.8, 10.2], [0, 1.5, 0]],
]);

const LEAVE = track([
  [CUT_OUT, [0, TARGET[1], 0.5], [0, TARGET[1], -1]],
  [0.95, [2.2, 3.6, 8], [0, 2.6, -1]],
  [1, [13, 7.4, 19], [0, 2.6, 0]],
]);

const WARM_SKY = new THREE.Color("#fff3e6");
const COLD_SKY = new THREE.Color("#c4c8d4");
const NIGHT_SKY = new THREE.Color("#a48fe0");
const WARM_SUN = new THREE.Color("#ffd5a3");
const COLD_SUN = new THREE.Color("#c7cfe0");
const DAY_SUN = new THREE.Color("#fff0de");
const MOON = new THREE.Color("#b9a6ff");
const PAPER_C = new THREE.Color(PAPER);
const NIGHT_C = new THREE.Color("#24123f");

// A centred chapter on a wide screen still needs its picture below the words on a phone
const dropOf = (st: Station) => Math.abs(st.shift ?? 0.18) || 0.24;

// Off-stage: outside the front door, behind the wall
const AWAY: V3 = [-7.3, 2, Math.PI / 2];

// Reads the page: how far through the hero, or between which two chapters, the visitor is.
// 0 → 1 is the hero story; 1 + i + b is b of the way from station i to station i + 1.
function readScroll(els: Element[]) {
  const vh = window.innerHeight;
  const hero = els[0].getBoundingClientRect();
  if (hero.bottom > vh + 0.5) return clamp01(-hero.top / Math.max(1, hero.height - vh));
  const c = [hero.bottom - vh];
  for (let i = 1; i < els.length; i++) {
    const r = els[i].getBoundingClientRect();
    c.push(r.top + r.height / 2 - vh / 2);
  }
  let i = 0;
  while (i < c.length - 1 && c[i + 1] <= 0) i++;
  const b = i < c.length - 1 ? clamp01(-c[i] / (c[i + 1] - c[i])) : 0;
  return 1 + i + b;
}

function Story({ onFrame }: { onFrame: (f: WorldFrame) => void }) {
  const p = useRef(0);
  const ext = useRef<THREE.Group>(null!);
  const int = useRef<THREE.Group>(null!);
  const hemi = useRef<THREE.HemisphereLight>(null!);
  const sun = useRef<THREE.DirectionalLight>(null!);
  const lamp = useRef<THREE.PointLight>(null!);
  const rig = useRef({
    pos: new THREE.Vector3(),
    look: new THREE.Vector3(),
    a: new THREE.Vector3(),
    b: new THREE.Vector3(),
    helper: { x: 0, z: 0 },
    wasInside: false,
    els: [] as Element[],
    stations: [] as Station[],
    frames: 0,
    started: false,
  });
  const st = useRef<SceneState>({
    hero: true,
    t: 0,
    joined: 0,
    night: 0,
    door: null,
    tags: 0,
    agreed: 0,
    helper: { x: AWAY[0], z: AWAY[1], heading: AWAY[2], visible: true },
    walker: { x: 0, z: 5, heading: null, visible: false },
  });

  useFrame(({ camera, size, scene }, dt) => {
    const v = rig.current;
    const s = st.current;
    // The chapters on the page, looked up again now and then in case the layout changed
    if (v.frames++ % 90 === 0) {
      v.els = Array.from(document.querySelectorAll("[data-shot]"));
      v.stations = [HERO_END, ...v.els.slice(1).map((el) => STATIONS[(el as HTMLElement).dataset.shot ?? ""] ?? HERO_END)];
    }
    if (!v.els.length) return;
    const target = readScroll(v.els);
    // A jump (a link to a chapter far away) lands straight there instead of flying through the whole page
    if (!v.started || Math.abs(target - p.current) > 1.5) p.current = target;
    else p.current = THREE.MathUtils.damp(p.current, target, 6, Math.min(dt, 0.1));
    v.started = true;
    const S = p.current;

    let inside: boolean;
    let near = 1;
    let shift: number;
    // on a phone the words are always above the picture: how far down it sits
    let drop = 0;
    let flash = 0;

    if (S < 1) {
      // The hero story
      const t = S;
      s.hero = true;
      s.t = t;
      s.night = 0;
      s.door = null;
      s.tags = 0;
      s.walker.visible = false;
      inside = t >= CUT_IN && t < CUT_OUT;
      if (inside) {
        sample(INSIDE, t, v.pos, v.look);
        // Keep her in the shot while she works
        const follow = smooth(range(t, 0.43, 0.47)) * (1 - smooth(range(t, 0.85, 0.89)));
        walkAt(range(t, HELPER_START, HELPER_END), v.helper);
        v.look.x = lerp(v.look.x, v.helper.x, follow * 0.6);
        v.look.z = lerp(v.look.z, v.helper.z, follow * 0.4);
        v.pos.x = lerp(v.pos.x, v.helper.x * 0.55, follow * 0.6);
        shift = 0.16;
      } else if (t < CUT_IN) {
        sample(APPROACH, t, v.pos, v.look);
        near = 1 - range(t, 0.16, 0.25);
        shift = 0.2 * (1 - smooth(range(t, 0.05, 0.2)));
      } else {
        sample(LEAVE, t, v.pos, v.look);
        near = range(t, 0.92, 0.98);
        shift = 0.2 * smooth(range(t, 0.93, 1));
      }
    } else {
      // Between two chapters of the page
      const list = v.stations;
      const i = Math.min(list.length - 1, Math.floor(S - 1));
      const b = S - 1 - i;
      const A = list[i];
      const B = list[Math.min(i + 1, list.length - 1)];
      const e = smooth(b);
      s.hero = false;
      s.t = 1;
      let side = A;
      if (A.mode === B.mode) {
        v.pos.lerpVectors(v.a.set(...A.pos), v.b.set(...B.pos), e);
        v.look.lerpVectors(v.a.set(...A.look), v.b.set(...B.look), e);
        s.night = lerp(A.night ?? 0, B.night ?? 0, e);
        s.joined = lerp(A.joined ?? 1, B.joined ?? 1, e);
        s.door = lerp(A.door ?? 0, B.door ?? 0, e);
        s.tags = lerp(A.tags === undefined ? 0 : 1, B.tags === undefined ? 0 : 1, e);
        s.agreed = lerp(A.tags ?? 1, B.tags ?? 1, e);
        const ha = A.helper ?? AWAY;
        const hb = B.helper ?? AWAY;
        s.helper.x = lerp(ha[0], hb[0], e);
        s.helper.z = lerp(ha[1], hb[1], e);
        s.helper.heading = e < 0.5 ? ha[2] : hb[2];
        if (b > 0.5) side = B;
      } else {
        // From outside to in, or back: lean in towards the shot, cut behind a flash, ease out of the next
        side = b < 0.5 ? A : B;
        const k = b < 0.5 ? smooth(b * 2) : 1 - smooth((b - 0.5) * 2);
        v.look.set(...side.look);
        v.pos.set(...side.pos).lerp(v.look, 0.35 * k);
        flash = smooth(clamp01(1.4 - Math.abs(b - 0.5) / 0.12));
        s.night = side.night ?? 0;
        s.joined = side.joined ?? 1;
        s.door = side.door ?? 0;
        s.tags = side.tags === undefined ? 0 : 1;
        s.agreed = side.tags ?? 1;
        const h = side.helper ?? AWAY;
        s.helper.x = h[0];
        s.helper.z = h[1];
        s.helper.heading = h[2];
      }
      inside = side.mode === "int";
      shift = lerp(A.shift ?? 0.18, B.shift ?? 0.18, e);
      drop = lerp(dropOf(A), dropOf(B), e);

      // From outside, the helper walks in through the gate as the visitor scrolls past "How it works"
      const w = list.findIndex((x) => x.walker);
      const u = w < 0 ? 0 : smooth(range(S - 1, w - 0.55, w + 0.4));
      s.walker.visible = !inside && w >= 0 && Math.abs(S - 1 - w) < 0.75;
      s.walker.x = 0.2;
      s.walker.z = lerp(5.6, 0.95, u);
      s.walker.heading = u >= 1 ? Math.PI : null;
    }

    if (S < 1) drop = shift;
    onFrame({ hero: Math.min(S, 1), shot: S, flash });

    ext.current.visible = !inside;
    int.current.visible = inside;
    if (inside !== v.wasInside) {
      // A tighter shadow box indoors keeps the edges of the sunlight crisp
      v.wasInside = inside;
      const box = sun.current.shadow.camera;
      const r = inside ? 7.5 : 12;
      box.left = box.bottom = -r;
      box.right = box.top = r;
      box.updateProjectionMatrix();
    }

    // Phones see the same shots from further back, so the scene still fits
    const aspect = size.width / size.height;
    const fit = Math.min(inside ? 1.7 : 1.9, Math.max(1, 1.3 / aspect));
    v.pos.sub(v.look).multiplyScalar(1 + (fit - 1) * near).add(v.look);
    camera.position.copy(v.pos);
    camera.lookAt(v.look);

    // Leave room for the words: the scene sits right of them on wide screens, below them on phones
    const cam = camera as THREE.PerspectiveCamera;
    if (aspect >= 1) cam.setViewOffset(size.width, size.height, -size.width * shift, 0, size.width, size.height);
    else cam.setViewOffset(size.width, size.height, 0, -size.height * drop * (inside ? -0.6 : 1.25), size.width, size.height);

    const bg = scene.background as THREE.Color;
    if (inside) {
      const c = s.hero ? smooth(range(S, 0.47, 0.84)) : 1;
      hemi.current.intensity = lerp(0.45, 0.9, c);
      hemi.current.color.copy(COLD_SKY).lerp(WARM_SKY, c);
      sun.current.position.set(-3, 7.5, -13);
      sun.current.color.copy(COLD_SUN).lerp(WARM_SUN, c);
      sun.current.intensity = lerp(1.4, 3.6, c);
      lamp.current.intensity = 9 * (s.hero ? smooth(range(S, 0.72, 0.84)) : 1);
      scene.environmentIntensity = lerp(0.3, 0.65, c);
      bg.copy(PAPER_C);
    } else {
      // Day over the society, or night falling on it
      const n = s.night;
      hemi.current.intensity = lerp(0.95, 0.28, n);
      hemi.current.color.copy(WARM_SKY).lerp(NIGHT_SKY, n);
      sun.current.position.set(9, 15, 11);
      sun.current.color.copy(DAY_SUN).lerp(MOON, n);
      sun.current.intensity = lerp(2.6, 0.45, n);
      lamp.current.intensity = 0;
      scene.environmentIntensity = lerp(0.75, 0.2, n);
      bg.copy(PAPER_C).lerp(NIGHT_C, n);
    }
    scene.fog?.color.copy(bg);
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#fff3e6", "#d8cfe2", 0.9]} />
      <directionalLight
        ref={sun}
        castShadow
        position={[9, 15, 11]}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={1}
        shadow-camera-far={50}
      />
      <pointLight ref={lamp} position={[-2.1, 1.5, -3.1]} color="#ffcf96" intensity={0} distance={9} decay={2} />
      <group ref={ext}>
        <Exterior st={st} />
      </group>
      <group ref={int} visible={false}>
        <Interior st={st} />
      </group>
    </>
  );
}

/* ---------------------------------------------------------------- exterior */

const TOWERS = [
  { x: -3.5, z: 0.5, floors: 8, w: 2.0, d: 1.7 },
  { x: 0, z: -1, floors: 11, w: 2.2, d: 1.8 },
  { x: 3.5, z: -0.2, floors: 7, w: 2.0, d: 1.7 },
];

const TREES: V3[] = [
  [-6.2, 0, 2.4], [-5.4, 0, -1.6], [-1.8, 0, 2.6], [1.9, 0, 2.2], [5.8, 0, 1.9],
  [6.1, 0, -2.2], [-2.0, 0, -2.6], [2.1, 0, -3.1], [-7.4, 0, 0.2], [7.5, 0, 0.4],
];

const GLASS = new THREE.Color("#6d667e");
const WARM = new THREE.Color("#f6dcae");
const WARM_GLOW = new THREE.Color("#e8a75c");
const LILAC = new THREE.Color("#cdb8ff");
const LILAC_GLOW = new THREE.Color("#7a4fe0");
const NIGHT_LAND = new THREE.Color("#2a1a48");

type Win = { pos: V3; rot: number; target: boolean; lit: boolean; dist: number; mat: THREE.MeshStandardMaterial };

function Exterior({ st }: { st: StateRef }) {
  const windows = useMemo<Win[]>(() => {
    const rnd = seeded(11);
    const list: Win[] = [];
    TOWERS.forEach((tw, ti) => {
      const sx = tw.w / 2.2;
      for (let f = 1; f < tw.floors; f++) {
        const y = f * FH + FH * 0.52;
        [-0.62, 0, 0.62].forEach((ox, i) => {
          const target = ti === 1 && f === 6 && i === 1;
          list.push(makeWin([tw.x + ox * sx, y, tw.z + tw.d / 2 + 0.012], 0, target, rnd));
        });
        [-0.42, 0.42].forEach((oz) => list.push(makeWin([tw.x + tw.w / 2 + 0.012, y, tw.z + oz * (tw.d / 1.8)], Math.PI / 2, false, rnd)));
      }
    });
    return list;
  }, []);

  // The ground under the society, which darkens as night falls
  const land = useMemo(
    () =>
      ["#ece6dc", "#e6dfd3", "#d9d1c4", "#dfd8cc"].map(
        (c) => [new THREE.Color(c), new THREE.MeshStandardMaterial({ color: c, roughness: 0.95 })] as const,
      ),
    [],
  );

  useFrame(() => {
    const s = st.current;
    const t = s.t;
    if (s.hero && t >= CUT_IN && t < CUT_OUT) return;
    for (const [day, mat] of land) mat.color.copy(day).lerp(NIGHT_LAND, s.night * 0.85);
    for (const w of windows) {
      // Before: a few flats lit here and there, each on its own. After: every flat, together.
      let warm: number;
      let joined: number;
      if (s.hero) {
        warm = w.target ? 0.55 + 0.45 * range(t, 0.08, 0.24) : w.lit ? 1 : 0;
        joined = t >= CUT_OUT ? smooth(range(t, 0.915 + w.dist * 0.0075, 0.94 + w.dist * 0.0075)) : 0;
      } else {
        warm = w.target || w.lit ? 1 : 0;
        joined = smooth(clamp01(s.joined * 1.7 - w.dist * 0.09));
      }
      w.mat.color.copy(GLASS).lerp(WARM, warm * (1 - joined)).lerp(LILAC, joined);
      w.mat.emissive.copy(WARM_GLOW).lerp(LILAC_GLOW, joined);
      // Three.js materials are meant to be changed in place every frame; React never renders from them
      // eslint-disable-next-line react-hooks/immutability
      w.mat.emissiveIntensity = Math.max(warm * (1 - joined) * 0.8, joined * 1.6) * (1 + s.night * 0.7);
    }
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow material={land[0][1]}>
        <planeGeometry args={[260, 260]} />
      </mesh>
      {/* the compound: podium, inner path, the road in */}
      <mesh position={[0, 0.06, -0.2]} receiveShadow castShadow material={land[1][1]}>
        <boxGeometry args={[13, 0.12, 7.4]} />
      </mesh>
      <mesh position={[0, 0.125, 2.4]} rotation-x={-Math.PI / 2} receiveShadow material={land[2][1]}>
        <planeGeometry args={[1.5, 4.2]} />
      </mesh>
      <mesh position={[0, 0.005, 18]} rotation-x={-Math.PI / 2} receiveShadow material={land[3][1]}>
        <planeGeometry args={[2.2, 28]} />
      </mesh>

      <Gate />
      {TOWERS.map((tw) => (
        <Tower key={tw.x} {...tw} />
      ))}
      {windows.map((w, i) => (
        <mesh key={i} position={w.pos} rotation-y={w.rot} material={w.mat}>
          <planeGeometry args={[0.44, 0.24]} />
        </mesh>
      ))}
      {TREES.map((pos, i) => (
        <Tree key={i} position={pos} scale={0.85 + ((i * 37) % 10) / 22} />
      ))}
      <RateTags st={st} />
      <Helper st={st} source="walker" scale={0.2} />
    </group>
  );
}

// A rate tag hanging under some of the flats' windows
const TAG_TONES = ["#f3d9c4", "#c9b6f2", "#f7f4ee", "#e4dccd"];
const TAG_SPOTS = TOWERS.flatMap((tw, ti) =>
  [2, 4, 6, 8]
    .filter((f) => f < tw.floors)
    .flatMap((f) =>
      [-0.62, 0.62].map((ox, bi) => {
        const n = ti * 8 + f + bi;
        return {
          pos: [tw.x + ox * (tw.w / 2.2), f * FH + FH * 0.3, tw.z + tw.d / 2 + 0.2] as V3,
          tilt: ((n * 37) % 11) / 11 - 0.5,
          width: 0.25 + (((n * 53) % 13) / 13) * 0.6,
          tone: TAG_TONES[n % TAG_TONES.length],
        };
      }),
    ),
);
// the agreed rate is marigold, the complement of the violet night, so it reads at a glance
const TAG_AGREED = new THREE.Color("#f2b33d");
const TAG_BAR = new THREE.Color("#3d2d63");
const TAG_AGREED_BAR = new THREE.Color("#24123f");

function RateTags({ st }: { st: StateRef }) {
  const tags = useMemo(
    () =>
      TAG_SPOTS.map((t) => ({
        ...t,
        tone: new THREE.Color(t.tone),
        plate: new THREE.MeshStandardMaterial({ color: t.tone, roughness: 0.6, emissive: t.tone, emissiveIntensity: 0.35 }),
        bar: new THREE.MeshBasicMaterial({ color: TAG_BAR }),
      })),
    [],
  );
  const groups = useRef<(THREE.Group | null)[]>([]);
  const bars = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const s = st.current;
    tags.forEach((t, i) => {
      const g = groups.current[i];
      const bar = bars.current[i];
      if (!g || !bar) return;
      const show = smooth(clamp01(s.tags * 1.6 - i * 0.02));
      g.visible = show > 0.01;
      g.scale.setScalar(Math.max(0.001, show * 1.7));
      // one by one, each flat's tag straightens into the society's rate
      const k = smooth(clamp01(s.agreed * 1.7 - i * 0.03));
      g.rotation.z = t.tilt * 0.5 * (1 - k);
      bar.scale.x = lerp(t.width, 0.62, k);
      bar.position.x = -0.14 + (bar.scale.x * 0.3) / 2;
      t.plate.color.copy(t.tone).lerp(TAG_AGREED, k);
      t.plate.emissive.copy(t.tone).lerp(TAG_AGREED, k);
      t.bar.color.copy(TAG_BAR).lerp(TAG_AGREED_BAR, k);
      // the agreed tags glow a little brighter, so the one rate reads from across the night
      t.plate.emissiveIntensity = lerp(0.35, 0.75, k);
    });
  });

  return (
    <group>
      {tags.map((t, i) => (
        <group
          key={i}
          ref={(g) => {
            groups.current[i] = g;
          }}
          position={t.pos}
          visible={false}
        >
          <mesh position={[0, -0.045, 0]}>
            <boxGeometry args={[0.006, 0.09, 0.006]} />
            <meshBasicMaterial color="#cdb8ff" />
          </mesh>
          <RoundedBox args={[0.38, 0.14, 0.02]} radius={0.02} smoothness={3} position={[0, -0.16, 0]} material={t.plate} />
          <mesh position={[-0.155, -0.16, 0.012]} material={t.bar}>
            <circleGeometry args={[0.022, 16]} />
          </mesh>
          <mesh
            ref={(m) => {
              bars.current[i] = m;
            }}
            position={[-0.05, -0.16, 0.012]}
            material={t.bar}
          >
            <planeGeometry args={[0.3, 0.03]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function makeWin(pos: V3, rot: number, target: boolean, rnd: () => number): Win {
  return {
    pos,
    rot,
    target,
    lit: !target && rnd() < 0.3,
    dist: Math.hypot(pos[0] - TARGET[0], pos[1] - TARGET[1], pos[2] - TARGET[2]),
    mat: new THREE.MeshStandardMaterial({ color: GLASS, roughness: 0.18, metalness: 0.2 }),
  };
}

function Tower({ x, z, floors, w, d }: { x: number; z: number; floors: number; w: number; d: number }) {
  const sx = w / 2.2;
  const height = floors * FH;
  return (
    <group position={[x, 0.12, z]}>
      {/* lobby */}
      <mesh position={[0, FH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w - 0.2, FH, d - 0.2]} />
        <meshStandardMaterial color="#5b5170" roughness={0.25} metalness={0.3} />
      </mesh>
      {Array.from({ length: floors - 1 }, (_, i) => {
        const f = i + 1;
        return (
          <group key={f} position={[0, f * FH, 0]}>
            <mesh position={[0, FH / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[w, FH - 0.05, d]} />
              <meshStandardMaterial color="#f1ebe1" roughness={0.85} />
            </mesh>
            <mesh position={[0, 0, 0.04]} castShadow receiveShadow>
              <boxGeometry args={[w + 0.08, 0.05, d + 0.08]} />
              <meshStandardMaterial color="#ddd4c6" roughness={0.8} />
            </mesh>
          </group>
        );
      })}
      {/* vertical fins between the bays */}
      {[-0.93, -0.31, 0.31, 0.93].map((fx) => (
        <mesh key={fx} position={[fx * sx, (height + FH) / 2, d / 2 + 0.05]} castShadow>
          <boxGeometry args={[0.05, height - FH, 0.1]} />
          <meshStandardMaterial color="#e2d9cb" roughness={0.8} />
        </mesh>
      ))}
      {/* roof */}
      <mesh position={[0, height + 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[w + 0.12, 0.12, d + 0.12]} />
        <meshStandardMaterial color="#d8cfc1" roughness={0.8} />
      </mesh>
      <mesh position={[w * 0.18, height + 0.32, -d * 0.15]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.5]} />
        <meshStandardMaterial color="#e7e0d4" roughness={0.85} />
      </mesh>
    </group>
  );
}

function Gate() {
  return (
    <group position={[0, 0, 3.7]}>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * 0.95, 0.55, 0]} castShadow>
            <boxGeometry args={[0.22, 1.1, 0.22]} />
            <meshStandardMaterial color="#e9e2d6" roughness={0.8} />
          </mesh>
          <mesh position={[s * 3.95, 0.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[5.8, 0.4, 0.14]} />
            <meshStandardMaterial color="#e3dbce" roughness={0.9} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[2.2, 0.1, 0.2]} />
        <meshStandardMaterial color="#4a2189" roughness={0.45} />
      </mesh>
    </group>
  );
}

function Tree({ position, scale }: { position: V3; scale: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.5, 6]} />
        <meshStandardMaterial color="#8a7158" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.95, 0]} castShadow>
        <coneGeometry args={[0.36, 1.35, 7]} />
        <meshStandardMaterial color="#8e9a83" roughness={0.85} flatShading />
      </mesh>
    </group>
  );
}

/* ---------------------------------------------------------------- interior */

type Item = {
  kind: "cushion" | "paper" | "plate" | "cup" | "cloth";
  color: string;
  from: [V3, V3];
  to: [V3, V3];
  at: [number, number];
  arc: number;
};

const P2 = Math.PI / 2;

// Where each thing has ended up, where it belongs, and when (in the helper's time, 0 → 1) she puts it back
const ITEMS: Item[] = [
  // clothes into the basket by the door
  { kind: "cloth", color: "#8d9a84", from: [[-3.05, 0.52, -0.55], [0.25, 0.7, 0.3]], to: [[-4.6, 0.45, 0.9], [0, 0.2, 0]], at: [0.17, 0.24], arc: 0.6 },
  { kind: "cloth", color: "#c29a9a", from: [[-2.5, 0.03, 1.9], [0.08, 1.2, 0.05]], to: [[-4.6, 0.505, 0.9], [0, -0.1, 0]], at: [0.18, 0.25], arc: 0.7 },
  { kind: "cloth", color: "#3c3f63", from: [[0.9, 0.6, -2.75], [0.15, -0.4, 0.12]], to: [[-4.6, 0.56, 0.9], [0, 0.35, 0]], at: [0.19, 0.26], arc: 0.9 },
  // cushions back onto the sofa
  { kind: "cushion", color: "#b9a6dc", from: [[-1.4, 0.1, 1.15], [-1.45, 0, 0.5]], to: [[-1.15, 0.8, -2.95], [-0.25, 0.15, 0]], at: [0.27, 0.33], arc: 0.6 },
  { kind: "cushion", color: "#efe8dc", from: [[-0.65, 0.1, 2.05], [-1.5, 0, -0.9]], to: [[1.15, 0.8, -2.95], [-0.25, -0.15, 0]], at: [0.28, 0.34], arc: 0.7 },
  { kind: "cushion", color: "#6b4aa8", from: [[1.7, 0.1, -1.1], [-1.3, 0, 1.2]], to: [[0, 0.78, -3.0], [-0.25, 0, 0.1]], at: [0.29, 0.35], arc: 0.5 },
  // papers into a pile on the table
  { kind: "paper", color: "#f4f1ea", from: [[-0.9, 0.026, 1.6], [0, 0.4, 0]], to: [[0.75, 0.462, 0.38], [0, 0.1, 0]], at: [0.36, 0.4], arc: 0.4 },
  { kind: "paper", color: "#f1ede4", from: [[-0.25, 0.026, 2.0], [0, -0.7, 0]], to: [[0.75, 0.47, 0.38], [0, 0.06, 0]], at: [0.37, 0.41], arc: 0.4 },
  { kind: "paper", color: "#f4f1ea", from: [[0.45, 0.026, 1.9], [0, 1.1, 0]], to: [[0.75, 0.478, 0.38], [0, 0.13, 0]], at: [0.38, 0.42], arc: 0.4 },
  { kind: "paper", color: "#efebe2", from: [[2.9, 0.006, 2.4], [0, -0.3, 0]], to: [[0.75, 0.486, 0.38], [0, 0.09, 0]], at: [0.39, 0.43], arc: 0.5 },
  // dishes to the rack and the shelf
  { kind: "plate", color: "#f3f0ea", from: [[0.05, 0.47, 0.55], [0, 0, 0]], to: [[5.25, 1.15, -2.9], [P2, 0, 0]], at: [0.45, 0.53], arc: 0.9 },
  { kind: "plate", color: "#eeeae2", from: [[0.3, 0.495, 0.62], [0.08, 0, 0.05]], to: [[5.25, 1.15, -2.82], [P2, 0, 0]], at: [0.47, 0.55], arc: 0.9 },
  { kind: "plate", color: "#f3f0ea", from: [[0.75, 0.47, 0.85], [0, 0, 0]], to: [[5.25, 1.15, -2.74], [P2, 0, 0]], at: [0.49, 0.57], arc: 0.9 },
  { kind: "plate", color: "#eeeae2", from: [[-0.25, 0.47, 0.9], [0, 0, 0]], to: [[5.25, 1.15, -2.66], [P2, 0, 0]], at: [0.5, 0.58], arc: 0.9 },
  { kind: "plate", color: "#f3f0ea", from: [[1.3, 0.015, 1.4], [0, 0, 0]], to: [[5.25, 1.15, -2.58], [P2, 0, 0]], at: [0.51, 0.59], arc: 1 },
  { kind: "cup", color: "#b9a6dc", from: [[1.05, 0.505, 0.6], [0, 0, 0]], to: [[5.62, 2.07, -1.05], [0, 0, 0]], at: [0.52, 0.6], arc: 0.8 },
  { kind: "cup", color: "#f0ebe2", from: [[1.4, 0.08, 1.2], [0, 0.5, P2]], to: [[5.62, 2.07, -0.8], [0, 0, 0]], at: [0.53, 0.61], arc: 0.8 },
];

// Marks on the floor, cleaned as the mop passes over them
const STAINS: [number, number, number][] = [
  [-2.0, 2.65, 0.34], [-1.0, 3.25, 0.26], [0.2, 2.75, 0.4], [1.2, 3.3, 0.3], [2.0, 2.55, 0.28], [-0.4, 2.35, 0.22],
];

const DULL_FLOOR = new THREE.Color("#b8ad9f");
const CLEAN_FLOOR = new THREE.Color("#ffffff");
const DULL_WALL = new THREE.Color("#d9d3ca");
const CLEAN_WALL = new THREE.Color("#f6f1e9");
const DULL_SKY = new THREE.Color("#9c9ba6");
const CLEAN_SKY = new THREE.Color("#ffffff");

function Interior({ st }: { st: StateRef }) {
  const floorTex = useMemo(() => plankTexture(), []);
  const skyTex = useMemo(() => skyTexture(), []);
  const artTex = useMemo(() => artTexture(), []);
  const mats = useMemo(
    () => ({
      floor: new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.9 }),
      wall: new THREE.MeshStandardMaterial({ color: DULL_WALL, roughness: 0.95 }),
      sky: new THREE.MeshBasicMaterial({ map: skyTex, fog: false, toneMapped: false }),
      walnut: new THREE.MeshStandardMaterial({ color: "#8c6a4e", roughness: 0.5 }),
      boucle: new THREE.MeshStandardMaterial({ color: "#ebe5da", roughness: 1 }),
      lilacBoucle: new THREE.MeshStandardMaterial({ color: "#cbbbe3", roughness: 1 }),
      marble: new THREE.MeshStandardMaterial({ color: "#f3f0ea", roughness: 0.25 }),
      lampShade: new THREE.MeshStandardMaterial({ color: "#f4efe6", roughness: 0.8, emissive: "#ffcf96", emissiveIntensity: 0 }),
    }),
    [floorTex, skyTex],
  );
  const door = useRef<THREE.Group>(null!);
  const chair = useRef<THREE.Group>(null!);
  const items = useRef<(THREE.Mesh | null)[]>([]);
  const stains = useRef<(THREE.Mesh | null)[]>([]);
  const dust = useRef<THREE.Points>(null!);
  const tmp = useRef({ a: new THREE.Quaternion(), b: new THREE.Quaternion(), e: new THREE.Euler() });
  const dustGeo = useMemo(() => {
    const rnd = seeded(5);
    const pts = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      pts[i * 3] = -5.5 + rnd() * 11;
      pts[i * 3 + 1] = 0.2 + rnd() * 3.3;
      pts[i * 3 + 2] = -3.6 + rnd() * 7;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pts, 3));
    return g;
  }, []);
  const dot = useMemo(() => dotTexture(), []);

  // Three.js materials are meant to be changed in place every frame; React never renders from them
  // eslint-disable-next-line react-hooks/immutability
  useFrame(({ clock }) => {
    const s = st.current;
    // Once the story has played, the flat stays as she left it
    const t = s.hero ? s.t : HELPER_END;
    if (s.hero && (t < CUT_IN || t >= CUT_OUT)) return;
    const h = range(t, HELPER_START, HELPER_END);
    const clean = smooth(range(t, 0.47, 0.84));

    mats.floor.color.copy(DULL_FLOOR).lerp(CLEAN_FLOOR, clean);
    // eslint-disable-next-line react-hooks/immutability
    mats.floor.roughness = lerp(0.95, 0.42, smooth(range(h, 0.7, 0.95)));
    mats.wall.color.copy(DULL_WALL).lerp(CLEAN_WALL, clean);
    mats.sky.color.copy(DULL_SKY).lerp(CLEAN_SKY, clean);
    mats.lampShade.emissiveIntensity = 1.2 * smooth(range(t, 0.72, 0.84));

    door.current.rotation.y = 1.45 * (s.door ?? smooth(range(h, 0.0, 0.07)) * (1 - smooth(range(h, 0.17, 0.24))));

    ITEMS.forEach((it, i) => {
      const m = items.current[i];
      if (!m) return;
      const k = smooth(range(h, it.at[0], it.at[1]));
      m.position.set(
        lerp(it.from[0][0], it.to[0][0], k),
        lerp(it.from[0][1], it.to[0][1], k) + Math.sin(Math.PI * k) * it.arc,
        lerp(it.from[0][2], it.to[0][2], k),
      );
      const q = tmp.current;
      q.a.setFromEuler(q.e.set(...it.from[1]));
      q.b.setFromEuler(q.e.set(...it.to[1]));
      m.quaternion.slerpQuaternions(q.a, q.b, k);
    });

    // The chair she sets back on its feet
    const up = smooth(range(h, 0.62, 0.68));
    chair.current.rotation.z = lerp(P2 * 0.98, 0, up);
    chair.current.position.y = lerp(0.24, 0, up) + Math.sin(Math.PI * up) * 0.15;

    // The mop sweeps right to left between 0.72 and 0.82
    STAINS.forEach(([sx], i) => {
      const m = stains.current[i];
      if (!m) return;
      const t0 = 0.72 + ((2.4 - sx) / 4.8) * 0.1;
      (m.material as THREE.MeshBasicMaterial).opacity = 0.42 * (1 - smooth(range(h, t0, t0 + 0.035)));
    });

    const dm = dust.current.material as THREE.PointsMaterial;
    dm.opacity = lerp(0.75, 0.12, clean);
    dust.current.position.y = Math.sin(clock.elapsedTime * 0.25) * 0.08;
    dust.current.rotation.y = clock.elapsedTime * 0.01;
  });

  return (
    <group>
      {/* the room */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 1.5]} receiveShadow material={mats.floor}>
        <planeGeometry args={[12.4, 11]} />
      </mesh>
      <mesh position={[0, 3.85, 0.5]} castShadow material={mats.wall}>
        <boxGeometry args={[12.4, 0.1, 9]} />
      </mesh>
      {/* back wall, around the big window */}
      <Wall position={[-4.3, 1.9, -4.1]} size={[3.8, 3.8, 0.2]} material={mats.wall} />
      <Wall position={[4.3, 1.9, -4.1]} size={[3.8, 3.8, 0.2]} material={mats.wall} />
      <Wall position={[0, 0.45, -4.1]} size={[4.8, 0.9, 0.2]} material={mats.wall} />
      <Wall position={[0, 3.5, -4.1]} size={[4.8, 0.6, 0.2]} material={mats.wall} />
      {/* window frame */}
      {[
        [0, 0.92, -4.0, 4.8, 0.05, 0.12],
        [0, 3.18, -4.0, 4.8, 0.05, 0.12],
        [-2.38, 2.05, -4.0, 0.05, 2.3, 0.12],
        [2.38, 2.05, -4.0, 0.05, 2.3, 0.12],
        [0, 2.05, -4.0, 0.04, 2.3, 0.08],
      ].map(([x, y, z, w, hh, d], i) => (
        <mesh key={i} position={[x, y, z]} material={mats.walnut} castShadow>
          <boxGeometry args={[w, hh, d]} />
        </mesh>
      ))}
      <mesh position={[0, 2.6, -13]} material={mats.sky}>
        <planeGeometry args={[34, 17]} />
      </mesh>
      {/* sheer curtains */}
      {[-2.75, 2.75].map((x) => (
        <mesh key={x} position={[x, 2.0, -3.85]}>
          <boxGeometry args={[0.7, 3.4, 0.04]} />
          <meshStandardMaterial color="#f3eef8" roughness={1} transparent opacity={0.85} />
        </mesh>
      ))}
      {/* left wall, with the front door */}
      <Wall position={[-6.1, 1.9, -1.3]} size={[0.2, 3.8, 5.4]} material={mats.wall} />
      <Wall position={[-6.1, 1.9, 3.8]} size={[0.2, 3.8, 2.4]} material={mats.wall} />
      <Wall position={[-6.1, 3.1, 2.0]} size={[0.2, 1.4, 1.2]} material={mats.wall} />
      <mesh position={[-7.6, 1.5, 2.0]} rotation-y={P2}>
        <planeGeometry args={[4, 4]} />
        <meshBasicMaterial color="#f6ead9" toneMapped={false} />
      </mesh>
      <group ref={door} position={[-5.98, 0, 1.4]}>
        <mesh position={[0, 1.2, 0.6]} castShadow material={mats.walnut}>
          <boxGeometry args={[0.06, 2.4, 1.2]} />
        </mesh>
        <mesh position={[0.06, 1.1, 1.05]}>
          <boxGeometry args={[0.05, 0.03, 0.14]} />
          <meshStandardMaterial color="#c9b37f" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
      {/* art */}
      <mesh position={[-5.98, 2.1, -1.6]} rotation-y={P2}>
        <planeGeometry args={[1.5, 1.05]} />
        <meshStandardMaterial map={artTex} roughness={0.9} />
      </mesh>
      {/* right wall and kitchen */}
      <Wall position={[6.1, 1.9, 0.5]} size={[0.2, 3.8, 9]} material={mats.wall} />
      <mesh position={[5.3, 0.45, -1.5]} castShadow receiveShadow material={mats.walnut}>
        <boxGeometry args={[1.2, 0.9, 4]} />
      </mesh>
      <mesh position={[5.3, 0.93, -1.5]} castShadow receiveShadow material={mats.marble}>
        <boxGeometry args={[1.26, 0.06, 4.06]} />
      </mesh>
      <mesh position={[5.3, 0.94, -0.6]}>
        <boxGeometry args={[0.7, 0.02, 0.55]} />
        <meshStandardMaterial color="#8d8a88" metalness={0.7} roughness={0.25} />
      </mesh>
      <mesh position={[5.75, 1.15, -0.6]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial color="#2b2730" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* dish rack */}
      <mesh position={[5.25, 0.98, -2.74]} castShadow>
        <boxGeometry args={[0.42, 0.03, 0.55]} />
        <meshStandardMaterial color="#3a3540" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* open shelf */}
      <mesh position={[5.7, 2.0, -1.2]} castShadow material={mats.walnut}>
        <boxGeometry args={[0.6, 0.05, 2.2]} />
      </mesh>
      {[[-1.9, "#e9e3d8", 0.3], [-1.6, "#cbbbe3", 0.22], [-0.3, "#f4efe6", 0.26]].map(([z, c, hh]) => (
        <mesh key={z as number} position={[5.72, 2.025 + (hh as number) / 2, z as number]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, hh as number, 20]} />
          <meshStandardMaterial color={c as string} roughness={0.6} />
        </mesh>
      ))}

      {/* living area */}
      <RoundedBox args={[4.6, 0.02, 3.2]} radius={0.01} position={[0.3, 0.01, 0.6]} receiveShadow>
        <meshStandardMaterial color="#d6cbe5" roughness={1} />
      </RoundedBox>
      <Sofa mats={mats} />
      <group position={[0.3, 0, 0.6]}>
        <RoundedBox args={[1.7, 0.07, 0.95]} radius={0.03} position={[0, 0.42, 0]} castShadow receiveShadow material={mats.walnut} />
        {[-0.65, 0.65].map((x) => (
          <mesh key={x} position={[x, 0.2, 0]} castShadow material={mats.walnut}>
            <boxGeometry args={[0.08, 0.4, 0.8]} />
          </mesh>
        ))}
      </group>
      <group position={[-3.1, 0, -0.6]} rotation-y={0.7}>
        <RoundedBox args={[1.05, 0.45, 0.95]} radius={0.12} position={[0, 0.25, 0]} castShadow receiveShadow material={mats.lilacBoucle} />
        <RoundedBox args={[1.05, 0.62, 0.24]} radius={0.1} position={[0, 0.65, -0.38]} castShadow material={mats.lilacBoucle} />
      </group>
      {/* basket */}
      <mesh position={[-4.6, 0.21, 0.9]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.3, 0.42, 24]} />
        <meshStandardMaterial color="#b5966d" roughness={0.95} />
      </mesh>
      {/* floor lamp */}
      <group position={[-2.1, 0, -3.1]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 1.6, 8]} />
          <meshStandardMaterial color="#2b2730" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.2, 0.22, 0.04, 20]} />
          <meshStandardMaterial color="#2b2730" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1.66, 0]} material={mats.lampShade}>
          <cylinderGeometry args={[0.2, 0.28, 0.34, 24, 1, true]} />
        </mesh>
      </group>
      {/* plant */}
      <group position={[-5.2, 0, -3.3]}>
        <mesh position={[0, 0.27, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.24, 0.54, 20]} />
          <meshStandardMaterial color="#b9876b" roughness={0.9} />
        </mesh>
        {Array.from({ length: 11 }, (_, i) => {
          const a = (i / 11) * Math.PI * 2 + i * 0.4;
          const lean = 0.35 + (i % 3) * 0.18;
          return (
            <group key={i} position={[0, 0.5, 0]} rotation={[0, a, lean]}>
              <mesh position={[0, 0.5 + (i % 4) * 0.08, 0]} scale={[0.13, 0.5, 0.035]} castShadow>
                <sphereGeometry args={[1, 14, 10]} />
                <meshStandardMaterial color={i % 2 ? "#7d8f6c" : "#6c7f5d"} roughness={0.7} />
              </mesh>
            </group>
          );
        })}
      </group>

      <group ref={chair} position={[2.7, 0.24, 1.9]} rotation-y={-0.5}>
        <DiningChair walnut={mats.walnut} />
      </group>

      {ITEMS.map((it, i) => {
        const setRef = (m: THREE.Mesh | null) => {
          items.current[i] = m;
        };
        const soft = it.kind === "cushion" || it.kind === "cloth";
        const material = <meshStandardMaterial color={it.color} roughness={soft || it.kind === "paper" ? 0.95 : 0.3} />;
        return soft ? (
          <RoundedBox
            key={i}
            ref={setRef}
            args={it.kind === "cushion" ? [0.5, 0.46, 0.17] : [0.6, 0.05, 0.42]}
            radius={it.kind === "cushion" ? 0.08 : 0.022}
            smoothness={4}
            castShadow
            receiveShadow
          >
            {material}
          </RoundedBox>
        ) : (
          <mesh key={i} ref={setRef} castShadow receiveShadow>
            <ItemGeometry kind={it.kind} />
            {material}
          </mesh>
        );
      })}

      {STAINS.map(([x, z, r], i) => (
        <mesh key={i} ref={(m) => { stains.current[i] = m; }} position={[x, 0.004, z]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[r, 28]} />
          <meshBasicMaterial color="#5a4c40" transparent opacity={0.42} depthWrite={false} />
        </mesh>
      ))}

      <points ref={dust} geometry={dustGeo}>
        <pointsMaterial map={dot} color="#8f877d" size={0.05} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
      </points>

      <Helper st={st} source="helper" />
    </group>
  );
}

function Wall({ position, size, material }: { position: V3; size: V3; material: THREE.Material }) {
  return (
    <mesh position={position} castShadow receiveShadow material={material}>
      <boxGeometry args={size} />
    </mesh>
  );
}

function ItemGeometry({ kind }: { kind: Item["kind"] }) {
  switch (kind) {
    case "plate":
      return <cylinderGeometry args={[0.17, 0.15, 0.025, 28]} />;
    case "cup":
      return <cylinderGeometry args={[0.06, 0.05, 0.1, 18]} />;
    default:
      return <boxGeometry args={[0.42, 0.006, 0.3]} />;
  }
}

function Sofa({ mats }: { mats: { boucle: THREE.Material; walnut: THREE.Material } }) {
  return (
    <group position={[0, 0, -2.85]}>
      <RoundedBox args={[3.4, 0.4, 1.0]} radius={0.08} position={[0, 0.28, 0]} castShadow receiveShadow material={mats.boucle} />
      {[-0.82, 0.82].map((x) => (
        <RoundedBox key={x} args={[1.6, 0.16, 0.86]} radius={0.07} position={[x, 0.55, 0.05]} castShadow receiveShadow material={mats.boucle} />
      ))}
      <RoundedBox args={[3.4, 0.62, 0.26]} radius={0.1} position={[0, 0.75, -0.38]} castShadow material={mats.boucle} />
      {[-1.72, 1.72].map((x) => (
        <RoundedBox key={x} args={[0.26, 0.55, 1.0]} radius={0.1} position={[x, 0.5, 0]} castShadow material={mats.boucle} />
      ))}
      {[[-1.55, 0.4], [1.55, 0.4], [-1.55, -0.4], [1.55, -0.4]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.04, z]} material={mats.walnut}>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 8]} />
        </mesh>
      ))}
    </group>
  );
}

function DiningChair({ walnut }: { walnut: THREE.Material }) {
  return (
    <group>
      <mesh position={[0, 0.46, 0]} castShadow material={walnut}>
        <boxGeometry args={[0.48, 0.05, 0.48]} />
      </mesh>
      <mesh position={[0, 0.75, -0.22]} castShadow>
        <boxGeometry args={[0.46, 0.42, 0.03]} />
        <meshStandardMaterial color="#cdb68f" roughness={0.9} />
      </mesh>
      {[[-0.21, -0.21], [0.21, -0.21], [-0.21, 0.21], [0.21, 0.21]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 0.22, z]} castShadow material={walnut}>
          <boxGeometry args={[0.04, 0.44, 0.04]} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ helper */

// Where she is (x, z) at each point of her part, in order: through the door,
// the clothes, the cushions, the papers, the dishes, the kitchen, the chair, then the mop
const WALK: [number, number, number][] = [
  [0, -7.3, 2.0],
  [0.06, -7.3, 2.0],
  [0.15, -4.4, 1.9],
  [0.25, -4.1, 1.7],
  [0.32, -1.9, 1.5],
  [0.4, -0.3, 2.1],
  [0.47, 1.3, 1.6],
  [0.58, 3.9, -0.6],
  [0.64, 3.0, 1.95],
  [0.72, 2.5, 3.0],
  [0.82, -2.5, 3.1],
  [0.9, -0.7, 2.7],
  [1, -0.1, 2.4],
];

function walkAt(h: number, out: { x: number; z: number }) {
  let k = 0;
  while (k < WALK.length - 2 && h >= WALK[k + 1][0]) k++;
  const [t0, x0, z0] = WALK[k];
  const [t1, x1, z1] = WALK[k + 1];
  const u = smooth(clamp01((h - t0) / (t1 - t0)));
  out.x = lerp(x0, x1, u);
  out.z = lerp(z0, z1, u);
}

const UNIFORM = "#4a3a78";
const SKIN = "#8d5f45";
const HAIR = "#1b1412";

function Helper({ st, source, scale = 1 }: { st: StateRef; source: "helper" | "walker"; scale?: number }) {
  const root = useRef<THREE.Group>(null!);
  const body = useRef<THREE.Group>(null!);
  const armL = useRef<THREE.Group>(null!);
  const armR = useRef<THREE.Group>(null!);
  const mop = useRef<THREE.Group>(null!);
  const badge = useRef<THREE.Group>(null!);
  const walk = useRef({ a: { x: 0, z: 0 }, b: { x: 0, z: 0 }, heading: P2, phase: 0, placed: false });

  useFrame(() => {
    const s = walk.current;
    const scene = st.current;
    const scripted = source === "helper" && scene.hero;
    const h = range(scene.t, HELPER_START, HELPER_END);
    let want: number | null = null;
    let walking: number;
    let phase: number;

    if (scripted) {
      // The hero story: her walk through the flat, set by the scroll
      walkAt(h, s.a);
      walkAt(Math.min(1, h + 0.004), s.b);
      const speed = Math.hypot(s.b.x - s.a.x, s.b.z - s.a.z);
      if (speed > 0.002) want = Math.atan2(s.b.x - s.a.x, s.b.z - s.a.z);
      if (h > 0.93) want = 0;
      walking = Math.min(1, speed * 60);
      phase = h * 320;
      root.current.visible = true;
    } else {
      // Between chapters: she walks wherever the chapter places her
      const pose = scene[source];
      const dx = pose.x - s.a.x;
      const dz = pose.z - s.a.z;
      const step = s.placed ? Math.hypot(dx, dz) : 0;
      s.placed = true;
      s.a.x = pose.x;
      s.a.z = pose.z;
      if (step > 0.004) want = Math.atan2(dx, dz);
      else if (pose.heading !== null) want = pose.heading;
      walking = Math.min(1, step * 25);
      s.phase += step * (source === "walker" ? 60 : 9);
      phase = s.phase;
      root.current.visible = pose.visible || source === "helper";
    }
    root.current.position.set(s.a.x, 0, s.a.z);

    // Face where she's going, or where the scene wants her to look
    if (want !== null) {
      const diff = Math.atan2(Math.sin(want - s.heading), Math.cos(want - s.heading));
      s.heading += diff * 0.18;
    }
    root.current.rotation.y = s.heading;

    body.current.position.y = Math.abs(Math.sin(phase)) * 0.035 * walking;
    armL.current.rotation.x = Math.sin(phase) * 0.45 * walking;
    armR.current.rotation.x = -0.35 - Math.sin(phase) * 0.15 * walking;

    const mopping = scripted ? range(h, 0.7, 0.72) * (1 - range(h, 0.88, 0.9)) : 0;
    mop.current.rotation.z = Math.sin(h * 260) * 0.35 * mopping;

    const b = scripted ? smooth(range(h, 0.07, 0.13)) * (1 - smooth(range(h, 0.3, 0.36))) : 0;
    badge.current.scale.setScalar(Math.max(0.001, b));
  });

  return (
    <group ref={root} position={[-7.3, 0, 2]} scale={scale}>
      <group ref={body}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.3, 0.96, 24]} />
          <meshStandardMaterial color={UNIFORM} roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.305, 0.305, 0.05, 24]} />
          <meshStandardMaterial color="#c9b6f2" roughness={0.8} />
        </mesh>
        <mesh position={[0, 1.18, 0]} castShadow>
          <capsuleGeometry args={[0.16, 0.3, 6, 16]} />
          <meshStandardMaterial color={UNIFORM} roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.33, 0]} scale={[1.45, 0.55, 0.85]} castShadow>
          <sphereGeometry args={[0.16, 20, 14]} />
          <meshStandardMaterial color={UNIFORM} roughness={0.85} />
        </mesh>
        {/* the dupatta, across one shoulder */}
        <mesh position={[0.02, 1.16, 0]} rotation-z={0.55} scale={[1, 1, 1.12]}>
          <cylinderGeometry args={[0.172, 0.19, 0.09, 24, 1, true]} />
          <meshStandardMaterial color="#c9b6f2" roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 1.47, 0]}>
          <cylinderGeometry args={[0.045, 0.05, 0.1, 12]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.6, 0]} castShadow>
          <sphereGeometry args={[0.12, 24, 18]} />
          <meshStandardMaterial color={SKIN} roughness={0.7} />
        </mesh>
        <mesh position={[0, 1.645, -0.045]}>
          <sphereGeometry args={[0.125, 24, 18]} />
          <meshStandardMaterial color={HAIR} roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.66, -0.14]}>
          <sphereGeometry args={[0.06, 16, 12]} />
          <meshStandardMaterial color={HAIR} roughness={0.6} />
        </mesh>
        {/* arms hang from the shoulders */}
        <group ref={armL} position={[-0.23, 1.34, 0]} rotation-z={-0.1}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.36, 4, 10]} />
            <meshStandardMaterial color={UNIFORM} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.46, 0]}>
            <sphereGeometry args={[0.048, 12, 10]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>
        </group>
        <group ref={armR} position={[0.23, 1.34, 0]} rotation-z={0.1}>
          <mesh position={[0, -0.22, 0]} castShadow>
            <capsuleGeometry args={[0.045, 0.36, 4, 10]} />
            <meshStandardMaterial color={UNIFORM} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.46, 0]}>
            <sphereGeometry args={[0.048, 12, 10]} />
            <meshStandardMaterial color={SKIN} roughness={0.7} />
          </mesh>
        </group>
        {/* the mop, pivoting at her hand */}
        <group ref={mop} position={[0.26, 0.95, 0.16]} rotation-x={-0.3}>
          <mesh position={[0, -0.31, 0]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 1.36, 8]} />
            <meshStandardMaterial color="#b9a6dc" roughness={0.5} />
          </mesh>
          <mesh position={[0, -0.97, 0]} castShadow>
            <boxGeometry args={[0.42, 0.05, 0.13]} />
            <meshStandardMaterial color="#ece6da" roughness={1} />
          </mesh>
        </group>
      </group>
      {/* registered and verified */}
      <Billboard position={[0, 2.05, 0]}>
        <group ref={badge} scale={0.001}>
          <RoundedBox args={[0.34, 0.34, 0.08]} radius={0.08}>
            <meshStandardMaterial color="#5a2ca0" roughness={0.35} emissive="#5a2ca0" emissiveIntensity={0.35} />
          </RoundedBox>
          <mesh position={[-0.06, -0.03, 0.045]} rotation-z={-0.64}>
            <boxGeometry args={[0.1, 0.035, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0.045, 0.01, 0.045]} rotation-z={0.82}>
            <boxGeometry args={[0.19, 0.035, 0.02]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      </Billboard>
    </group>
  );
}

/* ---------------------------------------------------------------- textures */

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

function toTexture(c: HTMLCanvasElement, repeat = 1) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat !== 1) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat, repeat);
  }
  return t;
}

function plankTexture() {
  const [c, g] = canvas(1024, 1024);
  const r = seeded(3);
  const rows = 14;
  const rh = 1024 / rows;
  for (let i = 0; i < rows; i++) {
    let x = -r() * 500;
    while (x < 1024) {
      const len = 420 + r() * 420;
      g.fillStyle = `hsl(31, ${24 + r() * 8}%, ${74 + r() * 7}%)`;
      g.fillRect(x, i * rh, len, rh);
      g.strokeStyle = "rgba(120, 86, 56, 0.07)";
      g.lineWidth = 1.5;
      for (let k = 0; k < 7; k++) {
        const yy = i * rh + r() * rh;
        g.beginPath();
        g.moveTo(x, yy);
        g.bezierCurveTo(x + len * 0.3, yy + (r() - 0.5) * 8, x + len * 0.6, yy + (r() - 0.5) * 8, x + len, yy);
        g.stroke();
      }
      g.fillStyle = "rgba(80, 56, 36, 0.28)";
      g.fillRect(x, i * rh, 2, rh);
      x += len;
    }
    g.fillStyle = "rgba(80, 56, 36, 0.3)";
    g.fillRect(0, i * rh, 1024, 2);
  }
  return toTexture(c, 2.6);
}

function skyTexture() {
  const [c, g] = canvas(1024, 512);
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#a593d4");
  grad.addColorStop(0.45, "#dcbfd0");
  grad.addColorStop(0.68, "#f5d8bc");
  grad.addColorStop(1, "#efe3d6");
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 512);
  const r = seeded(9);
  // the towers across the road
  for (const [shade, base, tall] of [
    ["rgba(150, 132, 178, 0.45)", 330, 120],
    ["rgba(112, 94, 146, 0.6)", 360, 170],
  ] as const) {
    let x = -20;
    while (x < 1024) {
      const w = 60 + r() * 70;
      const h = tall * (0.5 + r());
      g.fillStyle = shade;
      g.fillRect(x, base - h + 152, w, h + 200);
      g.fillStyle = "rgba(255, 224, 170, 0.75)";
      for (let wy = base - h + 166; wy < 500; wy += 16) {
        for (let wx = x + 8; wx < x + w - 10; wx += 14) if (r() < 0.22) g.fillRect(wx, wy, 6, 7);
      }
      x += w + 18 + r() * 40;
    }
  }
  return toTexture(c);
}

function artTexture() {
  const [c, g] = canvas(512, 360);
  g.fillStyle = "#f4f0ea";
  g.fillRect(0, 0, 512, 360);
  const blobs: [number, number, number, string][] = [
    [170, 160, 120, "rgba(185, 166, 220, 0.85)"],
    [320, 210, 95, "rgba(90, 44, 160, 0.55)"],
    [260, 110, 70, "rgba(231, 196, 170, 0.8)"],
  ];
  for (const [x, y, rad, col] of blobs) {
    g.fillStyle = col;
    g.beginPath();
    g.ellipse(x, y, rad * 1.2, rad * 0.8, 0.4, 0, Math.PI * 2);
    g.fill();
  }
  g.strokeStyle = "#7a5236";
  g.lineWidth = 18;
  g.strokeRect(0, 0, 512, 360);
  return toTexture(c);
}

function dotTexture() {
  const [c, g] = canvas(64, 64);
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return toTexture(c);
}
