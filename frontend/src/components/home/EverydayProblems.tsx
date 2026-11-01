import Chapter from "@/components/ui/Chapter";

export const PROBLEMS = [
  {
    time: "6:52 am",
    message: "Didi, aaj nahi aa paungi.",
    gloss: "I can’t come today.",
    title: "The early-morning message",
    body: "Someone is unwell or has to go home, and suddenly your whole day is being rearranged around dishes and floors.",
  },
  {
    time: "Sunday",
    message: "Upar wale zyada de rahe hain.",
    gloss: "The flat upstairs pays more.",
    title: "A different rate in every flat",
    body: "The same work is priced differently across the building, and every household renegotiates on its own.",
  },
  {
    time: "Monday",
    message: "Kal se nayi wali aayegi.",
    gloss: "Someone new is coming from tomorrow.",
    title: "A new face at the door",
    body: "Replacements arrive with no introduction and no way of knowing who is coming into your home.",
  },
  {
    time: "1st of the month",
    message: "Bartan ki baat toh hui hi nahi thi.",
    gloss: "We never agreed on utensils.",
    title: "Nobody wrote it down",
    body: "What the job includes was never agreed clearly, so it gets argued again every few weeks.",
  },
];

// Four messages, four fields: the warm and cool neighbours of the brand violet
const FIELDS = ["bg-peach", "bg-lilac", "bg-sage", "bg-marigold-soft"];

export default function EverydayProblems() {
  return (
    <Chapter
      id="problems"
      shot="problems"
      titleId="problems-title"
      eyebrow="Sound familiar?"
      title="Every household is solving the same problem. Alone."
      intro="Most families in a society rely on the same small group of helpers. Yet each flat handles attendance, pricing and replacements by itself — and it never quite gets solved."
      sheetClassName="bg-paper-raised"
    >
      {/* A chat thread every resident has had some version of, one message after another */}
      <ol className="mx-auto grid max-w-[1280px] gap-5 px-5 py-20 sm:px-8 md:grid-cols-12 md:gap-y-4 md:py-28">
        {PROBLEMS.map((p, i) => (
          <li
            key={p.title}
            data-reveal
            className={`rounded-[28px] p-6 sm:p-9 md:col-span-7 ${FIELDS[i]} ${i % 2 ? "md:col-start-6" : "md:col-start-1"}`}
          >
            <div className={`max-w-[24rem] ${i % 2 ? "md:ml-auto" : ""}`}>
              <div
                className={`rounded-[22px] bg-paper-raised px-5 py-4 shadow-[0_18px_40px_-28px_rgba(36,18,63,0.5)] ${
                  i % 2 ? "rounded-br-[6px]" : "rounded-bl-[6px]"
                }`}
              >
                <p lang="hi-Latn" className="text-[1.15rem] font-semibold leading-snug text-ink">
                  {p.message}
                </p>
                <p className="mt-1 flex items-baseline justify-between gap-4 text-[0.95rem] text-ink-muted">
                  <span className="italic">{p.gloss}</span>
                  <span className="shrink-0 text-sm font-semibold text-marigold-ink">{p.time}</span>
                </p>
              </div>
            </div>
            <h3 className="mt-8 text-2xl font-extrabold tracking-[-0.025em] text-ink">{p.title}</h3>
            <p className="mt-2 leading-relaxed text-ink">{p.body}</p>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}
