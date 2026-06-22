import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/i18n/config";
import { tx, type Post } from "@/lib/site";

export default function PostCard({ post, lang, minRead }: { post: Post; lang: Locale; minRead: string }) {
  return (
    <Link
      href={`/${lang}/blog/${post.slug}`}
      className="group overflow-hidden rounded-brand border border-stroke bg-cream/80 shadow-warm transition hover:-translate-y-1"
    >
      <div className="relative h-40 w-full bg-gold-pale">
        <Image src={post.img} alt="" fill sizes="(max-width:768px) 100vw, 33vw" className="object-cover object-[center_28%]" />
      </div>
      <div className="p-4">
        <span className="text-[11px] font-bold uppercase tracking-wide text-gold-deep">{tx(post.cat, lang)}</span>
        <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-ink group-hover:text-gold-deep">
          {tx(post.title, lang)}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">{tx(post.excerpt, lang)}</p>
        <p className="mt-2 text-xs text-muted">
          {post.read} {minRead}
        </p>
      </div>
    </Link>
  );
}
