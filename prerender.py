#!/usr/bin/env python3
"""
Bilingual static pre-render engine for schicgirl.me (GitHub Pages, static).

Takes a data-fr/data-en dual-content page and emits two single-language,
crawlable static pages at clean URLs:
    /fr/<slug_fr>/index.html   (French, hreflang -> EN)
    /en/<slug_en>/index.html   (English, hreflang -> FR)
and annotates the original root file with canonical->FR + hreflang so Google
consolidates the duplicate into the new clean URLs (page stays fully working).

A page is a product (Product+Offer schema) iff its config has an "ebook" block.
Config lives in pages_config.py. Re-runnable and non-destructive.
"""
import os, re, json, lxml.html
from lxml.html import builder as E
from pages_config import PAGES

UTF8 = lxml.html.HTMLParser(encoding="utf-8")  # force UTF-8; libxml2 mis-sniffs otherwise

def parse_utf8(path):
    return lxml.html.parse(path, parser=UTF8).getroot()

SITE = "https://schicgirl.me"
LOGO = f"{SITE}/assets/logo2.png"
VERSION = "20260621c"  # bump to force browsers to re-fetch local css/js after a deploy

# old root file -> (clean FR url, clean EN url) for internal-link rewriting
LINKMAP = {f"/{c['src']}": (f"/fr/{c['slug_fr']}/", f"/en/{c['slug_en']}/") for c in PAGES}

def abspath(p):
    """Relative asset/page path -> absolute root path."""
    if not p:
        return p
    if p.startswith(("http://", "https://", "//", "#", "mailto:", "/", "data:")):
        return p
    return "/" + p.lstrip("./")

def set_inner(el, html_fragment):
    frag = lxml.html.fragment_fromstring(html_fragment, create_parent="div")
    el.text = frag.text
    for c in list(el):
        el.remove(c)
    for c in frag:
        el.append(c)

def toggle_class(el, cls, present):
    classes = [c for c in (el.get("class") or "").split() if c != cls]
    if present:
        classes.append(cls)
    if classes:
        el.set("class", " ".join(classes))
    elif el.get("class") is not None:
        del el.attrib["class"]

def jsonld(doc, obj):
    s = E.SCRIPT(json.dumps(obj, ensure_ascii=False, indent=2))
    s.set("type", "application/ld+json")
    doc.head.append(s)

def build(cfg, lang):
    other = "en" if lang == "fr" else "fr"
    eb = cfg.get("ebook")
    slug = cfg[f"slug_{lang}"]
    url_self = f"{SITE}/{lang}/{slug}/"
    url_fr = f"{SITE}/fr/{cfg['slug_fr']}/"
    url_en = f"{SITE}/en/{cfg['slug_en']}/"

    doc = parse_utf8(cfg["src"])
    doc.set("lang", lang)

    def byid(i):
        try:
            return doc.get_element_by_id(i)
        except KeyError:
            return None

    # 1. drop opposite-language [data-lang] blocks; un-hide our own
    for el in doc.xpath("//*[@data-lang]"):
        if el.get("data-lang") == lang:
            toggle_class(el, "hide", False)
        else:
            el.getparent().remove(el)

    # 2. bake data-fr/data-en elements to this language. Normally drop the other
    #    attribute; keep_attrs pages retain both so their in-place toggle still works.
    keep = cfg.get("keep_attrs")
    for el in doc.xpath("//*[@data-fr and @data-en]"):
        set_inner(el, el.get(f"data-{lang}") or "")
        if not keep:
            del el.attrib[f"data-{other}"]

    # 3. price / CTA / cover / previews (was JS-injected) — products only
    if eb:
        price = eb[f"price_{lang}"]
        cfa = eb["price_cfa"] if lang == "fr" else ""
        for i in ("price", "barPrice"):
            if byid(i) is not None: byid(i).text = price
        for i in ("priceCfa", "barCfa"):
            if byid(i) is not None: byid(i).text = cfa
        if byid("mainCta") is not None:
            byid("mainCta").set("href", eb[f"url_{lang}"]); byid("mainCta").text = eb[f"cta_{lang}"]
        if byid("barCta") is not None:
            byid("barCta").set("href", eb[f"url_{lang}"]); byid("barCta").text = "Obtenir →" if lang == "fr" else "Get it →"
        if byid("cover") is not None:
            byid("cover").set("src", abspath(eb[f"img_{lang}"]))
        suf = "-en" if lang == "en" else ""
        for i, kind in (("prevInside", "inside"), ("prevDetail", "detail")):
            if byid(i) is not None:
                byid(i).set("src", f"/assets/previews/{eb['preview_slug']}-{kind}{suf}.png")

    # 4. language toggle buttons now navigate between the two URLs
    if byid("btnEn") is not None:
        byid("btnEn").set("onclick", f"location.href='{url_en}'")
        toggle_class(byid("btnEn"), "is-active", lang == "en")
    if byid("btnFr") is not None:
        byid("btnFr").set("onclick", f"location.href='{url_fr}'")
        toggle_class(byid("btnFr"), "is-active", lang == "fr")

    # 5. absolutize every relative href/src so depth doesn't matter
    for el in doc.xpath("//*[@href]"):
        el.set("href", abspath(el.get("href")))
    for el in doc.xpath("//*[@src]"):
        el.set("src", abspath(el.get("src")))
    # point internal links at the clean per-language URLs (not the old .html)
    for a in doc.xpath("//a[@href]"):
        base = a.get("href").split("?")[0]
        if base in LINKMAP:
            a.set("href", LINKMAP[base][0 if lang == "fr" else 1])
    # cache-bust local css/js so deploys aren't masked by stale browser cache
    for el in doc.xpath('//link[@rel="stylesheet"][starts-with(@href,"/assets/")]'):
        el.set("href", el.get("href") + f"?v={VERSION}")
    for el in doc.xpath('//script[starts-with(@src,"/assets/")]'):
        el.set("src", el.get("src") + f"?v={VERSION}")

    # 6. head: title / description / og / canonical / hreflang
    head = doc.head
    for t in doc.xpath("//title"):
        t.text = cfg[f"title_{lang}"]
    for m in doc.xpath('//meta[@name="description"]'):
        m.set("content", cfg[f"desc_{lang}"])
    for prop, val in (("og:title", cfg[f"title_{lang}"]), ("og:description", cfg[f"desc_{lang}"])):
        for m in doc.xpath(f'//meta[@property="{prop}"]'):
            m.set("content", val)
    for el in doc.xpath('//link[@rel="canonical"] | //script[@type="application/ld+json"] | //link[@hreflang]'):
        el.getparent().remove(el)
    link_canon = E.LINK(rel="canonical"); link_canon.set("href", url_self); head.append(link_canon)
    for hl, u in (("fr", url_fr), ("en", url_en), ("x-default", url_fr)):
        l = E.LINK(rel="alternate"); l.set("hreflang", hl); l.set("href", u); head.append(l)

    # 7. JSON-LD
    if eb:
        jsonld(doc, {
            "@context": "https://schema.org", "@type": "Product",
            "name": cfg[f"name_{lang}"], "image": f"{SITE}/{eb[f'img_{lang}'].lstrip('/')}",
            "description": cfg[f"desc_{lang}"], "brand": {"@type": "Brand", "name": "Schicgirl"},
            "offers": {"@type": "Offer", "price": eb[f"amount_{lang}"],
                       "priceCurrency": eb[f"cur_{lang}"], "url": url_self,
                       "availability": "https://schema.org/InStock"},
        })
    faq = []
    for dl in doc.xpath('//dl[contains(@class,"faq")]'):
        kids = [c for c in dl if c.tag in ("dt", "dd")]
        for i in range(0, len(kids) - 1, 2):
            q = (kids[i].text_content() or "").strip()
            a = (kids[i + 1].text_content() or "").strip()
            if q and a:
                faq.append({"@type": "Question", "name": q,
                            "acceptedAnswer": {"@type": "Answer", "text": a}})
    if faq:
        jsonld(doc, {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": faq})
    crumbs = [{"@type": "ListItem", "position": 1, "name": "Schicgirl", "item": f"{SITE}/"}]
    if eb:
        crumbs.append({"@type": "ListItem", "position": 2, "name": cfg[f"cat_{lang}"], "item": f"{SITE}/{lang}/"})
        crumbs.append({"@type": "ListItem", "position": 3, "name": cfg[f"name_{lang}"], "item": url_self})
    else:
        crumbs.append({"@type": "ListItem", "position": 2, "name": cfg[f"name_{lang}"], "item": url_self})
    jsonld(doc, {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": crumbs})
    jsonld(doc, {
        "@context": "https://schema.org", "@type": "WebPage",
        "name": cfg[f"title_{lang}"], "url": url_self, "inLanguage": lang,
        "isPartOf": {"@type": "WebSite", "name": "Schicgirl", "url": f"{SITE}/"},
        "publisher": {"@type": "Organization", "name": "Schicgirl",
                      "logo": {"@type": "ImageObject", "url": LOGO}},
    })

    out_dir = os.path.join(lang, slug)
    os.makedirs(out_dir, exist_ok=True)
    html = lxml.html.tostring(doc, encoding="unicode", doctype="<!doctype html>")
    with open(os.path.join(out_dir, "index.html"), "w", encoding="utf-8", newline="") as f:
        f.write(html)
    return os.path.join(out_dir, "index.html"), url_self

SEO_MARK = "<!-- seo:hreflang -->"

def annotate_source(cfg):
    """Non-destructive: keep the original bilingual page fully working, but add
    canonical->FR + hreflang so Google consolidates it into the new clean URLs.
    Pure string surgery (no lxml round-trip) so the hand-authored file's encoding
    and formatting are untouched. Idempotent via the SEO_MARK sentinel."""
    url_fr = f"{SITE}/fr/{cfg['slug_fr']}/"
    url_en = f"{SITE}/en/{cfg['slug_en']}/"
    with open(cfg["src"], "r", encoding="utf-8") as f:
        html = f.read()
    html = re.sub(re.escape(SEO_MARK) + r".*?" + re.escape(SEO_MARK), "", html, flags=re.DOTALL)
    # strip any stale canonical / hreflang / JSON-LD from earlier passes so the
    # page ends up with exactly one canonical (-> the FR clean URL)
    html = re.sub(r'\s*<link[^>]*rel="canonical"[^>]*>', "", html)
    html = re.sub(r'\s*<link[^>]*\shreflang="[^"]*"[^>]*>', "", html)
    html = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', "", html, flags=re.DOTALL)
    block = (SEO_MARK +
             f'\n<link rel="canonical" href="{url_fr}">'
             f'\n<link rel="alternate" hreflang="fr" href="{url_fr}">'
             f'\n<link rel="alternate" hreflang="en" href="{url_en}">'
             f'\n<link rel="alternate" hreflang="x-default" href="{url_fr}">\n' + SEO_MARK)
    html = html.replace("</head>", block + "\n</head>", 1)
    with open(cfg["src"], "w", encoding="utf-8", newline="") as f:
        f.write(html)

if __name__ == "__main__":
    for cfg in PAGES:
        for lang in ("fr", "en"):
            path, url = build(cfg, lang)
            print(f"  {path}  ->  {url}")
        annotate_source(cfg)
