"use client";

import { useState } from "react";

/**
 * Phase 1 contact form: client-side only (no email backend yet — the
 * notifications service is a Phase 2 task, see ROADMAP.md). Captures the UX so
 * wiring a real handler later is drop-in.
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="card flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
        <p className="font-display text-2xl uppercase text-navy">Thanks!</p>
        <p className="mt-2 text-ink/70">
          Your message is noted. Email delivery goes live in Phase 2 — for now,
          reach us directly at the addresses listed.
        </p>
      </div>
    );
  }

  return (
    <form
      className="card space-y-4 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <label htmlFor="name" className="block text-sm text-navy">
          Name
        </label>
        <input
          id="name"
          required
          className="mt-1 w-full rounded-md border border-navy/20 bg-parchment px-3 py-2 text-navy"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm text-navy">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-navy/20 bg-parchment px-3 py-2 text-navy"
        />
      </div>
      <div>
        <label htmlFor="topic" className="block text-sm text-navy">
          Topic
        </label>
        <select
          id="topic"
          className="mt-1 w-full rounded-md border border-navy/20 bg-parchment px-3 py-2 text-navy"
        >
          <option>Product question</option>
          <option>Warranty / support</option>
          <option>Wholesale / dealer</option>
          <option>Pro staff / field team</option>
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm text-navy">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          className="mt-1 w-full rounded-md border border-navy/20 bg-parchment px-3 py-2 text-navy"
        />
      </div>
      <button type="submit" className="btn-copper w-full">
        Send message
      </button>
    </form>
  );
}
