"use client";

import Link from "next/link";

export default function Header() {
  const handleScrollToCapture = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("waitlist-section")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 px-6 md:px-12 lg:px-24 py-6 z-50 bg-[#FFFFFF]/80 backdrop-blur-md border-b border-[#1A0E1F]/5">
      <header className="max-w-7xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-xl md:text-2xl font-display font-extrabold tracking-tight text-[#1A0E1F] hover:opacity-80 transition-opacity"
        >
          GetMyHelp<span className="text-[#E83F9C] font-normal font-sans text-lg">.in</span>
        </Link>
        <button
          onClick={handleScrollToCapture}
          className="text-xs md:text-sm font-sans font-bold tracking-wider uppercase text-[#1A0E1F]/70 hover:text-[#1A0E1F] border-b border-transparent hover:border-[#E83F9C] transition-all duration-300 py-1 cursor-pointer"
        >
          Get Early Access
        </button>
      </header>
    </div>
  );
}
