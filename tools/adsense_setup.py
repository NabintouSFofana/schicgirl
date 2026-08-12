#!/usr/bin/env python3
"""Ensure the AdSense meta + loader script are present in <head> of every public
page. Idempotent. Admin/noindex/internal pages are intentionally skipped."""
import re

PUB = "ca-pub-3952317552342233"
META = f'<meta name="google-adsense-account" content="{PUB}">'
SCRIPT = (f'<script async src="https://pagead2.googlesyndication.com/pagead/js/'
          f'adsbygoogle.js?client={PUB}" crossorigin="anonymous"></script>')

# public pages that were missing the script and/or meta
PAGES = ["planner.html", "toolkit-landing.html", "studio.html", "CoilCareAI.html",
         "hydracheck.html", "consultation.html", "schicchat.html"]

def ensure(path):
    s = open(path, encoding="utf-8").read()
    add = []
    if "google-adsense-account" not in s:
        add.append(META)
    if f"adsbygoogle.js?client={PUB}" not in s:
        add.append(SCRIPT)
    if not add:
        return "already"
    block = "\n  " + "\n  ".join(add)
    # insert right after the opening <head ...> tag
    s2 = re.sub(r"(<head[^>]*>)", r"\1" + block.replace("\\", "\\\\"), s, count=1)
    if s2 == s:
        return "NO-HEAD"
    open(path, "w", encoding="utf-8", newline="").write(s2)
    return "added: " + ", ".join("meta" if "adsense-account" in a else "script" for a in add)

if __name__ == "__main__":
    for p in PAGES:
        print(f"  {p:22} {ensure(p)}")
