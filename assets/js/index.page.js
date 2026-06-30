const SCHICGIRL_SITE_KEY = "schicgirl_site";
      const SCHICGIRL_ANALYTICS_KEY = "schicgirl_analytics";
      const SCHICGIRL_MAX_CLICKS = 1200;
      const SCHICGIRL_MAX_VISITS = 600;
      const DEFAULT_SITE = {
        v: 1,
        brand: {
          logo: "assets/logo2.webp",
          name_pre: "Schic",
          name_acc: "girl",
          name_suf: "",
          tagline_fr: "Tes cheveux crépus ne sont pas le problème — la méthode, si. On la corrige ensemble.",
          tagline_en: "Your coily hair isn't the problem — your method is. Let's fix it together.",
          watermark: "Schicgirl · schicgirl.me · © 2024–2026",
        },
        hero: {
          proof_fr: "Spécialiste cheveux crépus Type 4",
          proof_en: "Type 4 coily-hair specialist",
          icons: [
            "assets/woman_icon_0.png",
            "assets/woman_icon_1.png",
            "assets/woman_icon_2.png",
            "assets/woman_icon_3.png",
          ],
          stats: [
            { id: "s1", on: true, text_fr: "10 000+ femmes aidées", text_en: "10,000+ women helped" },
            { id: "s2", on: true, text_fr: "🇫🇷 🇬🇧 100% bilingue", text_en: "🇫🇷 🇬🇧 Fully bilingual" },
          ],
        },
        gifts: {
          on: true,
          label_fr: "Tes Cadeaux Gratuits",
          label_en: "Your Free Gifts",
          items: [
            {
              id: "guide", on: true, emoji: "📖",
              label_fr: "Gratuit · Le Kit Type 4", label_en: "Free · The Type 4 Kit",
              title_fr: "Le Guide Complet Cheveux Type 4", title_en: "The Complete Type 4 Hair Guide",
              sub_fr: "Comprends ta texture, construis ta routine, hydrate enfin tes cheveux crépus.",
              sub_en: "Understand your texture, build your routine, finally hydrate your coily hair.",
              url_fr: "https://schicgirl.me/toolkit-landing", url_en: "https://schicgirl.me/toolkit-landing",
            },
          ],
        },
        shop: {
          on: true,
          label_fr: "Trouve TA solution", label_en: "Find YOUR solution",
          eyebrow_fr: "★ Ebooks experts · Type 4", eyebrow_en: "★ Expert ebooks · Type 4",
          desc_fr: "Hydratation, pousse, cuir chevelu, routines sur mesure — chaque guide règle un vrai problème de cheveux crépus.",
          desc_en: "Hydration, growth, scalp, custom routines — each guide solves one real coily-hair problem.",
          url: "https://selar.com/m/schicgirl", track: "selar-shop",
          cta_fr: "Voir tous mes ebooks →", cta_en: "See all my ebooks →",
          items: [
            {
              id: "studio-planner", on: true, img_fr: "assets/planner-cover-fr.svg", img_en: "assets/planner-cover-en.svg", badge_fr: "Nouveau", badge_en: "New",
              title_fr: "Le Studio · Planner Type 4", title_en: "The Studio · Type 4 Planner",
              desc_fr: "Diagnostic, routine sur mesure, calendrier & suivi — l'app interactive + le cahier PDF 36 pages.",
              desc_en: "Diagnosis, custom routine, calendar & tracking — the interactive app + 36-page PDF workbook.",
              price_fr: "9€", price_en: "$10", price_cfa: "(≈ 6 000 FCFA)", url_fr: "https://selar.com/studio-planner", url_en: "https://selar.com/studio-planner", page_fr: "/fr/planner/", page_en: "/en/planner/",
            },
            {
              id: "hydratee", on: true, img_fr: "assets/hydratee.webp", img_en: "assets/hydrated.webp", badge_fr: "Best-seller", badge_en: "Best-seller",
              title_fr: "Hydratée", title_en: "Hydrated",
              desc_fr: "La science de l'hydratation pour cheveux crépus — 79 pages, la méthode complète.",
              desc_en: "The science of hydration for coily hair — 79 pages, the full method.",
              price_fr: "17€", price_en: "$18", price_cfa: "(≈ 11 000 FCFA)", url_fr: "https://selar.com/hydratee", url_en: "https://selar.com/hydrated", page_fr: "/fr/hydratation-cheveux-crepus/", page_en: "/en/hydrate-type-4-hair/",
            },
            {
              id: "pousse", on: true, img_fr: "assets/pousse.webp", img_en: "assets/grow.webp", badge_fr: "", badge_en: "",
              title_fr: "Pousse Maximale", title_en: "Maximum Growth",
              desc_fr: "Fais pousser tes cheveux crépus, sans casse ni frustration.",
              desc_en: "Grow your coily hair — without breakage or frustration.",
              price_fr: "14€", price_en: "$15", price_cfa: "(≈ 9 000 FCFA)", url_fr: "https://selar.com/pousse", url_en: "https://selar.com/grow-hair", page_fr: "/fr/faire-pousser-cheveux-crepus/", page_en: "/en/grow-type-4-hair/",
            },
            {
              id: "pellicules", on: true, img_fr: "assets/pellicules.webp", img_en: "assets/dandruff.webp", badge_fr: "", badge_en: "",
              title_fr: "Adieu Pellicules", title_en: "Goodbye Dandruff",
              desc_fr: "Comprends et élimine les pellicules sur cheveux crépus, durablement.",
              desc_en: "Understand and clear dandruff on coily hair, for good.",
              price_fr: "8€", price_en: "$9", price_cfa: "(≈ 5 000 FCFA)", url_fr: "https://selar.com/pellicules", url_en: "https://selar.com/dandruff", page_fr: "/fr/pellicules/", page_en: "/en/dandruff/",
            },
            {
              id: "coiffures", on: true, img_fr: "assets/coiffures-fr.webp", img_en: "assets/hair-styles.webp", badge_fr: "Petit prix", badge_en: "",
              title_fr: "Coiffures Protectrices", title_en: "Protective Styles",
              desc_fr: "Protège tes longueurs et gagne en pousse avec les bons styles.",
              desc_en: "Protect your length and gain growth with the right styles.",
              price_fr: "5€", price_en: "$6", price_cfa: "(≈ 3 500 FCFA)", url_fr: "https://selar.com/coiffures-protectrices", url_en: "https://selar.com/hair-styles", page_fr: "/fr/coiffures-protectrices/", page_en: "/en/protective-styles/",
            },
            
            {
              id: "cheveux-secs", on: true, img_fr: "assets/stop-cheveux-secs.webp", img_en: "assets/stop-dry-hair.webp", badge_fr: "Petit prix", badge_en: "Budget",
              title_fr: "Stop aux Cheveux Secs", title_en: "Stop Dry Hair",
              desc_fr: "Le guide express pour en finir avec la sécheresse. Parfait pour commencer.",
              desc_en: "The express guide to end dryness for good. Perfect to start.",
              price_fr: "5€", price_en: "$6", price_cfa: "(≈ 3 500 FCFA)", url_fr: "https://selar.com/stop-cheveux-secs", url_en: "https://selar.com/stop-dry-hair", page_fr: "/fr/cheveux-secs/", page_en: "/en/dry-hair/",
            },
            {
              id: "transition", on: true, img_fr: "assets/transition-fr.webp", img_en: "assets/transition-en.webp", badge_fr: "Petit prix", badge_en: "",
              title_fr: "Cheveux en Transition", title_en: "Transitioning Hair",
              desc_fr: "Passe du défrisé au naturel en douceur, étape par étape.",
              desc_en: "Go from relaxed to natural smoothly, step by step.",
              price_fr: "7€", price_en: "$7", price_cfa: "(≈ 4 500 FCFA)", url_fr: "https://selar.com/transition-fr", url_en: "https://selar.com/transition-en", page_fr: "/fr/transition-capillaire/", page_en: "/en/hair-transition/",
            },
          ],
        },
        tools: {
          on: true,
          label_fr: "Outils Premium", label_en: "Premium Tools",
          items: [
            {
              id: "studio-planner-tool", on: true, lang: "both", style: "feature", icon: "📋",
              label_fr: "Nouveau · 9€ (≈ 6 000 FCFA)", label_en: "New · $10",
              title_fr: "Le Studio · Planner Type 4", title_en: "The Studio · Type 4 Planner",
              sub_fr: "Diagnostic, routine sur mesure, calendrier & suivi — l'app interactive + le cahier PDF 36 pages.",
              sub_en: "Diagnosis, custom routine, calendar & tracking — the interactive app + 36-page PDF workbook.",
              url: "/fr/planner/",
              cta_fr: "Découvrir", cta_en: "Open",
            },
            {
              id: "schicchat", on: true, lang: "both", style: "feature", icon: "💬",
              label_fr: "Diagnostique Auto · Premium", label_en: "Diagnostic · Premium",
              title_fr: "Schicgirl Diagnostique", title_en: "Schicgirl Diagnostic Chat",
              sub_fr: "Parle-moi de tes cheveux — réponses expertes instantanées.",
              sub_en: "Talk to me about your hair — instant expert answers.",
              url: "https://selar.com/schicchat",
            },
            {
              id: "premium-fr", on: true, lang: "both", style: "card", icon: "💧",
              title_fr: "Pourquoi tes cheveux restent secs?", title_en: "Why does your hair stay dry?",
              sub_fr: "Je vais t'aider à comprendre pourquoi tes cheveux crépus restent secs.",
              sub_en: "I'll help you understand why your curly hair stays dry.",
              url: "https://selar.com/hydracheck",
            },
            {
              id: "consultation", on: true, lang: "both", style: "card", icon: "📅", badge: "",
              title_fr: "Consultation Capillaire", title_en: "Hair Consultation",
              sub_fr: "Réserve ta consultation personnalisée avec Schicgirl.",
              sub_en: "Book your personalised consultation with Schicgirl.",
              url: "https://schicgirl.me/consultation",
            },
          ],
        },
        amazon: {
          on: true,
          label_fr: "Mes Sélections", label_en: "My Curated Picks",
          items: [
            {
              id: "amazon-shop", on: true, img: "", emoji: "🛍️",
              eyebrow_fr: "Boutique Amazon", eyebrow_en: "Amazon Storefront",
              name_fr: "Tous mes coups de cœur", name_en: "All My Picks",
              desc_fr: "Toutes mes recommandations capillaires.",
              desc_en: "Browse every product I trust for natural hair.",
              url: "https://www.amazon.com/shop/schicgirl", cta_fr: "Voir →", cta_en: "Shop →",
            },
            {
              id: "auntjackies-baby", on: true, img: "assets/baby_curls_cream.webp", emoji: "🧴",
              eyebrow_fr: "Enfants · Boucles", eyebrow_en: "Kids · Curl Care",
              name_fr: "Aunt Jackie's Baby Curls", name_en: "Aunt Jackie's Baby Curls",
              desc_fr: "Crème douce pour définir les boucles des enfants.",
              desc_en: "Gentle curl-defining cream for little ones.",
              url: "https://amzn.to/491lO7A", cta_fr: "Voir →", cta_en: "Get it →",
            },
            {
              id: "auntjackies-bundle", on: true, img: "assets/amazon.webp", emoji: "📦",
              eyebrow_fr: "Boucles & Coils", eyebrow_en: "Curls & Coils",
              name_fr: "Aunt Jackie's Bundle", name_en: "Aunt Jackie's Bundle",
              desc_fr: "Le système complet soin boucles & coils.",
              desc_en: "The full curl & coil care system in one set.",
              url: "https://amzn.to/3OkUfzm", cta_fr: "Voir →", cta_en: "Get it →",
            },
            {
              id: "amazon-minisite", on: true, emoji: "🛍️",
              eyebrow_fr: "Boutique Amazon", eyebrow_en: "Amazon Storefront",
              name_fr: "Produits selon tes cheveux", name_en: "Products based on your hair",
              desc_fr: "Sélection complète Amazon — produits que je recommande vraiment.",
              desc_en: "Full Amazon selection — products I personally recommend.",
              url: "https://schicgirl.me/products", cta_fr: "Voir →", cta_en: "Shop →",
            },
          ],
        },
        testimonials: {
          on: true,
          label_fr: "Résultats Réels", label_en: "Real Results",
          rating: "5,0",
          reviews: "",
          items: [
            { id: "t1", on: true, stars: 5, author: "Sophie C.",
              text_fr: "Cette routine a transformé mes boucles ! Enfin des cheveux doux.",
              text_en: "This routine transformed my curls! Soft, hydrated hair at last." },
            { id: "t2", on: true, stars: 5, author: "Miriam L.",
              text_fr: "Des conseils personnalisés qui marchent vraiment. Mes cheveux n'ont jamais été aussi beaux.",
              text_en: "Personalised advice that actually works. My hair has never been better." },
            { id: "t3", on: true, stars: 5, author: "Anita P.",
              text_fr: "Outils révolutionnaires. Mes cheveux naturels s'épanouissent !",
              text_en: "Game-changing tools. My natural hair is thriving!" },
            { id: "t4", on: true, stars: 5, author: "Fatoumata D.",
              text_fr: "J'ai enfin compris ma porosité. Tout fait sens maintenant !",
              text_en: "Finally understood my porosity. Everything clicked!" },
            { id: "t5", on: true, stars: 5, author: "Awa K.",
              text_fr: "Première fois que ma routine tient toute la semaine. Merci Schicgirl !",
              text_en: "First time my routine holds all week. Thank you Schicgirl!" },
            { id: "t6", on: true, stars: 5, author: "Khadija B.",
              text_fr: "Mes longueurs ne cassent plus. J'ai retrouvé confiance en mes cheveux.",
              text_en: "My ends stopped breaking. I've got my confidence back." },
            { id: "t7", on: true, stars: 5, author: "Aïcha N.",
              text_fr: "Des explications claires, et en français ! Enfin quelqu'un qui comprend nos cheveux.",
              text_en: "Clear explanations, and in French! Finally someone who understands our hair." },
          ],
        },
        gallery: {
          on: true,
          label_fr: "Comprends tes cheveux", label_en: "Understand your hair",
          items: [
            { id: "g1", on: true, img: "assets/gallery-types.svg", cap_fr: "", cap_en: "" },
            { id: "g2", on: true, img: "assets/gallery-porosity.svg", cap_fr: "", cap_en: "" },
            { id: "g3", on: true, img: "assets/gallery-test.svg", cap_fr: "", cap_en: "" },
            { id: "g4", on: true, img: "assets/gallery-routine.svg", cap_fr: "", cap_en: "" },
            { id: "g5", on: true, img: "assets/gallery-loc.svg", cap_fr: "", cap_en: "" },
            { id: "g6", on: true, img: "assets/gallery-invite.svg", cap_fr: "", cap_en: "" },
          ],
        },
        social: {
          on: true,
          label_fr: "Me Retrouver", label_en: "Connect",
          items: [
            { id: "facebook", on: true, icon: "📘", label_fr: "Facebook", label_en: "Facebook",
              sub_fr: "Conseils & coulisses", sub_en: "Daily tips & real talk",
              url: "https://www.facebook.com/schicgirl" },
            { id: "email", on: true, icon: "✉️", label_fr: "M'Écrire", label_en: "Email Me",
              sub_fr: "Collabs & support", sub_en: "Collabs & support",
              url: "mailto:contacte.schicgirl@gmail.com" },
          ],
        },
        footer: {
          logo_show: true,
          brand: "Schicgirl",
          disc_fr: "En tant qu'associée Amazon, je gagne des revenus grâce aux achats éligibles.<br/>contacte.schicgirl@gmail.com",
          disc_en: "As an Amazon Associate I earn from qualifying purchases.<br/>contacte.schicgirl@gmail.com",
        },
      };
      let SCHICGIRL_LANG = "fr";

      /* ═══════════════════════════════════════════════════════════
         AVIS CLIENTS EN LIGNE (Supabase)
         Pour que les avis laissés par les clientes apparaissent ici
         (sur tous les navigateurs), remplace les 2 valeurs ci-dessous
         par celles de ton projet Supabase. Voir review.html pour le
         SQL de création de la table.
         Tant que ce n'est pas configuré, seuls les avis manuels
         (ci-dessus dans l'admin) s'affichent — rien ne casse.
         ═══════════════════════════════════════════════════════════ */
      const SCHICGIRL_SUPABASE_URL = "https://ouwzbqmmtbxqtffghncg.supabase.co"; // <-- à remplacer
      const SCHICGIRL_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91d3picW1tdGJ4cXRmZmdobmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwOTU4NDMsImV4cCI6MjA5NjY3MTg0M30.UuRoYPPDL18-J9WyFK5kpFhRguq_9aDeacXDRhdkmD8"; // <-- à remplacer (clé "anon public")
      const SCHICGIRL_REVIEWS_TABLE = "reviews";
      const SCHICGIRL_REVIEW_PAGE_URL = "https://schicgirl.me/review"; // page "laisser un avis"
      let SCHICGIRL_REMOTE_REVIEWS = [];
      function schicgirlSupabaseReady() {
        return (
          SCHICGIRL_SUPABASE_URL.indexOf("YOUR-") === -1 &&
          SCHICGIRL_SUPABASE_KEY.indexOf("YOUR-") === -1
        );
      }
      async function schicgirlFetchReviews() {
        if (!schicgirlSupabaseReady()) return;
        try {
          const url =
            SCHICGIRL_SUPABASE_URL +
            "/rest/v1/" +
            SCHICGIRL_REVIEWS_TABLE +
            "?select=author,text,rating,lang,created_at,photo_url&approved=eq.true&order=created_at.desc";
          const r = await fetch(url, {
            headers: {
              apikey: SCHICGIRL_SUPABASE_KEY,
              Authorization: "Bearer " + SCHICGIRL_SUPABASE_KEY,
            },
          });
          if (!r.ok) return;
          const rows = await r.json();
          if (Array.isArray(rows)) {
            SCHICGIRL_REMOTE_REVIEWS = rows;
            schicgirlRender();
          }
        } catch (e) {}
      }
      // Vrai logo Facebook (remplace l'emoji 📘) — couleur de marque Facebook
      const SCHICGIRL_FB_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" fill="#1877F2" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6 4.39 10.97 10.13 11.87v-8.4H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.47h-2.8v8.4C19.61 23.04 24 18.07 24 12.07Z"/></svg>`;
      function schicgirlLoadSite() {
        let s = null;
        try { s = JSON.parse(localStorage.getItem(SCHICGIRL_SITE_KEY) || "null"); } catch (e) {}
        if (!s) return JSON.parse(JSON.stringify(DEFAULT_SITE));
        return schicgirlDeepMerge(JSON.parse(JSON.stringify(DEFAULT_SITE)), s);
      }
      function schicgirlDeepMerge(base, over) {
        if (Array.isArray(over)) return over;
        if (over && typeof over === "object" && !Array.isArray(over)) {
          const out = { ...base };
          for (const k in over) {
            out[k] = k in base && typeof base[k] === "object" && base[k] !== null && !Array.isArray(base[k])
              ? schicgirlDeepMerge(base[k], over[k]) : over[k];
          }
          return out;
        }
        return over;
      }
      let SCHICGIRL_SITE = schicgirlLoadSite();
      function schicgirlMigrateImagePaths() {
        let changed = false;
        const fix = (p) => {
          if (!p || typeof p !== "string") return p;
          if (/^(https?:|data:|mailto:|tel:|\/)/i.test(p)) return p;
          if (p.startsWith("assets/")) return p;
          changed = true;
          return "assets/" + p;
        };
        if (SCHICGIRL_SITE.brand) SCHICGIRL_SITE.brand.logo = fix(SCHICGIRL_SITE.brand.logo);
        if (SCHICGIRL_SITE.hero && Array.isArray(SCHICGIRL_SITE.hero.icons)) {
          SCHICGIRL_SITE.hero.icons = SCHICGIRL_SITE.hero.icons.map(fix);
        }
        if (SCHICGIRL_SITE.shop) SCHICGIRL_SITE.shop.img = fix(SCHICGIRL_SITE.shop.img);
        if (SCHICGIRL_SITE.shop && Array.isArray(SCHICGIRL_SITE.shop.items)) {
          SCHICGIRL_SITE.shop.items.forEach((it) => {
            it.img = fix(it.img);
            it.img_fr = fix(it.img_fr);
            it.img_en = fix(it.img_en);
          });
        }
        if (SCHICGIRL_SITE.amazon && Array.isArray(SCHICGIRL_SITE.amazon.items)) {
          SCHICGIRL_SITE.amazon.items.forEach((it) => { it.img = fix(it.img); });
        }
        if (SCHICGIRL_SITE.gallery && Array.isArray(SCHICGIRL_SITE.gallery.items)) {
          SCHICGIRL_SITE.gallery.items.forEach((it) => { it.img = fix(it.img); });
        }
        if (changed) {
          try { localStorage.setItem(SCHICGIRL_SITE_KEY, JSON.stringify(SCHICGIRL_SITE)); } catch (e) {}
        }
      }
      schicgirlMigrateImagePaths();
      function schicgirlEsc(s) {
        return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
      }
      function schicgirlSafeUrl(u) {
        const s = String(u || "").trim();
        if (!s) return "#";
        if (s.startsWith("#") || s.startsWith("/") || s.startsWith("?")) return s;
        if (/^(https?:|mailto:|tel:)/i.test(s)) return s;
        // Allow safe relative links (e.g. hydratee.html, planner.html?lang=en);
        // block scheme-based URLs like javascript: or data:
        if (!/^[a-z][a-z0-9+.\-]*:/i.test(s)) return s;
        return "#";
      }
      function schicgirlTx(o, key) {
        return o[key + "_" + SCHICGIRL_LANG] || o[key + "_fr"] || o[key] || "";
      }
      /* Rendu — ordre = échelle de conversion (diagnostic gratuit →
         cadeaux → preuve → galerie → boutique premium). */
      function schicgirlRender() {
        const w = document.getElementById("schicgirlWrap");
        schicgirlStepCount = 0;
        const ladder =
          schicgirlRenderGifts() +
          schicgirlRenderTools() +
          schicgirlRenderTestimonials() +
          schicgirlRenderGallery() +
          schicgirlRenderShop();
        w.innerHTML =
          schicgirlRenderHero() +
          ladder +
          schicgirlRenderAmazon() +
          schicgirlRenderSocial() +
          schicgirlRenderFooter();
        const wm = document.getElementById("schicgirlWatermark");
        if (SCHICGIRL_SITE.brand.watermark) {
          wm.textContent = SCHICGIRL_SITE.brand.watermark;
          wm.style.display = "";
        } else {
          wm.style.display = "none";
        }
      }
      let schicgirlStepCount = 0;
      function schicgirlStepLabel(eyebrow, name) {
        schicgirlStepCount++;
        const n = String(schicgirlStepCount).padStart(2, "0");
        return `<div class="schicgirl-step-label">
      <div class="schicgirl-step-num">${n}</div>
      <div class="schicgirl-step-titles">
        ${eyebrow ? `<div class="schicgirl-step-eyebrow">${schicgirlEsc(eyebrow)}</div>` : ""}
        <div class="schicgirl-step-name">${schicgirlEsc(name)}</div>
      </div>
    </div>`;
      }
      function schicgirlRenderHero() {
        const b = SCHICGIRL_SITE.brand, h = SCHICGIRL_SITE.hero;
        const stats = (h.stats || []).filter((s) => s.on).map(
          (s) => `<div class="schicgirl-stat-pill"><div class="schicgirl-stat-dot"></div><span>${schicgirlEsc(schicgirlTx(s, "text"))}</span></div>`
        ).join("");
        const firstChar = schicgirlEsc((b.name_pre || "S").charAt(0));
        const logo = b.logo
          ? `<img class="schicgirl-logo-img" src="${schicgirlEsc(b.logo)}" alt="${schicgirlEsc(b.name_pre + b.name_acc)}" onerror="var p=this.parentElement;p.innerHTML='<div class=&quot;schicgirl-logo-fb&quot;>${firstChar}</div>'"/>`
          : `<div class="schicgirl-logo-fb">${firstChar}</div>`;
        const proof = schicgirlTx(h, "proof");
        const proofHtml = proof ? `<div class="schicgirl-proof-badge">${schicgirlEsc(proof)}</div>` : "";
        const tBlock = SCHICGIRL_SITE.testimonials || {};
        const tItems = (tBlock.items || []).filter((i) => i.on);
        let trustHtml = "";
        if (tBlock.on && tItems.length) {
          const reviewWord = SCHICGIRL_LANG === "fr" ? "avis" : "reviews";
          const rating = (tBlock.rating !== undefined && String(tBlock.rating).trim() !== "") ? tBlock.rating : "5,0";
          const reviewsCount = (tBlock.reviews !== undefined && tBlock.reviews !== null && String(tBlock.reviews).trim() !== "") ? tBlock.reviews : (tItems.length + (SCHICGIRL_REMOTE_REVIEWS ? SCHICGIRL_REMOTE_REVIEWS.length : 0));
          trustHtml = `<div class="schicgirl-trust">
      <div class="schicgirl-trust-stars"><span class="stars">★★★★★</span> ${schicgirlEsc(rating)}</div>
      <div class="schicgirl-trust-divider"></div>
      <div class="schicgirl-trust-stars">${schicgirlEsc(reviewsCount)} ${reviewWord}</div>
    </div>`;
        }
        return `
  <div class="schicgirl-hero">
    <div class="schicgirl-logo-ring">${logo}</div>
    ${proofHtml}
    <h1 class="schicgirl-brand-name">${schicgirlEsc(b.name_pre)}<span>${schicgirlEsc(b.name_acc)}</span></h1>
    <p class="schicgirl-brand-tagline">${schicgirlEsc(schicgirlTx(b, "tagline"))}</p>
    ${stats ? `<div class="schicgirl-stat-row">${stats}</div>` : ""}
    ${trustHtml}
  </div>`;
      }
      function schicgirlRenderGifts() {
        const g = SCHICGIRL_SITE.gifts;
        if (!g || !g.on) return "";
        const items = (g.items || []).filter((i) => i.on).map((i) => {
          const url = SCHICGIRL_LANG === "fr" ? i.url_fr || i.url_en : i.url_en || i.url_fr;
          const ctaText = SCHICGIRL_LANG === "fr" ? "Télécharger" : "Download";
          return `<a href="${schicgirlEsc(schicgirlSafeUrl(url))}" class="schicgirl-gift" target="_blank" rel="noopener noreferrer" onclick="schicgirlTrackClick('gift-${i.id}-${SCHICGIRL_LANG}')">
      <div class="schicgirl-gift-icon">${schicgirlEsc(i.emoji || "🎁")}</div>
      <div class="schicgirl-gift-body">
        <div class="schicgirl-gift-label">${schicgirlEsc(schicgirlTx(i, "label"))}</div>
        <div class="schicgirl-gift-title">${schicgirlEsc(schicgirlTx(i, "title"))}</div>
        <div class="schicgirl-gift-sub">${schicgirlEsc(schicgirlTx(i, "sub"))}</div>
      </div>
      <span class="schicgirl-gift-cta">${schicgirlEsc(ctaText)} ↓</span>
    </a>`;
        }).join("");
        if (!items) return "";
        const eb = SCHICGIRL_LANG === "fr" ? "Commence ici · 100% Gratuit" : "Start here · 100% Free";
        return `<div class="schicgirl-section schicgirl-step">${schicgirlStepLabel(eb, schicgirlTx(g, "label"))}${items}</div>`;
      }
      function schicgirlRenderShop() {
        const s = SCHICGIRL_SITE.shop;
        if (!s || !s.on) return "";
        const eb = SCHICGIRL_LANG === "fr" ? "Passe au niveau · Premium" : "Go deeper · Premium";
        const ebooks = (s.items || []).filter((i) => i.on).map((i) => {
          const imgSrc = schicgirlTx(i, "img");
          const cover = imgSrc
            ? `<img src="${schicgirlEsc(imgSrc)}" alt="${schicgirlEsc(schicgirlTx(i, "title"))}" loading="lazy" onerror="var p=this.parentElement;p.innerHTML='📖'"/>`
            : "📖";
          const badge = schicgirlTx(i, "badge");
          const badgeHtml = badge ? `<span class="schicgirl-ebook-badge">${schicgirlEsc(badge)}</span>` : "";
          const price = schicgirlTx(i, "price");
          const cfa = (SCHICGIRL_LANG === "fr" && i.price_cfa) ? i.price_cfa : "";
          const ctaTxt = SCHICGIRL_LANG === "fr" ? "Découvrir" : "Discover";
          const dest = schicgirlTx(i, "page") || schicgirlTx(i, "url");
          return `<a href="${schicgirlEsc(schicgirlSafeUrl(dest))}" class="schicgirl-ebook" onclick="schicgirlTrackClick('ebook-${schicgirlEsc(i.id)}')">
      <div class="schicgirl-ebook-cover">${cover}${badgeHtml}</div>
      <div class="schicgirl-ebook-body">
        <div class="schicgirl-ebook-title">${schicgirlEsc(schicgirlTx(i, "title"))}</div>
        <div class="schicgirl-ebook-desc">${schicgirlEsc(schicgirlTx(i, "desc"))}</div>
        <div class="schicgirl-ebook-foot">
          <div class="schicgirl-ebook-priceblock">
            ${price ? `<span class="schicgirl-ebook-price">${schicgirlEsc(price)}</span>` : ""}
            ${cfa ? `<span class="schicgirl-ebook-cfa">${schicgirlEsc(cfa)}</span>` : ""}
          </div>
          <span class="schicgirl-ebook-cta">${schicgirlEsc(ctaTxt)} →</span>
        </div>
      </div>
    </a>`;
        }).join("");
        if (!ebooks) return "";
        const eyebrow = schicgirlTx(s, "eyebrow");
        const desc = schicgirlTx(s, "desc");
        const hint = SCHICGIRL_LANG === "fr"
          ? `<span class="schicgirl-gallery-hint"><span class="arrow">←</span> Glisse pour voir plus</span>`
          : `<span class="schicgirl-gallery-hint"><span class="arrow">←</span> Swipe to see more</span>`;
        const seeAll = s.url
          ? `<div style="text-align:center;margin-top:12px"><a href="${schicgirlEsc(schicgirlSafeUrl(s.url))}" target="_blank" rel="noopener noreferrer" class="schicgirl-review-cta" onclick="schicgirlTrackClick('${schicgirlEsc(s.track || "selar-shop")}')">${schicgirlEsc(schicgirlTx(s, "cta"))}</a></div>`
          : "";
        return `<div class="schicgirl-section schicgirl-step">
    ${schicgirlStepLabel(eb, schicgirlTx(s, "label"))}
    ${eyebrow || desc ? `<div class="schicgirl-ebook-intro">${eyebrow ? `<span class="schicgirl-ebook-eyebrow">${schicgirlEsc(eyebrow)}</span>` : ""}${desc ? `<p class="schicgirl-ebook-lead">${schicgirlEsc(desc)}</p>` : ""}</div>` : ""}
    <div class="schicgirl-ebook-scroll">${ebooks}</div>
    <div style="text-align:right;padding:2px 4px 0">${hint}</div>
    ${seeAll}
  </div>`;
      }
      function schicgirlRenderTools() {
        const t = SCHICGIRL_SITE.tools;
        if (!t || !t.on) return "";
        const items = (t.items || []).filter((i) => i.on && (i.lang === "both" || i.lang === SCHICGIRL_LANG)).map((i) => {
          const noLink = !i.url || !String(i.url).trim();
          const ctaText = SCHICGIRL_LANG === "fr" ? i.cta_fr || "Découvrir" : i.cta_en || "Open";
          if (i.style === "feature") {
            const open = noLink
              ? `<div class="schicgirl-feature is-soon" aria-disabled="true">`
              : `<a href="${schicgirlEsc(schicgirlSafeUrl(i.url))}" class="schicgirl-feature" target="_blank" rel="noopener noreferrer" onclick="schicgirlTrackClick('${schicgirlEsc(i.id)}')">`;
            const close = noLink ? `</div>` : `</a>`;
            const ctaHtml = noLink
              ? `<span class="schicgirl-feature-cta" style="opacity:.6">${SCHICGIRL_LANG === "fr" ? "Bientôt" : "Soon"}</span>`
              : `<span class="schicgirl-feature-cta">${schicgirlEsc(ctaText)} →</span>`;
            return `${open}
        <div class="schicgirl-feature-inner">
          <div class="schicgirl-feature-icon">${schicgirlEsc(i.icon || "💬")}</div>
          <div class="schicgirl-feature-text">
            ${i.label_fr || i.label_en ? `<div class="schicgirl-feature-label">${schicgirlEsc(schicgirlTx(i, "label"))}</div>` : ""}
            <div class="schicgirl-feature-title">${schicgirlEsc(schicgirlTx(i, "title"))}</div>
            <div class="schicgirl-feature-sub">${schicgirlEsc(schicgirlTx(i, "sub"))}</div>
          </div>
          ${ctaHtml}
        </div>
      ${close}`;
          }
          const badge = i.badge ? `<span class="schicgirl-badge">${schicgirlEsc(i.badge)}</span>` : "";
          return `<a href="${schicgirlEsc(schicgirlSafeUrl(i.url))}" class="schicgirl-tool" target="_blank" rel="noopener noreferrer" onclick="schicgirlTrackClick('${schicgirlEsc(i.id)}')">
      <div class="schicgirl-tool-icon">${schicgirlEsc(i.icon || "🔗")}</div>
      <div class="schicgirl-tool-body">
        <div class="schicgirl-tool-title">${schicgirlEsc(schicgirlTx(i, "title"))}</div>
        <div class="schicgirl-tool-sub">${schicgirlEsc(schicgirlTx(i, "sub"))}</div>
      </div>
      <div class="schicgirl-tool-right">${badge}<span class="schicgirl-tool-cta">${schicgirlEsc(ctaText)} →</span></div>
    </a>`;
        }).join("");
        if (!items) return "";
        const eb = SCHICGIRL_LANG === "fr" ? "Va plus loin · Premium" : "Go further · Premium";
        return `<div class="schicgirl-section schicgirl-step">${schicgirlStepLabel(eb, schicgirlTx(t, "label"))}${items}</div>`;
      }
      function schicgirlRenderAmazon() {
        const a = SCHICGIRL_SITE.amazon;
        if (!a || !a.on) return "";
        const items = (a.items || []).filter((i) => i.on).map((i) => {
          const emoji = i.emoji || "";
          const fb = schicgirlEsc(emoji);
          let wrap = "";
          if (i.img) {
            const onerr = emoji ? `var p=this.parentElement;p.innerHTML='${fb}'` : `this.parentElement.style.display='none'`;
            wrap = `<div class="schicgirl-pick-img"><img src="${schicgirlEsc(i.img)}" alt="" onerror="${onerr}"/></div>`;
          } else if (emoji) {
            wrap = `<div class="schicgirl-pick-img">${fb}</div>`;
          }
          return `<a href="${schicgirlEsc(schicgirlSafeUrl(i.url))}" class="schicgirl-pick" target="_blank" rel="noopener noreferrer" onclick="schicgirlTrackClick('${schicgirlEsc(i.id)}')">
      ${wrap}
      <div class="schicgirl-pick-body">
        <div class="schicgirl-pick-eyebrow">${schicgirlEsc(schicgirlTx(i, "eyebrow"))}</div>
        <div class="schicgirl-pick-name">${schicgirlEsc(schicgirlTx(i, "name"))}</div>
        <div class="schicgirl-pick-desc">${schicgirlEsc(schicgirlTx(i, "desc"))}</div>
      </div>
      <div class="schicgirl-pick-cta">${schicgirlEsc(schicgirlTx(i, "cta"))}</div>
    </a>`;
        }).join("");
        if (!items) return "";
        return `<div class="schicgirl-section"><div class="schicgirl-section-label">✦ ${schicgirlEsc(schicgirlTx(a, "label"))}</div><div class="schicgirl-picks">${items}</div></div>`;
      }
      function schicgirlRenderTestimonials() {
        const t = SCHICGIRL_SITE.testimonials;
        if (!t || !t.on) return "";
        const card = (stars, text, author, photo) => {
          const photoHtml = photo
            ? `<img class="schicgirl-testi-photo" src="${schicgirlEsc(photo)}" alt="${schicgirlEsc(author || "")}" loading="lazy" onerror="this.style.display='none'"/>`
            : "";
          return `
    <div class="schicgirl-testi">
      ${photoHtml}
      <div class="schicgirl-testi-stars">${"★".repeat(Math.max(0, Math.min(5, stars || 5)))}</div>
      <p class="schicgirl-testi-text">${schicgirlEsc(text)}</p>
      <div class="schicgirl-testi-author">— ${schicgirlEsc(author || "")}</div>
    </div>`;
        };
        const staticItems = (t.items || [])
          .filter((i) => i.on)
          .map((i) => card(i.stars, schicgirlTx(i, "text"), i.author, i.photo))
          .join("");
        // Avis clients en ligne (Supabase) — affichés après les avis manuels
        const remoteItems = (SCHICGIRL_REMOTE_REVIEWS || [])
          .map((r) => card(r.rating, r.text, r.author, r.photo_url))
          .join("");
        const items = staticItems + remoteItems;
        if (!items) return "";
        const eb = SCHICGIRL_LANG === "fr" ? "La preuve · Vraies clientes" : "The proof · Real clients";
        const ctaTxt = SCHICGIRL_LANG === "fr" ? "Laisse ton avis ⭐" : "Leave a review ⭐";
        const cta = `<div style="text-align:center;margin-top:14px">
      <a href="${schicgirlEsc(schicgirlSafeUrl(SCHICGIRL_REVIEW_PAGE_URL))}" target="_blank" rel="noopener noreferrer" class="schicgirl-review-cta" onclick="schicgirlTrackClick('leave-review')">${ctaTxt}</a>
    </div>`;
        return `<div class="schicgirl-section schicgirl-step">${schicgirlStepLabel(eb, schicgirlTx(t, "label"))}<div class="schicgirl-testi-scroll">${items}</div>${cta}</div>`;
      }
      function schicgirlRenderGallery() {
        const g = SCHICGIRL_SITE.gallery;
        if (!g || !g.on) return "";
        const items = (g.items || []).filter((i) => i.on).map((i) => {
          const cap = schicgirlTx(i, "cap");
          const capHtml = cap ? `<div class="schicgirl-gallery-cap">${schicgirlEsc(cap)}</div>` : "";
          const media = i.img
            ? `<img src="${schicgirlEsc(i.img)}" alt="${schicgirlEsc(cap)}" loading="lazy" onerror="this.parentElement.querySelector('.schicgirl-gallery-ph')?.style.removeProperty('display');this.style.display='none'"/><div class="schicgirl-gallery-ph" style="display:none">🖼️</div>`
            : `<div class="schicgirl-gallery-ph">🖼️</div>`;
          return `<div class="schicgirl-gallery-item">${media}${capHtml}</div>`;
        }).join("");
        if (!items) return "";
        const hint = SCHICGIRL_LANG === "fr"
          ? `<span class="schicgirl-gallery-hint"><span class="arrow">←</span> Glisse pour voir plus</span>`
          : `<span class="schicgirl-gallery-hint"><span class="arrow">←</span> Swipe to see more</span>`;
        return `<div class="schicgirl-section">
      <div class="schicgirl-section-label">✦ ${schicgirlEsc(schicgirlTx(g, "label"))}</div>
      <div class="schicgirl-gallery-scroll">${items}</div>
      <div style="text-align:right;padding:2px 4px 0">${hint}</div>
    </div>`;
      }
      function schicgirlRenderSocial() {
        const s = SCHICGIRL_SITE.social;
        if (!s || !s.on) return "";
        const items = (s.items || []).filter((i) => i.on).map((i) => {
          const iconHtml = i.id === "facebook"
            ? `<span class="schicgirl-social-icon">${SCHICGIRL_FB_SVG}</span>`
            : (i.icon ? `<span class="schicgirl-social-icon">${schicgirlEsc(i.icon)}</span>` : "");
          return `
    <a href="${schicgirlEsc(schicgirlSafeUrl(i.url))}" class="schicgirl-social" target="_blank" rel="noopener noreferrer" onclick="schicgirlTrackClick('${schicgirlEsc(i.id)}')">
      ${iconHtml}
      <div>
        <div class="schicgirl-social-label">${schicgirlEsc(schicgirlTx(i, "label"))}</div>
        <div class="schicgirl-social-sub">${schicgirlEsc(schicgirlTx(i, "sub"))}</div>
      </div>
    </a>`;
        }).join("");
        if (!items) return "";
        return `<div class="schicgirl-section"><div class="schicgirl-section-label">✦ ${schicgirlEsc(schicgirlTx(s, "label"))}</div><div class="schicgirl-social-row">${items}</div></div>`;
      }
      function schicgirlRenderFooter() {
        const f = SCHICGIRL_SITE.footer, b = SCHICGIRL_SITE.brand;
        const logo = f.logo_show && b.logo
          ? `<img src="${schicgirlEsc(b.logo)}" alt="" style="width:36px;height:36px;border-radius:50%;object-fit:cover;margin:0 auto 10px;display:block;opacity:.7;" onerror="this.style.display='none'"/>`
          : "";
        const isFr = SCHICGIRL_LANG === "fr";
        const navItems = [
          ["/fr/a-propos/", isFr ? "À propos" : "About"],
          ["/fr/blog/", isFr ? "Blog" : "Blog"],
          ["/fr/contact/", isFr ? "Contact" : "Contact"],
          ["/fr/confidentialite/", isFr ? "Confidentialité" : "Privacy"],
          ["/fr/conditions/", isFr ? "Conditions" : "Terms"],
        ];
        const nav = navItems
          .map((it, i) => `<a href="${it[0]}" style="color:var(--ink-soft);text-decoration:none;font-weight:600;padding:0 10px;${i < navItems.length - 1 ? "border-right:1px solid var(--stroke);" : ""}">${it[1]}</a>`)
          .join("");
        return `
    <div class="schicgirl-footer">
      <div class="schicgirl-footer-divider"></div>
      ${logo}
      <strong>${schicgirlEsc(f.brand || "Schicgirl")}</strong><br/>
      <span>${schicgirlTx(f, "disc")}</span>
      <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px 0;margin-top:14px;">${nav}</div>
    </div>`;
      }
      function schicgirlSetLang(lang) {
        SCHICGIRL_LANG = lang;
        document.getElementById("schicgirlBtnEn").classList.toggle("is-active", lang === "en");
        document.getElementById("schicgirlBtnFr").classList.toggle("is-active", lang === "fr");
        document.documentElement.lang = lang;
        try { localStorage.setItem("sg_lang", lang); } catch (e) {}
        schicgirlRender();
      }
      function schicgirlGetData() {
        try { return JSON.parse(localStorage.getItem(SCHICGIRL_ANALYTICS_KEY) || '{"visits":[],"clicks":[]}'); }
        catch (e) { return { visits: [], clicks: [] }; }
      }
      function schicgirlSaveData(d) {
        try { localStorage.setItem(SCHICGIRL_ANALYTICS_KEY, JSON.stringify(d)); } catch (e) {}
      }
      function schicgirlTrackClick(value) {
        const d = schicgirlGetData();
        d.clicks.unshift({ ts: Date.now(), value });
        if (d.clicks.length > SCHICGIRL_MAX_CLICKS) d.clicks.length = SCHICGIRL_MAX_CLICKS;
        schicgirlSaveData(d);
      }
      function schicgirlTrackVisit() {
        const d = schicgirlGetData();
        d.visits.unshift({
          ts: Date.now(), lang: SCHICGIRL_LANG, ref: document.referrer,
          mob: /Mobi|Android/i.test(navigator.userAgent),
          tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
        });
        if (d.visits.length > SCHICGIRL_MAX_VISITS) d.visits.length = SCHICGIRL_MAX_VISITS;
        schicgirlSaveData(d);
      }
      document.addEventListener("dragstart", (e) => { if (e.target.tagName === "IMG") e.preventDefault(); });
      window.addEventListener("storage", (e) => {
        if (e.key === SCHICGIRL_SITE_KEY) { SCHICGIRL_SITE = schicgirlLoadSite(); schicgirlRender(); }
      });
      const schicgirlSavedLang = localStorage.getItem("sg_lang");
      if (schicgirlSavedLang === "fr" || schicgirlSavedLang === "en") { SCHICGIRL_LANG = schicgirlSavedLang; }
      document.getElementById("schicgirlBtnEn").classList.toggle("is-active", SCHICGIRL_LANG === "en");
      document.getElementById("schicgirlBtnFr").classList.toggle("is-active", SCHICGIRL_LANG === "fr");
      document.documentElement.lang = SCHICGIRL_LANG;
      schicgirlRender();
      schicgirlTrackVisit();
      schicgirlFetchReviews();
      // Lightbox : agrandir une carte de la galerie au clic
      function schicgirlCloseLightbox(e) {
        if (e) e.stopPropagation();
        document.getElementById("schicgirlLightbox").classList.remove("is-open");
      }
      document.addEventListener("click", (e) => {
        const img = e.target.closest(".schicgirl-gallery-item img");
        if (!img) return;
        document.getElementById("schicgirlLightboxImg").src = img.getAttribute("src");
        document.getElementById("schicgirlLightbox").classList.add("is-open");
      });
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") schicgirlCloseLightbox(); });
      console.log("%c⚠ Schicgirl — Protected Content", "color:#c9934a;font-size:18px;font-weight:bold;font-family:Georgia,serif");
      console.log("%c© 2024–2026 Schicgirl. All rights reserved.", "color:#a06d28;font-size:12px");
      console.log("%cReproduction or redistribution of this source is strictly prohibited.", "color:#a06d28;font-size:11px");
      console.log("%cFor licensing inquiries: contacte.schicgirl@gmail.com", "color:#a06d28;font-size:11px");
