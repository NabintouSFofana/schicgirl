# schicgirl.me/link-in-bio — Link in bio

Une seule page, un seul fichier (`index.html`). Pas de framework, pas de build,
pas de dépendance.

Cette page fait partie du **site principal** : elle est dans le dépôt `schicgirl`
et part en ligne avec le reste du site. Pas de dépôt séparé, pas de sous-domaine,
pas de DNS à toucher.

**Adresse publique :** `https://schicgirl.me/link-in-bio/`
C'est celle-là à mettre dans ta bio Instagram / TikTok / Facebook.

---

## 1. Modifier les liens

Tout est dans le tableau `LINKS`, dans le `<script>` en bas de `index.html`.
C'est **le seul endroit à toucher**.

```js
var LINKS = [
  { label_fr:"Blog", label_en:"Blog", url:"https://schicgirl.me/blog.html" },
  ...
];
```

| Champ | À quoi ça sert |
|---|---|
| `label_fr` / `label_en` | Le texte du bouton en français / en anglais |
| `url` | Même adresse dans les deux langues |
| `url_fr` / `url_en` | Une adresse différente selon la langue (ex. Le Cercle) |
| `feature: true` | Bouton doré, mis en avant. **N'en garder qu'un seul.** |
| `panel: "pay"` | Ouvre le panneau « Comment payer » au lieu d'un lien |

Pour **ajouter** un lien : copie une ligne, change le texte et l'adresse.
Pour **enlever** un lien : supprime la ligne.
Pour **changer l'ordre** : déplace la ligne. L'ordre du tableau = l'ordre à l'écran.

### Liens actuels

| Bouton | Destination |
|---|---|
| S'abonner au Cercle *(doré)* | `selar.com/le_cercle_schicgirl` (FR) / `the_circle_schicgirl` (EN) |
| Blog | `schicgirl.me/blog.html` |
| Boutique | `schicgirl.me/shop.html` |
| Produits Amazon | `amazon.com/shop/schicgirl` |
| Le Forum | `schicgirl.me/forum/` |
| Facebook | `facebook.com/schicgirl` |
| M'écrire | `contacte.schicgirl@gmail.com` |
| Comment payer | Ouvre le panneau explicatif |

> ⚠️ Quand tu renommes ou déplaces une page du site, **repasse ici** : ces
> adresses sont écrites en dur et ne se mettent pas à jour toutes seules.

---

## 2. Le panneau « Comment payer »

Le texte est dans l'objet `PAY` (juste sous `LINKS`), en FR et en EN :
`title`, `sub`, `steps` (les 5 étapes), `figs` (les images), `note`, `help`.

Les balises `<b>` fonctionnent dans les étapes et dans la note.

### Captures d'écran

Pour l'instant ce sont des **images d'attente** (fond doré, « Capture d'écran à
ajouter »). Pour mettre les vraies :

1. Va sur une de tes pages Selar, par exemple `https://selar.com/le_cercle_schicgirl`.
2. Prends **2 captures** :
   - le **sélecteur de devise** en haut de page,
   - l'écran de **choix du moyen de paiement**.
3. Recadre-les serré, largeur ~1200 px, enregistre en `.png` ou `.webp`.
4. Mets-les dans `assets/` et remplace les `src` dans `PAY` :

```js
figs:[
  { src:"assets/how-to-pay-currency-fr.png", cap:"..." },
  { src:"assets/how-to-pay-checkout-fr.png", cap:"..." }
],
```

> Fais une version FR et une version EN si l'interface Selar change de langue
> chez toi. Sinon, pointe les deux langues vers les mêmes fichiers.

Si un fichier image est absent, la figure se cache toute seule — jamais d'image
cassée sur la page.

**Relis aussi les 5 étapes** et corrige-les si le parcours Selar est différent de
ce qui est décrit : c'est toi qui connais le vrai flux.

---

## 3. Tester en local

Ouvre simplement `index.html` dans ton navigateur.

Pour tester une langue précise : `index.html?lang=en` ou `?lang=fr`.

---

## 4. Mettre en ligne

Comme n'importe quelle autre page du site — depuis le dossier `APPLICATIONS` :

```bash
git add . && git commit -m "Mise a jour du link in bio" && git push
```

En ligne 1 à 2 minutes après, sur `https://schicgirl.me/link-in-bio/`.

Rien d'autre à faire : pas de GitHub Pages à reconfigurer, pas de DNS GoDaddy à
modifier, pas de certificat à attendre. Le domaine `schicgirl.me` est déjà en
place et couvre ce dossier.

---

## Fichiers

```
index.html    la page (tout est dedans : HTML, CSS, JS, textes FR/EN)
README.md     ce fichier
assets/
  logo2.webp              le logo, le meme que la page d'accueil
  fav-logo-16/32.png      favicons
  apple-touch-logo.png    icone iOS
  og-image.png            image de partage
  how-to-pay-*.svg        captures « Comment payer » (a remplacer)
```

Le `robots.txt` et le `sitemap.xml` du site principal (à la racine de
`APPLICATIONS`) couvrent déjà cette page — l'URL a été ajoutée au sitemap.
