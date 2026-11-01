import WaitlistForm from "@/components/WaitlistForm";
import Chapter from "@/components/ui/Chapter";

const STEPS = [
  "Join the waitlist with your phone or email.",
  "Mention GetMyHelp to your committee.",
  "We’ll be in touch when your society is ready.",
];

export default function ResidentWaitlist() {
  return (
    <Chapter
      id="waitlist"
      shot="waitlist"
      titleId="waitlist-title"
      dark
      align="right"
      eyebrow="For residents"
      title="Live in a society? Let us know you’re interested."
      intro="GetMyHelp is set up society by society, so the quickest way to bring it home is through your committee. Join the waitlist, then share this page with your RWA or AOA."
      sheetClassName="bg-peach"
    >
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <ol className="space-y-3">
            {STEPS.map((step, i) => (
              <li key={step} data-reveal className="flex items-center gap-4 text-ink">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-marigold font-extrabold text-purple-night">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <div data-reveal="scale" className="relative">
            <WaitlistForm />
          </div>
        </div>
      </div>
    </Chapter>
  );
}
