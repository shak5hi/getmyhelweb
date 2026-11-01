import nodemailer from "nodemailer";
import { LRUCache } from "lru-cache";
import { CONTACT } from "@/lib/site";

// Where every form on the site is delivered. SUPPORT_EMAIL overrides it, for testing.
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || CONTACT.email;

let transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter | null> {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  } else if (process.env.NODE_ENV !== "production") {
    // Local development without SMTP: a throwaway Ethereal inbox, so forms can be tried safely
    console.log("[mail] No SMTP config found, using an Ethereal test inbox.");
    const test = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: test.user, pass: test.pass },
    });
  } else {
    console.error("[mail] SMTP is not configured; emails to support cannot be sent.");
    return null;
  }
  return transporter;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// Sends a plain table of fields to the support inbox. Resolves to whether it was sent.
export async function sendToSupport({
  subject,
  intro,
  fields,
  replyTo,
}: {
  subject: string;
  intro: string;
  fields: [label: string, value: string][];
  replyTo?: string;
}): Promise<boolean> {
  const t = await getTransporter();
  if (!t) return false;

  const shown = fields.filter(([, v]) => v);
  const text = `${intro}\n\n${shown.map(([k, v]) => `${k}: ${v}`).join("\n")}`;
  const html = `<p><b>${escapeHtml(intro)}</b></p><table cellpadding="6">${shown
    .map(([k, v]) => `<tr><td valign="top"><b>${escapeHtml(k)}</b></td><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;

  try {
    const send = t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER, // must be an address the SMTP login may send as
      to: SUPPORT_EMAIL,
      replyTo,
      subject,
      text,
      html,
    });
    // Don't keep the visitor waiting on a slow mail server
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("SMTP operation timed out")), 10000));
    const info = await Promise.race([send, timeout]);
    console.log(`[mail] Sent "${subject}" to support: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[mail] Failed to send "${subject}" to support:`, error);
    return false;
  }
}

// At most `limit` submissions per IP per minute, counted per form
export function rateLimiter(limit = 5) {
  const hits = new LRUCache<string, number>({ max: 1000, ttl: 1000 * 60 });
  return (req: Request) => {
    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown";
    const n = hits.get(ip) || 0;
    if (n >= limit) return false;
    hits.set(ip, n + 1);
    return true;
  };
}
