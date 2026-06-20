/* ════════════════════════════════════════════════════════════════
   SCHICGIRL ADMIN — full content editor + analytics
   Edits the same localStorage.schicgirl_site key that index.html reads.
   ════════════════════════════════════════════════════════════════ */

const SITE_KEY = 'schicgirl_site';
const ANALYTICS_KEY = 'schicgirl_analytics';
const ADMIN_KEY = 'schicgirl_admin_cfg';

// TODO: move auth to a backend before this holds anything sensitive
// default password hash — admin can change it from the settings tab
const DEFAULT_PASSWORD_HASH = 'eacb20f402c4738505df836b6cc58c054db7fbc3abe79ce7fc7520a906e3fcbb';

// rate limit
const LOGIN_ATTEMPTS_KEY = 'schicgirl_admin_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;
const PAGE_SIZE = 20;
const PUBLISHED_PATH = 'site.json';  // admin lives in assets/, so this is assets/site.json

/* ── DEFAULT SITE (mirror of index.html) ── */
const DEFAULT_SITE = {
  v: 1,
  brand: {
    logo: 'assets/logo2.png',
    name_pre: 'Schic', name_acc: 'girl', name_suf: '',
    tagline_fr: 'Tes cheveux crépus ne sont pas le problème — la méthode, si. On la corrige ensemble.',
    tagline_en: "Your coily hair isn't the problem — your method is. Let's fix it together.",
    watermark: 'Schicgirl · link.schicgirl.me · © 2026'
  },
  hero: {
    proof_fr: 'Spécialiste cheveux crépus Type 4',
    proof_en: 'Type 4 coily-hair specialist',
    icons: [
      'assets/woman_icon_0.png',
      'assets/woman_icon_1.png',
      'assets/woman_icon_2.png',
      'assets/woman_icon_3.png'
    ],
    stats: [
      { id:'s1', on:true, text_fr:'10 000+ femmes aidées', text_en:'10,000+ women helped' },
      { id:'s2', on:true, text_fr:'🇫🇷 🇬🇧 100% bilingue', text_en:'🇫🇷 🇬🇧 Fully bilingual' }
    ]
  },
  gifts: {
    on: true,
    label_fr: 'Tes Cadeaux Gratuits',
    label_en: 'Your Free Gifts',
    items: [
      { id:'guide', on:true, emoji:'📖',
        label_fr:'Gratuit · Le Kit Type 4', label_en:'Free · The Type 4 Kit',
        title_fr:'Le Guide Complet Cheveux Type 4', title_en:'The Complete Type 4 Hair Guide',
        sub_fr:'Comprends ta texture, construis ta routine, hydrate enfin tes cheveux crépus.',
        sub_en:'Understand your texture, build your routine, finally hydrate your coily hair.',
        url_fr:'https://schicgirl.me/toolkit-landing', url_en:'https://schicgirl.me/toolkit-landing' }
    ]
  },
  shop: {
    on: true,
    label_fr: 'Trouve TA solution', label_en: 'Find YOUR solution',
    eyebrow_fr: '★ Ebooks experts · Type 4', eyebrow_en: '★ Expert ebooks · Type 4',
    desc_fr: 'Hydratation, pousse, cuir chevelu, routines sur mesure — chaque guide règle un vrai problème de cheveux crépus.',
    desc_en: 'Hydration, growth, scalp, custom routines — each guide solves one real coily-hair problem.',
    url: 'https://selar.com/m/schicgirl', track: 'selar-shop',
    cta_fr: 'Voir tous mes ebooks →', cta_en: 'See all my ebooks →',
    items: [
      { id:'hydratee', on:true, img:'assets/ebook-hydratee.png', badge_fr:'Best-seller', badge_en:'Best-seller',
        title_fr:'Hydratée', title_en:'Hydrated',
        desc_fr:"La science de l'hydratation pour cheveux crépus — 59 pages, la méthode complète.",
        desc_en:'The science of hydration for coily hair — 59 pages, the full method.',
        price_fr:'17€', price_en:'$18', price_cfa:'(≈ 11 000 FCFA)', url:'https://selar.com/m/schicgirl' },
      { id:'pousse', on:true, img:'assets/ebook-pousse.png', badge_fr:'', badge_en:'',
        title_fr:'Pousse Maximale', title_en:'Maximum Growth',
        desc_fr:'Fais pousser tes cheveux crépus, sans casse ni frustration.',
        desc_en:'Grow your coily hair — without breakage or frustration.',
        price_fr:'14€', price_en:'$15', price_cfa:'(≈ 9 000 FCFA)', url:'https://selar.com/m/schicgirl' },
      { id:'coiffures', on:true, img:'assets/ebook-coiffures.png', badge_fr:'', badge_en:'',
        title_fr:'Coiffures Protectrices', title_en:'Protective Styles',
        desc_fr:'Protège tes longueurs et gagne en pousse avec les bons styles.',
        desc_en:'Protect your length and gain growth with the right styles.',
        price_fr:'12€', price_en:'$13', price_cfa:'(≈ 8 000 FCFA)', url:'https://selar.com/m/schicgirl' },
      { id:'pellicules', on:true, img:'assets/ebook-pellicules.png', badge_fr:'', badge_en:'',
        title_fr:'Adieu Pellicules', title_en:'Goodbye Dandruff',
        desc_fr:'Comprends et élimine les pellicules sur cheveux crépus, durablement.',
        desc_en:'Understand and clear dandruff on coily hair, for good.',
        price_fr:'12€', price_en:'$13', price_cfa:'(≈ 8 000 FCFA)', url:'https://selar.com/m/schicgirl' },
      { id:'cheveux-secs', on:true, img:'assets/ebook-cheveux-secs.png', badge_fr:'Petit prix', badge_en:'Budget',
        title_fr:'Stop aux Cheveux Secs', title_en:'Stop Dry Hair',
        desc_fr:'Le guide express pour en finir avec la sécheresse. Parfait pour commencer.',
        desc_en:'The express guide to end dryness for good. Perfect to start.',
        price_fr:'5€', price_en:'$6', price_cfa:'(≈ 3 500 FCFA)', url:'https://selar.com/m/schicgirl' },
      { id:'transition', on:true, img:'assets/ebook-transition.png', badge_fr:'', badge_en:'',
        title_fr:'Cheveux en Transition', title_en:'Transitioning Hair',
        desc_fr:'Passe du défrisé au naturel en douceur, étape par étape.',
        desc_en:'Go from relaxed to natural smoothly, step by step.',
        price_fr:'7€', price_en:'$7', price_cfa:'(≈ 4 500 FCFA)', url:'https://selar.com/m/schicgirl' }
    ]
  },
  tools: {
    on: true,
    label_fr: 'Outils Premium', label_en: 'Premium Tools',
    items: [
      { id:'schicchat', on:true, lang:'both', style:'feature', icon:'💬',
        label_fr:'Diagnostique Auto · Premium', label_en:'Diagnostic · Premium',
        title_fr:'Schicgirl Diagnostique', title_en:'Schicgirl Diagnostic Chat',
        sub_fr:'Parle-moi de tes cheveux — réponses expertes instantanées.',
        sub_en:'Talk to me about your hair — instant expert answers.',
        url:'https://selar.com/schicchat' },
      { id:'premium-fr', on:true, lang:'both', style:'card', icon:'💧',
        title_fr:'Pourquoi tes cheveux restent secs?', title_en:'Why does your hair stay dry?',
        sub_fr:"Je vais t'aider à comprendre pourquoi tes cheveux crépus restent secs.",
        sub_en:"I'll help you understand why your curly hair stays dry.",
        url:'https://selar.com/hydracheck' },
      { id:'consultation', on:true, lang:'both', style:'card', icon:'📅', badge:'',
        title_fr:'Consultation Capillaire', title_en:'Hair Consultation',
        sub_fr:'Réserve ta consultation personnalisée avec Schicgirl.',
        sub_en:'Book your personalised consultation with Schicgirl.',
        url:'https://schicgirl.me/consultation' }
    ]
  },
  amazon: {
    on: true,
    label_fr: 'Mes Sélections', label_en: 'My Curated Picks',
    items: [
      { id:'amazon-shop', on:true, img:'', emoji:'🛍️',
        eyebrow_fr:'Boutique Amazon', eyebrow_en:'Amazon Storefront',
        name_fr:'Tous mes coups de cœur', name_en:'All My Picks',
        desc_fr:'Toutes mes recommandations capillaires.',
        desc_en:'Browse every product I trust for natural hair.',
        url:'https://www.amazon.com/shop/schicgirl',
        cta_fr:'Voir →', cta_en:'Shop →' },
      { id:'auntjackies-baby', on:true, img:'assets/baby_curls_cream.png', emoji:'🧴',
        eyebrow_fr:'Enfants · Boucles', eyebrow_en:'Kids · Curl Care',
        name_fr:"Aunt Jackie's Baby Curls", name_en:"Aunt Jackie's Baby Curls",
        desc_fr:'Crème douce pour définir les boucles des enfants.',
        desc_en:'Gentle curl-defining cream for little ones.',
        url:'https://amzn.to/491lO7A', cta_fr:'Voir →', cta_en:'Get it →' },
      { id:'auntjackies-bundle', on:true, img:'assets/amazon.png', emoji:'📦',
        eyebrow_fr:'Boucles & Coils', eyebrow_en:'Curls & Coils',
        name_fr:"Aunt Jackie's Bundle", name_en:"Aunt Jackie's Bundle",
        desc_fr:'Le système complet soin boucles & coils.',
        desc_en:'The full curl & coil care system in one set.',
        url:'https://amzn.to/3OkUfzm', cta_fr:'Voir →', cta_en:'Get it →' }
    ]
  },
  testimonials: {
    on: true,
    label_fr: 'Résultats Réels', label_en: 'Real Results',
    rating: '5,0',
    reviews: '',
    items: [
      { id:'t1', on:true, stars:5, author:'Sophie C.',
        text_fr:'Cette routine a transformé mes boucles ! Enfin des cheveux doux.',
        text_en:'This routine transformed my curls! Soft, hydrated hair at last.' },
      { id:'t2', on:true, stars:5, author:'Miriam L.',
        text_fr:"Des conseils personnalisés qui marchent vraiment. Mes cheveux n'ont jamais été aussi beaux.",
        text_en:'Personalised advice that actually works. My hair has never been better.' },
      { id:'t3', on:true, stars:5, author:'Anita P.',
        text_fr:"Outils révolutionnaires. Mes cheveux naturels s'épanouissent !",
        text_en:'Game-changing tools. My natural hair is thriving!' },
      { id:'t4', on:true, stars:5, author:'Fatoumata D.',
        text_fr:"J'ai enfin compris ma porosité. Tout fait sens maintenant !",
        text_en:'Finally understood my porosity. Everything clicked!' },
      { id:'t5', on:true, stars:5, author:'Awa K.',
        text_fr:'Première fois que ma routine tient toute la semaine. Merci Schicgirl !',
        text_en:'First time my routine holds all week. Thank you Schicgirl!' },
      { id:'t6', on:true, stars:5, author:'Khadija B.',
        text_fr:"Mes longueurs ne cassent plus. J'ai retrouvé confiance en mes cheveux.",
        text_en:"My ends stopped breaking. I've got my confidence back." },
      { id:'t7', on:true, stars:5, author:'Aïcha N.',
        text_fr:"Des explications claires, et en français ! Enfin quelqu'un qui comprend nos cheveux.",
        text_en:'Clear explanations, and in French! Finally someone who understands our hair.' }
    ]
  },
  gallery: {
    on: true,
    label_fr: 'Comprends tes cheveux', label_en: 'Understand your hair',
    items: [
      { id:'g1', on:true, img:'assets/gallery-types.svg', cap_fr:'', cap_en:'' },
      { id:'g2', on:true, img:'assets/gallery-porosity.svg', cap_fr:'', cap_en:'' },
      { id:'g3', on:true, img:'assets/gallery-routine.svg', cap_fr:'', cap_en:'' },
      { id:'g4', on:true, img:'assets/gallery-invite.svg', cap_fr:'', cap_en:'' }
    ]
  },
  social: {
    on: true,
    label_fr: 'Me Retrouver', label_en: 'Connect',
    items: [
      { id:'facebook', on:true, icon:'📘', label_fr:'Facebook', label_en:'Facebook',
        sub_fr:'Conseils & coulisses', sub_en:'Daily tips & real talk',
        url:'https://www.facebook.com/schicgirl' },
      { id:'email', on:true, icon:'✉️', label_fr:"M'Écrire", label_en:'Email Me',
        sub_fr:'Collabs & support', sub_en:'Collabs & support',
        url:'mailto:contacte.schicgirl@gmail.com' }
    ]
  },
  footer: {
    logo_show: true,
    brand: 'Schicgirl',
    disc_fr: "En tant qu'associée Amazon, je gagne des revenus grâce aux achats éligibles.<br/>contacte.schicgirl@gmail.com",
    disc_en: 'As an Amazon Associate I earn from qualifying purchases.<br/>contacte.schicgirl@gmail.com'
  }
};

/* ── UTILS ── */
const $ = id => document.getElementById(id);
function esc(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function isUrl(s) { return typeof s === 'string' && /^https?:\/\//i.test(s); }
function isData(s) { return typeof s === 'string' && s.startsWith('data:'); }
function isAssetPath(s) { return typeof s === 'string' && /\.(png|jpe?g|gif|webp|svg|ico)(\?.*)?$/i.test(s.trim()); }
function isImg(s) { return isUrl(s) || isData(s) || isAssetPath(s); }
/* The public site (index.html) lives at the web root and stores image paths
   relative to it (e.g. "assets/logo.png"). This admin panel lives one level
   deeper (inside assets/), so it must add "../" to preview those same paths.
   URLs, data: URIs and root-absolute "/…" paths are used as-is. */
function previewSrc(s) {
  if (!s || isUrl(s) || isData(s) || s.startsWith('/')) return s;
  if (s.startsWith('assets/')) return '../' + s;
  return s;
}
function fmtDate(ts) { return new Date(ts).toLocaleDateString('fr-FR', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
function toast(msg, type='') {
  const t = $('toast'); t.textContent = msg; t.className = 'toast' + (type?' '+type:'');
  t.classList.add('show'); clearTimeout(window._toastT);
  window._toastT = setTimeout(()=>t.classList.remove('show'), 2800);
}

/* ── CONFIG STORE ── */
function getCfg() { try { return JSON.parse(localStorage.getItem(ADMIN_KEY)||'{}'); } catch { return {}; } }
function saveCfg(d) { try { localStorage.setItem(ADMIN_KEY, JSON.stringify(d)); } catch {} }
// Returns the SHA-256 hash of the active password (either the user's
// custom one or the default).
function getPasswordHash() { return getCfg().passwordHash || DEFAULT_PASSWORD_HASH; }

async function sha256(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

function getAttempts() {
  try { return JSON.parse(sessionStorage.getItem(LOGIN_ATTEMPTS_KEY) || '{"count":0,"until":0}'); }
  catch { return { count: 0, until: 0 }; }
}
function bumpAttempts() {
  const a = getAttempts();
  a.count++;
  if (a.count >= MAX_ATTEMPTS) a.until = Date.now() + LOCKOUT_MS;
  sessionStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(a));
}
function clearAttempts() { sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY); }

/* ── SITE STORE ── */
function deepMerge(base, over) {
  if (Array.isArray(over)) return over;
  if (over && typeof over === 'object' && !Array.isArray(over)) {
    const out = { ...base };
    for (const k in over) {
      out[k] = (k in base && typeof base[k] === 'object' && base[k] !== null && !Array.isArray(base[k]))
        ? deepMerge(base[k], over[k]) : over[k];
    }
    return out;
  }
  return over;
}
function loadSite() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(SITE_KEY) || 'null'); } catch {}
  if (!s) return JSON.parse(JSON.stringify(DEFAULT_SITE));
  return deepMerge(JSON.parse(JSON.stringify(DEFAULT_SITE)), s);
}
function saveSite() {
  try { localStorage.setItem(SITE_KEY, JSON.stringify(SITE)); return true; }
  catch (e) { toast('Erreur de sauvegarde: '+e.message, 'err'); return false; }
}

let SITE = loadSite();

/* ── ANALYTICS DATA ── */
function getData() { try { return JSON.parse(localStorage.getItem(ANALYTICS_KEY)||'{"visits":[],"clicks":[]}'); } catch { return { visits: [], clicks: [] }; } }

/* ── CLICK LABELS (built dynamically from SITE) ── */
function clickLabel(val) {
  if (!val) return '—';
  // Build map from current SITE on demand
  const map = {};
  (SITE.gifts.items||[]).forEach(i => {
    map['gift-'+i.id+'-fr'] = '🎁 '+i.title_fr;
    map['gift-'+i.id+'-en'] = '🎁 '+i.title_en;
  });
  map[SITE.shop.track||'selar-shop'] = '🛒 '+(SITE.shop.label_fr || 'Boutique');
  (SITE.tools.items||[]).forEach(i => { map[i.id] = (i.icon||'🔗')+' '+(i.title_fr||i.title_en); });
  (SITE.amazon.items||[]).forEach(i => { map[i.id] = (i.emoji||'📦')+' '+(i.name_fr||i.name_en); });
  (SITE.social.items||[]).forEach(i => { map[i.id] = (i.icon||'🔗')+' '+(i.label_fr||i.label_en); });
  return map[val] || val;
}

/* ── IMAGE COMPRESSION ── */
function compressImage(file, maxW=800, quality=0.85) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onerror = ()=>reject(new Error('Lecture du fichier échouée'));
    r.onload = e => {
      const img = new Image();
      img.onerror = ()=>reject(new Error('Image invalide'));
      img.onload = () => {
        const scale = Math.min(1, maxW/img.width);
        const c = document.createElement('canvas');
        c.width = Math.round(img.width*scale);
        c.height = Math.round(img.height*scale);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0,0,c.width,c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = e.target.result;
    };
    r.readAsDataURL(file);
  });
}

/* ── STORAGE INFO ── */
function storageUsed() {
  let total = 0;
  try { for (const k in localStorage) { if (Object.prototype.hasOwnProperty.call(localStorage,k)) total += (localStorage[k].length+k.length)*2; } } catch {}
  return total;
}
function fmtBytes(b) {
  if (b < 1024) return b+' B';
  if (b < 1048576) return (b/1024).toFixed(1)+' KB';
  return (b/1048576).toFixed(2)+' MB';
}

/* ── AUTH ── */
function checkSession() { return getCfg().loggedIn === true; }
async function login() {
  $('loginError').style.display = 'none';
  const attempts = getAttempts();
  if (attempts.until && Date.now() < attempts.until) {
    const wait = Math.ceil((attempts.until - Date.now()) / 1000);
    $('loginError').textContent = `Too many attempts. Try again in ${wait}s.`;
    $('loginError').style.display = 'block';
    return;
  }
  const entered = $('pwdInput').value;
  const enteredHash = await sha256(entered);
  if (enteredHash !== getPasswordHash()) {
    bumpAttempts();
    $('loginError').textContent = 'Incorrect password.';
    $('loginError').style.display = 'block';
    $('pwdInput').value = '';
    return;
  }
  clearAttempts();
  const cfg = getCfg(); cfg.loggedIn = true; saveCfg(cfg);
  showDash();
}
function logout() {
  const cfg = getCfg(); cfg.loggedIn = false; saveCfg(cfg);
  showLogin();
}
function showDash() {
  $('loginCard').classList.add('hidden');
  $('dashboard').classList.remove('hidden');
  $('topActions').classList.remove('hidden');
  updateBrandMark();
  renderAll();
}
function showLogin() {
  $('loginCard').classList.remove('hidden');
  $('dashboard').classList.add('hidden');
  $('topActions').classList.add('hidden');
}

function updateBrandMark() {
  const m = $('brandMark');
  if (SITE.brand.logo) {
    m.innerHTML = `<img src="${esc(previewSrc(SITE.brand.logo))}" alt="" onerror="var p=this.parentElement;p.innerHTML='S'"/>`;
  } else {
    m.textContent = (SITE.brand.name_pre||'S').charAt(0);
  }
}

$('loginBtn').onclick = login;
$('pwdInput').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
$('logoutBtn').onclick = logout;

/* ── TABS ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    $('tab-'+btn.dataset.tab).classList.add('active');
  });
});

/* ── RENDER ALL ── */
function renderAll() {
  renderAnalytics();
  renderBrandTab();
  renderHeroTab();
  renderGiftsTab();
  renderShopTab();
  renderToolsTab();
  renderAmazonTab();
  renderGalleryTab();
  renderReviewsTab();
  renderSocialTab();
  renderFooterTab();
  renderClicksTab();
  renderVisitsTab();
  renderSettingsTab();
}

/* ════════════════════════════════════════════
   ANALYTICS RENDERING
   ════════════════════════════════════════════ */
function renderAnalytics() {
  const data = getData();
  const { visits, clicks } = data;
  $('sTotal').textContent = visits.length;
  $('sClicks').textContent = clicks.length;
  const mob = visits.filter(v=>v.mob).length;
  $('sMobile').textContent = visits.length ? Math.round(mob/visits.length*100)+'%' : '0%';

  const freq = {};
  clicks.forEach(c => { if (c.value) freq[c.value] = (freq[c.value]||0)+1; });
  const top = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0];
  $('sTopLink').textContent = top ? top[1] : '—';

  $('mFR').textContent = visits.filter(v=>v.lang==='fr').length;
  $('mEN').textContent = visits.filter(v=>v.lang==='en').length;
  $('mGift').textContent = clicks.filter(c=>c.value && c.value.startsWith('gift-')).length;
  $('mShop').textContent = clicks.filter(c=>c.value===(SITE.shop.track||'selar-shop')).length;
  const amazonIds = (SITE.amazon.items||[]).map(i=>i.id);
  $('mAmazon').textContent = clicks.filter(c=>amazonIds.includes(c.value)).length;

  // Click chart
  const cf = {};
  clicks.forEach(c => { const l = clickLabel(c.value); cf[l] = (cf[l]||0)+1; });
  const entries = Object.entries(cf).sort((a,b)=>b[1]-a[1]).slice(0,8);
  renderBarChart('clickChart', entries, 'Aucun clic enregistré encore.');

  // Day chart (30d)
  const days = {};
  const now = Date.now(), ms30 = 30*86400000;
  visits.filter(v=>now-v.ts<ms30).forEach(v => {
    const d = new Date(v.ts).toLocaleDateString('fr-FR', { day:'2-digit', month:'short' });
    days[d] = (days[d]||0)+1;
  });
  renderBarChart('dayChart', Object.entries(days).sort((a,b)=>a[0].localeCompare(b[0])).slice(-10), 'Pas encore de visites sur 30 jours.');

  // Ref chart
  const rf = {};
  visits.forEach(v => {
    let ref='Direct';
    if (v.ref && v.ref!=='direct') {
      try { ref = new URL(v.ref).hostname.replace('www.',''); } catch { ref = v.ref.slice(0,25); }
    }
    rf[ref] = (rf[ref]||0)+1;
  });
  renderBarChart('refChart', Object.entries(rf).sort((a,b)=>b[1]-a[1]).slice(0,6), 'Aucune donnée de source.');

  // Lang chart
  const lf = {};
  visits.forEach(v => { const l = v.lang==='fr'?'🇫🇷 Français':'🇬🇧 English'; lf[l] = (lf[l]||0)+1; });
  renderBarChart('langChart', Object.entries(lf).sort((a,b)=>b[1]-a[1]), 'Aucune visite enregistrée.');
}

function renderBarChart(id, entries, emptyMsg) {
  const el = $(id); if (!el) return;
  if (!entries.length) { el.innerHTML = `<p style="font-size:13px;color:var(--muted)">${emptyMsg}</p>`; return; }
  const max = entries[0][1] || 1;
  el.innerHTML = entries.map(([k,v]) => `
    <div class="bar-row">
      <span class="bl" title="${esc(k)}">${esc(k.length>30?k.slice(0,30)+'…':k)}</span>
      <div class="bt"><div class="bf" style="width:${Math.round(v/max*100)}%"></div></div>
      <span class="bc">${v}</span>
    </div>`).join('');
}

/* ════════════════════════════════════════════
   CLICKS / VISITS TABLES
   ════════════════════════════════════════════ */
let clickPage = 1;
function renderClicksTab(page) {
  clickPage = page || 1;
  const data = getData();
  const rows = [...data.clicks].reverse();
  const total = rows.length;
  $('clickCount').textContent = total + ' clic' + (total>1?'s':'');
  const tbody = $('clickRows'), empty = $('clickEmpty');
  if (!total) { tbody.innerHTML = ''; empty.classList.remove('hidden'); $('clickPagination').innerHTML = ''; return; }
  empty.classList.add('hidden');
  const start = (clickPage-1)*PAGE_SIZE;
  const pageRows = rows.slice(start, start+PAGE_SIZE);
  const giftIds = new Set((SITE.gifts.items||[]).map(i=>i.id));
  const amazonIds = new Set((SITE.amazon.items||[]).map(i=>i.id));
  tbody.innerHTML = pageRows.map(r => {
    const v = r.value || '';
    let cls = 'badge-brown';
    if (v.startsWith('gift-')) cls = 'badge-rose';
    else if (amazonIds.has(v)) cls = 'badge-gold';
    else if (v === 'schicchat') cls = 'badge-blue';
    else if (v === (SITE.shop.track||'selar-shop')) cls = 'badge-gold';
    return `<tr>
      <td style="font-size:12px;color:var(--muted);white-space:nowrap">${esc(fmtDate(r.ts))}</td>
      <td style="word-break:break-all">${esc(v||'—')}</td>
      <td><span class="badge ${cls}">${esc(clickLabel(v))}</span></td>
    </tr>`;
  }).join('');
  renderPagination('clickPagination', total, clickPage, p => renderClicksTab(p));
}

let visitPage = 1;
function renderVisitsTab(page) {
  visitPage = page || 1;
  const data = getData();
  const rows = [...data.visits].reverse();
  const total = rows.length;
  $('visitCount').textContent = total + ' visite' + (total>1?'s':'');
  const tbody = $('visitRows'), empty = $('visitEmpty');
  if (!total) { tbody.innerHTML = ''; empty.classList.remove('hidden'); $('visitPagination').innerHTML = ''; return; }
  empty.classList.add('hidden');
  const start = (visitPage-1)*PAGE_SIZE;
  const pageRows = rows.slice(start, start+PAGE_SIZE);
  tbody.innerHTML = pageRows.map(r => {
    let ref = 'Direct';
    if (r.ref && r.ref!=='direct') { try { ref = new URL(r.ref).hostname.replace('www.',''); } catch { ref = r.ref.slice(0,30); } }
    return `<tr>
      <td style="font-size:12px;color:var(--muted);white-space:nowrap">${esc(fmtDate(r.ts))}</td>
      <td><span class="badge ${r.lang==='fr'?'badge-rose':'badge-green'}">${r.lang==='fr'?'🇫🇷 FR':'🇬🇧 EN'}</span></td>
      <td style="font-size:12px;color:var(--muted)">${esc(ref)}</td>
      <td><span class="badge badge-brown">${r.mob?'📱 Mobile':'🖥️ Desktop'}</span></td>
      <td style="font-size:12px;color:var(--muted)">${esc(r.tz||'—')}</td>
    </tr>`;
  }).join('');
  renderPagination('visitPagination', total, visitPage, p => renderVisitsTab(p));
}

function renderPagination(id, total, current, cb) {
  const pages = Math.ceil(total/PAGE_SIZE);
  const el = $(id);
  if (pages <= 1) { el.innerHTML = ''; return; }
  const start = (current-1)*PAGE_SIZE+1, end = Math.min(current*PAGE_SIZE, total);
  let html = `<span style="font-size:12px;color:var(--muted)">${start}–${end} sur ${total}</span><div class="page-btns">`;
  html += `<button class="page-btn" onclick="(${cb})(${current-1})" ${current===1?'disabled':''}>‹</button>`;
  for (let p = 1; p <= pages; p++) {
    if (p === 1 || p === pages || Math.abs(p-current) <= 1) html += `<button class="page-btn${p===current?' active':''}" onclick="(${cb})(${p})">${p}</button>`;
    else if (Math.abs(p-current) === 2) html += `<span style="display:grid;place-items:center;width:32px;color:var(--muted)">…</span>`;
  }
  html += `<button class="page-btn" onclick="(${cb})(${current+1})" ${current===pages?'disabled':''}>›</button></div>`;
  el.innerHTML = html;
}

/* ════════════════════════════════════════════
   IMAGE WIDGET (shared across editors)
   ════════════════════════════════════════════ */
function renderImageWidget(currentValue, fallback, ids, hintHtml) {
  const v = currentValue || '';
  const fb = fallback || '📦';
  const previewContent = isImg(v) ? `<img src="${esc(previewSrc(v))}" alt=""/>` : esc(fb);
  return `
    <div class="img-up">
      <div class="img-up-prev" id="${ids.prev}" data-fb="${esc(fb)}">${previewContent}</div>
      <div class="img-up-ctrls">
        <div class="img-up-row">
          <input type="text" id="${ids.url}" value="${esc(v)}" placeholder="https://… ou nom de fichier" oninput="imgUrlChange('${ids.prev}','${ids.url}','${ids.hidden}')"/>
        </div>
        <div class="img-up-btns">
          <label class="img-up-btn">📂 Téléverser<input type="file" accept="image/*" style="display:none" onchange="imgUploadChange(event,'${ids.prev}','${ids.url}','${ids.hidden}')"/></label>
          <button type="button" class="img-up-btn danger" onclick="imgClear('${ids.prev}','${ids.url}','${ids.hidden}')">🗑 Retirer</button>
          ${hintHtml ? `<span class="img-up-hint">${hintHtml}</span>` : ''}
        </div>
      </div>
      <input type="hidden" id="${ids.hidden}" value="${esc(v)}"/>
    </div>`;
}

function _imgFb(prevId) { const p = $(prevId); return (p && p.dataset.fb) || '📦'; }
function imgUrlChange(prevId, urlId, hidId) {
  const url = $(urlId).value.trim();
  $(hidId).value = url;
  const prev = $(prevId);
  prev.innerHTML = isImg(url) ? `<img src="${esc(previewSrc(url))}" alt=""/>` : esc(_imgFb(prevId));
}
function imgClear(prevId, urlId, hidId) {
  $(urlId).value = ''; $(hidId).value = '';
  $(prevId).innerHTML = esc(_imgFb(prevId));
}
async function imgUploadChange(e, prevId, urlId, hidId) {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  try {
    const dataUrl = await compressImage(f, 800, 0.85);
    $(urlId).value = dataUrl; $(hidId).value = dataUrl;
    $(prevId).innerHTML = `<img src="${esc(dataUrl)}" alt=""/>`;
    const kb = Math.round(dataUrl.length/1024);
    if (kb > 300) toast(`Image lourde (${kb} KB) — pense à utiliser une URL pour les gros fichiers.`, '');
    else toast(`Image téléversée (${kb} KB).`, 'ok');
  } catch(err) { toast('Erreur: '+err.message, 'err'); }
  e.target.value = '';
}


/* ════════════════════════════════════════════
   SHARED ITEM HELPERS (for list editors)
   ════════════════════════════════════════════ */

/* readTabInputs() flushes pending input edits into SITE before a structural action
   so the user doesn't lose typed text when reordering / deleting / adding items.
   Each list-editor tab registers a read function under this map. */
const TAB_READ = {
  hero:         'readHero',
  gifts:        'readGifts',
  tools:        'readTools',
  amazon:       'readAmazon',
  gallery:      'readGallery',
  testimonials: 'readReviews',
  social:       'readSocial'
};
function readTabInputs(sectionKey) {
  const fn = TAB_READ[sectionKey];
  if (fn && typeof window[fn] === 'function') {
    try { window[fn](); } catch (e) { /* tab not currently rendered */ }
  }
}

const RERENDER = {
  brand: ()=>{ renderBrandTab(); updateBrandMark(); },
  hero: renderHeroTab, gifts: renderGiftsTab, shop: renderShopTab,
  tools: renderToolsTab, amazon: renderAmazonTab,
  gallery: renderGalleryTab,
  testimonials: renderReviewsTab, social: renderSocialTab,
  footer: renderFooterTab
};
function rerender(sectionKey) {
  const fn = RERENDER[sectionKey];
  if (fn) fn();
}

function itemAdd(sectionKey, template) {
  readTabInputs(sectionKey);
  SITE[sectionKey].items = SITE[sectionKey].items || [];
  SITE[sectionKey].items.push({ ...template, id: template.id || uid(), on: true });
  if (saveSite()) { rerender(sectionKey); toast('Élément ajouté.', 'ok'); }
}
function itemDel(sectionKey, idx) {
  if (!confirm('Supprimer cet élément ?')) return;
  readTabInputs(sectionKey);
  SITE[sectionKey].items.splice(idx, 1);
  if (saveSite()) { rerender(sectionKey); toast('Élément supprimé.', 'ok'); }
}
function itemMove(sectionKey, idx, dir) {
  const items = SITE[sectionKey].items || [];
  const j = idx + dir;
  if (j < 0 || j >= items.length) return;
  readTabInputs(sectionKey);
  const tmp = items[idx]; items[idx] = items[j]; items[j] = tmp;
  if (saveSite()) rerender(sectionKey);
}
function itemToggle(sectionKey, idx, on) {
  readTabInputs(sectionKey);
  SITE[sectionKey].items[idx].on = on;
  if (saveSite()) {
    const card = document.querySelector('[data-item="'+sectionKey+'-'+idx+'"]');
    if (card) card.classList.toggle('off', !on);
  }
}
function sectionToggle(sectionKey, on) {
  SITE[sectionKey].on = on;
  saveSite();
  toast('Section ' + (on?'activée':'masquée') + '.', 'ok');
}

/* Reusable mini bits ─────────────────────────── */
function itemActionsHtml(sectionKey, idx, on) {
  return `<div class="item-actions">
    <label class="switch" title="Visible"><input type="checkbox" ${on?'checked':''} onchange="itemToggle('${sectionKey}',${idx},this.checked)"/><span class="slider"></span></label>
    <button class="btn btn-ghost btn-icon btn-sm" onclick="itemMove('${sectionKey}',${idx},-1)" title="Monter">↑</button>
    <button class="btn btn-ghost btn-icon btn-sm" onclick="itemMove('${sectionKey}',${idx},1)" title="Descendre">↓</button>
    <button class="btn btn-icon btn-sm" style="color:var(--danger);border-color:rgba(138,58,51,.3)" onclick="itemDel('${sectionKey}',${idx})" title="Supprimer">✕</button>
  </div>`;
}
function sectionToolbar(sectionKey, on, saveFn) {
  return `<div class="section-toolbar">
    <span class="lbl" style="margin:0">Section</span>
    <label class="switch"><input type="checkbox" ${on?'checked':''} onchange="sectionToggle('${sectionKey}',this.checked)"/><span class="slider"></span></label>
    <button class="btn btn-gold" onclick="${saveFn}()">💾 Enregistrer</button>
  </div>`;
}
function previewLink() {
  return `<div class="preview-strip">
    <strong>Aperçu en direct :</strong> ouvre <a href="../index.html" target="_blank" rel="noopener" style="color:var(--gold);font-weight:600">le site dans un nouvel onglet</a>. Tes modifications enregistrées s'y reflètent immédiatement.
  </div>`;
}

/* ════════════════════════════════════════════
   1 ── BRAND TAB
   ════════════════════════════════════════════ */
function renderBrandTab() {
  const b = SITE.brand;
  $('tab-brand').innerHTML = `
    <div class="sect-head">
      <div><h2>Marque & identité</h2><p class="sub">Logo, nom, slogan et signature visible.</p></div>
      <button class="btn btn-gold" onclick="saveBrand()">💾 Enregistrer</button>
    </div>
    ${previewLink()}

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Logo</h2>
      <p class="card-sub">Cercle de 110px dans le hero + mini-logo en pied de page. Conseillé: PNG carré ≥ 240px.</p>
      ${renderImageWidget(b.logo, (b.name_pre||'S').charAt(0), { prev:'iw_brand_logo_prev', url:'iw_brand_logo_url', hidden:'f_brand_logo' },
        'Astuce: pour les gros logos, utilise une URL externe (Imgur, Cloudinary…) plutôt qu&apos;un téléversement.')}
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Nom de marque</h2>
      <p class="card-sub">Le nom apparaît en gros dans le hero. La partie centrale s&apos;affiche en doré italique.</p>
      <div class="form-row-3">
        <div><label>Début</label><input id="f_brand_name_pre" type="text" value="${esc(b.name_pre)}" placeholder="Schic"/></div>
        <div><label>Accent doré</label><input id="f_brand_name_acc" type="text" value="${esc(b.name_acc)}" placeholder="girl"/></div>
        <div><label>Suffixe</label><input id="f_brand_name_suf" type="text" value="${esc(b.name_suf)}" placeholder="™"/></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Slogan</h2>
      <p class="card-sub">Petite phrase sous le nom de marque dans le hero.</p>
      <div class="form-row">
        <div class="form-group"><label>Français <span class="lang-tag">FR</span></label><textarea id="f_brand_tagline_fr" rows="2">${esc(b.tagline_fr)}</textarea></div>
        <div class="form-group"><label>English <span class="lang-tag">EN</span></label><textarea id="f_brand_tagline_en" rows="2">${esc(b.tagline_en)}</textarea></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Signature en bas de page</h2>
      <p class="card-sub">Petite bande fixée tout en bas de l&apos;écran. Laisse vide pour la cacher.</p>
      <input id="f_brand_watermark" type="text" value="${esc(b.watermark||'')}" placeholder="Schicgirl · link.schicgirl.me · © 2026"/>
    </div>
  `;
}
function saveBrand() {
  SITE.brand.logo       = $('f_brand_logo').value;
  SITE.brand.name_pre   = $('f_brand_name_pre').value;
  SITE.brand.name_acc   = $('f_brand_name_acc').value;
  SITE.brand.name_suf   = $('f_brand_name_suf').value;
  SITE.brand.tagline_fr = $('f_brand_tagline_fr').value;
  SITE.brand.tagline_en = $('f_brand_tagline_en').value;
  SITE.brand.watermark  = $('f_brand_watermark').value;
  if (saveSite()) { updateBrandMark(); toast('Marque enregistrée.', 'ok'); }
}

/* ════════════════════════════════════════════
   2 ── HERO TAB (icons + stats)
   ════════════════════════════════════════════ */
function renderHeroTab() {
  const h = SITE.hero;
  const iconRows = [0,1,2,3].map(i => `
    <div class="form-group">
      <label>Icône #${i+1} <span class="lang-tag">URL</span></label>
      <input type="url" id="f_hero_icon_${i}" value="${esc(h.icons[i]||'')}" placeholder="https://…/icon.png"/>
    </div>`).join('');

  const stats = (h.stats||[]).map((s, idx) => `
    <div class="item-card ${s.on?'':'off'}" data-item="hero-${idx}">
      <div class="item-head">
        <div class="item-head-ico">✨</div>
        <div class="item-title">${esc(s.text_fr||s.text_en||'(vide)')}</div>
        <div class="item-actions">
          <label class="switch"><input type="checkbox" ${s.on?'checked':''} onchange="heroStatToggle(${idx},this.checked)"/><span class="slider"></span></label>
          <button class="btn btn-ghost btn-icon btn-sm" onclick="heroStatMove(${idx},-1)" title="Monter">↑</button>
          <button class="btn btn-ghost btn-icon btn-sm" onclick="heroStatMove(${idx},1)" title="Descendre">↓</button>
          <button class="btn btn-icon btn-sm" style="color:var(--danger);border-color:rgba(138,58,51,.3)" onclick="heroStatDel(${idx})" title="Supprimer">✕</button>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Texte <span class="lang-tag">FR</span></label><input type="text" id="h_stat_fr_${idx}" value="${esc(s.text_fr||'')}"/></div>
        <div class="form-group"><label>Texte <span class="lang-tag">EN</span></label><input type="text" id="h_stat_en_${idx}" value="${esc(s.text_en||'')}"/></div>
      </div>
    </div>
  `).join('');

  $('tab-hero').innerHTML = `
    <div class="sect-head">
      <div><h2>Hero (haut de page)</h2><p class="sub">Le badge d&apos;autorité, le slogan et les pastilles statistiques. Le bandeau ★ d&apos;avis se génère tout seul depuis tes témoignages.</p></div>
      <button class="btn btn-gold" onclick="saveHero()">💾 Enregistrer</button>
    </div>
    ${previewLink()}

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Badge d&apos;autorité</h2>
      <p class="card-sub">Petit badge doré juste au-dessus du nom (ex: «Spécialiste cheveux crépus Type 4»). Laisse vide pour le cacher.</p>
      <div class="form-row">
        <div class="form-group"><label>Badge <span class="lang-tag">FR</span></label><input type="text" id="f_hero_proof_fr" value="${esc(h.proof_fr||'')}" placeholder="Spécialiste cheveux crépus Type 4"/></div>
        <div class="form-group"><label>Badge <span class="lang-tag">EN</span></label><input type="text" id="f_hero_proof_en" value="${esc(h.proof_en||'')}" placeholder="Type 4 coily-hair specialist"/></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Icônes de la rangée</h2>
      <p class="card-sub">Note : la nouvelle mise en page du site n&apos;affiche plus cette rangée de 4 ronds. Tu peux laisser ces champs tels quels — ils sont conservés mais masqués.</p>
      <div class="form-row">${iconRows}</div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Pastilles statistiques (${(h.stats||[]).length})</h2>
      <p class="card-sub">Petits chips dorés sous le hero (ex: «10 000+ femmes aidées»).</p>
      ${stats || '<p style="font-size:13px;color:var(--muted);padding:20px 0">Aucune pastille.</p>'}
      <button class="btn btn-gold" onclick="heroStatAdd()">+ Ajouter une pastille</button>
    </div>
  `;
}
function readHero() {
  if ($('f_hero_proof_fr')) SITE.hero.proof_fr = $('f_hero_proof_fr').value;
  if ($('f_hero_proof_en')) SITE.hero.proof_en = $('f_hero_proof_en').value;
  for (let i = 0; i < 4; i++) {
    if ($('f_hero_icon_'+i)) SITE.hero.icons[i] = $('f_hero_icon_'+i).value;
  }
  (SITE.hero.stats||[]).forEach((s, idx) => {
    if ($('h_stat_fr_'+idx)) s.text_fr = $('h_stat_fr_'+idx).value;
    if ($('h_stat_en_'+idx)) s.text_en = $('h_stat_en_'+idx).value;
  });
}
function saveHero() { readHero(); if (saveSite()) toast('Hero enregistré.', 'ok'); }
function heroStatAdd() {
  readHero();
  SITE.hero.stats.push({ id:'s'+uid(), on:true, text_fr:'Nouvelle pastille', text_en:'New pill' });
  if (saveSite()) { renderHeroTab(); toast('Pastille ajoutée.', 'ok'); }
}
function heroStatDel(idx) {
  if (!confirm('Supprimer cette pastille ?')) return;
  readHero();
  SITE.hero.stats.splice(idx, 1);
  if (saveSite()) { renderHeroTab(); toast('Supprimée.', 'ok'); }
}
function heroStatMove(idx, dir) {
  const j = idx + dir;
  if (j < 0 || j >= SITE.hero.stats.length) return;
  readHero();
  const t = SITE.hero.stats[idx]; SITE.hero.stats[idx] = SITE.hero.stats[j]; SITE.hero.stats[j] = t;
  if (saveSite()) renderHeroTab();
}
function heroStatToggle(idx, on) {
  readHero();
  SITE.hero.stats[idx].on = on;
  if (saveSite()) {
    const c = document.querySelector('[data-item="hero-'+idx+'"]');
    if (c) c.classList.toggle('off', !on);
  }
}

/* ════════════════════════════════════════════
   3 ── GIFTS TAB
   ════════════════════════════════════════════ */
function renderGiftsTab() {
  const g = SITE.gifts;
  const items = (g.items||[]).map((it, idx) => `
    <div class="item-card ${it.on?'':'off'}" data-item="gifts-${idx}">
      <div class="item-head">
        <div class="item-head-ico">${esc(it.emoji||'🎁')}</div>
        <div class="item-title">${esc(it.title_fr || it.title_en || '(sans titre)')}</div>
        ${itemActionsHtml('gifts', idx, it.on)}
      </div>
      <div class="form-row-3">
        <div><label>Emoji</label><input class="emoji-input" type="text" id="g_emoji_${idx}" value="${esc(it.emoji||'')}"/></div>
        <div><label>Étiquette <span class="lang-tag">FR</span></label><input type="text" id="g_label_fr_${idx}" value="${esc(it.label_fr||'')}" placeholder="Téléchargement Gratuit"/></div>
        <div><label>Étiquette <span class="lang-tag">EN</span></label><input type="text" id="g_label_en_${idx}" value="${esc(it.label_en||'')}" placeholder="Free Download"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Titre <span class="lang-tag">FR</span></label><input type="text" id="g_title_fr_${idx}" value="${esc(it.title_fr||'')}"/></div>
        <div class="form-group"><label>Titre <span class="lang-tag">EN</span></label><input type="text" id="g_title_en_${idx}" value="${esc(it.title_en||'')}"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Sous-titre <span class="lang-tag">FR</span></label><textarea id="g_sub_fr_${idx}" rows="2">${esc(it.sub_fr||'')}</textarea></div>
        <div class="form-group"><label>Sous-titre <span class="lang-tag">EN</span></label><textarea id="g_sub_en_${idx}" rows="2">${esc(it.sub_en||'')}</textarea></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Lien <span class="lang-tag">FR</span></label><input type="url" id="g_url_fr_${idx}" value="${esc(it.url_fr||'')}" placeholder="https://…"/></div>
        <div class="form-group"><label>Lien <span class="lang-tag">EN</span></label><input type="url" id="g_url_en_${idx}" value="${esc(it.url_en||'')}" placeholder="https://…"/></div>
      </div>
    </div>
  `).join('');

  $('tab-gifts').innerHTML = `
    <div class="sect-head">
      <div><h2>Cadeaux gratuits</h2><p class="sub">Les ebooks gratuits affichés en haut du site (FR/EN avec lien spécifique).</p></div>
      ${sectionToolbar('gifts', g.on, 'saveGifts')}
    </div>
    ${previewLink()}

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Titre de section</h2>
      <div class="form-row">
        <div class="form-group"><label>Français <span class="lang-tag">FR</span></label><input type="text" id="f_gifts_label_fr" value="${esc(g.label_fr||'')}"/></div>
        <div class="form-group"><label>English <span class="lang-tag">EN</span></label><input type="text" id="f_gifts_label_en" value="${esc(g.label_en||'')}"/></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Cadeaux (${(g.items||[]).length})</h2>
      <p class="card-sub">Chaque cadeau peut avoir un lien FR et un lien EN différents (le bon s&apos;affiche selon la langue choisie par le visiteur).</p>
      ${items || '<p style="font-size:13px;color:var(--muted);padding:20px 0">Aucun cadeau.</p>'}
      <button class="btn btn-gold" onclick="itemAdd('gifts',{id:'gift-'+uid(),emoji:'🎁',label_fr:'',label_en:'',title_fr:'Nouveau cadeau',title_en:'New gift',sub_fr:'',sub_en:'',url_fr:'',url_en:''})">+ Ajouter un cadeau</button>
    </div>
  `;
}
function readGifts() {
  if ($('f_gifts_label_fr')) SITE.gifts.label_fr = $('f_gifts_label_fr').value;
  if ($('f_gifts_label_en')) SITE.gifts.label_en = $('f_gifts_label_en').value;
  (SITE.gifts.items||[]).forEach((it, idx) => {
    if (!$(`g_emoji_${idx}`)) return;
    it.emoji    = $(`g_emoji_${idx}`).value;
    it.label_fr = $(`g_label_fr_${idx}`).value;
    it.label_en = $(`g_label_en_${idx}`).value;
    it.title_fr = $(`g_title_fr_${idx}`).value;
    it.title_en = $(`g_title_en_${idx}`).value;
    it.sub_fr   = $(`g_sub_fr_${idx}`).value;
    it.sub_en   = $(`g_sub_en_${idx}`).value;
    it.url_fr   = $(`g_url_fr_${idx}`).value;
    it.url_en   = $(`g_url_en_${idx}`).value;
  });
}
function saveGifts() { readGifts(); if (saveSite()) toast('Cadeaux enregistrés.', 'ok'); }

/* ════════════════════════════════════════════
   4 ── SHOP TAB (single card)
   ════════════════════════════════════════════ */
function renderShopTab() {
  const s = SITE.shop || (SITE.shop = { on:true, items:[] });
  if (!Array.isArray(s.items)) s.items = [];
  const ebooks = (s.items||[]).map((it, idx) => `
    <div class="item-card ${it.on?'':'off'}" data-item="shop-${idx}">
      <div class="item-head">
        <div class="item-head-ico">${isImg(it.img) ? `<img src="${esc(previewSrc(it.img))}" alt=""/>` : '📖'}</div>
        <div class="item-title">${esc(it.title_fr || it.title_en || '(sans titre)')}</div>
        ${itemActionsHtml('shop', idx, it.on)}
      </div>
      <div class="form-group">
        <label>Couverture de l&apos;ebook</label>
        ${renderImageWidget(it.img, '📖', { prev:`iw_ebk_${idx}_prev`, url:`iw_ebk_${idx}_url`, hidden:`ebk_img_${idx}` }, 'Format portrait conseillé (≈ 3:4).')}
      </div>
      <div class="form-row">
        <div class="form-group"><label>Titre <span class="lang-tag">FR</span></label><input type="text" id="ebk_title_fr_${idx}" value="${esc(it.title_fr||'')}" placeholder="Hydratée"/></div>
        <div class="form-group"><label>Titre <span class="lang-tag">EN</span></label><input type="text" id="ebk_title_en_${idx}" value="${esc(it.title_en||'')}" placeholder="Hydrated"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Description <span class="lang-tag">FR</span></label><textarea id="ebk_desc_fr_${idx}" rows="2">${esc(it.desc_fr||'')}</textarea></div>
        <div class="form-group"><label>Description <span class="lang-tag">EN</span></label><textarea id="ebk_desc_en_${idx}" rows="2">${esc(it.desc_en||'')}</textarea></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Prix <span class="lang-tag">FR</span></label><input type="text" id="ebk_price_fr_${idx}" value="${esc(it.price_fr||'')}" placeholder="12€"/></div>
        <div class="form-group"><label>Prix <span class="lang-tag">EN</span></label><input type="text" id="ebk_price_en_${idx}" value="${esc(it.price_en||'')}" placeholder="$13"/></div>
      </div>
      <div class="form-group"><label>Prix FCFA <span class="lang-tag">FR</span> <span style="font-weight:400;text-transform:none;letter-spacing:0;color:var(--muted)">(affiché sous le prix € en français)</span></label><input type="text" id="ebk_cfa_${idx}" value="${esc(it.price_cfa||'')}" placeholder="(≈ 8 000 FCFA)"/></div>
      <div class="form-row">
        <div class="form-group"><label>Badge <span class="lang-tag">FR</span></label><input type="text" id="ebk_badge_fr_${idx}" value="${esc(it.badge_fr||'')}" placeholder="Best-seller (optionnel)"/></div>
        <div class="form-group"><label>Badge <span class="lang-tag">EN</span></label><input type="text" id="ebk_badge_en_${idx}" value="${esc(it.badge_en||'')}" placeholder="Best-seller (optional)"/></div>
      </div>
      <div class="form-group"><label>Lien d&apos;achat (URL Selar)</label><input type="url" id="ebk_url_${idx}" value="${esc(it.url||'')}" placeholder="https://selar.com/..."/></div>
    </div>
  `).join('');

  $('tab-shop').innerHTML = `
    <div class="sect-head">
      <div><h2>Boutique — Ebooks (Premium)</h2><p class="sub">Vitrine défilante : chaque ebook a sa carte. Bloc 04 de la page.</p></div>
      ${sectionToolbar('shop', s.on, 'saveShop')}
    </div>
    ${previewLink()}

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Titre de section</h2>
      <div class="form-row">
        <div class="form-group"><label>Titre <span class="lang-tag">FR</span></label><input type="text" id="f_shop_label_fr" value="${esc(s.label_fr||'')}" placeholder="Trouve TA solution"/></div>
        <div class="form-group"><label>Titre <span class="lang-tag">EN</span></label><input type="text" id="f_shop_label_en" value="${esc(s.label_en||'')}" placeholder="Find YOUR solution"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Petit chapeau <span class="lang-tag">FR</span></label><input type="text" id="f_shop_eyebrow_fr" value="${esc(s.eyebrow_fr||'')}" placeholder="★ Ebooks experts · Type 4"/></div>
        <div class="form-group"><label>Petit chapeau <span class="lang-tag">EN</span></label><input type="text" id="f_shop_eyebrow_en" value="${esc(s.eyebrow_en||'')}" placeholder="★ Expert ebooks · Type 4"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Phrase d&apos;intro <span class="lang-tag">FR</span></label><textarea id="f_shop_desc_fr" rows="2">${esc(s.desc_fr||'')}</textarea></div>
        <div class="form-group"><label>Phrase d&apos;intro <span class="lang-tag">EN</span></label><textarea id="f_shop_desc_en" rows="2">${esc(s.desc_en||'')}</textarea></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Tes ebooks (${(s.items||[]).length})</h2>
      <p class="card-sub">Réordonne avec ↑ ↓. Le 1er ebook s&apos;affiche en premier. Mets une couverture, un prix et le lien Selar de chaque ebook.</p>
      ${ebooks || '<p style="font-size:13px;color:var(--muted);padding:20px 0">Aucun ebook. Ajoute-en un ci-dessous.</p>'}
      <button class="btn btn-gold" onclick="itemAdd('shop',{id:'e'+uid(),img:'',title_fr:'Nouvel ebook',title_en:'New ebook',desc_fr:'',desc_en:'',price_fr:'',price_en:'',badge_fr:'',badge_en:'',url:''})">+ Ajouter un ebook</button>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Bouton « Voir tous mes ebooks »</h2>
      <p class="card-sub">Affiché sous la vitrine, vers ta boutique Selar complète. Laisse l&apos;URL vide pour masquer ce bouton.</p>
      <div class="form-row">
        <div class="form-group"><label>Texte du bouton <span class="lang-tag">FR</span></label><input type="text" id="f_shop_cta_fr" value="${esc(s.cta_fr||'')}" placeholder="Voir tous mes ebooks →"/></div>
        <div class="form-group"><label>Texte du bouton <span class="lang-tag">EN</span></label><input type="text" id="f_shop_cta_en" value="${esc(s.cta_en||'')}" placeholder="See all my ebooks →"/></div>
      </div>
      <div class="form-group"><label>URL de la boutique</label><input type="url" id="f_shop_url" value="${esc(s.url||'')}" placeholder="https://selar.com/m/schicgirl"/></div>
      <div class="form-group"><label>Identifiant analytics</label><input type="text" id="f_shop_track" value="${esc(s.track||'selar-shop')}" placeholder="selar-shop"/></div>
    </div>
  `;
}
function saveShop() {
  const s = SITE.shop;
  s.label_fr   = $('f_shop_label_fr').value;
  s.label_en   = $('f_shop_label_en').value;
  s.eyebrow_fr = $('f_shop_eyebrow_fr').value;
  s.eyebrow_en = $('f_shop_eyebrow_en').value;
  s.desc_fr    = $('f_shop_desc_fr').value;
  s.desc_en    = $('f_shop_desc_en').value;
  s.cta_fr     = $('f_shop_cta_fr').value;
  s.cta_en     = $('f_shop_cta_en').value;
  s.url        = $('f_shop_url').value;
  s.track      = $('f_shop_track').value || 'selar-shop';
  (s.items||[]).forEach((it, idx) => {
    if (!$(`ebk_title_fr_${idx}`)) return;
    it.img      = $(`ebk_img_${idx}`).value;
    it.title_fr = $(`ebk_title_fr_${idx}`).value;
    it.title_en = $(`ebk_title_en_${idx}`).value;
    it.desc_fr  = $(`ebk_desc_fr_${idx}`).value;
    it.desc_en  = $(`ebk_desc_en_${idx}`).value;
    it.price_fr = $(`ebk_price_fr_${idx}`).value;
    it.price_en = $(`ebk_price_en_${idx}`).value;
    if ($(`ebk_cfa_${idx}`)) it.price_cfa = $(`ebk_cfa_${idx}`).value;
    it.badge_fr = $(`ebk_badge_fr_${idx}`).value;
    it.badge_en = $(`ebk_badge_en_${idx}`).value;
    it.url      = $(`ebk_url_${idx}`).value;
  });
  if (saveSite()) toast('Boutique enregistrée.', 'ok');
}

/* ════════════════════════════════════════════
   5 ── TOOLS TAB
   ════════════════════════════════════════════ */
function renderToolsTab() {
  const t = SITE.tools;
  const items = (t.items||[]).map((it, idx) => {
    const isFeature = it.style === 'feature';
    return `
    <div class="item-card ${it.on?'':'off'}" data-item="tools-${idx}">
      <div class="item-head">
        <div class="item-head-ico">${esc(it.icon||'🔗')}</div>
        <div class="item-title">${esc(it.title_fr || it.title_en || '(sans titre)')}</div>
        ${itemActionsHtml('tools', idx, it.on)}
      </div>
      <div class="form-row-3">
        <div><label>Icône (emoji)</label><input class="emoji-input" type="text" id="t_icon_${idx}" value="${esc(it.icon||'')}"/></div>
        <div><label>Style</label><select id="t_style_${idx}">
          <option value="feature" ${it.style==='feature'?'selected':''}>✨ Carte vedette (rose/doré)</option>
          <option value="card" ${it.style!=='feature'?'selected':''}>🔘 Carte standard (glass)</option>
        </select></div>
        <div><label>Langue</label><select id="t_lang_${idx}">
          <option value="both" ${it.lang==='both'?'selected':''}>🌍 FR + EN</option>
          <option value="fr"   ${it.lang==='fr'?'selected':''}>🇫🇷 FR seul</option>
          <option value="en"   ${it.lang==='en'?'selected':''}>🇬🇧 EN seul</option>
        </select></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Étiquette (style vedette) <span class="lang-tag">FR</span></label><input type="text" id="t_label_fr_${idx}" value="${esc(it.label_fr||'')}" placeholder="Diagnostique Auto · Gratuit"/></div>
        <div class="form-group"><label>Étiquette (style vedette) <span class="lang-tag">EN</span></label><input type="text" id="t_label_en_${idx}" value="${esc(it.label_en||'')}" placeholder="Diagnostic · Free"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Titre <span class="lang-tag">FR</span></label><input type="text" id="t_title_fr_${idx}" value="${esc(it.title_fr||'')}"/></div>
        <div class="form-group"><label>Titre <span class="lang-tag">EN</span></label><input type="text" id="t_title_en_${idx}" value="${esc(it.title_en||'')}"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Sous-titre <span class="lang-tag">FR</span></label><textarea id="t_sub_fr_${idx}" rows="2">${esc(it.sub_fr||'')}</textarea></div>
        <div class="form-group"><label>Sous-titre <span class="lang-tag">EN</span></label><textarea id="t_sub_en_${idx}" rows="2">${esc(it.sub_en||'')}</textarea></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>URL</label><input type="url" id="t_url_${idx}" value="${esc(it.url||'')}" placeholder="https://…"/></div>
        <div class="form-group"><label>Badge (style carte uniquement)</label><input type="text" id="t_badge_${idx}" value="${esc(it.badge||'')}" placeholder="AUTO, NEW, FREE…"/></div>
      </div>
    </div>`;
  }).join('');

  $('tab-tools').innerHTML = `
    <div class="sect-head">
      <div><h2>Outils gratuits</h2><p class="sub">Diagnostic chat, page hydratation, consultation… Deux styles de carte disponibles.</p></div>
      ${sectionToolbar('tools', t.on, 'saveTools')}
    </div>
    ${previewLink()}

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Titre de section</h2>
      <div class="form-row">
        <div class="form-group"><label>Français <span class="lang-tag">FR</span></label><input type="text" id="f_tools_label_fr" value="${esc(t.label_fr||'')}"/></div>
        <div class="form-group"><label>English <span class="lang-tag">EN</span></label><input type="text" id="f_tools_label_en" value="${esc(t.label_en||'')}"/></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Outils (${(t.items||[]).length})</h2>
      <p class="card-sub"><strong>Style vedette</strong> = grande carte rose/dorée (pour la pièce maîtresse).
        <strong>Style standard</strong> = carte glass classique avec flèche et badge optionnel.</p>
      ${items || '<p style="font-size:13px;color:var(--muted);padding:20px 0">Aucun outil.</p>'}
      <button class="btn btn-gold" onclick="itemAdd('tools',{id:'tool-'+uid(),style:'card',lang:'both',icon:'🔗',badge:'',title_fr:'Nouvel outil',title_en:'New tool',sub_fr:'',sub_en:'',label_fr:'',label_en:'',url:''})">+ Ajouter un outil</button>
    </div>
  `;
}
function readTools() {
  if ($('f_tools_label_fr')) SITE.tools.label_fr = $('f_tools_label_fr').value;
  if ($('f_tools_label_en')) SITE.tools.label_en = $('f_tools_label_en').value;
  (SITE.tools.items||[]).forEach((it, idx) => {
    if (!$(`t_icon_${idx}`)) return;
    it.icon     = $(`t_icon_${idx}`).value;
    it.style    = $(`t_style_${idx}`).value;
    it.lang     = $(`t_lang_${idx}`).value;
    it.label_fr = $(`t_label_fr_${idx}`).value;
    it.label_en = $(`t_label_en_${idx}`).value;
    it.title_fr = $(`t_title_fr_${idx}`).value;
    it.title_en = $(`t_title_en_${idx}`).value;
    it.sub_fr   = $(`t_sub_fr_${idx}`).value;
    it.sub_en   = $(`t_sub_en_${idx}`).value;
    it.url      = $(`t_url_${idx}`).value;
    it.badge    = $(`t_badge_${idx}`).value;
  });
}
function saveTools() { readTools(); if (saveSite()) toast('Outils enregistrés.', 'ok'); }

/* ════════════════════════════════════════════
   6 ── AMAZON TAB (with image widget per item)
   ════════════════════════════════════════════ */
function renderAmazonTab() {
  const a = SITE.amazon;
  const items = (a.items||[]).map((it, idx) => `
    <div class="item-card ${it.on?'':'off'}" data-item="amazon-${idx}">
      <div class="item-head">
        <div class="item-head-ico">${isImg(it.img) ? `<img src="${esc(previewSrc(it.img))}" alt=""/>` : esc(it.emoji||'📦')}</div>
        <div class="item-title">${esc(it.name_fr || it.name_en || '(sans nom)')}</div>
        ${itemActionsHtml('amazon', idx, it.on)}
      </div>
      <div class="form-group">
        <label>Image produit</label>
        ${renderImageWidget(it.img, it.emoji||'📦', { prev:`iw_amz_${idx}_prev`, url:`iw_amz_${idx}_url`, hidden:`a_img_${idx}` }, '64×64px affiché. Si vide, l&apos;emoji ci-dessous s&apos;affiche.')}
      </div>
      <div class="form-group" style="margin-top:10px">
        <label>Emoji fallback</label>
        <input class="emoji-input" type="text" id="a_emoji_${idx}" value="${esc(it.emoji||'📦')}"/>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Petit chapeau <span class="lang-tag">FR</span></label><input type="text" id="a_eyebrow_fr_${idx}" value="${esc(it.eyebrow_fr||'')}"/></div>
        <div class="form-group"><label>Petit chapeau <span class="lang-tag">EN</span></label><input type="text" id="a_eyebrow_en_${idx}" value="${esc(it.eyebrow_en||'')}"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Nom <span class="lang-tag">FR</span></label><input type="text" id="a_name_fr_${idx}" value="${esc(it.name_fr||'')}"/></div>
        <div class="form-group"><label>Nom <span class="lang-tag">EN</span></label><input type="text" id="a_name_en_${idx}" value="${esc(it.name_en||'')}"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Description <span class="lang-tag">FR</span></label><textarea id="a_desc_fr_${idx}" rows="2">${esc(it.desc_fr||'')}</textarea></div>
        <div class="form-group"><label>Description <span class="lang-tag">EN</span></label><textarea id="a_desc_en_${idx}" rows="2">${esc(it.desc_en||'')}</textarea></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>URL Amazon</label><input type="url" id="a_url_${idx}" value="${esc(it.url||'')}" placeholder="https://amzn.to/…"/></div>
        <div class="form-group"><label>ID de suivi</label><input type="text" id="a_id_${idx}" value="${esc(it.id||'')}" placeholder="auntjackies-bundle"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Bouton CTA <span class="lang-tag">FR</span></label><input type="text" id="a_cta_fr_${idx}" value="${esc(it.cta_fr||'')}" placeholder="Voir →"/></div>
        <div class="form-group"><label>Bouton CTA <span class="lang-tag">EN</span></label><input type="text" id="a_cta_en_${idx}" value="${esc(it.cta_en||'')}" placeholder="Get it →"/></div>
      </div>
    </div>
  `).join('');

  $('tab-amazon').innerHTML = `
    <div class="sect-head">
      <div><h2>Sélections Amazon</h2><p class="sub">Produits affiliés Amazon. L&apos;ID est utilisé dans les stats de clics — évite de le changer.</p></div>
      ${sectionToolbar('amazon', a.on, 'saveAmazon')}
    </div>
    ${previewLink()}

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Titre de section</h2>
      <div class="form-row">
        <div class="form-group"><label>Français <span class="lang-tag">FR</span></label><input type="text" id="f_amazon_label_fr" value="${esc(a.label_fr||'')}"/></div>
        <div class="form-group"><label>English <span class="lang-tag">EN</span></label><input type="text" id="f_amazon_label_en" value="${esc(a.label_en||'')}"/></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Produits (${(a.items||[]).length})</h2>
      ${items || '<p style="font-size:13px;color:var(--muted);padding:20px 0">Aucun produit.</p>'}
      <button class="btn btn-gold" onclick="itemAdd('amazon',{id:'amazon-'+uid(),img:'',emoji:'📦',eyebrow_fr:'',eyebrow_en:'',name_fr:'Nouveau produit',name_en:'New product',desc_fr:'',desc_en:'',url:'',cta_fr:'Voir →',cta_en:'Shop →'})">+ Ajouter un produit</button>
    </div>
  `;
}
function readAmazon() {
  if ($('f_amazon_label_fr')) SITE.amazon.label_fr = $('f_amazon_label_fr').value;
  if ($('f_amazon_label_en')) SITE.amazon.label_en = $('f_amazon_label_en').value;
  (SITE.amazon.items||[]).forEach((it, idx) => {
    if (!$(`a_img_${idx}`)) return;
    it.img        = $(`a_img_${idx}`).value;
    it.emoji      = $(`a_emoji_${idx}`).value;
    it.eyebrow_fr = $(`a_eyebrow_fr_${idx}`).value;
    it.eyebrow_en = $(`a_eyebrow_en_${idx}`).value;
    it.name_fr    = $(`a_name_fr_${idx}`).value;
    it.name_en    = $(`a_name_en_${idx}`).value;
    it.desc_fr    = $(`a_desc_fr_${idx}`).value;
    it.desc_en    = $(`a_desc_en_${idx}`).value;
    it.url        = $(`a_url_${idx}`).value;
    it.id         = $(`a_id_${idx}`).value || it.id;
    it.cta_fr     = $(`a_cta_fr_${idx}`).value;
    it.cta_en     = $(`a_cta_en_${idx}`).value;
  });
}
function saveAmazon() { readAmazon(); if (saveSite()) toast('Sélections Amazon enregistrées.', 'ok'); }

/* ════════════════════════════════════════════
   6b ── GALLERY TAB (galerie horizontale)
   ════════════════════════════════════════════ */
function renderGalleryTab() {
  const g = SITE.gallery || (SITE.gallery = { on:true, label_fr:'Transformations', label_en:'Transformations', items:[] });
  const items = (g.items||[]).map((it, idx) => `
    <div class="item-card ${it.on?'':'off'}" data-item="gallery-${idx}">
      <div class="item-head">
        <div class="item-head-ico">${isImg(it.img) ? `<img src="${esc(previewSrc(it.img))}" alt=""/>` : '🖼️'}</div>
        <div class="item-title">${esc(it.cap_fr || it.cap_en || '(sans légende)')}</div>
        ${itemActionsHtml('gallery', idx, it.on)}
      </div>
      <div class="form-group">
        <label>Photo</label>
        ${renderImageWidget(it.img, '🖼️', { prev:`iw_gal_${idx}_prev`, url:`iw_gal_${idx}_url`, hidden:`gal_img_${idx}` }, 'Format portrait conseillé (≈ 4:5). Téléverse ou colle une URL / nom de fichier.')}
      </div>
      <div class="form-row">
        <div class="form-group"><label>Légende <span class="lang-tag">FR</span></label><input type="text" id="gal_cap_fr_${idx}" value="${esc(it.cap_fr||'')}" placeholder="Avant / après · 8 semaines"/></div>
        <div class="form-group"><label>Légende <span class="lang-tag">EN</span></label><input type="text" id="gal_cap_en_${idx}" value="${esc(it.cap_en||'')}" placeholder="Before / after · 8 weeks"/></div>
      </div>
    </div>
  `).join('');

  $('tab-gallery').innerHTML = `
    <div class="sect-head">
      <div><h2>Galerie de transformations</h2><p class="sub">Bande de photos qui défile horizontalement, placée entre les avis et la boutique. La légende s&apos;affiche en bas de chaque photo.</p></div>
      ${sectionToolbar('gallery', g.on, 'saveGallery')}
    </div>
    ${previewLink()}

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Titre de section</h2>
      <div class="form-row">
        <div class="form-group"><label>Français <span class="lang-tag">FR</span></label><input type="text" id="f_gallery_label_fr" value="${esc(g.label_fr||'')}"/></div>
        <div class="form-group"><label>English <span class="lang-tag">EN</span></label><input type="text" id="f_gallery_label_en" value="${esc(g.label_en||'')}"/></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Photos (${(g.items||[]).length})</h2>
      <p class="card-sub">Réordonne avec ↑ ↓. La 1re photo est celle qu&apos;on voit en premier. Utilise des photos réelles de clientes (avec leur accord) pour un maximum d&apos;impact.</p>
      ${items || '<p style="font-size:13px;color:var(--muted);padding:20px 0">Aucune photo. Ajoute-en une ci-dessous.</p>'}
      <button class="btn btn-gold" onclick="itemAdd('gallery',{id:'g'+uid(),img:'',cap_fr:'Nouvelle photo',cap_en:'New photo'})">+ Ajouter une photo</button>
    </div>
  `;
}
function readGallery() {
  if (!SITE.gallery) return;
  if ($('f_gallery_label_fr')) SITE.gallery.label_fr = $('f_gallery_label_fr').value;
  if ($('f_gallery_label_en')) SITE.gallery.label_en = $('f_gallery_label_en').value;
  (SITE.gallery.items||[]).forEach((it, idx) => {
    if (!$(`gal_img_${idx}`)) return;
    it.img    = $(`gal_img_${idx}`).value;
    it.cap_fr = $(`gal_cap_fr_${idx}`).value;
    it.cap_en = $(`gal_cap_en_${idx}`).value;
  });
}
function saveGallery() { readGallery(); if (saveSite()) toast('Galerie enregistrée.', 'ok'); }

/* ════════════════════════════════════════════
   7 ── REVIEWS / TESTIMONIALS TAB
   ════════════════════════════════════════════ */
function renderReviewsTab() {
  const t = SITE.testimonials;
  const items = (t.items||[]).map((it, idx) => `
    <div class="item-card ${it.on?'':'off'}" data-item="testimonials-${idx}">
      <div class="item-head">
        <div class="item-head-ico">⭐</div>
        <div class="item-title">${esc(it.author||'(sans auteur)')} — ${esc((it.text_fr||it.text_en||'').slice(0,60))}…</div>
        ${itemActionsHtml('testimonials', idx, it.on)}
      </div>
      <div class="form-row-3">
        <div><label>Étoiles (1–5)</label><input type="number" id="r_stars_${idx}" min="1" max="5" value="${it.stars||5}" style="width:80px"/></div>
        <div style="grid-column:span 2"><label>Autrice</label><input type="text" id="r_author_${idx}" value="${esc(it.author||'')}" placeholder="Sophie C."/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Témoignage <span class="lang-tag">FR</span></label><textarea id="r_text_fr_${idx}" rows="3">${esc(it.text_fr||'')}</textarea></div>
        <div class="form-group"><label>Témoignage <span class="lang-tag">EN</span></label><textarea id="r_text_en_${idx}" rows="3">${esc(it.text_en||'')}</textarea></div>
      </div>
    </div>
  `).join('');

  $('tab-reviews').innerHTML = `
    <div class="sect-head">
      <div><h2>Avis / Témoignages</h2><p class="sub">Le carrousel horizontal de cartes blanches avec étoiles dorées.</p></div>
      ${sectionToolbar('testimonials', t.on, 'saveReviews')}
    </div>
    ${previewLink()}

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Note &amp; nombre d'avis (en haut de page)</h2>
      <p class="card-sub">Le bandeau ★ sous ton nom. Mets ici le VRAI nombre d'avis que tu reçois (ex: «218» ou «200+») — il ne se met pas à jour tout seul. Laisse le nombre vide pour afficher automatiquement le nombre de témoignages ci-dessous.</p>
      <div class="form-row">
        <div class="form-group"><label>Note affichée</label><input type="text" id="f_reviews_rating" value="${esc(t.rating||'5,0')}" placeholder="5,0"/></div>
        <div class="form-group"><label>Nombre d'avis</label><input type="text" id="f_reviews_count" value="${esc(t.reviews||'')}" placeholder="ex: 218 ou 200+"/></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Titre de section</h2>
      <div class="form-row">
        <div class="form-group"><label>Français <span class="lang-tag">FR</span></label><input type="text" id="f_reviews_label_fr" value="${esc(t.label_fr||'')}"/></div>
        <div class="form-group"><label>English <span class="lang-tag">EN</span></label><input type="text" id="f_reviews_label_en" value="${esc(t.label_en||'')}"/></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Témoignages (${(t.items||[]).length})</h2>
      ${items || '<p style="font-size:13px;color:var(--muted);padding:20px 0">Aucun témoignage.</p>'}
      <button class="btn btn-gold" onclick="itemAdd('testimonials',{id:'t'+uid(),stars:5,author:'Nouvelle cliente',text_fr:'',text_en:''})">+ Ajouter un témoignage</button>
    </div>
  `;
}
function readReviews() {
  if ($('f_reviews_rating')) SITE.testimonials.rating = $('f_reviews_rating').value;
  if ($('f_reviews_count')) SITE.testimonials.reviews = $('f_reviews_count').value;
  if ($('f_reviews_label_fr')) SITE.testimonials.label_fr = $('f_reviews_label_fr').value;
  if ($('f_reviews_label_en')) SITE.testimonials.label_en = $('f_reviews_label_en').value;
  (SITE.testimonials.items||[]).forEach((it, idx) => {
    if (!$(`r_stars_${idx}`)) return;
    it.stars   = Math.max(1, Math.min(5, parseInt($(`r_stars_${idx}`).value)||5));
    it.author  = $(`r_author_${idx}`).value;
    it.text_fr = $(`r_text_fr_${idx}`).value;
    it.text_en = $(`r_text_en_${idx}`).value;
  });
}
function saveReviews() { readReviews(); if (saveSite()) toast('Avis enregistrés.', 'ok'); }

/* ════════════════════════════════════════════
   8 ── SOCIAL TAB
   ════════════════════════════════════════════ */
function renderSocialTab() {
  const s = SITE.social;
  const items = (s.items||[]).map((it, idx) => `
    <div class="item-card ${it.on?'':'off'}" data-item="social-${idx}">
      <div class="item-head">
        <div class="item-head-ico">${esc(it.icon||'🔗')}</div>
        <div class="item-title">${esc(it.label_fr || it.label_en || '(sans libellé)')}</div>
        ${itemActionsHtml('social', idx, it.on)}
      </div>
      <div class="form-row-3">
        <div><label>Icône</label><input class="emoji-input" type="text" id="so_icon_${idx}" value="${esc(it.icon||'')}"/></div>
        <div><label>Libellé <span class="lang-tag">FR</span></label><input type="text" id="so_label_fr_${idx}" value="${esc(it.label_fr||'')}"/></div>
        <div><label>Libellé <span class="lang-tag">EN</span></label><input type="text" id="so_label_en_${idx}" value="${esc(it.label_en||'')}"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Sous-titre <span class="lang-tag">FR</span></label><input type="text" id="so_sub_fr_${idx}" value="${esc(it.sub_fr||'')}"/></div>
        <div class="form-group"><label>Sous-titre <span class="lang-tag">EN</span></label><input type="text" id="so_sub_en_${idx}" value="${esc(it.sub_en||'')}"/></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>URL</label><input type="text" id="so_url_${idx}" value="${esc(it.url||'')}" placeholder="https://… ou mailto:…"/></div>
        <div class="form-group"><label>ID de suivi</label><input type="text" id="so_id_${idx}" value="${esc(it.id||'')}"/></div>
      </div>
    </div>
  `).join('');

  $('tab-social').innerHTML = `
    <div class="sect-head">
      <div><h2>Réseaux sociaux & contact</h2><p class="sub">Les boutons en bas de page (Facebook, Email, etc.).</p></div>
      ${sectionToolbar('social', s.on, 'saveSocial')}
    </div>
    ${previewLink()}

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Titre de section</h2>
      <div class="form-row">
        <div class="form-group"><label>Français <span class="lang-tag">FR</span></label><input type="text" id="f_social_label_fr" value="${esc(s.label_fr||'')}"/></div>
        <div class="form-group"><label>English <span class="lang-tag">EN</span></label><input type="text" id="f_social_label_en" value="${esc(s.label_en||'')}"/></div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Boutons (${(s.items||[]).length})</h2>
      ${items || '<p style="font-size:13px;color:var(--muted);padding:20px 0">Aucun bouton.</p>'}
      <button class="btn btn-gold" onclick="itemAdd('social',{id:'social-'+uid(),icon:'🔗',label_fr:'Nouveau lien',label_en:'New link',sub_fr:'',sub_en:'',url:'https://'})">+ Ajouter un bouton</button>
    </div>
  `;
}
function readSocial() {
  if ($('f_social_label_fr')) SITE.social.label_fr = $('f_social_label_fr').value;
  if ($('f_social_label_en')) SITE.social.label_en = $('f_social_label_en').value;
  (SITE.social.items||[]).forEach((it, idx) => {
    if (!$(`so_icon_${idx}`)) return;
    it.icon     = $(`so_icon_${idx}`).value;
    it.label_fr = $(`so_label_fr_${idx}`).value;
    it.label_en = $(`so_label_en_${idx}`).value;
    it.sub_fr   = $(`so_sub_fr_${idx}`).value;
    it.sub_en   = $(`so_sub_en_${idx}`).value;
    it.url      = $(`so_url_${idx}`).value;
    it.id       = $(`so_id_${idx}`).value || it.id;
  });
}
function saveSocial() { readSocial(); if (saveSite()) toast('Réseaux enregistrés.', 'ok'); }

/* ════════════════════════════════════════════
   9 ── FOOTER TAB
   ════════════════════════════════════════════ */
function renderFooterTab() {
  const f = SITE.footer;
  $('tab-footer').innerHTML = `
    <div class="sect-head">
      <div><h2>Pied de page</h2><p class="sub">Mini-logo, nom de marque, mentions légales / disclaimer Amazon.</p></div>
      <button class="btn btn-gold" onclick="saveFooter()">💾 Enregistrer</button>
    </div>
    ${previewLink()}

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Affichage</h2>
      <div style="display:flex;align-items:center;gap:14px;background:rgba(245,232,208,.32);border:1px dashed rgba(201,147,74,.28);border-radius:14px;padding:14px 16px">
        <label class="switch"><input type="checkbox" id="f_footer_logo_show" ${f.logo_show?'checked':''}/><span class="slider"></span></label>
        <div>
          <div style="font-weight:600;font-size:14px">Afficher le mini-logo en pied de page</div>
          <div style="font-size:12px;color:var(--muted);margin-top:2px">Petit cercle au-dessus du nom de marque.</div>
        </div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Nom de marque (footer)</h2>
      <input type="text" id="f_footer_brand" value="${esc(f.brand||'Schicgirl')}"/>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Disclaimer / mentions</h2>
      <p class="card-sub">HTML simple autorisé (par ex. <code>&lt;br/&gt;</code> pour un retour à la ligne).</p>
      <div class="form-group"><label>Texte <span class="lang-tag">FR</span></label><textarea id="f_footer_disc_fr" rows="4">${esc(f.disc_fr||'')}</textarea></div>
      <div class="form-group"><label>Texte <span class="lang-tag">EN</span></label><textarea id="f_footer_disc_en" rows="4">${esc(f.disc_en||'')}</textarea></div>
    </div>
  `;
}
function saveFooter() {
  SITE.footer.logo_show = $('f_footer_logo_show').checked;
  SITE.footer.brand     = $('f_footer_brand').value;
  SITE.footer.disc_fr   = $('f_footer_disc_fr').value;
  SITE.footer.disc_en   = $('f_footer_disc_en').value;
  if (saveSite()) toast('Pied de page enregistré.', 'ok');
}

/* ════════════════════════════════════════════
   10 ── SETTINGS TAB
   ════════════════════════════════════════════ */
function renderSettingsTab() {
  const used = storageUsed();
  const cap = 5 * 1024 * 1024; // 5 MB typical cap
  const pct = Math.min(100, Math.round(used/cap*100));
  $('tab-settings').innerHTML = `
    <div class="sect-head">
      <div><h2>Réglages</h2><p class="sub">Publication, mot de passe, sauvegarde et zone dangereuse.</p></div>
    </div>

    <div class="card" style="border:1.5px solid var(--gold);background:linear-gradient(135deg,rgba(201,147,74,.08),rgba(232,180,160,.06))">
      <h2 style="font-family:var(--serif);font-size:1.3rem;font-weight:400;margin-bottom:4px">🚀 Publier ton site</h2>
      <p class="card-sub">Tes modifications s'affichent <strong>tout de suite sur ton navigateur</strong>, mais pour qu'elles soient visibles par <strong>tous les visiteurs</strong>, tu dois publier. C'est simple : un clic télécharge <code>site.json</code>, que tu déposes dans le dossier <code>assets/</code> de ton site, puis tu remets ton site en ligne. <strong>Aucun code à toucher.</strong></p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px">
        <button class="btn btn-primary" onclick="publishSite()">🚀 Publier (télécharger site.json)</button>
        <button class="btn btn-ghost btn-sm" onclick="loadPublishedIntoEditor()">⤵ Charger la version en ligne</button>
        <button class="btn btn-ghost btn-sm" onclick="clearLocalDraft()">↺ Synchroniser / effacer le brouillon</button>
      </div>
      <div style="font-size:12px;color:var(--muted);line-height:1.7;background:rgba(255,255,255,.55);border:1px solid var(--stroke);border-radius:12px;padding:12px 14px">
        <strong style="color:var(--ink)">Comment ça marche</strong><br>
        1. Modifie ton contenu dans les onglets et <strong>Enregistre</strong> chaque section.<br>
        2. Clique <strong>Publier</strong> → le fichier <code>site.json</code> se télécharge.<br>
        3. Place <code>site.json</code> dans le dossier <code>assets/</code> de ton site (remplace l'ancien).<br>
        4. Remets ton site en ligne → tes visiteurs voient la nouvelle version. ✨
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Mot de passe admin</h2>
      <p class="card-sub">Mot de passe par défaut: <code>Schicgirl2026!</code></p>
      <div class="form-group"><label>Nouveau mot de passe</label><input id="set_pwd" type="password" placeholder="Laisser vide pour ne pas changer"/></div>
      <button class="btn btn-primary" onclick="changePassword()">💾 Changer le mot de passe</button>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Stockage navigateur</h2>
      <p class="card-sub">Le contenu du site et les analytics sont stockés dans le localStorage de ton navigateur.</p>
      <div class="storage-meter">
        <h4>Utilisation: ${fmtBytes(used)} / ≈ 5 MB</h4>
        <div class="storage-bar"><div style="width:${pct}%"></div></div>
        <div class="storage-info">${pct}% utilisé · ${pct > 75 ? '⚠️ pense à utiliser des URLs externes pour les images lourdes' : 'ok'}</div>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">Sauvegarde du contenu</h2>
      <p class="card-sub">Exporte tout le contenu du site en JSON, ou importe une sauvegarde précédente.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-gold" onclick="exportSiteJson()">↓ Exporter le contenu (JSON)</button>
        <label class="btn"><input type="file" accept=".json,application/json" style="display:none" onchange="importSiteJson(event)"/>↑ Importer un JSON</label>
      </div>
    </div>

    <div class="card" style="border-color:rgba(138,58,51,.2);background:rgba(138,58,51,.03)">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px;color:var(--danger)">Zone dangereuse</h2>
      <p class="card-sub">Actions irréversibles. À utiliser avec précaution.</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-danger btn-sm" onclick="clearAnalytics()">🗑 Effacer toutes les analytics</button>
        <button class="btn btn-danger btn-sm" onclick="resetSite()">↺ Restaurer le contenu par défaut</button>
      </div>
    </div>

    <div class="card">
      <h2 style="font-family:var(--serif);font-size:1.2rem;font-weight:400;margin-bottom:4px">À propos</h2>
      <p style="font-size:13px;color:var(--muted);line-height:1.7">Le site lit son contenu dans cet ordre&nbsp;: ton <strong>brouillon local</strong> (localStorage <code>schicgirl_site</code>, pour ta prévisualisation) ▸ le fichier <strong>publié</strong> <code>assets/site.json</code> (ce que voient les visiteurs) ▸ les <strong>défauts</strong> compilés dans <code>index.html</code>. Les analytics utilisent <code>schicgirl_analytics</code>. Capacité&nbsp;: 1 200 clics et 600 visites les plus récents.</p>
    </div>
  `;
}
async function changePassword() {
  const v = $('set_pwd').value.trim();
  if (!v) { toast('Mot de passe vide — ignoré.', ''); return; }
  if (v.length < 8) { toast('Au moins 8 caractères.', 'err'); return; }
  const hash = await sha256(v);
  const cfg = getCfg();
  cfg.passwordHash = hash;
  // Remove any legacy plaintext password field that might still be hanging around
  delete cfg.password;
  saveCfg(cfg);
  $('set_pwd').value = '';
  toast('Mot de passe modifié.', 'ok');
}
function downloadJson(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type:'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  a.click(); URL.revokeObjectURL(url);
}
function exportSiteJson() {
  downloadJson(`schicgirl-site-${new Date().toISOString().slice(0,10)}.json`, SITE);
  toast('Sauvegarde exportée.', 'ok');
}

/* ════════════════════════════════════════════
   PUBLISH — flush edits, download site.json, show upload steps
   ════════════════════════════════════════════ */
function flushAllTabs() {
  ['readHero','readGifts','readTools','readAmazon','readReviews','readSocial'].forEach(fn => {
    if (typeof window[fn] === 'function') { try { window[fn](); } catch (e) {} }
  });
}
function publishSite() {
  flushAllTabs();
  if (!saveSite()) return;
  downloadJson('site.json', SITE);
  openPublishModal();
}
function openPublishModal() { $('publishModal').classList.remove('hidden'); }
function closePublishModal() { $('publishModal').classList.add('hidden'); }

/* Fetch the currently-published assets/site.json (or null if none yet). */
async function fetchPublished() {
  try {
    const r = await fetch(PUBLISHED_PATH + '?v=' + Date.now(), { cache:'no-store' });
    if (r.ok) { const j = await r.json(); if (j && typeof j === 'object') return j; }
  } catch (e) {}
  return null;
}
/* Pull the live published content into the editor (overwrites the working draft). */
async function loadPublishedIntoEditor() {
  const j = await fetchPublished();
  if (!j) { toast('Aucun site.json publié trouvé en ligne.', 'err'); return; }
  if (!confirm('Charger la version actuellement EN LIGNE dans l’éditeur ? Ton brouillon local sera remplacé.')) return;
  SITE = deepMerge(JSON.parse(JSON.stringify(DEFAULT_SITE)), j);
  if (saveSite()) { renderAll(); updateBrandMark(); toast('Version publiée chargée dans l’éditeur.', 'ok'); }
}
/* Drop the local draft so the editor (and your own preview) match the published version. */
async function clearLocalDraft() {
  if (!confirm('Effacer ton brouillon local et synchroniser sur la dernière version publiée ?')) return;
  try { localStorage.removeItem(SITE_KEY); } catch (e) {}
  const j = await fetchPublished();
  SITE = j ? deepMerge(JSON.parse(JSON.stringify(DEFAULT_SITE)), j) : JSON.parse(JSON.stringify(DEFAULT_SITE));
  saveSite(); renderAll(); updateBrandMark();
  toast('Brouillon effacé — éditeur synchronisé.', 'ok');
}
function importSiteJson(e) {
  const f = e.target.files && e.target.files[0]; if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    try {
      const parsed = JSON.parse(ev.target.result);
      if (!parsed || typeof parsed !== 'object') throw new Error('JSON invalide');
      if (!confirm('Remplacer tout le contenu actuel par ce fichier ?')) { e.target.value = ''; return; }
      SITE = deepMerge(JSON.parse(JSON.stringify(DEFAULT_SITE)), parsed);
      if (saveSite()) { renderAll(); toast('Contenu importé.', 'ok'); }
    } catch (err) { toast('Erreur: '+err.message, 'err'); }
    e.target.value = '';
  };
  r.readAsText(f);
}
function clearAnalytics() {
  if (!confirm('Effacer toutes les visites et clics enregistrés ?')) return;
  try { localStorage.removeItem(ANALYTICS_KEY); } catch {}
  renderAnalytics(); renderClicksTab(1); renderVisitsTab(1);
  toast('Analytics effacées.', 'ok');
}
function resetSite() {
  if (!confirm('Restaurer le contenu PAR DÉFAUT ? Tu perdras toutes tes modifications.')) return;
  if (!confirm('Confirmer une dernière fois — cette action est irréversible.')) return;
  SITE = JSON.parse(JSON.stringify(DEFAULT_SITE));
  if (saveSite()) { renderAll(); toast('Contenu restauré.', 'ok'); }
}

/* ════════════════════════════════════════════
   EXPORT CSV (analytics)
   ════════════════════════════════════════════ */
$('exportBtn').onclick = () => {
  const data = getData();
  const visits = data.visits.map(v => ({
    type:'visite', date:fmtDate(v.ts), valeur:'', categorie:'',
    lang:v.lang||'', source:(v.ref||'direct').slice(0,80),
    mobile:v.mob?'oui':'non', timezone:v.tz||''
  }));
  const clicks = data.clicks.map(c => ({
    type:'clic', date:fmtDate(c.ts), valeur:c.value||'', categorie:clickLabel(c.value),
    lang:'', source:'', mobile:'', timezone:''
  }));
  const all = [...visits, ...clicks].sort((a,b) => a.date.localeCompare(b.date));
  if (!all.length) { toast('Aucune donnée à exporter.', 'err'); return; }
  const headers = ['type','date','valeur','categorie','lang','source','mobile','timezone'];
  const csv = [headers.join(','), ...all.map(r => headers.map(h => '"'+String(r[h]||'').replace(/"/g,'""')+'"').join(','))].join('\n');
  const blob = new Blob([csv], { type:'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `schicgirl-analytics-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  toast(all.length + ' événements exportés.', 'ok');
};

/* ════════════════════════════════════════════
   CROSS-TAB SYNC (if user opens index.html in another tab and edits there)
   ════════════════════════════════════════════ */
window.addEventListener('storage', e => {
  if (e.key === SITE_KEY) {
    SITE = loadSite();
    if (!$('dashboard').classList.contains('hidden')) renderAll();
  }
});

/* ── PUBLISH BUTTON ── */
$('publishBtn').onclick = publishSite;
$('publishModal').addEventListener('click', e => { if (e.target.id === 'publishModal') closePublishModal(); });

/* ════════════════════════════════════════════
   INIT
   ════════════════════════════════════════════ */
async function init() {
  // One-time migration: if a previous version stored a plaintext password
  // in cfg.password, hash it now and remove the plaintext.
  try {
    const cfg = getCfg();
    if (cfg.password && !cfg.passwordHash) {
      cfg.passwordHash = await sha256(cfg.password);
      delete cfg.password;
      saveCfg(cfg);
    }
  } catch (e) { /* if migration fails, fall back to the default hash */ }

  if (checkSession()) showDash();
  else showLogin();
  // No local draft yet → reflect the live published site so the editor isn't stale.
  if (!localStorage.getItem(SITE_KEY)) {
    const j = await fetchPublished();
    if (j) {
      SITE = deepMerge(JSON.parse(JSON.stringify(DEFAULT_SITE)), j);
      if (!$('dashboard').classList.contains('hidden')) { renderAll(); updateBrandMark(); }
    }
  }
}
init();
