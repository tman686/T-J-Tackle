"use client";

import { useEffect, useState } from "react";

type Status = "idle" | "loading" | "done" | "error";

const STORE_KEY = "tj_subscribed";
const CODE_KEY = "tj_welcome_code";

/**
 * "Join the crew" email capture. The single most effective growth asset for a
 * small tackle brand: an owned audience to launch limited color drops to and
 * bring back for repeat orders. Posts to /api/subscribe.
 *
 * On success it reveals the welcome discount code (returned by the API) with a
 * one-tap copy button so the incentive is immediately usable, and remembers the
 * subscriber so repeat visitors see their code instead of the form again.
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
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  // Returning subscriber: show their code instead of the form.
  useEffect(() => {
    try {
      if (localStorage.getItem(STORE_KEY) === "1") {
        setCode(localStorage.getItem(CODE_KEY) || "");
        setStatus("done");
      }
    } catch {
      /* ignore storage errors */
    }
  }, []);

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
        if (data.code) setCode(data.code);
        try {
          localStorage.setItem(STORE_KEY, "1");
          if (data.code) localStorage.setItem(CODE_KEY, data.code);
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

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the code is shown for manual copy */
    }
  }

  const done = status === "done";

  if (variant === "inline") {
    return (
      <div className="w-full">
        <label htmlFor="footer-email" className="text-sm text-copper-200">
          Get first dibs on new drops
        </label>
        {done ? (
          <p className="mt-2 text-sm text-parchment/90">
            You&apos;re on the list — {code ? (
              <>use code <span className="font-semibold text-copper-200">{code}</span> for 10% off. 🎣</>
            ) : (
              <>check your inbox. 🎣</>
            )}
          </p>
        ) : (
          <form onSubmit={submit} className="mt-2 flex gap-2">
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
          </form>
        )}
        {status === "error" && <p className="mt-2 text-xs text-copper-200">{message}</p>}
      </div>
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
              {code ? (
                <>
                  <p className="mt-2 text-sm text-ink/70">
                    Here&apos;s your 10%-off code — use it at checkout:
                  </p>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="group mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-dashed border-copper bg-white px-5 py-3 font-display text-2xl uppercase tracking-widest text-navy transition-colors hover:bg-copper/10"
                    aria-label={`Copy discount code ${code}`}
                  >
                    {code}
                    <span className="text-xs font-body normal-case tracking-normal text-copper">
                      {copied ? "Copied!" : "Tap to copy"}
                    </span>
                  </button>
                  <p className="mt-3 text-xs text-ink/50">
                    We&apos;ll email the drops and tips to the address you signed up with.
                  </p>
                </>
              ) : (
                <p className="mt-2 text-sm text-ink/70">
                  Your discount code is on its way to your inbox. Check spam if you
                  don&apos;t see it in a minute.
                </p>
              )}
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
