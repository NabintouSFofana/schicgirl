/* SCHICGIRL — Le Studio Premium : accès par COMPTE (email + mot de passe),
   le MÊME compte que le forum (forum.schicgirl.me) — même projet Supabase.

   Remplace l'ancien système de code partagé. Un code partagé ne peut jamais
   distinguer deux personnes qui l'utilisent : impossible de savoir qui paie
   vraiment, et impossible d'empêcher qu'il circule. Un compte individuel
   règle ça structurellement — chaque connexion est une vraie personne.

   L'accès (Studio ET forum) est décidé par la même colonne
   profiles.access_until, via has_forum_access() côté base. Toi, tu ouvres
   30 jours à chaque paiement Selar (voir le doc "le-cercle-selar-setup.md") —
   la même commande vaut pour les deux.

   Chargé APRÈS studio.page.js et studio-premium.page.js. */
(function () {
  var SB_URL = "https://ouwzbqmmtbxqtffghncg.supabase.co";
  var SB_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91d3picW1tdGJ4cXRmZmdobmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwOTU4NDMsImV4cCI6MjA5NjY3MTg0M30.UuRoYPPDL18-J9WyFK5kpFhRguq_9aDeacXDRhdkmD8";
  var SESSION_KEY = "sgp_session";
  var session = null;
  try {
    session = JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (e) {}
  var tab = "login";

  function normEmail(e) {
    return String(e || "").trim().toLowerCase();
  }
  function saveSession(s) {
    session = s;
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(s));
    } catch (e) {}
  }
  function clearSession() {
    session = null;
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  /* ── passerelle forum <-> studio : le même compte ouvre les deux, mais
     chaque sous-domaine a son propre stockage de session (localStorage
     n'est jamais partagé entre schicgirl.me et forum.schicgirl.me), donc
     un jeton passé dans le fragment d'URL (#h=...) évite d'avoir à se
     reconnecter en changeant d'appli — jamais envoyé à un serveur. ── */
  (function consumeHandoff() {
    var m = /^#h=([^.]+)\.(.+)$/.exec(location.hash);
    if (!m) return;
    try {
      history.replaceState(null, "", location.pathname + location.search);
    } catch (e) {}
    saveSession({ access_token: decodeURIComponent(m[1]), refresh_token: decodeURIComponent(m[2]), email: "" });
  })();
  function updateForumLink() {
    var a = document.querySelector(".sgp-forum-link");
    if (!a) return;
    a.href =
      session && session.access_token
        ? "https://forum.schicgirl.me/#h=" + encodeURIComponent(session.access_token) + "." + encodeURIComponent(session.refresh_token)
        : "https://forum.schicgirl.me/";
  }

  /* ── appels bruts à l'API Auth de Supabase (pas besoin du SDK complet) ── */
  function authCall(path, body) {
    return fetch(SB_URL + "/auth/v1/" + path, {
      method: "POST",
      headers: { apikey: SB_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error(j.error_description || j.msg || j.error || "Erreur (" + r.status + ")");
        return j;
      });
    });
  }
  function signUp(email, password) {
    return authCall("signup", { email: email, password: password });
  }
  function signIn(email, password) {
    return authCall("token?grant_type=password", { email: email, password: password });
  }

  /* ── appel RPC authentifié : apikey = clé publique, Authorization = le vrai
     jeton de LA PERSONNE connectée (auth.uid() en depend côté base) ── */
  function rpc(name, args) {
    if (!session || !session.access_token) return Promise.reject(new Error("non connectee"));
    return fetch(SB_URL + "/rest/v1/rpc/" + name, {
      method: "POST",
      headers: {
        apikey: SB_KEY,
        Authorization: "Bearer " + session.access_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(args || {}),
    }).then(function (r) {
      if (!r.ok) return r.text().then(function (t) { throw new Error(t.slice(0, 200)); });
      return r.status === 204 ? null : r.json();
    });
  }

  /* ── écran de connexion / création de compte ── */
  function lockHTML() {
    return (
      '<div class="sgp-lock" id="sgpLock"><div class="sgp-card">' +
      '<div class="sgp-logo"></div>' +
      "<h1>Le Studio Premium</h1>" +
      '<div class="sgp-tabs">' +
      '<button class="sgp-tab on" id="sgpTabLogin">Se Connecter · Sign In</button>' +
      '<button class="sgp-tab" id="sgpTabRegister">Créer un Compte · Create Account</button>' +
      "</div>" +
      '<p class="sgp-sub">Le même compte que ton forum privé (forum.schicgirl.me).<br/>' +
      '<span class="sgp-en">The same account as your private forum (forum.schicgirl.me).</span></p>' +
      '<input type="email" id="sgpEmail" placeholder="ton@email.com" autocomplete="email"/>' +
      '<input type="password" id="sgpPassword" placeholder="Mot de passe · Password" autocomplete="current-password"/>' +
      '<button class="sgp-btn" id="sgpGo">Entrer · Enter →</button>' +
      '<p class="sgp-err" id="sgpErr"></p>' +
      '<p class="sgp-help">Pas encore abonnée ? <a href="https://schicgirl.me/fr/le-cercle/">Rejoindre Le Cercle</a><br/>' +
      "Un souci ? Écris-moi sur <a href=\"https://facebook.com/schicgirl\">Facebook</a> 💛</p>" +
      "</div></div>"
    );
  }
  function showLock() {
    if (document.getElementById("sgpLock")) return;
    var d = document.createElement("div");
    d.innerHTML = lockHTML();
    document.body.appendChild(d.firstChild);
    document.getElementById("sgpTabLogin").addEventListener("click", function () { setTab("login"); });
    document.getElementById("sgpTabRegister").addEventListener("click", function () { setTab("register"); });
    document.getElementById("sgpGo").addEventListener("click", trySubmit);
    document.getElementById("sgpPassword").addEventListener("keydown", function (e) {
      if (e.key === "Enter") trySubmit();
    });
  }
  function setTab(t) {
    tab = t;
    document.getElementById("sgpTabLogin").classList.toggle("on", t === "login");
    document.getElementById("sgpTabRegister").classList.toggle("on", t === "register");
    document.getElementById("sgpGo").textContent =
      t === "login" ? "Entrer · Enter →" : "Créer mon compte · Create my account →";
    document.getElementById("sgpErr").textContent = "";
  }
  function hideLock() {
    var el = document.getElementById("sgpLock");
    if (el) el.parentNode.removeChild(el);
  }
  function trySubmit() {
    var email = normEmail(document.getElementById("sgpEmail").value),
      password = document.getElementById("sgpPassword").value,
      err = document.getElementById("sgpErr"),
      btn = document.getElementById("sgpGo");
    if (!email || email.indexOf("@") < 0) {
      err.textContent = "Entre un email valide · Enter a valid email";
      return;
    }
    if (!password || password.length < 6) {
      err.textContent = "Mot de passe : 6 caractères minimum · Password: 6 characters minimum";
      return;
    }
    err.textContent = "";
    var was = btn.textContent;
    btn.textContent = "…";
    var op = tab === "login" ? signIn(email, password) : signUp(email, password);
    op.then(function (data) {
      if (!data.access_token) {
        // inscription sans confirmation email desactivee cote Supabase =
        // access_token revient directement ; sinon, lui dire de se reconnecter
        err.textContent = "Compte créé — connecte-toi maintenant · Account created — sign in now";
        setTab("login");
        btn.textContent = was;
        return;
      }
      saveSession({ access_token: data.access_token, refresh_token: data.refresh_token, email: email });
      afterLogin();
    }).catch(function (e) {
      err.textContent = String((e && e.message) || e).slice(0, 140);
      btn.textContent = was;
    });
  }

  /* ── une fois connectée : verifier l'abonnement, puis ouvrir ou refuser ── */
  function afterLogin() {
    rpc("has_forum_access").then(function (ok) {
      if (ok !== true) {
        clearSession();
        var err = document.getElementById("sgpErr");
        if (err) err.textContent =
          "Ce compte n'a pas (ou plus) d'abonnement actif au Cercle · This account has no active Circle subscription";
        var btn = document.getElementById("sgpGo");
        if (btn) btn.textContent = tab === "login" ? "Entrer · Enter →" : "Créer mon compte · Create my account →";
        return;
      }
      pullRemote(function () {
        hideLock();
        updateForumLink();
        var hh = (location.hash || "#home").slice(1);
        go(IDS.indexOf(hh) >= 0 ? hh : "home");
      });
    }).catch(function (e) {
      clearSession();
      var err = document.getElementById("sgpErr");
      if (err) err.textContent = "Erreur de vérification — réessaie · Verification error — try again";
      console.warn("[SGP] has_forum_access:", e);
    });
  }

  /* ── synchronisation cloud : la progression vit dans profiles.studio_state,
     lue/ecrite par studio_pull()/studio_push() — plus d'email+code a fournir,
     auth.uid() suffit puisque le jeton identifie deja la bonne personne ── */
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
    if ((!S.goals || !S.goals.length) && remote.goals && remote.goals.length) S.goals = remote.goals;
    ["profile", "tables", "checks"].forEach(function (key) {
      var loc = S[key] || {}, rem = remote[key] || {};
      for (var kk in rem) {
        if (loc[kk] === undefined || loc[kk] === null || loc[kk] === "") loc[kk] = rem[kk];
      }
      S[key] = loc;
    });
    if (remote.streak && (!S.streak || remote.streak > S.streak)) S.streak = remote.streak;
    sv();
  }
  function pullRemote(done) {
    if (!session) return done && done();
    rpc("studio_pull")
      .then(function (state) {
        if (state && typeof state === "object") mergeRemote(state);
      })
      .catch(function (e) {
        console.warn("[SGP sync] pull error:", e && e.message);
      })
      .then(function () {
        done && done();
      });
  }
  var syncTimer = null, syncDirty = false;
  function pushRemote() {
    if (!session) return;
    syncDirty = false;
    rpc("studio_push", { p_state: S }).catch(function (e) {
      syncDirty = true;
      console.warn("[SGP sync] push error:", e && e.message);
    });
  }
  function scheduleSync() {
    syncDirty = true;
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(pushRemote, 2000);
  }
  var _sv = sv;
  sv = function () {
    _sv();
    scheduleSync();
  };
  document.addEventListener("visibilitychange", function () {
    if (document.hidden && syncDirty) pushRemote();
  });

  /* ── démarrage : session existante -> verifier qu'elle est toujours valide ── */
  if (session && session.access_token) {
    rpc("has_forum_access")
      .then(function (ok) {
        if (ok !== true) {
          clearSession();
          showLock();
          return;
        }
        pullRemote(function () {
          updateForumLink();
          var hh = (location.hash || "#home").slice(1);
          go(IDS.indexOf(hh) >= 0 ? hh : "home");
        });
      })
      .catch(function () {
        clearSession();
        showLock();
      });
  } else {
    showLock();
  }
  window.sgpLogout = function () {
    clearSession();
    location.reload();
  };
})();
