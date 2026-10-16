import { NextResponse } from "next/server";

/**
 * Newsletter / "Join the crew" email capture endpoint.
 *
 * Growth machinery: building an email list is the highest-leverage, lowest-cost
 * way for a small tackle brand to drive repeat sales and launch limited color
 * drops. This route validates a submission and hands it to whatever email
 * provider is configured — Mailchimp, Klaviyo, Buttondown, a Zapier/Make
 * webhook, etc. — via a single generic webhook URL so no vendor lock-in.
 *
 * Configure `NEWSLETTER_WEBHOOK_URL` (see .env.example). When it is unset the
 * endpoint still succeeds and logs the signup so the UX works in development
 * and nothing is lost before the provider is wired up.
 */
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Very small in-memory throttle to blunt casual abuse. Real rate limiting
// belongs at the edge/proxy; this just stops a single client hammering us.
const recent = new Map<string, number>();
const WINDOW_MS = 10_000;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const data = (body ?? {}) as Record<string, unknown>;
  const email = String(data.email ?? "").trim().toLowerCase();
  const source = String(data.source ?? "site").slice(0, 60);

  // Honeypot: bots fill hidden fields, humans never see them.
  if (typeof data.company === "string" && data.company.length > 0) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 }
    );
  }

  const now = Date.now();
  const last = recent.get(email) ?? 0;
  if (now - last < WINDOW_MS) {
    return NextResponse.json({ ok: true, deduped: true });
  }
  recent.set(email, now);

  const welcomeCode = process.env.NEWSLETTER_WELCOME_CODE || "CREW10";
  const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          tags: ["site-signup"],
          subscribedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) {
        console.error("[subscribe] provider webhook failed", res.status);
        return NextResponse.json(
          { ok: false, error: "We couldn't sign you up just now. Try again shortly." },
          { status: 502 }
        );
      }
    } catch (err) {
      console.error("[subscribe] provider webhook error", err);
      return NextResponse.json(
        { ok: false, error: "We couldn't sign you up just now. Try again shortly." },
        { status: 502 }
      );
    }
  } else {
    // No provider configured yet — don't lose the lead, make it visible in logs.
    console.log(`[subscribe] new signup (no provider configured): ${email} (${source})`);
  }

  return NextResponse.json({ ok: true, code: welcomeCode });
}
