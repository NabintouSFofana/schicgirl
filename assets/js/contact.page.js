var LANG = "fr";
  function setLang(l) {
    LANG = l;
    document.getElementById("btnEn").classList.toggle("is-active", l === "en");
    document.getElementById("btnFr").classList.toggle("is-active", l === "fr");
    document.documentElement.lang = l;
    document.querySelectorAll("[data-fr]").forEach(function (el) {
      el.innerHTML = l === "fr" ? el.getAttribute("data-fr") : el.getAttribute("data-en");
    });
    document.querySelectorAll("[data-fr-ph]").forEach(function (el) {
      el.setAttribute("placeholder", l === "fr" ? el.getAttribute("data-fr-ph") : el.getAttribute("data-en-ph"));
    });
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.classList.toggle("hide", el.getAttribute("data-lang") !== l);
    });
  }
  var qp = new URLSearchParams(location.search);
  setLang(((new URLSearchParams(location.search).get("lang"))||document.documentElement.getAttribute("lang"))==="en"?"en":"fr");
