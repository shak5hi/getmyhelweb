"use client";

import { useRef, useState } from "react";
import Chapter from "@/components/ui/Chapter";
import SocietyEnquiryLink from "@/components/ui/SocietyEnquiryLink";

interface Service {
  id: string;
  name: string;
  summary: string;
  included: string[];
  notIncluded: string[];
}

// Scope adapted from the existing service details on the current site.
const SERVICES: Service[] = [
  {
    id: "cleaning",
    name: "Home cleaning",
    summary: "Sweeping, mopping, dusting and light tidying on a regular schedule.",
    included: [
      "Sweeping and mopping of all rooms and balconies",
      "Dusting of reachable surfaces",
      "Trash disposal and bin bag replacement",
      "Light tidying — cushions, beds and surfaces",
    ],
    notIncluded: [
      "Deep cleaning, stain scrubbing or carpet washing",
      "Ceiling fans, high ceilings and wall scrubbing",
      "Washing personal clothes",
      "Errands or grocery shopping",
    ],
  },
  {
    id: "utensils",
    name: "Utensil washing",
    summary: "Daily dishes done, the sink area wiped and everything back on the rack.",
    included: [
      "Washing kitchen utensils, plates and cutlery",
      "Scrubbing everyday pots and pans",
      "Cleaning the sink area and wiping wet surfaces",
      "Putting clean utensils back on racks",
    ],
    notIncluded: [
      "Heavy commercial-grade ovens or grills",
      "Polishing copper or silverware",
      "Organising the pantry",
      "Clearing out expired food",
    ],
  },
  {
    id: "cooking",
    name: "Cooking",
    summary: "Home-style meals prepared in your kitchen, to your family’s routine.",
    included: [
      "Breakfast, lunch or dinner, as per your schedule",
      "Chopping vegetables and basic meal prep",
      "Cleaning the stove and platform after cooking",
      "Hygienic food handling",
    ],
    notIncluded: [
      "Grocery shopping or fetching ingredients",
      "Deep cleaning of the chimney or cabinets",
      "Utensil washing, unless added to your plan",
      "Cooking for large gatherings",
    ],
  },
];

const PLAN_POINTS = [
  {
    title: "Choose what your home needs",
    body: "Combine cleaning, utensils and cooking — one service or all three.",
  },
  {
    title: "Set timings that work for you",
    body: "Plans are arranged around your household’s routine and your helper’s schedule.",
  },
  {
    title: "Priced by your society’s rate card",
    body: "Rates are agreed with your committee, based on flat size and the work involved — not negotiated door to door.",
  },
];

export default function ServicesPlans() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [active, setActive] = useState<Service | null>(null);

  const open = (service: Service, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setActive(service);
    dialogRef.current?.showModal();
  };

  const close = () => dialogRef.current?.close();

  return (
    <Chapter
      id="services"
      shot="services"
      titleId="services-title"
      eyebrow="Services & household plans"
      title="Everyday help, written down clearly."
      intro="Each household builds a plan from the services below. What’s included is agreed upfront, so there are no surprises at the end of the month."
      sheetClassName="bg-lilac"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-28">
        <ul className="grid gap-5 md:grid-cols-3 [perspective:1200px]">
          {SERVICES.map((service, i) => (
            <li key={service.id} data-reveal>
              <TiltCard>
                <button
                  type="button"
                  aria-haspopup="dialog"
                  onClick={(e) => open(service, e.currentTarget)}
                  className={`group flex h-full w-full flex-col rounded-[28px] p-7 text-left sm:p-8 ${
                    i === 1 ? "bg-purple text-paper" : "bg-paper-raised text-ink"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`block font-display text-[5rem] font-normal italic leading-none tracking-[-0.03em] ${
                      i === 1 ? "text-marigold" : "text-lavender"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-8 block text-[1.65rem] font-extrabold tracking-[-0.025em]">{service.name}</span>
                  <span className={`mt-2 block leading-relaxed ${i === 1 ? "text-paper/85" : "text-ink"}`}>{service.summary}</span>
                  <span className={`mt-6 block space-y-2.5 border-t pt-6 ${i === 1 ? "border-paper/15" : "border-ink/10"}`}>
                    {service.included.slice(0, 3).map((item) => (
                      <span key={item} className="flex gap-2.5 text-[0.95rem] leading-snug">
                        <svg viewBox="0 0 16 16" aria-hidden="true" className={`mt-0.5 h-4 w-4 shrink-0 ${i === 1 ? "text-marigold" : "text-purple"}`}>
                          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </span>
                    ))}
                  </span>
                  <span className="flex flex-1 flex-col justify-end">
                    <span className={`mt-8 inline-flex items-center gap-2 font-bold ${i === 1 ? "text-paper" : "text-purple"}`}>
                      What’s included
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                          i === 1 ? "bg-paper/15 group-hover:bg-marigold group-hover:text-purple-night" : "bg-lilac group-hover:bg-purple group-hover:text-white"
                        }`}
                      >
                        +
                      </span>
                    </span>
                  </span>
                </button>
              </TiltCard>
            </li>
          ))}
        </ul>

        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {PLAN_POINTS.map((point, i) => (
            <div key={point.title} data-reveal className={`rounded-[24px] p-7 ${i === 2 ? "bg-marigold-soft" : "bg-paper/70"}`}>
              <h3 className="text-xl font-extrabold tracking-[-0.02em] text-ink">{point.title}</h3>
              <p className="mt-2 leading-relaxed text-ink">{point.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 max-w-2xl leading-relaxed text-ink-muted">
          We don’t publish a single price list: each society agrees its own rate card with us. Exact scope and timings
          are confirmed with your society before launch.
        </p>
      </div>

      <dialog
        ref={dialogRef}
        aria-labelledby="service-dialog-title"
        onClose={() => triggerRef.current?.focus()}
        onClick={(e) => {
          // Clicking the backdrop (the dialog element itself) closes it
          if (e.target === e.currentTarget) close();
        }}
        className="service-dialog m-auto w-[calc(100%-2rem)] max-w-2xl rounded-[28px] bg-paper p-0 text-ink"
      >
        {active && (
          <div data-lenis-prevent className="max-h-[85dvh] overflow-y-auto">
            <div className="relative flex h-36 items-end bg-purple px-6 pb-5 sm:h-40 sm:px-10">
              <span aria-hidden="true" className="font-display text-[5rem] font-normal italic leading-none tracking-[-0.03em] text-lavender">
                {String(SERVICES.indexOf(active) + 1).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={close}
                className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-paper text-ink transition-colors hover:bg-white"
              >
                <span className="sr-only">Close</span>
                <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="p-6 sm:p-10">
              <p className="text-base font-bold text-purple">Service scope</p>
              <h3 id="service-dialog-title" className="display-md mt-2">
                {active.name}
              </h3>
              <p className="mt-3 leading-relaxed text-ink">{active.summary}</p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <ScopeList title="Included" items={active.included} positive />
                <ScopeList title="Not included" items={active.notIncluded} />
              </div>

              <p className="mt-8 leading-relaxed text-ink-muted">
                This is the typical scope. The final details are agreed with your society and confirmed in your household
                plan.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div onClickCapture={close} className="flex">
                  <SocietyEnquiryLink className="btn btn-primary w-full sm:w-auto">Enquire for your society</SocietyEnquiryLink>
                </div>
                <a href="#waitlist" onClick={close} className="btn btn-secondary">
                  Join the resident waitlist
                </a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </Chapter>
  );
}

// Leans the card toward the pointer; flat on touch and for reduced motion.
function TiltCard({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
  };

  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div ref={ref} className="tilt h-full" onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </div>
  );
}

function ScopeList({ title, items, positive = false }: { title: string; items: string[]; positive?: boolean }) {
  return (
    <div className={`rounded-[20px] p-5 ${positive ? "bg-lilac" : "bg-paper-raised"}`}>
      <h4 className="font-extrabold text-ink">{title}</h4>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 leading-snug">
            <span
              aria-hidden="true"
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                positive ? "bg-purple text-white" : "bg-ink/10 text-ink-muted"
              }`}
            >
              <svg viewBox="0 0 16 16" className="h-3 w-3">
                <path
                  d={positive ? "M3 8.5l3 3 7-7" : "M4 8h8"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className={positive ? "text-ink" : "text-ink-muted"}>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
