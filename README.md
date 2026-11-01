# GetMyHelp

The website for **[GetMyHelp](https://getmyhelp.in)**: domestic help organised at the society level. GetMyHelp works with residential societies in Ghaziabad to register and verify the helpers already working there, agree one society-wide rate card, and coordinate household plans, leave and replacements.

The home page tells this as one scroll-driven story, set in a 3D housing society that stays behind the page as you read.

## Contents

- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Project structure](#project-structure)
- [How the site works](#how-the-site-works)
- [Forms and email](#forms-and-email)
- [SEO](#seo)
- [Deployment](#deployment)
- [Scripts](#scripts)

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, design tokens in `globals.css` |
| 3D | three.js through [React Three Fiber](https://r3f.docs.pmnd.rs) and drei |
| Motion | Lenis smooth scrolling, GSAP |
| Type | Newsreader (headlines) and Hanken Grotesk (text), loaded with `next/font` |
| Email | Nodemailer over SMTP (Hostinger mail) |
| Hosting | Ubuntu VPS: Nginx reverse proxy and PM2 |

## Getting started

Everything lives in the `frontend/` folder. You need **Node.js 20** or newer.

```bash
cd frontend
npm install
cp .env.example .env.local   # then fill in the values, see below
npm run dev
```

The dev server runs at **http://localhost:3006**.

Other commands:

```bash
npm run build   # production build
npm run start   # serve the production build (port 3000 by default)
npm run lint    # ESLint
```

## Environment variables

Set these in `frontend/.env.local`. The file is not committed to git; `.env.example` is the template.

| Variable | Required | Purpose |
| --- | --- | --- |
| `SMTP_HOST` | Yes | Mail server, e.g. `smtp.hostinger.com` |
| `SMTP_PORT` | Yes | `587` (STARTTLS) or `465` (SSL) |
| `SMTP_USER` | Yes | Mailbox the site logs in as |
| `SMTP_PASS` | Yes | That mailbox's password |
| `SMTP_FROM` | Yes | Sender, e.g. `"GetMyHelp System" <support@getmyhelp.in>`. It must be an address the SMTP login may send as |
| `NEXT_PUBLIC_SITE_URL` | Yes | The live address, `https://getmyhelp.in`. Used for canonical links, the sitemap and share previews |
| `SUPPORT_EMAIL` | No | Where form emails are sent. Defaults to `support@getmyhelp.in` |
| `GOOGLE_SITE_VERIFICATION` | No | Verification code from Google Search Console |
| `BING_SITE_VERIFICATION` | No | Verification code from Bing Webmaster Tools |

Without SMTP settings, local development falls back to a throwaway [Ethereal](https://ethereal.email) inbox, so forms can be tested without sending real email. In production, missing SMTP settings are logged as an error.

## Project structure

```
frontend/
├── src/
│   ├── app/                    # Routes (App Router)
│   │   ├── page.tsx            # Home page: the 3D story
│   │   ├── about/  contact/    # Other pages
│   │   ├── not-found.tsx       # 404 page
│   │   ├── api/
│   │   │   ├── enquiry/        # POST: society enquiry, emailed to support
│   │   │   ├── waitlist/       # POST: resident waitlist, emailed to support
│   │   │   └── health/         # GET: uptime check, returns { status: "ok" }
│   │   ├── layout.tsx          # Fonts, metadata, header, footer, enquiry dialog
│   │   ├── globals.css         # Design tokens and shared styles
│   │   ├── icon.svg            # Favicon (the "G")
│   │   ├── apple-icon.tsx      # Home-screen icon, generated
│   │   ├── opengraph-image.tsx # Share preview image, generated
│   │   ├── sitemap.ts  robots.ts  manifest.ts
│   ├── components/
│   │   ├── home/               # One file per home-page chapter
│   │   │   └── story/          # The 3D world: scene, camera stations, timeline
│   │   ├── site/               # Header, footer, wordmark, scroll and reveal helpers, structured data
│   │   ├── ui/                 # Chapter layout, enquiry button, shared pieces
│   │   ├── EnquiryDialog.tsx   # The society enquiry form
│   │   └── WaitlistForm.tsx    # The resident waitlist form
│   └── lib/
│       ├── site.ts             # Contact details, nav links, site URL: one source of truth
│       ├── faqs.ts             # FAQ content, used by the page and by search data
│       ├── mail.ts             # Shared mailer, HTML escaping, rate limiting
│       └── scroll.ts           # Lenis instance and scroll locking
├── ecosystem.config.js         # PM2 config
├── nginx.conf.example          # Nginx site config
├── deployment.sh  update.sh  rollback.sh
└── VPS_SETUP_GUIDE.md          # First-time server setup
```

## How the site works

### The 3D story

- **One canvas for the whole page.** `components/home/story/World.tsx` draws a single React Three Fiber canvas, fixed behind the home page. The content scrolls over it.
- **The hero.** The first 480–580vh of scroll is the hero story: approaching the society, entering a messy flat, and a helper arriving to tidy it. `timeline.ts` sets when each beat happens.
- **Camera stations.** After the hero, each chapter heading carries a `data-shot="<key>"` attribute. `stations.ts` maps each key to a camera position and the state of the scene: day or night, lit windows, rate tags, where the helper stands. As you scroll between chapters, the camera moves smoothly from one station to the next.
- **Which side the words go on.** A station's `shift` sets where the picture sits next to the words: positive puts it on the right, negative on the left, `0` centres it. On phones the picture always sits below the words.
- **Pausing.** The canvas stops rendering while no chapter heading is on screen, to save battery.

### When the 3D world doesn't play

An inline script in `layout.tsx` adds the class `has-world` to the page when WebGL is available and the visitor hasn't asked for reduced motion. Without it, the page shows a still hero and plain section headings, and stays fully readable.

### Design tokens

The colours use a split-complementary scheme around the brand violet. They are defined once in `globals.css` and used through Tailwind classes such as `bg-purple`, `text-marigold` and `bg-sage`.

| Token | Use |
| --- | --- |
| `paper`, `lilac` | Page and card backgrounds |
| `purple`, `purple-deep`, `purple-night` | Buttons, dark bands, night scenes |
| `marigold` | The accent: one highlight per screen, at most |
| `peach`, `sage` | Section backgrounds |

### Scroll reveals

Elements with `data-reveal` fade in as they enter the screen. `RevealObserver.tsx` marks them with a `data-shown` attribute rather than a class, so React re-rendering an element's `className` can never hide it again.

## Forms and email

Both forms post to API routes, which email **support@getmyhelp.in** using the shared mailer in `src/lib/mail.ts`.

| Form | Opens from | Route | Backup on the server |
| --- | --- | --- | --- |
| Society enquiry | Any "Society enquiry" or "Enquire for your society" button | `POST /api/enquiry` | `frontend/enquiry_data.csv` |
| Resident waitlist | The waitlist section and the contact page | `POST /api/waitlist` | `frontend/waitlist_data.csv` |

- **Backups.** Each submission is also appended to a CSV file on the server, so nothing is lost if the mail server is down. Both files are git-ignored.
- **Protection.** Both routes allow 5 requests per IP per minute and validate every field. The enquiry form also has a hidden honeypot field to catch spam bots.
- **Replying.** The emails set Reply-To to the visitor's email address when they gave one.

To open the enquiry form from new code, render `<SocietyEnquiryLink>` or call `openEnquiry()` from `components/EnquiryDialog.tsx`.

## SEO

- **Metadata.** Titles, descriptions, keywords, Open Graph and Twitter cards are set in `app/layout.tsx`. Each page sets its own canonical link.
- **Crawling.** `/sitemap.xml` and `/robots.txt` are generated by `sitemap.ts` and `robots.ts`. `/api/` is excluded from crawling.
- **Structured data.** JSON-LD for the website, the business (a LocalBusiness in Ghaziabad) and the FAQs is in `components/site/StructuredData.tsx`.
- **Icons and share image.** The favicon, home-screen icon and share image are generated at build time.

After deploying, add the site to [Google Search Console](https://search.google.com/search-console), set `GOOGLE_SITE_VERIFICATION`, and submit `https://getmyhelp.in/sitemap.xml`.

## Deployment

The live site runs on a Hostinger Ubuntu VPS:

1. Nginx serves `getmyhelp.in` over HTTPS, using a Let's Encrypt certificate from Certbot.
2. Nginx forwards requests to the app on port 3000.
3. PM2 keeps the app running, under the process name `getmyhelp`.

For a fresh server, follow [`frontend/VPS_SETUP_GUIDE.md`](frontend/VPS_SETUP_GUIDE.md).

### Releasing a change

Pushing to `main` does **not** deploy by itself. To release, SSH into the server and run, from the project's `frontend/` folder:

```bash
bash update.sh
```

`update.sh` does the following:

1. Pulls `main`.
2. Installs dependencies.
3. Stops PM2.
4. Deletes the old build.
5. Rebuilds.
6. Restarts PM2.

The site is down while it builds, so run `npm run build` locally before pushing to make sure the build passes.

Check that it worked:

```bash
pm2 status
pm2 logs getmyhelp
curl https://getmyhelp.in/api/health   # {"status":"ok"}
```

### Rolling back

```bash
bash rollback.sh
```

`rollback.sh` resets the server's copy to the previous commit (`HEAD~1`), rebuilds and restarts. It only changes the server's copy, not GitHub, so the next `update.sh` brings the newer code back. To undo a release for good, revert the commit on `main` and run `update.sh`.

> `deployment.sh` and `rollback.sh` also copy files into `.next/standalone`. The app is not built in standalone mode, since PM2 runs `next start`, so those copy steps print errors that can be ignored.

### Server environment

PM2 reads `frontend/.env.local` on the server through `ecosystem.config.js`. After changing it, restart the app so the new values are picked up:

```bash
pm2 restart getmyhelp --update-env
```

`NEXT_PUBLIC_*` values are baked in at build time, so changing `NEXT_PUBLIC_SITE_URL` needs a rebuild (`bash update.sh`).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3006, using webpack |
| `npm run build` | Production build, using Turbopack |
| `npm run start` | Serves the production build |
| `npm run lint` | Runs ESLint |
| `deployment.sh` | First deploy on a new server |
| `update.sh` | Releases the latest `main` |
| `rollback.sh` | Goes back one commit on the server |

## Contact

GetMyHelp · Ghaziabad, India · [support@getmyhelp.in](mailto:support@getmyhelp.in) · +91 9818595170
