"use client";

import { useState, useRef, useEffect } from "react";

interface WaitlistFormProps {
  variant?: "default" | "compact";
}

export default function WaitlistForm({ variant = "default" }: WaitlistFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Magnetic button state & ref
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Disable if reduced motion is preferred or if touch device (no hover capability)
      const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isHoverCapable = window.matchMedia("(hover: hover)").matches;
      if (isReduced || !isHoverCapable) return;

      const rect = button.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;

      // Distance from mouse to button center
      const distance = Math.hypot(e.clientX - btnX, e.clientY - btnY);
      const pullRadius = 60; // radius of mouse influence

      if (distance < pullRadius) {
        // Move button 25% of the mouse offset
        const pullX = (e.clientX - btnX) * 0.25;
        const pullY = (e.clientY - btnY) * 0.25;
        setCoords({ x: pullX, y: pullY });
        setIsHovered(true);
      } else {
        setCoords({ x: 0, y: 0 });
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setCoords({ x: 0, y: 0 });
      setIsHovered(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      button?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      setError("Please enter your phone number or email.");
      return;
    }
    
    // Basic email or phone checks
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputValue);
    const isPhone = /^\+?[1-9]\d{1,14}$/.test(inputValue.replace(/[\s()-]/g, ""));
    
    if (!isEmail && !isPhone && inputValue.length < 6) {
      setError("Please enter a valid phone number or email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact: inputValue }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCompact = variant === "compact";

  return (
    <div className={`w-full max-w-md transition-all duration-300 ${isCompact ? "p-0" : "bg-[#FFFFFF] border border-[#1A0E1F]/10 rounded-2xl p-8 shadow-sm"}`}>
      {!submitted ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isCompact && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-sans font-bold tracking-widest text-[#7B2FD1] uppercase">
                Private Beta
              </span>
              <h3 className="text-2xl font-serif font-black text-[#1A0E1F]">
                Get Early Access
              </h3>
              <p className="text-[#1A0E1F]/60 text-xs font-sans">
                Enter your details to join the priority list.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor="waitlist-contact" className="sr-only">
              Phone Number or Email
            </label>
            <div className="relative">
              <input
                id="waitlist-contact"
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Phone or email address..."
                className="w-full px-5 py-3.5 rounded-full border border-[#1A0E1F]/20 focus:border-[#7B2FD1] bg-[#FFFFFF] focus:bg-white text-[#1A0E1F] font-sans text-sm outline-none transition-all duration-300 placeholder:text-[#1A0E1F]/40 shadow-inner"
                disabled={isSubmitting}
                required
              />
            </div>
            {error && (
              <p className="text-rose-700 text-xs font-sans font-semibold mt-1 flex items-center gap-1.5 animate-pulse">
                <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </p>
            )}
          </div>

          <button
            ref={buttonRef}
            type="submit"
            disabled={isSubmitting}
            style={{
              transform: `translate3d(${coords.x}px, ${coords.y}px, 0) scale(${isHovered ? 1.03 : 1})`,
              transition: isHovered ? "transform 100ms ease-out, border-color 250ms, background-color 250ms, box-shadow 250ms" : "transform 250ms ease-out, border-color 250ms, background-color 250ms, box-shadow 250ms",
              willChange: "transform",
            }}
            className={`w-full py-3.5 rounded-full bg-[#E83F9C] text-[#FFFFFF] font-sans font-bold text-xs uppercase tracking-widest border border-[#FFD400]/40 hover:border-[#FFD400] hover:shadow-[0_4px_25px_rgba(232,63,156,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Request Access"}
            {!isSubmitting && (
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-4 animate-fade-in">
          <div className="w-12 h-12 bg-[#E83F9C]/10 border border-[#E83F9C]/20 rounded-full flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-[#E83F9C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-serif font-black text-[#1A0E1F] mb-1.5">
            You are on the list.
          </h4>
          <p className="text-[#1A0E1F]/70 font-sans text-xs max-w-xs leading-relaxed mb-4">
            We will contact you at <span className="font-semibold text-[#E83F9C]">{inputValue}</span> once a slot opens in your neighborhood.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setInputValue("");
            }}
            className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#7B2FD1] hover:text-[#7B2FD1]/80 transition-colors"
          >
            Register another account
          </button>
        </div>
      )}
    </div>
  );
}
