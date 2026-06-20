var EBOOK = {"slug": "stop-cheveux-secs", "img_fr": "assets/stop-cheveux-secs.png", "img_en": "assets/stop-dry-hair.png", "url_fr": "https://selar.com/stop-cheveux-secs", "url_en": "https://selar.com/stop-dry-hair", "price_fr": "5€", "price_en": "$6", "price_cfa": "≈ 3 500 FCFA", "cta_fr": "Commencer pour 5€ →", "cta_en": "Start for $6 →"};
  var LANG = "fr";
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
    // cover per language
    var cov = document.getElementById("cover");
    if (cov){ var src = T(EBOOK,"img"); if(src){ cov.setAttribute("src", src); } }
    // interior previews per language
    var suf = LANG==="en" ? "-en" : "";
    var pi = document.getElementById("prevInside");
    var pd = document.getElementById("prevDetail");
    if (pi){ pi.setAttribute("src","assets/previews/"+EBOOK.slug+"-inside"+suf+".png"); }
    if (pd){ pd.setAttribute("src","assets/previews/"+EBOOK.slug+"-detail"+suf+".png"); }
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
  setLang(qp==="en" ? "en" : "fr");
