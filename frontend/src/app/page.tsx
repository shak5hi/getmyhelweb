"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import WordSafeHeadline from "@/components/WordSafeHeadline";
import RecognitionSection from "@/components/RecognitionSection";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const targetCount = 2480;

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const triggerCountUp = () => {
    if (hasAnimated) return;
    setHasAnimated(true);

    if (reducedMotion) {
      setCount(targetCount);
      return;
    }

    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const pct = Math.min(elapsed / duration, 1);

      // Cubic ease-out
      const easePct = 1 - Math.pow(1 - pct, 3);
      setCount(Math.floor(easePct * targetCount));

      if (elapsed < duration) {
        window.requestAnimationFrame(step);
      } else {
        setCount(targetCount);
      }
    };

    window.requestAnimationFrame(step);
  };

  const handleScrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("waitlist-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToRecognition = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("recognition-section")?.scrollIntoView({ behavior: "smooth" });
  };

  // Entrance timelines (respecting reduced motion)
  const badgeVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" } // 0-200ms
    }
  };

  const supportingVariants: any = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: reducedMotion ? 0 : 0.7, duration: 0.25, ease: [0.16, 1, 0.3, 1] } // 700-950ms
    }
  };

  const ctaVariants: any = {
    hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: reducedMotion ? 0 : 0.9, duration: 0.2, ease: [0.16, 1, 0.3, 1] } // 900-1100ms
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFFFF] text-[#1A0E1F] font-sans overflow-x-hidden selection:bg-[#7B2FD1]/10 selection:text-[#7B2FD1]">
      {/* Navigation Bar */}
      <Header />

      {/* Hero Section */}
      <main className="flex-1 w-full relative">
        <div className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center pt-28 md:pt-0 overflow-hidden">
          {/* Mobile slim background bar accent */}
          <div className="block md:hidden absolute top-0 left-0 w-full h-36 bg-[#7B2FD1]/10 z-0"></div>

          <div className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 grid grid-cols-1 md:grid-cols-12 items-center gap-12 z-10 relative">
            
            {/* Left Column Text details */}
            <div className="col-span-1 md:col-span-7 flex flex-col gap-6 md:gap-8 items-start justify-center">
              
              {/* Badge element */}
              <motion.div
                variants={badgeVariants}
                initial="hidden"
                animate="visible"
                className="w-20 h-20 md:w-24 md:h-24 relative select-none"
              >
                <svg viewBox="0 0 100 100" className="w-full h-full badge-stamp">
                  <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="none" />
                  <text className="text-[7.2px] font-sans font-bold tracking-[2.8px] fill-[#7B2FD1] uppercase">
                    <textPath href="#circlePath">
                      GHAZIABAD • PRIVATE BETA • GHAZIABAD • PRIVATE BETA • 
                    </textPath>
                  </text>
                </svg>
                <div className="absolute top-[48%] left-[48%] w-1.5 h-1.5 bg-[#7B2FD1] rounded-full"></div>
              </motion.div>

              {/* Headline with word-safe letter stagger animation */}
              <WordSafeHeadline
                text='Built for the mornings that start with "Didi nahi aayi."'
                className="text-4xl md:text-5xl lg:text-5.5xl leading-[1.12] tracking-tight"
              />

              {/* Supporting info */}
              <motion.p
                variants={supportingVariants}
                initial="hidden"
                animate="visible"
                className="text-[#1A0E1F]/70 text-base md:text-lg font-sans max-w-md leading-relaxed font-medium"
              >
                Because your day shouldn't fall apart before it even begins.
              </motion.p>

              {/* CTA Button */}
              <motion.div
                variants={ctaVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap gap-4 items-center mt-1"
              >
                <button
                  onClick={handleScrollToForm}
                  className="px-8 py-3.5 rounded-full bg-[#E83F9C] text-[#FFFFFF] font-sans font-bold text-xs uppercase tracking-widest border border-[#FFD400]/40 hover:border-[#FFD400] transition-all duration-300 hover:shadow-[0_4px_25px_rgba(232,63,156,0.25)] cursor-pointer"
                >
                  Request Access
                </button>
              </motion.div>
            </div>

            {/* Right Column - Vertical Framed Photo (Matches Inspo Layout) */}
            <div className="hidden md:flex col-span-12 md:col-span-5 justify-center z-10">
              <div className="w-full max-w-[340px] md:max-w-none h-[420px] md:h-[500px] lg:h-[550px] rounded-3xl overflow-hidden bg-[#1A0E1F] border border-[#1A0E1F]/10 shadow-lg relative group">
                <img
                  src="/editorial_home.png"
                  alt="Aesthetic sunlit modern home"
                  className="w-full h-full object-cover grayscale contrast-125 brightness-90 transition-transform duration-700 group-hover:scale-103"
                />
                {/* Subtle gradient gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0E1F]/40 via-transparent to-transparent pointer-events-none"></div>
                
                {/* Corner stamp badge graphic overlay */}
                <div className="absolute top-6 right-6 w-16 h-16 bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#1A0E1F]/10 rounded-full flex items-center justify-center pointer-events-none shadow-sm animate-fade-in">
                  <span className="text-[8px] font-sans font-extrabold tracking-wider text-[#7B2FD1] uppercase text-center leading-none">HELP<br/>SECURED</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Recognition Moment wrapper */}
        <div id="recognition-section">
          <RecognitionSection />
        </div>

        {/* Section 3: Capture / Close */}
        <motion.section
          id="waitlist-section"
          onViewportEnter={triggerCountUp}
          viewport={{ once: true, amount: 0.3 }}
          className="w-full bg-[#FFFFFF] py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-[#1A0E1F]/10 flex flex-col items-center justify-center text-center relative z-10 animate-fade-in"
        >
          <div className="max-w-md w-full flex flex-col items-center gap-8">
            <div className="flex flex-col items-center">
              <span className="text-5.5xl md:text-7xl font-display font-extrabold text-[#7B2FD1] tracking-tighter leading-none select-none">
                {count.toLocaleString()}
              </span>
              <span className="text-[11px] font-sans font-bold tracking-widest text-[#1A0E1F]/40 uppercase mt-2.5">
                homes on the waitlist
              </span>
            </div>

            <WaitlistForm variant="compact" />

            <p className="text-[10px] text-[#1A0E1F]/40 font-sans tracking-wide">
              Open to a limited number of homes this month.
            </p>
          </div>
        </motion.section>
      </main>

      {/* Editorial Footer */}
      <footer className="w-full bg-[#1A0E1F] text-[#FFFFFF] border-t border-[#FFFFFF]/10 pt-20 pb-12 px-6 md:px-12 lg:px-24 relative z-30 font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-[#FFFFFF]/10">
          
          {/* Logo & Vision Column */}
          <div className="col-span-12 md:col-span-4 flex flex-col items-start gap-4">
            <span className="text-2xl font-display font-extrabold tracking-tight text-[#FFFFFF]">
              GetMyHelp<span className="text-[#E83F9C] font-normal font-sans text-lg">.in</span>
            </span>
            <p className="text-xs text-[#FFFFFF]/60 max-w-sm leading-relaxed">
              We take complete responsibility for your domestic staffing. No negotiation, no attendance worries, standard flat rates. Completely managed care.
            </p>
            <div className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FFFFFF]/5 border border-[#FFFFFF]/10 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E9AAE] animate-pulse"></span>
              <span className="text-[10px] font-sans font-bold tracking-wider text-[#FFFFFF]/80 uppercase">Private Beta Active</span>
            </div>
          </div>

          {/* Quick Links / Services */}
          <div className="col-span-12 sm:col-span-4 md:col-span-2 flex flex-col items-start gap-4">
            <span className="text-xs font-bold tracking-widest text-[#7B2FD1] uppercase">Services</span>
            <ul className="flex flex-col gap-2.5 text-xs text-[#FFFFFF]/60 font-medium">
              <li className="hover:text-[#E83F9C] transition-colors cursor-pointer">Daily Household Cooks</li>
              <li className="hover:text-[#E83F9C] transition-colors cursor-pointer">Daily Home Cleaners</li>
              <li className="hover:text-[#E83F9C] transition-colors cursor-pointer">Full-Time Maid Staff</li>
              <li className="hover:text-[#E83F9C] transition-colors cursor-pointer">Managed Backups</li>
            </ul>
          </div>

          {/* Contact Details Column */}
          <div className="col-span-12 sm:col-span-4 md:col-span-3 flex flex-col items-start gap-4">
            <span className="text-xs font-bold tracking-widest text-[#7B2FD1] uppercase">Contact Us</span>
            <ul className="flex flex-col gap-3 text-xs text-[#FFFFFF]/60 font-medium">
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#E83F9C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2a2 2 0 012 1.72 11.53 11.53 0 00.82 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 11.3 11.3 0 002.81.82A2 2 0 0122 17v2a2 2 0 01-2 2 17 17 0 01-17-17z" />
                </svg>
                <a href="tel:+919818595170" className="hover:text-[#E83F9C] transition-colors">
                  +91 9818595170
                </a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 text-[#E83F9C] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:support@getmyhelp.in" className="hover:text-[#E83F9C] transition-colors">
                  support@getmyhelp.in
                </a>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-3.5 h-3.5 text-[#E83F9C] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>
                  Ghaziabad, India<br />
                  <span className="text-[10px] text-[#FFFFFF]/40">Serving Ghaziabad</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Socials / Action Column */}
          <div className="col-span-12 sm:col-span-4 md:col-span-3 flex flex-col items-start gap-4">
            <span className="text-xs font-bold tracking-widest text-[#7B2FD1] uppercase">Follow Our Journey</span>
            <div className="flex flex-col gap-2 text-xs">
              <a href="#" className="text-[#FFFFFF]/60 hover:text-[#E83F9C] transition-colors flex items-center gap-1.5 group">
                <span>Twitter</span>
                <span className="text-[10px] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
              <a href="#" className="text-[#FFFFFF]/60 hover:text-[#E83F9C] transition-colors flex items-center gap-1.5 group">
                <span>Instagram</span>
                <span className="text-[10px] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
              <a href="#" className="text-[#FFFFFF]/60 hover:text-[#E83F9C] transition-colors flex items-center gap-1.5 group">
                <span>LinkedIn</span>
                <span className="text-[10px] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Base */}
        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p className="text-[10px] text-[#FFFFFF]/40 tracking-wider uppercase">
            © {new Date().getFullYear()} GetMyHelp.in. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-[10px] text-[#FFFFFF]/40 tracking-wider uppercase font-bold">
            <a href="#" className="hover:text-[#FFFFFF] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#FFFFFF] transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
