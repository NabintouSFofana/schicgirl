import Image from "next/image";
import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  title: "Le Studio · Planner Type 4 | Schicgirl",
  description: "Diagnostic, routine sur mesure, calendrier et suivi — l'app interactive + le cahier PDF 36 pages.",
};

const C = {
  fr: {
    badge: "Nouveau · Le Studio",
    title: "Ta routine Type 4,",
    accent: "enfin organisée",
    lead: "Pas un ebook de plus : un studio de coaching. Diagnostique tes cheveux, génère ta routine sur mesure, planifie et suis tes progrès.",
    cta: "✨ Obtenir le Studio · 9€",
    guarantee: "Paiement unique & sécurisé sur Selar · 9€ (≈ 6 000 FCFA) · accès immédiat",
    twoTitle: "DEUX FAÇONS DE L'UTILISER",
    ways: [
      ["✨", "Le Studio", "App interactive : diagnostic, routine générée, calendrier, suivi — sauvegardé sur ton appareil."],
      ["📖", "Le Cahier", "36 pages premium à imprimer : guides, calendrier, trackers, certificat — EN & FR, Letter & A4."],
    ],
    doTitle: "CE QUE TU VAS FAIRE",
    todo: [
      "Faire ton diagnostic (porosité, densité, cuir chevelu…)",
      "Générer une routine sur mesure selon ton profil",
      "Planifier ton mois avec un calendrier & sa légende",
      "Suivre ta pousse avec un journal photo & longueur",
      "Avancer avec un parcours de 90 jours + certificat",
    ],
    getTitle: "CE QUE TU REÇOIS",
    get: ["🇫🇷 Français · Letter", "🇫🇷 Français · A4", "🇬🇧 English · Letter", "🇬🇧 English · A4"],
    getNote: "Livré juste après ton paiement, par email & dans le Studio.",
    faqTitle: "QUESTIONS FRÉQUENTES",
    faq: [
      ["Combien ça coûte, et comment je le reçois ?", "9€ (≈ 6 000 FCFA), paiement unique sur Selar. Juste après, tu reçois l'accès au Studio et le cahier PDF par email."],
      ["C'est pour quel type de cheveux ?", "Cheveux crépus Type 4 — 4A, 4B, 4C, toutes porosités."],
    ],
  },
  en: {
    badge: "New · The Studio",
    title: "Your Type 4 routine,",
    accent: "finally organized",
    lead: "Not one more ebook: a coaching studio. Diagnose your hair, generate your custom routine, plan it and track your progress.",
    cta: "✨ Get the Studio · $10",
    guarantee: "One-time secure checkout on Selar · $10 · instant access",
    twoTitle: "TWO WAYS TO USE IT",
    ways: [
      ["✨", "The Studio", "Interactive app: diagnosis, generated routine, calendar, tracking — saved on your device."],
      ["📖", "The Workbook", "36 premium printable pages: guides, calendar, trackers, certificate — EN & FR, Letter & A4."],
    ],
    doTitle: "WHAT YOU'LL DO",
    todo: [
      "Take your diagnosis (porosity, density, scalp…)",
      "Generate a custom routine from your profile",
      "Plan your month with a calendar & legend",
      "Track growth with a photo & length log",
      "Progress through a 90-day journey + certificate",
    ],
    getTitle: "WHAT YOU GET",
    get: ["🇬🇧 English · Letter", "🇬🇧 English · A4", "🇫🇷 French · Letter", "🇫🇷 French · A4"],
    getNote: "Delivered right after payment, by email & in the Studio.",
    faqTitle: "FREQUENTLY ASKED",
    faq: [
      ["How much is it, and how do I get it?", "$10 (one-time) via Selar. Right after checkout, you get access to the Studio and the PDF workbook by email."],
      ["Which hair type is it for?", "Type 4 coily hair — 4A, 4B, 4C, all porosities."],
    ],
  },
} as const;

export default function Planner({ params }: { params: { lang: Locale } }) {
  const lang = params.lang;
  const t = C[lang];
  const buy = lang === "fr" ? "https://selar.com/studio-fr" : "https://selar.com/studio-en";
  const cover = lang === "fr" ? "/assets/planner-cover-fr.svg" : "/assets/planner-cover-en.svg";

  return (
    <div className="mx-auto max-w-xl px-5 pb-24">
      <section className="pt-6 text-center">
        <Image src={cover} alt="Le Studio · Planner Type 4" width={210} height={280} className="mx-auto mb-4 rounded-2xl shadow-soft" priority />
        <span className="inline-block rounded-full bg-gold-pale px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-gold-deep">
          {t.badge}
        </span>
        <h1 className="h-serif mx-auto mt-3 max-w-md text-3xl sm:text-4xl">
          {t.title} <span className="italic text-gold-deep">{t.accent}</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">{t.lead}</p>
        <a className="btn mt-5 block" href={buy} target="_blank" rel="noopener noreferrer">
          {t.cta}
        </a>
        <p className="mt-3 text-[13px] text-ink-soft">{t.guarantee}</p>
      </section>

      <section className="card mt-6">
        <div className="eyebrow">{t.twoTitle}</div>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {t.ways.map(([ic, b, s]) => (
            <div key={b} className="rounded-2xl border border-stroke bg-gold-pale/30 p-4 text-center">
              <div className="text-2xl">{ic}</div>
              <b className="mt-1 block font-serif text-lg text-gold-deep">{b}</b>
              <span className="text-[12.5px] text-ink-soft">{s}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card mt-6">
        <div className="eyebrow">{t.doTitle}</div>
        <ul className="mt-3 space-y-2">
          {t.todo.map((x) => (
            <li key={x} className="flex gap-2 text-[15px]">
              <span className="text-gold-deep">✓</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card mt-6">
        <div className="eyebrow">{t.getTitle}</div>
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {t.get.map((g) => (
            <div key={g} className="rounded-2xl border border-stroke bg-cream/80 px-3.5 py-3 text-center">
              <b className="text-sm">{g}</b>
              <span className="block text-[11.5px] text-muted">PDF · 36 pages</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs italic text-muted">{t.getNote}</p>
      </section>

      <section className="card mt-6">
        <div className="eyebrow">{t.faqTitle}</div>
        <dl className="mt-2">
          {t.faq.map(([q, a]) => (
            <div key={q} className="mt-3">
              <dt className="font-semibold text-ink">{q}</dt>
              <dd className="mt-1 text-sm text-ink-soft">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <a className="btn mt-8 block text-center" href={buy} target="_blank" rel="noopener noreferrer">
        {t.cta}
      </a>
    </div>
  );
}
