import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 md:py-36">
      <div>
        <p className="text-base font-bold text-purple">Page not found</p>
        <h1 className="display-xl mt-5 max-w-[14ch] text-balance text-ink">This page took the day off.</h1>
        <p className="lede mt-6 max-w-xl text-ink">The page you’re looking for doesn’t exist or has moved.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            Back to the home page
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact us
          </Link>
        </div>
      </div>
    </main>
  );
}
