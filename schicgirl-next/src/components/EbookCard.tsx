import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { tx, type Ebook } from "@/lib/site";

export default function EbookCard({ ebook, lang, cta }: { ebook: Ebook; lang: Locale; cta: string }) {
  const href = ebook.page ? `/${lang}/${ebook.page}` : ebook.url || "#";
  const external = !ebook.page;
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex flex-col rounded-brand border border-stroke bg-cream/80 p-4 shadow-warm transition hover:-translate-y-1 hover:border-gold-lt"
    >
      <div className="relative mb-3 flex h-28 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-pale to-gold/25 text-4xl">
        <span>{ebook.emoji}</span>
        {ebook.badge && (
          <span className="absolute right-2 top-2 rounded-full bg-gold-deep px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {tx(ebook.badge, lang)}
          </span>
        )}
      </div>
      <h3 className="font-serif text-lg font-semibold text-ink">{tx(ebook.title, lang)}</h3>
      <p className="mt-1 flex-1 text-sm text-ink-soft">{tx(ebook.desc, lang)}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-serif text-lg font-semibold text-gold-deep">
          {tx(ebook.price, lang)}
          {lang === "fr" && ebook.cfa ? <span className="ml-1 text-xs text-muted">{ebook.cfa}</span> : null}
        </span>
        <span className="text-sm font-semibold text-gold-deep group-hover:underline">{cta} →</span>
      </div>
    </Link>
  );
}
