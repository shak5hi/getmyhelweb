import Link from "next/link";
import Chapter from "@/components/ui/Chapter";
import SocietyEnquiryLink from "@/components/ui/SocietyEnquiryLink";

const FOR_COMMITTEES = [
  "One agreement for the society, instead of hundreds of separate household disputes",
  "A record of the helpers working in your society, with verification done",
  "A single, agreed rate card residents can rely on",
  "A point of contact for helper-related issues, outside the committee",
  "A gentle transition — existing helpers are part of it from day one",
];

const FOR_RESIDENTS = [
  "No more negotiating rates flat by flat",
  "A clear, written scope of what your plan includes",
  "Leave cover coordinated for you",
  "Know who is coming into your home",
  "Keep the helper your family already trusts",
];

export default function Benefits() {
  return (
    <Chapter
      id="societies"
      shot="societies"
      titleId="benefits-title"
      eyebrow="Who it’s for"
      title="Easier for the committee. Calmer for every home."
      sheetClassName="bg-paper-raised"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-28">
        <div className="grid gap-5 lg:grid-cols-2">
          <article data-reveal className="on-dark flex flex-col overflow-hidden rounded-[32px] bg-purple text-paper">
            {/* the society's record of its helpers */}
            <div aria-hidden="true" className="relative flex h-56 items-center justify-center overflow-hidden bg-purple-deep px-8 sm:h-64">
              <ul className="w-full max-w-sm space-y-2.5">
                {[
                  ["S", "w-28", "bg-lavender text-purple-deep"],
                  ["R", "w-20", "bg-[#f3d9c4] text-purple-deep"],
                  ["M", "w-24", "bg-paper text-purple-deep"],
                ].map(([initial, width, tone], i) => (
                  <li
                    key={initial}
                    style={{ marginLeft: `${i * 14}px` }}
                    className="flex items-center gap-3 rounded-[16px] bg-paper/[0.08] px-3.5 py-3"
                  >
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-extrabold ${tone}`}>
                      {initial}
                    </span>
                    <span className={`h-2.5 rounded-full bg-paper/30 ${width}`} />
                    <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-marigold px-2.5 py-1 text-xs font-bold text-purple-night">
                      <svg viewBox="0 0 16 16" className="h-3 w-3">
                        <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Verified
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-10">
              <p className="text-base font-bold text-marigold">For RWA, AOA and BOM members</p>
              <h3 className="display-md mt-3">Bring order to something every resident talks about.</h3>
              <BenefitList items={FOR_COMMITTEES} dark />
              <div className="mt-auto pt-10">
                <SocietyEnquiryLink className="btn btn-accent">Enquire for your society</SocietyEnquiryLink>
              </div>
            </div>
          </article>

          <article data-reveal className="flex flex-col overflow-hidden rounded-[32px] bg-peach">
            {/* one household, its own helper, its own plan */}
            <div aria-hidden="true" className="relative flex h-56 items-center justify-center bg-marigold-soft px-8 sm:h-64">
              <div className="w-full max-w-sm rotate-[-1.5deg] rounded-[22px] bg-paper-raised p-5 shadow-[0_30px_60px_-30px_rgba(36,18,63,0.4)]">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f3d9c4] text-lg font-extrabold text-purple-deep">
                    S
                  </span>
                  <span className="h-2.5 w-24 rounded-full bg-ink/15" />
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-purple px-2.5 py-1 text-xs font-bold text-white">
                    <svg viewBox="0 0 16 16" className="h-3 w-3">
                      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Verified
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Home cleaning", "Utensil washing"].map((s) => (
                    <span key={s} className="rounded-full bg-lilac px-3 py-1.5 text-sm font-bold text-purple">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-10">
              <p className="text-base font-bold text-purple">For residents</p>
              <h3 className="display-md mt-3 text-ink">Reliable help, without the monthly negotiation.</h3>
              <BenefitList items={FOR_RESIDENTS} />
              <div className="mt-auto pt-10">
                <Link href="/#waitlist" className="btn btn-primary">
                  Join the resident waitlist
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </Chapter>
  );
}

function BenefitList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="mt-8 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3.5 leading-snug">
          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              dark ? "bg-marigold text-purple-night" : "bg-purple text-white"
            }`}
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className={dark ? "text-paper" : "text-ink"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}
