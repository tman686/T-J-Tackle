"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

/**
 * "Join the crew" email capture. The single most effective growth asset for a
 * small tackle brand: an owned audience to launch limited color drops to and
 * bring back for repeat orders. Posts to /api/subscribe.
 *
 * `variant="panel"` is the full hero card (home page); `variant="inline"` is a
 * compact row for the footer.
 */
export function EmailCapture({
  variant = "panel",
  source = "site",
}: {
  variant?: "panel" | "inline";
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source, company: "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("done");
        try {
          localStorage.setItem("tj_subscribed", "1");
        } catch {
          /* ignore storage errors */
        }
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  const done = status === "done";

  if (variant === "inline") {
    return (
      <form onSubmit={submit} className="w-full">
        <label htmlFor="footer-email" className="text-sm text-copper-200">
          Get first dibs on new drops
        </label>
        {done ? (
          <p className="mt-2 text-sm text-parchment/90">
            You&apos;re on the list — check your inbox. 🎣
          </p>
        ) : (
          <div className="mt-2 flex gap-2">
            <input
              id="footer-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="min-w-0 flex-1 rounded-md border border-parchment/20 bg-parchment/10 px-3 py-2 text-sm text-parchment placeholder:text-parchment/40 focus:border-copper-200 focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="btn-copper shrink-0 !px-4 !py-2 text-sm disabled:opacity-60"
            >
              {status === "loading" ? "…" : "Join"}
            </button>
          </div>
        )}
        {status === "error" && <p className="mt-2 text-xs text-copper-200">{message}</p>}
      </form>
    );
  }

  return (
    <section className="container-page pb-14">
      <div className="overflow-hidden rounded-2xl border border-navy/10 bg-parchment/70 p-8 shadow-crest sm:p-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">Join the crew</p>
          <h2 className="mt-2 text-3xl text-navy sm:text-4xl">
            10% off your first order — and first cast at every limited drop.
          </h2>
          <p className="mt-3 text-ink/75">
            New colors sell out fast. Get the drop the moment it&apos;s live, plus
            rigging tips and seasonal patterns from the bench. No spam — just baits.
          </p>

          {done ? (
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-copper/30 bg-copper/5 p-6">
              <p className="font-display text-2xl uppercase text-navy">You&apos;re in. 🎣</p>
              <p className="mt-2 text-sm text-ink/70">
                Your discount code is on its way to your inbox. Check spam if you
                don&apos;t see it in a minute.
              </p>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              {/* Honeypot — hidden from humans, catches bots. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                className="flex-1 rounded-md border border-navy/20 bg-white px-4 py-3 text-navy placeholder:text-ink/40 focus:border-copper focus:outline-none"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="btn-copper shrink-0 disabled:opacity-60"
              >
                {status === "loading" ? "Joining…" : "Get 10% off"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-copper">{message}</p>
          )}
          {!done && (
            <p className="mt-3 text-xs text-ink/50">
              Unsubscribe anytime. We never sell your info.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
