# T&J's Tackle — standalone website (`site/index.html`)

A **single, self-contained** web page for the T&J's Tackle storefront. The logo
is embedded (no external files), all CSS/JS is inline, and the only external
request is Google Fonts. It works opened directly from disk, hosted anywhere, or
embedded in **Google Sites**.

Contents: hero with the crest, **fast-selling lures**, **bundle deals by fish**
(species pricing), a full **soft + hard bait catalog** with live filters
(water / bait type / species — pinfish, crab, mullet, shrimp, craws, swimbaits,
crankbaits, jerkbaits, topwater), about, and contact.

## Put it on Google Sites

Google Sites can't run a Next.js app, but it embeds a full HTML page two ways:

### Option A — Embed the live page by URL (easiest)
1. Open your Google Site → **Insert → Embed → By URL**.
2. Paste the live page link, then **Insert** and resize to full width.
3. In Sites, set the section to **Full bleed** for an edge-to-edge look.

### Option B — Embed the HTML directly
1. Open `site/index.html` in a text editor and **copy all of it**.
2. In Google Sites → **Insert → Embed → Embed code**, paste, then **Next → Insert**.
   - Note: Google's embed-code box has a size limit; if it rejects the paste,
     use **Option A** (by URL) instead — that's the recommended path.

### Option C — Host it yourself, then embed by URL
Upload `index.html` to any static host (GitHub Pages, Netlify drop, Cloudflare
Pages, an S3 bucket) and embed that URL with Option A.

## Editing products & prices

Everything is data-driven. Open `site/index.html`, find the `<script>` near the
bottom, and edit the `PRODUCTS` and `BUNDLES` arrays:

- **PRODUCTS** — `name`, `type` (`Soft`/`Hard`), `water` (`Fresh`/`Salt`/`Both`),
  `cat`, `price`, `fast` (shows in Fast Sellers), `colors`, `species`, `blurb`.
- **BUNDLES** — `species`, `name`, `items`, `now` (bundle price), `was` (list).

The catalog, filters, fast-seller rail, and bundle cards all re-render from
those arrays automatically.

## Notes

- Prices are display prices. Live checkout (Stripe) is a separate build — this
  page is the storefront/brochure that can go on Google Sites today.
- The richer Next.js app (with the database + pricing engine) lives in
  `apps/website` and `packages/*`; this file is the Google-Sites-friendly build.
