"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

export default function LangToggle({ current }: { current: Locale }) {
  const pathname = usePathname() || "/fr";
  const rest = pathname.replace(/^\/(fr|en)/, "") || "";

  return (
    <div className="inline-flex gap-0.5 rounded-full bg-gold/10 p-[3px]">
      {locales.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          aria-current={l === current ? "true" : undefined}
          className={`rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide transition ${
            l === current ? "bg-gold text-white shadow" : "text-muted hover:text-ink"
          }`}
        >
          {l === "fr" ? "🇫🇷 FR" : "🇬🇧 EN"}
        </Link>
      ))}
    </div>
  );
}
