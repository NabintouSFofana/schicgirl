/*
  SCHICGIRL — account.js
  Le compte membre, partage par le site, le forum et le Studio.

  IMPORTANT — il n'y a qu'UN SEUL compte par personne :
  meme projet Supabase, meme email, meme mot de passe pour le site, le
  forum (schicgirl.me/forum) et Le Studio Premium. Ce fichier reutilise
  exactement la meme session que assets/js/studio-premium-auth.js (meme
  cle localStorage « sgp_session ») : se connecter ici, c'est etre
  connectee partout.

  L'ACCES est decide par la base, pas par le navigateur : la fonction
  has_forum_access() lit profiles.access_until. Le client ne fait
  qu'afficher le resultat — masquer un bouton n'a jamais protege quoi que
  ce soit, c'est la base qui refuse les donnees a qui n'a pas payé.

  La cle ci-dessous est la cle « anon » publique de Supabase : elle est
  faite pour etre dans la page. Ce qui protege les donnees, ce sont les
  regles RLS cote serveur.

  © 2024–2026 Schicgirl. All rights reserved.
*/
(function () {
  "use strict";

  var SB_URL = "https://ouwzbqmmtbxqtffghncg.supabase.co";
  var SB_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91d3picW1tdGJ4cXRmZmdobmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwOTU4NDMsImV4cCI6MjA5NjY3MTg0M30.UuRoYPPDL18-J9WyFK5kpFhRguq_9aDeacXDRhdkmD8";
  var SESSION_KEY = "sgp_session";   // identique au Studio : session commune

  var session = null;
  try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch (e) {}

  /* On note QUAND le jeton expire. Supabase renvoie expires_in (secondes,
     1 h par defaut) ; sans cette date on ne peut pas savoir qu'il est
     perime, et c'est exactement ce qui faisait qu'une abonnee revenue le
     lendemain se voyait dire « tu n'es pas membre ». */
  function save(s) {
    if (s && s.expires_in && !s.expires_at) {
      s.expires_at = Date.now() + (s.expires_in * 1000);
    }
    session = s;
    try {
      if (s) localStorage.setItem(SESSION_KEY, JSON.stringify(s));
      else localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  var normEmail = function (e) { return String(e || "").trim().toLowerCase(); };

  /* ── API Auth de Supabase ─────────────────────────────────── */
  function authCall(path, body, token) {
    var h = { apikey: SB_KEY, "Content-Type": "application/json" };
    if (token) h.Authorization = "Bearer " + token;
    return fetch(SB_URL + "/auth/v1/" + path, {
      method: "POST", headers: h, body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error(j.error_description || j.msg || j.error || "Erreur " + r.status);
        return j;
      });
    });
  }

  /* ── RENOUVELLEMENT DU JETON ──────────────────────────────────
     Le jeton d'acces ne vit qu'une heure. Le jeton de renouvellement,
     lui, dure des semaines : on s'en sert pour en obtenir un neuf, sans
     redemander le mot de passe.

     Si le renouvellement echoue (jeton revoque, mot de passe change,
     trop ancien), on deconnecte franchement. Garder une session morte
     afficherait « connectee mais pas abonnee » a quelqu'un qui paie —
     le pire des deux mondes. */
  var refreshing = null;

  function refresh() {
    if (refreshing) return refreshing;                 // une seule a la fois
    if (!session || !session.refresh_token) return Promise.reject(new Error("pas de jeton"));
    refreshing = authCall("token?grant_type=refresh_token",
                          { refresh_token: session.refresh_token })
      .then(function (s) { save(s); refreshing = null; return s; })
      .catch(function (err) { refreshing = null; save(null); throw err; });
    return refreshing;
  }

  /* Jeton absent, expire, ou qui expire dans moins d'une minute. */
  function expiringSoon() {
    if (!session || !session.access_token) return true;
    if (!session.expires_at) return false;   // ancienne session : on verra au 401
    return Date.now() > (session.expires_at - 60000);
  }

  /* Toute requete authentifiee passe par ici : on renouvelle avant si le
     jeton est perime, et on reessaie UNE fois si le serveur repond 401. */
  function authed(doCall) {
    var run = function () { return doCall(session.access_token); };
    var first = expiringSoon() && session && session.refresh_token
      ? refresh().then(run)
      : Promise.resolve().then(run);
    return first.catch(function (err) {
      if (String(err && err.message).indexOf("401") < 0) throw err;
      return refresh().then(run);
    });
  }

  /* PUT, utilise pour changer le mot de passe */
  function authPut(path, body) {
    if (!session) return Promise.reject(new Error("non connectee"));
    return authed(function (token) {
      return fetch(SB_URL + "/auth/v1/" + path, {
        method: "PUT",
        headers: { apikey: SB_KEY, Authorization: "Bearer " + token,
                   "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }).then(function (r) {
        return r.json().then(function (j) {
          if (!r.ok) throw new Error((r.status === 401 ? "401 " : "") +
            (j.error_description || j.msg || j.error || "Erreur " + r.status));
          return j;
        });
      });
    });
  }

  /* ── REST authentifie ─────────────────────────────────────── */
  function rest(path, opts) {
    opts = opts || {};
    if (!session || !session.access_token) return Promise.reject(new Error("non connectee"));
    return authed(function (token) {
      return fetch(SB_URL + "/rest/v1/" + path, {
        method: opts.method || "GET",
        headers: {
          apikey: SB_KEY,
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          Prefer: opts.prefer || "return=representation"
        },
        body: opts.body ? JSON.stringify(opts.body) : undefined
      }).then(function (r) {
        if (!r.ok) return r.text().then(function (t) {
          throw new Error((r.status === 401 ? "401 " : "") + t.slice(0, 200));
        });
        return r.status === 204 ? null : r.json();
      });
    });
  }

  function rpc(name, args) {
    return rest("rpc/" + name, { method: "POST", body: args || {} });
  }

  /* ── Ce qu'on expose ──────────────────────────────────────── */
  var API = {
    /* Y a-t-il une session en cours ? (ne dit RIEN sur l'abonnement) */
    isLoggedIn: function () { return !!(session && session.access_token); },
    email: function () { return session && session.user && session.user.email; },
    userId: function () { return session && session.user && session.user.id; },

    signIn: function (email, password) {
      return authCall("token?grant_type=password",
        { email: normEmail(email), password: password }
      ).then(function (s) { save(s); return s; });
    },

    signUp: function (email, password) {
      return authCall("signup", { email: normEmail(email), password: password })
        .then(function (s) {
          /* Supabase renvoie une session directement si la confirmation
             par email est desactivee ; sinon il faut se connecter apres. */
          if (s && s.access_token) save(s);
          return s;
        });
    },

    /* Email de reinitialisation du mot de passe */
    resetPassword: function (email) {
      return authCall("recover", { email: normEmail(email) });
    },

    changePassword: function (newPassword) {
      return authPut("user", { password: newPassword });
    },

    signOut: function () {
      save(null);
    },

    /* L'abonnement est-il actif ? Reponse de la BASE, pas du navigateur.

       Renvoie true, false, ou null. null = « on n'a pas pu savoir »
       (reseau coupe, session expiree). Repondre false dans ce cas
       reviendrait a annoncer « tu n'es pas abonnee » a quelqu'un qui
       paie : l'appelant doit distinguer les deux. */
    hasAccess: function () {
      if (!API.isLoggedIn()) return Promise.resolve(false);
      return rpc("has_forum_access")
        .then(function (v) { return v === true; })
        .catch(function () {
          /* La session a-t-elle survecu ? Si refresh() l'a effacee, ce
             n'est pas un refus d'abonnement, c'est une reconnexion a
             demander. */
          return API.isLoggedIn() ? null : false;
        });
    },

    /* Fiche profil (prenom, nom, type de cheveux, points, fin d'acces) */
    getProfile: function () {
      var id = API.userId();
      if (!id) return Promise.reject(new Error("non connectee"));
      return rest("profiles?select=first_name,last_name,hair_type,photo_url,points,role,access_until&id=eq."
                  + encodeURIComponent(id))
        .then(function (rows) { return (rows && rows[0]) || null; });
    },

    updateProfile: function (fields) {
      var id = API.userId();
      if (!id) return Promise.reject(new Error("non connectee"));
      return rest("profiles?id=eq." + encodeURIComponent(id),
                  { method: "PATCH", body: fields });
    },

    /* Passerelle vers le forum : le forum est sur un autre sous-domaine et
       ne partage donc pas le localStorage. On lui passe la session dans le
       fragment (#), qui n'est jamais envoye au serveur ni journalise. */
    forumUrl: function () {
      if (!API.isLoggedIn()) return "https://schicgirl.me/forum/";
      return "https://schicgirl.me/forum/#h="
        + encodeURIComponent(session.access_token) + "."
        + encodeURIComponent(session.refresh_token);
    },

    studioUrl: function () { return "https://schicgirl.me/studio-premium.html"; }
  };

  window.SGAccount = API;
})();
