import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk, Newsreader } from "next/font/google";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import RevealObserver from "@/components/site/RevealObserver";
import SmoothScroll from "@/components/site/SmoothScroll";
import EnquiryDialog from "@/components/EnquiryDialog";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

// Headlines: an editorial serif. Everything else: a quiet grotesk.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

const DESCRIPTION =
  "GetMyHelp organises domestic help for residential societies in Ghaziabad: verified maids, cooks and cleaners, one society-agreed rate card, household plans and leave cover, coordinated in one place.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "GetMyHelp | Verified Domestic Help & Maids for Housing Societies in Ghaziabad",
    template: "%s | GetMyHelp",
  },
  description: DESCRIPTION,
  applicationName: "GetMyHelp",
  keywords: [
    "GetMyHelp",
    "Get My Help",
    "getmyhelp.in",
    "domestic help Ghaziabad",
    "maid service Ghaziabad",
    "verified maids",
    "house help for societies",
    "RWA domestic help",
    "society maid management",
    "cook in Ghaziabad",
    "home cleaning service",
    "utensil washing help",
    "maid replacement",
    "Indirapuram maid service",
  ],
  authors: [{ name: "GetMyHelp" }],
  creator: "GetMyHelp",
  publisher: "GetMyHelp",
  category: "Home services",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  openGraph: {
    title: "GetMyHelp — Your maid shouldn’t be a monthly problem to solve",
    description:
      "Domestic help, organised once for your whole society: verified helpers, society-agreed rates and household plans.",
    url: "/",
    siteName: "GetMyHelp",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetMyHelp — Domestic help, organised at the society level",
    description: "Verified helpers, society-agreed rates and household plans for residential societies in Ghaziabad.",
  },
  // Set these in the server's environment once the site is added to Google / Bing webmaster tools
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
  formatDetection: { telephone: true, email: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
};

// Hides reveal-on-scroll content only when JS is running; if hydration never
// completes, the fallback timer shows everything anyway.
// 'has-world': the home page's 3D world can play (WebGL, and no request for reduced motion)
const revealBootstrap = `document.documentElement.classList.add('js');try{var c=document.createElement('canvas');if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&(c.getContext('webgl2')||c.getContext('webgl')))document.documentElement.classList.add('has-world')}catch(e){}setTimeout(function(){if(!document.documentElement.classList.contains('reveal-ready')){document.documentElement.classList.remove('js')}},2500);`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${newsreader.variable} ${hanken.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-purple focus:px-5 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="main" tabIndex={-1} className="flex-1 outline-none">
          {children}
        </div>
        <SiteFooter />
        <RevealObserver />
        <SmoothScroll />
        <EnquiryDialog />
      </body>
    </html>
  );
}
