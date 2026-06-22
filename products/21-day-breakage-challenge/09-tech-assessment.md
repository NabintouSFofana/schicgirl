# 09 — Build-vs-Buy Technical Assessment

**Product:** Stop the Breakage — 21-Day Length Retention Challenge
**Deliverable:** PDF workbook + printable tracker + 6-email accountability sequence
**Assessor:** Schicgirl software engineer · 2026-06-22
**Bias:** ship the smallest thing. Do not build what Selar + the ESP + the existing pipeline already do.

---

## 1. Does this launch need custom software?

**No. Zero custom software is required to launch.** The three-part product maps cleanly onto tools we already pay for and operate:

| Product component | Covered by | Custom code needed |
|---|---|---|
| Sell + take payment (FR/EN) | **Selar** (product, checkout, currency, VAT) | None |
| Deliver the two PDFs on purchase | **Selar** digital-file delivery (or delivery link in Email 1) | None |
| Sales / landing page | **Existing site** + the pre-render SEO pipeline (`/fr/…`, `/en/…`) | None — add a page to `pages_config.PAGES`, run the 3 scripts |
| 6-email accountability sequence | **ESP** (fixed-interval drip, FR + EN lists) | None |
| Recovery email (the only "smart" bit) | See note below | None for v1 |
| Generating the PDFs from HTML source | **Chrome headless** + the build script in this assessment (§3) | A 30-line bash script, not an app |

**The recovery email (Email 6) is the only place a "build" is even tempting — and we should not build it.** It is specced as behavior-triggered (2+ days with no tracker log). Triggering on real log activity would require a backend, a database, auth, and a tracker that phones home. That is a disproportionate amount of software for one nudge. The email sequence file already gives the correct fallback: **send it as fixed Day-4 and Day-10 "still with us?" nudges** in the ESP — the two known drop-off points. Same outcome, zero infrastructure.

**Verdict: launch on Selar + ESP + the existing static site. Write no application code.** The product is content and cadence, both of which are off-the-shelf-tool problems we have already solved for other Schicgirl products (Studio access PDFs already live in `/delivery/`).

---

## 2. Optional enhancement — client-side interactive 21-day tracker web app

### Short spec
A single static page on the existing site (e.g. `/en/challenge-tracker/`, `/fr/suivi-defi/`), no backend:

- **21-day checklist** — daily "action done?" checkbox; the unbroken-chain visual (3×7 grid of boxes filling in).
- **Daily micro-log** — breakage (None/A little/A lot), ends feel, protected-last-night Y/N, one-word note — mirroring the printable tracker's columns.
- **Milestones** — Day 7 / 14 / 21 markers prompting the wash-day breakage photo.
- **Photo-comparison prompts** — at each milestone, a reminder + an `<input type="file">` to view two photos side by side *in the browser only* (preview, never uploaded).
- **Persistence** — everything in `localStorage`. No account, no server, no PII leaving the device.
- **Restart clause** built in — "resume where you left off," never reset progress.
- One JSON-shaped state object; a "reset challenge" button.

### Value-add
- Genuinely on-strategy: the product's core IP *is* the accountability cadence and the unbroken chain. A live, self-saving checklist is a stronger habit loop than a PDF you must print.
- Differentiator and a low-friction graduation surface — the Day-21 screen is a natural place to drop the flagship CTA.
- Fits the brand's existing "interactive tools" shelf (CoilCareAI, hydracheck, etc.) — same static, client-only pattern, so it is consistent with how we already build.

### Effort estimate
- **~1–1.5 days** for a clean bilingual v1: one HTML page, one CSS file, one JS file (state + localStorage + render), reusing existing site chrome/brand kit. Photo side-by-side preview is the only fiddly part and is still just `FileReader` + two `<img>`.
- Plus ~half a day to run it through the SEO pipeline as a single indexable utility URL (canonical + meta, **not** keyword-split — same decision already made for the other tools per the SEO memo).

### Recommendation: **DEFER past v1 launch.** Ship the PDF/email launch first.
Reasons:
1. The PDF tracker fully delivers the promised transformation today. The web app is a *nicer* tracker, not a *missing* one — launch is not blocked.
2. Launch risk should be concentrated on the offer, sales page, and ad creative, not on shipping new (even if simple) interactive code the same week.
3. It is a clean, self-contained fast-follow: build it in the week *after* launch once real buyers exist, then A/B whether it lifts Day-21 completion (and therefore flagship conversion). That sequencing also tells us if it is worth the maintenance.

So: **defer to a fast-follow, not a never.** It is the right next build *if* launch validates demand.

---

## 3. Small automation worth adding now — the HTML→PDF build script

**Yes — add this now.** It is the one piece of automation with clear, recurring payoff: every future product and every FR translation will need PDFs regenerated, and hand-exporting from a browser drifts (different margins, stray headers/footers, inconsistent page size). A committed script makes regeneration deterministic.

**Created:** `products/21-day-breakage-challenge/dist/build-pdf.sh`
- Loops over `workbook.html` and `tracker.html` in its own folder, emitting `workbook.pdf` / `tracker.pdf`.
- Uses the validated command: `chrome --headless=new --disable-gpu --no-pdf-header-footer --print-to-pdf=out.pdf file:///in.html`.
- Verifies each output is non-empty (Chrome can exit 0 yet write nothing) and exits non-zero on any failure.
- Reusable: to add an FR variant or a new product's files, add the base name to the `FILES=(…)` array — nothing else changes.
- **Smoke-tested on this machine:** both PDFs written, ~23 KB each, exit 0. (The `DEPRECATED_ENDPOINT` GCM line Chrome prints is benign network noise, not a build error.)

No npm, no extra dependency — it leans on the Chrome that is already installed. That is the entire intended scope; do not grow it into a build system.

---

## 4. Risks, maintenance liabilities, and what to NOT build

### What to explicitly NOT build
- **No backend / database / auth** for the tracker or for log-based email triggering. Use fixed-interval ESP nudges for the recovery email.
- **No custom checkout, cart, license-key system, or payment code.** Selar owns commerce. Re-implementing it is pure liability.
- **No custom email-sending infrastructure.** The ESP owns delivery, unsubscribes, and deliverability/compliance — all things that are painful to own solo.
- **No native/mobile app, no PWA, no login portal** for what is a 21-day single-use checklist.
- **No analytics platform of our own.** If completion tracking is wanted later, it is an event in the existing analytics/AdSense setup, not a new service.

### Maintenance liabilities for a solo operator
- **The tracker web app (if/when built) is the only ongoing-maintenance surface.** Mitigate by keeping it 100% client-side: no server to patch, no DB to back up, no PII to safeguard, no GDPR data-subject obligations (localStorage stays on the user's device — call this out in the page copy and privacy policy).
- **Bilingual drift** is the real recurring cost across the whole brand: every asset (PDFs, sales page, emails, tracker) exists twice. The build script reduces PDF drift; keep FR/EN content edits paired in the same commit.
- **Pipeline fragility, already documented:** when adding the sales page (and any tracker page) to the pre-render pipeline, force UTF-8 in lxml or French accents double-encode; and never `git checkout/reset` blindly — the working tree runs ahead of HEAD. (See memory notes.)
- **External dependencies you do not control:** Selar checkout/delivery, ESP automation, and Chrome's headless flags. Low risk, but the PDF script pins the one we own; if a Chrome update ever changes a flag, the script's non-empty check will catch it loudly.

### Bottom line
Launch is a **content + configuration** job, not a software job. Build exactly one thing now — the PDF script (done). Defer the tracker web app to a validated fast-follow. Build nothing else.
