import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";
import { POSTS, ARTICLE_PROMO, postIndex, tx } from "@/lib/site";
import { ARTICLES } from "@/lib/articles";

export function generateStaticParams() {
  return locales.flatMap((lang) => POSTS.map((p) => ({ lang, slug: p.slug })));
}

export function generateMetadata({ params }: { params: { lang: Locale; slug: string } }): Metadata {
  const post = POSTS.find((p) => p.slug === params.slug);
  if (!post) return {};
  return { title: `${tx(post.title, params.lang)} | Schicgirl`, description: tx(post.excerpt, params.lang) };
}

export default function Article({ params }: { params: { lang: Locale; slug: string } }) {
  const { lang, slug } = params;
  const post = POSTS.find((p) => p.slug === slug);
  const body = ARTICLES[slug];
  if (!post || !body) notFound();

  const d = getDict(lang);
  const promo = ARTICLE_PROMO[slug];
  const idx = postIndex(slug);
  const next = POSTS[idx + 1];

  return (
    <article className="mx-auto max-w-2xl px-5">
      <div className="py-6">
        <Link href={`/${lang}/blog`} className="text-sm font-semibold text-gold-deep hover:underline">
          {d.blog.back}
        </Link>
      </div>

      <header className="text-center">
        <span className="eyebrow">{tx(post.cat, lang)}</span>
        <h1 className="h-serif mt-3 text-4xl">{tx(post.title, lang)}</h1>
        <p className="mt-3 text-lg text-ink-soft">{tx(post.excerpt, lang)}</p>
        <p className="mt-2 text-xs text-muted">
          Schicgirl · {post.read} {d.blog.minRead}
        </p>
      </header>

      <div className="relative mt-6 h-72 w-full overflow-hidden rounded-brand bg-gold-pale shadow-warm">
        <Image src={post.img} alt={tx(post.title, lang)} fill sizes="(max-width:768px) 100vw, 700px" className="object-cover object-[center_28%]" priority />
      </div>

      <div
        className="prose-article mt-8"
        dangerouslySetInnerHTML={{ __html: lang === "fr" ? body.fr : body.en }}
      />

      {promo && (
        <section className="card mt-10 text-center">
          <div className="eyebrow">{lang === "fr" ? "L'ebook recommandé" : "Recommended ebook"}</div>
          <h2 className="h-serif mt-1 text-2xl">{tx(promo.title, lang)}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">{tx(promo.desc, lang)}</p>
          <a
            className="btn mt-4"
            href={lang === "fr" ? promo.urlFr : promo.urlEn}
            target="_blank"
            rel="noopener noreferrer"
          >
            {tx(promo.cta, lang)}
          </a>
        </section>
      )}

      {next && (
        <p className="mt-8 text-center">
          <Link href={`/${lang}/blog/${next.slug}`} className="text-sm font-semibold text-gold-deep hover:underline">
            {lang === "fr" ? "Article suivant" : "Next article"} : {tx(next.title, lang)} →
          </Link>
        </p>
      )}
    </article>
  );
}
