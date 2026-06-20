# Schicgirl™
<img width="702" height="732" alt="image" src="https://github.com/user-attachments/assets/de5e6c4e-a8a2-4a15-a32e-0a666561ab29" />

A complete, bilingual (🇫🇷 / 🇬🇧) digital storefront and toolset for a Type 4 natural-hair brand — built as hand-written HTML/CSS/JavaScript, with no framework and no build step.

**Live:** https://schicgirl.me 
> Every page is a single, self-contained `.html` file. Open it, refresh the tab, see the change. The whole site deploys as static files, yet it still does real work: lead capture, booking, an AI hair assistant, diagnostics, and a bilingual product catalog.

---

## What this is

I build and maintain Schicgirl end-to-end as its **full-stack developer**. This repo is the full front end of the brand: the link-in-bio hub, six on-site sales pages, a freebie funnel with self-hosted PDF delivery, two diagnostic tools, a booking system, an AI assistant, and an Amazon affiliate mini-site. Each tool ships with a matching admin dashboard so leads and content can be managed without touching code.

It's intentionally low-tech: static files that host anywhere and edit in minutes.

---

## The apps

### Storefront & funnel
| File | What it does |
|---|---|
| `index.html` | Public link-in-bio hub — a numbered conversion ladder (free guide → tools → proof → shop). |
| `admin.html` | Visual editor for the link-in-bio: brand, hero, gifts, shop, tools, reviews, social, footer, plus click/visit analytics. |
| `toolkit-landing.html` | Landing page for the free "Type 4 Kit" lead magnet (email/WhatsApp capture). |
| `toolkit-landing_admin.html` | Subscriber dashboard for the freebie list. |
| `hydratee.html`, `pousse.html`, `pellicules.html`, `coiffures.html`, `stop-cheveux-secs.html`, `transition.html` | Six branded ebook sales pages, each with an interior preview and FR/EN toggle. |
| `pack-complet.html` | Sales page for the full 6-guide bundle. |

### Tools
| File | What it does |
|---|---|
| `CoilCareAI.html` | **CoilCare AI™** — a Type 4 hair assistant powered by the Anthropic Claude API. Users bring their own API key; it stays in their browser. |
| `hydracheck.html` | **HydraCheck** — a hair hydration/porosity diagnostic. |
| `hydracheck_admin.html` | Leads dashboard for HydraCheck (search, filter, edit, status tags, notes, stats, backup/restore). |
| `schicchat.html` | **SchicChat** — a bilingual hair-diagnostic chatbot. |
| `schicchat_admin.html` | Leads dashboard backed by Google Sheets (charts, search, filter, CSV export, print). |
| `products.html` | **Amazon affiliate mini-site** — trusted picks sorted by porosity, a 60-second porosity quiz, and a DIY ingredient library. Bilingual. |
| `products_admin.html` | Editor for the Amazon page (products, DIY items, copy, affiliate tag) with optional GitHub-API publishing. |

### Booking & reviews
| File | What it does |
|---|---|
| `consultation.html` | Hair-consultation booking page. |
| `consultation_admin.html` | Bookings dashboard (search, filter, edit, status tags, notes, stats, manual add). |
| `review.html` | "Leave a review" page; approved reviews surface on the link-in-bio. |

### Free guides (self-hosted PDFs)
| Path | What it does |
|---|---|
| `guides/` | The lead-magnet PDF library, served directly from the site after moving off Google Drive (quota limits). Four guides, each in FR + EN: the **Type 4 Hair Guide**, **Porosity Cheat Sheet**, **Hydration Checklist**, and **Wash-Day Checklist**. Stored under an unguessable subfolder so the files aren't trivially scrapeable. |

### Assets
| Path | What it does |
|---|---|
| `assets/` | Logos, favicons, ebook covers, gallery SVGs, product imagery, and page previews. |
| `logo.png`, `CNAME` | Brand logo and the custom-domain record (`schicgirl.me`) for GitHub Pages. |

---

## Stack

- **HTML, CSS, vanilla JavaScript** — no framework, no bundler, no `node_modules`.
- **Supabase** — stores and serves customer reviews (`index.html`, `review.html`).
- **Google Apps Script + Google Sheets** — a free serverless backend for signups and chat leads; the script is configured per deployment and kept out of the repo.
- **Anthropic Claude API** — powers the CoilCare AI assistant (key stays client-side).
- **GitHub Pages** — static hosting on the `schicgirl.me` custom domain, including the self-hosted guide PDFs.
- **localStorage** — drives the admin dashboards and analytics, with JSON backup/restore.

---

## Why no framework

Every page is one HTML file. No build step, no dependency tree, no version mismatches. I edit a file, refresh the tab, and see what changed; when something breaks I open dev tools, not a stack trace three layers down. It also means the whole site is portable — it runs on any static host (GitHub Pages, Netlify, a plain bucket).

The tradeoff is repetition: some CSS and markup is duplicated across files. I consolidate when it actually starts to hurt, not before.

---

## Bilingual (FR / EN)

The brand serves the French-speaking West African diaspora first, English second. Most user-facing pages ship a language toggle, with both translations stored inline (`data-fr` / `data-en` attributes or a `setLang()` switch) so there's no extra request and no flash of the wrong language.

---

## Architecture notes

- **Static front end, real backends.** The pages are static, but lead capture, reviews, and chat persistence run through Supabase and Google Apps Script — no server to maintain.
- **Every tool has an admin twin.** Public page collects; admin dashboard manages. Dashboards run on `localStorage` with JSON export/import so data is portable.
- **Customer data never ships.** `.gitignore` blocks every exported leads/bookings/subscribers JSON from being committed. `amazon-data.json` is the one data file tracked on purpose — it's the public product catalog the affiliate page loads at runtime.
- **Secrets stay out of the repo.** API keys and Supabase/Apps Script credentials are configured per deployment, never hard-committed.

---

## Running locally

No build step. Clone and serve the folder with any static server:

```bash
git clone https:///schicgirl.git
cd schicgirl
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

Pages that load assets or data files (covers, `amazon-data.json`) expect to be served over HTTP, so use a local server rather than opening the file directly — relative paths won't resolve from `file://`.

---

## License

Code is MIT. Brand, content, copy, and visual identity are **All Rights Reserved** — see [`LICENSE`](./LICENSE).

© 2024–2026 Schicgirl™

---

## About

Built and maintained by **Schicgirl** — software-engineering student and the full-stack developer behind Schicgirl™.
[Portfolio](https://schicgirl.me) · contacte.schicgirl@gmail.com
