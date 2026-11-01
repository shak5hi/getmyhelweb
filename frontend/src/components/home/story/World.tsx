"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { storyBus, worldEnabled } from "./bus";
import type { WorldFrame } from "./StoryScene";

const WorldScene = dynamic(() => import("./StoryScene"), { ssr: false });

type Chapter = { id: string; label: string };

const noSubscribe = () => () => {};

// The one 3D world behind the whole home page. It stays fixed while the page
// scrolls over it: chapter headings sit on top of it, content slides over it.
export default function World() {
  const enabled = useSyncExternalStore(noSubscribe, worldEnabled, () => false);
  const [live, setLive] = useState(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const flash = useRef<HTMLDivElement>(null);
  const dots = useRef<(HTMLAnchorElement | null)[]>([]);
  const current = useRef(-1);

  useEffect(() => {
    if (!enabled) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-shot]"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the chapters are read from the page once it has rendered
    setChapters(
      els.map((el) => ({ id: el.id || (el.closest("section")?.id ?? ""), label: el.dataset.label ?? "" })).filter((c) => c.id),
    );
    // Only draw while some part of the world is showing between the pages
    const showing = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) showing.add(e.target);
        else showing.delete(e.target);
      }
      setLive(showing.size > 0);
    });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);

  const onFrame = useCallback((f: WorldFrame) => {
    storyBus.hero?.(f.hero);
    if (flash.current) flash.current.style.opacity = String(f.flash);
    const active = f.shot < 1 ? 0 : Math.round(f.shot - 1);
    if (active !== current.current) {
      current.current = active;
      dots.current.forEach((d, i) => {
        if (d) d.dataset.active = String(i === active);
      });
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <WorldScene live={live} onFrame={onFrame} />
        <div ref={flash} className="absolute inset-0 bg-paper opacity-0" />
      </div>
      {chapters.length > 1 && (
        <nav aria-label="Chapters" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
          <ol className="flex flex-col gap-1 rounded-full bg-paper/75 p-1.5 shadow-[0_10px_40px_-18px_rgba(36,18,63,0.4)] backdrop-blur">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <a
                  ref={(el) => {
                    dots.current[i] = el;
                  }}
                  href={`#${c.id}`}
                  data-active="false"
                  className="chapter-dot group relative flex h-7 w-7 items-center justify-center rounded-full"
                >
                  <span className="sr-only">{c.label}</span>
                  <span aria-hidden="true" className="chapter-pip block h-1.5 w-1.5 rounded-full bg-ink/30" />
                  <span
                    aria-hidden="true"
                    className="chapter-label pointer-events-none absolute right-9 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-sm font-semibold text-paper opacity-0"
                  >
                    {c.label}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </>
  );
}
