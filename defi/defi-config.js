/* ═══════════════════════════════════════════════════════════════════
   LE DÉFI 30 JOURS — LES RÉGLAGES (le seul fichier à modifier)

   Utilisé par :
     defi/index.html              la page d'inscription
     defi/calendrier/index.html   le calendrier à cocher sur téléphone
     defi/calendrier-30-jours.html  la source du calendrier PDF

   Après une modification :
     1. si tu as changé JOURS : python tools/fabriquer-pdf-defi.py
     2. dans les pages, augmente le numéro « ?v= » de defi-config.js
        (sinon certains téléphones gardent l'ancienne version en mémoire)
     3. pousse le site
   ═══════════════════════════════════════════════════════════════════ */

var DEFI = {
  edition:     "2026-01",       // change-la à chaque nouvelle session (ex. "2027-01")
  dateDebut:   "2026-09-21",    // jour 1, au format AAAA-MM-JJ
  groupeUrl:   "",              // lien du groupe Facebook du défi
  whatsappUrl: "",              // lien d'une chaîne WhatsApp (facultatif)

  kit:                   "/defi/Schicgirl-Defi-30-jours-Kit-de-depart.pdf",
  kitImpression:         "/defi/Schicgirl-Defi-30-jours-Kit-de-depart-a-imprimer.pdf",
  calendrier:            "/defi/Schicgirl-Defi-30-jours-Calendrier.pdf",
  calendrierImpression:  "/defi/Schicgirl-Defi-30-jours-Calendrier-a-imprimer.pdf",
  calendrierEnLigne:     "/defi/calendrier/",

  supabase: {
    url:   "https://ouwzbqmmtbxqtffghncg.supabase.co",
    // clé publique « anon » (la même que le kit gratuit) : elle peut seulement AJOUTER
    key:   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91d3picW1tdGJ4cXRmZmdobmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwOTU4NDMsImV4cCI6MjA5NjY3MTg0M30.UuRoYPPDL18-J9WyFK5kpFhRguq_9aDeacXDRhdkmD8",
    table: "defi_inscriptions"
  }
};

/* Les 30 jours : [numéro, semaine, titre court, ce qu'on fait] */
var JOURS = [
  [1,1,"Mission","Lavage clarifiant. Observe, note, prends tes 2 photos."],
  [2,1,"Shampooing","Vérifie ton shampooing. Savon noir : dilué + rinçage acide."],
  [3,1,"Porosité","Trouve ta porosité avec tes observations du jour 1."],
  [4,1,"Produits","Quels produits pour ta porosité ?"],
  [5,1,"Erreurs","Arrête les 3 erreurs : à sec, sans satin, huile sur sec."],
  [6,1,"Rappel","Satin cette nuit. Démêlage seulement mouillé."],
  [7,1,"Bilan","Bilan de la semaine 1. Réponds au sondage."],
  [8,2,"Mission","Lavage dans l'ordre : laver, après-shampooing, hydrater, sceller."],
  [9,2,"Rappel","Rafraîchis selon ta porosité, puis scelle."],
  [10,2,"Recettes","Prépare ton spritz (ou choisis ton produit)."],
  [11,2,"Gels","Gel de lin, d'hibiscus ou de gombo : pour la glisse."],
  [12,2,"L'ordre","LOC ou LCO : applique TON ordre sur cheveux mouillés."],
  [13,2,"Rappel","Note combien de temps ton hydratation tient."],
  [14,2,"Bilan","Bilan de la semaine 2."],
  [15,3,"Mission","Rétention : protéger chaque nuit, manipuler moins."],
  [16,3,"Rappel","Aucun démêlage à sec aujourd'hui."],
  [17,3,"Démêlage","Méthode sans casse : sections, pointes d'abord, doigts."],
  [18,3,"Rappel","Une coiffure protectrice qui ne tire pas."],
  [19,3,"La nuit","Ananas, tresses lâches ou bonnet : choisis la tienne."],
  [20,3,"Rappel","Compte les cheveux cassés dans ton peigne."],
  [21,3,"Bilan","Bilan de la semaine 3."],
  [22,4,"Mission","On n'ajoute rien : on répète et on observe."],
  [23,4,"Rappel","Un jour de lavage complet, dans ton ordre."],
  [24,4,"À bannir","Relis la liste des erreurs à ne plus faire."],
  [25,4,"Rappel","Écris ta routine : lavage, milieu de semaine, nuit."],
  [26,4,"Résultats","La vérité sur les résultats en 30 jours."],
  [27,4,"Photos","Photos « après » : même pièce, lumière, angle."],
  [28,4,"Grand bilan","Compare tes photos. Partage ton bilan si tu veux."],
  [29,4,"Rappel","Choisis les 3 habitudes que tu gardes."],
  [30,4,"Clôture","Bravo. Et maintenant ?"]
];

var SEMAINES = {
  1: "Comprendre tes cheveux",
  2: "L'hydratation qui tient",
  3: "Protéger et arrêter la casse",
  4: "Consolider et mesurer"
};

var GESTES = [
  ["eau",     "💧", "L'eau d'abord"],
  ["sceller", "🔒", "J'ai scellé"],
  ["satin",   "🌙", "Satin la nuit"],
  ["demelage","🤲", "Pas de démêlage à sec"]
];
