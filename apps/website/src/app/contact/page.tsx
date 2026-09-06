import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";

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
            field team? Send a note and we&apos;ll get back to you.
          </p>

          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="text-navy font-semibold">General &amp; support</dt>
              <dd className="text-ink/70">support@jttackle.com</dd>
            </div>
            <div>
              <dt className="text-navy font-semibold">Wholesale &amp; dealers</dt>
              <dd className="text-ink/70">dealers@jttackle.com</dd>
            </div>
            <div>
              <dt className="text-navy font-semibold">Pro staff / field team</dt>
              <dd className="text-ink/70">team@jttackle.com</dd>
            </div>
          </dl>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
