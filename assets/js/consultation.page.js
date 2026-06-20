const SELAR_LINKS = {
  "Consultation Express": "https://selar.com/consultation_express",
  "Routine Personnalisée": "https://selar.com/routinepersonnalisee",
  "Suivi Premium": "https://selar.com/suivipremium",
  "Analyse écrite uniquement": "https://selar.com/analysecriteuniquement"
};
const STORAGE_KEY = "schicgirl_consultation_bookings";

// ─── Email forwarding ─────────────────────────────────────────────
// Set this to your email to get a notification every time someone books.
// First booking will ask you to confirm the address (Formsubmit sends one
// confirmation email). After that it's automatic.
// Leave as "" to disable forwarding.
const FORWARD_EMAIL = ""; // e.g. "ton-email@gmail.com"
const FORWARD_ENDPOINT = FORWARD_EMAIL
  ? `https://formsubmit.co/ajax/${encodeURIComponent(FORWARD_EMAIL)}`
  : "";


let currentStep = 1;
let selectedPackage = "";
let selectedPrice = "";
let selectedTime = "";

const $ = id => document.getElementById(id);
const steps = [...document.querySelectorAll(".form-step")];

const today = new Date();
today.setDate(today.getDate() + 1);
$("date").min = today.toISOString().split("T")[0];

function showStep(n){
  currentStep = n;
  steps.forEach(s => s.classList.toggle("active", Number(s.dataset.step) === n));
  for(let i=1;i<=4;i++) $("bar"+i).classList.toggle("active", i<=n);
  $("prevBtn").disabled = n === 1;
  $("nextBtn").classList.toggle("hidden", n === 4);
  $("submitBtn").classList.toggle("hidden", n !== 4);
  if(n === 4) renderSummary();
}

function validateStep(){
  const active = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const fields = [...active.querySelectorAll("input, select, textarea")].filter(el => el.hasAttribute("required"));
  for(const field of fields){
    if(!field.value.trim()){
      field.focus();
      return false;
    }
  }
  if(currentStep === 2 && !selectedPackage){
    alert("Choisis un type de consultation.");
    return false;
  }
  if(currentStep === 3 && !selectedTime){
    alert("Choisis une heure.");
    return false;
  }
  return true;
}

$("nextBtn").addEventListener("click", ()=>{
  if(!validateStep()) return;
  showStep(Math.min(4, currentStep + 1));
});

$("prevBtn").addEventListener("click", ()=>{
  showStep(Math.max(1, currentStep - 1));
});

document.querySelectorAll(".choice").forEach(card=>{
  card.addEventListener("click", ()=>{
    document.querySelectorAll(".choice").forEach(c=>c.classList.remove("selected"));
    card.classList.add("selected");
    selectedPackage = card.dataset.package;
    selectedPrice = card.dataset.price;
  });
});

document.querySelectorAll(".time-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".time-btn").forEach(b=>b.classList.remove("selected"));
    btn.classList.add("selected");
    selectedTime = btn.textContent.trim();
  });
});

function getBooking(){
  return {
    createdAt: new Date().toISOString(),
    name: $("name").value.trim(),
    contact: $("contact").value.trim(),
    country: $("country").value.trim(),
    timezone: $("timezone").value,
    problem: $("problem").value,
    package: selectedPackage,
    price: selectedPrice,
    texture: $("texture").value,
    date: $("date").value,
    time: selectedTime,
    format: $("format").value,
    notes: $("notes").value.trim(),
    status: "En attente de paiement"
  };
}

function renderSummary(){
  const b = getBooking();
  $("summary").innerHTML = `
    <div class="summary-row"><span>Cliente</span><span>${escapeHtml(b.name)}</span></div>
    <div class="summary-row"><span>Contact</span><span>${escapeHtml(b.contact)}</span></div>
    <div class="summary-row"><span>Problème principal</span><span>${escapeHtml(b.problem)}</span></div>
    <div class="summary-row"><span>Consultation</span><span>${escapeHtml(b.package)} — $${escapeHtml(b.price)}</span></div>
    <div class="summary-row"><span>Texture</span><span>${escapeHtml(b.texture)}</span></div>
    <div class="summary-row"><span>Date & heure</span><span>${escapeHtml(b.date)} à ${escapeHtml(b.time)}</span></div>
    <div class="summary-row"><span>Fuseau horaire</span><span>${escapeHtml(b.timezone)}</span></div>
    <div class="summary-row"><span>Format</span><span>${escapeHtml(b.format)}</span></div>
  `;
}

$("bookingForm").addEventListener("submit", e=>{
  e.preventDefault();

  if(!validateStep()) return;

  const booking = getBooking();
  // Stamp + id so the admin can tie this to a record
  booking.id = "b_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
  booking.createdAt = new Date().toISOString();
  booking.status = "new";
  booking.notes = "";
  booking.source = "form";

  // Sauvegarde réservation
  const bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));

  // Send email notification if forwarding is enabled.
  // Fire-and-forget; if it fails we still want the redirect to work.
  if (FORWARD_ENDPOINT) {
    fetch(FORWARD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: `Nouvelle réservation Schicgirl — ${booking.name}`,
        _template: "table",
        Nom: booking.name,
        Contact: booking.contact,
        Pays: booking.country,
        "Fuseau horaire": booking.timezone,
        Problème: booking.problem,
        Texture: booking.texture,
        Date: booking.date,
        Heure: booking.time,
        Format: booking.format,
        Formule: booking.package,
        Prix: booking.price,
        "Reçue le": new Date().toLocaleString("fr-FR")
      })
    }).catch(() => {}); // silent — don't block the user if email fails
  }

  // Désactive bouton
  $("submitBtn").disabled = true;
  $("submitBtn").textContent = "Redirection vers Selar...";

  // Choisit automatiquement le bon lien
  const paymentLink =
    SELAR_LINKS[booking.package] || "https://selar.com";

  // Redirection automatique
  window.location.href = paymentLink;
});

function buildCalendarLink(b){
  if(!b.date || !b.time) return;
  const start = new Date(`${b.date}T${b.time}:00`);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  const fmt = d => d.toISOString().replace(/[-:]/g,"").split(".")[0] + "Z";
  const text = encodeURIComponent(`Schicgirl Consultation — ${b.name}`);
  const details = encodeURIComponent(`Consultation: ${b.package}\nContact: ${b.contact}\nProblem: ${b.problem}\nFormat: ${b.format}\nNotes: ${b.notes || ""}`);
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${fmt(start)}/${fmt(end)}&details=${details}`;
  $("calendarLink").href = url;
  $("calendarLink").style.display = "inline-flex";
}

function renderBookings(){
  const rows = $("bookingRows");
  const bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").reverse();
  if(!bookings.length){
    rows.innerHTML = `<tr><td colspan="8" style="text-align:center;color:var(--muted);padding:28px;">Aucune réservation pour le moment.</td></tr>`;
    return;
  }
  rows.innerHTML = bookings.map(b => `
    <tr>
      <td>${escapeHtml(new Date(b.createdAt).toLocaleDateString("fr-FR"))}</td>
      <td><strong>${escapeHtml(b.name)}</strong><br><small>${escapeHtml(b.country)}</small></td>
      <td>${escapeHtml(b.contact)}</td>
      <td>${escapeHtml(b.problem)}<br><small>Texture: ${escapeHtml(b.texture)}</small></td>
      <td>${escapeHtml(b.package)}<br><strong>$${escapeHtml(b.price)}</strong></td>
      <td>${escapeHtml(b.date)}<br>${escapeHtml(b.time)}<br><small>${escapeHtml(b.timezone)}</small></td>
      <td>${escapeHtml(b.format)}</td>
      <td>${escapeHtml(b.notes || "—")}</td>
    </tr>
  `).join("");
}

if($("openAdmin")){
  $("openAdmin").addEventListener("click", ()=>{
    $("adminModal").classList.add("open");
    renderBookings();
  });
}

$("closeAdmin").addEventListener("click", ()=>{
  $("adminModal").classList.remove("open");
});

$("adminModal").addEventListener("click", e=>{
  if(e.target === $("adminModal")) $("adminModal").classList.remove("open");
});

$("exportBookings").addEventListener("click", ()=>{
  const bookings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if(!bookings.length){ alert("Aucune réservation à exporter."); return; }
  const headers = Object.keys(bookings[0]);
  const csv = [headers.join(","), ...bookings.map(b => headers.map(h => `"${String(b[h] || "").replaceAll('"','""')}"`).join(","))].join("\n");
  const blob = new Blob([csv], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `schicgirl-reservations-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

$("clearBookings").addEventListener("click", ()=>{
  if(confirm("Effacer toutes les réservations sauvegardées dans ce navigateur ?")){
    localStorage.removeItem(STORAGE_KEY);
    renderBookings();
  }
});

function escapeHtml(value){
  return String(value || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

renderBookings();
