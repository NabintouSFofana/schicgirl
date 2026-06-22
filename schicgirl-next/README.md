# Schicgirl — Next.js (React + TypeScript)

Bilingual (FR/EN) natural-hair **content + commerce** platform for Type 4 hair, rebuilt
from a static multi-page site into a modern, server-rendered React app.

## Stack
- **Next.js 14** (App Router) + **React 18**
- **TypeScript** (strict)
- **Tailwind CSS** (brand design tokens in `tailwind.config.ts`)
- **i18n**: locale-segmented routes (`/fr`, `/en`) with `generateStaticParams` → fully static, SEO-friendly HTML
- **next/font** (Cormorant Garamond + Jost) — self-hosted, no layout shift

## Why this architecture
This is a content/affiliate/AdSense site, so pages are pre-rendered to **static HTML (SSG)** —
search engines and ad crawlers see real content, not an empty SPA shell.

## Run it
```bash
cd schicgirl-next
npm install
npm run dev      # http://localhost:3000
# or production:
npm run build && npm run start
```

> Note: `.npmrc` sets `strict-ssl=false` only to work around a local TLS-interception
> proxy. On a normal network you can delete that line.

## Structure
```
src/
  app/
    layout.tsx              # root: fonts, <html>
    page.tsx               # / → redirects to /fr
    [lang]/
      layout.tsx           # header + footer, generateStaticParams (fr/en)
      page.tsx             # home (hero, ebooks, tools)
      blog/page.tsx        # blog index
      contact/page.tsx     # contact + FAQ
  components/              # Header, Footer, LangToggle, EbookCard, PostCard
  i18n/                    # config + FR/EN dictionaries
  lib/site.ts             # data: ebooks, tools, blog posts (single source of truth)
public/assets/            # images
```

## Migration status
Ported from the original static site:
- [x] Home (hero, ebook grid, premium tools)
- [x] Blog index (bilingual cards + images)
- [x] Contact (email/Facebook + FAQ)
- [x] Bilingual routing, theme, fonts, shared layout
- [x] Blog **article** pages (all 8, FR+EN) with per-article ebook promo + next-article nav
- [x] **Planner sales page** (`/[lang]/planner`) with language-aware Selar checkout (studio-fr / studio-en)

Next up:
- [ ] About + legal pages (privacy, terms)
- [ ] Studio / SchicChat / CoilCare / admin (port to React components or mount the existing apps)
- [ ] Move Supabase writes to Route Handlers / Server Actions (hide keys, enforce RLS)
- [ ] Deploy on Vercel
```
