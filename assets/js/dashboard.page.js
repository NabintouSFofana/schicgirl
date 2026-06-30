/* ===================================================================
   SCHICGIRL — Command Center  (dashboard.page.js)
   Unified admin dashboard: analytics, store/catalog, content, modules.
   100% client-side, no dependencies. Reuses the existing storage keys
   so it stays in sync with the original admin tools.
   (c) 2024–2026 Schicgirl.
=================================================================== */
(() => {
'use strict';

/* ── shared storage keys (identical to admin.page.js / index.page.js) ── */
const SITE_KEY      = 'schicgirl_site';
const ANALYTICS_KEY = 'schicgirl_analytics';
const ADMIN_KEY     = 'schicgirl_admin_cfg';
const ATTEMPTS_KEY  = 'schicgirl_admin_attempts';
const UI_KEY        = 'schicgirl_dash_ui';
const DEFAULT_PASSWORD_HASH = 'eacb20f402c4738505df836b6cc58c054db7fbc3abe79ce7fc7520a906e3fcbb';

/* ── tiny helpers ── */
const $  = (id) => document.getElementById(id);
const el = (sel, root=document) => root.querySelector(sel);
const els= (sel, root=document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s==null?'':s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = (n) => { n = Number(n)||0; return n>=1000 ? (n/1000).toFixed(n>=10000?0:1).replace('.0','')+'k' : String(n); };
const pct = (a,b) => b>0 ? Math.round((a/b)*100) : 0;
const clamp = (n,a,b) => Math.max(a, Math.min(b,n));

let LANG = (localStorage.getItem('sg_lang')==='en') ? 'en' : 'fr';
const T = (fr,en) => LANG==='en' ? en : fr;

/* ── config / auth ── */
function getCfg(){ try { return JSON.parse(localStorage.getItem(ADMIN_KEY)||'{}'); } catch { return {}; } }
function saveCfg(c){ try { localStorage.setItem(ADMIN_KEY, JSON.stringify(c)); } catch {} }
function passHash(){ return getCfg().passwordHash || DEFAULT_PASSWORD_HASH; }
async function sha256(txt){
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt));
  return [...new Uint8Array(buf)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function getAttempts(){ try { return JSON.parse(sessionStorage.getItem(ATTEMPTS_KEY)||'{"count":0,"until":0}'); } catch { return {count:0,until:0}; } }
function setAttempts(a){ try { sessionStorage.setItem(ATTEMPTS_KEY, JSON.stringify(a)); } catch {} }

/* ── analytics store ── */
function getAnalytics(){ try { return JSON.parse(localStorage.getItem(ANALYTICS_KEY)||'{"visits":[],"clicks":[]}'); } catch { return {visits:[],clicks:[]}; } }
function saveAnalytics(d){ try { localStorage.setItem(ANALYTICS_KEY, JSON.stringify(d)); } catch {} }

/* ── UI prefs ── */
function getUI(){ try { return JSON.parse(localStorage.getItem(UI_KEY)||'{}'); } catch { return {}; } }
function saveUI(p){ try { localStorage.setItem(UI_KEY, JSON.stringify({...getUI(), ...p})); } catch {} }

/* ── state ── */
const STATE = {
  site: null,          // merged site.json
  siteDirty: false,    // unsaved content edits
  amazon: [],          // affiliate catalog (from products.page.js)
  diy: [],             // DIY ingredients
  blog: [],            // blog posts
  range: getUI().range || 30,  // analytics window (days; 0 = all)
  page: 'overview',
  built: {},           // which panels have been rendered
};

/* =================================================================
   TOAST + MODAL
================================================================= */
let toastTimer;
function toast(msg, kind=''){
  const t = $('toast'); t.className = 'toast show ' + kind;
  t.innerHTML = (kind==='ok'?'✓ ':kind==='err'?'✕ ':'') + esc(msg);
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}
function modal(html, wide){
  const host = $('modalHost');
  host.innerHTML = `<div class="modal-overlay" id="mOv"><div class="modal-box${wide?' wide':''}">${html}</div></div>`;
  $('mOv').addEventListener('click', e => { if (e.target.id==='mOv') closeModal(); });
}
function closeModal(){ $('modalHost').innerHTML=''; }
window._dashCloseModal = closeModal;

/* =================================================================
   DATA LOADING
================================================================= */
async function loadSite(){
  // local working copy (edited in admin) overrides the published file
  let local = null;
  try { local = JSON.parse(localStorage.getItem(SITE_KEY)||'null'); } catch {}
  if (local) return local;
  try {
    const r = await fetch('assets/site.json?_=' + Date.now());
    if (r.ok) return await r.json();
  } catch {}
  return { brand:{}, hero:{}, gifts:{items:[]}, shop:{}, tools:{items:[]}, amazon:{items:[]}, testimonials:{items:[]}, social:{items:[]}, footer:{} };
}

// Extract a top-level array literal assigned to `varName` from JS source.
// Works for our first-party page scripts (single source of truth).
function extractArray(src, varName){
  const m = src.match(new RegExp('(?:const|var|let)\\s+' + varName + '\\s*=\\s*'));
  if (!m) return [];
  let i = src.indexOf('[', m.index);
  if (i < 0) return [];
  let depth=0, inStr=false, q='', start=i;
  for (; i<src.length; i++){
    const c = src[i];
    if (inStr){ if (c==='\\'){ i++; continue; } if (c===q) inStr=false; continue; }
    if (c==='"'||c==="'"||c==='`'){ inStr=true; q=c; continue; }
    if (c==='[') depth++;
    else if (c===']'){ depth--; if (depth===0){ const txt=src.slice(start, i+1); try { return (new Function('return '+txt))(); } catch(e){ return []; } } }
  }
  return [];
}
async function loadJsArray(file, varName){
  try { const r = await fetch(file + '?_=' + Date.now()); if (!r.ok) return []; return extractArray(await r.text(), varName); }
  catch { return []; }
}

/* =================================================================
   STORE / CATALOG MODEL
   Aggregates every revenue + lead surface in this folder.
================================================================= */
// Curated premium / on-site products (sales + landing pages in this folder).
const PREMIUM = [
  { id:'pack',      emoji:'📦', track:'selar-shop', fr:'Le Pack Complet',            en:'The Complete Pack',        page:'/fr/pack-complet/',     note_fr:'Bundle de tous les ebooks', note_en:'All-ebooks bundle' },
  { id:'pousse',    emoji:'🌱', track:'pousse',     fr:'Faire Pousser ses Cheveux',  en:'Grow Your Hair',           page:'/fr/faire-pousser-cheveux-crepus/',           note_fr:'Ebook pousse', note_en:'Growth ebook' },
  { id:'hydra',     emoji:'💧', track:'hydratee',   fr:'Hydratation Cheveux Crépus', en:'Hydrate Type 4 Hair',      page:'/fr/hydratation-cheveux-crepus/',         note_fr:'Ebook hydratation', note_en:'Hydration ebook' },
  { id:'transition',emoji:'🌀', track:'transition', fr:'Transition Capillaire',      en:'Hair Transition',          page:'/fr/transition-capillaire/',       note_fr:'Ebook transition', note_en:'Transition ebook' },
  { id:'pellicules',emoji:'✨', track:'pellicules', fr:'Stop aux Pellicules',        en:'Stop Dandruff',            page:'/fr/pellicules/',       note_fr:'Ebook cuir chevelu', note_en:'Scalp ebook' },
  { id:'secs',      emoji:'🚫', track:'stop-secs',  fr:'Stop Cheveux Secs',          en:'Stop Dry Hair',            page:'/fr/cheveux-secs/',note_fr:'Ebook anti-sec', note_en:'Anti-dry ebook' },
  { id:'planner',   emoji:'📅', track:'planner',    fr:'Hair Planner',               en:'Hair Planner',             page:'/fr/planner/',          note_fr:'Agenda capillaire', note_en:'Hair planner' },
  { id:'toolkit',   emoji:'🧰', track:'toolkit',    fr:'Toolkit Cheveux Type 4',     en:'Type 4 Hair Toolkit',      page:'/fr/kit-gratuit/',  note_fr:'Boîte à outils', note_en:'Toolkit' },
  { id:'studio',    emoji:'🎬', track:'studio',     fr:'Ebook Studio',               en:'Ebook Studio',             page:'studio.html',           note_fr:'Studio de création', note_en:'Creation studio' },
];

// Build a unified catalog with live click counts attributed by track id.
function buildCatalog(clickMap){
  const site = STATE.site || {};
  const rows = [];
  const hits = (keys) => keys.reduce((s,k)=> s + (clickMap[k]||0), 0);

  // 1. Premium ebooks / sales pages
  const shopUrl = site.shop?.url || 'https://selar.com/m/schicgirl';
  PREMIUM.forEach(p => rows.push({
    type:'premium', emoji:p.emoji, name:T(p.fr,p.en), sub:T(p.note_fr,p.note_en),
    url:p.page, ext:false, status:null, clicks:hits([p.track, p.id]),
    badge:T('Premium','Premium'),
  }));
  // main shop link
  rows.push({ type:'premium', emoji:'🛒', name:T(site.shop?.eyebrow_fr||'Boutique Selar', site.shop?.eyebrow_en||'Selar Shop'),
    sub:T('Tous les ebooks · Selar','All ebooks · Selar'), url:shopUrl, ext:true,
    status: site.shop?.on, ref:['shop'], clicks:hits([site.shop?.track||'selar-shop']) });

  // 2. Free gifts (lead magnets)
  (site.gifts?.items||[]).forEach((g,i) => rows.push({
    type:'gift', emoji:g.emoji||'🎁', name:T(g.title_fr,g.title_en), sub:T('Cadeau gratuit · lead magnet','Free gift · lead magnet'),
    url:T(g.url_fr,g.url_en)||g.url, ext:true, status:g.on, ref:['gifts','items',i],
    clicks:hits([g.id, 'gift-'+g.id]),
  }));

  // 3. Free tools
  (site.tools?.items||[]).forEach((t,i) => rows.push({
    type:'tool', emoji:t.icon||'🛠️', name:T(t.title_fr,t.title_en), sub:T('Outil gratuit','Free tool'),
    url:t.url, ext:true, status:t.on, ref:['tools','items',i],
    clicks:hits([t.id, 'tool-'+t.id]),
  }));

  // 4. Amazon featured (from site.json)
  (site.amazon?.items||[]).forEach((a,i) => rows.push({
    type:'amazon', emoji:'🛍️', name:T(a.title_fr||a.name, a.title_en||a.name)||a.name, sub:T('Affilié · mis en avant','Affiliate · featured'),
    url:a.url, ext:true, status:a.on, ref:['amazon','items',i],
    clicks:hits([a.id, 'amazon-'+a.id]),
  }));

  // 5. Full Amazon affiliate catalog (from products.page.js)
  STATE.amazon.forEach(p => rows.push({
    type:'amazon', emoji:'🛒', name:T(p.fr,p.en), sub:T(p.cat_fr,p.cat_en),
    img:p.img, url:p.url, ext:true, status:null, clicks:0, affiliate:true,
  }));

  return rows;
}

/* =================================================================
   ANALYTICS ENGINE
================================================================= */
function rangeStart(){ return STATE.range===0 ? 0 : Date.now() - STATE.range*86400000; }
function inRange(ts){ return STATE.range===0 || ts >= rangeStart(); }

function compute(){
  const a = getAnalytics();
  const visits = a.visits.filter(v => inRange(v.ts));
  const clicks = a.clicks.filter(c => inRange(c.ts));
  const days = STATE.range===0 ? 90 : STATE.range;

  // language
  const langCount = { fr:0, en:0 };
  let mobile=0; const refMap={}; const tzMap={};
  visits.forEach(v => {
    if (v.lang==='en') langCount.en++; else langCount.fr++;
    if (v.mob) mobile++;
    const ref = refDomain(v.ref); refMap[ref]=(refMap[ref]||0)+1;
    if (v.tz) tzMap[v.tz]=(tzMap[v.tz]||0)+1;
  });

  // clicks by value
  const clickMap={};
  clicks.forEach(c => { const k=c.value||'?'; clickMap[k]=(clickMap[k]||0)+1; });

  // daily series (visits + clicks)
  const series = dailySeries(visits, clicks, days);

  // previous period (for deltas)
  const prevVisits = STATE.range===0 ? [] : a.visits.filter(v => v.ts < rangeStart() && v.ts >= rangeStart()-STATE.range*86400000);
  const prevClicks = STATE.range===0 ? [] : a.clicks.filter(c => c.ts < rangeStart() && c.ts >= rangeStart()-STATE.range*86400000);

  // conversion-intent clicks (shop / gifts / premium tracks)
  const convKeys = ['selar-shop','shop', ...PREMIUM.map(p=>p.track), ...PREMIUM.map(p=>p.id)];
  const conv = clicks.filter(c => convKeys.includes(c.value)).length;

  return {
    visits, clicks, langCount, mobile, refMap, tzMap, clickMap, series,
    totalVisits: visits.length, totalClicks: clicks.length, conv,
    prevVisits: prevVisits.length, prevClicks: prevClicks.length,
    ctr: pct(clicks.length, visits.length),
  };
}
function refDomain(ref){
  if (!ref) return T('Direct','Direct');
  try { const h = new URL(ref).hostname.replace(/^www\./,''); return h || T('Direct','Direct'); }
  catch { return T('Direct','Direct'); }
}
function dailySeries(visits, clicks, days){
  const out=[]; const now=new Date(); now.setHours(0,0,0,0);
  const vById={}, cById={};
  const key=(ts)=>{ const d=new Date(ts); d.setHours(0,0,0,0); return d.getTime(); };
  visits.forEach(v=>{ const k=key(v.ts); vById[k]=(vById[k]||0)+1; });
  clicks.forEach(c=>{ const k=key(c.ts); cById[k]=(cById[k]||0)+1; });
  for (let i=days-1;i>=0;i--){
    const d=new Date(now); d.setDate(d.getDate()-i); const k=d.getTime();
    out.push({ ts:k, label:`${d.getDate()}/${d.getMonth()+1}`, visits:vById[k]||0, clicks:cById[k]||0 });
  }
  return out;
}
function deltaTag(cur, prev){
  if (STATE.range===0) return '';
  if (prev===0 && cur===0) return `<span class="delta flat">—</span>`;
  if (prev===0) return `<span class="delta up">▲ ${cur>0?'nouveau':''}</span>`;
  const d = Math.round(((cur-prev)/prev)*100);
  if (d===0) return `<span class="delta flat">0%</span>`;
  return `<span class="delta ${d>0?'up':'down'}">${d>0?'▲':'▼'} ${Math.abs(d)}%</span>`;
}

/* =================================================================
   SVG CHARTS  (no libraries)
================================================================= */
function areaChart(series, w=720, h=200){
  if (!series.length || series.every(s=>s.visits===0 && s.clicks===0))
    return `<div class="chart-empty"><div class="ei">📈</div>${T('Pas encore de données sur cette période.','No data yet for this period.')}</div>`;
  const pad={l:30,r:10,t:14,b:22};
  const maxV = Math.max(1, ...series.map(s=>Math.max(s.visits,s.clicks)));
  const iw=w-pad.l-pad.r, ih=h-pad.t-pad.b;
  const x=(i)=> pad.l + (series.length===1?iw/2:(i/(series.length-1))*iw);
  const y=(v)=> pad.t + ih - (v/maxV)*ih;
  const line=(key)=> series.map((s,i)=>`${i?'L':'M'}${x(i).toFixed(1)},${y(s[key]).toFixed(1)}`).join(' ');
  const area=(key)=> `${line(key)} L${x(series.length-1).toFixed(1)},${(pad.t+ih).toFixed(1)} L${x(0).toFixed(1)},${(pad.t+ih).toFixed(1)} Z`;
  // gridlines
  let grid='';
  for (let g=0; g<=2; g++){ const gv=Math.round(maxV*g/2); const gy=y(gv); grid+=`<line x1="${pad.l}" y1="${gy}" x2="${w-pad.r}" y2="${gy}" stroke="rgba(201,147,74,.12)"/><text x="4" y="${gy+3}" font-size="9" fill="rgba(45,26,14,.4)">${gv}</text>`; }
  // sparse x labels
  let xl=''; const step=Math.ceil(series.length/8);
  series.forEach((s,i)=>{ if (i%step===0||i===series.length-1) xl+=`<text x="${x(i)}" y="${h-6}" font-size="9" fill="rgba(45,26,14,.4)" text-anchor="middle">${s.label}</text>`; });
  return `<svg viewBox="0 0 ${w} ${h}" class="chart-svg" preserveAspectRatio="none" role="img">
    <defs>
      <linearGradient id="gVis" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(201,147,74,.32)"/><stop offset="1" stop-color="rgba(201,147,74,0)"/></linearGradient>
    </defs>
    ${grid}
    <path d="${area('visits')}" fill="url(#gVis)"/>
    <path d="${line('visits')}" fill="none" stroke="#c9934a" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="${line('clicks')}" fill="none" stroke="#c47a65" stroke-width="2" stroke-dasharray="4 4" stroke-linejoin="round"/>
    ${series.map((s,i)=> s.visits? `<circle cx="${x(i).toFixed(1)}" cy="${y(s.visits).toFixed(1)}" r="2.6" fill="#c9934a"/>`:'').join('')}
  </svg>
  <div style="display:flex;gap:18px;justify-content:center;margin-top:6px;font-size:11px;color:var(--muted)">
    <span><b style="color:#c9934a">●</b> ${T('Visites','Visits')}</span>
    <span><b style="color:#c47a65">┈</b> ${T('Clics','Clicks')}</span>
  </div>`;
}
function donut(parts, size=140){
  const total = parts.reduce((s,p)=>s+p.v,0);
  if (!total) return `<div class="chart-empty"><div class="ei">🍩</div>${T('Aucune donnée.','No data.')}</div>`;
  const r=size/2-12, cx=size/2, cy=size/2, C=2*Math.PI*r; let off=0;
  const segs = parts.filter(p=>p.v>0).map(p=>{
    const frac=p.v/total, len=frac*C; const s=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${p.c}" stroke-width="16" stroke-dasharray="${len.toFixed(2)} ${(C-len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>`;
    off+=len; return s;
  }).join('');
  return `<div class="donut-wrap">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(201,147,74,.1)" stroke-width="16"/>
      ${segs}
      <text x="${cx}" y="${cy-2}" text-anchor="middle" font-family="var(--serif)" font-size="26" fill="#2d1a0e">${fmt(total)}</text>
      <text x="${cx}" y="${cy+15}" text-anchor="middle" font-size="9" fill="rgba(45,26,14,.5)">total</text>
    </svg>
    <div class="donut-legend">${parts.map(p=>`<div class="li"><span class="dot" style="background:${p.c}"></span>${esc(p.label)}<span class="lv">${fmt(p.v)} · ${pct(p.v,total)}%</span></div>`).join('')}</div>
  </div>`;
}
function barList(entries, max=8, colorFn){
  if (!entries.length) return `<div class="chart-empty"><div class="ei">📊</div>${T('Aucune donnée.','No data.')}</div>`;
  const top = entries.slice(0,max);
  const mx = Math.max(1, ...top.map(e=>e.v));
  return `<div class="barlist">${top.map(e=>`
    <div class="barrow">
      <div class="bl">${e.icon?`<span>${e.icon}</span>`:''}<span title="${esc(e.label)}">${esc(e.label)}</span></div>
      <div class="bv">${fmt(e.v)}</div>
      <div class="track"><div class="fill" style="width:${(e.v/mx*100).toFixed(1)}%${colorFn?`;background:${colorFn(e)}`:''}"></div></div>
    </div>`).join('')}</div>`;
}

/* =================================================================
   PANEL: OVERVIEW
================================================================= */
function renderOverview(){
  const c = compute();
  const root = $('p-overview');
  const clickEntries = Object.entries(c.clickMap).map(([k,v])=>({label:prettyTrack(k), v})).sort((a,b)=>b.v-a.v);
  const refEntries = Object.entries(c.refMap).map(([k,v])=>({label:k, v})).sort((a,b)=>b.v-a.v);
  const topLink = clickEntries[0] ? clickEntries[0].label : '—';

  root.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi"><div class="ico">👣</div><div class="val">${fmt(c.totalVisits)}</div><div class="lbl">${T('Visites','Visits')}</div>${deltaTag(c.totalVisits,c.prevVisits)}</div>
      <div class="kpi"><div class="ico">🖱️</div><div class="val">${fmt(c.totalClicks)}</div><div class="lbl">${T('Clics sur liens','Link clicks')}</div>${deltaTag(c.totalClicks,c.prevClicks)}</div>
      <div class="kpi"><div class="ico">💳</div><div class="val">${fmt(c.conv)}</div><div class="lbl">${T('Clics achat / cadeau','Buy / gift clicks')}</div></div>
      <div class="kpi"><div class="ico">📈</div><div class="val">${c.ctr}%</div><div class="lbl">${T('Taux de clic (CTR)','Click rate (CTR)')}</div></div>
      <div class="kpi"><div class="ico">📱</div><div class="val">${pct(c.mobile,c.totalVisits)}%</div><div class="lbl">${T('Visiteurs mobiles','Mobile visitors')}</div></div>
      <div class="kpi"><div class="ico">🏆</div><div class="val" style="font-size:1.15rem;line-height:1.2">${esc(topLink)}</div><div class="lbl">${T('Top lien cliqué','Top clicked link')}</div></div>
    </div>

    <div class="card">
      <div class="card-h"><h3>${T('Activité — visites & clics','Activity — visits & clicks')}</h3><span class="hint">${rangeLabel()}</span></div>
      ${areaChart(c.series)}
    </div>

    <div class="grid-2" style="margin-top:18px">
      <div class="card"><div class="card-h"><h3>${T('Top liens cliqués','Top clicked links')}</h3></div>${barList(clickEntries)}</div>
      <div class="card"><div class="card-h"><h3>${T('Sources de trafic','Traffic sources')}</h3></div>${barList(refEntries)}</div>
    </div>

    <div class="grid-2" style="margin-top:18px">
      <div class="card"><div class="card-h"><h3>${T('Langue des visiteurs','Visitor language')}</h3></div>
        ${donut([{label:'🇫🇷 '+T('Français','French'),v:c.langCount.fr,c:'#c9934a'},{label:'🇬🇧 '+T('Anglais','English'),v:c.langCount.en,c:'#c47a65'}])}</div>
      <div class="card"><div class="card-h"><h3>${T('Dernière activité','Recent activity')}</h3></div>${activityFeed(c)}</div>
    </div>
  `;
}
function prettyTrack(k){
  const map={ 'selar-shop':T('Boutique Selar','Selar shop') };
  if (map[k]) return map[k];
  const prem = PREMIUM.find(p=>p.track===k||p.id===k); if (prem) return T(prem.fr,prem.en);
  const site=STATE.site||{};
  for (const g of (site.gifts?.items||[])) if (g.id===k||'gift-'+g.id===k) return T(g.title_fr,g.title_en);
  for (const t of (site.tools?.items||[])) if (t.id===k||'tool-'+t.id===k) return T(t.title_fr,t.title_en);
  return k.replace(/[-_]/g,' ').replace(/\b\w/g,m=>m.toUpperCase());
}
function activityFeed(c){
  const a = getAnalytics();
  const evs = [
    ...a.clicks.slice(0,30).map(x=>({ts:x.ts,kind:'click',label:prettyTrack(x.value)})),
    ...a.visits.slice(0,30).map(x=>({ts:x.ts,kind:'visit',label:(x.lang==='en'?'🇬🇧':'🇫🇷')+' '+(x.mob?T('Mobile','Mobile'):T('Ordinateur','Desktop'))})),
  ].sort((a,b)=>b.ts-a.ts).slice(0,9);
  if (!evs.length) return `<div class="chart-empty"><div class="ei">🌙</div>${T('Aucune activité pour le moment.','No activity yet.')}</div>`;
  return `<div class="feed">${evs.map(e=>`
    <div class="feed-row">
      <div class="feed-ico">${e.kind==='click'?'🖱️':'👣'}</div>
      <div class="ft"><b>${esc(e.label)}</b><span>${e.kind==='click'?T('Clic sur un lien','Link click'):T('Nouvelle visite','New visit')}</span></div>
      <div class="fwhen">${ago(e.ts)}</div>
    </div>`).join('')}</div>`;
}
function ago(ts){
  const s=Math.floor((Date.now()-ts)/1000);
  if (s<60) return T('à l\'instant','just now');
  if (s<3600) return Math.floor(s/60)+'min';
  if (s<86400) return Math.floor(s/3600)+'h';
  return Math.floor(s/86400)+'j';
}
function rangeLabel(){ return STATE.range===0?T('Tout l\'historique','All time'):`${STATE.range} ${T('derniers jours','last days')}`; }

/* =================================================================
   PANEL: STORE / CATALOG
================================================================= */
let storeFilter='all', storeQuery='';
function renderStore(){
  const c = compute();
  const catalog = buildCatalog(c.clickMap);
  STATE.catalog = catalog;
  $('navStoreCount').textContent = catalog.length;

  const counts = { all:catalog.length, premium:0, gift:0, tool:0, amazon:0 };
  catalog.forEach(r=>counts[r.type]!==undefined && counts[r.type]++);
  const totalClicks = catalog.reduce((s,r)=>s+(r.clicks||0),0);

  const root = $('p-store');
  root.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi"><div class="ico">📦</div><div class="val">${counts.premium}</div><div class="lbl">${T('Produits premium','Premium products')}</div></div>
      <div class="kpi"><div class="ico">🎁</div><div class="val">${counts.gift}</div><div class="lbl">${T('Cadeaux gratuits','Free gifts')}</div></div>
      <div class="kpi"><div class="ico">🛠️</div><div class="val">${counts.tool}</div><div class="lbl">${T('Outils gratuits','Free tools')}</div></div>
      <div class="kpi"><div class="ico">🛍️</div><div class="val">${counts.amazon}</div><div class="lbl">${T('Produits affiliés','Affiliate products')}</div></div>
    </div>

    <div class="card">
      <div class="card-h">
        <h3>${T('Catalogue complet','Full catalog')}</h3>
        <span class="hint">${totalClicks} ${T('clics suivis','tracked clicks')} · ${rangeLabel()}</span>
        <div class="search-box"><span class="si">🔍</span><input id="storeSearch" placeholder="${T('Rechercher…','Search…')}" value="${esc(storeQuery)}"></div>
      </div>
      <div class="segmented" id="storeTabs" style="margin-bottom:16px">
        ${[['all',T('Tout','All')],['premium','📦 Premium'],['gift','🎁 '+T('Cadeaux','Gifts')],['tool','🛠️ '+T('Outils','Tools')],['amazon','🛍️ Amazon']]
          .map(([k,l])=>`<button data-f="${k}" class="${storeFilter===k?'on':''}">${l} <b style="opacity:.5">${counts[k]??''}</b></button>`).join('')}
      </div>
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>${T('Produit','Product')}</th><th>${T('Type','Type')}</th><th>${T('Statut','Status')}</th><th>${T('Clics','Clicks')}</th><th style="text-align:right">${T('Actions','Actions')}</th></tr></thead>
          <tbody id="storeRows"></tbody>
        </table>
      </div>
      <div id="storeEmpty"></div>
    </div>
  `;
  el('#storeSearch', root).addEventListener('input', e=>{ storeQuery=e.target.value; paintStoreRows(); });
  els('#storeTabs button', root).forEach(b=> b.addEventListener('click', ()=>{ storeFilter=b.dataset.f; renderStore(); }));
  paintStoreRows();
}
function paintStoreRows(){
  const rows = (STATE.catalog||[]).filter(r=>{
    if (storeFilter!=='all' && r.type!==storeFilter) return false;
    if (storeQuery){ const q=storeQuery.toLowerCase(); return (r.name||'').toLowerCase().includes(q) || (r.sub||'').toLowerCase().includes(q); }
    return true;
  });
  const tb = $('storeRows'); const empty=$('storeEmpty');
  if (!rows.length){ tb.innerHTML=''; empty.innerHTML=`<div class="empty"><div class="ei">🔍</div><h4>${T('Aucun résultat','No results')}</h4></div>`; return; }
  empty.innerHTML='';
  const pillClass={premium:'premium',gift:'gift',tool:'tool',amazon:'amazon'};
  const pillLabel={premium:'Premium',gift:T('Cadeau','Gift'),tool:T('Outil','Tool'),amazon:'Amazon'};
  tb.innerHTML = rows.map((r,idx)=>{
    const realIdx = STATE.catalog.indexOf(r);
    const thumb = r.img ? `<img class="t-thumb" src="${esc(r.img)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'t-thumb',textContent:'${r.emoji}'}))">` : `<div class="t-thumb">${r.emoji}</div>`;
    const status = r.status===null||r.status===undefined
      ? `<span class="pill ${r.affiliate?'amazon':'off'}">${r.affiliate?T('Affilié','Affiliate'):T('Lien','Link')}</span>`
      : `<button class="toggle ${r.status?'on':''}" data-toggle="${realIdx}" title="${T('Activer/Désactiver','Toggle')}"></button>`;
    return `<tr>
      <td><div class="cell-prod">${thumb}<div><div class="t-name">${esc(r.name)}</div><div class="t-sub">${esc(r.sub||'')}</div></div></div></td>
      <td><span class="pill ${pillClass[r.type]||'off'}">${pillLabel[r.type]||r.type}</span></td>
      <td>${status}</td>
      <td><b style="color:var(--gold)">${r.clicks?fmt(r.clicks):'—'}</b></td>
      <td style="text-align:right;white-space:nowrap">
        <a class="ibtn" href="${esc(r.url||'#')}" target="_blank" rel="noopener" title="${T('Ouvrir','Open')}">↗</a>
        ${r.ref?`<button class="ibtn" data-edit="${realIdx}" title="${T('Modifier','Edit')}">✏️</button>`:''}
      </td>
    </tr>`;
  }).join('');
  els('[data-toggle]', tb).forEach(b=> b.addEventListener('click', ()=> toggleCatalog(+b.dataset.toggle)));
  els('[data-edit]', tb).forEach(b=> b.addEventListener('click', ()=> editCatalog(+b.dataset.edit)));
}
function toggleCatalog(i){
  const r = STATE.catalog[i]; if (!r || !r.ref) return;
  setByPath(STATE.site, [...r.ref, 'on'], !r.status);
  STATE.siteDirty = true; persistSiteLocal();
  toast(r.status?T('Désactivé','Disabled'):T('Activé','Enabled'),'ok');
  renderStore(); markDirty();
}
function editCatalog(i){
  const r = STATE.catalog[i]; if (!r) return;
  // jump to the content tab section that owns this item
  go('content');
  toast(T('Modifie ce produit dans Contenu du site →','Edit this product under Site content →'));
}

/* =================================================================
   PANEL: CONTENT EDITOR  (edits site.json → Publish)
================================================================= */
function setByPath(obj, path, val){ let o=obj; for (let i=0;i<path.length-1;i++){ if (o[path[i]]==null) o[path[i]]={}; o=o[path[i]]; } o[path[path.length-1]]=val; }
function getByPath(obj, path){ let o=obj; for (const k of path){ if (o==null) return undefined; o=o[k]; } return o; }
function persistSiteLocal(){ try { localStorage.setItem(SITE_KEY, JSON.stringify(STATE.site)); } catch {} }

function renderContent(){
  const s = STATE.site;
  const root = $('p-content');
  root.innerHTML = `
    <div class="note" style="margin-bottom:18px"><span class="ni">💡</span><div>${T(
      'Modifie ici le contenu visible sur ton site (textes, liens, statut). Les changements sont enregistrés en local instantanément. Clique <strong>Publier</strong> pour générer le fichier <code>site.json</code> à mettre en ligne.',
      'Edit the content shown on your site (text, links, status). Changes save locally instantly. Click <strong>Publish</strong> to generate the <code>site.json</code> file to upload.')}</div></div>

    ${contentCard(T('Marque','Brand'),'🏷️',[
      ['brand.name_pre',T('Nom (préfixe)','Name (prefix)'),'text'],
      ['brand.name_acc',T('Nom (accent)','Name (accent)'),'text'],
      ['brand.tagline_fr','Tagline FR','text'],
      ['brand.tagline_en','Tagline EN','text'],
    ])}

    ${contentCard(T('Boutique (bouton principal)','Shop (main button)'),'🛒',[
      ['shop.eyebrow_fr',T('Sur-titre FR','Eyebrow FR'),'text'],
      ['shop.eyebrow_en',T('Sur-titre EN','Eyebrow EN'),'text'],
      ['shop.title_fr',T('Titre FR','Title FR'),'text'],
      ['shop.title_en',T('Titre EN','Title EN'),'text'],
      ['shop.url',T('Lien boutique (Selar)','Shop link (Selar)'),'url'],
      ['shop.cta_fr','CTA FR','text'],
      ['shop.cta_en','CTA EN','text'],
    ], 'shop.on')}

    ${listEditor(T('Cadeaux gratuits','Free gifts'),'🎁',['gifts','items'],[
      ['title_fr',T('Titre FR','Title FR')],['title_en',T('Titre EN','Title EN')],
      ['url_fr',T('Lien FR','Link FR')],['url_en',T('Lien EN','Link EN')],
    ])}

    ${listEditor(T('Outils gratuits','Free tools'),'🛠️',['tools','items'],[
      ['title_fr',T('Titre FR','Title FR')],['title_en',T('Titre EN','Title EN')],['url',T('Lien','Link')],
    ])}

    ${listEditor(T('Réseaux sociaux','Social links'),'🌐',['social','items'],[
      ['label_fr',T('Libellé','Label')],['url',T('Lien','Link')],
    ])}
  `;
  bindContentInputs(root);
}
function contentCard(title, emoji, fields, toggleKey){
  const s=STATE.site;
  const tog = toggleKey ? `<button class="toggle ${getByPath(s,toggleKey.split('.'))?'on':''}" data-ctoggle="${toggleKey}" style="margin-left:auto"></button>` : '';
  return `<div class="card">
    <div class="card-h"><h3>${emoji} ${esc(title)}</h3>${tog}</div>
    <div class="field-row" style="grid-template-columns:1fr 1fr">
      ${fields.map(([path,label,type])=>{
        const v = getByPath(s, path.split('.'))||'';
        return `<div class="form-group"><label>${esc(label)}</label><input type="${type||'text'}" data-cpath="${path}" value="${esc(v)}"></div>`;
      }).join('')}
    </div>
  </div>`;
}
function listEditor(title, emoji, basePath, fields){
  const items = getByPath(STATE.site, basePath) || [];
  return `<div class="card">
    <div class="card-h"><h3>${emoji} ${esc(title)}</h3><span class="hint">${items.length} ${T('éléments','items')}</span></div>
    ${items.map((it,i)=>`
      <div style="padding:14px;border:1px solid var(--stroke-2);border-radius:12px;margin-bottom:12px;background:rgba(255,255,255,.5)">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <span style="font-size:18px">${esc(it.emoji||it.icon||'•')}</span>
          <b style="flex:1">${esc(T(it.title_fr||it.label_fr, it.title_en||it.label_en)||'—')}</b>
          <button class="toggle ${it.on?'on':''}" data-ltoggle="${basePath.join('.')}.${i}"></button>
        </div>
        <div class="field-row">
          ${fields.map(([f,label])=>{ const v=it[f]||''; return `<div class="form-group" style="margin-bottom:8px"><label>${esc(label)}</label><input type="text" data-lpath="${basePath.join('.')}.${i}.${f}" value="${esc(v)}"></div>`; }).join('')}
        </div>
      </div>`).join('')}
  </div>`;
}
function bindContentInputs(root){
  els('[data-cpath]', root).forEach(inp=> inp.addEventListener('input', ()=>{ setByPath(STATE.site, inp.dataset.cpath.split('.'), inp.value); afterEdit(); }));
  els('[data-lpath]', root).forEach(inp=> inp.addEventListener('input', ()=>{ setByPath(STATE.site, inp.dataset.lpath.split('.'), inp.value); afterEdit(); }));
  els('[data-ctoggle]', root).forEach(b=> b.addEventListener('click', ()=>{ const p=b.dataset.ctoggle.split('.'); setByPath(STATE.site,p,!getByPath(STATE.site,p)); b.classList.toggle('on'); afterEdit(); }));
  els('[data-ltoggle]', root).forEach(b=> b.addEventListener('click', ()=>{ const p=b.dataset.ltoggle.split('.').concat('on'); setByPath(STATE.site,p,!getByPath(STATE.site,p)); b.classList.toggle('on'); afterEdit(); }));
}
let editDebounce;
function afterEdit(){ STATE.siteDirty=true; markDirty(); clearTimeout(editDebounce); editDebounce=setTimeout(persistSiteLocal,300); }
function markDirty(){ const b=$('publishBtn'); if (b){ b.classList.toggle('btn-gold', STATE.siteDirty); } }

function publish(){
  persistSiteLocal();
  const blob = new Blob([JSON.stringify(STATE.site,null,2)], {type:'application/json'});
  const a = document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='site.json'; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
  STATE.siteDirty=false; markDirty();
  modal(`<div class="modal-emoji">🚀</div><h2>${T('Publier tes modifications','Publish your changes')}</h2>
    <p class="modal-sub">${T('Le fichier','The file')} <code>site.json</code> ${T('vient d\'être téléchargé.','was just downloaded.')}</p>
    <ol class="modal-steps">
      <li>${T('Trouve','Find')} <code>site.json</code> ${T('dans tes téléchargements.','in your downloads.')}</li>
      <li>${T('Dépose-le dans le dossier','Drop it into the')} <code>assets/</code> ${T('de ton site (remplace l\'ancien).','folder of your site (replace the old one).')}</li>
      <li>${T('Mets ton site en ligne (redéploie).','Deploy your site (re-upload).')}</li>
    </ol>
    <div class="modal-actions"><button class="btn btn-gold btn-block" onclick="_dashCloseModal()">${T('J\'ai compris','Got it')}</button></div>`);
}

/* =================================================================
   PANEL: BLOG
================================================================= */
function renderBlog(){
  const root=$('p-blog');
  const posts = STATE.blog;
  $('navBlogCount').textContent = posts.length;
  if (!posts.length){ root.innerHTML=`<div class="card"><div class="empty"><div class="ei">✍️</div><h4>${T('Aucun article trouvé','No posts found')}</h4><p>${T('Les articles du blog apparaîtront ici.','Blog posts will appear here.')}</p></div></div>`; return; }
  root.innerHTML = `
    <div class="kpi-grid">
      <div class="kpi"><div class="ico">📝</div><div class="val">${posts.length}</div><div class="lbl">${T('Articles publiés','Published posts')}</div></div>
      <div class="kpi"><div class="ico">🗂️</div><div class="val">${new Set(posts.map(p=>p.cat)).size}</div><div class="lbl">${T('Catégories','Categories')}</div></div>
      <div class="kpi"><div class="ico">🌍</div><div class="val">FR · EN</div><div class="lbl">${T('Bilingue','Bilingual')}</div></div>
    </div>
    <div class="card">
      <div class="card-h"><h3>${T('Tous les articles','All posts')}</h3></div>
      <div class="tbl-wrap"><table>
        <thead><tr><th>${T('Article','Post')}</th><th>${T('Catégorie','Category')}</th><th>${T('Date','Date')}</th><th style="text-align:right">${T('Voir','View')}</th></tr></thead>
        <tbody>${posts.map(p=>`
          <tr>
            <td><div class="cell-prod"><div class="t-thumb">${esc(p.emoji||'📄')}</div><div><div class="t-name">${esc(T(p.title_fr,p.title_en))}</div><div class="t-sub">/${esc(p.slug)}</div></div></div></td>
            <td><span class="pill tool">${esc(p.cat||'—')}</span></td>
            <td>${esc(p.date||'—')}</td>
            <td style="text-align:right">
              <a class="ibtn" href="fr/blog/${esc(p.slug)}/" target="_blank" rel="noopener" title="FR">🇫🇷</a>
              <a class="ibtn" href="en/blog/${esc(p.slug)}/" target="_blank" rel="noopener" title="EN">🇬🇧</a>
            </td>
          </tr>`).join('')}</tbody>
      </table></div>
    </div>`;
}

/* =================================================================
   PANEL: TRAFFIC
================================================================= */
let trafficPage=0;
function renderTraffic(){
  const c=compute(); const root=$('p-traffic');
  const tzEntries=Object.entries(c.tzMap).map(([k,v])=>({label:k.split('/').pop().replace(/_/g,' '),v})).sort((a,b)=>b.v-a.v);
  const refEntries=Object.entries(c.refMap).map(([k,v])=>({label:k,v})).sort((a,b)=>b.v-a.v);
  root.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi"><div class="ico">👣</div><div class="val">${fmt(c.totalVisits)}</div><div class="lbl">${T('Visites','Visits')}</div>${deltaTag(c.totalVisits,c.prevVisits)}</div>
      <div class="kpi"><div class="ico">📱</div><div class="val">${pct(c.mobile,c.totalVisits)}%</div><div class="lbl">${T('Mobile','Mobile')}</div></div>
      <div class="kpi"><div class="ico">💻</div><div class="val">${pct(c.totalVisits-c.mobile,c.totalVisits)}%</div><div class="lbl">${T('Ordinateur','Desktop')}</div></div>
      <div class="kpi"><div class="ico">🌍</div><div class="val">${Object.keys(c.tzMap).length}</div><div class="lbl">${T('Fuseaux horaires','Time zones')}</div></div>
    </div>
    <div class="card"><div class="card-h"><h3>${T('Visites par jour','Visits per day')}</h3><span class="hint">${rangeLabel()}</span></div>${areaChart(c.series)}</div>
    <div class="grid-2" style="margin-top:18px">
      <div class="card"><div class="card-h"><h3>${T('Sources de trafic','Traffic sources')}</h3></div>${barList(refEntries,10)}</div>
      <div class="card"><div class="card-h"><h3>${T('Régions (fuseau horaire)','Regions (time zone)')}</h3></div>${barList(tzEntries,10)}</div>
    </div>
    <div class="card" style="margin-top:18px">
      <div class="card-h"><h3>${T('Journal des visites','Visit log')}</h3><span class="hint">${c.visits.length} ${T('entrées','entries')}</span></div>
      <div class="tbl-wrap"><table>
        <thead><tr><th>${T('Date & heure','Date & time')}</th><th>${T('Langue','Language')}</th><th>${T('Source','Source')}</th><th>${T('Appareil','Device')}</th><th>${T('Fuseau','Time zone')}</th></tr></thead>
        <tbody id="visitRows"></tbody>
      </table></div>
      <div id="visitPager" style="display:flex;justify-content:center;gap:8px;margin-top:14px"></div>
    </div>`;
  paintVisitRows(c.visits);
}
function paintVisitRows(visits){
  const per=12, total=Math.ceil(visits.length/per)||1; trafficPage=clamp(trafficPage,0,total-1);
  const slice=visits.slice(trafficPage*per,(trafficPage+1)*per);
  $('visitRows').innerHTML = slice.length? slice.map(v=>`
    <tr><td>${dt(v.ts)}</td><td>${v.lang==='en'?'🇬🇧 EN':'🇫🇷 FR'}</td><td>${esc(refDomain(v.ref))}</td><td>${v.mob?'📱 '+T('Mobile','Mobile'):'💻 '+T('Ordi','Desktop')}</td><td>${esc((v.tz||'—').split('/').pop().replace(/_/g,' '))}</td></tr>`).join('')
    : `<tr><td colspan="5"><div class="chart-empty"><div class="ei">👣</div>${T('Aucune visite enregistrée.','No visits recorded.')}</div></td></tr>`;
  pager('visitPager', total, trafficPage, p=>{ trafficPage=p; paintVisitRows(visits); });
}

/* =================================================================
   PANEL: CLICKS
================================================================= */
let clickPage=0;
function renderClicks(){
  const c=compute(); const root=$('p-clicks');
  const entries=Object.entries(c.clickMap).map(([k,v])=>({label:prettyTrack(k),v,raw:k})).sort((a,b)=>b.v-a.v);
  const convKeys=['selar-shop','shop',...PREMIUM.map(p=>p.track)];
  const giftKeys=(STATE.site.gifts?.items||[]).flatMap(g=>[g.id,'gift-'+g.id]);
  const toolKeys=(STATE.site.tools?.items||[]).flatMap(t=>[t.id,'tool-'+t.id]);
  const sum=(keys)=>c.clicks.filter(x=>keys.includes(x.value)).length;
  root.innerHTML=`
    <div class="kpi-grid">
      <div class="kpi"><div class="ico">🖱️</div><div class="val">${fmt(c.totalClicks)}</div><div class="lbl">${T('Clics totaux','Total clicks')}</div>${deltaTag(c.totalClicks,c.prevClicks)}</div>
      <div class="kpi"><div class="ico">💳</div><div class="val">${fmt(sum(convKeys))}</div><div class="lbl">${T('Clics achat (premium)','Buy clicks (premium)')}</div></div>
      <div class="kpi"><div class="ico">🎁</div><div class="val">${fmt(sum(giftKeys))}</div><div class="lbl">${T('Clics cadeaux','Gift clicks')}</div></div>
      <div class="kpi"><div class="ico">🛠️</div><div class="val">${fmt(sum(toolKeys))}</div><div class="lbl">${T('Clics outils','Tool clicks')}</div></div>
    </div>
    <div class="grid-2">
      <div class="card"><div class="card-h"><h3>${T('Répartition des clics','Click breakdown')}</h3></div>${donut(clickCategories(c))}</div>
      <div class="card"><div class="card-h"><h3>${T('Top liens','Top links')}</h3></div>${barList(entries,10)}</div>
    </div>
    <div class="card" style="margin-top:18px">
      <div class="card-h"><h3>${T('Journal des clics','Click log')}</h3><span class="hint">${c.clicks.length} ${T('entrées','entries')}</span></div>
      <div class="tbl-wrap"><table>
        <thead><tr><th>${T('Date & heure','Date & time')}</th><th>${T('Lien cliqué','Clicked link')}</th><th>${T('Identifiant','Tag')}</th></tr></thead>
        <tbody id="clickRows"></tbody>
      </table></div>
      <div id="clickPager" style="display:flex;justify-content:center;gap:8px;margin-top:14px"></div>
    </div>`;
  paintClickRows(c.clicks);
}
function clickCategories(c){
  const conv=['selar-shop','shop',...PREMIUM.map(p=>p.track)];
  const gift=(STATE.site.gifts?.items||[]).flatMap(g=>[g.id,'gift-'+g.id]);
  const tool=(STATE.site.tools?.items||[]).flatMap(t=>[t.id,'tool-'+t.id]);
  let buy=0,g=0,t=0,other=0;
  c.clicks.forEach(x=>{ if (conv.includes(x.value)) buy++; else if (gift.includes(x.value)) g++; else if (tool.includes(x.value)) t++; else other++; });
  return [{label:T('Achat / Premium','Buy / Premium'),v:buy,c:'#c47a65'},{label:T('Cadeaux','Gifts'),v:g,c:'#c9934a'},{label:T('Outils','Tools'),v:t,c:'#e8c07e'},{label:T('Autres','Other'),v:other,c:'#b9a48a'}];
}
function paintClickRows(clicks){
  const per=14, total=Math.ceil(clicks.length/per)||1; clickPage=clamp(clickPage,0,total-1);
  const slice=clicks.slice(clickPage*per,(clickPage+1)*per);
  $('clickRows').innerHTML = slice.length? slice.map(x=>`<tr><td>${dt(x.ts)}</td><td><b>${esc(prettyTrack(x.value))}</b></td><td><code style="font-size:11px;background:var(--gold-pale);padding:2px 6px;border-radius:5px">${esc(x.value||'—')}</code></td></tr>`).join('')
    : `<tr><td colspan="3"><div class="chart-empty"><div class="ei">🖱️</div>${T('Aucun clic enregistré.','No clicks recorded.')}</div></td></tr>`;
  pager('clickPager', total, clickPage, p=>{ clickPage=p; paintClickRows(clicks); });
}
function pager(id, total, cur, cb){
  const c=$(id); if (!c) return;
  if (total<=1){ c.innerHTML=''; return; }
  let h=`<button class="btn btn-sm" ${cur===0?'disabled':''} data-p="${cur-1}">←</button><span style="align-self:center;font-size:12px;color:var(--muted)">${cur+1} / ${total}</span><button class="btn btn-sm" ${cur===total-1?'disabled':''} data-p="${cur+1}">→</button>`;
  c.innerHTML=h; els('[data-p]',c).forEach(b=> b.addEventListener('click',()=>cb(+b.dataset.p)));
}
function dt(ts){ const d=new Date(ts); return d.toLocaleDateString(LANG==='en'?'en-US':'fr-FR',{day:'2-digit',month:'short'})+' '+d.toLocaleTimeString(LANG==='en'?'en-US':'fr-FR',{hour:'2-digit',minute:'2-digit'}); }

/* =================================================================
   PANEL: MODULES (hub of existing admin tools)
================================================================= */
const MODULES = [
  { e:'🛒', fr:'Produits & Amazon', en:'Products & Amazon', df:'Gérer le catalogue affilié', de:'Manage affiliate catalog', href:'products_admin.html' },
  { e:'💬', fr:'Diagnostic Chat', en:'Diagnostic Chat', df:'Admin du chat Schicgirl', de:'Schicgirl chat admin', href:'schicchat_admin.html' },
  { e:'💧', fr:'HydraCheck', en:'HydraCheck', df:'Diagnostic d\'hydratation', de:'Hydration quiz admin', href:'hydracheck_admin.html' },
  { e:'📅', fr:'Consultations', en:'Consultations', df:'Réservations & messages', de:'Bookings & messages', href:'consultation_admin.html' },
  { e:'🧰', fr:'Toolkit Landing', en:'Toolkit Landing', df:'Page de capture toolkit', de:'Toolkit opt-in page', href:'toolkit-landing_admin.html' },
  { e:'🎬', fr:'Ebook Studio', en:'Ebook Studio', df:'Créer des ebooks', de:'Create ebooks', href:'studio.html' },
  { e:'🤖', fr:'CoilCare AI', en:'CoilCare AI', df:'Assistant IA capillaire', de:'Hair AI assistant', href:'CoilCareAI.html' },
  { e:'⭐', fr:'Avis clients', en:'Reviews', df:'Modérer les avis', de:'Moderate reviews', href:'review.html' },
  { e:'🔗', fr:'Link-in-bio', en:'Link-in-bio', df:'Ancien admin complet', de:'Original full admin', href:'admin.html' },
];
function renderModules(){
  $('p-modules').innerHTML=`
    <div class="note" style="margin-bottom:18px"><span class="ni">🧩</span><div>${T('Accès rapide à tous tes outils et éditeurs spécialisés. Chacun s\'ouvre dans son interface dédiée.','Quick access to all your specialized tools and editors. Each opens in its dedicated interface.')}</div></div>
    <div class="hub-grid">${MODULES.map(m=>`
      <a class="hub-card" href="${esc(m.href)}" target="_blank" rel="noopener">
        <div class="he">${m.e}</div>
        <h4>${esc(T(m.fr,m.en))}</h4>
        <p>${esc(T(m.df,m.de))}</p>
        <div class="harrow">${T('Ouvrir','Open')} →</div>
      </a>`).join('')}</div>`;
}

/* =================================================================
   PANEL: SETTINGS
================================================================= */
function renderSettings(){
  const a=getAnalytics();
  $('p-settings').innerHTML=`
    <div class="grid-2">
      <div class="card">
        <div class="card-h"><h3>🔐 ${T('Mot de passe','Password')}</h3></div>
        <div class="form-group"><label>${T('Nouveau mot de passe','New password')}</label><input id="np1" type="password" placeholder="••••••••"></div>
        <div class="form-group"><label>${T('Confirmer','Confirm')}</label><input id="np2" type="password" placeholder="••••••••"></div>
        <button class="btn btn-primary" id="savePwd">${T('Changer le mot de passe','Change password')}</button>
      </div>
      <div class="card">
        <div class="card-h"><h3>🌐 ${T('Langue de l\'interface','Interface language')}</h3></div>
        <div class="segmented" style="margin-bottom:14px"><button class="${LANG==='fr'?'on':''}" id="langFr">🇫🇷 Français</button><button class="${LANG==='en'?'on':''}" id="langEn">🇬🇧 English</button></div>
        <p class="hint" style="font-size:12px;color:var(--muted)">${T('Change la langue de ton tableau de bord.','Switch your dashboard language.')}</p>
      </div>
    </div>
    <div class="card" style="margin-top:18px">
      <div class="card-h"><h3>💾 ${T('Données & statistiques','Data & analytics')}</h3><span class="hint">${a.visits.length} ${T('visites','visits')} · ${a.clicks.length} ${T('clics','clicks')}</span></div>
      <div class="note" style="margin-bottom:16px"><span class="ni">ℹ️</span><div>${T(
        'Les statistiques sont stockées dans <strong>ce navigateur</strong> (localStorage). Pour réunir les données de plusieurs appareils, exporte depuis chacun puis importe ici. Sauvegarde régulièrement.',
        'Analytics are stored in <strong>this browser</strong> (localStorage). To combine data from several devices, export from each then import here. Back up regularly.')}</div></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-ghost" id="expJson">↓ ${T('Exporter (JSON)','Export (JSON)')}</button>
        <button class="btn btn-ghost" id="expCsv">↓ ${T('Exporter clics (CSV)','Export clicks (CSV)')}</button>
        <button class="btn btn-ghost" id="impJson">↑ ${T('Importer / fusionner','Import / merge')}</button>
        <input type="file" id="impFile" accept="application/json" style="display:none">
        <button class="btn btn-danger" id="resetAna">🗑️ ${T('Réinitialiser les stats','Reset analytics')}</button>
      </div>
    </div>
    <div class="card" style="margin-top:18px">
      <div class="card-h"><h3>⚙️ ${T('Contenu du site','Site content')}</h3></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-gold" id="pub2">🚀 ${T('Publier site.json','Publish site.json')}</button>
        <button class="btn btn-danger" id="resetSite">↺ ${T('Annuler mes modifications','Discard my edits')}</button>
      </div>
    </div>`;
  bindSettings();
}
function bindSettings(){
  $('savePwd').addEventListener('click', async ()=>{
    const p1=$('np1').value, p2=$('np2').value;
    if (p1.length<4) return toast(T('Au moins 4 caractères.','At least 4 characters.'),'err');
    if (p1!==p2) return toast(T('Les mots de passe ne correspondent pas.','Passwords do not match.'),'err');
    const cfg=getCfg(); cfg.passwordHash=await sha256(p1); saveCfg(cfg);
    $('np1').value=$('np2').value=''; toast(T('Mot de passe mis à jour.','Password updated.'),'ok');
  });
  $('langFr').addEventListener('click',()=>switchLang('fr'));
  $('langEn').addEventListener('click',()=>switchLang('en'));
  $('expJson').addEventListener('click', exportJson);
  $('expCsv').addEventListener('click', exportCsv);
  $('impJson').addEventListener('click', ()=>$('impFile').click());
  $('impFile').addEventListener('change', importJson);
  $('resetAna').addEventListener('click', ()=> confirmModal(T('Réinitialiser toutes les statistiques ?','Reset all analytics?'), T('Cette action est irréversible.','This cannot be undone.'), ()=>{ saveAnalytics({visits:[],clicks:[]}); toast(T('Statistiques réinitialisées.','Analytics reset.'),'ok'); rebuild(); }));
  $('pub2').addEventListener('click', publish);
  $('resetSite').addEventListener('click', ()=> confirmModal(T('Annuler tes modifications de contenu ?','Discard your content edits?'), T('Le site reviendra à la dernière version publiée.','The site reverts to the last published version.'), async ()=>{ localStorage.removeItem(SITE_KEY); STATE.site=await loadSite(); STATE.siteDirty=false; toast(T('Modifications annulées.','Edits discarded.'),'ok'); rebuild(); }));
}
function switchLang(l){ LANG=l; localStorage.setItem('sg_lang',l); document.documentElement.lang=l; relabelNav(); rebuild(); }
function exportJson(){
  const blob=new Blob([JSON.stringify(getAnalytics(),null,2)],{type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='schicgirl-analytics.json'; a.click();
  toast(T('Statistiques exportées.','Analytics exported.'),'ok');
}
function exportCsv(){
  const d=getAnalytics(); let csv='date,value\n';
  d.clicks.forEach(c=> csv+=`${new Date(c.ts).toISOString()},"${(c.value||'').replace(/"/g,'""')}"\n`);
  const blob=new Blob([csv],{type:'text/csv'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='schicgirl-clicks.csv'; a.click();
  toast(T('CSV exporté.','CSV exported.'),'ok');
}
function importJson(e){
  const f=e.target.files[0]; if (!f) return;
  const r=new FileReader();
  r.onload=()=>{ try {
    const inc=JSON.parse(r.result); const cur=getAnalytics();
    const seen=new Set(cur.visits.map(v=>v.ts+'|'+v.lang));
    (inc.visits||[]).forEach(v=>{ const k=v.ts+'|'+v.lang; if (!seen.has(k)){ cur.visits.push(v); seen.add(k); } });
    const cseen=new Set(cur.clicks.map(c=>c.ts+'|'+c.value));
    (inc.clicks||[]).forEach(c=>{ const k=c.ts+'|'+c.value; if (!cseen.has(k)){ cur.clicks.push(c); cseen.add(k); } });
    cur.visits.sort((a,b)=>b.ts-a.ts); cur.clicks.sort((a,b)=>b.ts-a.ts);
    saveAnalytics(cur); toast(T('Données fusionnées.','Data merged.'),'ok'); rebuild();
  } catch { toast(T('Fichier invalide.','Invalid file.'),'err'); } };
  r.readAsText(f); e.target.value='';
}
function confirmModal(title, sub, onYes){
  modal(`<div class="modal-emoji">⚠️</div><h2>${esc(title)}</h2><p class="modal-sub">${esc(sub)}</p>
    <div class="modal-actions"><button class="btn btn-ghost btn-block" onclick="_dashCloseModal()">${T('Annuler','Cancel')}</button><button class="btn btn-danger btn-block" id="confYes">${T('Confirmer','Confirm')}</button></div>`);
  $('confYes').addEventListener('click', ()=>{ closeModal(); onYes(); });
}

/* =================================================================
   NAV / ROUTING
================================================================= */
const PAGES = {
  overview:{ fr:'Vue d\'ensemble', en:'Overview', eyebrow_fr:'Tableau de bord', eyebrow_en:'Dashboard', render:renderOverview, actions:'range,refresh' },
  store:{ fr:'Boutique', en:'Store', eyebrow_fr:'Catalogue', eyebrow_en:'Catalog', render:renderStore, actions:'refresh' },
  content:{ fr:'Contenu du site', en:'Site content', eyebrow_fr:'Éditeur', eyebrow_en:'Editor', render:renderContent, actions:'publish' },
  blog:{ fr:'Blog', en:'Blog', eyebrow_fr:'Articles', eyebrow_en:'Posts', render:renderBlog, actions:'' },
  traffic:{ fr:'Trafic & visites', en:'Traffic & visits', eyebrow_fr:'Statistiques', eyebrow_en:'Analytics', render:renderTraffic, actions:'range,refresh' },
  clicks:{ fr:'Clics & conversions', en:'Clicks & conversions', eyebrow_fr:'Statistiques', eyebrow_en:'Analytics', render:renderClicks, actions:'range,refresh' },
  modules:{ fr:'Outils & éditeurs', en:'Tools & editors', eyebrow_fr:'Modules', eyebrow_en:'Modules', render:renderModules, actions:'' },
  settings:{ fr:'Réglages', en:'Settings', eyebrow_fr:'Configuration', eyebrow_en:'Configuration', render:renderSettings, actions:'' },
};
function go(page){
  if (!PAGES[page]) page='overview';
  STATE.page=page; saveUI({page});
  els('.nav-item').forEach(b=> b.classList.toggle('active', b.dataset.go===page));
  els('.panel').forEach(p=> p.classList.remove('show'));
  $('p-'+page).classList.add('show');
  const def=PAGES[page];
  $('pgTitle').textContent=T(def.fr,def.en); $('pgEyebrow').textContent=T(def.eyebrow_fr,def.eyebrow_en);
  buildTopActions(def.actions);
  def.render();
  // close mobile drawer
  $('sidebar').classList.remove('open'); $('scrim').classList.remove('show');
  document.querySelector('.main').scrollTo?.(0,0); window.scrollTo(0,0);
}
function buildTopActions(actions){
  const host=$('topActions'); let h='';
  if (actions.includes('range')){
    const opts=[[7,'7j'],[30,'30j'],[90,'90j'],[0,T('Tout','All')]];
    h+=`<div class="segmented" id="rangeSeg">${opts.map(([v,l])=>`<button data-r="${v}" class="${STATE.range===v?'on':''}">${l}</button>`).join('')}</div>`;
  }
  if (actions.includes('publish')) h+=`<button class="btn btn-primary" id="publishBtn">🚀 ${T('Publier','Publish')}</button>`;
  if (actions.includes('refresh')) h+=`<button class="btn btn-ghost btn-sm" id="refreshBtn" title="${T('Actualiser','Refresh')}">↻</button>`;
  host.innerHTML=h;
  if ($('rangeSeg')) els('#rangeSeg button').forEach(b=> b.addEventListener('click',()=>{ STATE.range=+b.dataset.r; saveUI({range:STATE.range}); PAGES[STATE.page].render(); buildTopActions(actions); }));
  if ($('publishBtn')){ markDirty(); $('publishBtn').addEventListener('click', publish); }
  if ($('refreshBtn')) $('refreshBtn').addEventListener('click', ()=>{ PAGES[STATE.page].render(); toast(T('Actualisé.','Refreshed.'),'ok'); });
}
function relabelNav(){
  const labels={ overview:['📊','Vue d\'ensemble','Overview'], store:['🛍️','Boutique','Store'], content:['✨','Contenu du site','Site content'], blog:['✍️','Blog','Blog'], traffic:['👣','Trafic & visites','Traffic & visits'], clicks:['🖱️','Clics & conversions','Clicks & conversions'], modules:['🧩','Outils & éditeurs','Tools & editors'], settings:['⚙️','Réglages','Settings'] };
  els('.nav-item').forEach(b=>{ const d=labels[b.dataset.go]; if (d){ const badge=b.querySelector('.badge'); b.innerHTML=`<span class="ico">${d[0]}</span> ${T(d[1],d[2])} ${badge?badge.outerHTML:''}`; } });
  els('.sb-cat').forEach((c,i)=> c.textContent = i===0?T('Statistiques','Analytics'):T('Modules','Modules'));
}
function rebuild(){ PAGES[STATE.page].render(); if (STATE.page!=='store') renderStore.__count?.(); }

/* =================================================================
   AUTH FLOW
================================================================= */
async function tryLogin(){
  const att=getAttempts();
  if (att.until>Date.now()){ showErr(T('Trop de tentatives. Attends un instant.','Too many attempts. Wait a moment.')); return; }
  const entered=$('pwd').value;
  const h=await sha256(entered);
  if (h===passHash()){
    const cfg=getCfg(); cfg.loggedIn=true; saveCfg(cfg); setAttempts({count:0,until:0});
    await enterApp();
  } else {
    att.count=(att.count||0)+1; if (att.count>=5){ att.until=Date.now()+30000; att.count=0; }
    setAttempts(att); showErr(T('Mot de passe incorrect.','Incorrect password.'));
    $('pwd').value=''; $('pwd').focus();
  }
}
function showErr(m){ const e=$('loginErr'); e.textContent=m; e.style.display='block'; }

async function enterApp(){
  $('loginWrap').style.display='none';
  $('app').classList.add('show');
  // load all data
  STATE.site = await loadSite();
  [STATE.amazon, STATE.diy, STATE.blog] = await Promise.all([
    loadJsArray('assets/js/products.page.js','products'),
    loadJsArray('assets/js/products.page.js','diyItems'),
    loadJsArray('assets/js/blog.js','POSTS'),
  ]);
  // counts in nav
  $('navBlogCount').textContent = STATE.blog.length;
  // logo
  const logoUrl = STATE.site?.brand?.logo;
  if (logoUrl){ ['sbMark','loginMark'].forEach(id=>{ const e=$(id); if (e) e.innerHTML=`<img src="${esc(logoUrl)}" alt="S" onerror="this.parentNode.textContent='S'">`; }); }
  relabelNav();
  go(getUI().page || 'overview');
}

/* =================================================================
   INIT
================================================================= */
function init(){
  // wire login
  $('loginBtn').addEventListener('click', tryLogin);
  $('pwd').addEventListener('keydown', e=>{ if (e.key==='Enter') tryLogin(); });
  // nav
  els('.nav-item').forEach(b=> b.addEventListener('click', ()=> go(b.dataset.go)));
  // logout
  $('logoutBtn').addEventListener('click', ()=>{ const c=getCfg(); c.loggedIn=false; saveCfg(c); location.reload(); });
  // mobile drawer
  $('hamb').addEventListener('click', ()=>{ $('sidebar').classList.add('open'); $('scrim').classList.add('show'); });
  $('scrim').addEventListener('click', ()=>{ $('sidebar').classList.remove('open'); $('scrim').classList.remove('show'); });
  // warn before leaving with unsaved edits
  window.addEventListener('beforeunload', e=>{ if (STATE.siteDirty){ e.preventDefault(); e.returnValue=''; } });
  // keyboard: Esc closes modal
  document.addEventListener('keydown', e=>{ if (e.key==='Escape') closeModal(); });
  // auto-login if session active
  if (getCfg().loggedIn===true){ enterApp(); }
  else { $('pwd').focus(); }
}
document.addEventListener('DOMContentLoaded', init);

})();
