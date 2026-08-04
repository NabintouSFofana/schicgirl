/*
  SCHICGIRL — site-complete.js
  Moteur partage par les cinq pages du site : index, shop, blog, about
  et contact. Gere la langue FR/EN, le menu mobile, l'apparition au
  defilement, et le rendu des grilles produits / articles.

  Les donnees ne sont PAS dupliquees ici :
    · produits  → assets/js/catalog.js  (window.SG_CATALOG)
    · articles  → assets/js/blog.js     (window.SchicBlog.posts)
  Ce fichier ne fait que les mettre en page.

  Les anciennes pages (index-v1.html, shop-v1.html…) sont conservees
  mais ne chargent pas ce fichier : elles gardent leur propre code.
  © 2024–2026 Schicgirl. All rights reserved.
*/
(function () {
  "use strict";

  /* ── Petits utilitaires ─────────────────────────────────── */
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* L'apostrophe est echappee elle aussi : sans elle, une valeur placee
     dans un attribut ecrit en quotes simples pourrait s'en echapper. */
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* N'autorise que les schemas d'URL sans danger (meme regle que le site). */
  function safeUrl(u) {
    var s = String(u || "").trim();
    if (!s) return "#";
    if (s[0] === "#" || s[0] === "/" || /^(https?:|mailto:|tel:)/i.test(s)) return s;
    if (!/^[a-z][a-z0-9+.\-]*:/i.test(s)) return s;
    return "#";
  }

  var isExt = function (u) { return /^(https?:|mailto:)/i.test(String(u || "")); };
  var extAttr = function (u) { return isExt(u) ? ' target="_blank" rel="noopener noreferrer"' : ""; };

  /* Une image qui echoue est reessayee UNE fois avant d'etre cachee :
     sur une connexion instable, un simple hoquet ne doit pas laisser une
     carte vide pour toute la visite. Au second echec on cache l'image et
     le fond creme de .card-media prend le relais. */
  function retryOnce(img) {
    if (img.dataset.retried) return false;
    img.dataset.retried = "1";
    var src = img.getAttribute("src");
    img.setAttribute("src", src + (src.indexOf("?") < 0 ? "?" : "&") + "r=1");
    return true;
  }

  window.sgImgFallback = function (img) {
    if (!retryOnce(img)) img.style.display = "none";
  };

  /* Pour les grandes images de mise en page : au second echec on replie
     tout le bloc, sinon on laisse une colonne vide dans la grille. */
  window.sgArtFallback = function (img, sel) {
    if (retryOnce(img)) return;
    var box = img.closest(sel);
    if (box) box.style.display = "none";
  };

  var IMG_ERR = ' onerror="sgImgFallback(this)"';

  /* ── Langue ─────────────────────────────────────────────── */
  var LANG = "fr";
  try {
    var saved = localStorage.getItem("sg_lang");
    if (saved === "fr" || saved === "en") LANG = saved;
  } catch (e) {}
  var q = (location.search.match(/[?&]lang=(fr|en)/i) || [])[1];
  if (q) LANG = q.toLowerCase();

  /* Prend la bonne variante d'un objet : tx(o,"title") → o.title_fr / o.title_en */
  function tx(o, k) {
    if (!o) return "";
    return o[k + "_" + LANG] || o[k + "_fr"] || o[k] || "";
  }

  /* Applique data-fr / data-en a tout le document. Les attributs peuvent
     contenir du HTML volontaire (ecrit par nous, jamais par un visiteur). */
  function applyLang() {
    document.documentElement.lang = LANG;

    $$("[data-fr]").forEach(function (el) {
      var v = el.getAttribute("data-" + LANG) || el.getAttribute("data-fr");
      if (v != null) el.innerHTML = v;
    });
    /* data-fr-attr / data-en-attr : "attribut:valeur", plusieurs paires
       separees par « | ». Ex. "alt:Mon histoire|src:assets/MonHistoire.webp"
       Seuls les attributs de cette liste sont acceptes : sans ce filtre,
       une paire "onclick:..." poserait un gestionnaire d'evenement, ce qui
       transformerait une simple traduction en execution de code. */
    var ATTR_OK = { alt: 1, src: 1, title: 1, placeholder: 1, "aria-label": 1, srcset: 1 };
    $$("[data-fr-attr]").forEach(function (el) {
      var spec = el.getAttribute("data-" + LANG + "-attr") || el.getAttribute("data-fr-attr");
      if (!spec) return;
      spec.split("|").forEach(function (pair) {
        var i = pair.indexOf(":");
        if (i <= 0) return;
        var name = pair.slice(0, i).trim().toLowerCase();
        var value = pair.slice(i + 1);
        if (!ATTR_OK[name]) return;
        /* src/srcset passent par le meme filtre d'URL que les liens. */
        if (name === "src" || name === "srcset") value = safeUrl(value);
        el.setAttribute(name, value);
      });
    });
    /* Liens dont la cible depend de la langue : data-href-fr / data-href-en */
    $$("[data-href-fr]").forEach(function (el) {
      var h = el.getAttribute("data-href-" + LANG) || el.getAttribute("data-href-fr");
      if (h) el.setAttribute("href", safeUrl(h));
    });
    /* Titre et description de la page */
    var t = document.documentElement.getAttribute("data-title-" + LANG);
    if (t) document.title = t;

    $$(".langtog button").forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-lang") === LANG);
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === LANG ? "true" : "false");
    });

    document.dispatchEvent(new CustomEvent("sg:lang", { detail: { lang: LANG } }));
  }

  function setLang(next) {
    if (next !== "fr" && next !== "en") return;
    LANG = next;
    try { localStorage.setItem("sg_lang", LANG); } catch (e) {}
    applyLang();
  }

  /* ── Menu mobile ────────────────────────────────────────── */
  function initNav() {
    var burger = $("#burger"), links = $("#navLinks");
    if (!burger || !links) return;

    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.textContent = open ? "✕" : "☰";
    });
    /* Un clic sur un lien referme le menu. */
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        burger.textContent = "☰";
      }
    });
  }

  /* ── Apparition au defilement ───────────────────────────── */
  function initReveal() {
    var els = $$(".reveal");
    if (!els.length) return;
    if (!("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: .08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ═══════════════════════════════════════════════════════
     RENDU — PRODUITS (depuis catalog.js)
     ═══════════════════════════════════════════════════════ */
  function products() {
    return (window.SG_CATALOG && window.SG_CATALOG.products) || [];
  }

  function productCard(p) {
    var img   = tx(p, "img");
    var badge = tx(p, "badge");
    var bonus = tx(p, "bonus");
    var url   = safeUrl(tx(p, "url"));
    var cta   = LANG === "fr" ? "Découvrir" : "See the guide";

    return '' +
      '<article class="card">' +
        '<a class="card-media" href="' + url + '"' + extAttr(url) + ' aria-hidden="true" tabindex="-1">' +
          (badge ? '<span class="badge">' + esc(badge) + '</span>' : "") +
          (img ? '<img src="' + esc(img) + '" alt="" loading="lazy" decoding="async"' + IMG_ERR + '>' : "") +
        '</a>' +
        '<div class="card-body">' +
          '<h3><a href="' + url + '"' + extAttr(url) + '>' + esc(tx(p, "title")) + '</a></h3>' +
          '<p class="card-txt">' + esc(tx(p, "desc")) + '</p>' +
          (bonus ? '<p class="card-txt" style="color:var(--gold-deep);font-weight:600">' + esc(bonus) + '</p>' : "") +
          '<div class="card-foot">' +
            '<div class="price">' +
              '<span class="amt">' + esc(tx(p, "price")) + '</span>' +
              (p.cfa ? '<span class="cfa">' + esc(p.cfa) + '</span>' : "") +
            '</div>' +
            '<a class="btn btn-gold btn-sm btn-block" style="margin-top:13px" href="' + url + '"' + extAttr(url) + '>' +
              esc(cta) + ' →</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /* limit : nombre max de produits (0 ou absent = tous) */
  function renderProducts(sel, limit) {
    var box = $(sel);
    if (!box) return;
    var list = products();
    if (limit) list = list.slice(0, limit);
    if (!list.length) {
      box.innerHTML = '<p class="empty">' +
        (LANG === "fr" ? "Aucun guide à afficher pour le moment." : "No guides to show right now.") + "</p>";
      return;
    }
    box.innerHTML = list.map(productCard).join("");
  }

  /* ═══════════════════════════════════════════════════════
     RENDU — ARTICLES (depuis blog.js)
     ═══════════════════════════════════════════════════════ */
  function posts() {
    return (window.SchicBlog && window.SchicBlog.posts) || [];
  }

  /* Memes chemins que blog.js : racine absolue, et ?lang=en en anglais
     pour que l'article s'ouvre dans la bonne langue. */
  var postImg = function (p) { return "/assets/" + (p.img || "logo2.webp"); };
  var postUrl = function (p) { return "/blog/" + p.slug + ".html" + (LANG === "en" ? "?lang=en" : ""); };

  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return "";
    return d.toLocaleDateString(LANG === "fr" ? "fr-FR" : "en-GB",
      { day: "numeric", month: "long", year: "numeric" });
  }

  function postCard(p) {
    var url = postUrl(p);
    return '' +
      '<article class="card">' +
        '<a class="card-media" href="' + esc(url) + '" aria-hidden="true" tabindex="-1">' +
          '<img src="' + esc(postImg(p)) + '" alt="" loading="lazy" decoding="async"' + IMG_ERR + '>' +
        '</a>' +
        '<div class="card-body">' +
          '<span class="chip">' + esc(p.emoji || "✦") + " " + esc(catLabel(p.cat)) + '</span>' +
          '<h3><a href="' + esc(url) + '">' + esc(tx(p, "title")) + '</a></h3>' +
          '<p class="card-txt">' + esc(tx(p, "exc")) + '</p>' +
          '<div class="card-foot" style="display:flex;justify-content:space-between;gap:10px;' +
               'font-size:12px;color:var(--faint)">' +
            '<span>' + esc(fmtDate(p.date)) + '</span>' +
            '<span>' + esc(tx(p, "read")) + '</span>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  /* Libelles de categorie. blog.js garde les siens en interne, donc on
     redefinit ici la meme table — en incluant "comprendre" et "produits",
     que la table de blog.js ne couvre pas encore. */
  var CATS = {
    bases:          { fr: "Les bases",    en: "Basics" },
    comprendre:     { fr: "Comprendre",   en: "Understand" },
    diagnostic:     { fr: "Diagnostic",   en: "Diagnosis" },
    routine:        { fr: "Routine",      en: "Routine" },
    hydratation:    { fr: "Hydratation",  en: "Moisture" },
    produits:       { fr: "Produits",     en: "Products" },
    coiffures:      { fr: "Coiffures",    en: "Styles" },
    pousse:         { fr: "Pousse",       en: "Growth" },
    "cuir-chevelu": { fr: "Cuir chevelu", en: "Scalp" }
  };
  function catLabel(k) { return CATS[k] ? CATS[k][LANG] : k; }

  function renderPosts(sel, limit) {
    var box = $(sel);
    if (!box) return;
    var list = posts();
    if (limit) list = list.slice(0, limit);
    box.innerHTML = list.length
      ? list.map(postCard).join("")
      : '<p class="empty">' + (LANG === "fr" ? "Aucun article." : "No articles.") + "</p>";
  }

  /* ── API publique ───────────────────────────────────────── */
  window.SGSite = {
    get lang() { return LANG; },
    setLang: setLang,
    tx: tx, esc: esc, safeUrl: safeUrl, extAttr: extAttr,
    products: products, productCard: productCard, renderProducts: renderProducts,
    posts: posts, postCard: postCard, renderPosts: renderPosts,
    postUrl: postUrl, postImg: postImg, fmtDate: fmtDate,
    cats: CATS, catLabel: catLabel,
    onLang: function (fn) {
      document.addEventListener("sg:lang", function (e) { fn(e.detail.lang); });
    }
  };

  /* ── Demarrage ──────────────────────────────────────────── */
  function boot() {
    $$(".langtog button").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
    });
    initNav();
    applyLang();
    initReveal();
    var y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
