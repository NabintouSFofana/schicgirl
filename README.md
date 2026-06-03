# Schicgirl™

Source code for the Schicgirl natural hair brand. Six live products, one Amazon
affiliate page, all hand-written HTML/CSS/JS.

Live: https://link.schicgirl.me/

## Files

- **`index_link_in_bio.html`** — public link-in-bio page
- **`index_link_in_bio_admin.html`** — full content editor (Brand, Hero, Gifts,
  Shop, Tools, Amazon, Reviews, Social, Footer, Clicks, Visits, Settings)
- **`index_CoilCareAI.html`** — chat assistant. Uses the Anthropic Claude API.
  Users bring their own API key; it stays in their browser.
- **`index_hydracheck.html`** — hair hydration diagnostic
- **`index_hydracheck_admin.html`** — leads dashboard (search, filter,
  edit, delete, status tags, notes, stats, backup/restore)
- **`index_schicchat.html`** — bilingual hair diagnostic chatbot
- **`index_schicchat_admin.html`** — leads dashboard backed by Google Sheets
  (charts, search, filter, CSV export, PDF print)
- **`index_consultation.html`** — booking page
- **`index_consultation_admin.html`** — bookings dashboard (search, filter,
  edit, delete, status tags, notes, stats, backup/restore, manual add)
- **`schicgirl_amazon_affiliate_minisite_bilingual.html`** — Amazon affiliate page
- **`index_amazon_admin.html`** — Amazon page editor (manage products,
  DIY ingredients, copy, and affiliate tag — outputs `amazon-data.json`)
- **`logo.png`**

## Why no framework

Every page is one HTML file. No build step, no `node_modules`, no version
mismatches. I can edit a file, refresh the tab, and see what changed. When
something breaks I open dev tools, not a stack trace from three layers down.

The tradeoff is repetition — some CSS is duplicated across files. I'll
consolidate when it actually hurts.

## Bilingual (FR/EN)

Most user-facing pages have a language toggle. The two translations live on
the same elements as `data-en` and `data-fr` attributes — there's only ever
one HTML to keep in sync, and the language switcher is ~10 lines of JS.

## Admin pages — what each one does

**Consultation admin** and **HydraCheck admin** share the same feature set:

- Login with a SHA-256 hashed password + 5-attempt rate limit
- 5 stat cards (Total / Nouvelles / Contactées / Payées / 30 derniers jours)
- 30-day daily chart (CSS bars, no library)
- Search across name, contact, problem, country, notes
- Status filter (new / contacted / paid / done / cancelled)
- Sortable columns
- Per-row Voir / Edit / Delete buttons
- Edit modal with all fields + private notes textarea
- Manual-add button (for bookings/diagnostics that came through DM/WhatsApp)
- Detail modal with copy-message button (pre-fills a follow-up template)
- CSV export
- JSON backup + restore (so you can move data between devices)
- "Zone sensible" with safer-delete flow (export first)

**SchicChat admin** is read-from-Google-Sheets — it shows leads collected by
the diagnostic chatbot, with charts, search, filter, CSV export, and PDF
printing. It already had most of the consistent feature set before I
touched it.

**Link-in-bio admin** is a full content editor for the public link-in-bio
page. It has 13 tabs (Analytics, Brand, Hero, Gifts, Shop, Tools, Amazon,
Reviews, Social, Footer, Clicks, Visits, Settings). You can change every
visible element on the public page without touching code.

## Email notifications when someone books

The consultation page can send you an email every time a new booking
comes in. To enable it:

1. Open `index_consultation.html`
2. Find this line (near the top of the `<script>`):
   ```js
   const FORWARD_EMAIL = "";
   ```
3. Replace `""` with your email, e.g.:
   ```js
   const FORWARD_EMAIL = "you@example.com";
   ```
4. Save and re-deploy.

The first booking will trigger one confirmation email from Formsubmit
(it's a one-time thing — just click the link). After that, every new
booking sends you an email automatically with all the details formatted
as a nice table.

If the email fails for any reason, the booking still saves to the admin
dashboard and the user still gets redirected to payment. No blocking.

## Amazon admin — how the publish flow works

The Amazon affiliate page works a bit differently from the others. It has
*lots* of editable content (products, DIY items, copy, affiliate tag),
which would be a nightmare to edit in raw HTML. So:

- **`index_amazon_admin.html`** is where you edit everything
- When you click "🚀 Télécharger amazon-data.json", it downloads a single
  file with all your changes
- You **replace `amazon-data.json` on your site** with the new one
- The public Amazon page fetches that JSON on load and uses your data

If `amazon-data.json` doesn't exist yet (initial deploy), the public page
falls back to the 17 products and 10 DIY items hardcoded inside it — so
the site is never broken, just shows the default content.

The admin manages:

- **Products tab** — search, filter by porosity, edit/delete each product
  (Modifier opens a modal with all bilingual EN/FR fields), add new.
  Every product can have a **product image**, either by URL (Amazon,
  Cloudinary, anywhere) or by uploading a file from your computer.
- **DIY tab** — same pattern for the ingredient library, also with image
  per ingredient.
- **Textes tab** — edit hero title, hero subtitle, "Start Here" intro,
  affiliate disclosure (all bilingual)
- **Réglages tab** — set your Amazon Associates tag once; it gets applied
  to every product URL automatically at publish time. Also has full
  JSON backup/restore and reset-to-defaults.

### Product images — two ways

When editing a product, you have a choice:

1. **Paste an image URL** (preferred). Right-click any Amazon product
   image, copy address, paste. Lightweight, served from Amazon's CDN, no
   bloat to your `amazon-data.json`. Note that Amazon may block hotlinking
   from some domains; if the image doesn't show on your live site, host
   it elsewhere (Cloudinary, ImgBB, your own server) and use that URL.

2. **Upload a file** (when you have custom imagery). Click "📁 Ou
   télécharger un fichier", pick a file from your computer. It gets
   converted to a base64 data URI and embedded directly in
   `amazon-data.json`. Easy, but each upload adds ~140% of the file size
   to your data file. The admin warns you if any image is bigger than
   200 KB.

If an image fails to load on the public page (broken URL, hotlink block,
network issue), the card automatically falls back to the original emoji
icon. Your site never shows a broken image box.

## A note on auth

Admin pages use SHA-256 hashed passwords with a 5-attempt rate limit,
stored in `sessionStorage`. This is a **deterrent**. Anyone who knows
what dev tools are can still bypass it. Don't put real customer data
behind this without a real backend.

When I migrate, I'll start with the consultation admin (it has actual
booking info) and use Cloudflare Pages Functions. Everything else can
wait.

## CoilCare AI key

CoilCare AI talks to `api.anthropic.com` directly from the browser. The
user pastes their own key into the UI, it's saved to their
`localStorage`, and the request includes the
`anthropic-dangerous-direct-browser-access` header.

I don't have a server, so I don't have anyone's key. If you fork this,
get a key at console.anthropic.com.

## Data storage

All admin data (bookings, diagnostics, link-in-bio content) lives in
`localStorage` on the device where you log in. This means:

- ✅ Free, no backend needed
- ❌ If you use the admin from your phone and your laptop, the two won't sync
- ❌ Clearing browser data wipes everything

Use the **Sauvegarde JSON** button regularly to download a backup. You can
restore from a backup with the **Restaurer JSON** button on the same device,
or move data between devices by exporting on one and importing on the other.

## License

MIT for the code. Everything brand-related (the Schicgirl name, logo, color
palette as used here, written copy) is mine — see `LICENSE`.

You can borrow the code. Don't borrow the brand.

---

[Nabintou S. Fofana](https://nabintousfofana.github.io/portfolio/) · 2024–present
