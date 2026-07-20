/* SCHICGIRL — Le Studio Premium : « Today » daily hub.
   Loads AFTER studio-premium.page.js and BEFORE studio-premium-auth.js.
   Prepends a Streak / Next-lesson / Next-wash strip to the top of the #home panel,
   reading the real state (S.streak, S.courses, S.profile) — makes the app a daily habit. */
(function(){
  if(typeof panelHTML!=='function'||typeof render!=='function') return;

  var css=document.createElement('style');
  css.textContent=[
    '.sg-today{margin:2px 0 22px}',
    '.sg-today .sg-h{font:600 12px/1 var(--serif);letter-spacing:1px;color:var(--gold-d);text-transform:uppercase;margin:0 0 10px}',
    '.sg-trow{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}',
    '@media(max-width:640px){.sg-trow{grid-template-columns:1fr}}',
    '.sg-tile{display:flex;gap:12px;align-items:flex-start;padding:16px}',
    '.sg-tk{font-size:22px;line-height:1;flex:none}',
    '.sg-tb{flex:1;min-width:0}',
    '.sg-tl{font:700 11px/1.3 system-ui,-apple-system,sans-serif;letter-spacing:.8px;text-transform:uppercase;color:var(--ink-soft);opacity:.72}',
    '.sg-tn{font:800 30px/1 var(--serif);color:var(--gold-d);margin:2px 0}',
    '.sg-tt{font:600 14px/1.35 system-ui,-apple-system,sans-serif;color:var(--ink);margin:3px 0 9px;overflow-wrap:anywhere}',
    '.sg-sub{font:500 12.5px/1.3 system-ui,sans-serif;color:var(--ink-soft);opacity:.6;margin-top:2px}',
    '.sg-today .btn.mini{padding:7px 13px;font-size:12.5px}'
  ].join('');
  document.head.appendChild(css);

  function T(en,fr){ return (typeof t==='function')?t(en,fr):en; }
  function lang(){ return (typeof L!=='undefined'&&L==='fr')?'fr':'en'; }

  /* ---- inject the Today strip at the top of the home panel ---- */
  var _ph=panelHTML;
  panelHTML=function(id){
    var html=_ph(id);
    if(id!=='home') return html;
    var streak=(typeof S!=='undefined'&&S.streak)?S.streak:0;
    var strip=
      '<div class="sg-today"><div class="sg-h">'+T('Today','Aujourd’hui')+'</div><div class="sg-trow">'
      +'<div class="card sg-tile"><span class="sg-tk">🔥</span><div class="sg-tb">'
        +'<div class="sg-tl">'+T('Streak','Série')+'</div>'
        +'<div class="sg-tn" id="sgStreak">'+streak+'</div>'
        +'<div class="sg-sub">'+(streak===1?T('day — come back tomorrow','jour — reviens demain'):T('days in a row','jours d’affilée'))+'</div>'
      +'</div></div>'
      +'<div class="card sg-tile"><span class="sg-tk">📚</span><div class="sg-tb">'
        +'<div class="sg-tl">'+T('Next lesson','Prochaine leçon')+'</div>'
        +'<div class="sg-tt" id="sgLessonTitle">'+T('Finding it…','Recherche…')+'</div>'
        +'<button class="btn mini" id="sgLessonBtn" style="display:none" onclick="sgResume()"></button>'
      +'</div></div>'
      +'<div class="card sg-tile"><span class="sg-tk">💧</span><div class="sg-tb">'
        +'<div class="sg-tl">'+T('Next wash day','Prochain lavage')+'</div>'
        +'<div class="sg-tt" id="sgWashTitle">—</div>'
        +'<button class="btn mini ghost" id="sgWashBtn" onclick="sgWashToggle()"></button>'
      +'</div></div>'
      +'</div></div>';
    var ix=html.indexOf('<div class="card"');
    return ix<0 ? strip+html : html.slice(0,ix)+strip+html.slice(ix);
  };

  /* ---- next lesson across all courses ---- */
  var _resume=null;
  function fillNextLesson(){
    var el=document.getElementById('sgLessonTitle'), btn=document.getElementById('sgLessonBtn');
    if(!el||typeof COURSES==='undefined') return;
    var started=null, notStarted=null;
    for(var i=0;i<COURSES.length;i++){ var c=COURSES[i];
      if(S.done&&S.done[c.id]) continue;
      var prog=(S.courses&&S.courses[c.id])?Object.keys(S.courses[c.id]).length:0;
      if(prog>0){ started=c; break; } if(!notStarted) notStarted=c;
    }
    var c=started||notStarted;
    if(!c){ el.textContent=T('All courses complete 🎉','Tous les cours terminés 🎉'); btn.style.display='none'; _resume=null; return; }
    var key=c.file+'-'+lang();
    fetch('assets/courses/'+key+'.json',{cache:'no-cache'}).then(function(r){return r.json();}).then(function(d){
      var done=(S.courses&&S.courses[c.id])||{}, next=null;
      for(var j=0;j<d.modules.length;j++){ if(!done[d.modules[j].id]){ next=d.modules[j]; break; } }
      if(!next) next=d.modules[d.modules.length-1];
      var cname=(lang()==='fr'?c.tfr:c.ten);
      _resume={cid:c.id, mid:next.id};
      var tmp=document.createElement('div'); tmp.innerHTML=next.title;
      el.innerHTML='<span class="sg-sub" style="display:block;margin:0 0 2px">'+cname+'</span>'+tmp.textContent;
      btn.style.display=''; btn.textContent=(Object.keys(done).length?T('Resume','Reprendre'):T('Start','Commencer'))+' →';
    }).catch(function(){ el.textContent=T('Open your courses →','Ouvre tes cours →'); btn.style.display='none'; });
  }
  window.sgResume=function(){ if(!_resume) return; go(_resume.cid);
    setTimeout(function(){ try{ crsOpen(_resume.cid,_resume.mid); }catch(e){} },320); };

  /* ---- next wash day (self-contained: S.lastWash + porosity interval) ---- */
  function washInterval(){
    var p=String((S.profile&&(S.profile.porosity||S.profile.poro))||'').toLowerCase();
    if(p.indexOf('high')>=0||p.indexOf('haute')>=0) return 6;
    if(p.indexOf('low')>=0||p.indexOf('basse')>=0) return 10;
    return 8;
  }
  function fmt(d){ return d.toLocaleDateString(lang()==='fr'?'fr-FR':'en-US',{weekday:'short',day:'numeric',month:'short'}); }
  function fillWash(){
    var el=document.getElementById('sgWashTitle'), btn=document.getElementById('sgWashBtn');
    if(!el) return;
    btn.textContent=T('I washed today','J’ai lavé aujourd’hui');
    var lw=S.lastWash?new Date(S.lastWash):null;
    if(!lw||isNaN(lw.getTime())){
      el.innerHTML=T('Not set yet','Pas encore défini')
        +'<div class="sg-sub">'+T('every','tous les')+' '+washInterval()+' '+T('days recommended','jours conseillé')+'</div>';
      return;
    }
    var next=new Date(lw.getTime()+washInterval()*864e5);
    var days=Math.ceil((next-new Date(new Date().toDateString()))/864e5);
    var status=days<0?T('overdue','en retard'):days===0?T('due today','à faire aujourd’hui'):(T('in','dans')+' '+days+' '+T('day(s)','j'));
    el.innerHTML=fmt(next)+'<div class="sg-sub">'+status+'</div>';
  }
  window.sgWashToggle=function(){ S.lastWash=new Date().toDateString(); if(typeof sv==='function')sv(); fillWash(); };

  /* ---- fill after each home render ---- */
  var _render=render;
  render=function(id){ _render(id); if(id==='home'){ setTimeout(function(){ fillNextLesson(); fillWash(); },0); } };
})();
