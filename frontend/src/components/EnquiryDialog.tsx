"use client";

import { useEffect, useId, useRef, useState } from "react";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { CONTACT } from "@/lib/site";

const OPEN_EVENT = "gmh:open-enquiry";

// Opens the society enquiry form from anywhere on the site
export function openEnquiry() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

const ROLES = ["Committee member", "Resident", "Facility or society manager", "Other"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{10,15}$/;
const GENERIC_ERROR = "Something went wrong. Please check your connection and try again.";

type Values = { name: string; society: string; role: string; phone: string; email: string; message: string; website: string };
const EMPTY: Values = { name: "", society: "", role: ROLES[0], phone: "", email: "", message: "", website: "" };

function validate(v: Values): [keyof Values, string] | null {
  if (!v.name.trim()) return ["name", "Please tell us your name."];
  if (!v.society.trim()) return ["society", "Please tell us your society’s name and area."];
  if (!PHONE_PATTERN.test(v.phone.replace(/[\s()-]/g, ""))) return ["phone", "Please enter a valid phone number."];
  if (v.email.trim() && !EMAIL_PATTERN.test(v.email.trim())) return ["email", "That email address doesn’t look right."];
  return null;
}

const INPUT =
  "w-full rounded-2xl border-2 border-transparent bg-paper-raised px-5 text-base text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-purple aria-[invalid=true]:border-[#b42318] disabled:opacity-60";

// The society enquiry, sent straight to the support inbox. Mounted once in the layout.
export default function EnquiryDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [values, setValues] = useState<Values>(EMPTY);
  const [error, setError] = useState<{ field?: keyof Values; message: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const id = useId();

  useEffect(() => {
    const open = () => {
      opener.current = document.activeElement as HTMLElement | null;
      dialogRef.current?.showModal();
      lockScroll();
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const close = () => dialogRef.current?.close();

  const onClose = () => {
    unlockScroll();
    opener.current?.focus();
    // A finished enquiry starts fresh next time; an unfinished one is kept
    if (sent) {
      setSent(false);
      setValues(EMPTY);
    }
  };

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (error) setError(null);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const problem = validate(values);
    if (problem) {
      setError({ field: problem[0], message: problem[1] });
      e.currentTarget.querySelector<HTMLElement>(`[name="${problem[0]}"]`)?.focus();
      return;
    }
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError({ message: typeof data?.error === "string" ? data.error : GENERIC_ERROR });
        return;
      }
      setSent(true);
    } catch {
      setError({ message: GENERIC_ERROR });
    } finally {
      setSending(false);
    }
  };

  const fieldProps = (key: keyof Values) => ({
    id: `${id}-${key}`,
    name: key,
    value: values[key],
    onChange: set(key),
    disabled: sending,
    "aria-invalid": error?.field === key ? true : undefined,
    "aria-describedby": error?.field === key ? `${id}-error` : undefined,
  });

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      onClose={onClose}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes it
        if (e.target === e.currentTarget) close();
      }}
      className="service-dialog m-auto w-[calc(100%-2rem)] max-w-2xl rounded-[28px] bg-lilac p-0 text-ink"
    >
      <div data-lenis-prevent className="max-h-[90dvh] overflow-y-auto p-6 sm:p-10">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-base font-bold text-purple">For committee members</p>
            <h2 id={`${id}-title`} className="display-md mt-2">
              Enquire for your society
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-paper-raised text-ink transition-colors hover:bg-white"
          >
            <span className="sr-only">Close</span>
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div aria-live="polite" role="status" className="sr-only">
          {sent ? "Thank you. Your enquiry has been sent." : ""}
        </div>

        {sent ? (
          <div className="py-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-purple text-white" aria-hidden="true">
              <svg viewBox="0 0 16 16" className="h-5 w-5">
                <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="display-md mt-5">Thank you, we’ve got it.</p>
            <p className="mt-2 leading-relaxed">
              We’ll be in touch at <span className="font-semibold">{values.phone.trim()}</span> to set up a conversation
              with your committee.
            </p>
            <button type="button" onClick={close} className="btn btn-primary mt-8">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate className="mt-6">
            <p className="leading-relaxed">
              Tell us a little about your society and we’ll set up a conversation with your committee. There’s no
              commitment in an enquiry.
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <Field label="Your name" htmlFor={`${id}-name`}>
                <input {...fieldProps("name")} type="text" autoComplete="name" className={`${INPUT} h-14`} />
              </Field>
              <Field label="Your role" htmlFor={`${id}-role`}>
                <select {...fieldProps("role")} className={`${INPUT} h-14`}>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field label="Society name and area" htmlFor={`${id}-society`} wide>
                <input
                  {...fieldProps("society")}
                  type="text"
                  placeholder="e.g. Green Park Apartments, Indirapuram"
                  className={`${INPUT} h-14`}
                />
              </Field>
              <Field label="Phone number" htmlFor={`${id}-phone`}>
                <input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" className={`${INPUT} h-14`} />
              </Field>
              <Field label="Email (optional)" htmlFor={`${id}-email`}>
                <input
                  {...fieldProps("email")}
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  autoCapitalize="none"
                  className={`${INPUT} h-14`}
                />
              </Field>
              <Field label="Anything we should know? (optional)" htmlFor={`${id}-message`} wide>
                <textarea {...fieldProps("message")} rows={3} maxLength={2000} className={`${INPUT} resize-y py-4`} />
              </Field>
              {/* left empty by people; bots fill it in */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
                </label>
              </div>
            </div>

            {error && (
              <p id={`${id}-error`} role="alert" className="mt-5 flex items-start gap-2 text-sm font-semibold text-[#b42318]">
                <svg viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M8 4.5v4M8 11h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                {error.message}
              </p>
            )}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button type="submit" disabled={sending} className="btn btn-primary disabled:cursor-wait disabled:opacity-70">
                {sending ? (
                  <>
                    <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Sending…
                  </>
                ) : (
                  "Send enquiry"
                )}
              </button>
              <p className="text-sm text-ink-muted">
                Or call{" "}
                <a href={CONTACT.phoneHref} className="whitespace-nowrap font-semibold text-purple text-link">
                  {CONTACT.phoneDisplay}
                </a>
              </p>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}

function Field({ label, htmlFor, wide = false, children }: { label: string; htmlFor: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <div className={`flex flex-col gap-2 ${wide ? "sm:col-span-2" : ""}`}>
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children}
    </div>
  );
}
