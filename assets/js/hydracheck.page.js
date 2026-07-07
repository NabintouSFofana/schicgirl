/* ──────────────────────────────────────────────
   CONFIG
──────────────────────────────────────────────── */
      const CONFIG = {
        guideLink: "https://selar.com/hydratation-cheveux-crepus",
        routineLink: "https://selar.com/70t3ur414k",
        adminStorageKey: "schicgirl_hydration_leads",
      };

      /* ──────────────────────────────────────────────
   STRINGS — all UI + conversation copy
──────────────────────────────────────────────── */
      const STR = {
        fr: {
          /* Hero */
          heroEyebrow: "Inspiré du guide hydratation",
          heroTitle: "Pourquoi tes cheveux restent secs ?",
          heroDesc:
            "Cette mini-application analyse ton hydratation, ta rétention, ta porosité, l'épaisseur de tes cheveux, ta routine et les erreurs possibles. Le but : comprendre si tes cheveux manquent d'eau, de scellage, de nettoyage, de légèreté ou d'une routine mieux adaptée.",
          m1: "Identifier le vrai blocage d'hydratation.",
          m2: "Recevoir une méthode simple : eau, soin, scellage, observation.",
          m3: "Ajuster selon porosité, épaisseur et climat.",
          m4: "Aller plus loin avec le guide ou une routine personnalisée.",
          inputPlaceholder: "Écris ta réponse ici…",
          sendBtn: "Envoyer",
          footer:
            "© 2026 Schicgirl™ — HydraCheck. Tous droits réservés. Reproduction interdite.",

          /* Conversation */
          welcome: "💧 Bienvenue dans HydraCheck de Schicgirl.",
          intro:
            "Je vais t'aider à comprendre pourquoi tes cheveux crépus restent secs : manque d'eau, mauvaise rétention, produits trop lourds, accumulation, porosité, pointes ou routine mal adaptée.\n\nComment souhaites-tu que je t'appelle ?",
          greeting: (name) =>
            `Ravie de te guider, ${name} 💛\n\nTu peux laisser ton email ou WhatsApp pour sauvegarder ce diagnostic, ou continuer sans contact.`,
          askCountry:
            "Dans quel pays vis-tu ? Le climat influence beaucoup la perte d'hydratation.",
          askClimate: "Ton climat actuel ressemble plutôt à quoi ?",
          askDryness:
            "Après un soin ou une hydratation, combien de temps tes cheveux restent-ils doux ?",
          askHydrationBasis:
            "Quand tu « hydrates », quelle est la première chose que tu mets sur tes cheveux ?",
          askOilOnly:
            "Utilises-tu souvent les huiles en pensant qu'elles hydratent seules ?",
          askSeal:
            "Après l'eau ou le leave-in, est-ce que tu scelles l'hydratation ?",
          askHeavy:
            "Tes produits donnent parfois un effet lourd, gras ou collant ?",
          askBuildup:
            "Même après tes soins, as-tu l'impression que tes cheveux sont chargés mais toujours secs ?",
          askPorosity: "Quelle est ta porosité ou ton observation avec l'eau ?",
          askThickness:
            "Tes mèches individuelles sont plutôt fines, moyennes ou épaisses ?",
          askFrequency:
            "À quelle fréquence hydrates-tu réellement tes cheveux ?",
          askOverHydration:
            "Tes cheveux deviennent-ils parfois mous, sans tenue ou trop souples après trop d'eau/soins ?",
          askEnds: "Comment sont tes pointes ?",
          askScalpDryness:
            "Et ton cuir chevelu — est-il sec ou a-t-il tendance à peler ?",
          askNight: "Protèges-tu tes cheveux la nuit ?",
          askRoutine: "Ta routine est-elle simple et régulière ?",
          askEmergency:
            "Actuellement, tes cheveux sont-ils en situation d'urgence : très secs, cassants, difficiles à coiffer ?",
          askHumectant:
            "Utilises-tu des produits à base de glycérine ou d'autres humectants — et ajustes-tu selon l'humidité de l'air ?\n\nLa glycérine attire l'eau de l'air quand il est humide, mais peut aspirer l'eau HORS de tes cheveux quand l'air est très sec.",
          askDeepMask:
            "En dehors de ton hydratation habituelle, à quelle fréquence fais-tu un vrai masque profond (pose de 20 min ou plus) ?",
          askMoistureProtein:
            "Quand tes cheveux sont mouillés, comment se sentent-ils ?",
          askWaterTemp:
            "À quelle température laves-tu et rinces-tu généralement tes cheveux ?",
          askAlkalineStyling:
            "Utilises-tu souvent des gels ou edge control à base d'alcool ou très alcalins pour coiffer ?",
          askClimateShift:
            "As-tu vécu un changement de climat ou de saison récemment (déménagement, hiver, saison sèche) sans ajuster ta routine ?",
          askPastAttempt:
            "As-tu déjà eu une méthode d'hydratation qui fonctionnait bien... puis qui a arrêté de marcher ?",
          askGoal: "Quel est ton objectif principal maintenant ?",
          diagIntro: (name) =>
            `${name}, ton diagnostic est prêt. Retiens ceci : hydrater ne veut pas dire saturer les cheveux de produits. Hydrater, c'est apporter l'eau, l'aider à rester, puis observer.`,

          /* Quick-reply labels */
          q: {
            skipContact: "Continuer sans contact",
            ciDivoire: "Côte d'Ivoire",
            france: "France",
            usa: "États-Unis",
            canada: "Canada",
            other: "Autre",
            hotDry: "Chaud et sec",
            humid: "Chaud et humide",
            cold: "Froid / hiver",
            variable: "Variable",
            under24: "Moins de 24h",
            d1_2: "1 à 2 jours",
            d3_4: "3 à 4 jours",
            week: "Presque toute la semaine",
            water: "Eau ou spray aqueux",
            leavein: "Leave-in / lait hydratant",
            oil: "Huile ou beurre directement",
            cream: "Crème riche sans eau avant",
            oilYes: "Oui, souvent",
            oilSometimes: "Parfois",
            oilNo: "Non, je sais que l'eau vient d'abord",
            sealLight: "Oui, avec une huile légère",
            sealRich: "Oui, avec crème/beurre",
            sealSometimes: "Parfois seulement",
            sealNo: "Non, jamais",
            heavyOften: "Oui, souvent",
            heavySometimes: "Parfois",
            heavyNo: "Non, ils restent légers",
            buildupHD: "Oui, lourds mais secs",
            buildupDull: "Ils sont ternes et difficiles à hydrater",
            buildupNo: "Non, pas vraiment",
            porosityLow: "Faible : l'eau reste en surface",
            porosityHigh: "Forte : l'eau entre vite mais ressort vite",
            porosityNormal: "Normale",
            porosityUnknown: "Je ne sais pas",
            thickFine: "Fines : elles se chargent vite",
            thickMed: "Moyennes",
            thickThick: "Épaisses : elles supportent plus de matière",
            thickUnknown: "Je ne sais pas",
            freqDaily: "Tous les jours",
            freq2_3: "2 à 3 fois/semaine",
            freqWeekly: "1 fois/semaine",
            freqRare: "Rarement / quand j'y pense",
            overYes: "Oui",
            overSometimes: "Parfois",
            overNo: "Non",
            endsDry: "Très sèches et rêches",
            endsSplit: "Fourchues / transparentes",
            endsOk: "Correctes",
            endsUnknown: "Je ne vérifie jamais",
            scalpDryYes: "Oui, sec et qui tire",
            scalpDryFlaky: "Oui, avec des petites peaux",
            scalpDryNo: "Non, cuir chevelu confortable",
            scalpDryOily: "Plutôt gras, pas sec",
            nightSatin: "Oui, bonnet/taie satin",
            nightSometimes: "Parfois",
            nightNo: "Non",
            routineStable: "Oui, claire et stable",
            routineUnstable: "Je change souvent",
            routineNone: "Je n'ai pas vraiment de routine",
            emergYes: "Oui, urgence sécheresse",
            emergMed: "Un peu",
            emergNo: "Non",
            humectAdjust: "Oui, j'ajuste selon l'humidité",
            humectAlways: "Oui, mais toujours pareil",
            humectNo: "Non, je n'utilise pas de glycérine",
            humectUnknown: "Je ne sais pas ce que c'est",
            deepMaskWeekly: "Chaque semaine",
            deepMaskBiweekly: "Toutes les 2-3 semaines",
            deepMaskMonthly: "Une fois par mois",
            deepMaskRare: "Presque jamais",
            moistMushy: "Mous, gonflés, presque gluants",
            moistStrawy: "Raides, comme de la paille",
            moistNormal: "Souples et normaux",
            moistUnsure: "Je n'ai jamais fait attention",
            tempHot: "Eau chaude",
            tempWarm: "Eau tiède",
            tempCool: "Eau fraîche/froide",
            alkalineOften: "Oui, souvent",
            alkalineSometimes: "Parfois",
            alkalineNo: "Non, ou produits doux",
            climateYesAdjust: "Oui, et j'ai déjà ajusté",
            climateYesNoAdjust: "Oui, mais rien changé",
            climateNo: "Non, climat stable",
            pastYes: "Oui, plusieurs fois",
            pastOnce: "Oui, une fois",
            pastNever: "Non, jamais vécu ça",
            goalRet: "Garder l'hydratation plus longtemps",
            goalPor: "Comprendre ma porosité",
            goalBreak: "Stopper la casse",
            goalRoutine: "Créer une routine simple",
            seeGuide: "Voir le guide",
            seeRoutine: "Routine personnalisée",
            restart: "Recommencer",
          },

          /* Result labels */
          rResult: "Résultat HydraCheck",
          rProfileDetected: "Profil détecté",
          rPriority: "Priorité",
          rCauses: "Causes possibles",
          rActions: "Actions immédiates",
          rMethod: "Méthode Schicgirl en 5 étapes",
          rFreq: "Fréquence de départ",
          rFreqVal: "2 à 3 fois/semaine, puis ajuste selon les signes.",
          rMore: "À hydrater plus",
          rMoreVal:
            "Rêche, pointes qui s'accrochent, casse, douceur qui disparaît vite.",
          rSpace: "À espacer",
          rSpaceVal: "Cheveux mous, lourds, sans tenue, trop chargés.",
          rEssential: "Essentiel",
          rEssentialVal: "Eau + soin + scellage + protection, pas 10 produits.",
          rEmergency: "Plan urgence 7 jours",
          rOffer: "Pour aller plus loin",
          rOfferDesc:
            "Ce diagnostic gratuit t'indique le blocage principal. Pour apprendre la méthode complète, prends le guide. Pour recevoir une routine faite pour ton profil exact, prends la création de routine personnalisée.",
          rGuideBtn: "💧 Guide Hydratation Cheveux Crépus",
          rRoutineBtn: "🌿 Création de routine personnalisée",

          /* Causes & actions */
          causes: {
            retention:
              "Tes cheveux perdent vite leur douceur : il y a probablement un problème de rétention ou de scellage.",
            waterFirst:
              "Tu commences peut-être par du gras ou une crème trop riche alors que l'hydratation commence par l'eau.",
            oilMyth:
              "Les huiles protègent et scellent, mais elles n'hydratent pas seules.",
            sealLoss:
              "L'eau peut s'évaporer vite si elle n'est pas retenue par un scellage adapté.",
            heavy:
              "Tes produits semblent parfois trop lourds : cela peut étouffer la fibre et donner une fausse impression de soin.",
            buildup:
              "Possible accumulation : cheveux chargés, ternes, lourds mais secs. L'eau pénètre moins bien.",
            lowPor:
              "Porosité faible : l'eau entre difficilement. Les textures lourdes peuvent rester en surface.",
            highPor:
              "Porosité forte : l'eau entre vite mais ressort vite. La rétention est la priorité.",
            fineSeal:
              "Mèches fines : elles se chargent vite. Il faut des couches fines et légères.",
            rare: "Hydratation trop rare : les longueurs peuvent devenir rêches et les pointes casser.",
            overHyd:
              "Tu hydrates peut-être trop souvent : cheveux mous, sans tenue = besoin d'espacer et d'observer.",
            ends: "Les pointes demandent plus d'attention : elles sont la partie la plus ancienne et fragile.",
            night:
              "Sans satin la nuit, le coton absorbe l'hydratation et augmente les frottements.",
            routine:
              "La routine manque de cohérence. Une routine simple mais stable donne plus de résultats.",
            emergency:
              "Tes cheveux sont en urgence sécheresse : il faut revenir à l'essentiel, pas multiplier les produits.",
            scalpDry:
              "Ton cuir chevelu montre des signes de sécheresse séparés de tes longueurs — il a besoin de son propre soin hydratant, pas seulement tes pointes.",
            humectMismatch:
              "Tu utilises la glycérine sans l'ajuster au climat — en air très sec, elle peut aspirer l'eau hors de tes cheveux au lieu de l'attirer.",
            rareDeepMask:
              "Tu fais rarement un vrai masque profond — ton après-shampooing seul ne suffit pas à restaurer la fibre en profondeur.",
            moistureMushy:
              "Tes cheveux deviennent mous et gonflés au mouillé — signe possible d'un excès d'hydratation sans assez de protéines pour structurer la fibre.",
            moistureStrawy:
              "Tes cheveux sont raides comme de la paille au mouillé — signe possible d'un excès de protéines ou d'un manque d'hydratation profonde.",
            hotWater:
              "L'eau chaude soulève la cuticule et accélère la perte d'hydratation — un rinçage plus frais aide à la refermer.",
            alkalineStyling:
              "Les gels ou edge control très alcalins ou à base d'alcool assèchent la fibre à chaque coiffage.",
            climateNoAdjust:
              "Ta routine n'a pas été ajustée malgré un changement de climat récent — les besoins d'hydratation changent avec l'air ambiant.",
          },
          actions: {
            waterFirst:
              "Commence toujours par eau, spray aqueux ou leave-in très aqueux.",
            seal: "Après l'eau/leave-in, ajoute une fine couche d'huile ou de crème selon tes cheveux.",
            buildup:
              "Fais un nettoyage doux ou un masque clarifiant doux avant shampoing, puis hydrate correctement.",
            lowPor:
              "Utilise des textures légères, applique sur cheveux bien humides et aide avec chaleur douce.",
            highPor:
              "Scelle mieux, protège les pointes et évite de laisser sécher entre les étapes.",
            ends: "Hydrate les pointes séparément, scelle-les et protège-les immédiatement.",
            night: "Bonnet, foulard ou taie satin chaque nuit.",
            scalpDry:
              "Masse un soin ou une huile légère directement sur le cuir chevelu, pas seulement les longueurs.",
            humectMismatch:
              "En air sec, réduis la glycérine pure ou utilise-la seulement en climat humide ou après avoir mouillé les cheveux.",
            rareDeepMask:
              "Ajoute un vrai masque de 20 à 30 min au moins toutes les 2 semaines.",
            moistureMushy:
              "Ajoute un soin protéiné léger pour rééquilibrer avant d'hydrater davantage.",
            moistureStrawy:
              "Réduis les protéines et augmente l'hydratation profonde pendant 2 à 3 semaines.",
            hotWater:
              "Lave à l'eau tiède et termine toujours par un rinçage frais ou froid.",
            alkalineStyling:
              "Choisis des gels/edge control sans alcool asséchant et limite la fréquence d'application près du cuir chevelu.",
            climateNoAdjust:
              "Ajuste ta fréquence d'hydratation et tes produits au climat actuel plutôt qu'à celui d'avant.",
          },
          profiles: {
            balanced: "Hydratation à équilibrer",
            noWater: "Manque d'eau réelle",
            retention: "Rétention faible",
            buildup: "Accumulation / surcharge",
            lowPor: "Porosité faible à débloquer",
            emergency: "Urgence sécheresse",
          },
          priorities: {
            balanced: "observer et ajuster sans surcharger",
            noWater: "remettre l'eau au centre de ta routine",
            retention: "sceller et protéger pour garder l'eau plus longtemps",
            buildup: "nettoyer doucement puis alléger les produits",
            lowPor: "faire pénétrer l'hydratation sans étouffer",
            emergency: "nettoyer intelligemment, hydrater, sceller et protéger",
          },
          noCause:
            "• Ton profil est plutôt équilibré. Continue à observer et rester régulière.",
          noAction:
            "• Garde une routine simple : eau, soin hydratant, scellage adapté, protection.",

          /* 5-step plan */
          plan: `① Eau ou élément aqueux\nCommence par des cheveux humidifiés, un spray hydratant ou un leave-in très aqueux.\n\n② Soin hydratant/adoucissant\nAjoute un lait, leave-in ou crème légère pour accompagner l'eau.\n\n③ Scellage adapté\nAjoute une fine couche d'huile, crème ou beurre selon ta porosité et ton épaisseur. Le but n'est pas de graisser, mais de retenir.\n\n④ Protection\nLaisse les cheveux tranquilles : vanilles, nattes souples, chignon doux ou coiffure peu manipulée.\n\n⑤ Observation\nRegarde si tes cheveux deviennent doux, lourds, mous, secs vite ou plus cassants. Ajuste selon ces signes.`,
          planLowPor: `\n\n📌 Spécial faible porosité : textures légères, petites quantités, cheveux bien humides et chaleur douce pendant les soins.`,
          planHighPor: `\n\n📌 Spécial forte porosité : ne laisse pas sécher entre les étapes, scelle mieux, insiste sur les pointes et la protection nocturne.`,
          planFine: `\n\n📌 Mèches fines : applique moins de produit, en couches fines. Trop riche = lourd mais pas forcément hydraté.`,
          planThick: `\n\n📌 Mèches épaisses : tu peux utiliser un peu plus de matière, surtout sur longueurs et pointes.`,
          planPastAttempt: `\n\n📌 Quand une méthode « arrête de marcher » : ce n'est presque jamais la faute du produit. La porosité et les besoins évoluent avec les saisons, le climat, les hormones et même la source d'eau. Avant de tout changer, vérifie d'abord ce qui a changé autour de ta routine.`,

          /* 7-day emergency */
          emergency7: `Jour 1 : Évalue l'état réel — sec, chargé, abîmé ou trop mou.\nJour 2 : Si les cheveux sont lourds/ternes, fais un nettoyage doux ou clarifiant léger avant shampoing.\nJour 3 : Fais un vrai soin hydratant sur cheveux bien humidifiés.\nJour 4 : Scelle correctement, surtout les pointes.\nJour 5 : Protège immédiatement avec une coiffure simple et satin la nuit.\nJour 6 : Réduis la surcharge : eau + soin hydratant + scellage + protection.\nJour 7 : Observe : douceur, souplesse, pointes, lourdeur, casse.`,
        },

        en: {
          /* Hero */
          heroEyebrow: "Inspired by the hydration guide",
          heroTitle: "Why does your hair stay dry?",
          heroDesc:
            "This mini-app analyses your hydration, retention, porosity, strand thickness, routine and possible mistakes. The goal: understand whether your hair lacks water, sealing, clarifying, lightness or a better-adapted routine.",
          m1: "Identify the real hydration blockage.",
          m2: "Get a simple method: water, moisturiser, sealant, observation.",
          m3: "Adjust for porosity, thickness and climate.",
          m4: "Go further with the guide or a personalised routine.",
          inputPlaceholder: "Type your answer here…",
          sendBtn: "Send",
          footer: "© 2026 Schicgirl™ — HydraCheck. All rights reserved.",

          /* Conversation */
          welcome: "💧 Welcome to Schicgirl's HydraCheck.",
          intro:
            "I'll help you understand why your curly hair stays dry: lack of water, poor retention, heavy products, build-up, porosity, ends or a poorly-adapted routine.\n\nWhat would you like me to call you?",
          greeting: (name) =>
            `Happy to guide you, ${name} 💛\n\nYou can share your email or WhatsApp to save this diagnostic, or continue without contact.`,
          askCountry:
            "Which country do you live in? Climate greatly influences hydration loss.",
          askClimate: "What does your current climate feel like?",
          askDryness:
            "After a wash day or moisturising session, how long does your hair stay soft?",
          askHydrationBasis:
            "When you 'moisturise', what is the very first thing you apply?",
          askOilOnly:
            "Do you often use oils thinking they moisturise on their own?",
          askSeal: "After water or leave-in, do you seal in the moisture?",
          askHeavy:
            "Do your products sometimes leave your hair feeling heavy, greasy or sticky?",
          askBuildup:
            "Even after your routine, does your hair feel loaded but still dry?",
          askPorosity:
            "What is your porosity — or what do you observe with water?",
          askThickness: "Are your individual strands fine, medium or thick?",
          askFrequency: "How often do you actually moisturise your hair?",
          askOverHydration:
            "Does your hair sometimes go limp, floppy or lose definition after too much water/product?",
          askEnds: "How are your ends?",
          askScalpDryness:
            "And your scalp — is it dry or does it tend to flake?",
          askNight: "Do you protect your hair at night?",
          askRoutine: "Is your routine simple and consistent?",
          askEmergency:
            "Right now, is your hair in a dry emergency — very dry, brittle, hard to style?",
          askHumectant:
            "Do you use glycerin-based products or other humectants — and do you adjust them based on air humidity?\n\nGlycerin draws moisture from the air when it's humid, but can pull moisture OUT of your hair when the air is very dry.",
          askDeepMask:
            "Aside from your usual moisturising, how often do you do a real deep mask (20+ minutes on)?",
          askMoistureProtein: "When your hair is wet, how does it feel?",
          askWaterTemp:
            "What water temperature do you usually use to wash and rinse your hair?",
          askAlkalineStyling:
            "Do you often use alcohol-based or highly alkaline gels/edge control to style your hair?",
          askClimateShift:
            "Have you experienced a recent climate or season change (move, winter, dry season) without adjusting your routine?",
          askPastAttempt:
            "Have you ever had a hydration method that worked well... then stopped working?",
          askGoal: "What is your main goal right now?",
          diagIntro: (name) =>
            `${name}, your diagnostic is ready. Remember: moisturising doesn't mean loading your hair with products. It means bringing in water, helping it stay, then observing.`,

          /* Quick-reply labels */
          q: {
            skipContact: "Continue without contact",
            ciDivoire: "Côte d'Ivoire",
            france: "France",
            usa: "United States",
            canada: "Canada",
            other: "Other",
            hotDry: "Hot & dry",
            humid: "Hot & humid",
            cold: "Cold / winter",
            variable: "Variable",
            under24: "Less than 24 h",
            d1_2: "1–2 days",
            d3_4: "3–4 days",
            week: "Almost all week",
            water: "Water or water-based spray",
            leavein: "Leave-in / moisturising milk",
            oil: "Oil or butter directly",
            cream: "Rich cream with no water first",
            oilYes: "Yes, often",
            oilSometimes: "Sometimes",
            oilNo: "No, I know water comes first",
            sealLight: "Yes, with a light oil",
            sealRich: "Yes, with cream/butter",
            sealSometimes: "Sometimes only",
            sealNo: "Never",
            heavyOften: "Yes, often",
            heavySometimes: "Sometimes",
            heavyNo: "No, they stay light",
            buildupHD: "Yes, heavy but dry",
            buildupDull: "Dull and hard to moisturise",
            buildupNo: "Not really",
            porosityLow: "Low: water sits on the surface",
            porosityHigh: "High: water enters fast but leaves fast",
            porosityNormal: "Normal",
            porosityUnknown: "I don't know",
            thickFine: "Fine: they load up quickly",
            thickMed: "Medium",
            thickThick: "Thick: they can take more product",
            thickUnknown: "I don't know",
            freqDaily: "Every day",
            freq2_3: "2–3 times/week",
            freqWeekly: "Once a week",
            freqRare: "Rarely / when I remember",
            overYes: "Yes",
            overSometimes: "Sometimes",
            overNo: "No",
            endsDry: "Very dry and rough",
            endsSplit: "Split / transparent",
            endsOk: "Fine",
            endsUnknown: "I never check",
            scalpDryYes: "Yes, dry and tight",
            scalpDryFlaky: "Yes, with small flakes",
            scalpDryNo: "No, comfortable scalp",
            scalpDryOily: "Oily rather than dry",
            nightSatin: "Yes, satin bonnet/pillowcase",
            nightSometimes: "Sometimes",
            nightNo: "No",
            routineStable: "Yes, clear and consistent",
            routineUnstable: "I change it often",
            routineNone: "I don't really have a routine",
            emergYes: "Yes, dry emergency",
            emergMed: "A little",
            emergNo: "No",
            humectAdjust: "Yes, I adjust based on humidity",
            humectAlways: "Yes, but always the same way",
            humectNo: "No, I don't use glycerin",
            humectUnknown: "I don't know what that is",
            deepMaskWeekly: "Every week",
            deepMaskBiweekly: "Every 2–3 weeks",
            deepMaskMonthly: "Once a month",
            deepMaskRare: "Almost never",
            moistMushy: "Limp, swollen, almost gummy",
            moistStrawy: "Stiff, like straw",
            moistNormal: "Soft and normal",
            moistUnsure: "I've never paid attention",
            tempHot: "Hot water",
            tempWarm: "Warm water",
            tempCool: "Cool/cold water",
            alkalineOften: "Yes, often",
            alkalineSometimes: "Sometimes",
            alkalineNo: "No, or gentle products",
            climateYesAdjust: "Yes, and I already adjusted",
            climateYesNoAdjust: "Yes, but nothing changed",
            climateNo: "No, stable climate",
            pastYes: "Yes, several times",
            pastOnce: "Yes, once",
            pastNever: "No, never happened",
            goalRet: "Keep moisture longer",
            goalPor: "Understand my porosity",
            goalBreak: "Stop breakage",
            goalRoutine: "Build a simple routine",
            seeGuide: "See the guide",
            seeRoutine: "Personalised routine",
            restart: "Restart",
          },

          /* Result labels */
          rResult: "HydraCheck Result",
          rProfileDetected: "Detected profile",
          rPriority: "Priority",
          rCauses: "Possible causes",
          rActions: "Immediate actions",
          rMethod: "Schicgirl 5-step method",
          rFreq: "Starting frequency",
          rFreqVal: "2–3 times/week, then adjust based on signs.",
          rMore: "Moisturise more when",
          rMoreVal:
            "Rough, catching ends, breakage, softness disappearing quickly.",
          rSpace: "Space it out when",
          rSpaceVal: "Hair feels limp, heavy, lacking definition, overloaded.",
          rEssential: "The essential",
          rEssentialVal:
            "Water + moisturiser + sealant + protection — not 10 products.",
          rEmergency: "7-day emergency plan",
          rOffer: "Go further",
          rOfferDesc:
            "This free diagnostic shows you the main blockage. To learn the full method, get the guide. For a routine built for your exact profile, get the personalised routine creation.",
          rGuideBtn: "💧 Curly Hair Hydration Guide",
          rRoutineBtn: "🌿 Personalised routine creation",

          /* Causes & actions */
          causes: {
            retention:
              "Your hair loses its softness quickly: there is likely a retention or sealing issue.",
            waterFirst:
              "You might be starting with oil or a rich cream when hydration should start with water.",
            oilMyth:
              "Oils protect and seal, but they don't moisturise on their own.",
            sealLoss:
              "Water can evaporate quickly if it isn't locked in with proper sealing.",
            heavy:
              "Your products seem too heavy at times — this can suffocate the hair and give a false sense of care.",
            buildup:
              "Possible build-up: hair feels loaded, dull, heavy but dry. Water struggles to penetrate.",
            lowPor:
              "Low porosity: water struggles to enter. Heavy textures may sit on the surface.",
            highPor:
              "High porosity: water enters fast but leaves just as fast. Retention is the priority.",
            fineSeal: "Fine strands load up fast. Thin, light layers are key.",
            rare: "Too infrequent moisturising: lengths can become rough and ends may break.",
            overHyd:
              "You might be moisturising too often — limp, definition-less hair means it's time to space out and observe.",
            ends: "Ends need more attention: they are the oldest and most fragile part of your hair.",
            night:
              "Without satin at night, cotton absorbs moisture and increases friction.",
            routine:
              "Your routine lacks consistency. A simple but stable routine delivers more results than a complex one.",
            emergency:
              "Your hair is in a dry emergency: go back to basics, don't multiply products.",
            scalpDry:
              "Your scalp shows signs of dryness separate from your lengths — it needs its own moisturising care, not just your ends.",
            humectMismatch:
              "You use glycerin without adjusting for climate — in very dry air, it can pull moisture OUT of your hair instead of drawing it in.",
            rareDeepMask:
              "You rarely do a real deep mask — your regular conditioner alone isn't enough to restore the fibre deeply.",
            moistureMushy:
              "Your hair goes limp and swollen when wet — a possible sign of excess moisture without enough protein to structure the fibre.",
            moistureStrawy:
              "Your hair feels stiff like straw when wet — a possible sign of excess protein or a lack of deep hydration.",
            hotWater:
              "Hot water lifts the cuticle and speeds up moisture loss — a cooler rinse helps close it back down.",
            alkalineStyling:
              "Highly alkaline or alcohol-based gels/edge control dry out the fibre with every styling session.",
            climateNoAdjust:
              "Your routine hasn't been adjusted despite a recent climate change — hydration needs shift with the surrounding air.",
          },
          actions: {
            waterFirst:
              "Always start with water, a water-based spray or a very light leave-in.",
            seal: "After water/leave-in, add a thin layer of oil or cream suited to your hair.",
            buildup:
              "Do a gentle cleanse or light clarifying mask before shampooing, then moisturise properly.",
            lowPor:
              "Use light textures, small amounts, apply to very damp hair and use gentle heat during treatments.",
            highPor:
              "Seal better, protect your ends and avoid letting hair dry between steps.",
            ends: "Moisturise ends separately, seal them and protect them immediately.",
            night: "Satin bonnet, scarf or pillowcase every night.",
            scalpDry:
              "Massage a light oil or treatment directly onto the scalp, not just the lengths.",
            humectMismatch:
              "In dry air, cut back on pure glycerin or use it only in humid climates or right after wetting your hair.",
            rareDeepMask:
              "Add a real 20-30 min deep-conditioning mask at least every 2 weeks.",
            moistureMushy:
              "Add a light protein treatment to rebalance before moisturising further.",
            moistureStrawy:
              "Cut back on protein and increase deep hydration for 2-3 weeks.",
            hotWater:
              "Wash with warm water and always finish with a cool or cold rinse.",
            alkalineStyling:
              "Choose gels/edge control without drying alcohol and limit how often you apply them near the scalp.",
            climateNoAdjust:
              "Adjust your moisturising frequency and products to your current climate, not the previous one.",
          },
          profiles: {
            balanced: "Hydration to balance",
            noWater: "Lack of real water",
            retention: "Low retention",
            buildup: "Build-up / overload",
            lowPor: "Low porosity to unblock",
            emergency: "Dry emergency",
          },
          priorities: {
            balanced: "observe and adjust without overloading",
            noWater: "put water back at the centre of your routine",
            retention: "seal and protect to hold moisture longer",
            buildup: "gently cleanse then lighten your products",
            lowPor: "get moisture in without suffocating the hair",
            emergency: "cleanse smartly, moisturise, seal and protect",
          },
          noCause:
            "• Your profile is fairly balanced. Keep observing and stay consistent.",
          noAction:
            "• Maintain a simple routine: water, moisturiser, suitable sealant, protection.",

          /* 5-step plan */
          plan: `① Water or water-based product\nStart with damp hair, a hydrating spray or a very light leave-in.\n\n② Moisturising / softening treatment\nAdd a milk, leave-in or light cream to work alongside the water.\n\n③ Suitable sealant\nAdd a thin layer of oil, cream or butter based on your porosity and thickness. The goal is retention, not greasiness.\n\n④ Protection\nLeave your hair alone: twists, loose braids, a soft bun or a low-manipulation style.\n\n⑤ Observation\nNotice if your hair becomes soft, heavy, limp, dries quickly or breaks more. Adjust based on these signs.`,
          planLowPor: `\n\n📌 Low porosity tip: light textures, small amounts, very damp hair and gentle heat during treatments.`,
          planHighPor: `\n\n📌 High porosity tip: don't let hair dry between steps, seal better, focus on ends and nightly protection.`,
          planFine: `\n\n📌 Fine strands: apply less product, in thin layers. Richer doesn't mean more hydrated.`,
          planThick: `\n\n📌 Thick strands: you can use slightly more product, especially on lengths and ends.`,
          planPastAttempt: `\n\n📌 When a method "stops working": it's rarely the product's fault. Porosity and needs shift with seasons, climate, hormones and even water source. Before switching everything, check what changed around your routine first.`,

          /* 7-day emergency */
          emergency7: `Day 1: Assess the real state — dry, loaded, damaged or too limp.\nDay 2: If hair is heavy/dull, do a gentle or light clarifying cleanse before shampooing.\nDay 3: Do a real moisturising treatment on very damp hair.\nDay 4: Seal properly, especially the ends.\nDay 5: Protect immediately with a simple style and satin at night.\nDay 6: Reduce overload — water + moisturiser + sealant + protection.\nDay 7: Observe: softness, flexibility, ends, heaviness, breakage.`,
        },
      };

      /* ──────────────────────────────────────────────
   STATE
──────────────────────────────────────────────── */
      let lang = localStorage.getItem("schic_hydracheck_lang") || "fr";
      const state = {
        conversation: [],
        step: "",
        name: "",
        contact: "",
        country: "",
        climate: "",
        dryness: "",
        hydrationBasis: "",
        oilOnly: "",
        seal: "",
        humectant: "",
        heavyProducts: "",
        alkalineStyling: "",
        buildup: "",
        waterTemp: "",
        porosity: "",
        thickness: "",
        moistureProtein: "",
        frequency: "",
        deepMaskFreq: "",
        overHydration: "",
        ends: "",
        scalpDryness: "",
        nightProtection: "",
        routine: "",
        climateShift: "",
        emergency: "",
        pastAttempt: "",
        goal: "",
        score: 0,
        profile: "",
        priority: "",
      };
      const steps = [
        "name",
        "contact",
        "country",
        "climate",
        "dryness",
        "hydrationBasis",
        "oilOnly",
        "seal",
        "humectant",
        "heavyProducts",
        "alkalineStyling",
        "buildup",
        "waterTemp",
        "porosity",
        "thickness",
        "moistureProtein",
        "frequency",
        "deepMaskFreq",
        "overHydration",
        "ends",
        "scalpDryness",
        "nightProtection",
        "routine",
        "climateShift",
        "emergency",
        "pastAttempt",
        "goal",
        "done",
      ];

      /* ──────────────────────────────────────────────
   DOM refs
──────────────────────────────────────────────── */
      const chat = document.getElementById("chatbox");
      const quickBar = document.getElementById("quick");
      const form = document.getElementById("form");
      const input = document.getElementById("input");
      const progress = document.getElementById("progress");

      /* ──────────────────────────────────────────────
   i18n helpers
──────────────────────────────────────────────── */
      function s(key) {
        return STR[lang][key] ?? STR["fr"][key] ?? key;
      }
      function q(key) {
        return STR[lang].q[key] ?? STR["fr"].q[key] ?? key;
      }

      function applyLang() {
        const L = STR[lang];
        document.documentElement.lang = lang;
        document.getElementById("heroEyebrow").textContent = L.heroEyebrow;
        document.getElementById("heroTitle").textContent = L.heroTitle;
        document.getElementById("heroDesc").textContent = L.heroDesc;
        document.getElementById("m1").textContent = L.m1;
        document.getElementById("m2").textContent = L.m2;
        document.getElementById("m3").textContent = L.m3;
        document.getElementById("m4").textContent = L.m4;
        document.getElementById("input").placeholder = L.inputPlaceholder;
        document.getElementById("sendBtn").textContent = L.sendBtn;
        document.getElementById("footerText").textContent = L.footer;
        document
          .getElementById("btnFR")
          .classList.toggle("active", lang === "fr");
        document
          .getElementById("btnEN")
          .classList.toggle("active", lang === "en");
      }

      function setLang(l) {
        lang = l;

        localStorage.setItem("schic_hydracheck_lang", l);

        // Full reload
        window.location.reload();
      }

      /* ──────────────────────────────────────────────
   Chat engine
──────────────────────────────────────────────── */
      const norm = (v) =>
        String(v || "")
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim();

      function setStep(step) {
        state.step = step;
        const i = steps.indexOf(step);
        progress.style.width =
          (i < 0 ? 0 : Math.round((i / (steps.length - 1)) * 100)) + "%";
      }

      function setReplies(arr) {
        quickBar.innerHTML = "";
        (arr || []).forEach((r) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "qbtn";
          b.textContent = r.label;
          b.onclick = () => handle(r.value, r.label);
          quickBar.appendChild(b);
        });
        setTimeout(() => (chat.scrollTop = chat.scrollHeight), 50);
      }

      function typingEl() {
        const d = document.createElement("div");
        d.className = "typing";
        d.id = "typing";
        d.innerHTML =
          '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        chat.appendChild(d);
        chat.scrollTop = chat.scrollHeight;
      }
      function rmTyping() {
        const d = document.getElementById("typing");
        if (d) d.remove();
      }

      function stripHtml(html) {
        const temp = document.createElement("div");
        temp.innerHTML = html;
        return temp.textContent || temp.innerText || "";
      }

      function addMsg(text, cls = "bot", html = false, delay = 0) {
        // Save conversation history
        if (state.conversation) {
          state.conversation.push({
            sender: cls === "user" ? "user" : "bot",
            message: html ? stripHtml(text) : text,
            time: new Date().toISOString(),
          });
          autoSaveConversation();
        }

        return new Promise((res) =>
          setTimeout(() => {
            rmTyping();

            const d = document.createElement("div");
            d.className = "msg " + cls;

            if (html) {
              d.innerHTML = text;
            } else {
              d.textContent = text;
            }

            chat.appendChild(d);
            chat.scrollTop = chat.scrollHeight;

            res(d);
          }, delay),
        );
      }

      async function bot(text, delay = 520, html = false) {
        typingEl();
        return addMsg(text, "bot", html, delay);
      }

      function autoSaveConversation() {
        localStorage.setItem(
          "hydracheck_current_session",
          JSON.stringify(state),
        );
      }

      function saveLead() {
        const lead = {
          ...state,
          conversation: [...state.conversation],
          date: new Date().toISOString(),
          lang,
        };

        const list = JSON.parse(
          localStorage.getItem(CONFIG.adminStorageKey) || "[]",
        );

        list.push(lead);

        localStorage.setItem(CONFIG.adminStorageKey, JSON.stringify(list));
      }

      /* ──────────────────────────────────────────────
   Analysis engine
──────────────────────────────────────────────── */
      function analyze() {
        let score = 10;
        const causeKeys = [],
          actionKeys = [];

        if (["under24", "1_2"].includes(state.dryness)) {
          score -= 2;
          causeKeys.push("retention");
        }
        if (["oil", "cream"].includes(state.hydrationBasis)) {
          score -= 2;
          causeKeys.push("waterFirst");
          actionKeys.push("waterFirst");
        }
        if (["yes", "sometimes"].includes(state.oilOnly)) {
          score -= 1;
          causeKeys.push("oilMyth");
        }
        if (["no", "sometimes"].includes(state.seal)) {
          score -= 1;
          causeKeys.push("sealLoss");
          actionKeys.push("seal");
        }
        if (["often", "sometimes"].includes(state.heavyProducts)) {
          score -= 1;
          causeKeys.push("heavy");
        }
        if (["heavy_dry", "dull"].includes(state.buildup)) {
          score -= 2;
          causeKeys.push("buildup");
          actionKeys.push("buildup");
        }
        if (state.porosity === "low") {
          score -= 1;
          causeKeys.push("lowPor");
          actionKeys.push("lowPor");
        }
        if (state.porosity === "high") {
          score -= 1;
          causeKeys.push("highPor");
          actionKeys.push("highPor");
        }
        if (state.thickness === "fine") {
          score -= 1;
          causeKeys.push("fineSeal");
        }
        if (state.frequency === "rare") {
          score -= 2;
          causeKeys.push("rare");
        }
        if (
          state.frequency === "daily" &&
          ["yes", "sometimes"].includes(state.overHydration)
        ) {
          score -= 1;
          causeKeys.push("overHyd");
        }
        if (["dry", "split", "unknown"].includes(state.ends)) {
          score -= 1;
          causeKeys.push("ends");
          actionKeys.push("ends");
        }
        if (["no", "sometimes"].includes(state.nightProtection)) {
          score -= 1;
          causeKeys.push("night");
          actionKeys.push("night");
        }
        if (["unstable", "none"].includes(state.routine)) {
          score -= 1;
          causeKeys.push("routine");
        }
        if (state.emergency === "yes") {
          score -= 1;
          causeKeys.push("emergency");
        }
        if (["dry", "flaky"].includes(state.scalpDryness)) {
          score -= 1;
          causeKeys.push("scalpDry");
          actionKeys.push("scalpDry");
        }
        if (
          state.humectant === "always" &&
          ["hot_dry", "cold"].includes(state.climate)
        ) {
          score -= 1;
          causeKeys.push("humectMismatch");
          actionKeys.push("humectMismatch");
        }
        if (["rare", "monthly"].includes(state.deepMaskFreq)) {
          score -= state.deepMaskFreq === "rare" ? 2 : 1;
          causeKeys.push("rareDeepMask");
          actionKeys.push("rareDeepMask");
        }
        if (state.moistureProtein === "mushy") {
          score -= 1;
          causeKeys.push("moistureMushy");
          actionKeys.push("moistureMushy");
        }
        if (state.moistureProtein === "strawy") {
          score -= 1;
          causeKeys.push("moistureStrawy");
          actionKeys.push("moistureStrawy");
        }
        if (state.waterTemp === "hot") {
          score -= 1;
          causeKeys.push("hotWater");
          actionKeys.push("hotWater");
        }
        if (state.alkalineStyling === "often") {
          score -= 1;
          causeKeys.push("alkalineStyling");
          actionKeys.push("alkalineStyling");
        }
        if (state.climateShift === "no_adjust") {
          score -= 1;
          causeKeys.push("climateNoAdjust");
          actionKeys.push("climateNoAdjust");
        }
        score = Math.max(1, score);

        // Determine profile key
        let profileKey = "balanced";
        if (
          ["oil", "cream"].includes(state.hydrationBasis) ||
          ["yes", "sometimes"].includes(state.oilOnly)
        )
          profileKey = "noWater";
        if (
          ["under24", "1_2"].includes(state.dryness) ||
          state.porosity === "high"
        )
          profileKey = "retention";
        if (
          ["heavy_dry", "dull"].includes(state.buildup) ||
          state.heavyProducts === "often"
        )
          profileKey = "buildup";
        if (state.porosity === "low") profileKey = "lowPor";
        if (state.emergency === "yes") profileKey = "emergency";

        return { score, profileKey, causeKeys, actionKeys };
      }

      function buildPlan() {
        const L = STR[lang];
        let text = L.plan;
        if (state.porosity === "low") text += L.planLowPor;
        if (state.porosity === "high") text += L.planHighPor;
        if (state.thickness === "fine") text += L.planFine;
        if (state.thickness === "thick") text += L.planThick;
        if (["often", "once"].includes(state.pastAttempt))
          text += L.planPastAttempt;
        return text;
      }

      async function buildDiagnosis() {
        setStep("done");
        const a = analyze();
        const L = STR[lang];

        state.score = a.score;
        state.profile = L.profiles[a.profileKey];
        state.priority = L.priorities[a.profileKey];

        await bot(
          L.diagIntro(state.name || (lang === "fr" ? "Ma belle" : "Dear")),
        );

        const causesText = a.causeKeys.length
          ? a.causeKeys.map((k) => "• " + L.causes[k]).join("\n")
          : L.noCause;
        const actionsText = a.actionKeys.length
          ? a.actionKeys.map((k) => "• " + L.actions[k]).join("\n")
          : L.noAction;

        const html = `
    <div class="r-label">${L.rResult}</div>
    <div class="score-card">
      <div class="score">${a.score}/10</div>
      <div class="score-text">
        ${L.rProfileDetected}<br>
        <strong>${L.profiles[a.profileKey]}</strong><br>
        ${L.rPriority} : ${L.priorities[a.profileKey]}
      </div>
    </div>
    <div class="divider"></div>
    <div class="r-label">${L.rCauses}</div><p>${causesText}</p>
    <div class="divider"></div>
    <div class="r-label">${L.rActions}</div><p>${actionsText}</p>
    <div class="divider"></div>
    <div class="r-label">${L.rMethod}</div><p>${buildPlan()}</p>
    <div class="method-grid">
      <div class="method"><b>${L.rFreq}</b><br>${L.rFreqVal}</div>
      <div class="method"><b>${L.rMore}</b><br>${L.rMoreVal}</div>
      <div class="method"><b>${L.rSpace}</b><br>${L.rSpaceVal}</div>
      <div class="method"><b>${L.rEssential}</b><br>${L.rEssentialVal}</div>
    </div>
    <div class="divider"></div>
    <div class="r-label">${L.rEmergency}</div><p>${L.emergency7}</p>
    <div class="offer">
  <h3>💌 ${lang === "fr" ? "Diagnostic terminé" : "Diagnostic completed"}</h3>

  <p>
    ${
      lang === "fr"
        ? "Tu as utilisé ton diagnostic gratuit. Pour une nouvelle analyse ou un accompagnement personnalisé, contacte-moi par email ou Facebook."
        : "You have already used your free diagnostic. For another analysis or personalised support, contact me by email or Facebook."
    }
  </p>

  <div class="offer-btns">
    <a class="btn-dark" href="mailto:contacte.schicgirl@gmail.com">
      ${lang === "fr" ? "📧 Envoyer un email" : "📧 Send an email"}
    </a>

    <a class="btn-gold" href="https://facebook.com/schicgirl" target="_blank">
      ${lang === "fr" ? "📘 Message Facebook" : "📘 Facebook Message"}
    </a>
  </div>
</div>`;

        await addMsg(html, "result", true, 250);
        saveLead();
        localStorage.setItem("hydracheck_used", "yes");

        // Disable chat after completion
        input.disabled = true;
        input.placeholder = "Diagnostic terminé";
        document.getElementById("sendBtn").disabled = true;
        quickBar.innerHTML = "";

        setReplies([
          { label: q("seeGuide"), value: "guide" },
          { label: q("seeRoutine"), value: "routine" },
          { label: q("restart"), value: "restart" },
        ]);
      }

      /* ──────────────────────────────────────────────
   Conversation flow
──────────────────────────────────────────────── */
      async function handle(value, label = value) {
        const raw = String(value).trim();
        if (!raw) return;
        const v = norm(raw);
        addMsg(label, "user");
        setReplies([]);
        input.value = "";

        switch (state.step) {
          case "name":
            state.name = raw;
            setStep("contact");
            await bot(s("greeting")(state.name));
            setReplies([{ label: q("skipContact"), value: "skip" }]);
            break;

          case "contact":
            state.contact = v === "skip" ? "" : raw;
            setStep("country");
            await bot(s("askCountry"));
            setReplies([
              { label: q("ciDivoire"), value: "Côte d'Ivoire" },
              { label: q("france"), value: "France" },
              {
                label: q("usa"),
                value: lang === "fr" ? "États-Unis" : "United States",
              },
              { label: q("canada"), value: "Canada" },
              { label: q("other"), value: lang === "fr" ? "Autre" : "Other" },
            ]);
            break;

          case "country":
            state.country = raw;
            setStep("climate");
            await bot(s("askClimate"));
            setReplies([
              { label: q("hotDry"), value: "hot_dry" },
              { label: q("humid"), value: "humid" },
              { label: q("cold"), value: "cold" },
              { label: q("variable"), value: "variable" },
            ]);
            break;

          case "climate":
            state.climate = v;
            setStep("dryness");
            await bot(s("askDryness"));
            setReplies([
              { label: q("under24"), value: "under24" },
              { label: q("d1_2"), value: "1_2" },
              { label: q("d3_4"), value: "3_4" },
              { label: q("week"), value: "week" },
            ]);
            break;

          case "dryness":
            state.dryness = v;
            setStep("hydrationBasis");
            await bot(s("askHydrationBasis"));
            setReplies([
              { label: q("water"), value: "water" },
              { label: q("leavein"), value: "leavein" },
              { label: q("oil"), value: "oil" },
              { label: q("cream"), value: "cream" },
            ]);
            break;

          case "hydrationBasis":
            state.hydrationBasis = v;
            setStep("oilOnly");
            await bot(s("askOilOnly"));
            setReplies([
              { label: q("oilYes"), value: "yes" },
              { label: q("oilSometimes"), value: "sometimes" },
              { label: q("oilNo"), value: "no" },
            ]);
            break;

          case "oilOnly":
            state.oilOnly = v;
            setStep("seal");
            await bot(s("askSeal"));
            setReplies([
              { label: q("sealLight"), value: "light" },
              { label: q("sealRich"), value: "rich" },
              { label: q("sealSometimes"), value: "sometimes" },
              { label: q("sealNo"), value: "no" },
            ]);
            break;

          case "seal":
            state.seal = v;
            setStep("humectant");
            await bot(s("askHumectant"));
            setReplies([
              { label: q("humectAdjust"), value: "adjust" },
              { label: q("humectAlways"), value: "always" },
              { label: q("humectNo"), value: "no" },
              { label: q("humectUnknown"), value: "unknown" },
            ]);
            break;

          case "humectant":
            state.humectant = v;
            setStep("heavyProducts");
            await bot(s("askHeavy"));
            setReplies([
              { label: q("heavyOften"), value: "often" },
              { label: q("heavySometimes"), value: "sometimes" },
              { label: q("heavyNo"), value: "no" },
            ]);
            break;

          case "heavyProducts":
            state.heavyProducts = v;
            setStep("alkalineStyling");
            await bot(s("askAlkalineStyling"));
            setReplies([
              { label: q("alkalineOften"), value: "often" },
              { label: q("alkalineSometimes"), value: "sometimes" },
              { label: q("alkalineNo"), value: "no" },
            ]);
            break;

          case "alkalineStyling":
            state.alkalineStyling = v;
            setStep("buildup");
            await bot(s("askBuildup"));
            setReplies([
              { label: q("buildupHD"), value: "heavy_dry" },
              { label: q("buildupDull"), value: "dull" },
              { label: q("buildupNo"), value: "no" },
            ]);
            break;

          case "buildup":
            state.buildup = v;
            setStep("waterTemp");
            await bot(s("askWaterTemp"));
            setReplies([
              { label: q("tempHot"), value: "hot" },
              { label: q("tempWarm"), value: "warm" },
              { label: q("tempCool"), value: "cool" },
            ]);
            break;

          case "waterTemp":
            state.waterTemp = v;
            setStep("porosity");
            await bot(s("askPorosity"));
            setReplies([
              { label: q("porosityLow"), value: "low" },
              { label: q("porosityHigh"), value: "high" },
              { label: q("porosityNormal"), value: "normal" },
              { label: q("porosityUnknown"), value: "unknown" },
            ]);
            break;

          case "porosity":
            state.porosity = v;
            setStep("thickness");
            await bot(s("askThickness"));
            setReplies([
              { label: q("thickFine"), value: "fine" },
              { label: q("thickMed"), value: "medium" },
              { label: q("thickThick"), value: "thick" },
              { label: q("thickUnknown"), value: "unknown" },
            ]);
            break;

          case "thickness":
            state.thickness = v;
            setStep("moistureProtein");
            await bot(s("askMoistureProtein"));
            setReplies([
              { label: q("moistMushy"), value: "mushy" },
              { label: q("moistStrawy"), value: "strawy" },
              { label: q("moistNormal"), value: "normal" },
              { label: q("moistUnsure"), value: "unsure" },
            ]);
            break;

          case "moistureProtein":
            state.moistureProtein = v;
            setStep("frequency");
            await bot(s("askFrequency"));
            setReplies([
              { label: q("freqDaily"), value: "daily" },
              { label: q("freq2_3"), value: "2_3" },
              { label: q("freqWeekly"), value: "weekly" },
              { label: q("freqRare"), value: "rare" },
            ]);
            break;

          case "frequency":
            state.frequency = v;
            setStep("deepMaskFreq");
            await bot(s("askDeepMask"));
            setReplies([
              { label: q("deepMaskWeekly"), value: "weekly" },
              { label: q("deepMaskBiweekly"), value: "biweekly" },
              { label: q("deepMaskMonthly"), value: "monthly" },
              { label: q("deepMaskRare"), value: "rare" },
            ]);
            break;

          case "deepMaskFreq":
            state.deepMaskFreq = v;
            setStep("overHydration");
            await bot(s("askOverHydration"));
            setReplies([
              { label: q("overYes"), value: "yes" },
              { label: q("overSometimes"), value: "sometimes" },
              { label: q("overNo"), value: "no" },
            ]);
            break;

          case "overHydration":
            state.overHydration = v;
            setStep("ends");
            await bot(s("askEnds"));
            setReplies([
              { label: q("endsDry"), value: "dry" },
              { label: q("endsSplit"), value: "split" },
              { label: q("endsOk"), value: "ok" },
              { label: q("endsUnknown"), value: "unknown" },
            ]);
            break;

          case "ends":
            state.ends = v;
            setStep("scalpDryness");
            await bot(s("askScalpDryness"));
            setReplies([
              { label: q("scalpDryYes"), value: "dry" },
              { label: q("scalpDryFlaky"), value: "flaky" },
              { label: q("scalpDryNo"), value: "no" },
              { label: q("scalpDryOily"), value: "oily" },
            ]);
            break;

          case "scalpDryness":
            state.scalpDryness = v;
            setStep("nightProtection");
            await bot(s("askNight"));
            setReplies([
              { label: q("nightSatin"), value: "satin" },
              { label: q("nightSometimes"), value: "sometimes" },
              { label: q("nightNo"), value: "no" },
            ]);
            break;

          case "nightProtection":
            state.nightProtection = v;
            setStep("routine");
            await bot(s("askRoutine"));
            setReplies([
              { label: q("routineStable"), value: "stable" },
              { label: q("routineUnstable"), value: "unstable" },
              { label: q("routineNone"), value: "none" },
            ]);
            break;

          case "routine":
            state.routine = v;
            setStep("climateShift");
            await bot(s("askClimateShift"));
            setReplies([
              { label: q("climateYesAdjust"), value: "adjusted" },
              { label: q("climateYesNoAdjust"), value: "no_adjust" },
              { label: q("climateNo"), value: "stable" },
            ]);
            break;

          case "climateShift":
            state.climateShift = v;
            setStep("emergency");
            await bot(s("askEmergency"));
            setReplies([
              { label: q("emergYes"), value: "yes" },
              { label: q("emergMed"), value: "medium" },
              { label: q("emergNo"), value: "no" },
            ]);
            break;

          case "emergency":
            state.emergency = v;
            setStep("pastAttempt");
            await bot(s("askPastAttempt"));
            setReplies([
              { label: q("pastYes"), value: "often" },
              { label: q("pastOnce"), value: "once" },
              { label: q("pastNever"), value: "never" },
            ]);
            break;

          case "pastAttempt":
            state.pastAttempt = v;
            setStep("goal");
            await bot(s("askGoal"));
            setReplies([
              { label: q("goalRet"), value: "retention" },
              { label: q("goalPor"), value: "porosity" },
              { label: q("goalBreak"), value: "breakage" },
              { label: q("goalRoutine"), value: "routine" },
            ]);
            break;

          case "goal":
            state.goal = v;
            buildDiagnosis();
            break;

          case "done":
            if (v === "guide") window.open(CONFIG.guideLink, "_blank");
            if (v === "routine") window.open(CONFIG.routineLink, "_blank");
            if (v === "restart") start();
            break;
        }
      }

      /* ──────────────────────────────────────────────
   Start
──────────────────────────────────────────────── */
      function start() {
        // Reset state (keep lang)
        Object.keys(state).forEach((k) => {
          state[k] = typeof state[k] === "number" ? 0 : "";
        });
        setStep("name");
        setReplies([]);
        chat.innerHTML = "";
        addMsg(s("welcome"), "bot");
        setTimeout(() => bot(s("intro")), 280);
      }

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        handle(input.value);
      });

      /* ── One-time access system ── */
      const alreadyUsed = localStorage.getItem("hydracheck_used");

      const savedSession = localStorage.getItem("hydracheck_current_session");

      if (savedSession) {
        Object.assign(state, JSON.parse(savedSession));
      }

      applyLang();

      if (alreadyUsed === "yes") {
        // Remove form completely
        form.style.display = "none";
        quickBar.style.display = "none";

        chat.innerHTML = `
  
    <div style="
      min-height:75vh;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:24px;
    ">

      <div style="
  width:100%;
  max-width:520px;
  background:linear-gradient(145deg,#fffaf4,#fff2e8);
  border:1px solid rgba(176,123,56,.22);
  border-radius:24px;
  padding:26px 22px;
  text-align:center;
  box-shadow:0 14px 40px rgba(62,38,28,.10);
">

        <div style="
          width:68px;
          height:68px;
          margin:0 auto 22px;
          border-radius:50%;
          background:linear-gradient(135deg,#e4b4af,#d4a55e);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:36px;
          color:white;
          box-shadow:0 12px 30px rgba(176,123,56,.25);
        ">
          💛
        </div>

        <h2 style="
          font-family:'Cormorant Garamond',serif;
          font-size:42px;
          font-weight:500;
          margin-bottom:14px;
          color:#3e261c;
        ">
          ${
            lang === "fr"
              ? "Diagnostic déjà utilisé"
              : "Diagnostic Already Used"
          }
        </h2>

        <p style="
          font-size:15px;
          line-height:1.9;
          color:#8b6a5c;
          margin-bottom:28px;
        ">
          ${
            lang === "fr"
              ? "Tu as déjà utilisé ton diagnostic gratuit HydraCheck. Pour une nouvelle analyse personnalisée ou un accompagnement complet, contacte-moi directement."
              : "You already used your free HydraCheck diagnostic. For another personalised analysis or full support, contact me directly."
          }
        </p>

        <div style="
          display:grid;
          gap:14px;
        ">

          <a
            href="mailto:contacte.schicgirl@gmail.com"
            style="
              display:flex;
              align-items:center;
              justify-content:center;
              text-decoration:none;
              height:56px;
              border-radius:999px;
              background:#3e261c;
              color:white;
              font-weight:700;
              font-size:14px;
              transition:.2s;
              box-shadow:0 10px 24px rgba(62,38,28,.18);
            "
          >
            📧 ${lang === "fr" ? "Contacter par email" : "Contact by Email"}
          </a>

          <a
            href="https://facebook.com/schicgirl"
            target="_blank"
            style="
              display:flex;
              align-items:center;
              justify-content:center;
              text-decoration:none;
              height:56px;
              border-radius:999px;
              background:linear-gradient(135deg,#d4a55e,#b07b38);
              color:white;
              font-weight:700;
              font-size:14px;
              transition:.2s;
              box-shadow:0 10px 24px rgba(176,123,56,.22);
            "
          >
            📘 ${lang === "fr" ? "Message Facebook" : "Facebook Message"}
          </a>

        </div>

      </div>

    </div>
  `;
      } else {
        if (state.conversation.length) {
          state.conversation.forEach((msg) => {
            addMsg(msg.message, msg.sender === "user" ? "user" : "bot");
          });
        } else {
          start();
        }
      }
