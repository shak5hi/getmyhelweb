import Chapter from "@/components/ui/Chapter";
const PRINCIPLES = [
  {
    title: "Registered, not replaced",
    body: "We start with the helpers your society already knows. Joining GetMyHelp doesn’t mean replacing the people you rely on.",
  },
  {
    title: "Consistent rates",
    body: "A society-agreed rate card means helpers aren’t bargained down door to door for the same work.",
  },
  {
    title: "A clear scope of work",
    body: "Everyone knows what a plan includes. Extra work is discussed and agreed, not assumed.",
  },
  {
    title: "Leave is respected",
    body: "Taking a day off shouldn’t put anyone’s job at risk. Cover is our responsibility, not a reason for conflict.",
  },
];

export default function TrustRespect() {
  return (
    <Chapter
      id="trust"
      shot="trust"
      titleId="trust-title"
      align="right"
      eyebrow="Trust, both ways"
      title="Good for the people who do the work, too."
      intro="Domestic work keeps our homes running. A fair arrangement for helpers is what makes the service dependable for residents."
    >
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-28">
        {/* the idea itself, set large on the page's one full field of marigold */}
        <figure data-reveal className="rounded-[32px] bg-marigold px-7 py-12 text-purple-night sm:px-14 sm:py-20">
          <blockquote className="max-w-[56rem] font-display text-[2rem] font-normal leading-[1.12] tracking-[-0.02em] sm:text-[3.2rem]">
            “Residents should know who is coming into their home. Helpers should know what the job is, and what it
            pays.”
          </blockquote>
          <figcaption className="mt-8 font-semibold text-purple-night/75">The idea GetMyHelp is built on</figcaption>
        </figure>

        <div className="mt-5 grid gap-5 lg:grid-cols-12">
          <div data-reveal className="on-dark flex flex-col justify-between rounded-[28px] bg-purple-deep p-8 text-paper sm:p-10 lg:col-span-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-base font-bold text-marigold">For residents: verification</p>
              <span aria-hidden="true" className="inline-flex items-center gap-1.5 rounded-full bg-marigold px-3 py-1.5 text-sm font-bold text-purple-night">
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                  <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Verified
              </span>
            </div>
            <p className="display-md mt-12">
              Every helper registered through GetMyHelp completes identity and address verification before working in
              your society.
            </p>
          </div>

          <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} data-reveal className={`rounded-[28px] p-7 ${i === 0 || i === 3 ? "bg-sage" : "bg-lilac"}`}>
                <span aria-hidden="true" className="font-display text-[2.4rem] italic leading-none text-purple">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-xl font-extrabold tracking-[-0.02em] text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-ink">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Chapter>
  );
}
