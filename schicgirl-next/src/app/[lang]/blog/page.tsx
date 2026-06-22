import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { POSTS } from "@/lib/site";
import PostCard from "@/components/PostCard";

export default function Blog({ params }: { params: { lang: Locale } }) {
  const lang = params.lang;
  const d = getDict(lang);
  return (
    <div className="mx-auto max-w-5xl px-5">
      <section className="py-10 text-center">
        <span className="eyebrow">{d.blog.eyebrow}</span>
        <h1 className="h-serif mt-3 text-4xl sm:text-5xl">
          {d.blog.title} <span className="italic text-gold-deep">{d.blog.titleAccent}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-ink-soft">{d.blog.lead}</p>
      </section>
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((p) => (
          <PostCard key={p.slug} post={p} lang={lang} minRead={d.blog.minRead} />
        ))}
      </section>
    </div>
  );
}
