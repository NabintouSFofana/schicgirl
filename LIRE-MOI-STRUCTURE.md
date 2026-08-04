# Schicgirl — où se trouve quoi

Carte du dossier `APPLICATIONS`. À lire quand tu ne sais plus où chercher.

> **Le nouveau site est en ligne** depuis le 4 août 2026. Rien n'a été
> supprimé : l'ancien site est conservé sous les noms `*-v1.html`.

---

## 1. LE SITE — c'est ici que tu travailles

Cinq pages, reliées entre elles. `index.html` est la page d'accueil.

| Fichier | Page |
|---|---|
| `index.html` | **Accueil** |
| `shop.html` | Boutique — guides, Le Cercle, comment payer, FAQ |
| `blog.html` | Blog — article à la une, recherche, filtres |
| `about.html` | À propos |
| `contact.html` | Contact + FAQ |

### Les 4 fichiers partagés par ces 5 pages

| Fichier | Rôle |
|---|---|
| `assets/css/site-complete.css` | **Tout le style** : couleurs, polices, cartes, grilles, pied de page, responsive |
| `assets/js/site-complete.js` | **Tout le comportement** : langue FR/EN, menu mobile, apparitions, rendu des grilles |
| `assets/js/catalog.js` | **Les 7 guides** — un seul endroit, utilisé par la boutique ET l'accueil |
| `assets/js/blog.js` | **Les 17 articles** — un seul endroit, utilisé par le blog ET l'accueil |

**Conséquence pratique :** pour ajouter un guide, tu modifies `catalog.js`.
Pour ajouter un article, `blog.js`. Les pages se mettent à jour toutes seules.
Tu ne copies jamais un produit ou un article dans une page.

## 2. L'ANCIEN SITE — archivé, plus servi

`index-v1.html`, `shop-v1.html`, `blog-v1.html`, `about-v1.html`,
`contact-v1.html`. Ce sont les versions d'avant la bascule, gardées pour
comparaison. Elles sont en `noindex` : Google ne les référencera pas et
elles ne feront pas concurrence aux vraies pages.

Les ~40 autres pages à la racine (guides, ebooks, outils) n'ont pas changé.

Les pages `/fr/` et `/en/` sont les versions pré-rendues pour Google,
générées par `prerender.py`. **Elles contiennent encore l'ancien design** :
relance `prerender.py` quand tu voudras les régénérer depuis les nouvelles
pages.

## 3. LES AUTRES PROJETS (indépendants)

| Dossier | Quoi | Adresse |
|---|---|---|
| `link-in-bio/` | Page « tous mes liens » pour la bio Instagram/TikTok | `schicgirl.me/link-in-bio/` |
| `forum/` | Le forum Inner Circle (Supabase) | `schicgirl.me/forum/` |
| `blog/` | Les 17 articles, un fichier `.html` par article | `schicgirl.me/blog/<slug>.html` |
| `studio-premium/`, `cercle/`, `guides/`, `products/`… | Produits et pages de vente | |
| `supabase/` | Scripts SQL de la base | |

---

## 4. LES IMAGES

```
assets/
├── blog/            les 17 couvertures d'articles (une par article)
├── css/             feuilles de style
├── js/              scripts
└── (racine)         couvertures de guides, logos, favicons, photos de pages
```

**Règle des couvertures d'articles :** le nom du fichier = le `slug` de
l'article. Exemple : l'article `blog/shrinkage-cheveux-crepus.html` utilise
`assets/blog/shrinkage-cheveux-crepus.jpg`. Ça évite les doublons.

Les images `blog1.jpg` … `blog4.jpg` ne servent plus de couverture d'article :
elles restent uniquement décoratives (carrousel de l'ancien `blog.html`,
image d'en-tête de l'accueil).

---

## 5. LES DOSSIERS QUI COMMENCENT PAR `_`

Ce ne sont **pas** des dossiers du site. Ils ne sont jamais servis aux visiteurs.

| Dossier | Contenu |
|---|---|
| `_sources-images/` | Les photos originales que tu déposes, avant renommage. Le vrai fichier utilisé est la copie dans `assets/`. |
| `_dev-archive/` | Anciennes versions de fichiers (`.preseo`, `.precercleprice`…). Gardées au cas où, jamais chargées. |

Si tu déposes une nouvelle photo d'article, mets-la dans
`_sources-images/blog/` avec un nom parlant, puis demande-moi de la placer :
je la copie dans `assets/blog/` au bon nom et je mets `blog.js` à jour.

---

## 6. LES SCRIPTS PYTHON

| Script | Rôle |
|---|---|
| `prerender.py` | Génère les versions `/fr/` et `/en/` pour le référencement |
| `pages_config.py` | La configuration lue par `prerender.py` |
| `seo_finalize.py` | Finalise les balises SEO |
| `adsense_setup.py`, `patch_js.py` | Utilitaires ponctuels |

---

## 7. Ce qu'il reste à faire

- [ ] Relancer `prerender.py` pour que `/fr/` et `/en/` reprennent le
      nouveau design (elles servent encore l'ancien)
- [ ] Relire la capture de paiement anonymisée (`assets/how-to-pay-checkout-fr.png`)
- [ ] `products.html` n'est liée par aucune page et n'est pas dans le
      sitemap : personne ne la trouve. Soit tu l'ajoutes au menu, soit tu
      la retires. (Elle fonctionne, voir ci-dessous.)

### Vérifié, rien à faire

Les cinq pages réellement en ligne — `index.html`, `shop.html`, `blog.html`,
`about.html`, `contact.html` — n'ont **aucune image cassée**.

**Un fichier image absent ne veut pas dire une page cassée.** Trois cas ici
où l'absence est prévue par le code :

- `pousse`, `coiffures`, `stop-cheveux-secs` : ebooks « Bientôt disponible ».
  Les couvertures ont été retirées exprès, les pages affichent une icône 📖.
- `MonHistoire` / `MyStory` : l'ebook n'existe pas, les fichiers sont partis,
  et plus aucune page ne les appelle.
- `products.html` : les 17 photos de `assets/products/` ont disparu, mais la
  page a été conçue avec un repli — chaque produit est dessiné en SVG. Les
  17 fiches s'affichent et les 31 liens affiliés Amazon fonctionnent. Ajouter
  les photos serait un bonus, pas une réparation.
