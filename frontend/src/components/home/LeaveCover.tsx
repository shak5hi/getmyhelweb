import Chapter from "@/components/ui/Chapter";

const SITUATIONS = [
  {
    label: "Planned leave",
    title: "Festivals, family visits, a trip home",
    body: "Your helper tells us in advance. We let you know, and work to line up cover from verified helpers in or near your society for those days.",
  },
  {
    label: "Unplanned absence",
    title: "Illness or a sudden emergency",
    body: "Tell us, or we’ll hear from your helper. We look for a verified replacement and keep you updated, so you’re not making calls at 7 am.",
  },
  {
    label: "When they’re back",
    title: "Your regular helper returns",
    body: "Your plan, timings and scope stay exactly as they were. Cover is temporary; your relationship with your helper isn’t.",
  },
];

export default function LeaveCover() {
  return (
    <Chapter
      id="leave"
      shot="leave"
      titleId="leave-title"
      align="right"
      eyebrow="Leave & replacements"
      title="People take leave. We plan for it — honestly."
      intro="Helpers fall ill, travel home and have families of their own. Instead of pretending absences won’t happen, we coordinate cover so the problem doesn’t land on you."
      sheetClassName="bg-peach"
    >
      <div className="mx-auto grid max-w-[1280px] gap-4 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12 lg:gap-5">
        <div className="lg:col-span-7">
          <ol className="space-y-4">
            {SITUATIONS.map((s, i) => (
              <li key={s.label} data-reveal className="flex gap-5 rounded-[28px] bg-paper-raised p-6 sm:gap-6 sm:p-8">
                <span
                  aria-hidden="true"
                  className={`mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-extrabold ${
                    i === 2 ? "bg-marigold text-purple-night" : "bg-lilac text-purple"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <p className="text-base font-bold text-purple">{s.label}</p>
                  <h3 className="mt-1 text-[1.5rem] font-extrabold leading-snug tracking-[-0.025em] text-ink">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-5">
          <div data-reveal className="on-dark rounded-[28px] bg-purple-deep p-7 text-paper sm:p-10 lg:sticky lg:top-28">
            <p className="display-md text-marigold">What we won’t promise</p>
            <p className="lede mt-5 text-paper/85">
              We won’t promise a same-day replacement every time. How quickly we can arrange cover depends on helper
              availability around your society, and we’ll tell your committee plainly what to expect before you sign up.
            </p>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
