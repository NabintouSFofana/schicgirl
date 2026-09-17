-- ═══════════════════════════════════════════════════════════════════════════
-- SCHICGIRL — Inscriptions au Défi 30 Jours (page schicgirl.me/defi)
--
-- À lancer dans le projet Supabase du site (ouwzbqmmtbxqtffghncg).
-- Onglet SQL vide, colle tout, ne sélectionne rien, Run.
-- Le relancer ne casse rien et ne perd aucune inscription.
--
-- POURQUOI UNE TABLE À PART, ET PAS « signups »
-- 1. « signups » refuse deux fois le même email. Une abonnée qui a déjà pris
--    le kit gratuit verrait son inscription au défi rejetée en silence :
--    pas d'email, pas de trace.
-- 2. Le webhook de « signups » envoie les 4 guides du kit. Le défi a son
--    propre email (kit de départ + calendrier + lien du groupe).
-- 3. On garde la preuve du consentement : QUI a dit oui à QUOI, et QUAND.
--
-- SÉCURITÉ (la même règle que « signups »)
-- Le site n'a que la clé « anon ». Elle peut AJOUTER une inscription,
-- jamais LIRE, MODIFIER ni EFFACER la liste. Tu la lis seulement ici,
-- dans ton tableau de bord.
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.defi_inscriptions (
  id              bigint generated always as identity primary key,
  edition         text        not null default '2026-01',   -- une valeur par session du défi
  prenom          text        not null,
  email           text,
  whatsapp        text,
  pays            text,
  -- consentements : la date est la preuve
  accord_suite    boolean     not null default false,   -- conseils et offres APRÈS le défi
  accord_whatsapp boolean     not null default false,   -- messages WhatsApp
  accord_at       timestamptz not null default now(),
  source          text,                                 -- ex. « facebook-page », « groupe »
  created_at      timestamptz not null default now(),

  -- des garde-fous contre les robots et les champs absurdes
  constraint defi_contact  check (coalesce(email, '') <> '' or coalesce(whatsapp, '') <> ''),
  constraint defi_prenom   check (char_length(prenom) between 1 and 60),
  constraint defi_email    check (email is null or (char_length(email) <= 120 and email ~* '^[^\s@]+@[^\s@]+\.[^\s@]+$')),
  constraint defi_whatsapp check (whatsapp is null or (char_length(whatsapp) <= 25 and whatsapp ~ '^[0-9 +().-]+$')),
  constraint defi_pays     check (pays is null or char_length(pays) <= 40),
  constraint defi_source   check (source is null or char_length(source) <= 40),
  constraint defi_edition  check (char_length(edition) <= 20)
);

-- une seule inscription par email et par édition (un « téléphone seul » reste possible)
create unique index if not exists defi_email_edition_uniq
  on public.defi_inscriptions (lower(email), edition)
  where email is not null and email <> '';

alter table public.defi_inscriptions enable row level security;

grant insert on public.defi_inscriptions to anon;

drop policy if exists "defi_insert_anon" on public.defi_inscriptions;
create policy "defi_insert_anon"
  on public.defi_inscriptions
  for insert
  to anon
  with check (true);

-- Volontairement AUCUNE policy SELECT / UPDATE / DELETE pour anon.

notify pgrst, 'reload schema';

-- ═══════════════════════════════════════════════════════════════════════════
-- VÉRIFICATION — 3 lignes, toutes en OK
-- ═══════════════════════════════════════════════════════════════════════════
select 'table defi_inscriptions' as verification,
       case when to_regclass('public.defi_inscriptions') is not null then 'OK' else 'MANQUANTE' end as resultat
union all
select 'RLS activée',
       case when (select relrowsecurity from pg_class where oid = 'public.defi_inscriptions'::regclass)
            then 'OK' else 'NON' end
union all
select 'insertion publique seulement',
       case when exists (select 1 from pg_policies
                         where tablename = 'defi_inscriptions' and policyname = 'defi_insert_anon' and cmd = 'INSERT')
             and not exists (select 1 from pg_policies
                             where tablename = 'defi_inscriptions' and cmd in ('SELECT','UPDATE','DELETE','ALL'))
            then 'OK' else 'A VERIFIER' end;


-- ═══════════════════════════════════════════════════════════════════════════
-- LES REQUÊTES DONT TU AURAS BESOIN (colle-les une par une, seules)
-- ═══════════════════════════════════════════════════════════════════════════
--
-- 1) Combien d'inscrites, par pays
--    select coalesce(pays, '?') as pays, count(*) from public.defi_inscriptions
--     where edition = '2026-01' group by 1 order by 2 desc;
--
-- 2) Les emails pour les messages DU DÉFI (kit, rappels, bilan) — toutes les inscrites
--    select prenom, email from public.defi_inscriptions
--     where edition = '2026-01' and coalesce(email,'') <> '' order by created_at;
--
-- 3) Les emails pour APRÈS le défi (conseils, guides, offres) —
--    SEULEMENT celles qui ont coché la case. Jamais les autres.
--    select prenom, email, pays, accord_at from public.defi_inscriptions
--     where accord_suite = true and coalesce(email,'') <> '' order by accord_at;
--
-- 4) Les numéros WhatsApp — seulement celles qui ont dit oui
--    select prenom, whatsapp, pays from public.defi_inscriptions
--     where accord_whatsapp = true and coalesce(whatsapp,'') <> '';
--
-- Puis « Download CSV » sous le résultat.
--
-- 5) Quelqu'un demande à être effacée (c'est son droit, réponds sous un mois)
--    delete from public.defi_inscriptions where lower(email) = lower('adresse@exemple.com');
--
-- 6) Quelqu'un répond STOP : garde la ligne, retire l'accord
--    update public.defi_inscriptions set accord_suite = false where lower(email) = lower('adresse@exemple.com');
-- ═══════════════════════════════════════════════════════════════════════════
