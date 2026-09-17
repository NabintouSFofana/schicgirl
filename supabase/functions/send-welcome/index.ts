// ============================================================
//  SCHICGIRL — Edge Function : email de bienvenue automatique
//  Déclenchée par un Database Webhook Supabase sur INSERT dans :
//    • `signups`            → les 4 guides gratuits (FR ou EN) ;
//    • `defi_inscriptions`  → le kit de départ du Défi 30 Jours (voir DEFI plus bas).
//  Envoi via Resend.
//
//  SECRETS à définir dans Supabase (Edge Functions → Secrets) :
//    RESEND_API_KEY   = ta clé API Resend (re_...)          [OBLIGATOIRE]
//    WEBHOOK_SECRET   = un mot de passe que TU inventes      [OBLIGATOIRE]
//    FROM_EMAIL       = "Schicgirl <hello@schicgirl.me>"     [optionnel]
//
//  La fonction ne voit JAMAIS ta liste : elle reçoit juste le nouvel inscrit.
// ============================================================

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") ?? "";
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET") ?? "";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") ?? "Schicgirl <onboarding@resend.dev>";
const SITE = "https://schicgirl.me";
// Les réponses aux emails arrivent ici. Adresse de la marque : jamais le nom réel.
const REPLY_TO = "contacte.schicgirl@gmail.com";

// ── DÉFI 30 JOURS — à mettre à jour avant chaque session, puis redéployer ──
const DEFI = {
  dateDebut: "lundi 21 septembre",   // vide = « la date arrive très vite »
  groupeUrl: "https://www.facebook.com/groups/2356359611348645",
  kitUrl: `${SITE}/defi/Schicgirl-Defi-30-jours-Kit-de-depart.pdf`,
  calendrierUrl: `${SITE}/defi/Schicgirl-Defi-30-jours-Calendrier.pdf`,
  calendrierEnLigneUrl: `${SITE}/defi/calendrier/`,
  kitImpressionUrl: `${SITE}/defi/Schicgirl-Defi-30-jours-Kit-de-depart-a-imprimer.pdf`,
  calendrierImpressionUrl: `${SITE}/defi/Schicgirl-Defi-30-jours-Calendrier-a-imprimer.pdf`,
};

// Les 4 guides, par langue (mêmes URLs que la page kit gratuit).
const GUIDES: Record<string, { title: string; url: string }[]> = {
  fr: [
    { title: "Le Guide Complet Type 4", url: `${SITE}/guides/50ed1d151e/schicgirl_guide_FR.pdf` },
    { title: "La Check-list Hydratation", url: `${SITE}/guides/50ed1d151e/Schicgirl_Checklist_Hydratation_FR.pdf` },
    { title: "L'Antisèche Porosité", url: `${SITE}/guides/50ed1d151e/Schicgirl_Antiseche_Porosite_FR.pdf` },
    { title: "La Check-list Jour de Lavage", url: `${SITE}/guides/50ed1d151e/Schicgirl_Checklist_Jour_de_Lavage_FR.pdf` },
  ],
  en: [
    { title: "The Complete Type 4 Guide", url: `${SITE}/guides/50ed1d151e/schicgirl_guide_EN.pdf` },
    { title: "The Hydration Checklist", url: `${SITE}/guides/50ed1d151e/Schicgirl_Type4_Hydration_Checklist.pdf` },
    { title: "The Porosity Cheat Sheet", url: `${SITE}/guides/50ed1d151e/Schicgirl_Hair_Porosity_Cheat_Sheet.pdf` },
    { title: "The Wash Day Checklist", url: `${SITE}/guides/50ed1d151e/Schicgirl_Wash_Day_Checklist.pdf` },
  ],
};

const COPY = {
  fr: {
    subject: "Tes 4 guides Type 4 sont là 💛",
    hi: (n: string) => `Coucou ${n || "toi"},`,
    intro:
      "Bienvenue chez Schicgirl ! Tes guides t'attendent juste en dessous. Ouvre-les, garde-les sur ton téléphone, et reviens-y à chaque jour de lavage.",
    guidesTitle: "📚 Tes guides gratuits",
    download: "Télécharger",
    next: "Par où commencer ?",
    nextBody:
      "Commence par <b>Le Guide Complet Type 4</b> : il te donne la vue d'ensemble. Ensuite, connais ta <b>porosité</b> (l'antisèche) — c'est la clé qui rend chaque routine efficace.",
    ps: "Une question sur tes cheveux ? Réponds simplement à cet email, je lis tout.",
    cta: "Aller plus loin : Hydratée, mon guide anti-cheveux secs →",
    ctaUrl: `${SITE}/hydratee.html`,
    signoff: "À très vite,<br>Schicgirl",
  },
  en: {
    subject: "Your 4 Type 4 guides are here 💛",
    hi: (n: string) => `Hi ${n || "there"},`,
    intro:
      "Welcome to Schicgirl! Your guides are waiting right below. Open them, keep them on your phone, and come back to them every wash day.",
    guidesTitle: "📚 Your free guides",
    download: "Download",
    next: "Where to start",
    nextBody:
      "Start with <b>The Complete Type 4 Guide</b> for the big picture. Then learn your <b>porosity</b> (the cheat sheet) — it's the key that makes every routine actually work.",
    ps: "A question about your hair? Just reply to this email, I read every one.",
    cta: "Go further: Hydrated, my guide to ending dry hair →",
    ctaUrl: `${SITE}/hydratee.html?lang=en`,
    signoff: "Talk soon,<br>Schicgirl",
  },
};

function esc(s: string) {
  return String(s ?? "").replace(/[<>&"]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c] as string)
  );
}

function buildEmail(lang: "fr" | "en", name: string) {
  const c = COPY[lang];
  const guides = GUIDES[lang];
  const rows = guides
    .map(
      (g) => `
      <tr><td style="padding:8px 0;border-bottom:1px solid #efe7da;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="font:600 15px/1.4 Georgia,serif;color:#3a2c1a;">📄 ${esc(g.title)}</td>
          <td align="right">
            <a href="${g.url}" style="background:#b8863b;color:#fff;text-decoration:none;font:600 13px Arial,sans-serif;padding:8px 16px;border-radius:8px;display:inline-block;">${c.download} ↓</a>
          </td>
        </tr></table>
      </td></tr>`
    )
    .join("");

  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f6f0e6;padding:24px 0;">
    <table align="center" width="100%" style="max-width:560px;margin:0 auto;background:#fffdf9;border-radius:16px;overflow:hidden;border:1px solid #ece2d2;">
      <tr><td style="background:#2c2115;padding:22px 28px;">
        <span style="font:700 20px Georgia,serif;color:#f3d9a3;letter-spacing:.5px;">Schicgirl</span>
      </td></tr>
      <tr><td style="padding:28px;">
        <p style="font:600 18px/1.4 Georgia,serif;color:#2c2115;margin:0 0 14px;">${c.hi(esc(name))}</p>
        <p style="font:400 15px/1.6 Arial,sans-serif;color:#4a3e2e;margin:0 0 22px;">${c.intro}</p>
        <p style="font:700 13px Arial,sans-serif;color:#b8863b;text-transform:uppercase;letter-spacing:1px;margin:0 0 6px;">${c.guidesTitle}</p>
        <table width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        <div style="background:#f6f0e6;border-radius:12px;padding:16px 18px;margin:24px 0 0;">
          <p style="font:700 14px Arial,sans-serif;color:#2c2115;margin:0 0 6px;">${c.next}</p>
          <p style="font:400 14px/1.6 Arial,sans-serif;color:#4a3e2e;margin:0;">${c.nextBody}</p>
        </div>
        <p style="text-align:center;margin:26px 0 8px;">
          <a href="${c.ctaUrl}" style="color:#b8863b;font:600 14px Arial,sans-serif;text-decoration:none;">${c.cta}</a>
        </p>
        <p style="font:400 13px/1.6 Arial,sans-serif;color:#8a7c66;margin:22px 0 0;border-top:1px solid #efe7da;padding-top:16px;">${c.ps}</p>
        <p style="font:400 14px/1.6 Arial,sans-serif;color:#4a3e2e;margin:18px 0 0;">${c.signoff}</p>
      </td></tr>
      <tr><td style="background:#f6f0e6;padding:14px 28px;text-align:center;font:400 11px Arial,sans-serif;color:#a99a80;">
        Schicgirl · <a href="${SITE}" style="color:#a99a80;">schicgirl.me</a>
      </td></tr>
    </table>
  </body></html>`;
}

// ── L'email du Défi 30 Jours ─────────────────────────────────────────────
function buildDefiEmail(prenom: string) {
  const bouton = (href: string, label: string) =>
    `<a href="${href}" style="background:#013538;color:#F6E7DB;text-decoration:none;font:600 14px Arial,sans-serif;padding:12px 20px;border-radius:999px;display:inline-block;margin:6px 4px;">${label}</a>`;
  const quand = DEFI.dateDebut
    ? `On commence ensemble le <b>${esc(DEFI.dateDebut)}</b>.`
    : "La date de départ arrive très vite : je te l'envoie dès qu'elle est fixée.";
  const groupe = DEFI.groupeUrl
    ? `<p style="font:400 15px/1.6 Arial,sans-serif;color:#1F2A2B;margin:18px 0 6px;">Le défi se passe dans le groupe Facebook : les missions, les questions, l'entraide.</p>
       <p style="text-align:center;margin:0 0 6px;">${bouton(DEFI.groupeUrl, "Rejoindre le groupe du défi")}</p>`
    : "";
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#F6E7DB;padding:24px 0;">
    <table align="center" width="100%" style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:16px;overflow:hidden;">
      <tr><td style="background:#013538;padding:22px 28px;">
        <span style="font:700 20px Georgia,serif;color:#F1DDB3;">Schicgirl · Le Défi 30 Jours</span>
      </td></tr>
      <tr><td style="padding:28px;">
        <p style="font:600 18px/1.4 Georgia,serif;color:#013538;margin:0 0 14px;">Coucou ${esc(prenom) || "toi"} 🤍</p>
        <p style="font:400 15px/1.6 Arial,sans-serif;color:#1F2A2B;margin:0 0 12px;">Tu es inscrite au <b>Défi 30 Jours Hydratation et Rétention</b>. ${quand}</p>
        <p style="font:400 15px/1.6 Arial,sans-serif;color:#1F2A2B;margin:0 0 6px;">Ton calendrier à cocher, sur ton téléphone (enregistre-le dans tes favoris) :</p>
        <p style="text-align:center;margin:0 0 14px;">${bouton(DEFI.calendrierEnLigneUrl, "✅ Mon calendrier du défi")}</p>
        <p style="font:400 15px/1.6 Arial,sans-serif;color:#1F2A2B;margin:0 0 6px;">Tes deux documents :</p>
        <p style="text-align:center;margin:0;">${bouton(DEFI.kitUrl, "📄 Le kit de départ")}${bouton(DEFI.calendrierUrl, "🗓️ Le calendrier des 30 jours")}</p>
        <p style="font:400 13px/1.6 Arial,sans-serif;color:#5E6B6C;margin:8px 0 0;text-align:center;">Tu veux imprimer ? Versions sur fond blanc, peu d'encre : <a href="${DEFI.kitImpressionUrl}" style="color:#013538;">kit</a> · <a href="${DEFI.calendrierImpressionUrl}" style="color:#013538;">calendrier</a></p>
        ${groupe}
        <div style="background:#FBF3EC;border-radius:12px;padding:16px 18px;margin:22px 0 0;">
          <p style="font:700 14px Arial,sans-serif;color:#013538;margin:0 0 6px;">Avant le jour 1</p>
          <p style="font:400 14px/1.6 Arial,sans-serif;color:#1F2A2B;margin:0;">1. Lis le kit (10 minutes).<br>2. Rassemble ton matériel : tu as sûrement déjà presque tout.<br>3. Prends tes deux photos de départ. Elles restent à toi.</p>
        </div>
        <p style="font:400 13px/1.6 Arial,sans-serif;color:#5E6B6C;margin:22px 0 0;border-top:1px solid #E6D3C3;padding-top:16px;">Tu reçois cet email parce que tu t'es inscrite sur schicgirl.me/defi. Pendant le défi, je t'écris au maximum une fois par semaine. Réponds STOP et je te retire.</p>
        <p style="font:400 14px/1.6 Arial,sans-serif;color:#1F2A2B;margin:18px 0 0;">À très vite,<br>Schicgirl</p>
      </td></tr>
    </table>
  </body></html>`;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok", { status: 200 });

  // 1) Anti-spam : seule ta base (avec le bon secret) peut déclencher un envoi.
  const got = req.headers.get("x-webhook-secret") ?? "";
  if (!WEBHOOK_SECRET || got !== WEBHOOK_SECRET) {
    return new Response("forbidden", { status: 401 });
  }
  if (!RESEND_API_KEY) return new Response("missing RESEND_API_KEY", { status: 500 });

  // 2) Le nouvel inscrit (payload du webhook Supabase).
  let record: Record<string, unknown> = {};
  let table = "";
  try {
    const body = await req.json();
    record = body.record ?? body ?? {};
    table = String(body.table ?? "");
  } catch {
    return new Response("bad json", { status: 400 });
  }

  // 2 bis) Inscription au Défi 30 Jours : son propre email.
  if (table === "defi_inscriptions") {
    const mail = String(record.email ?? "").trim();
    if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      return new Response("no email — skipped", { status: 200 });   // inscrite « WhatsApp seul »
    }
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [mail],
        subject: "Ton kit du Défi 30 Jours est là 🤍",
        html: buildDefiEmail(String(record.prenom ?? "").trim()),
        reply_to: REPLY_TO,
      }),
    });
    if (!r.ok) {
      console.error("resend error (defi)", r.status, await r.text());
      return new Response(`resend ${r.status}`, { status: 502 });
    }
    return new Response("sent (defi)", { status: 200 });
  }

  const email = String(record.email ?? "").trim();
  const name = String(record.name ?? "").trim();
  const lang: "fr" | "en" = String(record.lang ?? "fr").toLowerCase().startsWith("en") ? "en" : "fr";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    // Inscrit "téléphone seul" : rien à envoyer, on sort proprement.
    return new Response("no email — skipped", { status: 200 });
  }

  // 3) Envoi via Resend.
  const c = COPY[lang];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [email],
      subject: c.subject,
      html: buildEmail(lang, name),
      reply_to: REPLY_TO,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("resend error", res.status, err);
    return new Response(`resend ${res.status}`, { status: 502 });
  }
  return new Response("sent", { status: 200 });
});
