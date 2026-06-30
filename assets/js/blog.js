/*
  SCHICGIRL — blog.js · schicgirl.me
  Shared blog engine: post data + grid/sidebar rendering, live search
  and category filtering on the index, link-outs on article pages.
  © 2024–2026 Schicgirl. All rights reserved.
*/
(function () {
  "use strict";

  // ── Categories (bilingual labels) ──
  var CATS = {
    bases:        { fr: "Les bases",   en: "Basics" },
    diagnostic:   { fr: "Diagnostic",  en: "Diagnosis" },
    routine:      { fr: "Routine",     en: "Routine" },
    hydratation:  { fr: "Hydratation", en: "Moisture" },
    coiffures:    { fr: "Coiffures",   en: "Styles" },
    pousse:       { fr: "Pousse",      en: "Growth" },
    "cuir-chevelu": { fr: "Cuir chevelu", en: "Scalp" }
  };

  // ── Posts (newest first) ──
  var POSTS = [
    { slug: "journal-capillaire", cat: "routine", emoji: "📔", img: "blog/journal_capillaire.webp", date: "2026-06-29",
      title_fr: "Tenir un journal capillaire : la méthode qui change tout",
      title_en: "Keeping a hair journal: the habit that changes everything",
      exc_fr: "Arrête de deviner. Note ce que tu fais, et tes cheveux te diront ce qui marche.",
      exc_en: "Stop guessing. Track what you do, and your hair will tell you what works.",
      read_fr: "6 min de lecture", read_en: "6 min read" },

    { slug: "demelage-sans-casse", cat: "routine", emoji: "🪮", img: "blog/demelage-sans-casse.jpg", date: "2026-06-29",
      title_fr: "Démêler ses cheveux crépus sans casse : la bonne méthode",
      title_en: "Detangling 4C hair without breakage: the right way",
      exc_fr: "90 % de la casse arrive au démêlage. Voici comment l'éviter, doigts et patience.",
      exc_en: "90% of breakage happens while detangling. Here's how to avoid it.",
      read_fr: "6 min de lecture", read_en: "6 min read" },

    { slug: "ingredients-a-eviter", cat: "bases", emoji: "🏷️", img: "blog/ingredients-a-eviter.jpg", date: "2026-06-29",
      title_fr: "Lire une étiquette : les ingrédients à éviter (et pourquoi)",
      title_en: "Reading labels: the ingredients to avoid (and why)",
      exc_fr: "Sulfates, silicones, alcools desséchants : ce qui assèche vraiment tes cheveux crépus.",
      exc_en: "Sulfates, silicones, drying alcohols: what really dries out coily hair.",
      read_fr: "6 min de lecture", read_en: "6 min read" },

    { slug: "hydrater-cheveux-crepus-secs", cat: "hydratation", emoji: "💧", img: "blog/blog3.jpg", date: "2026-06-22",
      title_fr: "Cheveux crépus toujours secs ? Voici pourquoi (et la solution)",
      title_en: "4C hair always dry? Here's why (and the fix)",
      exc_fr: "Hydrater n'est pas sceller. Comprends ta porosité et retiens enfin l'eau.",
      exc_en: "Moisturizing isn't sealing. Understand your porosity and finally lock water in.",
      read_fr: "7 min de lecture", read_en: "7 min read" },

    { slug: "wash-day-cheveux-crepus", cat: "routine", emoji: "🚿", img: "blog/blog2.jpg", date: "2026-06-22",
      title_fr: "Le wash day parfait pour cheveux crépus 4C",
      title_en: "The perfect wash day for 4C coily hair",
      exc_fr: "Pré-poo, lavage, soin, LOC : la routine du jour de lavage, étape par étape.",
      exc_en: "Pre-poo, cleanse, condition, LOC: the wash day routine, step by step.",
      read_fr: "8 min de lecture", read_en: "8 min read" },

    { slug: "transition-sans-big-chop", cat: "bases", emoji: "🌀", img: "blog/blog1.jpg", date: "2026-06-22",
      title_fr: "Transition sans big chop : passer au naturel en douceur",
      title_en: "Transitioning to natural hair without a big chop",
      exc_fr: "Abandonner le défrisage sans tout couper ? Voici comment gérer deux textures sans casse.",
      exc_en: "Ditch relaxers without cutting it all off? Here's how to manage two textures without breakage.",
      read_fr: "7 min de lecture", read_en: "7 min read" },

    { slug: "routine-nuit-satin", cat: "routine", emoji: "🌙", img: "blog/routine-nuit-satin.jpg", date: "2026-06-18",
      title_fr: "La routine de nuit qui sauve tes cheveux",
      title_en: "The night routine that saves your hair",
      exc_fr: "Satin, pineapple, hydratation : protège tes boucles pendant que tu dors.",
      exc_en: "Satin, pineapple, moisture: protect your curls while you sleep.",
      read_fr: "5 min de lecture", read_en: "5 min read" },

    { slug: "cuir-chevelu-sain-pellicules", cat: "cuir-chevelu", emoji: "✨", img: "blog/cuir-chevelu-sain-pellicules.jpg", date: "2026-06-15",
      title_fr: "Cuir chevelu sain : adieu démangeaisons et pellicules",
      title_en: "Healthy scalp: goodbye itch and dandruff",
      exc_fr: "La racine de cheveux sains, c'est un cuir chevelu propre et équilibré.",
      exc_en: "Healthy hair starts at a clean, balanced scalp.",
      read_fr: "7 min de lecture", read_en: "7 min read" },

    { slug: "stopper-la-casse", cat: "pousse", emoji: "🌱", img: "blog/stopper-la-casse.jpg", date: "2026-06-11",
      title_fr: "Stopper la casse : la vraie clé de la pousse",
      title_en: "Stop breakage: the real key to growth",
      exc_fr: "Tes cheveux poussent déjà. Le secret, c'est de les garder.",
      exc_en: "Your hair already grows. The secret is keeping the length.",
      read_fr: "7 min de lecture", read_en: "7 min read" },

    { slug: "coiffures-protectrices", cat: "coiffures", emoji: "💇🏾‍♀️", img: "blog/coiffures-protectrices.jpg", date: "2026-06-07",
      title_fr: "Coiffures protectrices : les 6 règles d'or",
      title_en: "Protective styles: the 6 golden rules",
      exc_fr: "Protéger tes longueurs sans étouffer ni casser tes cheveux.",
      exc_en: "Protect your length without suffocating or breaking your hair.",
      read_fr: "6 min de lecture", read_en: "6 min read" },

    { slug: "methode-loc-hydratation", cat: "hydratation", emoji: "🧴", img: "blog/methode-loc-hydratation.jpg", date: "2026-05-30",
      title_fr: "LOC vs LCO : sceller l'hydratation pour de bon",
      title_en: "LOC vs LCO: lock in moisture for good",
      exc_fr: "L'ordre des produits qui garde tes cheveux hydratés des jours.",
      exc_en: "The product order that keeps hair moisturized for days.",
      read_fr: "6 min de lecture", read_en: "6 min read" },

    { slug: "routine-wash-day", cat: "routine", emoji: "🚿", img: "blog/routine-wash-day.jpg", date: "2026-05-22",
      title_fr: "Le wash day parfait en 7 étapes",
      title_en: "The perfect wash day in 7 steps",
      exc_fr: "La méthode complète, du pré-poo au coiffage, sans casse.",
      exc_en: "The full method, from pre-poo to styling, without breakage.",
      read_fr: "8 min de lecture", read_en: "8 min read" },

    { slug: "porosite-cheveux", cat: "diagnostic", emoji: "🔬", img: "blog/porosite-cheveux.jpg", date: "2026-05-14",
      title_fr: "La porosité, expliquée simplement",
      title_en: "Hair porosity, explained simply",
      exc_fr: "Le test du verre d'eau, et ce que ta porosité change vraiment.",
      exc_en: "The glass-of-water test, and what porosity really changes.",
      read_fr: "7 min de lecture", read_en: "7 min read" },

    { slug: "pourquoi-cheveux-crepus-secs", cat: "bases", emoji: "💧", img: "blog/pourquoi-cheveux-crepus-secs.jpg", date: "2026-05-06",
      title_fr: "Pourquoi les cheveux crépus sont (toujours) secs",
      title_en: "Why coily hair is (always) dry",
      exc_fr: "La vraie raison scientifique — et pourquoi ce n'est pas ta faute.",
      exc_en: "The real, scientific reason — and why it's not your fault.",
      read_fr: "6 min de lecture", read_en: "6 min read" }
  ];

  // ── UI labels ──
  var L = {
    search_t:   { fr: "Rechercher",        en: "Search" },
    search_ph:  { fr: "Rechercher un article…", en: "Search articles…" },
    categories: { fr: "Catégories",        en: "Categories" },
    recent:     { fr: "Articles récents",  en: "Recent articles" },
    all:        { fr: "Tous les articles", en: "All articles" },
    none:       { fr: "Aucun article ne correspond.", en: "No articles match." },
    clear:      { fr: "Effacer",           en: "Clear" },
    showing:    { fr: "Catégorie :",       en: "Category:" },
    results_for:{ fr: "Résultats pour",    en: "Results for" },
    about_t:    { fr: "À propos du blog",   en: "About the blog" },
    about_b:    { fr: "Des conseils simples et concrets pour les cheveux crépus Type 4 — sans jargon.", en: "Simple, practical advice for Type 4 coily hair — no jargon." },
    about_link: { fr: "Découvrir Schicgirl →", en: "Discover Schicgirl →" },
    gift_t:     { fr: "Ton kit gratuit",   en: "Your free kit" },
    gift_b:     { fr: "Comprends ta texture et construis ta routine pas à pas.", en: "Understand your texture and build your routine step by step." },
    gift_cta:   { fr: "Recevoir le guide →", en: "Get the guide →" }
  };

  var state = { ctx: "index", slug: "", lang: "fr", cat: "all", q: "" };

  function tx(o) { return state.lang === "fr" ? o.fr : o.en; }
  // Absolute root paths so links/images work from any depth (e.g. /fr/blog/).
  function rootPrefix() { return "/"; }
  function articleHref(slug) { return "/blog/" + slug + ".html" + (state.lang === "en" ? "?lang=en" : ""); }
  function indexHref() { return "/" + state.lang + "/blog/"; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function pTitle(p) { return state.lang === "fr" ? p.title_fr : p.title_en; }
  function pExc(p)   { return state.lang === "fr" ? p.exc_fr : p.exc_en; }
  function pRead(p)  { return state.lang === "fr" ? p.read_fr : p.read_en; }
  function pImg(p)   { return rootPrefix() + "assets/" + (p.img || "logo2.png"); }
  function catLabel(key) { return CATS[key] ? tx(CATS[key]) : key; }

  function counts() {
    var c = {};
    POSTS.forEach(function (p) { c[p.cat] = (c[p.cat] || 0) + 1; });
    return c;
  }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    // A search query is global (ignores the active category); otherwise filter by category.
    if (q) {
      return POSTS.filter(function (p) {
        var hay = (pTitle(p) + " " + pExc(p) + " " + catLabel(p.cat)).toLowerCase();
        return hay.indexOf(q) !== -1;
      });
    }
    return POSTS.filter(function (p) {
      return state.cat === "all" || p.cat === state.cat;
    });
  }

  // ── Card markup (index grid) ──
  function cardHTML(p) {
    return '<a class="post-card" href="' + articleHref(p.slug) + '">' +
      '<img class="pc-thumb-img" src="' + pImg(p) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'" />' +
      '<span class="pc-body">' +
        '<span class="pc-tag">' + esc(catLabel(p.cat)) + '</span>' +
        '<span class="pc-title">' + esc(pTitle(p)) + '</span>' +
        '<span class="pc-excerpt">' + esc(pExc(p)) + '</span>' +
        '<span class="pc-meta"><span>' + esc(pRead(p)) + '</span></span>' +
      '</span></a>';
  }

  // ── Sidebar markup ──
  function sidebarHTML() {
    var c = counts();
    // search
    var html = '<div class="widget"><div class="widget-title">' + esc(tx(L.search_t)) + '</div>' +
      '<form class="sg-search" id="sgSearchForm"' + (state.ctx === "article" ? ' action="' + indexHref() + '" method="get"' : '') + '>' +
      '<input type="search" id="sgSearch" name="q" placeholder="' + esc(tx(L.search_ph)) + '" value="' + esc(state.ctx === "index" ? state.q : "") + '" />' +
      '<button type="submit" aria-label="' + esc(tx(L.search_t)) + '">🔍</button></form></div>';

    // categories
    var catItems = '<a href="' + indexHref() + '" data-cat="all" class="' + (state.cat === "all" ? "is-active" : "") + '">' +
      '<span>' + esc(tx(L.all)) + '</span><span class="cat-count">' + POSTS.length + '</span></a>';
    Object.keys(CATS).forEach(function (key) {
      if (!c[key]) return;
      catItems += '<a href="' + indexHref() + '?cat=' + key + '" data-cat="' + key + '" class="' + (state.cat === key ? "is-active" : "") + '">' +
        '<span>' + esc(catLabel(key)) + '</span><span class="cat-count">' + c[key] + '</span></a>';
    });
    html += '<div class="widget"><div class="widget-title">' + esc(tx(L.categories)) + '</div><nav class="cat-list">' + catItems + '</nav></div>';

    // recent
    var recent = POSTS.filter(function (p) { return p.slug !== state.slug; }).slice(0, 5);
    var recItems = recent.map(function (p) {
      return '<a class="recent-item" href="' + articleHref(p.slug) + '">' +
        '<img class="recent-thumb-img" src="' + pImg(p) + '" alt="" loading="lazy" onerror="this.style.display=\'none\'" />' +
        '<span class="recent-body"><span class="recent-title">' + esc(pTitle(p)) + '</span>' +
        '<span class="recent-meta">' + esc(catLabel(p.cat)) + ' · ' + esc(pRead(p)) + '</span></span></a>';
    }).join("");
    html += '<div class="widget"><div class="widget-title">' + esc(tx(L.recent)) + '</div><div class="recent-list">' + recItems + '</div></div>';

    // free gift CTA
    html += '<div class="widget widget-cta"><div class="widget-title">' + esc(tx(L.gift_t)) + '</div>' +
      '<p>' + esc(tx(L.gift_b)) + '</p>' +
      '<a class="btn btn--block" href="' + rootPrefix() + 'toolkit-landing.html">' + esc(tx(L.gift_cta)) + '</a></div>';

    // about
    html += '<div class="widget about-widget"><img src="' + rootPrefix() + 'assets/logo2.png" alt="Schicgirl" onerror="this.style.display=\'none\'"/>' +
      '<div class="widget-title" style="justify-content:center">' + esc(tx(L.about_t)) + '</div>' +
      '<p>' + esc(tx(L.about_b)) + '<br/><a href="' + rootPrefix() + 'about.html">' + esc(tx(L.about_link)) + '</a></p></div>';

    return html;
  }

  function renderSidebar() {
    var aside = document.getElementById("sgSidebar");
    if (!aside) return;
    aside.innerHTML = sidebarHTML();
    attachSidebar();
  }

  function renderGrid() {
    var grid = document.getElementById("sgGrid");
    if (!grid) return;
    var list = filtered();
    var banner = "";
    if (state.cat !== "all" || state.q) {
      var label = state.q
        ? (tx(L.results_for) + ' "' + esc(state.q) + '"')
        : (tx(L.showing) + " <b>" + esc(catLabel(state.cat)) + "</b>");
      banner = '<div class="filter-banner"><span>' + label + " · " + list.length + '</span>' +
        '<button id="sgClear">' + esc(tx(L.clear)) + '</button></div>';
    }
    var cards = list.length
      ? '<div class="post-grid">' + list.map(cardHTML).join("") + "</div>"
      : '<div class="blog-empty">' + esc(tx(L.none)) + "</div>";
    grid.innerHTML = banner + cards;
    var clr = document.getElementById("sgClear");
    if (clr) clr.addEventListener("click", function () { setFilter("all", ""); });
  }

  function setFilter(cat, q) {
    state.cat = cat; state.q = q;
    if (state.ctx === "index") {
      var qs = [];
      if (cat !== "all") qs.push("cat=" + encodeURIComponent(cat));
      if (q) qs.push("q=" + encodeURIComponent(q));
      var url = "/fr/blog/" + (qs.length ? "?" + qs.join("&") : "");
      try { history.replaceState(null, "", url); } catch (e) {}
    }
    renderSidebar();
    renderGrid();
  }

  function attachSidebar() {
    // category clicks → live filter on index
    if (state.ctx === "index") {
      var links = document.querySelectorAll("#sgSidebar .cat-list a");
      Array.prototype.forEach.call(links, function (a) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          setFilter(a.getAttribute("data-cat"), "");
        });
      });
      var input = document.getElementById("sgSearch");
      var form = document.getElementById("sgSearchForm");
      if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });
      if (input) input.addEventListener("input", function () {
        state.q = input.value;
        if (input.value) {
          // searching is global → drop any active category highlight (without rebuilding the input)
          state.cat = "all";
          Array.prototype.forEach.call(document.querySelectorAll("#sgSidebar .cat-list a"), function (a) {
            a.classList.toggle("is-active", a.getAttribute("data-cat") === "all");
          });
        }
        renderGrid();
      });
    }
  }

  function readQuery() {
    try {
      var sp = new URLSearchParams(location.search);
      var cat = sp.get("cat"); var q = sp.get("q");
      if (cat && CATS[cat]) state.cat = cat;
      if (q) state.q = q;
    } catch (e) {}
  }

  function renderCover() {
    var box = document.getElementById("sgCover");
    if (!box) return;
    var p = POSTS.filter(function (x) { return x.slug === state.slug; })[0];
    if (!p) { box.style.display = "none"; return; }
    box.innerHTML = '<img src="' + pImg(p) + '" alt="' + esc(pTitle(p)) + '" onerror="this.parentElement.style.display=\'none\'" />';
  }

  // ── Public API ──
  window.SchicBlog = {
    posts: POSTS,
    init: function (opts) {
      opts = opts || {};
      state.ctx = opts.ctx || "index";
      state.slug = opts.slug || "";
      if (state.ctx === "index") readQuery();
    },
    render: function (lang) {
      state.lang = lang === "en" ? "en" : "fr";
      renderSidebar();
      if (state.ctx === "index") renderGrid();
      else renderCover();
    }
  };
})();
