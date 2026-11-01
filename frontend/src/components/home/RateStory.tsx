const STATES = [
  {
    label: "Flat by flat",
    title: "A different rate in every flat",
    body: "The same work is priced differently across the building, and every household renegotiates on its own.",
  },
  {
    label: "With GetMyHelp",
    title: "One society-agreed rate card",
    body: "Rates are agreed with your committee, based on flat size and the work involved, and are the same for every participating household.",
  },
];

// Each flat's tag as it is today: its own tilt, width and colour
const FLATS = [
  { no: "A-101", tilt: -7, width: 38, tone: "bg-[#f3d9c4]" },
  { no: "A-102", tilt: 5, width: 74, tone: "bg-lavender" },
  { no: "A-103", tilt: -3, width: 52, tone: "bg-paper" },
  { no: "B-201", tilt: 9, width: 88, tone: "bg-[#e4dccd]" },
  { no: "B-202", tilt: -10, width: 30, tone: "bg-lavender" },
  { no: "B-203", tilt: 4, width: 64, tone: "bg-[#f3d9c4]" },
  { no: "C-301", tilt: -5, width: 80, tone: "bg-paper" },
  { no: "C-302", tilt: 8, width: 44, tone: "bg-[#e4dccd]" },
  { no: "C-303", tilt: -6, width: 58, tone: "bg-lavender" },
];

const AGREED_WIDTH = 62;

// The society-first idea in one move, told on the building itself: each flat
// has its own rate tag, then they straighten into one society rate as the
// visitor scrolls. Without the 3D world, two boards of doors show the same.
export default function RateStory() {
  return (
    <>
      {STATES.map((state, i) => (
        <div
          key={state.title}
          id={i === 0 ? "rates" : "one-rate"}
          data-shot={i === 0 ? "rates" : "ratesAgreed"}
          data-label={state.label}
          className="moment moment-dark on-dark text-paper"
        >
          <div aria-hidden="true" className="moment-wash wash-dark" />
          <div className="relative mx-auto grid w-full max-w-[1280px] items-center gap-12 px-5 sm:px-8 md:grid-cols-2">
            <div className="max-w-[34rem]">
              <p data-reveal className={`text-base font-bold ${i === 0 ? "text-paper/60" : "text-marigold"}`}>
                {state.label}
              </p>
              <h3 data-reveal className="display-lg mt-4 text-balance">
                {state.title}
              </h3>
              <p data-reveal className="lede mt-6 text-paper/80">
                {state.body}
              </p>
            </div>
            <div className="world-hide">
              <Board agreed={i === 1} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function Board({ agreed }: { agreed: boolean }) {
  return (
    <div
      role="img"
      aria-label={
        agreed
            ? "Nine flat doors, each with the same society rate tag"
            : "Nine flat doors, each with a different rate tag hanging at its own angle"
      }
      className="mx-auto w-full max-w-[30rem] rounded-[32px] bg-paper/[0.06] p-4 sm:p-6"
    >
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {FLATS.map((flat) => (
          <div
            key={flat.no}
            className="flex aspect-[5/6] flex-col items-center rounded-b-[14px] rounded-t-[999px] bg-paper/[0.08] px-2 pb-3 pt-[22%] sm:px-3"
          >
            <span className="text-[0.8rem] font-bold tracking-wide text-paper/55">{flat.no}</span>
            <span className="mt-auto h-6 w-px bg-paper/30" aria-hidden="true" />
            <span
              style={agreed ? undefined : { transform: `rotate(${flat.tilt}deg)` }}
              className={`relative flex w-full origin-top items-center gap-1.5 rounded-[10px] px-2.5 py-2 text-[0.9rem] font-extrabold ${
                agreed ? "bg-marigold text-purple-night" : `${flat.tone} text-purple-deep`
              }`}
            >
              ₹
              <span className="h-2 flex-1 overflow-hidden rounded-full">
                <span
                  style={{ width: `${agreed ? AGREED_WIDTH : flat.width}%` }}
                  className={`block h-full rounded-full ${agreed ? "bg-purple-night/75" : "bg-purple-deep/35"}`}
                />
              </span>
              {agreed && (
                <span
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-paper text-purple-deep"
                >
                  <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                    <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
