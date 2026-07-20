/* SCHICGIRL — Le Studio Premium : animated course intro card.
   Loads AFTER studio-premium.page.js (wraps crsList). No camera, no audio —
   an on-brand motion graphic that plays at the top of each course's lesson list.
   Uses the course's own icon/title/subtitle, bilingual, respects reduced-motion. */
(function(){
  if(typeof crsList!=='function') return;

  var css=document.createElement('style');
  css.textContent=[
    '.sgi{position:relative;overflow:hidden;border-radius:18px;padding:30px 22px 24px;text-align:center;',
      'background:linear-gradient(140deg,#2d1a0e 0%,#4a2f1a 55%,#2d1a0e 100%);',
      'box-shadow:0 12px 30px rgba(45,26,14,.28);margin:0 0 18px}',
    '.sgi:before{content:"";position:absolute;inset:0;border-radius:18px;pointer-events:none;',
      'box-shadow:inset 0 0 0 1px rgba(201,147,74,.35)}',
    '.sgi-ic{font-size:46px;line-height:1;display:inline-block;',
      'animation:sgiPop .7s cubic-bezier(.2,.9,.3,1.3) both;filter:drop-shadow(0 4px 10px rgba(0,0,0,.3))}',
    '.sgi-kick{margin-top:11px;font:700 10.5px/1.4 system-ui,-apple-system,sans-serif;',
      'letter-spacing:2.5px;text-transform:uppercase;color:#e6b45c;opacity:0;animation:sgiUp .6s .28s ease-out forwards}',
    '.sgi-ttl{margin:5px 0 0;font:600 24px/1.15 var(--serif,"Cormorant Garamond",Georgia,serif);',
      'color:#fdf8f2;opacity:0;animation:sgiUp .6s .42s ease-out forwards}',
    '.sgi-sub{margin:9px auto 0;max-width:34em;font:400 13px/1.5 system-ui,-apple-system,sans-serif;',
      'color:#ecdcc7;opacity:0;animation:sgiUp .6s .56s ease-out forwards}',
    '.sgi-fl{margin:12px auto 0;width:54px;height:1px;background:linear-gradient(90deg,transparent,#c9934a,transparent);',
      'opacity:0;animation:sgiUp .6s .7s ease-out forwards}',
    '.sgi-shine{position:absolute;top:0;left:-65%;width:48%;height:100%;pointer-events:none;',
      'background:linear-gradient(100deg,transparent,rgba(230,180,92,.30),transparent);',
      'transform:skewX(-18deg);animation:sgiShine 1.5s .55s ease-out both}',
    '@keyframes sgiPop{0%{transform:scale(.45) translateY(6px);opacity:0}60%{opacity:1}100%{transform:scale(1) translateY(0);opacity:1}}',
    '@keyframes sgiUp{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes sgiShine{from{left:-65%}to{left:120%}}',
    '@media(prefers-reduced-motion:reduce){.sgi-ic,.sgi-kick,.sgi-ttl,.sgi-sub,.sgi-fl,.sgi-shine{animation:none;opacity:1}}'
  ].join('');
  document.head.appendChild(css);

  function T(en,fr){ return (typeof t==='function')?t(en,fr):en; }
  function isFr(){ return (typeof L!=='undefined'&&L==='fr'); }
  function esc(s){ return String(s==null?'':s); }

  function introHTML(c){
    var icon=esc(c.icon), title=esc(isFr()?c.tfr:c.ten), sub=esc(isFr()?c.sfr:c.sen);
    var kind=(c.id==='crs-grow')?T('Schicgirl Studio · Bonus','Schicgirl Studio · Bonus')
                                :T('Schicgirl Studio · Course','Schicgirl Studio · Cours');
    return '<div class="sgi">'
      +'<span class="sgi-shine" aria-hidden="true"></span>'
      +'<div class="sgi-ic">'+icon+'</div>'
      +'<div class="sgi-kick">'+kind+'</div>'
      +'<div class="sgi-ttl">'+title+'</div>'
      +'<div class="sgi-sub">'+sub+'</div>'
      +'<div class="sgi-fl"></div>'
      +'</div>';
  }

  var _crsList=crsList;
  crsList=function(c,d){ return introHTML(c) + _crsList(c,d); };
})();
