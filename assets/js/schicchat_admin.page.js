/* ═══════════════════════════════════════════════
   CONFIG — SECURITY
   ───────────────────────────────────────────────
   PASSWORD_HASH is the SHA-256 of your admin password.
   NEVER store the real password here.

   HOW TO GENERATE YOUR HASH:
   1. Open any browser console (F12 → Console)
   2. Paste this (replace YourPassword):
      crypto.subtle.digest('SHA-256',new TextEncoder().encode('YourPassword'))
        .then(b=>console.log([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
   3. Copy the 64-char hex output and paste it below.
═══════════════════════════════════════════════ */
// ⚠️  REPLACE THIS with the SHA-256 hash of your NEW password (see instructions above).
//     Your old plaintext password was exposed — choose a new one.
const PASSWORD_HASH = "eacb20f402c4738505df836b6cc58c054db7fbc3abe79ce7fc7520a906e3fcbb";

/* ── Async password checker using Web Crypto ── */
async function checkPassword(pwd){
  try{
    const buf  = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(pwd));
    const hex  = [...new Uint8Array(buf)].map(x=>x.toString(16).padStart(2,"0")).join("");
    return hex === PASSWORD_HASH;
  }catch(e){ return false; }
}

/* ── Rate limit: 5 attempts, 5-minute lockout ── */
const RATE_LIMIT_KEY = "schic_admin_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;
function getAttempts(){
  try { return JSON.parse(sessionStorage.getItem(RATE_LIMIT_KEY) || '{"count":0,"until":0}'); }
  catch(e) { return { count:0, until:0 }; }
}
function bumpAttempts(){
  const a = getAttempts();
  a.count++;
  if (a.count >= MAX_ATTEMPTS) a.until = Date.now() + LOCKOUT_MS;
  sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(a));
}
function clearAttempts(){ sessionStorage.removeItem(RATE_LIMIT_KEY); }
function isLockedOut(){
  const a = getAttempts();
  return a.until && Date.now() < a.until;
}

const PROFILE_LABELS = {
  "Sécheresse chronique":  { label:"Sécheresse chronique", badge:"badge-rose" },
  "Longueur bloquée":      { label:"Longueur bloquée", badge:"badge-gold" },
  "Casse active":          { label:"Casse active", badge:"badge-rose" },
  "Tempes":                { label:"Tempes & follicules", badge:"badge-brown" },
  "Cuir chevelu":          { label:"Cuir chevelu", badge:"badge-green" },
  "Routine à construire":  { label:"Routine à construire", badge:"badge-brown" },
  "Surcharge":             { label:"Surcharge d'infos", badge:"badge-gold" }
};

/* ═══════════════════════════════════════════════
   ÉTAT
═══════════════════════════════════════════════ */
let allLeads = [];
let filteredLeads = [];
let sortCol = "date";
let sortDir = -1; // -1 = desc
let currentPage = 1;
const PAGE_SIZE = 15;

/* ═══════════════════════════════════════════════
   DOM REFS
═══════════════════════════════════════════════ */
const $ = id => document.getElementById(id);
const loginCard    = $("loginCard");
const dashboard    = $("dashboard");
const loginBtn     = $("loginBtn");
const logoutBtn    = $("logoutBtn");
const refreshBtn   = $("refreshBtn");
const exportBtn    = $("exportBtn");
const localPwdEl   = $("localPassword");
const webAppUrlEl  = $("webAppUrl");
const adminTokenEl = $("adminToken");
const searchInput  = $("searchInput");
const filterProfile= $("filterProfile");
const filterScore  = $("filterScore");
const leadRows     = $("leadRows");
const tableCount   = $("tableCount");
const drawerOverlay= $("drawerOverlay");
const drawerClose  = $("drawerClose");
const drawerBody   = $("drawerBody");
const drawerTitle  = $("drawerTitle");
const paginationInfo=$("paginationInfo");
const pageBtns     = $("pageBtns");
const tableLoading = $("tableLoading");
const emptyState   = $("emptyState");
const loginError   = $("loginError");

/* ═══════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════ */
function showToast(msg, type=""){
  const t=$("toast");
  t.textContent=msg;
  t.className="toast"+(type?" "+type:"");
  t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),3200);
}

/* ═══════════════════════════════════════════════
   AUTH
═══════════════════════════════════════════════ */
function saveSettings(){
  localStorage.setItem("schic_admin_url",   webAppUrlEl.value.trim());
  localStorage.setItem("schic_admin_token", adminTokenEl.value.trim());
  sessionStorage.setItem("schic_admin_logged","true");
}

function loadSettings(){
  webAppUrlEl.value   = localStorage.getItem("schic_admin_url")   || "";
  adminTokenEl.value  = localStorage.getItem("schic_admin_token") || "";
  if(sessionStorage.getItem("schic_admin_logged")==="true") showDashboard();
}

function showDashboard(){
  loginCard.classList.add("hidden");
  dashboard.classList.remove("hidden");
  fetchLeads();
}

function showLogin(msg=""){
  dashboard.classList.add("hidden");
  loginCard.classList.remove("hidden");
  if(msg){ loginError.style.display="block"; loginError.textContent=msg; }
}

loginBtn.onclick = async ()=>{
  loginError.style.display="none";
  if(isLockedOut()){
    const wait = Math.ceil((getAttempts().until - Date.now()) / 1000);
    loginError.style.display="block";
    loginError.textContent = `Trop de tentatives. Réessaie dans ${wait}s.`;
    return;
  }
  loginBtn.disabled=true;
  loginBtn.textContent="Vérification…";
  const ok = await checkPassword(localPwdEl.value);
  loginBtn.disabled=false;
  loginBtn.textContent="Se connecter →";
  if(!ok){
    bumpAttempts();
    loginError.style.display="block";
    loginError.textContent="Mot de passe incorrect.";
    localPwdEl.value = "";
    localPwdEl.focus(); return;
  }
  clearAttempts();
  if(!webAppUrlEl.value.trim()||!adminTokenEl.value.trim()){
    loginError.style.display="block";
    loginError.textContent="Ajoute le Web App URL et le token admin.";
    return;
  }
  saveSettings();
  showDashboard();
};

logoutBtn.onclick = ()=>{
  sessionStorage.removeItem("schic_admin_logged");
  showLogin();
};

/* Enter key on login form */
[localPwdEl, webAppUrlEl, adminTokenEl].forEach(el=>{
  el.addEventListener("keydown", e=>{ if(e.key==="Enter") loginBtn.click(); });
});

/* ═══════════════════════════════════════════════
   FETCH LEADS
═══════════════════════════════════════════════ */
async function fetchLeads(){
  const url   = localStorage.getItem("schic_admin_url");
  const token = localStorage.getItem("schic_admin_token");
  if(!url||!token) return;

  tableLoading.style.display="block";
  leadRows.innerHTML="";
  emptyState.classList.add("hidden");

  try{
    const res  = await fetch(`${url}?action=listLeads&adminToken=${encodeURIComponent(token)}`);
    const data = await res.json();
    tableLoading.style.display="none";
    if(!data.ok){ showToast(data.error||"Erreur de chargement.","error"); return; }
    allLeads = data.leads||[];
    buildFilterOptions();
    applyFiltersAndRender();
    renderStats();
    renderCharts();
    showToast(`${allLeads.length} lead${allLeads.length>1?"s":""} chargé${allLeads.length>1?"s":""}.`,"success");
  } catch(err){
    tableLoading.style.display="none";
    showToast("Impossible de charger les leads. Vérifie le déploiement Apps Script.","error");
    console.error(err);
  }
}

refreshBtn.onclick = fetchLeads;

/* ═══════════════════════════════════════════════
   FILTRES
═══════════════════════════════════════════════ */
function buildFilterOptions(){
  const profiles = [...new Set(allLeads.map(l=>l.profile||"").filter(Boolean))].sort();
  filterProfile.innerHTML = `<option value="">Tous les profils</option>`;
  profiles.forEach(p=>{
    const o=document.createElement("option");
    o.value=p; o.textContent=p.length>30?p.slice(0,30)+"…":p;
    filterProfile.appendChild(o);
  });
}

searchInput.addEventListener("input",  ()=>{ currentPage=1; applyFiltersAndRender(); });
filterProfile.addEventListener("change",()=>{ currentPage=1; applyFiltersAndRender(); });
filterScore.addEventListener("change",  ()=>{ currentPage=1; applyFiltersAndRender(); });

function applyFiltersAndRender(){
  const q     = searchInput.value.toLowerCase().trim();
  const prof  = filterProfile.value;
  const scoreF= filterScore.value;

  filteredLeads = allLeads.filter(l=>{
    if(q && !["name","contact","country","profile","priority"].some(k=> String(l[k]||"").toLowerCase().includes(q))) return false;
    if(prof && !(l.profile||"").includes(prof.split(" ")[0])) return false;
    if(scoreF){
      const s=Number(l.score||0);
      if(scoreF==="high" && s<7)  return false;
      if(scoreF==="mid"  && (s<4||s>6)) return false;
      if(scoreF==="low"  && s>3)  return false;
    }
    return true;
  });

  sortLeads();
  renderTable();
  renderPagination();
}

/* ═══════════════════════════════════════════════
   TRI
═══════════════════════════════════════════════ */
document.querySelectorAll(".tbl th[data-col]").forEach(th=>{
  th.onclick=()=>{
    const col=th.dataset.col;
    if(sortCol===col) sortDir*=-1;
    else{ sortCol=col; sortDir=-1; }
    document.querySelectorAll(".tbl th").forEach(t=>t.classList.remove("sorted"));
    th.classList.add("sorted");
    th.querySelector(".sort-arrow").textContent = sortDir===-1?"↓":"↑";
    applyFiltersAndRender();
  };
});

function sortLeads(){
  filteredLeads.sort((a,b)=>{
    let va=a[sortCol]||"", vb=b[sortCol]||"";
    if(sortCol==="score"){ va=Number(va)||0; vb=Number(vb)||0; return sortDir*(va-vb); }
    return sortDir*(String(va).localeCompare(String(vb)));
  });
}

/* ═══════════════════════════════════════════════
   TABLE RENDER
═══════════════════════════════════════════════ */
function renderTable(){
  const start=(currentPage-1)*PAGE_SIZE;
  const page=filteredLeads.slice(start, start+PAGE_SIZE);

  tableCount.textContent=`${filteredLeads.length} résultat${filteredLeads.length>1?"s":""}`;
  leadRows.innerHTML="";

  if(!filteredLeads.length){
    emptyState.classList.remove("hidden");
    $("paginationBar").style.display="none";
    return;
  }

  emptyState.classList.add("hidden");
  $("paginationBar").style.display="flex";

  page.forEach((lead,i)=>{
    const tr=document.createElement("tr");
    const date=lead.date?new Date(lead.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"short",year:"numeric"}):"—";
    const score=Number(lead.score||0);
    const scoreClass = score>=7?"score-high":score>=4?"score-mid":"score-low";
    const prof=lead.profile||"";
    const profKey=Object.keys(PROFILE_LABELS).find(k=>prof.includes(k));
    const profMeta=profKey?PROFILE_LABELS[profKey]:{label:prof.slice(0,28)||(prof||"—"),badge:"badge-brown"};

    tr.innerHTML=`
      <td style="font-size:12px;color:var(--muted);white-space:nowrap">${date}</td>
      <td><strong>${esc(lead.name||"—")}</strong></td>
      <td style="font-size:12px;color:var(--muted)">${esc(lead.contact||"—")}</td>
      <td>${esc(lead.country||"—")}</td>
      <td><span class="badge ${profMeta.badge}">${esc(profMeta.label)}</span></td>
      <td><span class="score-pill ${scoreClass}">${score||"—"}</span></td>
      <td style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="btn btn-outline btn-sm view-btn" data-idx="${start+i}">Voir →</button>
        <button class="btn btn-gold btn-sm pdf-row-btn" data-idx="${start+i}" title="Télécharger PDF">⬇</button>
      </td>`;
    leadRows.appendChild(tr);
  });

  leadRows.querySelectorAll(".view-btn").forEach(btn=>{
    btn.onclick=()=>openDrawer(filteredLeads[Number(btn.dataset.idx)]);
  });
  leadRows.querySelectorAll(".pdf-row-btn").forEach(btn=>{
    btn.onclick=()=>downloadPdf(filteredLeads[Number(btn.dataset.idx)]);
  });
}

/* ═══════════════════════════════════════════════
   PAGINATION
═══════════════════════════════════════════════ */
function renderPagination(){
  const total=filteredLeads.length;
  const pages=Math.ceil(total/PAGE_SIZE);
  const start=(currentPage-1)*PAGE_SIZE+1;
  const end=Math.min(currentPage*PAGE_SIZE, total);

  paginationInfo.textContent=total?`${start}–${end} sur ${total}`:"";
  pageBtns.innerHTML="";

  if(pages<=1) return;

  const addBtn=(label, page, disabled=false)=>{
    const b=document.createElement("button");
    b.className="page-btn"+(page===currentPage?" active":"");
    b.textContent=label; b.disabled=disabled;
    b.onclick=()=>{ currentPage=page; renderTable(); renderPagination(); };
    pageBtns.appendChild(b);
  };

  addBtn("‹", currentPage-1, currentPage===1);
  const range=[];
  for(let p=1;p<=pages;p++){
    if(p===1||p===pages||Math.abs(p-currentPage)<=1) range.push(p);
    else if(range[range.length-1]!=="…") range.push("…");
  }
  range.forEach(p=>{
    if(p==="…"){ const s=document.createElement("span"); s.textContent="…"; s.style.cssText="display:grid;place-items:center;width:32px;color:var(--muted)"; pageBtns.appendChild(s); }
    else addBtn(p,p);
  });
  addBtn("›", currentPage+1, currentPage===pages);
}

/* ═══════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════ */
function renderStats(){
  $("statTotal").textContent = allLeads.length;

  const scores=allLeads.map(l=>Number(l.score||0)).filter(s=>s>0);
  const avg=scores.length?Math.round((scores.reduce((a,b)=>a+b,0)/scores.length)*10)/10:0;
  $("statAvgScore").textContent=avg||"—";

  const countries=[...new Set(allLeads.map(l=>l.country).filter(Boolean))];
  $("statCountries").textContent=countries.length;

  const profileFreq={};
  allLeads.forEach(l=>{ if(l.profile){ const k=l.profile.split("—")[0].trim().split(" ").slice(0,2).join(" "); profileFreq[k]=(profileFreq[k]||0)+1; }});
  const top=Object.entries(profileFreq).sort((a,b)=>b[1]-a[1])[0];
  $("statTopProfile").textContent=top?top[0]:"—";
}

/* ═══════════════════════════════════════════════
   CHARTS
═══════════════════════════════════════════════ */
function renderCharts(){
  /* Profils */
  const profileFreq={};
  allLeads.forEach(l=>{
    if(!l.profile) return;
    const k=Object.keys(PROFILE_LABELS).find(p=>l.profile.includes(p))||l.profile.split("—")[0].trim().split(" ").slice(0,3).join(" ");
    profileFreq[k]=(profileFreq[k]||0)+1;
  });
  const profEntries=Object.entries(profileFreq).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const maxProf=profEntries[0]?.[1]||1;
  const profileChart=$("profileChart");
  profileChart.innerHTML="";
  profEntries.forEach(([k,v])=>{
    const pct=Math.round((v/maxProf)*100);
    profileChart.innerHTML+=`<div class="bar-row">
      <span class="bar-label" title="${esc(k)}">${esc(k.length>22?k.slice(0,22)+"…":k)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="bar-count">${v}</span>
    </div>`;
  });
  if(!profEntries.length) profileChart.innerHTML=`<p style="color:var(--muted);font-size:13px;">Pas encore de données.</p>`;

  /* Scores */
  const scoreBuckets={"1–3":0,"4–5":0,"6–7":0,"8–10":0};
  allLeads.forEach(l=>{
    const s=Number(l.score||0);
    if(s<=3) scoreBuckets["1–3"]++;
    else if(s<=5) scoreBuckets["4–5"]++;
    else if(s<=7) scoreBuckets["6–7"]++;
    else scoreBuckets["8–10"]++;
  });
  const scoreEntries=Object.entries(scoreBuckets);
  const maxScore=Math.max(...scoreEntries.map(([,v])=>v),1);
  const scoreChart=$("scoreChart");
  scoreChart.innerHTML="";
  scoreEntries.forEach(([k,v])=>{
    const pct=Math.round((v/maxScore)*100);
    scoreChart.innerHTML+=`<div class="bar-row">
      <span class="bar-label">Score ${esc(k)}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
      <span class="bar-count">${v}</span>
    </div>`;
  });
}

/* ═══════════════════════════════════════════════
   DRAWER DÉTAIL
═══════════════════════════════════════════════ */
function openDrawer(lead){
  currentLeadForPdf = lead;
  drawerTitle.textContent = lead.name ? `Diagnostic de ${esc(lead.name)}` : "Détail du lead";
  const date=lead.date?new Date(lead.date).toLocaleDateString("fr-FR",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}):"—";
  const score=Number(lead.score||0);
  const scoreClass=score>=7?"score-high":score>=4?"score-mid":"score-low";

  const fields=[
    {label:"Date",      val:date},
    {label:"Prénom",    val:lead.name||"—"},
    {label:"Contact",   val:lead.contact||"Non renseigné"},
    {label:"Pays",      val:lead.country||"—"},
    {label:"Climat",    val:lead.climate||"—"},
    {label:"Score",     val:`<span class="score-pill ${scoreClass}" style="font-size:18px;width:40px;height:40px;">${score||"—"}</span>`},
    {label:"Profil",    val:lead.profile||"—"},
    {label:"Priorité",  val:lead.priority||"—"},
  ];

  const capFields=[
    {label:"Texture",       val:lead.texture||"—"},
    {label:"Épaisseur",     val:lead.thickness||"—"},
    {label:"Densité",       val:lead.density||"—"},
    {label:"Porosité",      val:lead.porosity||"—"},
    {label:"Élasticité",    val:lead.elasticity||"—"},
    {label:"Longueur",      val:lead.hairLength||"—"},
    {label:"Cuir chevelu",  val:lead.scalp||"—"},
    {label:"Casse",         val:lead.breakage||"—"},
    {label:"Pointes",       val:lead.splitEnds||"—"},
    {label:"Antécédents",   val:lead.heatDamage||"—"},
    {label:"Démêlage",      val:lead.detangling||"—"},
    {label:"Coiffure",      val:lead.styles||"—"},
    {label:"Accessories",   val:lead.accessories||"—"},
    {label:"Chaleur",       val:lead.heat||"—"},
    {label:"Protec. therm.",val:lead.heatProtectant||"—"},
    {label:"Protéine bal.", val:lead.proteinBalance||"—"},
  ];

  const lifeFields=[
    {label:"Eau / jour",    val:lead.water||"—"},
    {label:"Protéines alim.",val:lead.foodProtein||"—"},
    {label:"Hormonal",      val:lead.hormonal||"—"},
    {label:"Stress / Sommeil",val:lead.stressSleep||"—"},
    {label:"Compléments",   val:lead.supplements||"—"},
    {label:"Budget",        val:lead.budget||"—"},
    {label:"Temps dispo",   val:lead.timeAvailable||"—"},
    {label:"Objectif",      val:lead.goal||"—"},
  ];

  const makeGrid = arr => arr.map(f=>`
    <div class="detail-item">
      <div class="d-label">${f.label}</div>
      <div class="d-val">${f.val}</div>
    </div>`).join("");


  const conversation = Array.isArray(lead.conversation)
  ? lead.conversation
  : [];

const conversationHtml = conversation.length
  ? `
    <div class="detail-divider"></div>
    <div class="detail-section">
      <h4>Conversation complète avec la cliente</h4>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${conversation.map(m => {
          const role = m.role === "client" || m.role === "user" ? "Cliente" : "SchicChat";
          const bg = role === "Cliente" ? "var(--brown)" : "rgba(253,246,238,.7)";
          const color = role === "Cliente" ? "white" : "var(--brown)";

          return `
            <div style="background:${bg};color:${color};border-radius:14px;padding:12px;font-size:13px;line-height:1.6;white-space:pre-line;">
              <strong>${role}</strong><br>
              ${esc(m.message || "")}
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `
  : `
    <div class="detail-divider"></div>
    <div class="detail-section">
      <h4>Conversation complète avec la cliente</h4>
      <p style="font-size:13px;color:var(--muted);">
        Aucune conversation enregistrée pour ce diagnostic.
      </p>
    </div>
  `;

  drawerBody.innerHTML=`
    <div class="detail-section">
      <h4>Informations générales</h4>
      <div class="detail-grid">${makeGrid(fields)}</div>
    </div>
    <div class="detail-divider"></div>
    <div class="detail-section">
      <h4>Profil capillaire</h4>
      <div class="detail-grid">${makeGrid(capFields)}</div>
    </div>
    <div class="detail-divider"></div>
    <div class="detail-section">
      <h4>Mode de vie</h4>
      <div class="detail-grid">${makeGrid(lifeFields)}</div>
    </div>
    ${lead.priority?`
    <div class="detail-divider"></div>
    <div class="detail-section">
      <h4>Priorité de coaching</h4>
      <p style="font-size:13.5px;line-height:1.65;color:var(--brown)">${esc(lead.priority)}</p>
    </div>`:""}
    ${conversationHtml}`;

  drawerOverlay.classList.add("open");
  document.body.style.overflow="hidden";
}

drawerClose.onclick = closeDrawer;
drawerOverlay.addEventListener("click", e=>{ if(e.target===drawerOverlay) closeDrawer(); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeDrawer(); });

$("pdfBtn").onclick = ()=> downloadPdf(currentLeadForPdf);

function closeDrawer(){
  drawerOverlay.classList.remove("open");
  document.body.style.overflow="";
}

/* ═══════════════════════════════════════════════
   EXPORT CSV
═══════════════════════════════════════════════ */
exportBtn.onclick = ()=>{
  const data = filteredLeads.length ? filteredLeads : allLeads;
  if(!data.length){ showToast("Aucun lead à exporter.","error"); return; }
  const headers=Object.keys(data[0]);
  const csv=[headers.join(","),...data.map(l=>headers.map(h=>`"${String(l[h]||"").replaceAll('"','""')}"`).join(","))].join("\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download=`schicchat-leads-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
  showToast(`${data.length} leads exportés avec succès.`,"success");
};

/* ═══════════════════════════════════════════════
   UTILS
═══════════════════════════════════════════════ */
function esc(v){
  return String(v)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* ═══════════════════════════════════════════════
   PDF GENERATION — diagnostic complet
═══════════════════════════════════════════════ */
let currentLeadForPdf = null;

function buildDiagnosticText(lead){
  const isEN = (lead.lang === 'en');
  const lines = [];
  const S = isEN ? 'Schicgirl™ — Expert Hair Diagnostic' : 'Schicgirl™ — Diagnostic Capillaire Expert';
  lines.push(S);
  lines.push('═'.repeat(60));
  lines.push('');

  const date = lead.date ? new Date(lead.date).toLocaleDateString(isEN?'en-GB':'fr-FR',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';

  const conversationRows = Array.isArray(lead.conversation) ? lead.conversation : [];
  const conversationBlock = conversationRows.length ? `
  <div class="section conversation">
    <div class="section-title">${isEN?'Full client conversation':'Conversation complète avec la cliente'}</div>
    ${conversationRows.map(m=>{
      const role=(m.role||"bot").toLowerCase()==="client"||String(m.role||"").toLowerCase()==="user"?"client":"bot";
      const label=role==="client"?(isEN?'Client':'Cliente'):'SchicChat';
      const time=m.timestamp?new Date(m.timestamp).toLocaleString(isEN?'en-GB':'fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'';
      return `<div class="conv-row ${role}"><span class="conv-label">${label}${time?' · '+esc(time):''}</span>${esc(m.message||'')}</div>`;
    }).join('')}
  </div>` : '';

  lines.push((isEN?'Name: ':'Prénom : ') + (lead.name||'—'));
  lines.push((isEN?'Date: ':'Date : ') + date);
  lines.push((isEN?'Country: ':'Pays : ') + (lead.country||'—'));
  lines.push((isEN?'Language: ':'Langue : ') + (lead.lang||'fr').toUpperCase());
  lines.push('');
  lines.push('─'.repeat(60));
  lines.push(isEN?'HAIR HEALTH SCORE':'SCORE SANTÉ CAPILLAIRE');
  lines.push('─'.repeat(60));
  lines.push((isEN?'Score: ':'Score : ') + (lead.score||'—') + '/10');
  lines.push((isEN?'Profile: ':'Profil : ') + (lead.profile||'—'));
  lines.push((isEN?'Priority: ':'Priorité : ') + (lead.priority||'—'));
  lines.push('');
  lines.push('─'.repeat(60));
  lines.push(isEN?'HAIR PROFILE':'PROFIL CAPILLAIRE');
  lines.push('─'.repeat(60));
  const capFields = [
    ['texture','Texture'],['thickness', isEN?'Strand thickness':'Épaisseur'],
    ['density', isEN?'Density':'Densité'],['porosity', isEN?'Porosity':'Porosité'],
    ['elasticity', isEN?'Elasticity':'Élasticité'],['hairLength', isEN?'Length':'Longueur'],
    ['scalp', isEN?'Scalp':'Cuir chevelu'],['dandruff', isEN?'Dandruff':'Pellicules'],
    ['breakage', isEN?'Breakage':'Casse'],['splitEnds', isEN?'Split ends':'Pointes'],
    ['heatDamage', isEN?'Chemical/heat history':'Antécédents'],
    ['detangling', isEN?'Detangling':'Démêlage'],['styles', isEN?'Hairstyle':'Coiffure'],
    ['accessories', isEN?'Accessories':'Accessoires'],['heat', isEN?'Heat tools':'Chaleur'],
    ['heatProtectant', isEN?'Heat protection':'Protec. thermique'],
    ['proteinBalance', isEN?'Protein balance':'Équilibre protéines'],
  ];
  capFields.forEach(([k,lbl])=>{ if(lead[k]) lines.push(`  ${lbl}: ${lead[k]}`); });
  lines.push('');
  lines.push('─'.repeat(60));
  lines.push(isEN?'LIFESTYLE':'MODE DE VIE');
  lines.push('─'.repeat(60));
  const lifeFields = [
    ['water', isEN?'Daily water intake':'Eau / jour'],
    ['foodProtein', isEN?'Protein intake':'Protéines alim.'],
    ['hormonal', isEN?'Hormonal context':'Hormonal'],
    ['stressSleep', isEN?'Stress & sleep':'Stress / sommeil'],
    ['supplements', isEN?'Supplements':'Compléments'],
    ['budget', isEN?'Budget':'Budget'],
    ['timeAvailable', isEN?'Time available':'Temps dispo'],
    ['goal', isEN?'Goal':'Objectif'],
  ];
  lifeFields.forEach(([k,lbl])=>{ if(lead[k]) lines.push(`  ${lbl}: ${lead[k]}`); });
  lines.push('');
  lines.push('═'.repeat(60));
  lines.push(isEN?'NOTE':'NOTE');
  lines.push('─'.repeat(60));
  lines.push(isEN?
    'This diagnostic is generated automatically by SchicChat (Schicgirl™).\nFor the complete personalised routine and natural recipes, ask the client\nto access their full result from the chat app.':
    'Ce diagnostic est généré automatiquement par SchicChat (Schicgirl™).\nPour la routine personnalisée complète et les recettes naturelles, demander à la cliente\nd\'accéder à son résultat complet depuis l\'application chat.');
  lines.push('');
  lines.push('schicgirl.me · contacte.schicgirl@gmail.com · © 2026 Schicgirl™');
  return lines.join('\n');
}

function downloadPdf(lead){
  if(!lead){ showToast(isEN_admin?'No lead selected.':'Aucun lead sélectionné.','error'); return; }

  const isEN = (lead.lang === 'en');
  const text = buildDiagnosticText(lead);
  const name = lead.name ? lead.name.replace(/[^a-z0-9]/gi,'_') : 'diagnostic';
  const dateStr = lead.date ? new Date(lead.date).toISOString().slice(0,10) : new Date().toISOString().slice(0,10);
  const filename = `schicgirl_diagnostic_${name}_${dateStr}.txt`;

  // Generate printable HTML for PDF via print dialog
  const printWin = window.open('','_blank','width=900,height=700');
  if(!printWin){ showToast('Popup bloqué. Autorise les popups pour ce site.','error'); return; }

  const score = Number(lead.score||0);
  const scoreColor = score>=7?'#3a6b4c':score>=4?'#b07b38':'#8a3a33';

  const capRows = [
    ['texture','Texture'],['thickness',isEN?'Strand thickness':'Épaisseur de mèche'],
    ['density',isEN?'Density':'Densité'],['porosity',isEN?'Porosity':'Porosité'],
    ['elasticity',isEN?'Elasticity':'Élasticité'],['hairLength',isEN?'Length':'Longueur'],
    ['scalp',isEN?'Scalp condition':'Cuir chevelu'],['dandruff',isEN?'Dandruff':'Pellicules'],
    ['breakage',isEN?'Breakage':'Casse'],['splitEnds',isEN?'Split ends':'Pointes'],
    ['heatDamage',isEN?'Chemical/heat history':'Antécédents chimiques/thermiques'],
    ['detangling',isEN?'Detangling method':'Méthode de démêlage'],
    ['styles',isEN?'Daily hairstyle':'Coiffure quotidienne'],
    ['accessories',isEN?'Night accessories':'Accessoires nuit'],
    ['heat',isEN?'Heat tools':'Chaleur directe'],
    ['heatProtectant',isEN?'Heat protection':'Protection thermique'],
    ['proteinBalance',isEN?'Protein reaction':'Réaction aux protéines'],
  ].filter(([k])=>lead[k]);

  const lifeRows = [
    ['water',isEN?'Daily water intake':'Eau / jour'],
    ['foodProtein',isEN?'Protein in diet':'Protéines alimentaires'],
    ['hormonal',isEN?'Hormonal context':'Contexte hormonal'],
    ['stressSleep',isEN?'Stress & sleep':'Stress & sommeil'],
    ['supplements',isEN?'Supplements':'Compléments alimentaires'],
    ['budget',isEN?'Monthly budget':'Budget mensuel'],
    ['timeAvailable',isEN?'Time available per week':'Temps disponible/semaine'],
    ['goal',isEN?'3-month goal':'Objectif 3 mois'],
  ].filter(([k])=>lead[k]);

  const date = lead.date ? new Date(lead.date).toLocaleDateString(isEN?'en-GB':'fr-FR',{day:'2-digit',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}) : '—';

  const conversationRows = Array.isArray(lead.conversation) ? lead.conversation : [];
  const conversationBlock = conversationRows.length ? `
  <div class="section conversation">
    <div class="section-title">${isEN?'Full client conversation':'Conversation complète avec la cliente'}</div>
    ${conversationRows.map(m=>{
      const role=(m.role||"bot").toLowerCase()==="client"||String(m.role||"").toLowerCase()==="user"?"client":"bot";
      const label=role==="client"?(isEN?'Client':'Cliente'):'SchicChat';
      const time=m.timestamp?new Date(m.timestamp).toLocaleString(isEN?'en-GB':'fr-FR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}):'';
      return `<div class="conv-row ${role}"><span class="conv-label">${label}${time?' · '+esc(time):''}</span>${esc(m.message||'')}</div>`;
    }).join('')}
  </div>` : '';


  printWin.document.write(`<!DOCTYPE html><html lang="${esc(lead.lang||'fr')}"><head>
<meta charset="UTF-8">
<title>Schicgirl Diagnostic — ${esc(lead.name||'Lead')}</title>
<link rel="stylesheet" href="assets/css/schicchat_admin.page.css" />
</head><body>
<div class="page">

  <div class="hdr">
    <div class="hdr-brand">
      <p>Schicgirl™</p>
      <h1>${isEN?'Expert Hair Diagnostic':'Diagnostic Capillaire Expert'}</h1>
    </div>
    <div class="hdr-meta">
      <div><strong>${isEN?'Client':'Cliente'}</strong> ${esc(lead.name||'—')}</div>
      <div><strong>${isEN?'Date':'Date'}</strong> ${date}</div>
      <div><strong>${isEN?'Country':'Pays'}</strong> ${esc(lead.country||'—')}</div>
      <div><strong>${isEN?'Language':'Langue'}</strong> ${(lead.lang||'fr').toUpperCase()}</div>
      ${lead.contact?`<div><strong>Contact</strong> ${esc(lead.contact)}</div>`:''}
    </div>
  </div>

  <div class="score-hero">
    <div class="score-circle">
      <span class="score-num">${score}</span>
      <span class="score-denom">/10</span>
    </div>
    <div class="score-info">
      <h2>${esc(lead.profile||'—')}</h2>
      <p><em>${isEN?'Priority:':'Priorité :'}</em> ${esc(lead.priority||'—')}</p>
    </div>
  </div>

  ${lead.redFlags&&lead.redFlags.length?`
  <div class="redflags">
    <p><strong>⚠️ ${isEN?'Alert flags':'Signaux d\'alerte'}</strong></p>
    ${lead.redFlags.map(f=>`<p>• ${esc(f)}</p>`).join('')}
  </div>`:''}

  <div class="section">
    <div class="section-title">${isEN?'Hair Profile':'Profil Capillaire'}</div>
    <div class="grid">
      ${capRows.map(([k,lbl])=>`<div class="item"><div class="item-label">${lbl}</div><div class="item-val">${esc(lead[k])}</div></div>`).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">${isEN?'Lifestyle':'Mode de Vie'}</div>
    <div class="grid">
      ${lifeRows.map(([k,lbl])=>`<div class="item"><div class="item-label">${lbl}</div><div class="item-val">${esc(lead[k])}</div></div>`).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">${isEN?'Coaching note':'Note de coaching'}</div>
    <p style="font-size:11px;color:#6b3e2e;line-height:1.7;background:#fdf6ee;border-radius:10px;padding:10px 13px;border:1px solid rgba(176,123,56,.15)">
      ${isEN?
        'This diagnostic was generated automatically by <strong>SchicChat (Schicgirl™)</strong>. To access the complete personalised routine, detailed natural recipes and full 7-day action plan, ask the client to re-open the chat app and scroll to the end of their results.':
        'Ce diagnostic a été généré automatiquement par <strong>SchicChat (Schicgirl™)</strong>. Pour accéder à la routine personnalisée complète, aux recettes naturelles détaillées et au plan d\'action sur 7 jours, demander à la cliente de ré-ouvrir l\'application chat et de faire défiler jusqu\'à la fin de ses résultats.'}
    </p>
  </div>

  ${conversationBlock}

  <div class="ftr">
    <span>schicgirl.me · contacte.schicgirl@gmail.com</span>
    <span>© 2026 Schicgirl™ — ${isEN?'Confidential — for coaching use only':'Confidentiel — usage coaching uniquement'}</span>
  </div>
</div>

<footer class="sg-foot">© 2024–2026 Schicgirl™</footer>


</body></html>`);
  printWin.document.close();
  setTimeout(()=>{ try{ printWin.focus(); printWin.print(); }catch(e){} }, 500);
  showToast(isEN?'PDF opened in a new window — print or save as PDF.':'PDF ouvert dans une nouvelle fenêtre — imprime ou enregistre en PDF.','success');
}

/* ═══════════════════════════════════════════════
   PRINT ALL — Batch print all visible leads
═══════════════════════════════════════════════ */
$("printAllBtn").onclick = ()=>{
  const data = filteredLeads.length ? filteredLeads : allLeads;
  if(!data.length){ showToast("Aucun lead à imprimer.","error"); return; }
  if(!confirm(`Imprimer ${data.length} diagnostic(s) en une seule page ?`)) return;

  const printWin = window.open("","_blank","width=1000,height=800");
  if(!printWin){ showToast("Popup bloqué. Autorise les popups pour ce site.","error"); return; }

  const pages = data.map(lead=>{
    const isEN = (lead.lang==="en");
    const score = Number(lead.score||0);
    const scoreColor = score>=7?"#3a6b4c":score>=4?"#b07b38":"#8a3a33";
    const date = lead.date ? new Date(lead.date).toLocaleDateString(isEN?"en-GB":"fr-FR",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}) : "—";
    const convRows = Array.isArray(lead.conversation) ? lead.conversation : [];
    const convHtml = convRows.length ? `
      <div class="section"><div class="section-title">${isEN?"Full conversation":"Conversation complète"}</div>
        ${convRows.map(m=>{
          const role=(m.role||"bot").toLowerCase()==="client"||(m.role||"").toLowerCase()==="user"?"client":"bot";
          const label=role==="client"?(isEN?"Client":"Cliente"):"SchicChat";
          const time=m.timestamp?new Date(m.timestamp).toLocaleString(isEN?"en-GB":"fr-FR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):"";
          return `<div class="conv-row ${role}"><span class="conv-label">${label}${time?" · "+esc(time):""}</span>${esc(m.message||"")}</div>`;
        }).join("")}
      </div>` : "";
    return `<div class="page">
      <div class="hdr">
        <div><p style="font-size:9px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#b07b38;margin-bottom:2px">Schicgirl™</p>
          <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:24px;font-weight:400">${isEN?"Expert Hair Diagnostic":"Diagnostic Capillaire Expert"}</h1></div>
        <div style="text-align:right;font-size:10px;color:#9a7060;line-height:1.8">
          <div><strong>${isEN?"Client":"Cliente"}</strong> ${esc(lead.name||"—")}</div>
          <div><strong>Date</strong> ${date}</div>
          <div><strong>${isEN?"Country":"Pays"}</strong> ${esc(lead.country||"—")}</div>
          ${lead.contact?`<div><strong>Contact</strong> ${esc(lead.contact)}</div>`:""}
        </div>
      </div>
      <div class="score-hero">
        <div class="score-circle" style="border-color:${scoreColor}">
          <span class="score-num" style="color:${scoreColor}">${score}</span><span class="score-denom">/10</span>
        </div>
        <div><h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:18px;font-weight:400;margin-bottom:4px">${esc(lead.profile||"—")}</h2>
          <p style="font-size:11px;color:#6b3e2e">${esc(lead.priority||"—")}</p></div>
      </div>
      ${convHtml}
      <div class="ftr"><span>schicgirl.me · contacte.schicgirl@gmail.com</span>
        <span>© 2026 Schicgirl™ — ${isEN?"Confidential":"Confidentiel"}</span></div>
    </div>`;
  }).join('<div style="page-break-after:always"></div>');

  printWin.document.write(`<!DOCTYPE html><html><head>
    <meta charset="UTF-8">
    <title>Schicgirl — ${data.length} Diagnostics</title>
    
  </head><body>${pages}</body></html>`);
  printWin.document.close();
  setTimeout(()=>{ try{ printWin.focus(); printWin.print(); }catch(e){} },600);
  showToast(`${data.length} diagnostic(s) envoyé(s) à l'imprimante.`,"success");
};

const isEN_admin = false; // Admin interface is in French

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */
loadSettings();

function buildConversationHtml(lead){
  const conversation = Array.isArray(lead.conversation) ? lead.conversation : [];
  if(!conversation.length){
    return `
      <div class="detail-divider"></div>
      <div class="detail-section">
        <h4>Conversation complète avec la cliente</h4>
        <p style="font-size:13.5px;line-height:1.65;color:var(--muted)">
          Aucune conversation enregistrée pour ce lead. Les nouveaux diagnostics seront sauvegardés avec tous les messages.
        </p>
      </div>`;
  }

  return `
    <div class="detail-divider"></div>
    <div class="detail-section">
      <h4>Conversation complète avec la cliente</h4>
      <div class="conversation-log">
        ${conversation.map(m=>{
          const roleRaw = String(m.role || "bot").toLowerCase();
          const role = roleRaw === "client" || roleRaw === "user" ? "client" : "bot";
          const label = role === "client" ? "Cliente" : "SchicChat";
          const time = m.timestamp ? new Date(m.timestamp).toLocaleString("fr-FR",{
            day:"2-digit", month:"short", hour:"2-digit", minute:"2-digit"
          }) : "";
          return `<div class="conv-msg ${role}">
            <span class="conv-meta">${label}${time ? " · " + esc(time) : ""}</span>
            ${esc(m.message || "")}
          </div>`;
        }).join("")}
      </div>
    </div>`;
}


async function testAdminConnection(){
  const url = localStorage.getItem("schic_admin_url") || (document.getElementById("webAppUrl") ? document.getElementById("webAppUrl").value.trim() : "");
  const token = localStorage.getItem("schic_admin_token") || (document.getElementById("adminToken") ? document.getElementById("adminToken").value.trim() : "");
  if(!url || !token){
    showToast ? showToast("Ajoute le Web App URL et le token admin avant de tester.","error") : alert("Ajoute le Web App URL et le token admin.");
    return;
  }
  try{
    const res = await fetch(`${url}?action=listLeads&adminToken=${encodeURIComponent(token)}`);
    const txt = await res.text();
    console.log("Admin connection test:", txt);
    showToast ? showToast("Test admin envoyé. Regarde la console ou clique Rafraîchir.","success") : alert("Test admin envoyé.");
  }catch(err){
    console.error(err);
    showToast ? showToast("Erreur test admin. Vérifie Apps Script.","error") : alert("Erreur test admin.");
  }
}
