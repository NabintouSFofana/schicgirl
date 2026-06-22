var LANG = "fr";
  function render(){
    document.querySelectorAll("ul[data-lang]").forEach(function(u){u.classList.toggle("hide", u.getAttribute("data-lang")!==LANG);});
    document.documentElement.lang = LANG;
    document.querySelectorAll("[data-fr]").forEach(function(el){
      el.innerHTML = LANG==="fr" ? el.getAttribute("data-fr") : el.getAttribute("data-en");
    });
    var suf = LANG==="en" ? "-en" : "";
    var cov = document.getElementById("cover");
    if (cov && cov.tagName==="IMG"){ cov.setAttribute("src", LANG==="en" ? "assets/planner-cover-en.svg" : "assets/planner-cover-fr.svg"); }
    var pi = document.getElementById("prevInside"); if(pi){ pi.setAttribute("src","assets/previews/planner-inside"+suf+".png"); }
    var pd = document.getElementById("prevDetail"); if(pd){ pd.setAttribute("src","assets/previews/planner-detail"+suf+".png"); }
    var buy = LANG==="en" ? "https://selar.com/studio-en" : "https://selar.com/studio-fr";
    ["ctaTop","ctaBottom","barCta"].forEach(function(id){ var a=document.getElementById(id); if(a) a.setAttribute("href", buy); });
  }
  function zoomPrev(src){ var lb=document.getElementById("prevLightbox"); document.getElementById("prevLightboxImg").setAttribute("src",src); lb.classList.add("open"); }
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
