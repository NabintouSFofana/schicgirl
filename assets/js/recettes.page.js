var EBOOK = {"slug": "recettes", "img_fr": "assets/recettes-fr.webp", "img_en": "assets/recettes-en.webp", "url_fr": "https://selar.com/recettes_FR", "url_en": "https://selar.com/recipes_EN", "price_fr": "9€", "price_en": "$10", "price_cfa": "≈ 6 000 FCFA", "cta_fr": "Obtenir mes recettes →", "cta_en": "Get my recipes →"};
  var LANG = "fr";
  function ab(p){ return (!p || p.charAt(0)==="/" || /^https?:/.test(p)) ? p : "/"+p.replace(/^\.?\//,""); }
  function T(o,k){ return LANG==="fr" ? (o[k+"_fr"]||o[k+"_en"]||"") : (o[k+"_en"]||o[k+"_fr"]||""); }
  function render(){
    document.querySelectorAll("ul[data-lang]").forEach(function(u){u.classList.toggle("hide", u.getAttribute("data-lang")!==LANG);});
    document.documentElement.lang = LANG;
    document.querySelectorAll("[data-fr]").forEach(function(el){
      el.innerHTML = LANG==="fr" ? el.getAttribute("data-fr") : el.getAttribute("data-en");
    });
    var url = T(EBOOK,"url");
    var price = T(EBOOK,"price");
    var cfa = LANG==="fr" ? (EBOOK.price_cfa||"") : "";
    document.getElementById("mainCta").setAttribute("href", url);
    document.getElementById("barCta").setAttribute("href", url);
    document.getElementById("mainCta").textContent = LANG==="fr" ? EBOOK.cta_fr : EBOOK.cta_en;
    document.getElementById("barCta").textContent = LANG==="fr" ? "Obtenir →" : "Get it →";
    document.getElementById("price").textContent = price;
    document.getElementById("barPrice").textContent = price;
    document.getElementById("priceCfa").textContent = cfa;
    document.getElementById("barCfa").textContent = cfa;
    var cov = document.getElementById("cover");
    if (cov){ var src = T(EBOOK,"img"); if(src){ var _cs = ab(src); cov.setAttribute("src", _cs + (_cs.indexOf("?")<0?"?v=20260705b":"")); } }
    var suf = LANG==="en" ? "-en" : "";
    var pi = document.getElementById("prevInside");
    var pd = document.getElementById("prevDetail");
    if (pi){ pi.setAttribute("src",ab("assets/previews/"+EBOOK.slug+"-inside"+suf+".png")); }
    if (pd){ pd.setAttribute("src",ab("assets/previews/"+EBOOK.slug+"-detail"+suf+".png")); }
  }
  function zoomPrev(src){
    var lb=document.getElementById("prevLightbox");
    document.getElementById("prevLightboxImg").setAttribute("src",src);
    lb.classList.add("open");
  }
  function closePrev(){ document.getElementById("prevLightbox").classList.remove("open"); }
  document.addEventListener("keydown",function(e){ if(e.key==="Escape") closePrev(); });
  function setLang(l){
    LANG=l;
    document.getElementById("btnEn").classList.toggle("is-active", l==="en");
    document.getElementById("btnFr").classList.toggle("is-active", l==="fr");
    render();
  }
  var qp = new URLSearchParams(location.search).get("lang");
  setLang(((new URLSearchParams(location.search).get("lang"))||document.documentElement.getAttribute("lang"))==="en"?"en":"fr");
  try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
