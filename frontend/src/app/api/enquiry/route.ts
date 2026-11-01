import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { rateLimiter, sendToSupport } from "@/lib/mail";

const allow = rateLimiter(5);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?\d{10,15}$/;
const ROLES = ["Committee member", "Resident", "Facility or society manager", "Other"];

const field = (body: Record<string, unknown>, key: string, max: number) =>
  typeof body[key] === "string" ? (body[key] as string).trim().slice(0, max) : "";

// A society enquiry from the site, emailed to the support inbox
export async function POST(req: Request) {
  try {
    if (!allow(req)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = ((await req.json().catch(() => null)) ?? {}) as Record<string, unknown>;

    // Bots fill the hidden field; pretend all is well and drop it
    if (field(body, "website", 200)) return NextResponse.json({ success: true });

    const name = field(body, "name", 120);
    const society = field(body, "society", 200);
    const role = field(body, "role", 80);
    const phone = field(body, "phone", 30);
    const email = field(body, "email", 255);
    const message = field(body, "message", 2000);

    if (!name || !society) {
      return NextResponse.json({ error: "Please tell us your name and your society." }, { status: 400 });
    }
    if (!PHONE_PATTERN.test(phone.replace(/[\s()-]/g, ""))) {
      return NextResponse.json({ error: "Please enter a valid phone number." }, { status: 400 });
    }
    if (email && !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "That email address doesn’t look right." }, { status: 400 });
    }

    const fields: [string, string][] = [
      ["Name", name],
      ["Society", society],
      ["Role", ROLES.includes(role) ? role : ""],
      ["Phone", phone],
      ["Email", email],
      ["Message", message],
    ];

    // Keep a copy on the server too, in case the mail server is down
    let saved = false;
    try {
      const row = [new Date().toISOString(), ...fields.map(([, v]) => v)].map((v) => `"${v.replace(/"/g, '""')}"`).join(",");
      fs.appendFileSync(path.join(process.cwd(), "enquiry_data.csv"), row + "\n");
      saved = true;
    } catch (fsError) {
      console.error("[Enquiry API] Failed to save to CSV:", fsError);
    }

    const sent = await sendToSupport({
      subject: `Society enquiry: ${society}`,
      intro: "A new society enquiry from the website.",
      fields,
      replyTo: email || undefined,
    });

    if (!sent && !saved) {
      return NextResponse.json({ error: "We couldn’t send your enquiry. Please call or email us instead." }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Enquiry API] Critical error:", error);
    return NextResponse.json({ error: "Internal server error. Failed to process request." }, { status: 500 });
  }
}
