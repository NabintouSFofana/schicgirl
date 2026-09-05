-- ═══════════════════════════════════════════════════════════════════════════
-- SCHICGIRL — « Préviens-moi quand le prochain épisode sort »
--
-- À lancer dans le projet Supabase du forum (ouwzbqmmtbxqtffghncg).
-- Onglet SQL vide, colle tout, ne sélectionne rien, Run.
--
-- Le relancer ne casse rien : les colonnes sont créées « if not exists »
-- et les fonctions sont remplacées. Aucune donnée déjà enregistrée n'est
-- perdue. Relance-le après chaque correction de ce fichier.
--
-- LE PROBLÈME QUE ÇA RÈGLE
-- L'épisode 1 de la BD est offert. Son travail n'est pas d'être lu : c'est
-- de faire créer un compte, pour que tu puisses revenir vers cette personne
-- le jour où l'épisode 2 sort. Aujourd'hui tu ne le peux pas — tu as bien
-- les adresses dans auth.users, mais personne ne t'a autorisée à écrire.
-- Envoyer sans accord, c'est du spam, et en Europe c'est illégal.
--
-- CE QUE ÇA AJOUTE
-- Une case à cocher sur la page de la BD, et deux colonnes pour la retenir.
-- Rien d'autre. Pas de service d'emailing, pas d'abonnement mensuel : tu
-- récupères la liste avec la requête tout en bas et tu écris toi-même.
--
-- POURQUOI DEUX FONCTIONS PLUTÔT QU'UN SIMPLE UPDATE
-- Un consentement ne doit pouvoir être donné QUE par la personne concernée.
-- Ces deux fonctions travaillent sur auth.uid(), qui vient du jeton de la
-- session — impossible à falsifier depuis un navigateur. Personne ne peut
-- inscrire quelqu'un d'autre à ta liste.
-- ═══════════════════════════════════════════════════════════════════════════

-- 1. le consentement rejoint le profil (une ligne = une personne)
--    notify_bd    : oui / non
--    notify_bd_at : quand elle a dit oui — c'est cette date qui prouve
--                   le consentement le jour où quelqu'un le conteste
alter table public.profiles
  add column if not exists notify_bd boolean not null default false;
alter table public.profiles
  add column if not exists notify_bd_at timestamptz;

-- 2. lire son propre choix (pour cocher la case au bon état en arrivant)
create or replace function public.bd_notify_get()
returns boolean
language sql stable security definer set search_path = public
as $fn$
  select coalesce(notify_bd, false) from public.profiles where id = auth.uid();
$fn$;
grant execute on function public.bd_notify_get() to authenticated;

-- 3. changer son choix, dans les deux sens
--    Décocher efface la date : on ne garde pas la trace d'un accord retiré.
--
--    Le « if not found » compte : sans lui, quelqu'un dont la ligne de
--    profil manquerait verrait « c'est noté » alors que rien ne serait
--    enregistré, et ne recevrait jamais l'annonce. Mieux vaut une erreur
--    visible qu'une promesse silencieusement perdue.
create or replace function public.bd_notify_set(p_on boolean)
returns boolean
language plpgsql security definer set search_path = public
as $fn$
begin
  if auth.uid() is null then
    raise exception 'non authentifiee';
  end if;
  update public.profiles
     set notify_bd    = coalesce(p_on, false),
         notify_bd_at = case when coalesce(p_on, false) then now() else null end
   where id = auth.uid();
  if not found then
    raise exception 'profil introuvable';
  end if;
  return coalesce(p_on, false);
end;
$fn$;
grant execute on function public.bd_notify_set(boolean) to authenticated;

notify pgrst, 'reload schema';

-- ═══════════════════════════════════════════════════════════════════════════
-- VÉRIFICATION — 4 lignes, toutes en OK
-- ═══════════════════════════════════════════════════════════════════════════
select 'colonne notify_bd' as verification,
       case when exists (select 1 from information_schema.columns
                         where table_schema='public' and table_name='profiles'
                           and column_name='notify_bd')
            then 'OK' else 'MANQUANTE' end as resultat
union all
select 'colonne notify_bd_at',
       case when exists (select 1 from information_schema.columns
                         where table_schema='public' and table_name='profiles'
                           and column_name='notify_bd_at')
            then 'OK' else 'MANQUANTE' end
union all
select 'fonction bd_notify_get',
       case when exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
                         where n.nspname='public' and p.proname='bd_notify_get')
            then 'OK' else 'MANQUANTE' end
union all
select 'fonction bd_notify_set',
       case when exists (select 1 from pg_proc p join pg_namespace n on n.oid=p.pronamespace
                         where n.nspname='public' and p.proname='bd_notify_set')
            then 'OK' else 'MANQUANTE' end;


-- ═══════════════════════════════════════════════════════════════════════════
-- LE JOUR OÙ L'ÉPISODE 2 SORT — récupérer la liste
--
-- Colle CETTE requête-là (seulement elle) dans l'onglet SQL et lance-la.
-- Puis « Download CSV » en bas du résultat.
--
--   select u.email,
--          coalesce(p.first_name, '') as prenom,
--          p.notify_bd_at            as depuis
--     from public.profiles p
--     join auth.users u on u.id = p.id
--    where p.notify_bd = true
--      and u.email is not null
--    order by p.notify_bd_at;
--
-- Écris-leur en copie cachée (Cci / Bcc), jamais en copie visible : sinon
-- chaque destinataire voit l'adresse de toutes les autres.
--
-- Et mets une ligne de sortie en bas de ton message :
--   « Tu reçois ceci parce que tu as coché "préviens-moi" sur la page de la
--     BD. Réponds STOP et je te retire. »
-- Ça te prend dix secondes et ça t'évite d'être signalée comme spam.
-- ═══════════════════════════════════════════════════════════════════════════
