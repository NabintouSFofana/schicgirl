import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import LangToggle from "./LangToggle";

export default function Header({ lang }: { lang: Locale }) {
  const d = getDict(lang);
  const nav = [
    { href: `/${lang}`, label: d.nav.home },
    { href: `/${lang}/blog`, label: d.nav.blog },
    { href: `/${lang}/products`, label: d.nav.products },
    { href: `/${lang}/contact`, label: d.nav.contact },
  ];
  return (
    <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
      <Link href={`/${lang}`} className="font-serif text-xl font-semibold text-ink">
        Schic<span className="italic text-gold-deep">girl</span>
      </Link>
      <nav className="hidden items-center gap-5 text-sm font-medium text-ink-soft sm:flex">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className="hover:text-gold-deep">
            {n.label}
          </Link>
        ))}
      </nav>
      <LangToggle current={lang} />
    </header>
  );
}
