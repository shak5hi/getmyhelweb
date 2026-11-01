"use client";

import { useId, useRef, useState } from "react";

interface WaitlistFormProps {
  variant?: "default" | "compact";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{10,15}$/;
const GENERIC_ERROR = "Something went wrong. Please check your connection and try again.";

// Mirrors the API's own limits (5–255 chars) and requires a plausible phone or email.
function validate(raw: string): string | null {
  const value = raw.trim();
  if (!value) return "Please enter your phone number or email address.";
  const isEmail = EMAIL_PATTERN.test(value);
  const isPhone = PHONE_PATTERN.test(value.replace(/[\s()-]/g, ""));
  if (!isEmail && !isPhone) return "That doesn’t look like a valid phone number or email address.";
  if (value.length > 255) return "That’s a little too long. Please check and try again.";
  return null;
}

export default function WaitlistForm({ variant = "default" }: WaitlistFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const inputId = `${id}-contact`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const problem = validate(inputValue);
    if (problem) {
      setError(problem);
      inputRef.current?.focus();
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
        body: JSON.stringify({ contact: inputValue.trim() }),
      });

      if (!res.ok) {
        // Show the API's own message (e.g. rate limit) when it provides one
        const data = await res.json().catch(() => null);
        setError(typeof data?.error === "string" ? data.error : GENERIC_ERROR);
        return;
      }

      setSubmitted(true);
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isCompact = variant === "compact";

  return (
    <div className={isCompact ? "w-full" : "w-full rounded-[32px] bg-paper-raised p-7 sm:p-9"}>
      <div aria-live="polite" role="status" className="sr-only">
        {submitted ? "Thank you. You’re on the waitlist." : ""}
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {!isCompact && (
            <div>
              <p className="text-base font-bold text-purple">Resident waitlist</p>
              <p className="display-md mt-2 text-ink">Hear from us when we reach your society.</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <label htmlFor={inputId} className="text-sm font-semibold text-ink">
              Phone number or email
            </label>
            <input
              ref={inputRef}
              id={inputId}
              name="contact"
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError("");
              }}
              placeholder="Mobile number or email…"
              spellCheck={false}
              autoCapitalize="none"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? `${errorId} ${hintId}` : hintId}
              disabled={isSubmitting}
              className={`h-14 w-full rounded-2xl border-2 bg-paper px-5 text-base text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-purple focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-60 ${
                error ? "border-[#b42318]" : "border-transparent"
              }`}
            />
            {error && (
              <p id={errorId} role="alert" className="flex items-start gap-2 text-sm font-semibold text-[#b42318]">
                <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M8 4.5v4M8 11h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {error}
              </p>
            )}
            <p id={hintId} className="text-sm leading-relaxed text-ink-muted">
              We’ll only use this to tell you when GetMyHelp is available in your society.
            </p>
          </div>

          <button type="submit" disabled={isSubmitting} aria-disabled={isSubmitting} className="btn btn-primary w-full disabled:cursor-wait disabled:opacity-70">
            {isSubmitting ? (
              <>
                <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Adding you…
              </>
            ) : (
              "Join the waitlist"
            )}
          </button>
        </form>
      ) : (
        <div className="py-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple text-white" aria-hidden="true">
            <svg viewBox="0 0 16 16" className="h-5 w-5">
              <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="display-md mt-5 text-ink">You’re on the list.</p>
          <p className="mt-2 leading-relaxed text-ink">
            We’ll contact you at <span className="font-semibold text-ink">{inputValue.trim()}</span> when GetMyHelp is
            available in your society.
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setInputValue("");
            }}
            className="mt-5 text-sm font-bold text-purple text-link"
          >
            Add another contact
          </button>
        </div>
      )}
    </div>
  );
}
