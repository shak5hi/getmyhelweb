"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SocietyEnquiryLink from "@/components/ui/SocietyEnquiryLink";
import { PROBLEMS } from "@/components/home/EverydayProblems";
import { flashAt, range } from "@/components/home/story/timeline";
import { storyBus, worldEnabled } from "@/components/home/story/bus";

gsap.registerPlugin(ScrollTrigger);

const CIRCULAR_ROWS = [
  { term: "Helpers", detail: "The helpers already working here, registered and verified" },
  { term: "Rates", detail: "One rate card, agreed with the committee, for every flat" },
  { term: "Plans", detail: "Chosen per household — cleaning, utensils, cooking" },
  { term: "Leave", detail: "Cover coordinated by GetMyHelp, not by you" },
  { term: "Issues", detail: "One point of contact, not the society WhatsApp group" },
];

const CLOSING_LINE = "Organised once, for every flat in the society.";

// The messages that arrive while the flat is still a mess
const CHATS = [PROBLEMS[0], PROBLEMS[2]];

const noSubscribe = () => () => {};

export default function Hero() {
  // The server assumes the story can play; the layout's first script decides for real
  const story = useSyncExternalStore(noSubscribe, worldEnabled, () => true);
  return story ? <StoryHero /> : <StillHero />;
}

function HeroCopy() {
  return (
    <>
      <p data-reveal className="text-base font-bold text-purple">
        Domestic help, organised by your society
      </p>
      <h1 id="hero-title" data-reveal className="hero-title mt-4 text-balance text-ink">
        Your maid shouldn’t be a monthly problem to solve.
      </h1>
      <p data-reveal className="mt-6 text-[1rem] leading-relaxed text-ink sm:text-[1.1rem] md:text-[1.2rem]">
        GetMyHelp partners with your society — not just your flat. We register and verify the helpers already working
        in your community, agree fair rates once with your committee, and coordinate the day-to-day, so no household has
        to negotiate alone.
      </p>
      <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <SocietyEnquiryLink>Enquire for your society</SocietyEnquiryLink>
        <Link href="/#waitlist" className="btn btn-secondary">
          I’m a resident
        </Link>
      </div>
      <p data-reveal className="mt-5 hidden max-w-md text-[0.95rem] leading-relaxed text-ink-muted sm:block">
        For RWA, AOA and managing committee members. Residents can join the waitlist and we’ll keep you posted.
      </p>
    </>
  );
}

/* The hero as a story told on scroll: the society from outside, one flat in a
   mess, a verified helper walking in and setting it right, then every flat
   in the society lit together. */
function StoryHero() {
  const section = useRef<HTMLElement>(null);
  const sceneLive = useRef(false);
  const lastRow = useRef(-2);

  const intro = useRef<HTMLDivElement>(null);
  const wash = useRef<HTMLDivElement>(null);
  const flash = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const finale = useRef<HTMLDivElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const chats = useRef<(HTMLDivElement | null)[]>([]);
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  const apply = useCallback((p: number) => {
    const out = range(p, 0.03, 0.11);
    const end = range(p, 0.93, 0.97);
    show(intro.current, 1 - out, -48 * out);
    show(finale.current, end, 24 * (1 - end));
    if (wash.current) wash.current.style.opacity = String(Math.max(1 - out, end));
    if (flash.current) flash.current.style.opacity = String(flashAt(p));
    if (hint.current) hint.current.style.opacity = String(1 - range(p, 0, 0.03));

    chats.current.forEach((el, i) => {
      const a = range(p, 0.31 + i * 0.035, 0.335 + i * 0.035) * (1 - range(p, 0.43, 0.455));
      show(el, a, 16 * (1 - a));
    });

    const inList = range(p, 0.46, 0.49) * (1 - range(p, 0.86, 0.885));
    show(list.current, inList, 16 * (1 - inList));
    // One step per stretch of the helper's work; all ticked once she's done
    const row = p < 0.47 ? -1 : Math.floor(range(p, 0.47, 0.84) * CIRCULAR_ROWS.length);
    if (row !== lastRow.current) {
      lastRow.current = row;
      rows.current.forEach((li, i) => {
        if (li) li.dataset.state = i < row ? "done" : i === row ? "active" : "todo";
      });
    }
  }, []);

  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        // Until the scene has loaded, keep the words in step with the scroll
        if (!sceneLive.current) apply(self.progress);
      },
    });
    apply(st.progress);
    // The world behind the page drives the words from here on
    storyBus.hero = (p) => {
      sceneLive.current = true;
      apply(p);
    };
    return () => {
      st.kill();
      storyBus.hero = null;
    };
  }, [apply]);

  return (
    <section
      ref={section}
      id="top"
      data-shot="hero"
      data-label="GetMyHelp"
      aria-labelledby="hero-title"
      className="relative h-[480vh] md:h-[580vh]"
    >
      <h2 className="sr-only">What a society sets up with GetMyHelp</h2>
      <ul className="sr-only">
        {CIRCULAR_ROWS.map((row) => (
          <li key={row.term}>
            {row.term}: {row.detail}
          </li>
        ))}
      </ul>

      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <p className="sr-only">
          Animation: the camera enters a residential society and a flat in a mess. A verified helper walks in and puts
          the home in order, then every flat in the society lights up.
        </p>

        {/* keeps the words readable over the scene */}
        <div
          ref={wash}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-paper from-40% via-paper/60 via-52% to-transparent to-64% md:bg-gradient-to-r md:from-28% md:via-46% md:to-62%"
        />

        <div ref={intro} className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-[1280px] flex-col px-5 pt-24 sm:px-8 md:justify-center md:pt-16">
            <div className="max-w-[37rem]">
              <HeroCopy />
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-24 md:top-1/2 md:-translate-y-1/2">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-3 px-5 sm:px-8">
            {CHATS.map((chat, i) => (
              <div
                key={chat.message}
                ref={(el) => {
                  chats.current[i] = el;
                }}
                style={{ opacity: 0, visibility: "hidden" }}
                className="w-full max-w-[21rem] rounded-[22px] rounded-bl-[6px] bg-paper-raised/95 px-5 py-4 shadow-[0_24px_60px_-24px_rgba(36,18,63,0.45)] backdrop-blur"
              >
                <p className="text-sm text-ink-muted">{chat.time}</p>
                <p lang="hi-Latn" className="mt-1 text-[1.15rem] font-semibold leading-snug text-ink">
                  {chat.message}
                </p>
                <p className="mt-0.5 text-[0.95rem] italic text-ink-muted">{chat.gloss}</p>
              </div>
            ))}
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-5 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div
              ref={list}
              style={{ opacity: 0, visibility: "hidden" }}
              className="rounded-[28px] bg-paper-raised/95 p-5 shadow-[0_30px_70px_-30px_rgba(36,18,63,0.45)] backdrop-blur md:max-w-[23rem] md:p-7"
            >
              <p className="text-sm font-bold text-purple md:text-base">What a society sets up with GetMyHelp</p>
              <ol className="mt-3 md:mt-5 md:space-y-1">
                {CIRCULAR_ROWS.map((row, i) => (
                  <li
                    key={row.term}
                    ref={(el) => {
                      rows.current[i] = el;
                    }}
                    data-state="todo"
                    className="story-row flex gap-3.5 py-1.5"
                  >
                    <span className="story-dot mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold">
                      <span className="story-num">{i + 1}</span>
                      <svg viewBox="0 0 16 16" className="story-check h-3.5 w-3.5">
                        <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="text-lg font-extrabold tracking-[-0.015em] text-ink">{row.term}</p>
                      <div className="story-detail">
                        <p className="overflow-hidden leading-snug text-ink-muted">{row.detail}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-24 md:top-1/2 md:-translate-y-1/2">
          <div className="mx-auto max-w-[1280px] px-5 sm:px-8">
            <div ref={finale} style={{ opacity: 0, visibility: "hidden" }} className="max-w-[34rem]">
              <p className="display-lg text-balance text-ink">{CLOSING_LINE}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <SocietyEnquiryLink>Enquire for your society</SocietyEnquiryLink>
                <Link href="/#waitlist" className="btn btn-secondary">
                  I’m a resident
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div ref={flash} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-paper opacity-0" />

        <div ref={hint} aria-hidden="true" className="pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 md:block">
          <span className="block h-12 w-[2px] overflow-hidden rounded-full bg-ink/10">
            <span className="scroll-cue block h-1/2 w-full rounded-full bg-purple" />
          </span>
        </div>
      </div>
    </section>
  );
}

function show(el: HTMLElement | null, opacity: number, y: number) {
  if (!el) return;
  el.style.opacity = String(opacity);
  el.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
  el.style.visibility = opacity < 0.01 ? "hidden" : "visible";
}

// For reduced motion, or a browser without WebGL: the same words, standing still
function StillHero() {
  return (
    <section aria-labelledby="hero-title">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 pt-10 sm:px-8 md:pt-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:self-center">
          <HeroCopy />
        </div>
        <div className="on-dark flex flex-col justify-end rounded-[32px] bg-purple-deep p-8 text-paper sm:p-12 lg:col-span-6 lg:min-h-[520px]">
          <p className="display-lg max-w-[14ch] text-balance">{CLOSING_LINE}</p>
        </div>
      </div>

      <div className="mx-auto max-w-[1280px] px-5 pb-24 pt-16 sm:px-8 md:pb-32">
        <h2 className="text-base font-bold text-purple">What a society sets up with GetMyHelp</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {CIRCULAR_ROWS.map((row, i) => (
            <li key={row.term} className="rounded-[24px] bg-paper-raised p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lilac font-extrabold text-purple">
                {i + 1}
              </span>
              <h3 className="mt-5 text-xl font-extrabold tracking-[-0.02em] text-ink">{row.term}</h3>
              <p className="mt-1.5 leading-snug text-ink-muted">{row.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
