/*
  SCHICGIRL — jeu-data.js
  Le contenu du quiz et des defis. Source unique, lue par activites.html.

  Regle : chaque reponse explique POURQUOI, et renvoie vers l'article
  qui developpe. Un quiz qui dit juste « faux » n'apprend rien.

  Les affirmations reprennent ce qui est deja ecrit dans les articles du
  blog — rien n'est invente ici. Si tu corriges un article, corrige aussi
  l'explication correspondante.

  q      : la question (fr/en)
  ok     : true = l'affirmation est vraie
  why    : l'explication montree apres la reponse
  lien   : l'article qui developpe (facultatif)
  © 2024–2026 Schicgirl. All rights reserved.
*/
window.SG_JEU = {

  quiz: [
    { q_fr: "Mes cheveux ne poussent pas.",
      q_en: "My hair doesn't grow.",
      ok: false,
      why_fr: "Ils poussent — presque tout le monde pousse à peu près à la même vitesse. Ce qui change, c'est la longueur que tu <b>gardes</b>. La casse mange la pousse.",
      why_en: "It grows — almost everyone grows at roughly the same rate. What differs is the length you <b>keep</b>. Breakage eats the growth.",
      lien: "stopper-la-casse" },

    { q_fr: "Hydrater ses cheveux, c'est la même chose que les sceller.",
      q_en: "Moisturising your hair is the same as sealing it.",
      ok: false,
      why_fr: "Hydrater, c'est faire entrer l'<b>eau</b>. Sceller, c'est l'empêcher de repartir avec un corps gras. Faire l'un sans l'autre, c'est remplir un seau percé.",
      why_en: "Moisturising puts <b>water</b> in. Sealing stops it leaving, with an oil or butter. Doing one without the other is filling a leaky bucket.",
      lien: "methode-loc-hydratation" },

    { q_fr: "Le shrinkage est mauvais signe.",
      q_en: "Shrinkage is a bad sign.",
      ok: false,
      why_fr: "C'est l'inverse : jusqu'à 80 % de ta longueur peut disparaître à l'œil, et ça veut dire que ta boucle est <b>élastique et hydratée</b>. Un cheveu qui ne rétrécit plus est souvent un cheveu abîmé.",
      why_en: "The opposite: up to 80% of your length can disappear from view, and it means your coil is <b>springy and hydrated</b>. Hair that stops shrinking is often damaged hair.",
      lien: "shrinkage-cheveux-crepus" },

    { q_fr: "L'huile de ricin fait pousser les cheveux.",
      q_en: "Castor oil makes hair grow.",
      ok: false,
      why_fr: "Non. Elle ne change pas la vitesse de pousse, qui se joue dans le follicule. Ce qu'elle fait est plus utile : elle <b>scelle</b> et limite la casse — donc tu gardes ta longueur.",
      why_en: "No. It doesn't change growth speed, which happens in the follicle. What it does is more useful: it <b>seals</b> and limits breakage — so you keep your length.",
      lien: "huile-de-ricin-cheveux" },

    { q_fr: "La plupart de la casse arrive pendant le démêlage.",
      q_en: "Most breakage happens while detangling.",
      ok: true,
      why_fr: "Environ <b>90 %</b>. D'où la règle : jamais à sec, toujours sur cheveux mouillés et glissants, des pointes vers les racines, section par section.",
      why_en: "Around <b>90%</b>. Hence the rule: never dry, always on wet slippery hair, ends first then up, section by section.",
      lien: "demelage-sans-casse" },

    { q_fr: "Mes cheveux sont secs parce que je ne bois pas assez d'eau.",
      q_en: "My hair is dry because I don't drink enough water.",
      ok: false,
      why_fr: "Boire est bon pour toi, pas pour la fibre : le cheveu visible est <b>mort</b>, il ne reçoit rien de l'intérieur. Il sèche parce que la spirale serrée empêche le sébum de descendre.",
      why_en: "Drinking is good for you, not for the strand: visible hair is <b>dead</b> and receives nothing from inside. It dries because the tight coil stops sebum travelling down.",
      lien: "pourquoi-cheveux-crepus-secs" },

    { q_fr: "Une porosité faible et une porosité forte se soignent pareil.",
      q_en: "Low and high porosity are cared for the same way.",
      ok: false,
      why_fr: "Non, et c'est l'erreur la plus coûteuse. Porosité faible : l'eau a du mal à <b>entrer</b> (chaleur, produits légers). Porosité forte : elle entre vite et <b>repart</b> vite (produits riches, scellage).",
      why_en: "No, and it's the costliest mistake. Low porosity: water struggles to get <b>in</b> (heat, light products). High porosity: it enters fast and <b>leaves</b> fast (rich products, sealing).",
      lien: "porosite-cheveux" },

    { q_fr: "Dormir sur un taie d'oreiller en coton abîme les cheveux.",
      q_en: "Sleeping on a cotton pillowcase damages hair.",
      ok: true,
      why_fr: "Le coton <b>boit</b> l'hydratation et frotte. Satin ou soie, bonnet ou taie : c'est le geste le moins cher et le plus rentable de toute la routine.",
      why_en: "Cotton <b>drinks</b> your moisture and creates friction. Satin or silk, bonnet or pillowcase: the cheapest, highest-return habit in the whole routine.",
      lien: "routine-nuit-satin" },

    { q_fr: "Couper les pointes fait pousser les cheveux plus vite.",
      q_en: "Trimming the ends makes hair grow faster.",
      ok: false,
      why_fr: "La pousse vient de la racine, pas des pointes. Couper ne l'accélère pas — mais retirer des pointes fourchues empêche la fente de <b>remonter</b>, donc tu gardes plus de longueur.",
      why_en: "Growth comes from the root, not the ends. Trimming doesn't speed it up — but removing split ends stops the split <b>travelling up</b>, so you keep more length.",
      lien: "stopper-la-casse" },

    { q_fr: "Tous les sulfates sont à bannir.",
      q_en: "All sulfates must be avoided.",
      ok: false,
      why_fr: "Nuance : les sulfates lavent vraiment, ce qui est parfois nécessaire (accumulation de silicones, de gel). Le problème est de les utiliser <b>à chaque lavage</b> sur cheveux déjà secs.",
      why_en: "It's nuanced: sulfates genuinely clean, which is sometimes needed (silicone or gel build-up). The problem is using them <b>every wash</b> on already-dry hair.",
      lien: "ingredients-a-eviter" },

    { q_fr: "Une coiffure protectrice peut abîmer les cheveux.",
      q_en: "A protective style can damage your hair.",
      ok: true,
      why_fr: "Oui, si elle est trop serrée, gardée trop longtemps, ou posée sur cheveux déjà fragiles. « Protectrice » décrit une intention, pas une garantie.",
      why_en: "Yes — if it's too tight, kept too long, or installed on already-fragile hair. \"Protective\" describes an intention, not a guarantee.",
      lien: "coiffures-protectrices" },

    { q_fr: "Noter ce que je fais à mes cheveux sert vraiment à quelque chose.",
      q_en: "Writing down what I do to my hair actually helps.",
      ok: true,
      why_fr: "C'est la seule façon de savoir ce qui marche <b>sur toi</b>. Sans traces, on refait les mêmes essais tous les six mois en croyant avancer.",
      why_en: "It's the only way to know what works <b>on you</b>. Without a record you repeat the same experiments every six months and call it progress.",
      lien: "journal-capillaire" }
  ],

  /* Defis : concrets, faisables, et qui donnent un resultat visible.
     duree = nombre de cases a cocher. */
  defis: [
    { id: "satin", ic: "🌙", duree: 7,
      t_fr: "7 nuits en satin", t_en: "7 nights in satin",
      d_fr: "Bonnet ou taie en satin, sept nuits d'affilée. Regarde tes cheveux au réveil le 8e jour.",
      d_en: "Satin bonnet or pillowcase, seven nights in a row. Look at your hair on the morning of day 8.",
      lien: "routine-nuit-satin" },

    { id: "demelage", ic: "🪮", duree: 4,
      t_fr: "4 démêlages sans casse", t_en: "4 detangles without breakage",
      d_fr: "Quatre fois : sur cheveux mouillés, avec du glissant, des pointes vers les racines, section par section. Aux doigts d'abord.",
      d_en: "Four times: wet hair, plenty of slip, ends first then up, section by section. Fingers before any tool.",
      lien: "demelage-sans-casse" },

    { id: "porosite", ic: "🔬", duree: 1,
      t_fr: "Trouver ta porosité", t_en: "Find your porosity",
      d_fr: "Une seule case, mais celle qui change tout le reste. Fais le test et note le résultat quelque part.",
      d_en: "A single box, but the one that changes everything else. Take the test and write the answer down.",
      lien: "porosite-cheveux" },

    { id: "loc", ic: "🧴", duree: 4,
      t_fr: "4 fois la méthode LOC", t_en: "4 rounds of the LOC method",
      d_fr: "Eau, puis huile, puis crème — dans cet ordre, sur cheveux humides. Quatre applications pour juger.",
      d_en: "Water, then oil, then cream — in that order, on damp hair. Four applications before you judge.",
      lien: "methode-loc-hydratation" },

    { id: "journal", ic: "📔", duree: 14,
      t_fr: "14 jours de journal", t_en: "14 days of journalling",
      d_fr: "Chaque jour : ce que tu as mis, ce que tu as fait, l'état de tes cheveux. Deux lignes suffisent.",
      d_en: "Each day: what you used, what you did, how your hair felt. Two lines is enough.",
      lien: "journal-capillaire" },

    { id: "etiquettes", ic: "🏷️", duree: 5,
      t_fr: "Lire 5 étiquettes", t_en: "Read 5 labels",
      d_fr: "Prends cinq produits de ta salle de bain et lis vraiment la liste. Tu vas avoir des surprises.",
      d_en: "Take five products from your bathroom and actually read the list. You'll be surprised.",
      lien: "ingredients-a-eviter" }
  ]
};
