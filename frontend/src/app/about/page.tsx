import type { Metadata } from "next";
import Link from "next/link";
import SocietyEnquiryLink from "@/components/ui/SocietyEnquiryLink";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Why GetMyHelp organises domestic help at the society level, and what we believe about fair, dependable help for residents and helpers.",
  alternates: { canonical: "/about" },
};

const BELIEFS = [
  {
    title: "Start with the community",
    body: "The helpers, the families and the committee already know each other. We build on those relationships instead of replacing them.",
  },
  {
    title: "Fair to both sides",
    body: "Residents deserve clarity about who is coming into their home. Helpers deserve consistent rates, a clear scope of work and respect for their leave.",
  },
  {
    title: "Honest over impressive",
    body: "We’d rather tell you what we can realistically arrange than promise something we can’t deliver every time.",
  },
];

export default function About() {
  return (
    <main>
      <section aria-labelledby="about-title" className="mx-auto max-w-[1280px] px-5 pb-24 pt-10 sm:px-8 md:pb-32 md:pt-16">
        <p data-reveal className="text-base font-bold text-purple">
          About GetMyHelp
        </p>
        <h1 id="about-title" data-reveal className="display-xl mt-5 max-w-[18ch] text-balance text-ink">
          A peaceful home starts with dependable support.
        </h1>

        <div className="mt-16 grid gap-10 border-t border-ink/10 pt-16 lg:grid-cols-12 lg:gap-8">
          <p data-reveal className="display-md text-ink lg:col-span-5">
            For most Indian families, managing domestic help has always been harder than it should be.
          </p>
          <div className="lede space-y-5 text-ink lg:col-span-6 lg:col-start-7">
            <p data-reveal>
              Irregular attendance, sudden unavailability, difficult replacements and inconsistent salary expectations
              create stress every single month. And in a residential society, every household is dealing with the same
              problems separately.
            </p>
            <p data-reveal className="font-bold text-purple">
              We started GetMyHelp.in to change that — by solving it once, for the whole society.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="what-title" className="on-dark bg-purple-deep text-paper">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p data-reveal className="text-base font-bold text-lavender">
              What we do
            </p>
            <h2 id="what-title" data-reveal className="display-lg mt-4 text-balance">
              Domestic help, organised at the society level.
            </h2>
          </div>
          <div className="lede space-y-6 text-paper/90 lg:col-span-6 lg:col-start-7">
            <p data-reveal>
              GetMyHelp partners with residential societies through their RWA, AOA or managing committee. We register and
              verify the helpers already working in the community, agree one fair rate card with the committee, and help
              each household set up a plan that fits its routine.
            </p>
            <p data-reveal>
              After that, we coordinate the everyday: attendance, leave and replacements — so residents have one place to
              turn, and the committee isn’t left refereeing.
            </p>
            <Link href="/#how-it-works" data-reveal className="btn btn-light">
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="beliefs-title" className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 md:py-32">
        <p data-reveal className="text-base font-bold text-purple">
          What we believe
        </p>
        <h2 id="beliefs-title" data-reveal className="display-lg mt-4 max-w-3xl text-balance text-ink">
          Three ideas we won’t compromise on.
        </h2>
        <ol className="mt-14 grid gap-5 md:grid-cols-3">
          {BELIEFS.map((b, i) => (
            <li key={b.title} data-reveal className={`rounded-[28px] p-7 sm:p-9 ${i === 1 ? "bg-purple text-paper" : "bg-lilac text-ink"}`}>
              <h3 className="display-md">{b.title}</h3>
              <p className={`mt-4 leading-relaxed ${i === 1 ? "text-paper/90" : "text-ink"}`}>{b.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="where-title" className="bg-lilac">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 py-24 sm:px-8 md:py-28 lg:grid-cols-12 lg:items-end lg:gap-8">
          <div className="lg:col-span-7">
            <p data-reveal className="text-base font-bold text-purple">
              Where we are
            </p>
            <h2 id="where-title" data-reveal className="display-lg mt-4 text-balance text-ink">
              Starting in Ghaziabad, one society at a time.
            </h2>
            <p data-reveal className="lede mt-6 max-w-xl text-ink">
              We’re early, and we’re growing carefully. If your society would like to be part of it, we’d love to hear
              from you.
            </p>
          </div>
          <div data-reveal className="flex flex-col gap-3 sm:flex-row lg:col-span-4 lg:col-start-9 lg:flex-col lg:items-stretch">
            <SocietyEnquiryLink>Enquire for your society</SocietyEnquiryLink>
            <Link href="/#waitlist" className="btn btn-light">
              Join the resident waitlist
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
