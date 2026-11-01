import type { Metadata } from "next";
import WaitlistForm from "@/components/WaitlistForm";
import SocietyEnquiryLink from "@/components/ui/SocietyEnquiryLink";
import { CONTACT } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with GetMyHelp — society enquiries, resident waitlist, phone and email.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <main>
      <section aria-labelledby="contact-title" className="mx-auto max-w-[1280px] px-5 pb-16 pt-10 sm:px-8 md:pt-16">
        <p data-reveal className="text-base font-bold text-purple">
          Contact
        </p>
        <h1 id="contact-title" data-reveal className="display-xl mt-5 max-w-[16ch] text-balance text-ink">
          Let’s talk about your society.
        </h1>
        <p data-reveal className="lede mt-6 max-w-2xl text-ink">
          Whether you’re on the committee or a resident hoping to bring GetMyHelp home, here’s the best way to reach us.
        </p>

        <dl className="mt-14 grid gap-4 sm:grid-cols-3">
          <div data-reveal className="rounded-[28px] bg-lilac p-7 sm:p-8">
            <dt className="font-bold text-purple">Phone</dt>
            <dd className="mt-3 text-2xl font-extrabold tracking-[-0.02em]">
              <a href={CONTACT.phoneHref} className="whitespace-nowrap text-link text-ink">
                {CONTACT.phoneDisplay}
              </a>
            </dd>
          </div>
          <div data-reveal className="rounded-[28px] bg-lilac p-7 sm:p-8">
            <dt className="font-bold text-purple">Email</dt>
            <dd className="mt-3 break-words text-2xl font-extrabold tracking-[-0.02em]">
              <a href={CONTACT.emailHref} className="text-link text-ink">
                {CONTACT.email}
              </a>
            </dd>
          </div>
          <div data-reveal className="rounded-[28px] bg-lilac p-7 sm:p-8">
            <dt className="font-bold text-purple">Based in</dt>
            <dd className="mt-3 text-2xl font-extrabold tracking-[-0.02em] text-ink">{CONTACT.location}</dd>
          </div>
        </dl>
      </section>

      <section aria-label="Ways to get started" className="mx-auto max-w-[1280px] px-5 pb-24 sm:px-8 md:pb-32">
        <div className="grid gap-5 lg:grid-cols-2">
          <article data-reveal className="on-dark flex flex-col rounded-[32px] bg-purple p-7 text-paper sm:p-10">
            <p className="font-bold text-lavender">For RWA, AOA and BOM members</p>
            <h2 className="display-md mt-3">Send a society enquiry.</h2>
            <p className="mt-4 leading-relaxed text-paper/90">
              Share a few details about your society through our short enquiry form, and we’ll arrange a conversation
              with your committee. An enquiry doesn’t commit your society to anything.
            </p>
            <div className="mt-auto pt-10">
              <SocietyEnquiryLink className="btn btn-light">Open the society enquiry form</SocietyEnquiryLink>
            </div>
          </article>

          <article data-reveal className="flex flex-col gap-6 rounded-[32px] bg-paper-raised p-7 sm:p-10">
            <div>
              <p className="font-bold text-purple">For residents</p>
              <h2 className="display-md mt-3 text-ink">Join the waitlist.</h2>
              <p className="mt-4 leading-relaxed text-ink">
                Leave your phone number or email and we’ll let you know when GetMyHelp is available in your society.
              </p>
            </div>
            <WaitlistForm variant="compact" />
          </article>
        </div>
      </section>
    </main>
  );
}
