import Link from "next/link";
import { CONTACT } from "@/lib/site";
import Wordmark from "@/components/site/Wordmark";
import SocietyEnquiryLink from "@/components/ui/SocietyEnquiryLink";

const EXPLORE = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#services", label: "Services & plans" },
  { href: "/#leave", label: "Leave & replacements" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

export default function SiteFooter() {
  return (
    <footer className="on-dark relative z-10 overflow-hidden bg-purple-night text-paper">
      <div className="mx-auto max-w-[1280px] px-5 pb-10 pt-20 sm:px-8 md:pt-24">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <Wordmark light />
            <p className="mt-6 max-w-sm leading-relaxed text-paper/80">
              Domestic help, organised at the society level — verified helpers, society-agreed rates and household
              plans, coordinated in one place.
            </p>
            <p className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-paper/[0.08] px-4 py-2 text-[0.95rem] font-semibold text-paper">
              <span className="h-2 w-2 rounded-full bg-lavender" aria-hidden="true" />
              Starting with societies in Ghaziabad
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <h2 className="font-bold text-lavender">Explore</h2>
            <ul className="mt-5 space-y-3 text-paper/85">
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="font-bold text-lavender">Get in touch</h2>
            <ul className="mt-5 space-y-3 text-paper/85">
              <li>
                <SocietyEnquiryLink arrow={false} className="text-left transition-colors hover:text-white">
                  Society enquiry form
                </SocietyEnquiryLink>
              </li>
              <li>
                <Link href="/#waitlist" className="transition-colors hover:text-white">
                  Resident waitlist
                </Link>
              </li>
              <li>
                <a href={CONTACT.phoneHref} className="whitespace-nowrap transition-colors hover:text-white">
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={CONTACT.emailHref} className="transition-colors hover:text-white">
                  {CONTACT.email}
                </a>
              </li>
              <li className="text-paper/65">{CONTACT.location}</li>
            </ul>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 select-none text-center text-[clamp(3.5rem,15.5vw,14.5rem)] font-extrabold leading-[0.8] tracking-[-0.055em] text-paper/[0.09]"
        >
          GetMyHelp
        </p>

        <div className="mt-10 flex flex-col gap-3 text-[0.95rem] text-paper/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} GetMyHelp.in. All rights reserved.</p>
          <p>Made for the people who keep our homes running.</p>
        </div>
      </div>
    </footer>
  );
}
