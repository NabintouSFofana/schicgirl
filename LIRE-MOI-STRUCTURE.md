# Schicgirl — où se trouve quoi

Carte du dossier `APPLICATIONS`. À lire quand tu ne sais plus où chercher.

> **Rien n'a été supprimé.** L'ancien site est intact. Le nouveau site vit
> à côté, sous les noms `*-complete.html`.

---

## 1. LE NOUVEAU SITE — c'est ici que tu travailles

Cinq pages, reliées entre elles. `index-complete.html` est la page d'accueil.

| Fichier | Page |
|---|---|
| `index-complete.html` | **Accueil** — point d'entrée du nouveau site |
| `shop-complete.html` | Boutique — guides, Le Cercle, comment payer, FAQ |
| `blog-complete.html` | Blog — article à la une, recherche, filtres |
| `about-complete.html` | À propos |
| `contact-complete.html` | Contact + FAQ |

### Les 3 fichiers partagés par ces 5 pages

| Fichier | Rôle |
|---|---|
| `assets/css/site-complete.css` | **Tout le style** : couleurs, polices, cartes, grilles, pied de page, responsive |
| `assets/js/site-complete.js` | **Tout le comportement** : langue FR/EN, menu mobile, apparitions, rendu des grilles |
| `assets/js/catalog.js` | **Les 7 guides** — un seul endroit, utilisé par la boutique ET l'accueil |
| `assets/js/blog.js` | **Les 17 articles** — un seul endroit, utilisé par le blog ET l'accueil |

**Conséquence pratique :** pour ajouter un guide, tu modifies `catalog.js`.
Pour ajouter un article, `blog.js`. Les pages se mettent à jour toutes seules.
Tu ne copies jamais un produit ou un article dans une page.

### Pour mettre le nouveau site en ligne (le jour où tu décides)

Renomme les cinq fichiers en retirant `-complete` :
`index-complete.html` → `index.html`, etc.
Les balises `canonical` pointent déjà vers les bonnes adresses finales.
Sauvegarde d'abord les anciens (par exemple dans `_dev-archive/`).

---

## 2. L'ANCIEN SITE — toujours en ligne, ne rien casser

`index.html`, `shop.html`, `blog.html`, `about.html`, `contact.html` et les
~40 autres pages à la racine. C'est **ce qui tourne aujourd'hui sur
schicgirl.me**. Tant que tu n'as pas basculé, ne les déplace pas.

Les pages `/fr/` et `/en/` sont les versions pré-rendues pour Google,
générées par `prerender.py`. Ne les édite pas à la main.

---

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

- [ ] Décider si le nouveau site remplace l'ancien (renommer les 5 fichiers)
- [ ] Relire la capture de paiement anonymisée (`assets/how-to-pay-checkout-fr.png`)
- [ ] `blog.js` : les catégories `comprendre` et `produits` manquent dans la
      table `CATS` (ligne 11). Trois articles affichent donc leur code brut
      dans la barre latérale de l'ancien `blog.html`. Deux lignes à ajouter.
- [ ] `products.html` : les 17 photos de `assets/products/` ont disparu avec
      le dossier. La page masque les images manquantes, donc elle s'affiche,
      mais sans aucune photo. Elle n'est liée par aucune page et n'est pas
      dans le sitemap — à supprimer ou à réalimenter.

### Vérifié, rien à faire

Les cinq pages réellement en ligne — `index.html`, `shop.html`, `blog.html`,
`about.html`, `contact.html` — n'ont **aucune image cassée**.

Les couvertures manquantes de `pousse`, `coiffures` et `stop-cheveux-secs`
sont normales : ces ebooks affichent « Bientôt disponible » et les pages
remplacent l'image absente par une icône 📖. Idem pour `MonHistoire` /
`MyStory` : l'ebook n'existe pas, les fichiers ont été retirés, et plus
aucune page ne les appelle.
