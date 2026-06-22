#!/usr/bin/env python3
"""Idempotently patch page JS so pre-rendered /fr/ and /en/ pages hydrate correctly:
  1. lang init: derive initial language from <html lang> when there's no ?lang
     (so /en/<slug>/ renders English without a query string).
  2. ebook image paths: absolutize JS-set cover/preview src so they don't break
     at the deeper /xx/slug/ URL depth.
Safe to re-run; each patch is guarded."""
import re

# 12 pages whose init matches  setLang( <expr> ? "en" : "fr" )
LANG_PAGES = ["about", "blog", "contact", "privacy-policy", "terms", "hydratee",
              "pousse", "coiffures", "stop-cheveux-secs", "transition",
              "pack-complet", "planner"]
# 6 ebook pages with the identical pellicules-style render() image code
EBOOK_PAGES = ["hydratee", "pousse", "coiffures", "stop-cheveux-secs",
               "transition", "pack-complet"]

UNIVERSAL_INIT = ('setLang(((new URLSearchParams(location.search).get("lang"))'
                  '||document.documentElement.getAttribute("lang"))==="en"?"en":"fr");')
INIT_RE = re.compile(r'setLang\(\s*[^;]*?\?\s*"en"\s*:\s*"fr"\s*\)\s*;')

def patch_lang(path):
    s = open(path, encoding="utf-8").read()
    if UNIVERSAL_INIT in s:
        return "already"
    new, n = INIT_RE.subn(UNIVERSAL_INIT, s)
    if n == 0:
        return "NO-MATCH"
    open(path, "w", encoding="utf-8", newline="").write(new)
    return f"patched({n})"

def patch_images(path):
    s = open(path, encoding="utf-8").read()
    if "function ab(" in s:
        return "already"
    helper = ('  function ab(p){ return (!p || p.charAt(0)==="/" || /^https?:/.test(p)) '
              '? p : "/"+p.replace(/^\\.?\\//,""); }\n')
    # insert helper right after the first  var LANG ... ;  line
    m = re.search(r'(var LANG\s*=\s*"fr";\s*\n)', s)
    if not m:
        return "NO-LANG-VAR"
    s = s[:m.end()] + helper + s[m.end():]
    s = s.replace('cov.setAttribute("src", src);', 'cov.setAttribute("src", ab(src));')
    s = s.replace('pi.setAttribute("src","assets/previews/"+EBOOK.slug+"-inside"+suf+".png");',
                  'pi.setAttribute("src",ab("assets/previews/"+EBOOK.slug+"-inside"+suf+".png"));')
    s = s.replace('pd.setAttribute("src","assets/previews/"+EBOOK.slug+"-detail"+suf+".png");',
                  'pd.setAttribute("src",ab("assets/previews/"+EBOOK.slug+"-detail"+suf+".png"));')
    open(path, "w", encoding="utf-8", newline="").write(s)
    return "patched"

def patch_special(path, old, new):
    """Idempotent literal swap for the two non-standard pages."""
    s = open(path, encoding="utf-8").read()
    if new in s:
        return "already"
    if old not in s:
        return "NO-MATCH"
    open(path, "w", encoding="utf-8", newline="").write(s.replace(old, new, 1))
    return "patched"

if __name__ == "__main__":
    print("== lang init ==")
    for p in LANG_PAGES:
        print(f"  {p:20} {patch_lang(f'assets/js/{p}.page.js')}")
    print("== ebook images ==")
    for p in EBOOK_PAGES:
        print(f"  {p:20} {patch_images(f'assets/js/{p}.page.js')}")
    print("== special pages ==")
    # products: default render language follows <html lang> (page is English-first)
    print("  products            " + patch_special(
        "assets/js/products.page.js",
        'let currentLang="en", activeFilter="all";',
        'let currentLang=(document.documentElement.getAttribute("lang")||"en"), activeFilter="all";'))
    # toolkit-landing: initial language follows <html lang>, else browser language
    print("  toolkit-landing     " + patch_special(
        "assets/js/toolkit-landing.page.js",
        'apply((navigator.language||"en").toLowerCase().indexOf("fr")===0 ? "fr" : "en");',
        'apply(document.documentElement.getAttribute("lang") || ((navigator.language||"en").toLowerCase().indexOf("fr")===0 ? "fr" : "en"));'))
