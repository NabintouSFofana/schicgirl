/* SCHICGIRL — Portail d'accès générique par code (SchicChat, HydraCheck, autres apps payantes).
   Utilisation : définir window.SCHIC_GATE AVANT de charger ce script :
     window.SCHIC_GATE = {
       product: "schicchat",            // clé unique -> localStorage sgg_auth_<product>
       codeHashes: ["<sha256>", ...],   // empreintes SHA-256 des codes valides
       title_fr, title_en,              // titre de l'écran
       sub_fr, sub_en,                  // sous-titre
       salesUrl                         // lien page de vente (si pas de code)
     };
   Le code lui-même n'apparaît jamais ici, seulement son empreinte. */
(function(){
var G=window.SCHIC_GATE;if(!G||!G.product){return}
var AUTH_KEY="sgg_auth_"+G.product;
var auth=null;try{auth=JSON.parse(localStorage.getItem(AUTH_KEY))}catch(e){}

function sha256(str){
 if(window.crypto&&crypto.subtle&&crypto.subtle.digest){
  return crypto.subtle.digest("SHA-256",new TextEncoder().encode(str)).then(function(buf){
   return Array.prototype.map.call(new Uint8Array(buf),function(b){return('0'+b.toString(16)).slice(-2)}).join('')});
 }
 return Promise.resolve(null); // contexte non sécurisé : on ne bloque pas au 2e chargement
}
function normEmail(e){return String(e||'').trim().toLowerCase()}
function normCode(c){return String(c||'').trim().toUpperCase().replace(/[\s-]/g,'')}
function T(k){return (document.documentElement.lang==='en'?G[k+'_en']:G[k+'_fr'])||G[k+'_fr']||G[k+'_en']||''}

function lock(){
 document.documentElement.classList.add('sgg-locked');
 if(document.body)document.body.classList.add('sgg-locked');
 if(document.getElementById('sggLock'))return;
 var d=document.createElement('div');
 d.innerHTML='<div class="sgg-lock" id="sggLock"><div class="sgg-card">'
 +'<div class="sgg-logo"></div>'
 +'<h1>'+T('title')+'</h1>'
 +'<p class="sgg-sub">'+T('sub')+'</p>'
 +'<input type="email" id="sggEmail" placeholder="'+(document.documentElement.lang==='en'?'your@email.com':'ton@email.com')+'" autocomplete="email"/>'
 +'<input type="text" id="sggCode" placeholder="'+(document.documentElement.lang==='en'?'Access code':'Code d’accès')+'" autocomplete="off" style="text-transform:uppercase"/>'
 +'<button class="sgg-btn" id="sggGo">'+(document.documentElement.lang==='en'?'Unlock →':'Déverrouiller →')+'</button>'
 +'<p class="sgg-err" id="sggErr"></p>'
 +'<p class="sgg-help">'+(document.documentElement.lang==='en'?'No code yet? ':'Pas encore de code ? ')
   +'<a href="'+(G.salesUrl||'https://schicgirl.me')+'">'+(document.documentElement.lang==='en'?'Get access':'Obtenir l’accès')+'</a>'
   +'<br/>'+(document.documentElement.lang==='en'?'A problem? Message me on ':'Un souci ? Écris-moi sur ')
   +'<a href="https://facebook.com/schicgirl">Facebook</a> 💛</p>'
 +'</div></div>';
 (document.body||document.documentElement).appendChild(d.firstChild);
 document.getElementById('sggGo').addEventListener('click',tryUnlock);
 document.getElementById('sggCode').addEventListener('keydown',function(e){if(e.key==='Enter')tryUnlock()});
 document.getElementById('sggEmail').addEventListener('keydown',function(e){if(e.key==='Enter')document.getElementById('sggCode').focus()});
}
function unlock(){
 var el=document.getElementById('sggLock');if(el&&el.parentNode)el.parentNode.removeChild(el);
 document.documentElement.classList.remove('sgg-locked');
 if(document.body)document.body.classList.remove('sgg-locked');
}
function tryUnlock(){
 var email=normEmail((document.getElementById('sggEmail')||{}).value),
     code=normCode((document.getElementById('sggCode')||{}).value),
     err=document.getElementById('sggErr'),go=document.getElementById('sggGo');
 if(!email||email.indexOf('@')<0){err.textContent=(document.documentElement.lang==='en'?'Enter a valid email':'Entre un email valide');return}
 if(!code){err.textContent=(document.documentElement.lang==='en'?'Enter your access code':'Entre ton code d’accès');return}
 err.textContent='';go.textContent=(document.documentElement.lang==='en'?'Checking…':'Vérification…');
 sha256(code).then(function(h){
  if(h&&G.codeHashes.indexOf(h)<0){
   err.textContent=(document.documentElement.lang==='en'?'Wrong code, check your purchase email.':'Code incorrect. Vérifie ton email d’achat.');
   go.textContent=(document.documentElement.lang==='en'?'Unlock →':'Déverrouiller →');return}
  auth={email:email,code:code,ts:Date.now()};
  try{localStorage.setItem(AUTH_KEY,JSON.stringify(auth))}catch(e){}
  logAccess(email);
  unlock();
 });
}
/* journal d'accès best-effort (facultatif — ne bloque jamais) */
function logAccess(email){
 if(!G.logUrl||!G.logKey)return;
 try{
  fetch(G.logUrl+'/rest/v1/'+(G.logTable||'app_access_log'),
   {method:'POST',headers:{apikey:G.logKey,Authorization:'Bearer '+G.logKey,'Content-Type':'application/json',Prefer:'resolution=merge-duplicates'},
    body:JSON.stringify({product_email:G.product+'|'+email,product:G.product,email:email,last_seen:new Date().toISOString()})}).catch(function(){});
 }catch(e){}
}

/* démarrage : verrouille sauf si déjà authentifié avec un code encore valide */
function start(){
 if(auth&&auth.email&&auth.code){
  sha256(auth.code).then(function(h){
   if(h&&G.codeHashes.indexOf(h)<0){try{localStorage.removeItem(AUTH_KEY)}catch(e){}lock()}
  });
  return; // déjà entré : rien à afficher
 }
 lock();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
window.sggLogout=function(){try{localStorage.removeItem(AUTH_KEY)}catch(e){}location.reload()};
})();
