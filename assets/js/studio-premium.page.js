/* SCHICGIRL — Le Studio Premium : courses layer. Loads AFTER studio.page.js.
   Adds a "Premium Courses" nav group with the 3 flagship guides as full courses. */
var COURSES=[
 {id:'crs-wnw',icon:'📖',file:'wnw',
  ten:'Why Nothing Works',tfr:'Pourquoi Rien Ne Fonctionne',
  sen:'The diagnosis-first system — read it like a course, lesson by lesson.',
  sfr:'Le système « diagnostic d\'abord » — à suivre comme un cours, leçon par leçon.'},
 {id:'crs-routine',icon:'📘',file:'routine',
  ten:'Build My Hair Routine',tfr:'Créer Ma Routine',
  sen:'Your complete Type 4 routine, step by step — from anatomy to your 90-day plan.',
  sfr:'Ta routine Type 4 complète, étape par étape — de l\'anatomie au plan 90 jours.'},
 {id:'crs-recipes',icon:'🍯',file:'recipes',
  ten:'Type 4 Recipe Book',tfr:'Mes Recettes Type 4',
  sen:'18 DIY treatments with porosity adaptations, plus your kitchen toolkit.',
  sfr:'18 soins maison avec adaptations porosité, plus ton garde-manger capillaire.'},
 {id:'crs-hydra',icon:'💧',file:'hydratee',
  ten:'Hydrated — End Dry Hair',tfr:'Hydratée — Fini les cheveux secs',
  sen:'The complete hydration system: why Type 4 dries out, and how to keep water in for days.',
  sfr:'Le système hydratation complet : pourquoi le Type 4 se dessèche, et comment garder l\'eau des jours durant.'}
];
S.courses=S.courses||{};
var CRS_CACHE={},CRS_OPEN={};
NAV.push([['Premium Courses','Cours Premium'],COURSES.map(function(c){return [c.id,c.icon,c.ten,c.tfr]})]);
COURSES.forEach(function(c){IDS.push(c.id)});
function crsById(id){for(var i=0;i<COURSES.length;i++)if(COURSES[i].id===id)return COURSES[i];return null}
var _panelHTML=panelHTML;panelHTML=function(id){var c=crsById(id);return c?crsPanel(c):_panelHTML(id)};
var _render=render;render=function(id){var c=crsById(id);if(c){crsRender(c);updateNav();return}_render(id)};
function crsPanel(c){return head(t('Premium course','Cours premium'),t(c.ten,c.tfr),t(c.sen,c.sfr))
 +'<div class="crs" id="crsbody"><div class="card">'+t('Loading…','Chargement…')+'</div></div>'}
function crsData(c,cb,tries){var k=c.file+'-'+(L==='fr'?'fr':'en');tries=tries||0;
 if(CRS_CACHE[k])return cb(CRS_CACHE[k]);
 fetch('assets/courses/'+k+'.json',{cache:'no-cache'}).then(function(r){if(!r.ok)throw 0;return r.json()})
 .then(function(d){CRS_CACHE[k]=d;cb(d)})
 .catch(function(){
  if(tries<4)return setTimeout(function(){crsData(c,cb,tries+1)},500*(tries+1));
  var el=document.getElementById('crsbody');
  if(el)el.innerHTML='<div class="card"><p style="margin:0 0 12px">'
   +t('Could not load this course. Check your connection.','Impossible de charger ce cours. Vérifie ta connexion.')
   +'</p><button class="btn" onclick="crsRetry(\''+c.id+'\')">'+t('Try again','Réessayer')+' ↻</button></div>'})}
function crsRetry(cid){var c=crsById(cid);var el=document.getElementById('crsbody');
 if(el)el.innerHTML='<div class="card">'+t('Loading…','Chargement…')+'</div>';
 crsRender(c)}
window.crsRetry=crsRetry;
function crsDone(c){return S.courses[c.id]||{}}
function crsRender(c){crsData(c,function(d){var el=document.getElementById('crsbody');if(!el)return;
 var open=CRS_OPEN[c.id];
 el.innerHTML=open?crsReader(c,d,open):crsList(c,d);
 window.scrollTo(0,0)})}
function crsUnlockedIx(c,d){var done=crsDone(c),mods=d.modules;
 for(var i=0;i<mods.length;i++){if(!done[mods[i].id])return i}
 return mods.length-1}
function crsList(c,d){var done=crsDone(c),mods=d.modules,
 dn=mods.filter(function(m){return done[m.id]}).length,
 pct=mods.length?Math.round(dn/mods.length*100):0,
 unlocked=crsUnlockedIx(c,d);
 var h='<div class="card"><div class="crs-pw"><div class="crs-pt">'+dn+'/'+mods.length+' '
  +t('lessons done','leçons terminées')+' · '+pct+'%</div><div class="bar"><i style="width:'+pct+'%"></i></div></div>';
 var next=null;for(var i=0;i<mods.length;i++){if(!done[mods[i].id]){next=mods[i];break}}
 if(next)h+='<button class="btn" style="margin-top:12px" onclick="crsOpen(\''+c.id+'\',\''+next.id+'\')">'
  +(dn?t('Continue','Continuer'):t('Start the course','Commencer le cours'))+' →</button>';
 if(!next)h+='<p class="muted sm" style="margin-top:10px">'+t('Course complete — well done! 🎉','Cours terminé — bravo ! 🎉')+'</p>';
 h+='<p class="muted sm" style="margin-top:10px">'+t('Validate each lesson (“Mark as read”) to unlock the next one.','Valide chaque leçon (« Marquer comme lu ») pour débloquer la suivante.')+'</p>';
 h+='</div>';
 var part=null;
 mods.forEach(function(m,i){
  if((m.part||'')!==part){part=m.part||'';if(part)h+='<div class="crs-part">'+part+'</div>'}
  var locked=i>unlocked;
  h+='<div class="crs-mod'+(done[m.id]?' done':'')+(locked?' lock':'')+'"'
   +(locked?'':' onclick="crsOpen(\''+c.id+'\',\''+m.id+'\')"')+'>'
   +'<span class="num">'+(i+1)+'</span><span class="ttl">'+m.title+'</span>'
   +'<span class="ck">'+(done[m.id]?'✓':(locked?'🔒':''))+'</span></div>'});
 return h}
function crsReader(c,d,mid){var mods=d.modules,ix=-1;
 mods.forEach(function(m,i){if(m.id===mid)ix=i});
 if(ix<0)return crsList(c,d);
 var m=mods[ix],done=crsDone(c);
 var h='<div class="crs-top"><button class="btn ghost sm" onclick="crsBack(\''+c.id+'\')">← '
  +t('All lessons','Toutes les leçons')+'</button><span class="crs-where">'+(ix+1)+' / '+mods.length+'</span></div>';
 if(m.part)h+='<div class="crs-kick">'+m.part+'</div>';
 h+='<div class="crs-body card">'+m.html+'</div>';
 h+='<div class="crs-nav">';
 h+=(ix>0?'<button class="btn ghost" onclick="crsOpen(\''+c.id+'\',\''+mods[ix-1].id+'\')">← '+t('Previous','Précédente')+'</button>':'<span></span>');
 h+='<button class="btn" onclick="crsMark(\''+c.id+'\',\''+m.id+'\')">'
  +(done[m.id]?t('Validated ✓','Validée ✓'):t('Mark as read','Marquer comme lu'))+'</button>';
 if(ix<mods.length-1){
  h+=done[m.id]
   ?'<button class="btn ghost" onclick="crsOpen(\''+c.id+'\',\''+mods[ix+1].id+'\')">'+t('Next','Suivante')+' →</button>'
   :'<button class="btn ghost lockbtn" disabled>🔒 '+t('Next','Suivante')+'</button>';
 }else h+='<span></span>';
 h+='</div>';
 h+='<div class="crs-note">'+(done[m.id]
  ?t('Your progress is saved on this device.','Ta progression est enregistrée sur cet appareil.')
  :t('Validate this lesson to unlock the next one.','Valide cette leçon pour débloquer la suivante.'))+'</div>';
 return h}
function crsOpen(cid,mid){var c=crsById(cid),k=c.file+'-'+(L==='fr'?'fr':'en'),d=CRS_CACHE[k];
 if(d){var ix=-1;d.modules.forEach(function(m,i){if(m.id===mid)ix=i});
  if(ix>crsUnlockedIx(c,d))return}
 CRS_OPEN[cid]=mid;crsRender(c)}
function crsBack(cid){CRS_OPEN[cid]=null;crsRender(crsById(cid))}
function crsMark(cid,mid){S.courses[cid]=S.courses[cid]||{};
 if(S.courses[cid][mid])return; // validation is one-way
 S.courses[cid][mid]=true;
 var c=crsById(cid),k=c.file+'-'+(L==='fr'?'fr':'en'),d=CRS_CACHE[k];
 if(d){var all=d.modules.every(function(m){return !!S.courses[cid][m.id]});
  if(all)S.done[cid]=true;else delete S.done[cid]}
 sv();
 if(d){var ix=-1;d.modules.forEach(function(m,i){if(m.id===mid)ix=i});
  CRS_OPEN[cid]=(ix>=0&&ix<d.modules.length-1)?d.modules[ix+1].id:null}
 crsRender(c);updateNav()}
window.crsOpen=crsOpen;window.crsBack=crsBack;window.crsMark=crsMark;
buildNav();
(function(){var h=(location.hash||'').slice(1);if(crsById(h))go(h);else updateNav()})();
