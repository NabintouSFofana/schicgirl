import type { Locale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

const FAQ = {
  fr: [
    ["Je n'ai pas reçu mon ebook après l'achat", "Vérifie tes spams et l'email utilisé au paiement. Si rien sous 1 h, écris-nous avec ton numéro de commande."],
    ["Tu fais des consultations personnalisées ?", "Oui — écris-nous par email ou sur Facebook en précisant ton type de cheveux et ton souci principal."],
    ["Vous proposez des partenariats de marque ?", "On collabore uniquement avec des produits qu'on approuve vraiment. Écris-nous par email avec « Collaboration » en objet."],
  ],
  en: [
    ["I didn't receive my ebook after buying", "Check your spam folder and the email used at checkout. If nothing within 1 h, email us with your order number."],
    ["Do you do personalized consultations?", "Yes — reach out by email or on Facebook, mentioning your hair type and main concern."],
    ["Do you offer brand partnerships?", "We only partner with products we genuinely approve. Email us with “Collaboration” in the subject."],
  ],
} as const;

export default function Contact({ params }: { params: { lang: Locale } }) {
  const lang = params.lang;
  const d = getDict(lang);
  return (
    <div className="mx-auto max-w-2xl px-5">
      <section className="py-10 text-center">
        <span className="eyebrow">{d.contact.eyebrow}</span>
        <h1 className="h-serif mt-3 text-4xl sm:text-5xl">
          {d.contact.title} <span className="italic text-gold-deep">{d.contact.titleAccent}</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-ink-soft">{d.contact.lead}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        <a className="card flex items-center gap-3" href="mailto:contacte.schicgirl@gmail.com">
          <span className="text-2xl">✉️</span>
          <span>
            <span className="block font-semibold">{d.contact.email}</span>
            <span className="block text-sm text-ink-soft">contacte.schicgirl@gmail.com</span>
          </span>
        </a>
        <a className="card flex items-center gap-3" href="https://www.facebook.com/schicgirl" target="_blank" rel="noopener noreferrer">
          <span className="text-2xl">📘</span>
          <span>
            <span className="block font-semibold">{d.contact.facebook}</span>
            <span className="block text-sm text-ink-soft">@schicgirl</span>
          </span>
        </a>
      </section>

      <section className="mt-8">
        <h2 className="h-serif text-2xl">{d.contact.faqTitle}</h2>
        <dl className="mt-4 space-y-4">
          {FAQ[lang].map(([q, a]) => (
            <div key={q} className="card">
              <dt className="font-semibold text-ink">{q}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
