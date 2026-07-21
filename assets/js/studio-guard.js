/* SCHICGIRL — copy/print friction for premium pages (Studio + bonus courses).
   Keeps course content view-only, on the website. Blocks: text selection, right-click,
   copy/cut, image drag, Ctrl+C/X/S/U/P, AND printing (menu, shortcut, or script) —
   printing yields only a "members-only, online" notice, so nothing exports to PDF.
   HONEST LIMIT: web content is delivered to the browser, so screenshots, "Save page",
   view-source and devtools can never be fully blocked — this is strong friction, not a fortress.
   Inputs/textareas stay fully usable so the journal, trackers and forms still work. */
(function(){
  var css=document.createElement('style');
  css.textContent=
    'html,body{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;'
    +'-webkit-touch-callout:none}'
    +'input,textarea,select,[contenteditable="true"],[contenteditable=""]{'
    +'-webkit-user-select:text!important;-moz-user-select:text!important;user-select:text!important;'
    +'-webkit-touch-callout:default}'
    +'img{-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;user-drag:none}'
    /* hide any in-app print button */
    +'.bprint{display:none!important}'
    /* printing prints nothing but a notice (covers browser menu, which JS cannot intercept) */
    +'@media print{html,body{background:#fff!important}'
    +'body>*{display:none!important}'
    +'body::after{content:"Contenu réservé aux membres — à consulter en ligne sur schicgirl.me. · Members-only content — available online.";'
    +'display:block!important;visibility:visible!important;padding:70px 30px;text-align:center;'
    +'font:600 15px/1.7 Georgia,serif;color:#2d1a0e}}';
  (document.head||document.documentElement).appendChild(css);

  /* Neutralise script-triggered printing (e.g. old "Print / Save" buttons). */
  try{ window.print=function(){}; }catch(e){}

  function inField(t){ return t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable); }

  ['contextmenu','copy','cut','dragstart','selectstart'].forEach(function(ev){
    document.addEventListener(ev,function(e){ if(inField(e.target)) return; e.preventDefault(); }, true);
  });

  document.addEventListener('keydown',function(e){
    if(inField(e.target)) return;                 // let people type/select in fields
    var k=(e.key||'').toLowerCase();
    if((e.ctrlKey||e.metaKey) && ['c','x','s','u','p'].indexOf(k)>=0){ e.preventDefault(); }
  }, true);
})();
