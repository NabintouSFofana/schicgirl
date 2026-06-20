/* ============================================================
   CONFIG — fill these in, then save the file.

   1. ENDPOINT  : your Apps Script Web app URL (it ends in /exec).
                  Get it from Deploy → Manage deployments.
   2. SAVED_KEY : OPTIONAL. If you put your password here, the
                  page fills it in for you so you don't type it
                  each time. Leave "" to type it manually.
                  NOTE: whatever you use here MUST exactly match
                  ADMIN_KEY in schicgirl-signups-backend.gs — and
                  if you changed ADMIN_KEY, you must re-deploy a
                  NEW VERSION of the script for it to take effect.
============================================================ */
const ENDPOINT  = "https://script.google.com/macros/s/AKfycbzK_uRZiqvLZgEbbEWfpfcCDfFBpyYxhqskzDeKPbl012pgzGSdfBCautw4Hhkt7xkBEQ/exec";
const SAVED_KEY = "";

let DATA = [];      // current rows
let KEY  = "";      // access key, kept in memory only

const $ = id => document.getElementById(id);

if(SAVED_KEY){ window.addEventListener("DOMContentLoaded", ()=>{ $("key").value = SAVED_KEY; }); }

function toast(msg){
  const t = $("toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._t); t._t = setTimeout(()=>t.classList.remove("show"), 1900);
}

function fmtDate(v){
  const d = new Date(v);
  if(isNaN(d)) return "";
  return d.toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"}) +
         " · " + d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"});
}

async function load(){
  if(!ENDPOINT || ENDPOINT.indexOf("PASTE") === 0){
    return "noendpoint";
  }
  try{
    const res = await fetch(ENDPOINT + "?key=" + encodeURIComponent(KEY));
    const out = await res.json();
    if(!out.ok){ return out.error === "unauthorized" ? "badkey" : "error"; }
    DATA = (out.rows || []).slice().reverse(); // newest first
    render();
    return "ok";
  }catch(e){
    return "unreachable";
  }
}

function filtered(){
  const q = $("search").value.trim().toLowerCase();
  if(!q) return DATA;
  return DATA.filter(r =>
    String(r.name||"").toLowerCase().includes(q) ||
    String(r.email||"").toLowerCase().includes(q)
  );
}

function render(){
  const rows = filtered();
  $("total").textContent = DATA.length;
  const tb = $("tbody");
  tb.innerHTML = "";
  $("empty").style.display = rows.length ? "none" : "block";

  rows.forEach((r,i)=>{
    const tr = document.createElement("tr");
    const lang = (r.lang||"").toString().toUpperCase();
    tr.innerHTML =
      '<td class="idx">'+(i+1)+'</td>'+
      '<td>'+fmtDate(r.time)+'</td>'+
      '<td>'+escapeHtml(r.name||"")+'</td>'+
      '<td class="email">'+emailCell(r.email)+'</td>'+
      '<td>'+phoneCell(r.phone)+'</td>'+
      '<td>'+(lang?'<span class="tag">'+lang+'</span>':'')+'</td>';
    tb.appendChild(tr);
  });
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function emailCell(e){
  e = String(e||"").trim();
  return e ? '<a href="mailto:'+escapeHtml(e)+'">'+escapeHtml(e)+'</a>'
           : '<span class="nil">—</span>';
}
function phoneCell(p){
  p = String(p||"").trim();
  if(!p) return '<span class="nil">—</span>';
  const digits = p.replace(/[^\d]/g,"");   // wa.me needs digits only, incl. country code
  return '<a href="https://wa.me/'+digits+'" target="_blank" rel="noopener" title="Message on WhatsApp">'+escapeHtml(p)+' ↗</a>';
}

/* ---- actions ---- */
function exportCSV(){
  const rows = filtered();
  if(!rows.length){ toast("Nothing to export yet"); return; }
  const head = ["Date","Name","Email","Phone","Language"];
  const lines = [head.join(",")].concat(rows.map(r =>
    [fmtDate(r.time), r.name, r.email, r.phone, r.lang]
      .map(v => '"' + String(v==null?"":v).replace(/"/g,'""') + '"').join(",")
  ));
  const blob = new Blob([lines.join("\n")], {type:"text/csv;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "schicgirl-signups.csv";
  a.click();
  URL.revokeObjectURL(a.href);
  toast("CSV downloaded");
}

async function copyText(text, label){
  if(!text){ toast("Nothing to copy"); return; }
  try{ await navigator.clipboard.writeText(text); }
  catch(e){
    const ta = document.createElement("textarea");
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand("copy"); ta.remove();
  }
  toast(label);
}
function copyEmails(){
  const list = filtered().map(r => r.email).filter(Boolean);
  copyText(list.join(", "), list.length + " emails copied");
}
function copyPhones(){
  const list = filtered().map(r => r.phone).filter(Boolean);
  copyText(list.join(", "), list.length + " phone numbers copied");
}

/* ---- unlock flow ---- */
async function unlock(){
  KEY = $("key").value.trim();
  if(!KEY){ return; }
  $("unlockBtn").textContent = "Checking…"; $("unlockBtn").disabled = true;
  $("gateErr").classList.remove("show");
  const status = await load();
  $("unlockBtn").textContent = "Unlock"; $("unlockBtn").disabled = false;
  if(status === "ok"){
    $("gate").style.display = "none";
    $("dash").classList.add("show");
    $("logoutBtn").style.display = "inline-block";
    return;
  }
  const msg = {
    noendpoint:  "This page isn’t connected yet — paste your Web app URL into ENDPOINT at the top of this file.",
    badkey:      "That key doesn’t match ADMIN_KEY in your Apps Script. Check the spelling — and if you changed it, re-deploy a NEW VERSION of the script.",
    unreachable: "Can’t reach your script. Check the Web app URL, and that it’s deployed with access set to “Anyone”.",
    error:       "Reached the script, but something went wrong reading the sheet. Try again."
  }[status] || "Couldn’t unlock. Try again.";
  $("gateErr").textContent = msg;
  $("gateErr").classList.add("show");
}

$("unlockBtn").addEventListener("click", unlock);
$("key").addEventListener("keydown", e=>{ if(e.key==="Enter") unlock(); });
$("refreshBtn").addEventListener("click", async ()=>{ const s = await load(); toast(s==="ok" ? "Refreshed" : "Couldn’t refresh"); });
$("search").addEventListener("input", render);
$("csvBtn").addEventListener("click", exportCSV);
$("copyBtn").addEventListener("click", copyEmails);
$("copyPhonesBtn").addEventListener("click", copyPhones);
$("logoutBtn").addEventListener("click", ()=>{
  KEY=""; DATA=[]; $("key").value="";
  $("dash").classList.remove("show"); $("gate").style.display="grid"; $("logoutBtn").style.display="none";
});
