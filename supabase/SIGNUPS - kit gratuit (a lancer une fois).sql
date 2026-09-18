-- ═══════════════════════════════════════════════════════════════════════════
-- À LANCER UNE FOIS — URGENT
-- Vérifié le 17/09/2026 : la table « signups » N'EXISTE PAS dans ton projet
-- Supabase. La page du kit gratuit (schicgirl.me/fr/kit-gratuit, /en/free-kit,
-- toolkit-landing.html) essaie d'y enregistrer chaque inscrite : sans la
-- table, AUCUNE inscription au kit gratuit n'a été gardée.
-- Supabase → SQL Editor → colle tout → Run. (Copie du fichier
-- « secrets and important/signups-supabase.sql », qui ne contient aucun secret.)
-- ═══════════════════════════════════════════════════════════════════════════

-- ============================================================
--  SCHICGIRL — Table d'inscriptions (lead magnet gratuit)
--  À exécuter UNE FOIS dans Supabase → SQL Editor → Run.
--
--  Sécurité (même leçon que Studio Premium) :
--   • Le site utilise seulement la clé « anon » publique.
--   • On autorise anon à AJOUTER un inscrit (INSERT) — jamais à LIRE.
--   • Aucune policy SELECT pour anon  ⇒  personne ne peut télécharger
--     ta liste d'emails depuis le site. Tu la lis UNIQUEMENT depuis
--     ton tableau de bord Supabase (Table Editor → signups).
-- ============================================================

-- 1) La table
create table if not exists public.signups (
  id          bigint generated always as identity primary key,
  name        text,
  email       text,
  phone       text,
  lang        text,
  source      text,                         -- quelle page a capté l'inscrit
  created_at  timestamptz not null default now()
);

-- 2) Éviter les doublons d'email (mais autoriser les inscrits "téléphone seul",
--    donc l'unicité ne s'applique qu'aux emails réels)
create unique index if not exists signups_email_uniq
  on public.signups (lower(email))
  where email is not null and email <> '';

-- 3) Activer la sécurité au niveau ligne (RLS)
alter table public.signups enable row level security;

-- 4) Droit d'écriture pour la clé anon (le site AJOUTE des inscrits)
grant insert on public.signups to anon;

-- 5) Policy : anon peut INSÉRER uniquement (aucune lecture)
drop policy if exists "signups_insert_anon" on public.signups;
create policy "signups_insert_anon"
  on public.signups
  for insert
  to anon
  with check (true);

-- (Volontairement AUCUNE policy SELECT/UPDATE/DELETE pour anon :
--  la clé publique ne peut donc pas lire, modifier ni vider la liste.)

-- ============================================================
--  Pour VOIR tes inscrits ensuite :
--   Supabase → Table Editor → signups   (tri par created_at desc)
--  Pour EXPORTER en CSV :
--   même écran → bouton "..." / Export, ou :
--     select name, email, phone, lang, source, created_at
--     from public.signups order by created_at desc;
-- ============================================================
