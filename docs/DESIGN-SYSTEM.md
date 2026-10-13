# T&J's Tackle — Brand & Design System

The visual identity is drawn directly from the company crest: a vintage,
hand-illustrated badge with a largemouth bass, a mahi-mahi, and a tarpon around
a copper hook and ampersand, set on aged parchment.

## Palette

Sourced from the logo. Defined as CSS variables and Tailwind tokens in
`apps/website/src/app/globals.css` and `tailwind.config.ts`.

| Token | Hex | Use |
| ----- | --- | --- |
| `navy` (deep) | `#0d2438` | Primary brand, headers, footer, text on light |
| `navy-700` | `#123a5a` | Secondary navy, cards |
| `copper` | `#b06a34` | Primary accent — hooks, CTAs, ampersand |
| `copper-300` | `#d79a63` | Hover / highlight |
| `parchment` | `#f3e9d2` | Page background, "aged paper" |
| `parchment-200` | `#e7d8b6` | Panel background |
| `sea` (teal) | `#2f7d78` | Saltwater accents, mahi green |
| `silver` | `#c6ccce` | Tarpon / neutral metal |
| `ink` | `#1a1a1a` | Body text on parchment |

## Typography

- **Display / headings:** a strong condensed serif-adjacent slab feel. We use
  `Oswald` (self-hostable) for headline weight that echoes the logo's block
  lettering. Fallback: `Georgia, serif` never — instead `system-ui` condensed.
- **Body:** `Inter` / system sans for readability.
- Headlines are set in **uppercase with tight tracking** to match the crest.

## Voice & tone

- Confident, craft-forward, outdoorsman-authentic. Not corporate.
- Talk about **water, species, and conditions**, not just "products."
- Every product speaks to *where* and *how* it's fished.
- Est. 2023 — proud of being builder-owned and American-made.

## Logo usage

- Master asset: `apps/website/public/brand/tj-tackle-logo.png`
- Give the crest breathing room; never place it on busy photography without a
  parchment or navy plate behind it.
- On dark (navy) backgrounds, the parchment field of the logo provides its own
  contrast — no recoloring needed.

## Layout language

- **Parchment base** with **navy structure** and **copper accents**.
- Subtle paper grain via layered gradients (no external image needed).
- Generous vertical rhythm, wide gutters, oversized display headings.
- Cards use a hairline copper/navy border and a soft shadow.
