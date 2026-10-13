/**
 * Single source of truth for how buyers reach T&J's Tackle.
 *
 * Generated from brand/contact.json — run `python3 scripts/build-contact.py`
 * after editing that file. Do not hand-edit the block between the markers.
 */

// BEGIN:CONTACT_TS
export const ORDER_EMAIL = "gilbertsenthomas00@gmail.com";
export const ORDER_PHONE = "863-812-6504";
export const SITE_URL = "https://tman686.github.io/T-J-Tackle/";
// END:CONTACT_TS

/** A mailto that arrives with the subject already written. */
export function orderMailto(topic = "Order Request"): string {
  return `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(
    `T&J's Tackle — ${topic}`,
  )}`;
}
