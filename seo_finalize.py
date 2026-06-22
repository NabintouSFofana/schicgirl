#!/usr/bin/env python3
"""Regenerate sitemap.xml (with hreflang) and repoint inbound JS links to the
clean /fr/ + /en/ URLs. Idempotent."""
import re, glob
from pages_config import PAGES

SITE = "https://schicgirl.me"
LASTMOD = "2026-06-21"

# src filename (no .html) -> (fr_url, en_url)
def urls(c): return (f"{SITE}/fr/{c['slug_fr']}/", f"{SITE}/en/{c['slug_en']}/")

# ---------------- sitemap ----------------
# Indexable pages NOT yet restructured (single URL each).
# Indexable pages NOT restructured (single URL each). products/toolkit-landing
# are now in PAGES (restructured), so they're excluded here.
SINGLE = ["", "CoilCareAI.html", "hydracheck.html", "schicchat.html",
          "studio.html", "consultation.html"]

def gen_sitemap():
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
           'xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    def url(loc, prio, alts=None):
        out.append("  <url>")
        out.append(f"    <loc>{loc}</loc>")
        out.append(f"    <lastmod>{LASTMOD}</lastmod>")
        out.append(f"    <priority>{prio}</priority>")
        for hl, u in (alts or []):
            out.append(f'    <xhtml:link rel="alternate" hreflang="{hl}" href="{u}"/>')
        out.append("  </url>")
    for s in SINGLE:
        url(f"{SITE}/{s}", "1.0" if s == "" else "0.7")
    for c in PAGES:
        fr, en = urls(c)
        alts = [("fr", fr), ("en", en), ("x-default", fr)]
        url(fr, "0.9", alts)
        url(en, "0.9", alts)
    out.append("</urlset>")
    open("sitemap.xml", "w", encoding="utf-8", newline="").write("\n".join(out) + "\n")
    return len(SINGLE) + 2 * len(PAGES)

# ---------------- inbound JS links ----------------
def repoint_links():
    files = glob.glob("assets/js/*.page.js") + glob.glob("assets/js/blog.js")
    changed = {}
    for f in files:
        s = open(f, encoding="utf-8").read()
        orig = s
        for c in PAGES:
            src = c["src"]                      # e.g. hydratee.html
            fr = f"/fr/{c['slug_fr']}/"; en = f"/en/{c['slug_en']}/"
            stem = re.escape(src)
            # "/X.html?lang=en"  or  'X.html?lang=en'  -> EN clean (quote-delimited)
            s = re.sub(rf'(["\'])/?{stem}\?lang=en\1', rf'\1{en}\1', s)
            s = re.sub(rf'(["\'])/?{stem}\?lang=fr\1', rf'\1{fr}\1', s)
            # bare "/X.html" or "X.html" -> FR clean
            s = re.sub(rf'(["\'])/?{stem}\1', rf'\1{fr}\1', s)
        if s != orig:
            open(f, "w", encoding="utf-8", newline="").write(s)
            changed[f] = sum(1 for a, b in zip(orig, s) if a != b) or 1
    return changed

# ---------------- homepage crawlable links ----------------
HP_MARK = "<!-- seo:hublinks -->"

def inject_homepage_links(path="index.html"):
    """Add a <noscript> block to the JS-rendered homepage so crawlers get real,
    keyword-anchored links to every /fr/ and /en/ money page (crawl discovery +
    internal link equity). Invisible to JS users. Idempotent via HP_MARK."""
    html = open(path, encoding="utf-8").read()
    html = re.sub(re.escape(HP_MARK) + r".*?" + re.escape(HP_MARK), "", html, flags=re.DOTALL)
    fr = "".join(f'<li><a href="/fr/{c["slug_fr"]}/">{c["name_fr"]}</a></li>' for c in PAGES)
    en = "".join(f'<li><a href="/en/{c["slug_en"]}/">{c["name_en"]}</a></li>' for c in PAGES)
    block = (HP_MARK + '<noscript>'
             '<section><h1>Schicgirl — Cheveux Crépus Type 4 / Type 4 Coily Hair</h1>'
             '<p>Schicgirl aide les femmes aux cheveux crépus Type 4 (4A 4B 4C) à comprendre '
             'la sécheresse, construire une routine et choisir des produits fiables. '
             'Schicgirl helps women with Type 4 coily hair understand dryness, build a routine '
             'and choose trusted products.</p>'
             f'<h2>Guides &amp; pages (Français)</h2><ul>{fr}</ul>'
             f'<h2>Guides &amp; pages (English)</h2><ul>{en}</ul>'
             '</section></noscript>' + HP_MARK)
    html = html.replace('<div class="schicgirl-wrap" id="schicgirlWrap"></div>',
                        '<div class="schicgirl-wrap" id="schicgirlWrap"></div>\n    ' + block, 1)
    open(path, "w", encoding="utf-8", newline="").write(html)

if __name__ == "__main__":
    n = gen_sitemap()
    print(f"sitemap.xml: {n} URLs")
    ch = repoint_links()
    print("repointed links in:")
    for f in sorted(ch): print(f"  - {f}")
    inject_homepage_links()
    print("homepage crawlable links injected into index.html")
