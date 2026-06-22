# Stop the Breakage — A 21-Day Length Retention Challenge

A Schicgirl behavior-change product for Type 4 (4A/4B/4C) women whose hair grows from the
scalp but breaks at the ends, so it never seems to get longer.

Built end-to-end by the Schicgirl 7-agent publishing team.

## The honest promise (locked — do not overstate)
- **The win:** reduced breakage (less hair in the comb, fewer snapped ends, smaller wash-day pile)
  + a 5-minute routine that sticks.
- **NOT promised:** length gain in 21 days. Hair grows ~1–1.5 cm/month from the follicle no
  matter what. This challenge changes how much of that growth you **keep**.

## What this product is
A digital **action workbook** (do-this-today, not theory) + a **retention tracker** +
a **6-email accountability sequence**. Net-new IP = the 21-day protocol, the tracker, and the
accountability cadence. All deeper "why" is referenced to the paid **Grow** ebook.

## Product ladder placement
Activation layer beside the **Grow** ebook.
- Entry buyer → **Grow** ebook (the full why + system)
- Day-21 graduate → **Type 4 Hair Routine System** (flagship)

## Files in this project

**Content & marketing (Publishing division)**
| File | What it is | Built by |
|---|---|---|
| [01-strategy-and-concept.md](01-strategy-and-concept.md) | CEO verdict + concept brief + content-ownership map | Brand CEO, Product Creator |
| [02-workbook.md](02-workbook.md) | Full workbook content — all 21 daily pages, verified | Ebook Architect + Hair Expert |
| [03-tracker.md](03-tracker.md) | The printable retention tracker | Ebook Architect |
| [04-sales-page.md](04-sales-page.md) | Full sales/landing page copy | Copywriter |
| [05-email-sequence.md](05-email-sequence.md) | All 6 accountability emails | Copywriter |
| [06-design-briefs.md](06-design-briefs.md) | Brand kit + 9 Canva briefs | Canva Director |
| [07-facebook-launch.md](07-facebook-launch.md) | Posts, reels, hooks + 3-day plan | FB Growth Mgr |

**Production & launch (new division)**
| File | What it is | Built by |
|---|---|---|
| [08-automation-setup.md](08-automation-setup.md) | Selar + ESP + analytics + consent setup runbook | Marketing-Ops |
| [09-tech-assessment.md](09-tech-assessment.md) | Build-vs-buy; defer interactive tracker to v2 | Software Eng |
| [10-LAUNCH-RUNBOOK.md](10-LAUNCH-RUNBOOK.md) | **Master go-live runbook + QA gates + Go/No-Go** | Launch Manager |
| `dist/workbook.html` · `dist/workbook.pdf` | The downloadable workbook (HTML + PDF) | Document Producer |
| `dist/tracker.html` · `dist/tracker.pdf` | The downloadable tracker (HTML + PDF) | Document Producer |
| `dist/build-pdf.sh` | Reusable HTML→PDF script (for FR + future products) | Software Eng |
| `en/21-day-breakage-challenge/index.html` | Live sales/opt-in page (EN) | Web Developer |
| `fr/defi-anti-casse-21-jours/index.html` | Live sales/opt-in page (FR) | Web Developer |

## Build status
- [x] Strategy, concept, workbook, tracker, sales copy, emails, design briefs, FB content
- [x] **Workbook + Tracker produced as HTML + PDF (EN)**
- [x] **Sales/opt-in pages built (EN + FR)**
- [x] **Automation, tech, and master launch runbooks written**
- [ ] **BLOCKER:** FR PDFs (translate content → re-run `dist/build-pdf.sh`)
- [ ] **BLOCKER:** Create the 2 Selar products + replace CTA placeholder URLs
- [ ] **BLOCKER:** Wire ESP automations (FR + EN)
- [ ] Produce the 9 graphics in Canva (briefs in 06)
- [ ] Wire `→ Grow p.X` anchors once Grow pagination is final

➡️ **Current go-live verdict: NO-GO** until the 3 blockers clear. See [10-LAUNCH-RUNBOOK.md](10-LAUNCH-RUNBOOK.md).
