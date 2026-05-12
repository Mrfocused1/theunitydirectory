import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  // Wire your endpoint here — Postmark, Resend, Slack webhook, Mailchimp, etc.
  // For now we just log the enquiry to stdout so you can see it in dev.
  console.log("[enquire]", JSON.stringify(body, null, 2));

  return NextResponse.json({ ok: true });
}
