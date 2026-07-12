import React from 'react';
import Link from 'next/link';

export default function HeaderV2() {
  return (
    <header id="hero-header" className="fixed top-0 left-0 w-full z-50 px-8 py-5 flex items-center justify-between transition-all duration-300">
      
      {/* Empty space on the left to balance the layout (where logo used to be) */}
      <div className="flex-1"></div>

      {/* Nav Links - centered */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#1A0E1F]/80">
        <Link href="#why-us" className="hover:text-black transition-colors">Why us</Link>
        <Link href="#how-it-works" className="hover:text-black transition-colors">How it works</Link>
        <Link href="#faqs" className="hover:text-black transition-colors">FAQs</Link>
      </nav>

      {/* Right side CTA styled like the reference image (glassy rectangle) */}
      <div className="flex-1 flex justify-end">
        <Link 
          href="#book" 
          className="cta-btn bg-[#5100B2]/10 backdrop-blur-md border border-[#5100B2]/20 hover:bg-[#5100B2]/20 text-[#5100B2] px-5 py-2 rounded-md text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgba(81,0,178,0.1)]"
        >
          Set it in your society
        </Link>
      </div>
    </header>
  );
}
