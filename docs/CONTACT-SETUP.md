# Getting every buyer message into one inbox

Everything a buyer can tap — the website, the business cards, the QR codes, the
saved contact — points at **one address**. Nothing is scattered across your
other accounts.

## The one address

```
gilbertsenthomas00+orders@gmail.com
```

That is your normal Gmail with `+orders` on the end. Google ignores everything
from the `+` onward when it delivers, so **it lands in the inbox you already
read** — no new account, no password, no forwarding to set up. The tag is there
so Gmail can spot business mail and file it for you (next section).

### When you want a cleaner address

`tjstackle@gmail.com` looks better on a card than the `+orders` one. When you
create it:

1. Open `brand/contact.json`
2. Change `orderEmail` **and** `orderEmailLabel` to the new address
3. Run `python3 scripts/build-contact.py`

That one change rewrites the website, the business cards, the QR codes and the
saved-contact file together, so they can never drift apart. Add your phone
number in `phone` at the same time and a "Call or text" row appears on the site
and a Call line on the cards — leave it blank and they're simply left off.

## Make Gmail file it all under one label (2 minutes, on a phone or computer)

1. Gmail → search bar → **Show search options** (the sliders icon on the right)
2. In **To**, type `gilbertsenthomas00+orders@gmail.com`
3. **Create filter** → tick:
   - **Apply the label** → *New label…* → `T&J Orders`
   - **Never send it to Spam**
   - **Always mark it as important**
4. **Create filter**

Every order, wholesale request and question now stacks up under **T&J Orders**
in the sidebar. Nothing mixes with personal mail, and you can hand someone the
phone without them scrolling your inbox.

## A signature that sells

Gmail → Settings (gear) → **See all settings** → **Signature** → Create new:

```
Thomas Gilbertsen
T&J's Tackle — Owner / Bait Maker
Original soft & hard baits · Freshwater & Saltwater

Shop the catalog: https://tman686.github.io/T-J-Tackle/
Orders: gilbertsenthomas00+orders@gmail.com
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
