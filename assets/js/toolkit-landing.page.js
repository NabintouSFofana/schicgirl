/* ============================================================
   CONFIG — edit these two lines, then you're live.
   1. ACCESS_URL : where the toolkit lives (your Selar free
      product link, or a Google Drive / Dropbox link to the 3
      PDFs). This is what the "Open my guides" button opens.
   2. FORM_ENDPOINT : paste your Google Apps Script Web app URL
      (from schicgirl-signups-backend.gs — it ends in /exec) so
      signups land in your own Sheet and show in the admin page.
      Leave "" and the page still works (instant access).
============================================================ */
const CONFIG = {
  // Where people get the free toolkit after signing up — one Selar link
  // per language. The success-screen button opens the right one.
  ACCESS_URL: {
    fr: "https://selar.com/toolkitfr",
    en: "https://selar.com/toolkiten"
  },

  // Your signups backend (Google Apps Script URL ending in /exec).
  FORM_ENDPOINT: "",

  // Your 3 guides per language. The 'u' values are your PDF URLs, base64-
  // encoded so they aren't sitting in plain page source. Buttons appear only
  // after someone submits the form. To change a link: base64-encode the new
  // URL and replace the 'u' value.
  GUIDES: {
    fr: [
      { title: "Le Guide Complet Type 4", u: "aHR0cHM6Ly9zY2hpY2dpcmwubWUvZ3VpZGVzLzUwZWQxZDE1MWUvc2NoaWNnaXJsX2d1aWRlX0ZSLnBkZg==" },
      { title: "La Check-list Hydratation",    u: "aHR0cHM6Ly9zY2hpY2dpcmwubWUvZ3VpZGVzLzUwZWQxZDE1MWUvU2NoaWNnaXJsX0NoZWNrbGlzdF9IeWRyYXRhdGlvbl9GUi5wZGY=" },
      { title: "L’Antisèche Porosité",         u: "aHR0cHM6Ly9zY2hpY2dpcmwubWUvZ3VpZGVzLzUwZWQxZDE1MWUvU2NoaWNnaXJsX0FudGlzZWNoZV9Qb3Jvc2l0ZV9GUi5wZGY=" },
      { title: "La Check-list Jour de Lavage", u: "aHR0cHM6Ly9zY2hpY2dpcmwubWUvZ3VpZGVzLzUwZWQxZDE1MWUvU2NoaWNnaXJsX0NoZWNrbGlzdF9Kb3VyX2RlX0xhdmFnZV9GUi5wZGY=" }
    ],
    en: [
      { title: "The Complete Type 4 Guide", u: "aHR0cHM6Ly9zY2hpY2dpcmwubWUvZ3VpZGVzLzUwZWQxZDE1MWUvc2NoaWNnaXJsX2d1aWRlX0VOLnBkZg==" },
      { title: "The Hydration Checklist",  u: "aHR0cHM6Ly9zY2hpY2dpcmwubWUvZ3VpZGVzLzUwZWQxZDE1MWUvU2NoaWNnaXJsX1R5cGU0X0h5ZHJhdGlvbl9DaGVja2xpc3QucGRm" },
      { title: "The Porosity Cheat Sheet", u: "aHR0cHM6Ly9zY2hpY2dpcmwubWUvZ3VpZGVzLzUwZWQxZDE1MWUvU2NoaWNnaXJsX0hhaXJfUG9yb3NpdHlfQ2hlYXRfU2hlZXQucGRm" },
      { title: "The Wash Day Checklist",   u: "aHR0cHM6Ly9zY2hpY2dpcmwubWUvZ3VpZGVzLzUwZWQxZDE1MWUvU2NoaWNnaXJsX1dhc2hfRGF5X0NoZWNrbGlzdC5wZGY=" }
    ]
  }
};

/* Build the button(s) shown on the success screen. */
function buildDownloads(){
  var l = document.documentElement.lang;
  var box = document.getElementById("downloads");
  if(!box) return;
  box.innerHTML = "";

  var guides = (CONFIG.GUIDES && CONFIG.GUIDES[l]) ? CONFIG.GUIDES[l].filter(function(g){ return g.u; }) : [];
  if(guides.length){
    guides.forEach(function(g){
      var a = document.createElement("a");
      a.href = atob(g.u); a.target = "_blank"; a.rel = "noopener"; a.className = "dl";
      a.innerHTML = '<span class="dl-ic">📄</span><span class="dl-t"></span><span class="dl-arr">↓</span>';
      a.querySelector(".dl-t").textContent = g.title;
      box.appendChild(a);
    });
    return;
  }

  var url = CONFIG.ACCESS_URL ? (CONFIG.ACCESS_URL[l] || CONFIG.ACCESS_URL.en || CONFIG.ACCESS_URL.fr) : "";
  if(url){
    var b = document.createElement("a");
    b.href = url; b.target = "_blank"; b.rel = "noopener"; b.className = "access";
    b.textContent = (l === "fr") ? "Accéder à mes guides" : "Open my guides";
    box.appendChild(b);
  }
}

/* language */
(function(){
  function apply(l){
    document.documentElement.lang = l;
    document.querySelectorAll("[data-"+l+"]").forEach(function(el){ el.innerHTML = el.getAttribute("data-"+l); });
    document.querySelectorAll("[data-ph-"+l+"]").forEach(function(el){ el.setAttribute("placeholder", el.getAttribute("data-ph-"+l)); });
    document.querySelectorAll("[data-href-"+l+"]").forEach(function(el){ el.setAttribute("href", el.getAttribute("data-href-"+l)); });
    document.querySelectorAll(".langbtn").forEach(function(b){ b.classList.toggle("is-active", b.dataset.lang===l); });
    var ok=document.getElementById("successView"); if(ok && ok.classList.contains("show")) buildDownloads();
  }
  document.querySelectorAll(".langbtn").forEach(function(b){ b.addEventListener("click", function(){ apply(b.dataset.lang); }); });
  apply(document.documentElement.getAttribute("lang") || ((navigator.language||"en").toLowerCase().indexOf("fr")===0 ? "fr" : "en"));
})();

document.getElementById("yr").textContent = new Date().getFullYear();

/* form */
(function(){
  var fname=document.getElementById("fname"), email=document.getElementById("email"),
      phone=document.getElementById("phone"), btn=document.getElementById("submitBtn"),
      err=document.getElementById("err"), formV=document.getElementById("formView"),
      okV=document.getElementById("successView");

  function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }
  function validPhone(v){ return v.replace(/[^\d]/g,"").length >= 7; }

  function showError(on){
    var eOK=validEmail(email.value), pOK=validPhone(phone.value), miss=on && !eOK && !pOK;
    err.classList.toggle("show", on);
    fname.setAttribute("aria-invalid", on && !fname.value.trim() ? "true":"false");
    email.setAttribute("aria-invalid", miss ? "true":"false");
    phone.setAttribute("aria-invalid", miss ? "true":"false");
  }
  function succeed(){ buildDownloads(); formV.setAttribute("hidden",""); okV.classList.add("show"); okV.scrollIntoView({behavior:"smooth",block:"center"}); }

  function submit(){
    var okName=fname.value.trim().length>0, okContact=validEmail(email.value)||validPhone(phone.value);
    if(!okName || !okContact){ showError(true); return; }
    showError(false);
    btn.disabled=true; btn.textContent=(document.documentElement.lang==="fr")?"Envoi…":"Sending…";
    if(CONFIG.FORM_ENDPOINT){
      try{
        fetch(CONFIG.FORM_ENDPOINT,{method:"POST",body:new URLSearchParams({
          name:fname.value.trim(), email:email.value.trim(), phone:phone.value.trim(), lang:document.documentElement.lang
        })});
      }catch(e){}
    }
    succeed();
  }

  btn.addEventListener("click", submit);
  [fname,email,phone].forEach(function(inp){
    inp.addEventListener("keydown", function(e){ if(e.key==="Enter") submit(); });
    inp.addEventListener("input", function(){ if(err.classList.contains("show")) showError(true); });
  });
})();
