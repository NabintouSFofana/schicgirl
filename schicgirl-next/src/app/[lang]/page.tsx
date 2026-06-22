import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { EBOOKS, TOOLS, SHOP_URL, tx } from "@/lib/site";
import EbookCard from "@/components/EbookCard";

export default function Home({ params }: { params: { lang: Locale } }) {
  const lang = params.lang;
  const d = getDict(lang);

  return (
    <div className="mx-auto max-w-5xl px-5">
      {/* Hero */}
      <section className="py-12 text-center">
        <span className="eyebrow">{d.home.eyebrow}</span>
        <h1 className="h-serif mx-auto mt-3 max-w-3xl text-4xl sm:text-5xl">
          {d.home.title} <span className="italic text-gold-deep">{d.home.titleAccent}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">{d.home.lead}</p>
      </section>

      {/* Ebooks */}
      <section className="card">
        <div className="eyebrow">{d.home.shopEyebrow}</div>
        <h2 className="h-serif mt-1 text-2xl">{d.home.shopTitle}</h2>
        <p className="mt-1 text-sm text-ink-soft">{d.home.shopDesc}</p>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {EBOOKS.map((e) => (
            <EbookCard key={e.id} ebook={e} lang={lang} cta={d.home.discover} />
          ))}
        </div>
        <div className="mt-6 text-center">
          <a className="btn" href={SHOP_URL} target="_blank" rel="noopener noreferrer">
            {d.home.shopCta}
          </a>
        </div>
      </section>

      {/* Tools */}
      <section className="card mt-6">
        <h2 className="h-serif text-2xl">{d.home.toolsTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <a
              key={t.id}
              href={t.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-2xl border border-stroke bg-cream/70 p-4 transition hover:border-gold-lt"
            >
              <span className="text-2xl">{t.emoji}</span>
              <span>
                <span className="block font-semibold text-ink">{tx(t.title, lang)}</span>
                <span className="block text-sm text-ink-soft">{tx(t.sub, lang)}</span>
              </span>
              <span className="ml-auto text-sm font-semibold text-gold-deep">{d.home.open} →</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
