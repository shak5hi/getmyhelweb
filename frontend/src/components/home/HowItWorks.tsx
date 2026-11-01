import Chapter from "@/components/ui/Chapter";

const STEPS = [
  {
    who: "Your committee",
    title: "Start the conversation",
    body: "Send us a society enquiry. We meet your RWA, AOA or managing committee to understand the society and agree the scope of work and a single rate card.",
    scene: <CommitteeCard />,
  },
  {
    who: "Your helpers",
    title: "Register the helpers you already know",
    body: "Helpers already working in the society are invited to register and complete verification. Where there are gaps, we introduce additional verified helpers.",
    scene: <HelperCard />,
  },
  {
    who: "Each household",
    title: "Pick a plan and get on with your day",
    body: "Residents choose the services their home needs. We coordinate schedules, leave and replacements — so issues come to us, not to the committee.",
    scene: <PlanCard />,
  },
];

const SCENE_FIELDS = ["bg-lilac", "bg-peach", "bg-marigold-soft"];

export default function HowItWorks() {
  return (
    <Chapter
      id="how-it-works"
      shot="how"
      titleId="how-title"
      align="right"
      eyebrow="How it works"
      title="Three steps. Most of them are ours."
      intro="Setting up GetMyHelp takes one decision from your society. After that, the coordination is our job."
      sheetClassName="bg-sage"
    >
      {/* each step a little further along than the last, like a stair */}
      <ol className="mx-auto grid max-w-[1280px] gap-5 px-5 py-20 sm:px-8 md:grid-cols-3 md:items-start md:pb-44 md:pt-28">
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            data-reveal
            className={`group flex flex-col overflow-hidden rounded-[28px] bg-paper-raised shadow-[0_30px_60px_-40px_rgba(36,18,63,0.45)] ${
              ["", "md:mt-16", "md:mt-32"][i]
            }`}
          >
            <div aria-hidden="true" className={`relative flex aspect-[5/4] items-center justify-center overflow-hidden px-8 ${SCENE_FIELDS[i]}`}>
              <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-purple text-xl font-extrabold text-white">
                {i + 1}
              </span>
              <div className="w-full max-w-[17rem] transition-transform duration-700 ease-[var(--ease-out)] group-hover:-translate-y-1.5 group-hover:-rotate-1">
                {step.scene}
              </div>
            </div>
            <div className="flex flex-1 flex-col p-7 sm:p-8">
              <p className="text-base font-bold text-sage-ink">{step.who}</p>
              <h3 className="mt-2 text-[1.6rem] font-extrabold leading-tight tracking-[-0.025em] text-ink">{step.title}</h3>
              <p className="mt-3 leading-relaxed text-ink">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </Chapter>
  );
}

const CARD = "rounded-[22px] bg-paper-raised p-5 shadow-[0_30px_60px_-30px_rgba(36,18,63,0.4)]";

function Tick({ on = true }: { on?: boolean }) {
  return (
    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${on ? "bg-purple text-white" : "bg-ink/10"}`}>
      {on && (
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

// The committee's side of the agreement
function CommitteeCard() {
  return (
    <div className={`${CARD} rotate-[-2deg]`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-ink-muted">Society enquiry</p>
        <div className="flex -space-x-2">
          {["R", "A", "M"].map((l, i) => (
            <span
              key={l}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-extrabold ring-2 ring-paper-raised ${
                ["bg-purple text-white", "bg-lavender text-purple-deep", "bg-[#f3d9c4] text-purple-deep"][i]
              }`}
            >
              {l}
            </span>
          ))}
        </div>
      </div>
      <ul className="mt-5 space-y-3">
        {["Scope of work", "Single rate card"].map((row) => (
          <li key={row} className="flex items-center gap-3 rounded-[14px] bg-lilac px-3.5 py-3 font-bold text-ink">
            <Tick />
            {row}
          </li>
        ))}
      </ul>
    </div>
  );
}

// A helper the society already knows, registered and verified
function HelperCard() {
  return (
    <div className={`${CARD} rotate-[1.5deg]`}>
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#f3d9c4] text-2xl font-extrabold text-purple-deep">
          S
        </span>
        <div className="min-w-0">
          <p className="font-extrabold leading-tight text-ink">Already working in your society</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-full bg-lilac px-2.5 py-1 text-xs font-bold text-purple">Registered</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple px-2.5 py-1 text-xs font-bold text-white">
              <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
                <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Verified
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// One household choosing its services
function PlanCard() {
  const services: [string, boolean][] = [
    ["Home cleaning", true],
    ["Utensil washing", true],
    ["Cooking", false],
  ];
  return (
    <div className={`${CARD} rotate-[-1deg]`}>
      <p className="text-sm font-bold text-ink-muted">Household plan</p>
      <ul className="mt-4 space-y-2.5">
        {services.map(([name, on]) => (
          <li key={name} className="flex items-center justify-between gap-3">
            <span className={`font-bold ${on ? "text-ink" : "text-ink-muted"}`}>{name}</span>
            <span className={`flex h-6 w-11 items-center rounded-full p-0.5 ${on ? "justify-end bg-purple" : "bg-ink/15"}`}>
              <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
