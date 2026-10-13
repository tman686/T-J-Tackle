#!/usr/bin/env python3
"""
Regenerate every piece of T&J's Tackle contact collateral from ONE source of
truth: brand/contact.json.

    python3 scripts/build-contact.py

Outputs:
    site/qr-site.svg            QR -> the live storefront
    site/qr-email.svg           QR -> opens a new order email
    site/qr-card.png            QR -> storefront (raster, for print/social)
    site/tj-tackle-contact.vcf  "quick contact" card for a buyer's phone
    site/business-cards.html    print-ready 10-up sheet, double sided
    site/index.html             contact section + footer links, patched in place

Change the email in brand/contact.json and re-run; everything follows.
"""
import base64
import io
import json
import re
from pathlib import Path
from urllib.parse import quote

import segno
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / "brand" / "contact.json").read_text(encoding="utf-8"))

COMPANY = CFG["company"]
TAGLINE = CFG["tagline"]
OWNER = CFG["owner"]
TITLE = CFG["title"]
EMAIL = CFG["orderEmail"]
EMAIL_LABEL = CFG["orderEmailLabel"] or EMAIL
PHONE = CFG["phone"].strip()
INSTAGRAM = CFG["instagram"].strip().lstrip("@")
SITE = CFG["site"].rstrip("/") + "/"
SITE_LABEL = CFG["siteLabel"]
CITY = CFG["city"].strip()

NAVY, COPPER, PARCHMENT, SEA = "#0d2438", "#b06a34", "#f3e9d2", "#2f7d78"
CARD_PAPER = "#f8f0dc"  # sampled from the crest's own paper so it seats seamlessly


def tel_href(p: str) -> str:
    return "+1" + re.sub(r"\D", "", p)


ORDER_SUBJECT = f"{COMPANY} — Order Request"
MAILTO = f"mailto:{EMAIL}?subject={quote(ORDER_SUBJECT)}"


# ---------------------------------------------------------------- QR codes --
def qr_svg(data: str, scale: int = 1, dark: str = NAVY) -> str:
    """Inline SVG with no XML prolog, so it can be pasted straight into HTML."""
    q = segno.make(data, error="m")
    buf = io.BytesIO()
    q.save(buf, kind="svg", scale=scale, dark=dark, light=None,
           xmldecl=False, svgns=True, omitsize=True, svgclass=None, lineclass=None)
    return buf.getvalue().decode("utf-8").strip()


def write_qr_files() -> tuple[str, str]:
    site_svg = qr_svg(SITE)
    email_svg = qr_svg(MAILTO)
    (ROOT / "site" / "qr-site.svg").write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n' + site_svg, encoding="utf-8")
    (ROOT / "site" / "qr-email.svg").write_text(
        '<?xml version="1.0" encoding="utf-8"?>\n' + email_svg, encoding="utf-8")
    segno.make(SITE, error="m").save(
        ROOT / "site" / "qr-card.png", scale=12, border=3, dark=NAVY, light="white")
    return site_svg, email_svg


# ------------------------------------------------------------------ vCard --
def small_logo_b64(max_w: int = 320) -> str:
    """Downscale the master crest so the .vcf stays small enough to text."""
    src = ROOT / "apps" / "website" / "public" / "brand" / "tj-tackle-logo.png"
    im = Image.open(src).convert("RGB")
    im.thumbnail((max_w, max_w), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, format="JPEG", quality=72, optimize=True)
    return base64.b64encode(buf.getvalue()).decode("ascii")


def fold(line: str) -> str:
    """RFC 6350 line folding: continuation lines start with one space."""
    out, first = [], True
    while len(line) > 73:
        out.append(("" if first else " ") + line[:73])
        line, first = line[73:], False
    out.append(("" if first else " ") + line)
    return "\r\n".join(out)


def write_vcard() -> Path:
    photo = small_logo_b64()
    last, _, first = OWNER.partition(" ")
    lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        f"N:{first};{last};;;",
        f"FN:{OWNER}",
        f"ORG:{COMPANY}",
        f"TITLE:{TITLE}",
        f"EMAIL;TYPE=INTERNET,PREF:{EMAIL}",
    ]
    if PHONE:
        lines += [f"TEL;TYPE=CELL,VOICE,PREF:{tel_href(PHONE)}"]
    lines += [f"URL:{SITE}"]
    if INSTAGRAM:
        lines += [f"X-SOCIALPROFILE;TYPE=instagram:https://instagram.com/{INSTAGRAM}"]
    if CITY:
        lines += [f"ADR;TYPE=WORK:;;;{CITY};;;"]
    lines += [
        f"NOTE:{TAGLINE}. Email for orders\\, bulk pricing and custom colors.",
        f"PHOTO;ENCODING=b;TYPE=JPEG:{photo}",
        "END:VCARD",
    ]
    out = ROOT / "site" / "tj-tackle-contact.vcf"
    out.write_text("\r\n".join(fold(l) for l in lines) + "\r\n", encoding="utf-8")
    return out



# --------------------------------------------------------- business cards --
CARD_CSS = """
*{box-sizing:border-box;margin:0;padding:0}
body{background:#5b6472;font-family:'Inter',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
     -webkit-print-color-adjust:exact;print-color-adjust:exact}
.howto{max-width:7.5in;margin:24px auto;padding:20px 24px;background:#fff;border-radius:10px;
       font-size:14px;line-height:1.6;color:#222}
.howto h1{font-family:'Oswald',Impact,sans-serif;font-size:20px;letter-spacing:.02em;margin-bottom:8px;color:__NAVY__}
.howto ol{margin:8px 0 0 20px}.howto li{margin:4px 0}
.howto code{background:#eef1f4;padding:1px 5px;border-radius:4px;font-size:13px}
.sheet{width:8.5in;height:11in;margin:24px auto;background:#fff;padding:.5in .75in;
       display:grid;grid-template-columns:repeat(2,3.5in);grid-template-rows:repeat(5,2in);
       gap:0;align-content:start;justify-content:center;box-shadow:0 8px 40px rgba(0,0,0,.35)}
.sheet + .sheet{page-break-before:always}
.card{width:3.5in;height:2in;overflow:hidden;position:relative;outline:1px dashed rgba(0,0,0,.18);
      outline-offset:-.5px}

/* ---- FRONT: the crest's own paper tone, so it seats with no visible seam ---- */
.front{background:__PAPER__;color:__NAVY__;display:flex;flex-direction:column;
       justify-content:space-between;padding:.15in .18in .14in}
.front .top{display:grid;grid-template-columns:1.3in 1fr;gap:.13in;align-items:center}
.front .crest{width:1.3in;aspect-ratio:1400/748;background:var(--logo) center/contain no-repeat}
.front .who{font-family:'Oswald',Impact,sans-serif;font-size:12pt;letter-spacing:.03em;
            text-transform:uppercase;line-height:1.05}
.front .role{font-size:6.4pt;letter-spacing:.13em;text-transform:uppercase;color:__COPPER__;
             font-weight:600;margin-top:.02in}
.front .mid{font-size:6.6pt;letter-spacing:.1em;text-transform:uppercase;color:#56707f;
            font-weight:600;line-height:1.5}
.front .mid em{font-style:normal;color:__COPPER__}
.front .rule{height:2.5px;margin:.08in 0 .07in;
             background:linear-gradient(90deg,__COPPER__ 0 34%,__SEA__ 34% 56%,rgba(13,36,56,.14) 56% 100%)}
.front .lines{display:flex;flex-direction:column;gap:.03in}
.front .lines div{display:flex;gap:6px;align-items:baseline}
.front .lines b{color:__SEA__;font-weight:700;font-size:5.8pt;letter-spacing:.1em;
                text-transform:uppercase;flex:0 0 .4in}
.front .lines span{font-size:7.2pt;line-height:1.3;color:#1d3246;white-space:nowrap}

/* ---- BACK: navy, QR on a light plate so it always scans ---- */
.back{background:__NAVY__;color:__PARCH__;display:grid;grid-template-columns:1fr 1.02in;
      gap:.15in;padding:.18in;align-items:center}
.back .pitch{display:flex;flex-direction:column;gap:.06in;min-width:0}
.back .name{font-family:'Oswald',Impact,sans-serif;font-size:13pt;letter-spacing:.03em;
            text-transform:uppercase;line-height:1}
.back .tag{font-size:6.2pt;letter-spacing:.11em;text-transform:uppercase;color:__COPPER__;font-weight:600}
.back ul{list-style:none;font-size:6.9pt;line-height:1.52;color:#cfd8de;margin-top:.02in}
.back li{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.back li::before{content:"\\2023";color:__SEA__;font-weight:700;margin-right:5px}
.back .cta{font-size:6.6pt;font-weight:700;color:__PARCH__;margin-top:.04in;letter-spacing:.02em}
.back .cta em{font-style:normal;color:__COPPER__}
.back .qr{display:flex;flex-direction:column;align-items:center;gap:.04in}
.back .qrplate{background:#fff;padding:.05in;border-radius:.05in;line-height:0}
.back .qr svg{width:.82in;height:.82in;display:block}
.back .qr span{font-size:5pt;letter-spacing:.09em;text-transform:uppercase;color:#9fb0bd;text-align:center;line-height:1.3}

@media print{
  body{background:#fff}
  .howto{display:none}
  .sheet{margin:0;box-shadow:none;page-break-after:always}
  .sheet:last-child{page-break-after:auto}
  .card{outline:none}
}
@page{size:letter;margin:0}
"""


def card_front() -> str:
    rows = []
    if PHONE:
        rows.append(("Call", PHONE))
    rows.append(("Email", EMAIL_LABEL))
    rows.append(("Web", SITE_LABEL))
    if INSTAGRAM:
        rows.append(("IG", "@" + INSTAGRAM))
    lines = "".join(f"<div><b>{k}</b><span>{v}</span></div>" for k, v in rows)
    return f"""<div class="card front">
      <div class="top">
        <div class="crest"></div>
        <div><div class="who">{OWNER}</div><div class="role">{TITLE}</div></div>
      </div>
      <div class="mid">Soft &amp; hard baits, poured in-house <em>&middot;</em><br>Species bundles <em>&middot;</em> Custom colors <em>&middot;</em> Bulk orders</div>
      <div>
        <div class="rule"></div>
        <div class="lines">{lines}</div>
      </div>
    </div>"""


def card_back(qr: str) -> str:
    return f"""<div class="card back">
      <div class="pitch">
        <div class="name">{COMPANY}</div>
        <div class="tag">{TAGLINE}</div>
        <ul>
          <li>Pinfish &middot; Crab &middot; Mullet &middot; Shrimp</li>
          <li>Cranks &middot; Jerkbaits &middot; Topwater</li>
          <li>Species bundle packs &amp; custom colors</li>
          <li>Bulk &amp; dealer pricing on request</li>
        </ul>
        <div class="cta">Scan to shop <em>&middot;</em> Email to order</div>
      </div>
      <div class="qr"><div class="qrplate">{qr}</div><span>Shop the<br>catalog</span></div>
    </div>"""


def write_business_cards(site_svg: str) -> Path:
    index = (ROOT / "site" / "index.html").read_text(encoding="utf-8")
    logo = re.search(r'--logo:\s*(url\("data:image/[^"]+"\))', index).group(1)
    css = (CARD_CSS.replace("__NAVY__", NAVY).replace("__COPPER__", COPPER)
                   .replace("__PARCH__", PARCHMENT).replace("__SEA__", SEA)
                   .replace("__PAPER__", CARD_PAPER))
    fronts = "\n    ".join(card_front() for _ in range(10))
    backs = "\n    ".join(card_back(site_svg) for _ in range(10))
    html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>{COMPANY} — Business Cards</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600&family=Inter:wght@400;600&display=swap" rel="stylesheet" />
<style>:root{{--logo:{logo}}}
{css}</style>
</head>
<body>

<div class="howto">
  <h1>How to print these</h1>
  <ol>
    <li>Press <code>Ctrl&nbsp;/&nbsp;Cmd + P</code>. Set <b>Paper</b> to Letter, <b>Margins</b> to None, <b>Scale</b> to 100%, and turn <b>Background graphics ON</b>.</li>
    <li>Page 1 is the <b>fronts</b> (10 cards), page 2 is the <b>backs</b>. For double-sided, print page 1, flip the stack on the <b>short edge</b>, then print page 2.</li>
    <li>Cut on the dashed lines — each card is a true 3.5&nbsp;×&nbsp;2&nbsp;in, the US standard.</li>
    <li>Card stock: 14–16&nbsp;pt matte. Any print shop (Staples, Office Depot, Vistaprint "upload your own") takes a PDF — use <b>Save as PDF</b> in the print dialog.</li>
  </ol>
  <p style="margin-top:10px">Everything here comes from <code>brand/contact.json</code>. Change the email or add your phone number there, run <code>python3 scripts/build-contact.py</code>, and these cards update themselves.</p>
</div>

<section class="sheet">
    {fronts}
</section>

<section class="sheet">
    {backs}
</section>

</body>
</html>
"""
    out = ROOT / "site" / "business-cards.html"
    out.write_text(html, encoding="utf-8")
    return out


# ------------------------------------------------- patch site/index.html --
def patch_site(email_svg: str) -> Path:
    """Keep the live page's contact config and QR in step with contact.json."""
    path = ROOT / "site" / "index.html"
    html = path.read_text(encoding="utf-8")

    cfg_js = (
        "  // BEGIN:CONTACT_JS\n"
        "  const CONTACT = {\n"
        f'    company: "{COMPANY}",\n'
        f'    email:   "{EMAIL}",\n'
        f'    phone:   "{PHONE}",\n'
        f'    site:    "{SITE}"\n'
        "  };\n"
        "  // END:CONTACT_JS"
    )
    html, n1 = re.subn(r"  // BEGIN:CONTACT_JS.*?  // END:CONTACT_JS",
                       lambda _m: cfg_js, html, flags=re.S)

    qr = f"<!-- BEGIN:QR_EMAIL -->{email_svg}<!-- END:QR_EMAIL -->"
    html, n2 = re.subn(r"<!-- BEGIN:QR_EMAIL -->.*?<!-- END:QR_EMAIL -->",
                       lambda _m: qr, html, flags=re.S)

    if not (n1 and n2):
        raise SystemExit(
            f"site/index.html is missing a marker (CONTACT_JS={n1}, QR_EMAIL={n2}) — "
            "re-add it before running this script.")
    path.write_text(html, encoding="utf-8")
    return path



def patch_webapp() -> Path:
    """Keep the Next.js app's contact constants in step with contact.json."""
    path = ROOT / "apps" / "website" / "src" / "lib" / "contact.ts"
    ts = path.read_text(encoding="utf-8")
    block = (
        "// BEGIN:CONTACT_TS\n"
        f'export const ORDER_EMAIL = "{EMAIL}";\n'
        f'export const ORDER_PHONE = "{PHONE}";\n'
        f'export const SITE_URL = "{SITE}";\n'
        "// END:CONTACT_TS"
    )
    ts, n = re.subn(r"// BEGIN:CONTACT_TS.*?// END:CONTACT_TS", lambda _m: block, ts, flags=re.S)
    if not n:
        raise SystemExit("apps/website/src/lib/contact.ts is missing its CONTACT_TS markers.")
    path.write_text(ts, encoding="utf-8")
    return path


if __name__ == "__main__":
    site_svg, email_svg = write_qr_files()
    vcf = write_vcard()
    print(f"QR   site  -> site/qr-site.svg   ({SITE})")
    print(f"QR   email -> site/qr-email.svg  ({EMAIL})")
    print(f"QR   png   -> site/qr-card.png")
    print(f"vCard      -> {vcf.relative_to(ROOT)}  ({vcf.stat().st_size/1024:.0f} KB)")
    cards_path = write_business_cards(site_svg)
    print(f"Cards      -> {cards_path.relative_to(ROOT)}  ({cards_path.stat().st_size/1024:.0f} KB)")
    site_path = patch_site(email_svg)
    print(f"Site       -> {site_path.relative_to(ROOT)}  (contact config + QR refreshed)")
    app_path = patch_webapp()
    print(f"Web app    -> {app_path.relative_to(ROOT)}")
    print(f"\nEvery buyer message goes to: {EMAIL}")
