import type { Locale } from "./config";

const dictionaries = {
  fr: {
    nav: { home: "Accueil", blog: "Blog", products: "Produits", about: "À propos", contact: "Contact" },
    home: {
      eyebrow: "Cheveux crépus · Type 4",
      title: "Ta routine cheveux,",
      titleAccent: "enfin simple",
      lead:
        "Diagnostics, guides experts et un studio de coaching — tout pour des cheveux crépus (4A, 4B, 4C) hydratés, forts et qui poussent.",
      shopTitle: "Trouve TA solution",
      shopEyebrow: "★ Ebooks experts · Type 4",
      shopDesc: "Hydratation, pousse, cuir chevelu, routines sur mesure — chaque guide règle un vrai problème.",
      shopCta: "Voir tous mes ebooks →",
      toolsTitle: "Outils premium",
      discover: "Découvrir",
      open: "Ouvrir",
    },
    blog: {
      eyebrow: "Le blog Schicgirl",
      title: "Comprendre tes",
      titleAccent: "cheveux",
      lead: "Des explications simples et concrètes pour les cheveux crépus, frisés et bouclés. Zéro jargon.",
      readMore: "Lire l'article →",
      back: "← Tous les articles",
      minRead: "min de lecture",
    },
    contact: {
      eyebrow: "On répond sous 48 h",
      title: "Parlons",
      titleAccent: "cheveux",
      lead: "Une question sur ta routine, un guide, une collaboration ? Écris-nous.",
      email: "Email",
      facebook: "Facebook",
      faqTitle: "Questions fréquentes",
    },
    footer: { rights: "© 2024–2026 Schicgirl · Cheveux crépus Type 4 · 4A 4B 4C" },
  },
  en: {
    nav: { home: "Home", blog: "Blog", products: "Products", about: "About", contact: "Contact" },
    home: {
      eyebrow: "Coily hair · Type 4",
      title: "Your hair routine,",
      titleAccent: "finally simple",
      lead:
        "Diagnostics, expert guides and a coaching studio — everything for hydrated, strong, growing Type 4 (4A, 4B, 4C) hair.",
      shopTitle: "Find YOUR solution",
      shopEyebrow: "★ Expert ebooks · Type 4",
      shopDesc: "Hydration, growth, scalp, custom routines — each guide solves one real coily-hair problem.",
      shopCta: "See all my ebooks →",
      toolsTitle: "Premium tools",
      discover: "Discover",
      open: "Open",
    },
    blog: {
      eyebrow: "The Schicgirl blog",
      title: "Understand your",
      titleAccent: "hair",
      lead: "Simple, practical explanations for coily, kinky and curly hair. Zero jargon.",
      readMore: "Read article →",
      back: "← All articles",
      minRead: "min read",
    },
    contact: {
      eyebrow: "We reply within 48 h",
      title: "Let's talk",
      titleAccent: "hair",
      lead: "A question about your routine, a guide, a collaboration? Write to us.",
      email: "Email",
      facebook: "Facebook",
      faqTitle: "Frequently asked",
    },
    footer: { rights: "© 2024–2026 Schicgirl · Type 4 coily hair · 4A 4B 4C" },
  },
};

export type Dict = (typeof dictionaries)["fr"];
export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}
