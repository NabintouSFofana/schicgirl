# Astuces & Conseils pour Cheveux Naturels Type 4 — Ebook

A Schicgirl educational ebook for Type 4 (4A/4B/4C) women: how to understand, moisturise
and **retain** their hair. Bilingual (FR + EN), delivered as self-contained HTML + print-ready PDF.

## The honest promise (locked — do not overstate)
- **The win:** clear understanding + a routine that fits, less breakage, more retained length.
- **NOT promised:** faster growth. Hair grows ~1–1.5 cm/month from the follicle for everyone.
  This ebook changes how much of that growth you **keep**.

## What's inside (12 chapters)
1. Understanding Type 4 (4A/4B/4C, why it's dry)
2. Know YOUR hair — porosity / density / texture tests
3. The 12 golden tips
4. Real moisture — LOC / LCO by porosity
5. Wash day, step by step
6. Detangling without breakage
7. Protection & night routine
8. **Build & adjust your routine** (6-step method + a signal→adjustment table)
9. **Porosity calendars** — full week-by-week for LOW / MEDIUM / HIGH porosity + monthly cadence
10. Ingredients: choose / avoid (honest, nuanced)
11. Myths & common mistakes
12. Printable cheat card

## Files
| File | What it is |
|---|---|
| `dist/ebook-fr.html` · `dist/ebook-fr.pdf` | French ebook (HTML + PDF, 32 pp) |
| `dist/ebook-en.html` · `dist/ebook-en.pdf` | English ebook (HTML + PDF, 32 pp) |
| `dist/build-pdf.sh` | Reusable Chrome-headless HTML→PDF builder |

## Cover
The cover is designed **into** the HTML (rendered as page 1 of each PDF) — Playfair Display
title, cream/rose gradient, an inline-SVG coil ornament (no external image, no emoji so it
renders identically in browser and PDF).

## Rebuilding the PDFs
From Git Bash on this machine:
```bash
cd dist
bash build-pdf.sh
```
The script uses the validated Chrome path and `cygpath -m` to hand Chrome a real Windows
`file:///C:/...` URL (a plain `/c/...` Git-Bash path makes Chrome render an ERR_FILE_NOT_FOUND
page instead of the ebook — that's the one gotcha).

## Design system
Matches the Schicgirl kit: Playfair Display + Mulish, palette `--cream #FDF8F2`, `--sand #F5E5D5`,
`--ink #2D1A0E`, `--gold #C9934A`, `--rose-d #C47A65`. Porosity accent colours: low `#7A6BA8`,
medium `#3A6B4C`, high `#C47A65`.

**Premium/editorial styling (v2):**
- Full-page dark espresso chapter dividers with gold glow, decorative rings and a ruled label.
- Gold drop caps on chapter lead paragraphs; gradient-underlined section headings.
- Cards with a gold/rose accent bar + soft shadow; green "note" and clay "warn" callouts.
- Circular gradient badges for the 12 tips and the 6-step routine method (with a timeline line).
- Rounded, zebra-striped tables; porosity calendars use a colour-matched header + tinted day column.
- Gradient porosity pills. All decorative art is inline SVG/CSS — no external images, no emoji.

## Status
- [x] FR + EN content written (science vetted against the honest-promise rule)
- [x] Porosity calendars (low/medium/high) + routine build/adjust chapters
- [x] HTML + PDF produced for both languages, page counts verified
- [ ] Optional: live sales/opt-in page (EN + FR) if this is sold rather than used as a lead magnet
- [ ] Optional: Selar product + delivery wiring
