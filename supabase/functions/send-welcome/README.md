# Email de bienvenue automatique — mode d'emploi

Quand quelqu'un s'inscrit au kit gratuit, il reçoit automatiquement un email avec
ses 4 guides (en FR ou EN selon la langue). Voici comment l'activer **une fois**.

Il faut 3 choses : un compte **Resend** (gratuit), la **fonction** (ce dossier),
et un **webhook** Supabase qui la déclenche.

---

## 1) Créer un compte Resend (gratuit — 3 000 emails/mois)

1. Va sur **resend.com** → crée un compte.
2. **API Keys** → *Create API Key* → copie la clé (`re_...`). Garde-la de côté.
3. **Domaines** (pour que les emails partent de `@schicgirl.me` et n'aillent pas en spam) :
   - *Add Domain* → `schicgirl.me` → Resend te donne 3 lignes DNS (SPF, DKIM, DMARC).
   - Ajoute-les chez ton registrar (là où tu gères le domaine). Attends la validation (quelques minutes à quelques heures).
   - **Pour tester tout de suite sans attendre :** laisse `FROM_EMAIL` par défaut (`onboarding@resend.dev`). Ça marche mais seulement vers *ta propre* adresse. Une fois le domaine validé, mets `FROM_EMAIL = "Schicgirl <hello@schicgirl.me>"`.

## 2) Déployer la fonction

**Option A — Dashboard (sans rien installer) :**
1. Supabase → **Edge Functions** → *Deploy a new function* → nom exact : `send-welcome`.
2. Colle le contenu de `index.ts` (ce dossier) → *Deploy*.

**Option B — CLI (si tu l'as) :**
```bash
supabase functions deploy send-welcome --no-verify-jwt
```
> `--no-verify-jwt` : c'est notre secret `x-webhook-secret` (étape 4) qui protège la fonction, pas le JWT Supabase.

## 3) Mettre les secrets

Supabase → **Edge Functions → send-welcome → Secrets** (ou *Project Settings → Edge Functions*).
Ajoute :

| Nom | Valeur |
|-----|--------|
| `RESEND_API_KEY` | ta clé `re_...` de l'étape 1 |
| `WEBHOOK_SECRET` | un mot de passe que TU inventes (ex : `sch1c-w3lcome-9f2`) |
| `FROM_EMAIL` | `Schicgirl <hello@schicgirl.me>` *(seulement après validation du domaine)* |

> ⚠️ Ne mets JAMAIS ces valeurs dans le code ou sur le site. Elles vivent seulement ici.

## 4) Créer le webhook (le déclencheur)

Supabase → **Database → Webhooks** → *Create a new hook* :
- **Name** : `welcome-email`
- **Table** : `signups` · **Events** : ☑ *Insert*
- **Type** : *Supabase Edge Functions* → choisis `send-welcome`
- **HTTP Headers** → *Add header* :
  - `x-webhook-secret` = **la même valeur** que `WEBHOOK_SECRET` de l'étape 3
- *Create*.

## 5) Tester

1. Va sur `schicgirl.me/fr/kit-gratuit/`, inscris-toi avec **ton** email.
2. Regarde Supabase → Table `signups` : ta ligne est là.
3. L'email arrive dans ta boîte (vérifie les spams la 1re fois).
4. Un souci ? Supabase → **Edge Functions → send-welcome → Logs** montre l'erreur exacte.

---

### Ce que fait la fonction
- Reçoit UNIQUEMENT le nouvel inscrit (jamais toute la liste).
- Vérifie le secret `x-webhook-secret` → personne ne peut l'utiliser pour spammer.
- Choisit FR ou EN selon `lang`, ignore proprement les inscrits « téléphone seul » (pas d'email).
- Envoie les 4 guides + un lien doux vers *Hydratée/Hydrated*.
- `reply_to` pointe vers ton Gmail → les réponses te reviennent.

### Alternative plus simple (si un jour tu préfères)
Un outil d'emailing (MailerLite, Brevo…) a des séquences de bienvenue intégrées, sans code.
Tu remplacerais la capture Supabase par leur formulaire. Mais la solution ci-dessus garde
TOUT chez toi (ta liste t'appartient, pas de coût tant que tu es sous 3 000 emails/mois).
