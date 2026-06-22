import type { Locale } from "@/i18n/config";

/** A bilingual string pair. */
export type T = { fr: string; en: string };
export const tx = (v: T, l: Locale) => v[l];

export type Ebook = {
  id: string;
  emoji: string;
  badge?: T;
  title: T;
  desc: T;
  price: T;
  cfa?: string;
  /** internal sales page route (relative to /[lang]) */
  page?: string;
  /** external checkout */
  url?: string;
};

export const EBOOKS: Ebook[] = [
  {
    id: "studio-planner",
    emoji: "📋",
    badge: { fr: "Nouveau", en: "New" },
    title: { fr: "Le Studio · Planner Type 4", en: "The Studio · Type 4 Planner" },
    desc: {
      fr: "Diagnostic, routine sur mesure, calendrier & suivi — l'app interactive + le cahier PDF 36 pages.",
      en: "Diagnosis, custom routine, calendar & tracking — the interactive app + 36-page PDF workbook.",
    },
    price: { fr: "9€", en: "$10" },
    cfa: "(≈ 6 000 FCFA)",
    page: "planner",
  },
  {
    id: "hydratee",
    emoji: "💧",
    badge: { fr: "Best-seller", en: "Best-seller" },
    title: { fr: "Hydratée", en: "Hydrated" },
    desc: {
      fr: "La science de l'hydratation pour cheveux crépus — 79 pages, la méthode complète.",
      en: "The science of hydration for coily hair — 79 pages, the full method.",
    },
    price: { fr: "17€", en: "$18" },
    cfa: "(≈ 11 000 FCFA)",
    url: "https://selar.com/hydratee",
  },
  {
    id: "pousse",
    emoji: "🌱",
    title: { fr: "Pousse Maximale", en: "Maximum Growth" },
    desc: {
      fr: "Fais pousser tes cheveux crépus, sans casse ni frustration.",
      en: "Grow your coily hair — without breakage or frustration.",
    },
    price: { fr: "14€", en: "$15" },
    cfa: "(≈ 9 000 FCFA)",
    url: "https://selar.com/pousse",
  },
  {
    id: "pellicules",
    emoji: "✨",
    title: { fr: "Adieu Pellicules", en: "Goodbye Dandruff" },
    desc: {
      fr: "Comprends et élimine les pellicules sur cheveux crépus, durablement.",
      en: "Understand and clear dandruff on coily hair, for good.",
    },
    price: { fr: "8€", en: "$9" },
    cfa: "(≈ 5 000 FCFA)",
    url: "https://selar.com/pellicules",
  },
  {
    id: "coiffures",
    emoji: "💇🏾‍♀️",
    badge: { fr: "Petit prix", en: "Budget" },
    title: { fr: "Coiffures Protectrices", en: "Protective Styles" },
    desc: {
      fr: "Protège tes longueurs et gagne en pousse avec les bons styles.",
      en: "Protect your length and gain growth with the right styles.",
    },
    price: { fr: "5€", en: "$6" },
    cfa: "(≈ 3 500 FCFA)",
    url: "https://selar.com/coiffures-protectrices",
  },
  {
    id: "cheveux-secs",
    emoji: "🚿",
    badge: { fr: "Petit prix", en: "Budget" },
    title: { fr: "Stop aux Cheveux Secs", en: "Stop Dry Hair" },
    desc: {
      fr: "Le guide express pour en finir avec la sécheresse. Parfait pour commencer.",
      en: "The express guide to end dryness for good. Perfect to start.",
    },
    price: { fr: "5€", en: "$6" },
    cfa: "(≈ 3 500 FCFA)",
    url: "https://selar.com/stop-cheveux-secs",
  },
  {
    id: "transition",
    emoji: "🌸",
    title: { fr: "Cheveux en Transition", en: "Transitioning Hair" },
    desc: {
      fr: "Passe du défrisé au naturel en douceur, étape par étape.",
      en: "Go from relaxed to natural smoothly, step by step.",
    },
    price: { fr: "7€", en: "$7" },
    cfa: "(≈ 4 500 FCFA)",
    url: "https://selar.com/transition-fr",
  },
];

export type Tool = { id: string; emoji: string; title: T; sub: T; url: string };
export const TOOLS: Tool[] = [
  {
    id: "schicchat",
    emoji: "💬",
    title: { fr: "Schicgirl Diagnostique", en: "Schicgirl Diagnostic Chat" },
    sub: { fr: "Parle-moi de tes cheveux — réponses expertes instantanées.", en: "Talk to me about your hair — instant expert answers." },
    url: "https://selar.com/schicchat",
  },
  {
    id: "hydracheck",
    emoji: "💧",
    title: { fr: "Pourquoi tes cheveux restent secs ?", en: "Why does your hair stay dry?" },
    sub: { fr: "Comprends pourquoi tes cheveux crépus restent secs.", en: "Understand why your coily hair stays dry." },
    url: "https://selar.com/hydracheck",
  },
  {
    id: "consultation",
    emoji: "📅",
    title: { fr: "Consultation Capillaire", en: "Hair Consultation" },
    sub: { fr: "Réserve ta consultation personnalisée avec Schicgirl.", en: "Book your personalised consultation with Schicgirl." },
    url: "https://schicgirl.me/consultation",
  },
];

export type Post = {
  slug: string;
  cat: T;
  img: string;
  read: number;
  title: T;
  excerpt: T;
};

export const POSTS: Post[] = [
  {
    slug: "pourquoi-cheveux-crepus-secs",
    cat: { fr: "Les bases", en: "Basics" },
    img: "/assets/blog/pourquoi-cheveux-crepus-secs.jpg",
    read: 6,
    title: { fr: "Pourquoi les cheveux crépus sont (toujours) secs", en: "Why coily hair is (always) dry" },
    excerpt: { fr: "La vraie raison scientifique — et pourquoi ce n'est pas ta faute.", en: "The real, scientific reason — and why it's not your fault." },
  },
  {
    slug: "porosite-cheveux",
    cat: { fr: "Diagnostic", en: "Diagnosis" },
    img: "/assets/blog/porosite-cheveux.jpg",
    read: 7,
    title: { fr: "La porosité, expliquée simplement", en: "Hair porosity, explained simply" },
    excerpt: { fr: "Le test du verre d'eau, et ce que ta porosité change vraiment.", en: "The glass-of-water test, and what porosity really changes." },
  },
  {
    slug: "routine-wash-day",
    cat: { fr: "Routine", en: "Routine" },
    img: "/assets/blog/routine-wash-day.jpg",
    read: 8,
    title: { fr: "Le wash day parfait en 7 étapes", en: "The perfect wash day in 7 steps" },
    excerpt: { fr: "La méthode complète, du pré-poo au coiffage, sans casse.", en: "The full method, from pre-poo to styling, without breakage." },
  },
  {
    slug: "methode-loc-hydratation",
    cat: { fr: "Hydratation", en: "Moisture" },
    img: "/assets/blog/methode-loc-hydratation.jpg",
    read: 6,
    title: { fr: "LOC vs LCO : sceller l'hydratation pour de bon", en: "LOC vs LCO: lock in moisture for good" },
    excerpt: { fr: "L'ordre des produits qui garde tes cheveux hydratés des jours.", en: "The product order that keeps hair moisturized for days." },
  },
  {
    slug: "coiffures-protectrices",
    cat: { fr: "Coiffures", en: "Styles" },
    img: "/assets/blog/coiffures-protectrices.jpg",
    read: 6,
    title: { fr: "Coiffures protectrices : les 6 règles d'or", en: "Protective styles: the 6 golden rules" },
    excerpt: { fr: "Protéger tes longueurs sans étouffer ni casser tes cheveux.", en: "Protect your length without suffocating or breaking your hair." },
  },
  {
    slug: "stopper-la-casse",
    cat: { fr: "Pousse", en: "Growth" },
    img: "/assets/blog/stopper-la-casse.jpg",
    read: 7,
    title: { fr: "Stopper la casse : la vraie clé de la pousse", en: "Stop breakage: the real key to growth" },
    excerpt: { fr: "Tes cheveux poussent déjà. Le secret, c'est de les garder.", en: "Your hair already grows. The secret is keeping the length." },
  },
  {
    slug: "cuir-chevelu-sain-pellicules",
    cat: { fr: "Cuir chevelu", en: "Scalp" },
    img: "/assets/blog/cuir-chevelu-sain-pellicules.jpg",
    read: 7,
    title: { fr: "Cuir chevelu sain : adieu démangeaisons et pellicules", en: "Healthy scalp: goodbye itch and dandruff" },
    excerpt: { fr: "La racine de cheveux sains, c'est un cuir chevelu propre et équilibré.", en: "Healthy hair starts at a clean, balanced scalp." },
  },
  {
    slug: "routine-nuit-satin",
    cat: { fr: "Routine", en: "Routine" },
    img: "/assets/blog/routine-nuit-satin.jpg",
    read: 5,
    title: { fr: "La routine de nuit qui sauve tes cheveux", en: "The night routine that saves your hair" },
    excerpt: { fr: "Satin, pineapple, hydratation : protège tes boucles pendant que tu dors.", en: "Satin, pineapple, moisture: protect your curls while you sleep." },
  },
];

export const SHOP_URL = "https://selar.com/m/schicgirl";

/** End-of-article ebook promo, matched to each article. */
export type Promo = { title: T; desc: T; cta: T; urlFr: string; urlEn: string };

const HYDRATEE: Promo = {
  title: { fr: "Hydratée — la routine complète", en: "Hydrated — the complete routine" },
  desc: {
    fr: "L'ebook « Hydratée » transforme la théorie en routine claire, avec check-list jour & nuit.",
    en: "The “Hydrated” ebook turns the theory into a clear routine, with a day & night checklist.",
  },
  cta: { fr: "Obtenir Hydratée →", en: "Get Hydrated →" },
  urlFr: "https://selar.com/hydratee",
  urlEn: "https://selar.com/hydrated",
};

export const ARTICLE_PROMO: Record<string, Promo> = {
  "pourquoi-cheveux-crepus-secs": {
    title: { fr: "Stop aux cheveux secs", en: "Stop Dry Hair" },
    desc: {
      fr: "L'ebook qui transforme la théorie en routine : ajouter l'eau, la sceller, garder des cheveux souples.",
      en: "The ebook that turns the theory into a routine: add water, seal it in, keep hair soft.",
    },
    cta: { fr: "Commencer pour 5€ →", en: "Start for $6 →" },
    urlFr: "https://selar.com/stop-cheveux-secs",
    urlEn: "https://selar.com/stop-dry-hair",
  },
  "porosite-cheveux": HYDRATEE,
  "routine-wash-day": HYDRATEE,
  "methode-loc-hydratation": HYDRATEE,
  "routine-nuit-satin": HYDRATEE,
  "coiffures-protectrices": {
    title: { fr: "Coiffures protectrices, pas à pas", en: "Protective styles, step by step" },
    desc: {
      fr: "Des styles détaillés et adaptés aux cheveux crépus Type 4, avec l'entretien inclus.",
      en: "Detailed styles built for Type 4 coily hair, with upkeep included.",
    },
    cta: { fr: "Protéger mes cheveux →", en: "Protect my hair →" },
    urlFr: "https://selar.com/coiffures-protectrices",
    urlEn: "https://selar.com/hair-styles",
  },
  "stopper-la-casse": {
    title: { fr: "Pousse maximale, sans casse", en: "Maximum growth, no breakage" },
    desc: {
      fr: "L'ebook « Pousse » : le plan complet pour retenir ta longueur et voir tes cheveux s'allonger.",
      en: "The “Grow” ebook: the complete plan to retain length and finally see your hair get longer.",
    },
    cta: { fr: "Commencer ma pousse →", en: "Start my growth →" },
    urlFr: "https://selar.com/pousse",
    urlEn: "https://selar.com/grow-hair",
  },
  "cuir-chevelu-sain-pellicules": {
    title: { fr: "Adieu pellicules", en: "Goodbye dandruff" },
    desc: {
      fr: "L'ebook « Pellicules » t'aide à comprendre et éliminer les pellicules, durablement.",
      en: "The “Dandruff” ebook helps you understand and clear dandruff, for good.",
    },
    cta: { fr: "Retrouver un cuir chevelu sain →", en: "Get a healthy scalp →" },
    urlFr: "https://selar.com/pellicules",
    urlEn: "https://selar.com/dandruff",
  },
};

export function postIndex(slug: string) {
  return POSTS.findIndex((p) => p.slug === slug);
}
