/* ── Config Supabase (mêmes valeurs que index.html) ── */
      const SUPABASE_URL = "https://YOUR-PROJECT.supabase.co"; // <-- à remplacer
      const SUPABASE_KEY = "YOUR-ANON-KEY"; // <-- à remplacer (clé "anon public")
      const REVIEWS_TABLE = "reviews";
      const CONTACT_EMAIL = "contacte.schicgirl@gmail.com"; // fallback e-mail

      let LANG = "fr";
      let RATING = 5;

      function supabaseReady() {
        return SUPABASE_URL.indexOf("YOUR-") === -1 && SUPABASE_KEY.indexOf("YOUR-") === -1;
      }
      function T(fr, en) { return LANG === "fr" ? fr : en; }

      function setLang(l) {
        LANG = l;
        document.getElementById("btnEn").classList.toggle("is-active", l === "en");
        document.getElementById("btnFr").classList.toggle("is-active", l === "fr");
        document.documentElement.lang = l;
        document.querySelectorAll("[data-fr]").forEach((el) => {
          el.innerHTML = l === "fr" ? el.getAttribute("data-fr") : el.getAttribute("data-en");
        });
        document.querySelectorAll("[data-ph-fr]").forEach((el) => {
          el.placeholder = l === "fr" ? el.getAttribute("data-ph-fr") : el.getAttribute("data-ph-en");
        });
      }

      // Étoiles
      const starEls = Array.from(document.querySelectorAll(".star"));
      function paint(n) { starEls.forEach((s) => s.classList.toggle("on", Number(s.dataset.v) <= n)); }
      starEls.forEach((s) => {
        s.addEventListener("click", () => { RATING = Number(s.dataset.v); paint(RATING); });
        s.addEventListener("mouseenter", () => paint(Number(s.dataset.v)));
      });
      document.getElementById("stars").addEventListener("mouseleave", () => paint(RATING));
      paint(RATING);

      function showMsg(html, isErr) {
        const m = document.getElementById("msg");
        m.innerHTML = html;
        m.className = "msg" + (isErr ? " err" : "");
        m.style.display = "block";
      }

      // ── Photo : sélection + aperçu + redimensionnement ──
      const PHOTO_BUCKET = "review-photos";
      let PHOTO_FILE = null;
      document.getElementById("photoBtn").addEventListener("click", () => document.getElementById("photo").click());
      document.getElementById("photo").addEventListener("change", (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        PHOTO_FILE = f;
        const prev = document.getElementById("photoPreview");
        prev.src = URL.createObjectURL(f);
        prev.classList.add("show");
        document.getElementById("photoBtn").textContent = T("📷 Changer la photo", "📷 Change photo");
      });
      // Réduit l'image (max 1000px, JPEG) pour un upload léger
      function resizeImage(file) {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = () => {
            const max = 1000;
            let { width, height } = img;
            if (width > max || height > max) {
              if (width >= height) { height = Math.round((height * max) / width); width = max; }
              else { width = Math.round((width * max) / height); height = max; }
            }
            const c = document.createElement("canvas");
            c.width = width; c.height = height;
            c.getContext("2d").drawImage(img, 0, 0, width, height);
            c.toBlob((blob) => resolve(blob || file), "image/jpeg", 0.85);
          };
          img.onerror = () => resolve(file);
          img.src = URL.createObjectURL(file);
        });
      }
      async function uploadPhoto() {
        if (!PHOTO_FILE || !supabaseReady()) return null;
        try {
          const blob = await resizeImage(PHOTO_FILE);
          const name = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
          const r = await fetch(SUPABASE_URL + "/storage/v1/object/" + PHOTO_BUCKET + "/" + name, {
            method: "POST",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: "Bearer " + SUPABASE_KEY,
              "Content-Type": "image/jpeg",
            },
            body: blob,
          });
          if (!r.ok) return null;
          return SUPABASE_URL + "/storage/v1/object/public/" + PHOTO_BUCKET + "/" + name;
        } catch (e) { return null; }
      }

      async function submitReview() {
        const author = document.getElementById("author").value.trim();
        const text = document.getElementById("text").value.trim();
        if (!author || !text) {
          showMsg(T("Ajoute ton prénom et ton avis 🙂", "Please add your name and review 🙂"), true);
          return;
        }
        const btn = document.getElementById("submit");
        btn.disabled = true;
        btn.textContent = T("Envoi…", "Sending…");

        // Si Supabase n'est pas configuré → fallback e-mail
        if (!supabaseReady()) {
          const subject = encodeURIComponent("Nouvel avis client — Schicgirl");
          const body = encodeURIComponent(
            "Note : " + RATING + "/5\nPrénom : " + author + "\nLangue : " + LANG + "\n\nAvis :\n" + text +
            (PHOTO_FILE ? "\n\n(Photo jointe — à envoyer séparément)" : "")
          );
          window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
          done();
          return;
        }

        try {
          const photo_url = await uploadPhoto(); // null si pas de photo / échec
          const payload = { author: author, text: text, rating: RATING, lang: LANG };
          if (photo_url) payload.photo_url = photo_url;
          const r = await fetch(SUPABASE_URL + "/rest/v1/" + REVIEWS_TABLE, {
            method: "POST",
            headers: {
              apikey: SUPABASE_KEY,
              Authorization: "Bearer " + SUPABASE_KEY,
              "Content-Type": "application/json",
              Prefer: "return=minimal",
            },
            body: JSON.stringify(payload),
          });
          if (!r.ok) throw new Error("HTTP " + r.status);
          done();
        } catch (e) {
          btn.disabled = false;
          btn.textContent = T("Envoyer mon avis", "Send my review");
          showMsg(T("Oups, échec de l'envoi. Réessaie ou écris-moi à " + CONTACT_EMAIL, "Oops, sending failed. Try again or email me at " + CONTACT_EMAIL), true);
        }
      }
      function done() {
        document.getElementById("formCard").style.display = "none";
        document.getElementById("thanks").style.display = "block";
      }
      document.getElementById("submit").addEventListener("click", submitReview);

      // Langue depuis l'URL (?lang=en) ou par défaut FR
      const qp = new URLSearchParams(location.search).get("lang");
      setLang(qp === "en" ? "en" : "fr");
