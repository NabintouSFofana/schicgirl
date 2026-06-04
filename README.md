# Schicgirl™

Source code for the Schicgirl natural hair brand. Six live products, one Amazon
affiliate page, all hand-written HTML/CSS/JS.

Live: https://schicgirl.me/
---

## What's in here

The project is organised as **pairs**: a public-facing page your audience sees,
and a private `*_admin.html` page where you manage its content or leads. Each
admin is password-gated (SHA-256 hashed password + login rate limit).

| Public page | Admin page | What it does |
|---|---|---|
| `index.html` | `admin.html` | Link-in-bio landing page (brand, gifts, tools, Amazon, reviews, social, footer) and its content editor |
| `products.html` | `products_admin.html` | Bilingual Amazon affiliate mini-site (picks by porosity + DIY ingredient library) and its product editor |
| `schicchat.html` | `schicchat_admin.html` | Bilingual hair-diagnostic chatbot and its leads dashboard |
| `hydracheck.html` | `hydracheck_admin.html` | Hair-hydration diagnostic and its leads dashboard |
| `consultation.html` | `consultation_admin.html` | Consultation booking page and its bookings dashboard |
| `logo.png` | — | Brand logo |

---

## How the pages get their data

Different pages use different storage, depending on what they need:

- **`index.html` / `admin.html`** — the editor manages the site content and
  publishes it as `site.json`; the public page renders from that data.
- **`products.html` / `products_admin.html`** — the editor manages products,
  DIY ingredients, copy, and the Amazon affiliate tag, then **publishes
  directly to GitHub** as `amazon-data.json`. The public page fetches that file
  on load. (See *Publishing the Amazon page* below.)
- **`schicchat.html` / `schicchat_admin.html`** — diagnostics are logged to a
  **Google Sheet** via a Google Apps Script web-app endpoint; the admin reads
  back from the same sheet (charts, search, filter, CSV export, PDF print).
- **`hydracheck` / `consultation`** — leads and bookings are stored in the
  browser's `localStorage`, with JSON backup/restore so you can move data
  between devices.

> There is **no AI API** in this project. The chatbot is a guided,
> rule-based diagnostic that logs answers to a spreadsheet — not a language model.

---

## Publishing the Amazon page (one-time setup)

`products_admin.html` can write changes straight to your repository, so you edit
in the forms and click **🌐 Publier sur le site** — no downloading or moving
files.

1. **Create a GitHub token.** On GitHub: *Settings → Developer settings →
   Personal access tokens → Fine-grained tokens → Generate new token*.
   - Repository access: **only** the repo that holds this site.
   - Permissions: **Contents → Read and write** (that's the only one needed).
   - Set an expiration date and copy the token (shown once; starts with
     `github_pat_`).
2. **Enter it once in the admin.** Open *⚙️ Réglages de publication (GitHub)*,
   fill in owner, repo, branch (`main`), path (`amazon-data.json`), and paste
   the token. Click **Enregistrer**, then **Tester la connexion**.
3. **From then on**, just edit and click *Publier*. The live page updates within
   about a minute.

The token is stored only in that browser's local storage — never in the source
and never committed. Don't set this up on a shared computer; if a token leaks,
delete it on GitHub and generate a new one. A **↓ Télécharger le JSON** button
remains as a manual fallback.

---

## Bilingual (FR / EN)

Most public pages have a language toggle. Both translations live on the same
element as `data-en` and `data-fr` attributes, so there's only ever one piece of
markup to keep in sync and the switcher is a few lines of JS.

---

## Admin features

`consultation_admin.html` and `hydracheck_admin.html` share the same toolkit:

- Login with a SHA-256 hashed password + attempt-limited rate guard
- Stat cards (total / new / contacted / paid / last 30 days)
- 30-day daily activity chart (plain CSS bars, no charting library)
- Search across name, contact, problem, country, and notes
- Status filter (new / contacted / paid / done / cancelled) and sortable columns
- Per-row view / edit / delete, plus an edit modal with a private-notes field
- Manual-add (for bookings or diagnostics that came in via DM or WhatsApp)
- Detail modal with a copy-message button that pre-fills a follow-up template
- CSV export and JSON backup / restore
- A "danger zone" with an export-first delete flow

`schicchat_admin.html` adds Google-Sheets-backed reporting on top of the same UI.

---

## Why no framework

Every page is one HTML file. No build step, no dependency tree, no version
mismatches — edit a file, refresh the tab, see the change. When something
breaks, it's dev tools, not a stack trace three layers deep.

The tradeoff is repetition: some CSS and helpers are duplicated across files.
That's a deliberate choice for a project of this size, to be consolidated only
if it ever actually hurts.

---

## Running locally

Open any public page directly in a browser to preview it. Two caveats:

- Pages that **fetch** a data file (e.g. `products.html` loading
  `amazon-data.json`) need to be served over `http://`, not opened as a
  `file://` path, or the browser will block the request. Any static server
  works:
  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000/products.html
  ```
- The GitHub publish feature and the Google Sheets logging require their
  respective setup (token / Apps Script URL) to function.

Deployment is just static hosting — push the files to GitHub Pages (or any
static host) and point your domain at it.

---

## License

MIT for the code. Everything brand-related (the Schicgirl name, logo, color
palette as used here, written copy) is mine — see `LICENSE`.

You can borrow the code. Don't borrow the brand.

---

[Nabintou S. Fofana](https://nabintousfofana.github.io/portfolio/) · 2024–present
