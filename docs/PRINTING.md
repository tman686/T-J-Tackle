# Where to print the cards (and the stickers)

> Prices below are from published comparisons dated 2024–2026 and move
> constantly — treat them as a ballpark and check at checkout. Shipping is
> called out separately because it's where the "cheap" options stop being cheap.

## Short answer

| You want | Go to | Rough cost |
|---|---|---|
| Your first 100 cards, cheap and easy | **VistaPrint** with a promo code | ~$15–25 delivered |
| Absolute lowest per card at 500+ | **GotPrint** | ~$32 / 500, ~$48 / 1,000 delivered |
| Cards today | **Staples / FedEx Office** in-store | ~$25–40 / 100 |
| Free, right now | **your own printer** | paper only |

**Start with 100 from VistaPrint.** You'll want to change something after
handing out the first batch — the number, a tagline, adding Instagram — and
you'd rather discover that on a $20 order than a $50 one.

## The numbers

Standard 3.5 × 2 in, full colour, double-sided.

| Printer | 100 | 500 | 1,000 | Shipping | Notes |
|---|---|---|---|---|---|
| **GotPrint** | ~$9.80–11.55 | ~$24–32 | ~$38–43 | ~$5–13 | Cheapest per card. Clunky site, bring a finished PDF. |
| **VistaPrint** | ~$15–22 | ~$25–40 | ~$40–56 | ~$7–17 | Easiest uploader. Headline price is their thinnest stock — pick Standard or better. Promo codes are constant, never pay list. |
| **UPrinting** | ~$17.83 | ~$25.74 | ~$41 | ~$14 | Rush options, 1-day printing available. |
| **PrintPlace** | ~$22.28 | ~$33 | ~$42 | varies | Same-day printing if you're in a bind. |
| **Staples / FedEx** | ~$22–40 | — | — | pickup | Walk in, walk out. Most expensive per card, zero wait. |
| **MOO** | ~$43 | ~$148 | ~$250 | — | 3–5× the price. Genuinely nicer stock. Not where you start. |

### Sticker Mule — use it for stickers, not cards

Sticker Mule sells **business card stickers**, not paper business cards, at
roughly **$0.58 each**. That's about **$290 for 500** — ten times what real
cards cost at GotPrint. Don't buy cards there.

Do buy **stickers** there, because that's a better fit for a bait company
anyway. See below.

## Printing the cards yourself

`site/business-cards.html` is already laid out 10-up on US Letter.

1. Open it in a browser, **Ctrl/Cmd + P**
2. **Paper** Letter · **Margins** None · **Scale** 100% · **Background graphics ON**
3. Page 1 is fronts, page 2 is backs. Print page 1, flip the stack on the
   **short edge**, print page 2.
4. Cut on the dashed lines.

For a print shop: in that same dialog choose **Save as PDF** and upload the PDF.
Ask for **14–16 pt matte**, double-sided, no coating.

> Uploading to VistaPrint/GotPrint's own designer instead? Their templates want
> a bleed area. The PDF from this page has no bleed, so either upload it as-is
> and accept that it may trim 1–2 mm tighter than designed, or tell them
> "no bleed, trim to crop marks."

## Stickers — the part Sticker Mule is actually good at

`site/bag-sticker-3in-300dpi.png` is ready to upload: **3 in square at 300 dpi
with 1/8 in bleed already included** (976 × 976 px), crest, the QR to your
catalog, your number. The QR was decode-tested, not just generated.

Sticker Mule: **Die cut stickers** → **Upload art** → pick **3″ × 3″** →
it'll show the cut line outside the parchment edge.

Where these earn their money:

- **One on every bag of baits.** A customer who liked them scans and reorders
  without having to find you again. This is the single highest-value thing in
  this whole document.
- **Tackle boxes, boat consoles, truck windows, cooler lids.** Fishermen
  actually stick these, which is free advertising at every ramp.
- **Throw 2–3 free ones in every order.** Costs you well under a dollar and
  people remember it.

Rough Sticker Mule math: 3 in die-cut runs about **$0.58 each at 500**, cheaper
in bulk. If a sticker on the bag wins you one reorder per hundred stickers, it
has already paid for itself several times over.

## When the details change

Change the number, email or site in `brand/contact.json`, run
`python3 scripts/build-contact.py`, and the cards, the sticker, the QR codes,
the saved contact and the website all regenerate together. Then re-upload.
