import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { ORDER_EMAIL, ORDER_PHONE } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with T&J's Tackle — support, warranty, wholesale inquiries, and pro-staff applications.",
};

export default function ContactPage() {
  return (
    <div className="container-page py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <p className="eyebrow">We&apos;d love to hear from you</p>
          <h1 className="mt-2 text-4xl text-navy">Contact T&amp;J&apos;s Tackle</h1>
          <p className="mt-3 text-ink/70">
            Questions about a bait, a warranty claim, wholesale, or joining the
            field team? Every message lands in the same inbox, so nothing
            gets lost.
          </p>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-navy font-semibold">Orders &amp; support</dt>
              <dd className="text-ink/70">
                <a className="text-copper hover:underline" href={`mailto:${ORDER_EMAIL}`}>
                  {ORDER_EMAIL}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-navy font-semibold">Call or text</dt>
              <dd className="text-ink/70">
                <a className="text-copper hover:underline" href={`tel:+1${ORDER_PHONE.replace(/\D/g, "")}`}>
                  {ORDER_PHONE}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-navy font-semibold">Wholesale &amp; dealers</dt>
              <dd className="text-ink/70">
                Same address — put &ldquo;wholesale&rdquo; in the subject.
              </dd>
            </div>
            <div>
              <dt className="text-navy font-semibold">Pro staff / field team</dt>
              <dd className="text-ink/70">
                Same address — tell us where you fish and what you target.
              </dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
