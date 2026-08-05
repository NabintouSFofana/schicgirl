-- ═══════════════════════════════════════════════════════════════
--  SCHICGIRL — entretien de la boite de contact
--  A lancer dans Supabase : SQL Editor → coller → Run.
-- ═══════════════════════════════════════════════════════════════

-- ── 1. SUPPRIMER LE MESSAGE DE TEST ──────────────────────────
-- Laisse par la verification du formulaire. A supprimer.
delete from public.contact_messages
where email in ('verif@schicgirl.test', 'concours@schicgirl.test');


-- ── 1 bis. LES PARTICIPATIONS AU CONCOURS ────────────────────
-- Elles arrivent dans la meme table, avec topic = 'concours'.
-- Le score du quiz et l'avancement des defis sont en tete du message,
-- ce qui permet de departager sans tirage au sort.
-- select created_at, name, email, message
-- from public.contact_messages
-- where topic = 'concours'
-- order by created_at desc;


-- ── 2. LIRE TES MESSAGES ─────────────────────────────────────
-- Les non traites, du plus recent au plus ancien.
-- (Le site ne peut PAS lire cette table : aucune policy SELECT.
--  Ici tu passes par le role service, qui ignore les policies.)
select created_at, name, email, topic, message
from public.contact_messages
where handled = false
order by created_at desc;


-- ── 3. MARQUER UN MESSAGE COMME TRAITE ───────────────────────
-- Remplace l'adresse par celle de la personne a qui tu as repondu.
-- update public.contact_messages
--   set handled = true
--   where email = 'exemple@domaine.com';


-- ── 4. COMBIEN DE MESSAGES EN ATTENTE ? ──────────────────────
-- select count(*) as en_attente
-- from public.contact_messages
-- where handled = false;
