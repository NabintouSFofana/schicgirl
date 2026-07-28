/* SCHICGIRL — Le Studio Premium : accès par code + sauvegarde cloud (Supabase).
   Chargé APRÈS studio.page.js et studio-premium.page.js.
   - Écran de déverrouillage : email + code d'accès (livré après achat Selar).
   - Progression synchronisée dans Supabase (table studio_premium_progress),
     donc récupérable sur un autre appareil avec le même email + code.
   - Si Supabase est injoignable, l'app fonctionne quand même (repli local). */
(function () {
  var SB_URL = "https://ouwzbqmmtbxqtffghncg.supabase.co";
  var SB_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91d3picW1tdGJ4cXRmZmdobmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwOTU4NDMsImV4cCI6MjA5NjY3MTg0M30.UuRoYPPDL18-J9WyFK5kpFhRguq_9aDeacXDRhdkmD8";
  var SB_TABLE = "studio_premium_progress";
  /* SHA-256 des codes d'accès valides. Les codes en clair ne doivent JAMAIS
   apparaître dans ce fichier : il est téléchargé par tous les visiteurs.
   Garde-les hors du site (gestionnaire de mots de passe / carnet privé).

   Pour ajouter ou changer un code :
     python -c "import hashlib;print(hashlib.sha256(b'LECODE').hexdigest())"
   puis colle UNIQUEMENT le hash ci-dessous.
   Le code doit être saisi normalisé : majuscules, sans espace ni tiret.

   ── Ligne 1 : acheteuses du Studio Premium (accès à vie) — ne jamais retirer.
   ── Ligne 2 : abonnées Le Cercle — À FAIRE TOURNER LE 1er DE CHAQUE MOIS :
      génère le nouveau code, remplace le hash ci-dessous par le sien, puis
      communique le code aux abonnées à jour. Celles qui n'ont pas renouvelé
      sont déconnectées automatiquement à leur prochaine visite. */
  var CODE_HASHES = [
    "4ae85a2a58e9ac3546894658a49eb900abbfe8e0f48bddbdaee6e47f030ac695", // acheteuses (accès à vie)
    "8b4ab941da2fad36e8aff872cede97319df69647ffc9818b6fb53c87376112cf", // Le Cercle (à faire tourner chaque mois)
  ];
  var AUTH_KEY = "sgp_auth";
  var auth = null;
  try {
    auth = JSON.parse(localStorage.getItem(AUTH_KEY));
  } catch (e) {}

  function sha256(str) {
    if (window.crypto && crypto.subtle && crypto.subtle.digest) {
      return crypto.subtle
        .digest("SHA-256", new TextEncoder().encode(str))
        .then(function (buf) {
          return Array.prototype.map
            .call(new Uint8Array(buf), function (b) {
              return ("0" + b.toString(16)).slice(-2);
            })
            .join("");
        });
    }
    return Promise.resolve(false); // pas de SHA-256 disponible -> on REFUSE (sécurité : échec fermé)
  }
  function normEmail(e) {
    return String(e || "")
      .trim()
      .toLowerCase();
  }
  function normCode(c) {
    return String(c || "")
      .trim()
      .toUpperCase()
      .replace(/[\s-]/g, "");
  }

  /* ── écran de verrouillage ── */
  function lockHTML() {
    return (
      '<div class="sgp-lock" id="sgpLock"><div class="sgp-card">' +
      '<div class="sgp-logo"></div>' +
      "<h1>Le Studio Premium</h1>" +
      '<p class="sgp-sub">Entre l’email utilisé pour ton achat et ton code d’accès (reçu juste après l’achat).<br/><span class="sgp-en">Enter your purchase email and your access code (sent right after purchase).</span></p>' +
      '<input type="email" id="sgpEmail" placeholder="ton@email.com" autocomplete="email"/>' +
      '<input type="text" id="sgpCode" placeholder="Code d’accès · Access code" autocomplete="off" style="text-transform:uppercase"/>' +
      '<button class="sgp-btn" id="sgpGo">Déverrouiller · Unlock →</button>' +
      '<p class="sgp-err" id="sgpErr"></p>' +
      '<p class="sgp-help">Pas encore de code ? <a href="https://schicgirl.me/fr/le-studio-premium/">Découvre le Studio Premium</a><br/>Un souci ? Écris-moi sur <a href="https://facebook.com/schicgirl">Facebook</a> 💛</p>' +
      "</div></div>"
    );
  }
  function showLock() {
    if (document.getElementById("sgpLock")) return;
    var d = document.createElement("div");
    d.innerHTML = lockHTML();
    document.body.appendChild(d.firstChild);
    document.getElementById("sgpGo").addEventListener("click", tryUnlock);
    document
      .getElementById("sgpCode")
      .addEventListener("keydown", function (e) {
        if (e.key === "Enter") tryUnlock();
      });
  }
  function hideLock() {
    var el = document.getElementById("sgpLock");
    if (el) el.parentNode.removeChild(el);
  }
  function tryUnlock() {
    var email = normEmail(document.getElementById("sgpEmail").value),
      code = normCode(document.getElementById("sgpCode").value),
      err = document.getElementById("sgpErr");
    if (!email || email.indexOf("@") < 0) {
      err.textContent = "Entre un email valide · Enter a valid email";
      return;
    }
    if (!code) {
      err.textContent = "Entre ton code d’accès · Enter your access code";
      return;
    }
    err.textContent = "";
    document.getElementById("sgpGo").textContent = "Vérification…";
    sha256(code).then(function (h) {
      if (!h || CODE_HASHES.indexOf(h) < 0) {
        err.textContent =
          h === false
            ? "Navigateur non compatible — ouvre le Studio en HTTPS · Browser not supported, open the Studio over HTTPS"
            : "Code incorrect. Vérifie ton email d’achat · Wrong code, check your purchase email.";
        document.getElementById("sgpGo").textContent =
          "Déverrouiller · Unlock →";
        return;
      }
      auth = { email: email, code: code, ts: Date.now() };
      try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      } catch (e) {}
      pullRemote(function () {
        hideLock();
        var hh = (location.hash || "#home").slice(1);
        go(IDS.indexOf(hh) >= 0 ? hh : "home");
        pushRemote();
      });
    });
  }

  /* ── synchronisation cloud ── */
  function sbHeaders(extra) {
    var h = {
      apikey: SB_KEY,
      Authorization: "Bearer " + SB_KEY,
      "Content-Type": "application/json",
    };
    for (var k in extra || {}) h[k] = extra[k];
    return h;
  }
  function mergeRemote(remote) {
    if (!remote || typeof remote !== "object") return;
    S.courses = S.courses || {};
    remote.courses = remote.courses || {};
    for (var cid in remote.courses) {
      S.courses[cid] = S.courses[cid] || {};
      for (var mid in remote.courses[cid]) {
        if (remote.courses[cid][mid]) S.courses[cid][mid] = true;
      }
    }
    S.done = S.done || {};
    for (var k in remote.done || {}) {
      if (remote.done[k]) S.done[k] = true;
    }
    if ((!S.goals || !S.goals.length) && remote.goals && remote.goals.length)
      S.goals = remote.goals;
    ["profile", "tables", "checks"].forEach(function (key) {
      var loc = S[key] || {},
        rem = remote[key] || {};
      for (var kk in rem) {
        if (loc[kk] === undefined || loc[kk] === null || loc[kk] === "")
          loc[kk] = rem[kk];
      }
      S[key] = loc;
    });
    if (remote.streak && (!S.streak || remote.streak > S.streak))
      S.streak = remote.streak;
    sv();
  }
  /* Lecture/écriture via des fonctions Supabase verrouillées (sgp_pull / sgp_push),
   PAS la table directe : la clé anon ne peut plus "vider" la table des acheteuses.
   Il faut connaître le couple email+code pour lire une seule ligne. */
  function pullRemote(done) {
    if (!auth) return done && done();
    fetch(SB_URL + "/rest/v1/rpc/sgp_pull", {
      method: "POST",
      headers: sbHeaders(),
      body: JSON.stringify({ p_email: auth.email, p_code: auth.code }),
    })
      .then(function (r) {
        return r.ok ? r.json() : null;
      })
      .then(function (state) {
        if (state && typeof state === "object") mergeRemote(state);
      })
      .catch(function () {})
      .then(function () {
        done && done();
      });
  }
  var syncTimer = null,
    syncDirty = false;
  function pushRemote() {
    if (!auth) return;
    syncDirty = false;
    var body = JSON.stringify({
      p_email: auth.email,
      p_code: auth.code,
      p_state: S,
    });
    fetch(SB_URL + "/rest/v1/rpc/sgp_push", {
      method: "POST",
      headers: sbHeaders(),
      body: body,
    })
      .then(function (r) {
        if (!r.ok) syncDirty = true;
      })
      .catch(function () {
        syncDirty = true;
      });
  }
  function scheduleSync() {
    syncDirty = true;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(pushRemote, 2000);
  }
  /* chaque sauvegarde locale déclenche une sauvegarde cloud (différée de 2 s) */
  var _sv = sv;
  sv = function () {
    _sv();
    scheduleSync();
  };
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && syncDirty) pushRemote();
  });

  /* ── démarrage ── */
  if (auth && auth.email && auth.code) {
    sha256(auth.code).then(function (h) {
      if (!h || CODE_HASHES.indexOf(h) < 0) {
        // code révoqué, ou SHA-256 indisponible
        try {
          localStorage.removeItem(AUTH_KEY);
        } catch (e) {}
        auth = null;
        showLock();
        return;
      }
      pullRemote(function () {
        var hh = (location.hash || "#home").slice(1);
        go(IDS.indexOf(hh) >= 0 ? hh : "home");
      });
    });
  } else {
    showLock();
  }
  window.sgpLogout = function () {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch (e) {}
    location.reload();
  };
})();
