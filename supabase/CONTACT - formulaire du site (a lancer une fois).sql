-- ═══════════════════════════════════════════════════════════════
--  SCHICGIRL — table des messages du formulaire de contact
--  A lancer UNE FOIS dans Supabase : SQL Editor → coller → Run.
--  Sans danger a relancer (tout est en IF NOT EXISTS / DROP-CREATE).
-- ═══════════════════════════════════════════════════════════════

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  topic       text,
  message     text not null,
  lang        text,
  handled     boolean not null default false,   -- coche quand tu as repondu
  user_agent  text
);

create index if not exists contact_messages_created_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

-- ── ÉCRITURE ──────────────────────────────────────────────────
-- N'importe quelle visiteuse peut DEPOSER un message : c'est le but
-- d'un formulaire de contact. Les longueurs sont bornees ici, cote
-- base, et pas seulement dans le navigateur : une verification faite
-- uniquement en JavaScript ne protege rien, il suffit d'appeler l'API
-- directement pour la contourner.
drop policy if exists "anyone can send a message" on public.contact_messages;
create policy "anyone can send a message"
  on public.contact_messages for insert
  with check (
    length(name)    between 1 and 120
    and length(email) between 3 and 200
    and email like '%@%'
    and length(message) between 1 and 4000
    and coalesce(length(topic), 0) <= 60
    and handled = false          -- personne ne s'auto-marque « traite »
  );

-- ── LECTURE ───────────────────────────────────────────────────
-- PERSONNE ne peut lire cette table depuis le site : pas de policy
-- SELECT du tout. Sans ca, n'importe qui pourrait recuperer le nom,
-- l'email et le message de toutes les autres visiteuses.
-- Toi, tu les lis dans le Table Editor de Supabase (role service,
-- qui passe au-dessus des policies).

-- ── ANTI-SPAM ─────────────────────────────────────────────────
-- Le formulaire a un champ piege invisible (« website ») que seuls les
-- robots remplissent ; le navigateur n'envoie alors rien. Ca arrete les
-- robots simples, pas les cibles. Si un jour ca spamme vraiment :
-- activer le rate limiting Supabase ou passer par une Edge Function
-- avec un captcha.

-- ── VERIFICATION ──────────────────────────────────────────────
-- Apres avoir lance ce script, verifie que la lecture est bien fermee :
--   select * from public.contact_messages;   -- en tant qu'anon -> 0 ligne
