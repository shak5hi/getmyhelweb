import { CONTACT, SITE_URL } from "@/lib/site";
import { FAQS } from "@/lib/faqs";

// What search engines read about GetMyHelp: who it is, where it works, how to reach it,
// and the answers to the common questions. Kept in step with the page's own content.
export default function StructuredData() {
  const org = `${SITE_URL}/#organization`;
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "GetMyHelp",
        alternateName: ["Get My Help", "getmyhelp.in"],
        inLanguage: "en-IN",
        publisher: { "@id": org },
      },
      {
        "@type": ["Organization", "LocalBusiness"],
        "@id": org,
        name: "GetMyHelp",
        alternateName: "Get My Help",
        url: SITE_URL,
        logo: `${SITE_URL}/icon.svg`,
        image: `${SITE_URL}/opengraph-image`,
        description:
          "Domestic help organised at the society level: verified helpers, one society-agreed rate card, household plans and coordinated leave cover for residential societies.",
        email: CONTACT.email,
        telephone: CONTACT.phoneHref.replace("tel:", ""),
        address: { "@type": "PostalAddress", addressLocality: "Ghaziabad", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
        areaServed: { "@type": "City", name: "Ghaziabad" },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: CONTACT.phoneHref.replace("tel:", ""),
          email: CONTACT.email,
          contactType: "customer service",
          areaServed: "IN",
          availableLanguage: ["English", "Hindi"],
        },
        makesOffer: ["Home cleaning", "Utensil washing", "Cooking"].map((name) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name, areaServed: "Ghaziabad" },
        })),
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faqs`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // escape "<" so nothing in the data can close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
