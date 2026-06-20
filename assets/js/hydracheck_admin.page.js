// TODO: move auth to a backend before this holds anything sensitive

// password hash — to rotate: `echo -n 'newpass' | sha256sum`
const ADMIN_PASSWORD_HASH = "eacb20f402c4738505df836b6cc58c054db7fbc3abe79ce7fc7520a906e3fcbb";

const STORAGE_KEY = "schicgirl_hydration_leads";
const SETTINGS_KEY = "schicgirl_hydration_settings";
const RATE_LIMIT_KEY = "schic_hydration_admin_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

const $ = id => document.getElementById(id);

let bookings = [];
let editingId = null;
let viewingId = null;
let sort = { col: "createdAt", dir: -1 };
let pendingConfirm = null;

// ─── crypto / auth ───────────────────────────────────────────────────
async function sha256(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}
function getAttempts() {
  try { return JSON.parse(sessionStorage.getItem(RATE_LIMIT_KEY) || '{"count":0,"until":0}'); }
  catch (e) { return { count: 0, until: 0 }; }
}
function bumpAttempts() {
  const a = getAttempts();
  a.count++;
  if (a.count >= MAX_ATTEMPTS) a.until = Date.now() + LOCKOUT_MS;
  sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(a));
}
function clearAttempts() { sessionStorage.removeItem(RATE_LIMIT_KEY); }

$("loginBtn").onclick = async () => {
  const a = getAttempts();
  if (a.until && Date.now() < a.until) {
    const wait = Math.ceil((a.until - Date.now()) / 1000);
    $("loginError").textContent = `Trop de tentatives. Réessaie dans ${wait}s.`;
    $("loginError").style.display = "block";
    return;
  }
  const entered = $("password").value;
  const hash = await sha256(entered);
  if (hash !== ADMIN_PASSWORD_HASH) {
    bumpAttempts();
    $("loginError").textContent = "Mot de passe incorrect.";
    $("loginError").style.display = "block";
    $("password").value = "";
    return;
  }
  clearAttempts();
  sessionStorage.setItem("schic_hydration_admin_logged", "true");
  showDashboard();
};
$("password").addEventListener("keydown", e => { if (e.key === "Enter") $("loginBtn").click(); });
$("logoutBtn").onclick = () => {
  sessionStorage.removeItem("schic_hydration_admin_logged");
  location.reload();
};

function showDashboard() {
  $("login").classList.add("hidden");
  $("dashboard").classList.remove("hidden");
  $("logoutBtn").classList.remove("hidden");
  loadData();
  renderAll();
}
if (sessionStorage.getItem("schic_hydration_admin_logged") === "true") showDashboard();

// ─── data ────────────────────────────────────────────────────────────
function loadData() {
  try { bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch (e) { bookings = []; toast("Données corrompues. Restaure depuis ta sauvegarde.", "err"); }
  // backwards compat: give every record an id + default status
  let changed = false;
  bookings.forEach(b => {
    if (!b.id) { b.id = generateId(); changed = true; }
    if (!b.status) { b.status = "new"; changed = true; }
    if (typeof b.notes !== "string") { b.notes = ""; changed = true; }
  });
  if (changed) saveData();
}
function saveData() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings)); }
  catch (e) { toast("Sauvegarde impossible (stockage plein ?).", "err"); }
}
function generateId() {
  return "b_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}
function getSettings() {
  try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}"); }
  catch (e) { return {}; }
}
function saveSettings(s) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }
  catch (e) {}
}

// ─── rendering ───────────────────────────────────────────────────────
function renderAll() {
  renderStats();
  renderChart();
  renderTable();
}

function renderStats() {
  const total = bookings.length;
  const isNew = b => (b.status || "new") === "new";
  const isContacted = b => b.status === "contacted";
  const isPaid = b => b.status === "paid";
  const last30 = Date.now() - 30 * 24 * 3600 * 1000;
  const inLast30 = b => {
    const ts = Date.parse(b.createdAt || "");
    return !isNaN(ts) && ts >= last30;
  };
  $("statTotal").textContent = total;
  $("statNew").textContent = bookings.filter(isNew).length;
  $("statContacted").textContent = bookings.filter(isContacted).length;
  $("statPaid").textContent = bookings.filter(isPaid).length;
  $("stat30d").textContent = bookings.filter(inLast30).length;
}

function renderChart() {
  // 30-day daily count
  const days = 30;
  const buckets = Array(days).fill(0);
  const labels = Array(days).fill("");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - (days - 1 - i));
    labels[i] = d.getDate();
  }
  bookings.forEach(b => {
    const ts = Date.parse(b.createdAt || "");
    if (isNaN(ts)) return;
    const diff = Math.floor((now - ts) / (24 * 3600 * 1000));
    const idx = days - 1 - diff;
    if (idx >= 0 && idx < days) buckets[idx]++;
  });
  const max = Math.max(1, ...buckets);
  $("chart").innerHTML = buckets.map((n, i) => {
    const h = Math.round((n / max) * 100);
    return `<div class="chart-bar" style="height:${h}%" title="${n} réservation${n === 1 ? "" : "s"}"></div>`;
  }).join("");
  $("chartLabels").innerHTML = labels.map((l, i) =>
    `<span>${i % 5 === 0 || i === days - 1 ? l : ""}</span>`
  ).join("");
}

function renderTable() {
  const q = $("search").value.trim().toLowerCase();
  const statusFilter = $("filterStatus").value;

  let list = bookings.slice();

  if (q) {
    list = list.filter(b =>
      (b.name || "").toLowerCase().includes(q) ||
      (b.contact || "").toLowerCase().includes(q) ||
      (b.problem || "").toLowerCase().includes(q) ||
      (b.country || "").toLowerCase().includes(q) ||
      (b.notes || "").toLowerCase().includes(q)
    );
  }
  if (statusFilter) {
    list = list.filter(b => (b.status || "new") === statusFilter);
  }

  list.sort((a, b) => {
    const va = a[sort.col] ?? "";
    const vb = b[sort.col] ?? "";
    if (va < vb) return -1 * sort.dir;
    if (va > vb) return 1 * sort.dir;
    return 0;
  });

  if (list.length === 0) {
    $("rows").innerHTML = `<tr><td colspan="8"><div class="empty">
      <div class="big">🌿</div>
      <p>${q || statusFilter ? "Aucun diagnostic ne correspond à ces filtres." : "Aucun diagnostic pour le moment. Quand quelqu'un termine HydraCheck, son profil apparaîtra ici."}</p>
    </div></td></tr>`;
  } else {
    $("rows").innerHTML = list.map(b => `
      <tr>
        <td><small>${formatDate(b.createdAt)}</small></td>
        <td><strong>${esc(b.name || "—")}</strong><small>${esc(b.country || "")}</small></td>
        <td>${esc(b.contact || "—")}</td>
        <td>${esc(b.profile || "—")}<small>${esc(b.mainProblem || "")}</small></td>
        <td>${esc(b.porosity || "—")}</td>
        <td>${esc(b.score || "—")}</td>
        <td>${renderStatus(b.status)}</td>
        <td class="actions">
          <button class="btn btn-outline btn-sm" data-view="${esc(b.id)}">Voir</button>
          <button class="btn btn-outline btn-sm" data-edit="${esc(b.id)}">✎</button>
          <button class="btn btn-danger btn-sm" data-delete="${esc(b.id)}">×</button>
        </td>
      </tr>
    `).join("");
  }

  $("resultsCount").textContent =
    `${list.length} résultat${list.length === 1 ? "" : "s"}` +
    (list.length !== bookings.length ? ` (sur ${bookings.length} au total)` : "");

  document.querySelectorAll("th.sortable").forEach(th => {
    th.classList.toggle("sorted", th.dataset.col === sort.col);
    const icon = th.querySelector(".sort-icon");
    if (icon) icon.textContent = th.dataset.col === sort.col ? (sort.dir === 1 ? "▲" : "▼") : "";
  });
}

function renderStatus(s) {
  s = s || "new";
  const labels = { new: "Nouvelle", contacted: "Contactée", paid: "Payée", done: "Terminée", cancelled: "Annulée" };
  return `<span class="status-badge status-${s}">${labels[s] || s}</span>`;
}

// ─── interactions ────────────────────────────────────────────────────
$("search").addEventListener("input", renderTable);
$("filterStatus").addEventListener("change", renderTable);
$("refreshBtn").onclick = () => { loadData(); renderAll(); toast("Données rechargées.", "ok"); };

document.querySelectorAll("th.sortable").forEach(th => {
  th.onclick = () => {
    const col = th.dataset.col;
    if (sort.col === col) sort.dir *= -1;
    else { sort.col = col; sort.dir = -1; }
    renderTable();
  };
});

document.addEventListener("click", e => {
  const target = e.target.closest("[data-view],[data-edit],[data-delete],[data-close-modal]");
  if (!target) return;
  if (target.dataset.view) openDetail(target.dataset.view);
  else if (target.dataset.edit) openEdit(target.dataset.edit);
  else if (target.dataset.delete) askDelete(target.dataset.delete);
  else if (target.hasAttribute("data-close-modal")) closeModals();
});

// close modals with Escape
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModals();
});

function closeModals() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("open"));
  editingId = null;
  viewingId = null;
  pendingConfirm = null;
}

// ─── detail ──────────────────────────────────────────────────────────
function openDetail(id) {
  const b = bookings.find(x => x.id === id);
  if (!b) return;
  viewingId = id;
  $("detailId").textContent = `${formatDate(b.createdAt)} · ID ${b.id}`;
  const fields = [
    ["Nom", b.name], ["Contact", b.contact], ["Pays", b.country],
    ["Profil", b.profile], ["Problème principal", b.mainProblem],
    ["Détail", b.problem], ["Porosité", b.porosity],
    ["Score", b.score], ["Besoin", b.need],
    ["Recommandation", b.recommendation], ["Statut", renderStatus(b.status)]
  ];
  $("detailBody").innerHTML = fields.map(([k, v]) => `
    <div class="detail"><span>${esc(k)}</span><b>${k === "Statut" ? v : esc(v || "—")}</b></div>
  `).join("");
  $("detailNotes").textContent = b.notes || "(aucune note)";
  $("detailEditBtn").onclick = () => { closeModals(); openEdit(id); };
  $("copyMsgBtn").onclick = () => copyMessage(b);
  $("detailModal").classList.add("open");
}

function copyMessage(b) {
  const msg =
    `Bonjour ${b.name || ""},

Merci d'avoir fait ton diagnostic HydraCheck™.

Voilà ce que ton profil m'indique :
• Porosité : ${b.porosity || "—"}
• Profil : ${b.profile || "—"}
• Score : ${b.score || "—"}
• Besoin principal : ${b.need || "—"}

${b.recommendation || ""}

Si tu veux qu'on creuse ensemble, je propose des consultations privées : https://link.schicgirl.me/

À très vite,
Schicgirl™`;
  navigator.clipboard.writeText(msg).then(
    () => toast("Message copié.", "ok"),
    () => toast("Impossible de copier.", "err")
  );
}

// ─── edit / add ──────────────────────────────────────────────────────
$("addBtn").onclick = () => openEdit(null);

function openEdit(id) {
  editingId = id;
  const b = id ? bookings.find(x => x.id === id) : null;
  $("editTitle").textContent = id ? "Modifier le diagnostic" : "Ajouter un diagnostic manuellement";
  $("editId").textContent = id ? `ID ${id}` : "Si tu veux enregistrer un diagnostic discuté en DM ou en personne.";
  $("f_name").value = b?.name || "";
  $("f_contact").value = b?.contact || "";
  $("f_country").value = b?.country || "";
  $("f_profile").value = b?.profile || "";
  $("f_mainProblem").value = b?.mainProblem || "";
  $("f_problem").value = b?.problem || "";
  $("f_porosity").value = b?.porosity || "";
  $("f_score").value = b?.score || "";
  $("f_need").value = b?.need || "";
  $("f_recommendation").value = b?.recommendation || "";
  $("f_status").value = b?.status || "new";
  $("f_notes").value = b?.notes || "";
  $("editModal").classList.add("open");
}

$("saveBookingBtn").onclick = () => {
  const data = {
    name: $("f_name").value.trim(),
    contact: $("f_contact").value.trim(),
    country: $("f_country").value.trim(),
    profile: $("f_profile").value.trim(),
    mainProblem: $("f_mainProblem").value.trim(),
    problem: $("f_problem").value.trim(),
    porosity: $("f_porosity").value.trim(),
    score: $("f_score").value.trim(),
    need: $("f_need").value.trim(),
    recommendation: $("f_recommendation").value.trim(),
    status: $("f_status").value,
    notes: $("f_notes").value.trim()
  };
  if (!data.name && !data.contact) {
    toast("Au moins un nom ou un contact, merci.", "err");
    return;
  }
  if (editingId) {
    const idx = bookings.findIndex(b => b.id === editingId);
    if (idx >= 0) {
      bookings[idx] = { ...bookings[idx], ...data, updatedAt: new Date().toISOString() };
      toast("Diagnostic modifié.", "ok");
    }
  } else {
    bookings.unshift({
      id: generateId(),
      ...data,
      createdAt: new Date().toISOString(),
      source: "manual"
    });
    toast("Diagnostic ajouté.", "ok");
  }
  saveData();
  renderAll();
  closeModals();
};

// ─── delete ──────────────────────────────────────────────────────────
function askDelete(id) {
  const b = bookings.find(x => x.id === id);
  if (!b) return;
  $("confirmTitle").textContent = "Supprimer ce diagnostic ?";
  $("confirmText").innerHTML = `<strong>${esc(b.name || "(sans nom)")}</strong> · ${esc(b.contact || "—")}<br><br>Cette action est définitive.`;
  pendingConfirm = () => {
    bookings = bookings.filter(x => x.id !== id);
    saveData();
    renderAll();
    toast("Diagnostic supprimé.", "ok");
    closeModals();
  };
  $("confirmYes").textContent = "Oui, supprimer";
  $("confirmModal").classList.add("open");
}

$("confirmYes").onclick = () => { if (pendingConfirm) pendingConfirm(); };

// ─── clear all ───────────────────────────────────────────────────────
$("clearBtn").onclick = () => {
  if (bookings.length === 0) { toast("Aucun diagnostic à effacer.", "info"); return; }
  $("confirmTitle").textContent = `Effacer ${bookings.length} diagnostic${bookings.length === 1 ? "" : "s"} ?`;
  $("confirmText").innerHTML = `Cette action est <strong>définitive</strong>. Pense à exporter une sauvegarde JSON avant.`;
  pendingConfirm = () => {
    bookings = [];
    saveData();
    renderAll();
    toast("Tous les diagnostics ont été effacés.", "ok");
    closeModals();
  };
  $("confirmYes").textContent = "Oui, tout effacer";
  $("confirmModal").classList.add("open");
};

// ─── export csv ──────────────────────────────────────────────────────
$("exportBtn").onclick = () => {
  if (bookings.length === 0) { toast("Aucune donnée à exporter.", "info"); return; }
  const cols = ["createdAt","name","contact","country","profile","mainProblem","problem","porosity","score","need","recommendation","status","notes","source","id"];
  const header = cols.join(",");
  const rows = bookings.map(b => cols.map(c => csvCell(b[c])).join(","));
  const csv = [header, ...rows].join("\n");
  downloadBlob(csv, `schicgirl-diagnostics-${todayStr()}.csv`, "text/csv;charset=utf-8");
  toast("CSV exporté.", "ok");
};

// ─── export / import json ────────────────────────────────────────────
$("exportJsonBtn").onclick = () => {
  const data = { exportedAt: new Date().toISOString(), bookings };
  downloadBlob(JSON.stringify(data, null, 2), `schicgirl-diagnostics-${todayStr()}.json`, "application/json");
  toast("Sauvegarde JSON téléchargée.", "ok");
};
$("importJsonBtn").onclick = () => $("importJsonFile").click();
$("importJsonFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const imported = Array.isArray(parsed) ? parsed : parsed.bookings;
      if (!Array.isArray(imported)) throw new Error("Format non reconnu");
      // merge by id (or add new)
      const existingIds = new Set(bookings.map(b => b.id));
      let added = 0, merged = 0;
      imported.forEach(b => {
        if (!b.id) b.id = generateId();
        if (existingIds.has(b.id)) { merged++; }
        else { bookings.push(b); added++; }
      });
      saveData();
      renderAll();
      toast(`${added} ajoutée${added === 1 ? "" : "s"}, ${merged} déjà présente${merged === 1 ? "" : "s"}.`, "ok");
    } catch (err) {
      toast("Fichier invalide.", "err");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

// ─── settings ────────────────────────────────────────────────────────
$("settingsBtn").onclick = () => $("settingsModal").classList.add("open");
$("saveSettingsBtn").onclick = () => {
  toast("Réglages enregistrés.", "ok");
  closeModals();
};

// ─── helpers ─────────────────────────────────────────────────────────
function esc(v) {
  return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function csvCell(v) {
  const s = String(v ?? "");
  if (/[",\n\r]/.test(s)) return `"${s.replaceAll('"', '""')}"`;
  return s;
}
function formatDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  } catch (e) { return "—"; }
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function downloadBlob(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}
function toast(msg, type = "info") {
  const t = document.createElement("div");
  t.className = "toast " + type;
  t.textContent = msg;
  $("toasts").appendChild(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .2s"; }, 2500);
  setTimeout(() => t.remove(), 2800);
}
