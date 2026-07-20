/* SCHICGIRL — copy friction for premium pages (Studio + bonus courses).
   HONEST LIMIT: web content is delivered to the browser, so screenshots, "Save page",
   view-source and devtools can never be fully blocked. This deters CASUAL copying
   (text selection, right-click "copy/save image", Ctrl+C, drag-out) — friction, not a fortress.
   Inputs/textareas stay fully usable so the journal, trackers and forms still work. */
(function(){
  var css=document.createElement('style');
  css.textContent=
    'html,body{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;'
    +'-webkit-touch-callout:none}'
    +'input,textarea,select,[contenteditable="true"],[contenteditable=""]{'
    +'-webkit-user-select:text!important;-moz-user-select:text!important;user-select:text!important;'
    +'-webkit-touch-callout:default}'
    +'img{-webkit-user-drag:none;-khtml-user-drag:none;-moz-user-drag:none;user-drag:none}';
  (document.head||document.documentElement).appendChild(css);

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
