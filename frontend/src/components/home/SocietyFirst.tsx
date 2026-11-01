import Chapter from "@/components/ui/Chapter";
import RateStory from "@/components/home/RateStory";

const PILLARS = [
  {
    title: "A partnership with your society",
    body: "We work with your RWA, AOA or managing committee, so the arrangement is set up once for the whole community instead of flat by flat.",
  },
  {
    title: "Your existing helpers, registered and verified",
    body: "We start with the people already working in your society. They register with us and complete verification before working through GetMyHelp.",
  },
  {
    title: "One society-agreed rate card",
    body: "Rates are agreed with your committee, based on flat size and the work involved, and are the same for every participating household.",
  },
  {
    title: "A plan for each household",
    body: "Every home chooses the services it actually needs, with a clear, written scope of what is and isn’t included.",
  },
  {
    title: "Structured coordination",
    body: "Attendance, leave and replacement requests come to us — one point of contact for residents, helpers and the committee.",
  },
];

const COMPARISON = [
  {
    topic: "Who comes to your door",
    app: "Whoever is free nearby, often a new face each time",
    us: "Helpers already working in your society, registered and verified",
  },
  {
    topic: "How the rate is set",
    app: "Per booking, set by the platform",
    us: "Agreed once with your society, the same for every flat",
  },
  {
    topic: "The relationship",
    app: "A transaction, one visit at a time",
    us: "An ongoing arrangement with a helper your household knows",
  },
  {
    topic: "When someone is on leave",
    app: "You book again and hope",
    us: "We coordinate cover from verified helpers, where available",
  },
  {
    topic: "Who you call",
    app: "A support queue",
    us: "GetMyHelp, as your society’s single point of contact",
  },
];

export default function SocietyFirst() {
  const [lead, ...rest] = PILLARS;

  return (
    <Chapter
      id="approach"
      shot="approach"
      titleId="approach-title"
      dark
      align="right"
      eyebrow="The society-first approach"
      title="The fix isn’t a better app. It’s an arrangement your whole society shares."
      intro="GetMyHelp isn’t a marketplace for booking strangers. We organise domestic help at the society level, so the basics are settled once and everyone benefits."
      between={<RateStory />}
      sheetClassName="on-dark bg-purple-deep text-paper"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-28">
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <li data-reveal className="flex flex-col justify-between rounded-[28px] bg-marigold p-7 text-purple-night sm:p-10 md:col-span-2">
            <span aria-hidden="true" className="font-display text-[5rem] font-normal italic leading-none tracking-[-0.03em] text-purple-night/35">
              01
            </span>
            <div className="mt-10 max-w-xl">
              <h3 className="display-md">{lead.title}</h3>
              <p className="mt-4 leading-relaxed">{lead.body}</p>
            </div>
          </li>
          {rest.map((pillar, i) => (
            <li key={pillar.title} data-reveal className="rounded-[28px] bg-paper/[0.07] p-7 sm:p-9">
              <span aria-hidden="true" className="block font-display text-[2.6rem] font-normal italic leading-none tracking-[-0.02em] text-marigold">
                {String(i + 2).padStart(2, "0")}
              </span>
              <h3 className="mt-8 text-[1.45rem] font-extrabold leading-snug tracking-[-0.02em]">{pillar.title}</h3>
              <p className="mt-3 leading-relaxed text-paper/80">{pillar.body}</p>
            </li>
          ))}
        </ul>

        <div className="mt-28 md:mt-36">
          <h3 data-reveal className="display-lg max-w-3xl">
            Not another maid-booking app.
          </h3>
          <p data-reveal className="lede mt-5 max-w-2xl text-paper/80">
            Booking apps are built for one-off visits. A household with a regular helper needs something different.
          </p>

          <div data-reveal className="mt-12 overflow-hidden rounded-[28px] bg-paper/[0.05]">
            <div className="hidden grid-cols-[1fr_1.25fr_1.25fr] gap-8 px-8 pt-7 text-base font-bold md:grid">
              <span aria-hidden="true" />
              <span className="text-paper/60">A typical booking app</span>
              <span className="text-marigold">GetMyHelp</span>
            </div>
            <dl className="p-3 md:p-4">
              {COMPARISON.map((row) => (
                <div key={row.topic} className="grid gap-3 rounded-[20px] px-4 py-5 transition-colors hover:bg-paper/[0.04] md:grid-cols-[1fr_1.25fr_1.25fr] md:gap-8 md:px-4">
                  <dt className="text-xl font-bold tracking-[-0.015em]">{row.topic}</dt>
                  <dd className="text-paper/65">
                    <span className="mb-1 block text-sm font-bold text-paper/50 md:hidden">A typical booking app</span>
                    {row.app}
                  </dd>
                  <dd className="rounded-[14px] bg-marigold/[0.14] px-4 py-3 font-semibold text-paper md:-my-3">
                    <span className="mb-1 block text-sm font-bold text-marigold md:hidden">GetMyHelp</span>
                    {row.us}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
