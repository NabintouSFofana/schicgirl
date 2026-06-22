import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

export default function Footer({ lang }: { lang: Locale }) {
  const d = getDict(lang);
  const links = [
    { href: `/${lang}`, label: d.nav.home },
    { href: `/${lang}/about`, label: d.nav.about },
    { href: `/${lang}/blog`, label: d.nav.blog },
    { href: `/${lang}/contact`, label: d.nav.contact },
  ];
  return (
    <footer className="mx-auto mt-16 max-w-5xl px-5 pb-12 text-center">
      <div className="mx-auto mb-5 h-px w-24 bg-gold/30" />
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-medium text-ink-soft">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="hover:text-gold-deep">
            {l.label}
          </Link>
        ))}
      </nav>
      <p className="mt-4 text-xs text-muted">{d.footer.rights}</p>
    </footer>
  );
}
