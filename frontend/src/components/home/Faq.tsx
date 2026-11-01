"use client";

import { useId, useState } from "react";
import Link from "next/link";
import Chapter from "@/components/ui/Chapter";
import { CONTACT } from "@/lib/site";
import { FAQS } from "@/lib/faqs";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <Chapter
      id="faqs"
      shot="faq"
      titleId="faq-title"
      eyebrow="FAQs"
      title="Questions committees ask us."
      intro={
        <>
          Something we haven’t covered? Call{" "}
          <a href={CONTACT.phoneHref} className="whitespace-nowrap font-semibold text-link text-purple">
            {CONTACT.phoneDisplay}
          </a>{" "}
          or write to{" "}
          <a href={CONTACT.emailHref} className="font-semibold text-link text-purple">
            {CONTACT.email}
          </a>
          . You can also{" "}
          <Link href="/contact" className="font-semibold text-link text-purple">
            visit our contact page
          </Link>
          .
        </>
      }
      sheetClassName="bg-paper-raised"
    >
      <div className="mx-auto max-w-[1280px] px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto max-w-3xl">
          <ul className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = open === i;
              const buttonId = `${baseId}-q${i}`;
              const panelId = `${baseId}-a${i}`;
              return (
                <li
                  key={faq.q}
                  data-reveal
                  className={`rounded-[24px] transition-colors duration-300 ${isOpen ? "bg-marigold-soft" : "bg-paper hover:bg-lilac/60"}`}
                >
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-start gap-5 rounded-[24px] px-6 py-6 text-left text-lg font-bold leading-snug tracking-[-0.01em] text-ink sm:gap-7 sm:px-7 sm:text-xl"
                    >
                      <span
                        aria-hidden="true"
                        className={`w-8 shrink-0 font-display text-[1.6rem] font-normal italic leading-none transition-colors sm:w-10 ${
                          isOpen ? "text-marigold-ink" : "text-purple/45"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">{faq.q}</span>
                      <span
                        aria-hidden="true"
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg transition-[transform,background-color,color] duration-300 ${
                          isOpen ? "rotate-45 bg-purple text-white" : "bg-lilac text-purple"
                        }`}
                      >
                        +
                      </span>
                    </button>
                  </h3>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="accordion-panel"
                    data-open={isOpen}
                    inert={!isOpen}
                  >
                    <div>
                      <p className="max-w-2xl pb-7 pl-[4.75rem] pr-6 leading-relaxed text-ink sm:pl-[6rem] sm:pr-14">{faq.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Chapter>
  );
}
