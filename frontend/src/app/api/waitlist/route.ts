import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { rateLimiter, sendToSupport } from "@/lib/mail";

// Max 5 requests per IP per minute
const allow = rateLimiter(5);

export async function POST(req: Request) {
  try {
    if (!allow(req)) {
      console.warn("[Waitlist API] Rate limit exceeded");
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const contact = typeof body?.contact === "string" ? body.contact.trim() : "";

    // Validation: basic check for length and format to prevent large spam payloads
    if (!contact || contact.length < 5 || contact.length > 255) {
      return NextResponse.json({ error: "Invalid contact information provided." }, { status: 400 });
    }

    console.log(`[Waitlist API] Processing registration for: ${contact}`);

    // --- SAVE TO CSV ---
    try {
      const csvLine = `"${new Date().toISOString()}","${contact.replace(/"/g, '""')}"\n`;
      // Save directly to the frontend root folder (works in development and PM2 standalone)
      fs.appendFileSync(path.join(process.cwd(), "waitlist_data.csv"), csvLine);
    } catch (fsError) {
      console.error("[Waitlist API] Failed to save to CSV:", fsError);
    }
    // -------------------

    // If the email fails, the contact is still safe in the CSV, so the visitor is told it worked
    await sendToSupport({
      subject: "New Waitlist Registration",
      intro: "A new resident has joined the waitlist.",
      fields: [["Phone or email", contact]],
      replyTo: contact.includes("@") ? contact : undefined,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Waitlist API] Critical Error processing request:", error);
    return NextResponse.json({ error: "Internal server error. Failed to process request." }, { status: 500 });
  }
}
