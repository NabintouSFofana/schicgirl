# Schicgirl — Launch Checklist (after deploying)

## 0. Deploy & smoke-test (do first)
- [ ] `git add -A && git commit -m "Bilingual SEO + AdSense"` then push to GitHub.
- [ ] Wait ~1–2 min for GitHub Pages to build, then open in a browser:
  - [ ] https://schicgirl.me/ads.txt → shows `google.com, pub-3952317552342233, DIRECT, f08c47fec0942fa0`
  - [ ] https://schicgirl.me/sitemap.xml → loads, lists `/fr/` and `/en/` URLs
  - [ ] https://schicgirl.me/fr/pellicules/ and https://schicgirl.me/en/dandruff/ → load, correct language

## 1. Google AdSense
- [ ] In AdSense dashboard → **Sites**: confirm schicgirl.me shows **"Ready"** (it verifies via the meta tag + ads.txt now on the site).
- [ ] ads.txt can take 24h+ to be re-crawled — the "ads.txt not found" warning clears on its own after deploy.
- [ ] To actually SHOW ads: AdSense → **Ads → By site → Auto ads → ON** (Google auto-places them using the loader script already on every page). Or place manual `<ins class="adsbygoogle">` units.

## 2. Google Search Console (https://search.google.com/search-console)
- [ ] Add property → **Domain** (`schicgirl.me`) → verify with the DNS TXT record it gives you (best — covers http/https/www/subdomains).
  - Alt: **URL prefix** `https://schicgirl.me` verified by HTML meta tag or file.
- [ ] **Sitemaps** → submit: `sitemap.xml`
- [ ] **URL Inspection** → paste your homepage + top 3 money pages (e.g. `/fr/pellicules/`, `/en/dandruff/`, `/fr/hydratation-cheveux-crepus/`) → **Request indexing**.
- [ ] After ~3–7 days check **Pages** (indexing) and **Performance** (impressions/clicks/queries). Filter by `/fr/` vs `/en/` to see each market.
- [ ] (2 min) Also add **Bing Webmaster Tools** → "Import from GSC". Ranks you on Bing + ChatGPT/Copilot search.

## 3. Backlinks & off-page — the real #1 ranking lever
- [ ] **Pinterest business account** (huge for hair): pin every ebook cover + blog graphic, each linking to its `/fr/` or `/en/` page. Aim for a few pins/week.
- [ ] Link your **Instagram / TikTok / Facebook** bios to the site; post content that drives clicks.
- [ ] Be genuinely helpful + drop a link where relevant: **Reddit** (r/Naturalhair, r/curlyhair, FR hair communities), **Quora**, French beauty forums.
- [ ] Pitch **guest posts / features** to curly/coily-hair blogs and French beauty sites (each earns a backlink).
- [ ] Promote the **free Type 4 Kit** (`/fr/kit-gratuit/`, `/en/free-kit/`) — free resources earn links naturally.
- [ ] List the brand in relevant **directories** (natural-hair, Black-owned business, affiliate/Selar profiles).

## 4. Keep publishing (compounds over time)
- [ ] Publish blog articles targeting long-tail questions (do FR and EN separately — searchers phrase things differently), and link each article to the related money page.
- [ ] Monitor GSC monthly; double down on the queries/pages already gaining impressions.

> Reality check: the technical SEO (done) makes you *eligible* to rank. Backlinks + fresh content + time are what move you to #1. First indexing shows in days; meaningful ranking movement takes weeks to a few months.
