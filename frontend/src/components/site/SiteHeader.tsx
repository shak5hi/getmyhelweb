"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/site";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import SocietyEnquiryLink from "@/components/ui/SocietyEnquiryLink";
import Wordmark from "@/components/site/Wordmark";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the menu and returns focus to the toggle; the page behind
  // doesn't scroll while the menu is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    lockScroll();
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
    };
  }, [menuOpen]);

  // Release the scroll lock synchronously so the page can scroll to a #hash
  // target during the navigation this click triggers.
  const closeMenu = () => {
    unlockScroll();
    setMenuOpen(false);
  };

  const isCurrent = (href: string) => !href.includes("#") && href === pathname;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen ? "bg-paper-raised" : "bg-paper"
      }`}
    >
      <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="rounded-lg" aria-label="GetMyHelp home" onClick={closeMenu}>
          <Wordmark />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-[0.95rem] font-semibold text-ink-muted">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  className="rounded-full px-4 py-2.5 transition-colors hover:bg-lilac hover:text-purple-deep aria-[current=page]:bg-lilac aria-[current=page]:text-purple-deep"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <SocietyEnquiryLink className="btn btn-primary hidden min-h-[2.75rem] px-5 py-2 text-[0.95rem] sm:inline-flex">
            Society enquiry
          </SocietyEnquiryLink>
          <button
            ref={toggleRef}
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-lilac text-purple-deep lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
              {menuOpen ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 7h14M3 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!menuOpen}
        data-lenis-prevent
        className="h-[calc(100dvh-76px)] overflow-y-auto bg-paper-raised px-5 pb-10 pt-4 sm:px-8 lg:hidden"
      >
        <nav aria-label="Mobile">
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={isCurrent(link.href) ? "page" : undefined}
                  className="flex items-center justify-between rounded-2xl px-4 py-4 text-2xl font-bold tracking-[-0.02em] text-ink transition-colors hover:bg-lilac aria-[current=page]:bg-lilac"
                  onClick={closeMenu}
                >
                  {link.label}
                  <span aria-hidden="true" className="text-lg text-purple">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 flex flex-col gap-3">
          <div onClickCapture={closeMenu}>
            <SocietyEnquiryLink className="btn btn-primary w-full">Enquire for your society</SocietyEnquiryLink>
          </div>
          <Link href="/#waitlist" className="btn btn-secondary w-full" onClick={closeMenu}>
            I’m a resident — join the waitlist
          </Link>
        </div>
      </div>
    </header>
  );
}
