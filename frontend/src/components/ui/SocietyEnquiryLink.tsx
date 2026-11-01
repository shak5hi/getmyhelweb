"use client";

import { openEnquiry } from "@/components/EnquiryDialog";

interface SocietyEnquiryLinkProps {
  children: React.ReactNode;
  className?: string;
  arrow?: boolean;
}

// The primary conversion: opens the society enquiry form, which emails the support inbox.
export default function SocietyEnquiryLink({ children, className = "btn btn-primary", arrow = true }: SocietyEnquiryLinkProps) {
  return (
    <button type="button" aria-haspopup="dialog" onClick={openEnquiry} className={className}>
      {children}
      {arrow && <ArrowRight />}
    </button>
  );
}

export function ArrowRight({ className = "btn-arrow h-4 w-4 shrink-0" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
