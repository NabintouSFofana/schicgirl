SchicBlog.init({ ctx: "article", slug: "methode-loc-hydratation" });
  var LANG = "fr";
  function setLang(l) {
    LANG = l;
    document.getElementById("btnEn").classList.toggle("is-active", l === "en");
    document.getElementById("btnFr").classList.toggle("is-active", l === "fr");
    document.documentElement.lang = l;
    document.querySelectorAll("[data-fr]").forEach(function (el) {
      el.innerHTML = l === "fr" ? el.getAttribute("data-fr") : el.getAttribute("data-en");
    });
    document.querySelectorAll("[data-fr-href]").forEach(function (el) {
      el.setAttribute("href", l === "fr" ? el.getAttribute("data-fr-href") : el.getAttribute("data-en-href"));
    });
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.classList.toggle("hide", el.getAttribute("data-lang") !== l);
    });
    SchicBlog.render(l);
  }
  var qp = new URLSearchParams(location.search).get("lang");
  setLang(qp === "en" ? "en" : "fr");
  try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
