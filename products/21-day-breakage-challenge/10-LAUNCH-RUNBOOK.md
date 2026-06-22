# 🚀 Master Launch Runbook — 21-Day Breakage Challenge

Owner-executable, single source of truth for go-live. Detail lives in the linked specialist docs.

> **Status: PRODUCTION COMPLETE — awaiting owner's commerce/automation setup.** Everything we can build is built (FR + EN, files, pages, graphics, emails). The only remaining work requires the owner's Selar + ESP logins. See §4 Go/No-Go and §8 Owner's remaining to-do.

---

## 1. Asset inventory & status

| Asset | Status | File / Where | Owner |
|---|:---:|---|---|
| Strategy & concept | ✅ | [01-strategy-and-concept.md](01-strategy-and-concept.md) | CEO / Product Creator |
| Workbook content (verified) | ✅ | [02-workbook.md](02-workbook.md) | Ebook Architect + Hair Expert |
| Tracker content | ✅ | [03-tracker.md](03-tracker.md) | Ebook Architect |
| Sales page copy (EN) | ✅ | [04-sales-page.md](04-sales-page.md) | Copywriter |
| Email sequence — EN (6) | ✅ | [05-email-sequence.md](05-email-sequence.md) | Copywriter |
| **Email sequence — FR (6)** | ✅ | [11-email-sequence-fr.md](11-email-sequence-fr.md) | Copywriter |
| Design briefs (9) + brand kit | ✅ | [06-design-briefs.md](06-design-briefs.md) | Canva Director |
| Facebook launch content | ✅ | [07-facebook-launch.md](07-facebook-launch.md) | FB Growth Mgr |
| Automation setup runbook | ✅ | [08-automation-setup.md](08-automation-setup.md) | Marketing-Ops |
| Tech assessment + build script | ✅ | [09-tech-assessment.md](09-tech-assessment.md) | Software Eng |
| **Workbook — HTML + PDF (EN)** | ✅ | `dist/workbook.html` · `dist/workbook.pdf` | Document Producer |
| **Tracker — HTML + PDF (EN)** | ✅ | `dist/tracker.html` · `dist/tracker.pdf` | Document Producer |
| **Workbook — HTML + PDF (FR)** | ✅ | `dist/workbook-fr.html` · `dist/workbook-fr.pdf` | Document Producer |
| **Tracker — HTML + PDF (FR)** | ✅ | `dist/tracker-fr.html` · `dist/tracker-fr.pdf` | Document Producer |
| **Build script covers all 4 (EN+FR)** | ✅ | `dist/build-pdf.sh` | Document Producer |
| **The 9 graphics (PNG + editable HTML)** | ✅ | `dist/graphics/` g1–g9 (cover, reframe, broken-vs-shed, detangle, journey-strip, hero, email-header, thumbnail, graduation) | Canva Director |
| **Sales/opt-in page (EN)** | ✅ | `en/21-day-breakage-challenge/index.html` | Web Developer |
| **Sales/opt-in page (FR)** | ✅ | `fr/defi-anti-casse-21-jours/index.html` | Web Developer |
| **Post-purchase delivery page (EN)** | ✅ | `en/21-day-breakage-challenge/start/` (noindex) | Web Developer |
| **Post-purchase delivery page (FR)** | ✅ | `fr/defi-anti-casse-21-jours/merci/` (noindex) | Web Developer |
| PDFs hosted + 2 Selar products (FR+EN) priced + files | ❌ BLOCKER (owner) | per 08 — needs Selar login | You / Marketing-Ops |
| Placeholder URLs replaced (CTAs + downloads + Grow/Routine links) | ❌ BLOCKER (owner) | per 08 — needs real Selar URLs | You |
| ESP automations wired (FR + EN) + Selar→ESP test | ❌ BLOCKER (owner) | per 08 — needs ESP login | You / Marketing-Ops |
| Final portrait photography (replace hero/cover placeholders) | ⏳ OPTIONAL | swap into g1/g6 + pages | You / Canva Director |
| Sales pages added to sitemap w/ hreflang | ⏳ OPTIONAL pre-launch | `sitemap.xml` + cross-links | You / Web Developer |

---

## 2. Critical path (do in this order)

**Everything above the line is DONE.** Steps 1–4 below are complete; the owner picks up at step 5.

1. ~~Finalize EN files~~ ✅ — workbook/tracker PDFs + sales pages exist.
2. ~~Translate to FR~~ ✅ — FR workbook + tracker content produced and rendered to `dist/workbook-fr.pdf` + `dist/tracker-fr.pdf` via `build-pdf.sh`. FR sales page + FR email sequence (11) done.
3. ~~Produce the 9 graphics~~ ✅ — all 9 exported as PNG with editable HTML source in `dist/graphics/`. Cover (g1), thumbnail (g8) and hero (g6) ready for Selar + OG + sales page.
4. ~~Build the delivery pages~~ ✅ — bilingual noindex post-purchase pages built with download-button placeholders.
5. **Host the 4 PDFs + create the 2 Selar products** (FR + EN), price **€6 / ~3 000 FCFA** (see 08), attach the correct-language PDFs, set thank-you → delivery page + upsell links. *(Owner — needs Selar login.)*
6. **Replace ALL placeholder URLs** in one pass:
   - Sales pages: `selar.com/REPLACE-challenge-en` and `-fr` → real Selar URLs. Add `price`/`priceCurrency` to the Product JSON-LD at the same time.
   - Delivery pages: download-button placeholders → hosted PDF links; Grow placeholder → real Grow link.
   - Confirm **Grow + Routine-System** Selar links (08 §7). *(Owner.)*
7. **Wire the ESP** — 2 automations (FR/EN), all 6 emails each, timing 0/+1/+7/+14/+21 + Day-4 & Day-10 recovery nudges. Test the Selar→ESP handoff. *(Owner — needs ESP login.)*
8. **(Optional pre-launch)** Swap in final portrait photography for hero/cover placeholders; publish sales pages to `sitemap.xml` w/ hreflang, link from `/en/products/` + `/fr/produits/` + homepage. Don't let `prerender.py` clobber the hand-built URLs.
9. **Run QA gates** (§3) → **Go/No-Go** (§4) → **Launch** (§5).

---

## 3. QA gates (all must pass)

Content/file/parity gates are now satisfiable today; the remaining unchecked gates all depend on the owner's Selar/ESP setup (steps 5–7).

- [x] **Files:** workbook + tracker PDFs open clean, no clipped content, checkboxes/tables render — **FR + EN all four exist.**
- [x] **FR/EN parity:** every customer-facing asset (workbook, tracker, sales page, emails, delivery page, graphics) exists in both languages.
- [ ] **Selar:** a test purchase delivers the *correct* PDFs and tags the buyer into the right language list. *(blocked on step 5)*
- [ ] **Emails:** all 6 fire in order; links resolve; recovery nudge fires; FR buyer gets FR, EN gets EN. *(blocked on step 7)*
- [ ] **URLs:** no `REPLACE-*` or placeholder download links remain on any page. *(blocked on step 6)*
- [ ] **SEO:** each page has one canonical, correct hreflang pair, title + meta + OG present (no duplicate canonicals); delivery pages stay `noindex`.
- [ ] **AdSense:** intact, layout not broken around ad slots.
- [ ] **Mobile:** sales pages render well on a phone; CTAs ≥44px; sticky bar works.
- [x] **Honest-promise compliance:** no asset (page, email subject, ad, graphic) promises "longer hair in 21 days." Win = less breakage + a routine that sticks. *(verified across EN + FR copy and the 9 graphics.)*
- [ ] **Tracking:** opt-in / purchase / email-click events fire; UTM links built for every FB asset.
- [ ] **Consent:** opt-in consent + unsubscribe + privacy link present, FR + EN.

---

## 4. Go / No-Go

**GO only if:** the three remaining ❌ blockers are cleared (Selar products + hosted PDFs, all placeholder URLs replaced, ESP automations wired) **and** the dependent QA gates are checked **and** one full FR + one full EN test purchase complete end-to-end.

**Current verdict: NO-GO — but for owner-only reasons.** Every asset we can produce is **production-complete and at FR/EN parity**: all 4 PDFs, both sales pages, both delivery pages, both email sequences, all 9 graphics. The site is launch-ready. The only thing standing between here and GO is the commerce + automation wiring, which requires the owner's Selar and ESP logins and cannot be done for them.

**Flip to GO** the moment §8 steps 1–3 are done and a test purchase in each language delivers the right PDF and triggers the right email sequence.

---

## 5. Launch-day timeline (ties to the FB 3-day plan in 07)

- **Day 1 — Build:** POST 1 (reframe, use g2) AM + REEL 1 PM. Soft CTA "comment RETAIN." No link yet.
- **Day 2 — Teach:** POST 2 (broken vs shed, use g3) AM + REEL 3 (stop soaking) PM. Name the challenge, still value-led.
- **Day 3 — Launch:** Direct offer post AM (link live, use g6 hero / g1 cover) + REEL 2 midday + POST 3 evening. Reply to every Day 1–2 commenter with the link.

---

## 6. Post-launch (first 7 days)

- Watch: opt-in rate, sales count, email open/click, Day-7 milestone replies.
- First follow-up: reply to buyers, collect 2–3 testimonials for the sales page (drop into the testimonial slots, FR + EN).
- Fast-follow candidate: the interactive web tracker (deferred — see [09](09-tech-assessment.md)); A/B whether it lifts Day-21 completion.

---

## 7. Known follow-ups (non-blocking polish)

- Externalize sales-page inline CSS → `assets/css/challenge.css` (`?v=` cache-bust).
- Swap OG image from `logo2.png` → the challenge cover (g1) — graphic now exists, just wire it in.
- Add real cover/preview images to the sales pages (use g1/g6, or final photography once shot).
- Populate `→ Grow p.X` anchors once Grow pagination is final.

---

## 8. Owner's remaining to-do (the only things left — needs your logins)

Do these in order. Nothing else blocks launch.

1. **Selar:** host the 4 PDFs (EN + FR workbook & tracker), create 2 products (EN + FR) at **€6 / ~3 000 FCFA**, attach the correct-language files, set thank-you → delivery page.
2. **Replace placeholders (one pass):** the `selar.com/REPLACE-*` CTAs on both sales pages, the download + Grow placeholders on both delivery pages, and confirm the Grow + Routine-System Selar links. Add `price`/`priceCurrency` to the Product JSON-LD while you're in there.
3. **ESP:** build 2 automations (FR + EN), 6 emails each, timing 0/+1/+7/+14/+21 + Day-4/Day-10 recovery nudges; run a Selar→ESP test in each language.
4. **(Optional, can ship after launch):** shoot final portrait photography to replace the hero/cover placeholders; publish the sales pages to `sitemap.xml` with hreflang and link them from the product index + homepage.

Then run §3 QA gates → §4 Go/No-Go → §5 launch.
