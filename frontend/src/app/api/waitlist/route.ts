import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { LRUCache } from "lru-cache";
import fs from "fs";
import path from "path";

// Rate limiting setup: Max 5 requests per IP per minute
const rateLimitCache = new LRUCache<string, number>({
  max: 1000,
  ttl: 1000 * 60, // 1 minute
});

function checkRateLimit(ip: string): boolean {
  const current = rateLimitCache.get(ip) || 0;
  if (current >= 5) {
    return false;
  }
  rateLimitCache.set(ip, current + 1);
  return true;
}

export async function POST(req: Request) {
  try {
    // Basic IP extraction (works well with Nginx reverse proxy setting X-Real-IP)
    const ip = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for") || "unknown";

    if (!checkRateLimit(ip)) {
      console.warn(`[Waitlist API] Rate limit exceeded for IP: ${ip}`);
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const contact = typeof body?.contact === 'string' ? body.contact.trim() : "";

    // Validation: basic check for length and format to prevent large spam payloads
    if (!contact || contact.length < 5 || contact.length > 255) {
      console.warn(`[Waitlist API] Validation failed for input from IP: ${ip}`);
      return NextResponse.json({ error: "Invalid contact information provided." }, { status: 400 });
    }

    console.log(`[Waitlist API] Processing registration for: ${contact}`);

    // --- SAVE TO CSV ---
    try {
      const csvLine = `"${new Date().toISOString()}","${contact.replace(/"/g, '""')}"\n`;
      // Save directly to the frontend root folder (works in development and PM2 standalone)
      const filePath = path.join(process.cwd(), 'waitlist_data.csv');
      fs.appendFileSync(filePath, csvLine);
      console.log(`[Waitlist API] Successfully saved to CSV: ${contact}`);
    } catch (fsError) {
      console.error("[Waitlist API] Failed to save to CSV:", fsError);
    }
    // -------------------

    let transporter: nodemailer.Transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      console.log("[Waitlist API] No SMTP config found, using Ethereal fallback.");
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || '"GetMyHelp System" <noreply@getmyhelp.in>',
      to: "support@getmyhelp.in",
      subject: "New Waitlist Registration",
      text: `A new user has joined the waitlist.\nContact Info: ${contact}`,
      html: `<b>A new user has joined the waitlist.</b><br>Contact Info: ${contact}`,
    };

    // Timeout mechanism: 10 seconds max for SMTP
    const sendMailPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("SMTP operation timed out")), 10000)
    );

    const info = await Promise.race([sendMailPromise, timeoutPromise]) as any;

    console.log(`[Waitlist API] Email sent successfully: ${info.messageId}`);
    try {
      const testUrl = nodemailer.getTestMessageUrl(info);
      if (testUrl) {
        console.log(`[Waitlist API] Ethereal preview URL: ${testUrl}`);
      }
    } catch (e) {
      // getTestMessageUrl can throw if it wasn't an ethereal message
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("[Waitlist API] Critical Error processing request:", error);
    return NextResponse.json({ error: "Internal server error. Failed to process request." }, { status: 500 });
  }
}
