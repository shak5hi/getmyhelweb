import Chapter from "@/components/ui/Chapter";
import SocietyEnquiryLink from "@/components/ui/SocietyEnquiryLink";
import { CONTACT } from "@/lib/site";

// The last shot: the whole society from above at night, every flat lit
export default function FinalCta() {
  return (
    <Chapter
      id="enquire"
      shot="cta"
      titleId="final-cta-title"
      dark
      align="center"
      eyebrow="For committee members"
      title="Bring it up at your next committee meeting."
      intro="Tell us a little about your society and we’ll set up a conversation with your committee. There’s no commitment in an enquiry."
      aside={
        <div data-reveal className="mt-10 flex flex-col gap-5 md:items-center">
          <SocietyEnquiryLink className="btn btn-accent w-full sm:w-auto sm:self-start md:self-center">Enquire for your society</SocietyEnquiryLink>
          <p className="text-paper/85">
            Prefer to talk?{" "}
            <a href={CONTACT.phoneHref} className="whitespace-nowrap font-semibold text-link text-paper">
              {CONTACT.phoneDisplay}
            </a>
            <br />
            <a href={CONTACT.emailHref} className="font-semibold text-link text-paper">
              {CONTACT.email}
            </a>
          </p>
        </div>
      }
    />
  );
}
