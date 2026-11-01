// Single source of truth for contact details and enquiry destinations.

// The live address, for canonical links, the sitemap and sharing previews
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://getmyhelp.in").replace(/\/$/, "");

export const CONTACT = {
  phoneDisplay: "+91 9818595170",
  phoneHref: "tel:+919818595170",
  email: "support@getmyhelp.in",
  emailHref: "mailto:support@getmyhelp.in",
  location: "Ghaziabad, India",
};

export const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#services", label: "Services" },
  { href: "/#societies", label: "For societies" },
  { href: "/#faqs", label: "FAQs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
