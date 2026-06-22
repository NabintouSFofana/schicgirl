# 🚀 Master Launch Runbook — 21-Day Breakage Challenge

Owner-executable, single source of truth for go-live. Detail lives in the linked specialist docs.

---

## 1. Asset inventory & status

| Asset | Status | File / Where | Owner |
|---|:---:|---|---|
| Strategy & concept | ✅ | [01-strategy-and-concept.md](01-strategy-and-concept.md) | CEO / Product Creator |
| Workbook content (verified) | ✅ | [02-workbook.md](02-workbook.md) | Ebook Architect + Hair Expert |
| Tracker content | ✅ | [03-tracker.md](03-tracker.md) | Ebook Architect |
| Sales page copy | ✅ | [04-sales-page.md](04-sales-page.md) | Copywriter |
| Email sequence (6) | ✅ | [05-email-sequence.md](05-email-sequence.md) | Copywriter |
| Design briefs (9) + brand kit | ✅ | [06-design-briefs.md](06-design-briefs.md) | Canva Director |
| Facebook launch content | ✅ | [07-facebook-launch.md](07-facebook-launch.md) | FB Growth Mgr |
| Automation setup runbook | ✅ | [08-automation-setup.md](08-automation-setup.md) | Marketing-Ops |
| Tech assessment + build script | ✅ | [09-tech-assessment.md](09-tech-assessment.md) | Software Eng |
| **Workbook — HTML + PDF (EN)** | ✅ | `dist/workbook.html` · `dist/workbook.pdf` | Document Producer |
| **Tracker — HTML + PDF (EN)** | ✅ | `dist/tracker.html` · `dist/tracker.pdf` | Document Producer |
| **Sales/opt-in page (EN)** | ✅ | `en/21-day-breakage-challenge/index.html` | Web Developer |
| **Sales/opt-in page (FR)** | ✅ | `fr/defi-anti-casse-21-jours/index.html` | Web Developer |
| Workbook + Tracker — **FR PDFs** | ❌ BLOCKER | translate content → re-run `dist/build-pdf.sh` | Document Producer |
| The 9 graphics produced in Canva | ⏳ | briefs ready in 06 | You / Canva Director |
| Selar products (FR + EN) priced + files | ❌ BLOCKER | per 08 | You / Marketing-Ops |
| ESP automations wired (FR + EN) | ❌ BLOCKER | per 08 | You / Marketing-Ops |
| Grow + Routine-System Selar links confirmed | ⏳ | fill blanks in 08 §7 | You |

---

## 2. Critical path (do in this order)

1. **Finalize EN files** ✅ (done — workbook/tracker PDFs + sales pages exist).
2. **Translate to FR** → workbook + tracker content, then regenerate FR PDFs with `dist/build-pdf.sh`. Sales-page FR is already drafted in the FR page (proofread it).
3. **Produce the 9 graphics** in Canva from [06](06-design-briefs.md) — at minimum the cover (for Selar thumbnail + OG image) and the sales-page hero.
4. **Create the 2 Selar products** (FR + EN), price **€6 / ~3 000 FCFA** (see 08), attach the 4 PDFs, set thank-you + upsell links.
5. **Replace CTA placeholders** on both sales pages: `https://selar.com/REPLACE-challenge-en` and `-fr` → real Selar URLs. Add `price`/`priceCurrency` to the Product JSON-LD at the same time.
6. **Wire the ESP** — 2 automations (FR/EN), all 6 emails, timing 0/+1/+7/+14/+21, Day-4 & Day-10 recovery nudges. Test the Selar→ESP handoff.
7. **Publish the sales pages** — add to `sitemap.xml` w/ hreflang, link from `/en/products/` + `/fr/produits/` + homepage. Don't let `prerender.py` clobber the hand-built URLs (see Web Dev follow-ups).
8. **Run QA gates** (§3) → **Go/No-Go** (§4) → **Launch** (§5).

---

## 3. QA gates (all must pass)

- [ ] **Files:** workbook + tracker PDFs open clean, no clipped content, checkboxes/tables render, FR + EN both exist.
- [ ] **Selar:** a test purchase delivers the *correct* PDFs and tags the buyer into the right language list.
- [ ] **Emails:** all 6 fire in order; links resolve; recovery nudge fires; FR buyer gets FR, EN gets EN.
- [ ] **FR/EN parity:** every customer-facing asset exists in both languages.
- [ ] **SEO:** each page has one canonical, correct hreflang pair, title + meta + OG present (no duplicate canonicals).
- [ ] **AdSense:** intact, layout not broken around ad slots.
- [ ] **Mobile:** sales pages render well on a phone; CTAs ≥44px; sticky bar works.
- [ ] **Honest-promise compliance:** no asset (page, email subject, ad) promises "longer hair in 21 days." Win = less breakage + a routine that sticks.
- [ ] **Tracking:** opt-in / purchase / email-click events fire; UTM links built for every FB asset.
- [ ] **Consent:** opt-in consent + unsubscribe + privacy link present, FR + EN.

---

## 4. Go / No-Go

**GO only if:** all four ❌ blockers cleared (FR PDFs, Selar products, ESP automations, upsell links) **and** every QA gate checked **and** one full FR + one full EN test purchase completed end-to-end.

**Current verdict: NO-GO** — content & files are production-ready, but commerce/automation/FR are not yet live. Clear §1 blockers to flip to GO.

---

## 5. Launch-day timeline (ties to the FB 3-day plan in 07)

- **Day 1 — Build:** POST 1 (reframe) AM + REEL 1 PM. Soft CTA "comment RETAIN." No link yet.
- **Day 2 — Teach:** POST 2 (broken vs shed) AM + REEL 3 (stop soaking) PM. Name the challenge, still value-led.
- **Day 3 — Launch:** Direct offer post AM (link live) + REEL 2 midday + POST 3 evening. Reply to every Day 1–2 commenter with the link.

---

## 6. Post-launch (first 7 days)

- Watch: opt-in rate, sales count, email open/click, Day-7 milestone replies.
- First follow-up: reply to buyers, collect 2–3 testimonials for the sales page.
- Fast-follow candidate: the interactive web tracker (deferred — see [09](09-tech-assessment.md)); A/B whether it lifts Day-21 completion.

---

## 7. Known follow-ups (non-blocking polish)

- Externalize sales-page inline CSS → `assets/css/challenge.css` (`?v=` cache-bust).
- Swap OG image from `logo2.png` → the challenge cover once designed.
- Add real cover/preview images to the sales pages.
- Populate `→ Grow p.X` anchors once Grow pagination is final.
