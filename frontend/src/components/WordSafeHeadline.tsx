"use client";

import React from "react";
import { motion } from "framer-motion";

interface WordSafeHeadlineProps {
  text: string;
  className?: string;
}

export default function WordSafeHeadline({ text, className = "" }: WordSafeHeadlineProps) {
  const words = text.split(" ");

  // Container variants to orchestrate staggered entrance
  const containerVariants: any = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.024, // ~24ms stagger per character
        delayChildren: 0.3,    // play 300ms after mount
      },
    },
  };

  // Letter animations
  const charVariants: any = {
    hidden: {
      opacity: 0,
      y: 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1], // ease-out cubic
      },
    },
  };

  return (
    <motion.span
      className={`block font-display text-[#1A0E1F] ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, wordIdx) => {
        // Highlight "every morning." or variations
        const isHighlightWord =
          word.toLowerCase().includes("every") ||
          word.toLowerCase().includes("morning");

        return (
          <React.Fragment key={wordIdx}>
            <span
              className={`inline-block whitespace-nowrap px-1 rounded transition-colors duration-300 ${
                isHighlightWord ? "bg-[#FFD400] text-[#1A0E1F]" : ""
              }`}
            >
              {word.split("").map((char, charIdx) => (
                <motion.span
                  key={charIdx}
                  className="font-extrabold uppercase tracking-tight"
                  style={{ display: "inline-block" }}
                  variants={charVariants}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            {wordIdx < words.length - 1 && " "}
          </React.Fragment>
        );
      })}
    </motion.span>
  );
}
