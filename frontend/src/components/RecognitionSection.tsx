"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAGMENTS = [
  "“Aaj nahi aa sakti.”",
  "“Same work. Different price.”",
  "“New face. Again.”"
];

export default function RecognitionSection() {
  const [inView, setInView] = useState(false);
  const [currentFragmentIndex, setCurrentFragmentIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);
    const handleChange = () => setReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Typewriter sequence trigger
  useEffect(() => {
    if (!inView || animationComplete || reducedMotion) return;

    let timer: NodeJS.Timeout;
    const currentText = FRAGMENTS[currentFragmentIndex];

    if (isTyping) {
      if (charIndex < currentText.length) {
        timer = setTimeout(() => {
          setTypedText((prev) => prev + currentText[charIndex]);
          setCharIndex((prev) => prev + 1);
        }, 40); // Type-in: ~40ms/char
      } else {
        // Hold for 1.8 seconds
        timer = setTimeout(() => {
          if (currentFragmentIndex === FRAGMENTS.length - 1) {
            setAnimationComplete(true);
          } else {
            setIsTyping(false);
          }
        }, 1800);
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setTypedText((prev) => prev.slice(0, -1));
          setCharIndex((prev) => prev - 1);
        }, 20); // Erase: ~20ms/char
      } else {
        // Advance to next fragment
        setIsTyping(true);
        setCurrentFragmentIndex((prev) => prev + 1);
      }
    }

    return () => clearTimeout(timer);
  }, [inView, charIndex, isTyping, currentFragmentIndex, animationComplete, reducedMotion]);

  const handleScrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("waitlist-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      onViewportEnter={() => setInView(true)}
      viewport={{ once: true, amount: 0.4 }}
      className="w-full bg-[#FFFFFF] py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-[#1A0E1F]/10 relative z-10"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-start gap-12">
        {/* Editorial Section Indicator */}
        <div className="flex items-center gap-3 text-[10px] font-sans font-bold tracking-widest text-[#7B2FD1]/60 uppercase select-none">
          <span>02</span>
          <span className="w-6 h-[1px] bg-[#1A0E1F]/15"></span>
          <span>Recognition</span>
        </div>

        {/* Dynamic content wrapper */}
        <div className="w-full min-h-[160px] flex flex-col items-start justify-center">
          <AnimatePresence mode="wait">
            {!animationComplete && !reducedMotion ? (
              <motion.div
                key="typewriter"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center"
              >
                <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#1A0E1F] italic uppercase leading-tight select-none">
                  {typedText}
                  <span className="inline-block w-[2px] h-[32px] md:h-[48px] bg-[#FFD400] ml-1.5 animate-pulse vertical-middle"></span>
                </h2>
              </motion.div>
            ) : (
              <motion.div
                key="bridge"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-start gap-8 w-full"
              >
                <h2 className="text-3xl md:text-5xl font-display font-extrabold text-[#1A0E1F] uppercase leading-tight">
                  We’re fixing that.{" "}
                  <span className="italic font-normal text-[#E83F9C] font-serif lowercase">Quietly.</span>
                </h2>

                {/* Editorial Details explaining standard pricing, backup support, and managed care */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-[#1A0E1F]/10 pt-8 w-full mt-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-sans font-bold tracking-widest text-[#7B2FD1] uppercase">01 / Guaranteed Backup</span>
                    <p className="text-xs text-[#1A0E1F]/70 font-sans leading-relaxed">
                      If your helper is absent, another is arranged quickly. We auto-dispatch a backup so your household continues running smoothly.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-sans font-bold tracking-widest text-[#7B2FD1] uppercase">02 / Flat task-based rates</span>
                    <p className="text-xs text-[#1A0E1F]/70 font-sans leading-relaxed">
                      Standard pricing for all homes. Transparent rates based on task and flat size—no more negotiating alone in the dark.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-sans font-bold tracking-widest text-[#7B2FD1] uppercase">03 / Employed professionals</span>
                    <p className="text-xs text-[#1A0E1F]/70 font-sans leading-relaxed">
                      Helpers are our salaried employees. We train, verify, and pay monthly salaries so you remain completely stress-free.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleScrollToForm}
                  className="px-8 py-3.5 rounded-full bg-[#E83F9C] text-[#FFFFFF] font-sans font-bold text-xs uppercase tracking-widest border border-[#FFD400]/40 hover:border-[#FFD400] transition-all duration-300 hover:shadow-[0_4px_25px_rgba(232,63,156,0.25)] cursor-pointer mt-4"
                >
                  Request Access
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
