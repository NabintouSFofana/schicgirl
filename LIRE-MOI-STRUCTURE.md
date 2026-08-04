# Schicgirl — où se trouve quoi

Carte du dossier `APPLICATIONS`. À lire quand tu ne sais plus où chercher.

> **Le nouveau site est en ligne** depuis le 4 août 2026. Rien n'a été
> supprimé : les anciennes pages sont dans `_dev-archive/anciennes-pages/`.

---

## 1. LE SITE — c'est ici que tu travailles

Huit pages, reliées entre elles. `index.html` est la page d'accueil.

| Fichier | Page |
|---|---|
| `index.html` | **Accueil** |
| `shop.html` | Boutique — les 7 guides, comment payer, FAQ |
| `products.html` | Mes produits Amazon, filtrables par porosité |
| `le-cercle.html` | Page de vente de l'abonnement |
| `blog.html` | Blog — article à la une, recherche, filtres |
| `about.html` | À propos |
| `contact.html` | Contact — formulaire, canaux, FAQ |
| `mon-compte.html` | Espace membre (connexion + tableau de bord) |

### Les fichiers partagés

| Fichier | Rôle |
|---|---|
| `assets/css/site-complete.css` | **Tout le style** |
| `assets/js/site-complete.js` | **Tout le comportement** : langue FR/EN, menu mobile, apparitions, grilles |
| `assets/js/account.js` | Le compte membre (Supabase, partagé avec le forum et le Studio) |
| `assets/js/catalog.js` | Les **7 guides** |
| `assets/js/blog.js` | Les **17 articles** |
| `assets/js/amazon-picks.js` | Les **17 produits Amazon** |

**Conséquence pratique :** un guide s'ajoute dans `catalog.js`, un article
dans `blog.js`, un produit dans `amazon-picks.js`. Les pages se mettent à
jour toutes seules. Tu ne copies jamais un contenu dans une page.

**Un seul compte** pour le site, le forum et Le Studio : même email, même
mot de passe, même projet Supabase. L'accès est décidé par la base
(`has_forum_access()`), jamais par le navigateur.

## 2. L'ANCIEN SITE — archivé

Tout est dans `_dev-archive/anciennes-pages/` : les sept versions `-v1`
d'avant la refonte, et les essais `index2/3/4` et `index-classic`.
Ce dossier n'est pas publié. Un `LIRE-MOI.txt` y explique chaque fichier.

Les ~40 autres pages à la racine (guides, ebooks, outils) n'ont pas changé.

Les pages `/fr/` et `/en/` sont les versions pré-rendues pour Google,
générées par `prerender.py` — voir la section 7.

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
| `_dev-archive/` | Sauvegardes (`.preseo`…) et `anciennes-pages/` : tout ce que le site ne sert plus. |

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

- [ ] Lancer `supabase/CONTACT - menage des messages.sql` pour supprimer
      le message de test laissé par la vérification du formulaire
- [ ] Relire la capture de paiement anonymisée (`assets/how-to-pay-checkout-fr.png`)

### Bon à savoir

**Après avoir modifié une page, relance `prerender.py`.** Les 42 pages
`/fr/` et `/en/` sont construites à partir des pages de la racine : tant
que tu ne relances pas, elles servent l'ancienne version. C'est ce qui
avait laissé `/en/the-circle/` afficher un prix en euros et renvoyer vers
la page de paiement française.

`prerender.py` connaît des identifiants précis : `price`, `barPrice`,
`priceCfa`, `mainCta`, `barCta`. Une page de vente doit les utiliser pour
que le prix et le lien Selar changent selon la langue. Tout le reste
passe par `data-fr` / `data-en`.

**Le tableau de bord** (`dashboard.html`) et les pages `*_admin.html`
restent à la racine : ce sont tes outils, ouverts directement par leur
adresse. Ils sont en `noindex` et bloqués dans `robots.txt`.
Note : le mot de passe du tableau de bord est vérifié dans le navigateur
(empreinte SHA-256 dans le code). Ça écarte les curieux, pas quelqu'un de
déterminé — ne mets rien de sensible derrière.
