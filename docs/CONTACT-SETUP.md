# Getting every buyer message into one inbox

Everything a buyer can tap — the website, the business cards, the QR codes, the
saved contact — points at **one address**. Nothing is scattered across your
other accounts.

## The one address and number

```
gilbertsenthomas00@gmail.com
863-812-6504
```

Both are on the website, on the business cards, in the QR codes and in the
saved-contact file. A buyer can email, text or call, and it all reaches you in
one place.

### Changing either of them later

1. Open `brand/contact.json`
2. Edit `orderEmail` / `orderEmailLabel` / `phone`
3. Run `python3 scripts/build-contact.py`

That one change rewrites the website, the business cards, the QR codes, the
saved contact and the web app together, so they can never drift apart. Leave
`phone` blank and the Text and Call rows simply disappear everywhere.

## Make Gmail file the business mail separately (2 minutes)

Because orders come to your normal address, the filter keys off the **subject**
instead of the address. Every message the website generates starts its subject
with `T&J's Tackle`, so this catches all of them:

1. Gmail → search bar → **Show search options** (the sliders icon on the right)
2. In **Subject**, type:  `T&J's Tackle`
3. **Create filter** → tick:
   - **Apply the label** → *New label…* → `T&J Orders`
   - **Never send it to Spam**
   - **Always mark it as important**
4. **Create filter**

Every order, wholesale request and question from the site now stacks up under
**T&J Orders** in the sidebar, separate from personal mail.

> Someone who finds your address on a card and writes their own subject line
> won't match the filter — that mail lands in the normal inbox. To catch those
> too, make a second filter with **Has the words**: `tackle OR baits OR lures
> OR wholesale` and the same label.

### Texts

Save yourself a contact in your phone named **T&J's Tackle Orders** and, when a
buyer texts about baits, it's obvious what the thread is. On iPhone you can also
pin those threads to the top of Messages.

## A signature that sells

Gmail → Settings (gear) → **See all settings** → **Signature** → Create new:

```
Thomas Gilbertsen
T&J's Tackle — Owner / Bait Maker
Original soft & hard baits · Freshwater & Saltwater

Shop the catalog: https://tman686.github.io/T-J-Tackle/
Orders: gilbertsenthomas00@gmail.com · 863-812-6504
```

Set it for **New emails** *and* **On reply/forward**, then **Save Changes** at
the bottom.

## Reply fast with saved templates

Gmail → Settings → **Advanced** → **Templates: Enable** → Save Changes.

Then for each template in [`EMAIL-TEMPLATES.md`](EMAIL-TEMPLATES.md): open a new
email, paste the text, click the **⋮** in the bottom-right of the compose box →
**Templates → Save draft as template → Save as new template**.

Answering a buyer becomes: open their mail → Reply → ⋮ → Templates → pick one →
change the numbers → Send.

## What a buyer can do

| Where | What they tap | What happens |
|---|---|---|
| Website | **Email — fastest** | New email to you, subject already filled in |
| Website | **Text me — quickest** | Opens a text to 863-812-6504, first line written |
| Website | **Call** | Dials 863-812-6504 |
| Website | **Build an order request** | Opens an email with name, baits, quantities and notes written out |
| Website | **Copy my email** | Address on their clipboard |
| Website | **Save my contact** | Downloads the vCard, saves you into their phone |
| Website | the QR square | Phone camera opens a new order email to you |
| Business card | front | Reads the address and the site |
| Business card | back QR | Phone camera opens the catalog |

## Files this touches

| File | What it is |
|---|---|
| `brand/contact.json` | **The one place you edit.** Email, phone, Instagram, site. |
| `scripts/build-contact.py` | Regenerates everything below from that file. |
| `site/index.html` | The live storefront (contact section + QR kept in sync). |
| `site/business-cards.html` | Print sheet — 10 cards a page, front page + back page. |
| `site/tj-tackle-contact.vcf` | "Save my contact" card for a buyer's phone. |
| `site/qr-site.svg`, `qr-card.png` | QR to the storefront (print, social, packaging). |
| `site/qr-email.svg` | QR that opens a new order email. |

## Printing the cards

Open `site/business-cards.html` in a browser and press **Ctrl/Cmd + P**:

- **Paper** Letter · **Margins** None · **Scale** 100% · **Background graphics ON**
- Page 1 = fronts, page 2 = backs. Print page 1, flip the stack on the **short
  edge**, print page 2.
- Cut on the dashed lines — each card is a true 3.5 × 2 in.
- For a print shop, choose **Save as PDF** in that same dialog and upload the
  PDF. 14–16 pt matte card stock.

## A note on taking money

These links get a buyer talking to you and get the order details into your
inbox. They don't take payment — you reply with a total and collect however you
already do (Venmo, Cash App, Zelle, cash on pickup). Card checkout on the site
is a separate build; say the word when you want it.
