// TODO: move auth to a backend before this holds anything sensitive
const ADMIN_PASSWORD_HASH = "eacb20f402c4738505df836b6cc58c054db7fbc3abe79ce7fc7520a906e3fcbb";
const STORE_KEY = "schicgirl_amazon_data";
const RATE_LIMIT_KEY = "schic_amazon_admin_attempts";
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000;

const $ = id => document.getElementById(id);

// ─── default data (matches the current page) ─────────────────────────
const DEFAULTS = {
  affiliateTag: "fofananabinto-20",
  copy: {
    hero_title_en: "Trusted Natural Hair Finds by <em>Porosity</em>",
    hero_title_fr: "Produits cheveux naturels par <em>porosité</em>",
    hero_sub_en: "Curated Amazon picks for type 4 hair — sorted by porosity, with notes on what actually works for which routine. Plus a DIY ingredient library when you want to make your own.",
    hero_sub_fr: "Sélection Amazon pour cheveux crépus — triée par porosité, avec des notes honnêtes sur ce qui marche selon ta routine. Plus une bibliothèque d'ingrédients DIY quand tu veux faire toi-même.",
    start_en: "Most of us have a shelf full of products we shouldn't have bought. The point of this page is to help you buy fewer things — by sorting picks by porosity and routine instead of by hype.",
    start_fr: "On a presque toutes une étagère de produits qu'on n'aurait pas dû acheter. L'idée de cette page : acheter moins, en triant les choix par porosité et routine au lieu du buzz.",
    disclosure_en: "I'm an Amazon Associate. If you buy through these links, I get a small commission at no extra cost to you — it's how this page stays free. I only include products I'd suggest to a friend with the same hair. Patch test new things, read labels, and trust your own scalp.",
    disclosure_fr: "Je suis affiliée Amazon. Si tu achètes via ces liens, je reçois une petite commission sans frais supplémentaires pour toi — c'est ce qui garde cette page gratuite. Je ne mets que des produits que je recommanderais à une amie qui a les mêmes cheveux. Fais un patch test, lis les étiquettes, et fais confiance à ton cuir chevelu."
  },
  products: [
  {
    "en": "As I Am Leave-In Conditioner",
    "fr": "Après-shampooing sans rinçage As I Am",
    "cat_en": "Leave-in",
    "cat_fr": "Sans rinçage",
    "por": "low",
    "goal_en": "Light moisture",
    "goal_fr": "Hydratation légère",
    "why_en": "Lightweight leave-in for curls/coils that need moisture without heavy buildup.",
    "why_fr": "Leave-in léger pour hydrater sans trop alourdir les cheveux.",
    "trust_en": "Popular textured-hair brand used in curly/coily routines.",
    "trust_fr": "Marque populaire pour cheveux texturés, souvent utilisée dans les routines bouclées/crépues.",
    "ing_en": "Botanical extracts, coconut, amla",
    "ing_fr": "Extraits botaniques, coco, amla",
    "url": "https://www.amazon.com/s?k=As+I+Am+Leave+In+Conditioner+8+oz",
    "id": "p_seed_0"
  },
  {
    "en": "Kinky-Curly Knot Today Leave-In Detangler",
    "fr": "Démêlant sans rinçage Kinky-Curly Knot Today",
    "cat_en": "Detangler",
    "cat_fr": "Démêlant",
    "por": "low",
    "goal_en": "Slip + detangling",
    "goal_fr": "Glissant + démêlage",
    "why_en": "A lighter detangling leave-in that helps reduce friction during styling.",
    "why_fr": "Démêlant léger qui aide à réduire les nœuds et la friction pendant le coiffage.",
    "trust_en": "Well-known staple in many natural hair routines.",
    "trust_fr": "Produit très connu dans de nombreuses routines de cheveux naturels.",
    "ing_en": "Marshmallow root, slippery elm, botanical blend",
    "ing_fr": "Racine de guimauve, orme rouge, mélange botanique",
    "url": "https://www.amazon.com/s?k=Kinky+Curly+Knot+Today+Leave+In+Detangler",
    "id": "p_seed_1"
  },
  {
    "en": "TGIN Rose Water Leave-In Conditioner",
    "fr": "Leave-in TGIN Rose Water",
    "cat_en": "Leave-in",
    "cat_fr": "Sans rinçage",
    "por": "low",
    "goal_en": "Hydration without heaviness",
    "goal_fr": "Hydratation sans lourdeur",
    "why_en": "Rose water formulas are often lighter than butter-heavy creams.",
    "why_fr": "Les formules à l’eau de rose sont souvent plus légères que les crèmes très riches.",
    "trust_en": "Recognized textured-hair brand with lightweight collections.",
    "trust_fr": "Marque reconnue pour cheveux texturés avec des gammes plus légères.",
    "ing_en": "Rose water, botanical extracts",
    "ing_fr": "Eau de rose, extraits botaniques",
    "url": "https://www.amazon.com/s?k=TGIN+Rose+Water+Leave+In+Conditioner",
    "id": "p_seed_2"
  },
  {
    "en": "Camille Rose Curl Love Moisture Milk",
    "fr": "Lait hydratant Camille Rose Curl Love",
    "cat_en": "Moisturizer",
    "cat_fr": "Crème hydratante",
    "por": "low",
    "goal_en": "Softness",
    "goal_fr": "Douceur",
    "why_en": "Good when hair needs a creamy product but not a very heavy butter.",
    "why_fr": "Utile quand les cheveux ont besoin d’une crème douce mais pas trop lourde.",
    "trust_en": "Popular natural hair brand known for creamy moisturizers.",
    "trust_fr": "Marque populaire de cheveux naturels connue pour ses crèmes hydratantes.",
    "ing_en": "Rice milk, macadamia oil, slippery elm",
    "ing_fr": "Lait de riz, huile de macadamia, orme rouge",
    "url": "https://www.amazon.com/s?k=Camille+Rose+Curl+Love+Moisture+Milk",
    "id": "p_seed_3"
  },
  {
    "en": "Mielle Pomegranate & Honey Leave-In Conditioner",
    "fr": "Leave-in Mielle Grenade & Miel",
    "cat_en": "Leave-in",
    "cat_fr": "Sans rinçage",
    "por": "normal",
    "goal_en": "Moisture + styling prep",
    "goal_fr": "Hydratation + préparation coiffage",
    "why_en": "Balanced leave-in for curls/coils that need moisture, slip, and frizz control.",
    "why_fr": "Leave-in équilibré pour hydrater, démêler et préparer le coiffage.",
    "trust_en": "Widely available textured-hair brand frequently used for type 4 styles.",
    "trust_fr": "Marque très accessible pour cheveux texturés, souvent utilisée pour le type 4.",
    "ing_en": "Pomegranate, honey, babassu oil",
    "ing_fr": "Grenade, miel, huile de babassu",
    "url": "https://www.amazon.com/s?k=Mielle+Pomegranate+Honey+Leave+In+Conditioner",
    "id": "p_seed_4"
  },
  {
    "en": "SheaMoisture Manuka Honey & Mafura Oil Masque",
    "fr": "Masque SheaMoisture Miel de Manuka & Huile de Mafura",
    "cat_en": "Deep conditioner",
    "cat_fr": "Soin profond",
    "por": "normal",
    "goal_en": "Deep moisture",
    "goal_fr": "Hydratation profonde",
    "why_en": "Useful when hair feels dry after shampoo or protective styles.",
    "why_fr": "Utile quand les cheveux sont secs après le shampooing ou une coiffure protectrice.",
    "trust_en": "Longstanding textured-hair brand with moisturizing mask options.",
    "trust_fr": "Marque reconnue pour cheveux texturés avec plusieurs soins hydratants.",
    "ing_en": "Manuka honey, mafura oil, fig extract",
    "ing_fr": "Miel de manuka, huile de mafura, extrait de figue",
    "url": "https://www.amazon.com/s?k=SheaMoisture+Manuka+Honey+Mafura+Oil+Intensive+Hydration+Masque",
    "id": "p_seed_5"
  },
  {
    "en": "Aunt Jackie's Quench Moisture Intensive Leave-In",
    "fr": "Leave-in hydratant Aunt Jackie’s Quench",
    "cat_en": "Leave-in",
    "cat_fr": "Sans rinçage",
    "por": "normal",
    "goal_en": "Affordable moisture",
    "goal_fr": "Hydratation accessible",
    "why_en": "Budget-friendly leave-in for wash day and daily refresh routines.",
    "why_fr": "Option accessible pour hydrater après le lavage ou rafraîchir les cheveux.",
    "trust_en": "Commonly used affordable natural hair product line.",
    "trust_fr": "Gamme abordable très utilisée dans les routines naturelles.",
    "ing_en": "Shea butter, olive oil, marshmallow root",
    "ing_fr": "Beurre de karité, huile d’olive, racine de guimauve",
    "url": "https://www.amazon.com/s?k=Aunt+Jackie%27s+Quench+Moisture+Intensive+Leave+In+Conditioner",
    "id": "p_seed_6"
  },
  {
    "en": "TGIN Honey Miracle Hair Mask",
    "fr": "Masque TGIN Honey Miracle",
    "cat_en": "Mask",
    "cat_fr": "Masque",
    "por": "normal",
    "goal_en": "Softness + moisture",
    "goal_fr": "Douceur + hydratation",
    "why_en": "A rich mask for dry-feeling strands and routine deep conditioning.",
    "why_fr": "Masque riche pour apporter douceur et hydratation en soin profond.",
    "trust_en": "Popular deep conditioner among natural hair communities.",
    "trust_fr": "Soin profond populaire dans les communautés de cheveux naturels.",
    "ing_en": "Raw honey, olive oil",
    "ing_fr": "Miel brut, huile d’olive",
    "url": "https://www.amazon.com/s?k=TGIN+Honey+Miracle+Hair+Mask",
    "id": "p_seed_7"
  },
  {
    "en": "Mielle Rosemary Mint Strengthening Leave-In",
    "fr": "Leave-in fortifiant Mielle Romarin & Menthe",
    "cat_en": "Strengthening leave-in",
    "cat_fr": "Leave-in fortifiant",
    "por": "high",
    "goal_en": "Strength + moisture",
    "goal_fr": "Force + hydratation",
    "why_en": "Helpful for fragile-feeling hair that needs moisture with strengthening support.",
    "why_fr": "Utile pour les cheveux fragiles qui ont besoin d’hydratation et de renforcement.",
    "trust_en": "Widely available brand; rosemary mint line is commonly used for strengthening routines.",
    "trust_fr": "Marque très accessible; la gamme romarin/menthe est souvent utilisée pour fortifier.",
    "ing_en": "Rosemary, mint, biotin",
    "ing_fr": "Romarin, menthe, biotine",
    "url": "https://www.amazon.com/s?k=Mielle+Rosemary+Mint+Strengthening+Leave+In+Conditioner",
    "id": "p_seed_8"
  },
  {
    "en": "ApHogee Two-Step Protein Treatment",
    "fr": "Traitement protéiné ApHogee Two-Step",
    "cat_en": "Protein treatment",
    "cat_fr": "Soin protéiné",
    "por": "high",
    "goal_en": "Protein repair",
    "goal_fr": "Réparation protéinée",
    "why_en": "For serious breakage or over-processed hair; use carefully and follow directions.",
    "why_fr": "Pour cheveux très cassants ou abîmés; à utiliser prudemment en suivant les instructions.",
    "trust_en": "Classic protein treatment used in many damage-repair routines.",
    "trust_fr": "Soin protéiné classique utilisé dans de nombreuses routines de réparation.",
    "ing_en": "Protein treatment system",
    "ing_fr": "Système de traitement protéiné",
    "url": "https://www.amazon.com/s?k=ApHogee+Two+Step+Protein+Treatment",
    "id": "p_seed_9"
  },
  {
    "en": "SheaMoisture Jamaican Black Castor Oil Leave-In",
    "fr": "Leave-in SheaMoisture Huile de Ricin Noire Jamaïcaine",
    "cat_en": "Strengthening leave-in",
    "cat_fr": "Leave-in fortifiant",
    "por": "high",
    "goal_en": "Breakage support",
    "goal_fr": "Soutien contre la casse",
    "why_en": "Richer option for hair that needs sealing, softness, and strengthening support.",
    "why_fr": "Option plus riche pour les cheveux qui ont besoin de douceur et de protection contre la casse.",
    "trust_en": "Well-known line often used for damaged or transitioning hair.",
    "trust_fr": "Gamme connue, souvent utilisée pour cheveux abîmés ou en transition.",
    "ing_en": "Jamaican black castor oil, shea butter, peppermint",
    "ing_fr": "Huile de ricin noire jamaïcaine, beurre de karité, menthe poivrée",
    "url": "https://www.amazon.com/s?k=SheaMoisture+Jamaican+Black+Castor+Oil+Leave+In+Conditioner",
    "id": "p_seed_10"
  },
  {
    "en": "Olaplex No. 3 Hair Perfector",
    "fr": "Olaplex No. 3 Hair Perfector",
    "cat_en": "Bond treatment",
    "cat_fr": "Soin réparateur",
    "por": "high",
    "goal_en": "Bond support",
    "goal_fr": "Réparation des liaisons",
    "why_en": "For color-treated, heat-damaged, or chemically processed hair needing bond care.",
    "why_fr": "Pour cheveux colorés, chauffés ou chimiquement traités qui ont besoin de réparation.",
    "trust_en": "Widely recognized bond-care product line.",
    "trust_fr": "Gamme très reconnue pour les soins réparateurs.",
    "ing_en": "Bond-building technology",
    "ing_fr": "Technologie réparatrice des liaisons",
    "url": "https://www.amazon.com/s?k=Olaplex+No+3+Hair+Perfector",
    "id": "p_seed_11"
  },
  {
    "en": "Mielle Rosemary Mint Scalp & Hair Strengthening Oil",
    "fr": "Huile cuir chevelu Mielle Romarin & Menthe",
    "cat_en": "Scalp oil",
    "cat_fr": "Huile cuir chevelu",
    "por": "all",
    "goal_en": "Scalp care",
    "goal_fr": "Soin du cuir chevelu",
    "why_en": "Good for scalp massage and sealing ends; use small amounts to avoid buildup.",
    "why_fr": "Bonne pour le massage du cuir chevelu et les pointes; utiliser peu pour éviter l’accumulation.",
    "trust_en": "Very popular rosemary-based oil in natural hair routines.",
    "trust_fr": "Huile au romarin très populaire dans les routines de cheveux naturels.",
    "ing_en": "Rosemary oil, mint, biotin blend",
    "ing_fr": "Huile de romarin, menthe, mélange à la biotine",
    "url": "https://www.amazon.com/s?k=Mielle+Rosemary+Mint+Scalp+Hair+Strengthening+Oil",
    "id": "p_seed_12"
  },
  {
    "en": "As I Am Dry & Itchy Scalp Care Shampoo",
    "fr": "Shampooing As I Am Dry & Itchy Scalp Care",
    "cat_en": "Scalp shampoo",
    "cat_fr": "Shampooing cuir chevelu",
    "por": "all",
    "goal_en": "Itchy scalp",
    "goal_fr": "Cuir chevelu qui démange",
    "why_en": "For flaky or itchy scalp routines when oiling alone is not enough.",
    "why_fr": "Pour les routines cuir chevelu sec/irrité quand les huiles seules ne suffisent pas.",
    "trust_en": "Textured-hair brand with a dedicated scalp-care line.",
    "trust_fr": "Marque pour cheveux texturés avec une gamme dédiée au cuir chevelu.",
    "ing_en": "Scalp care cleansing ingredients",
    "ing_fr": "Ingrédients nettoyants pour le cuir chevelu",
    "url": "https://www.amazon.com/s?k=As+I+Am+Dry+Itchy+Scalp+Care+Shampoo",
    "id": "p_seed_13"
  },
  {
    "en": "Design Essentials Almond & Avocado Detangling Shampoo",
    "fr": "Shampooing démêlant Design Essentials Amande & Avocat",
    "cat_en": "Moisturizing shampoo",
    "cat_fr": "Shampooing hydratant",
    "por": "all",
    "goal_en": "Gentle wash day",
    "goal_fr": "Lavage doux",
    "why_en": "Moisturizing shampoo option for coils that need cleansing without a stripped feeling.",
    "why_fr": "Shampooing hydratant pour nettoyer sans laisser les cheveux trop secs.",
    "trust_en": "Professional textured-hair brand used in salons and home routines.",
    "trust_fr": "Marque professionnelle pour cheveux texturés utilisée en salon et à la maison.",
    "ing_en": "Almond, avocado",
    "ing_fr": "Amande, avocat",
    "url": "https://www.amazon.com/s?k=Design+Essentials+Almond+Avocado+Detangling+Shampoo",
    "id": "p_seed_14"
  },
  {
    "en": "Eco Style Olive Oil Styling Gel",
    "fr": "Gel Eco Style à l’huile d’olive",
    "cat_en": "Gel",
    "cat_fr": "Gel coiffant",
    "por": "all",
    "goal_en": "Hold",
    "goal_fr": "Tenue",
    "why_en": "Classic gel for sleek styles, edges, buns, and some wash-and-go routines.",
    "why_fr": "Gel classique pour coiffures plaquées, chignons, baby hair et wash-and-go.",
    "trust_en": "Widely used styling gel; affordable and easy to find.",
    "trust_fr": "Gel coiffant très utilisé, accessible et facile à trouver.",
    "ing_en": "Olive oil styling gel",
    "ing_fr": "Gel coiffant à l’huile d’olive",
    "url": "https://www.amazon.com/s?k=Eco+Style+Olive+Oil+Styling+Gel",
    "id": "p_seed_15"
  },
  {
    "en": "The Doux Mousse Def Texture Foam",
    "fr": "Mousse coiffante The Doux Mousse Def",
    "cat_en": "Foam",
    "cat_fr": "Mousse coiffante",
    "por": "all",
    "goal_en": "Twist-outs + braid-outs",
    "goal_fr": "Twist-outs + braid-outs",
    "why_en": "Foam option for twist-outs, braid-outs, and setting styles without heavy buildup.",
    "why_fr": "Mousse pour twist-outs, braid-outs et coiffures définies sans trop d’accumulation.",
    "trust_en": "Popular styling brand in textured-hair spaces.",
    "trust_fr": "Marque de coiffage populaire dans les communautés de cheveux texturés.",
    "ing_en": "Foam styling formula",
    "ing_fr": "Formule mousse coiffante",
    "url": "https://www.amazon.com/s?k=The+Doux+Mousse+Def+Texture+Foam",
    "id": "p_seed_16"
  }
],
  diy: [
  {
    "en": "Raw Shea Butter",
    "fr": "Beurre de karité brut",
    "use_en": "Sealant, whipped creams, dry ends",
    "use_fr": "Sceller l’hydratation, crèmes fouettées, pointes sèches",
    "best_en": "High porosity, very dry hair, thick strands",
    "best_fr": "Forte porosité, cheveux très secs, cheveux épais",
    "warn_en": "Can be too heavy for low porosity or fine hair.",
    "warn_fr": "Peut être trop lourd pour faible porosité ou cheveux fins.",
    "url": "https://www.amazon.com/s?k=raw+unrefined+shea+butter+natural+hair",
    "id": "d_seed_0"
  },
  {
    "en": "Aloe Vera Gel / Juice",
    "fr": "Gel ou jus d’aloe vera",
    "use_en": "Hydration sprays, detangling, scalp soothing",
    "use_fr": "Sprays hydratants, démêlage, apaisement du cuir chevelu",
    "best_en": "All porosities, especially dry-feeling hair",
    "best_fr": "Toutes porosités, surtout cheveux secs au toucher",
    "warn_en": "Patch test first; some people are sensitive.",
    "warn_fr": "Fais un test avant; certaines personnes sont sensibles.",
    "url": "https://www.amazon.com/s?k=aloe+vera+gel+juice+natural+hair",
    "id": "d_seed_1"
  },
  {
    "en": "Jamaican Black Castor Oil",
    "fr": "Huile de ricin noire jamaïcaine",
    "use_en": "Scalp massage, edges, sealing ends",
    "use_fr": "Massage du cuir chevelu, tempes, pointes",
    "best_en": "High porosity, thick hair, dry ends",
    "best_fr": "Forte porosité, cheveux épais, pointes sèches",
    "warn_en": "Very thick; dilute with lighter oils if needed.",
    "warn_fr": "Très épaisse; diluer avec une huile plus légère si besoin.",
    "url": "https://www.amazon.com/s?k=Jamaican+black+castor+oil+natural+hair",
    "id": "d_seed_2"
  },
  {
    "en": "Rosemary Essential Oil",
    "fr": "Huile essentielle de romarin",
    "use_en": "Scalp oil blends only when diluted",
    "use_fr": "Mélanges pour cuir chevelu uniquement diluée",
    "best_en": "Scalp massage blends",
    "best_fr": "Mélanges pour massage du cuir chevelu",
    "warn_en": "Do not apply essential oils directly; dilute properly.",
    "warn_fr": "Ne pas appliquer directement; toujours diluer correctement.",
    "url": "https://www.amazon.com/s?k=rosemary+essential+oil+hair",
    "id": "d_seed_3"
  },
  {
    "en": "Grapeseed Oil",
    "fr": "Huile de pépins de raisin",
    "use_en": "Light sealing oil, scalp oil base",
    "use_fr": "Huile légère pour sceller, base d’huile cuir chevelu",
    "best_en": "Low/normal porosity, fine strands",
    "best_fr": "Faible/porosité normale, cheveux fins",
    "warn_en": "Use a small amount to avoid greasy hair.",
    "warn_fr": "Utiliser une petite quantité pour éviter l’effet gras.",
    "url": "https://www.amazon.com/s?k=grapeseed+oil+natural+hair",
    "id": "d_seed_4"
  },
  {
    "en": "Avocado Oil",
    "fr": "Huile d’avocat",
    "use_en": "Hot oil treatments, masks, sealing",
    "use_fr": "Bains d’huile, masques, scellage",
    "best_en": "Normal/high porosity, dry hair",
    "best_fr": "Porosité normale/forte, cheveux secs",
    "warn_en": "May feel heavy if overused.",
    "warn_fr": "Peut alourdir si trop utilisée.",
    "url": "https://www.amazon.com/s?k=avocado+oil+natural+hair",
    "id": "d_seed_5"
  },
  {
    "en": "Honey",
    "fr": "Miel",
    "use_en": "Humectant in masks and deep treatments",
    "use_fr": "Humectant dans les masques et soins profonds",
    "best_en": "Dry hair when climate is not extremely dry",
    "best_fr": "Cheveux secs quand le climat n’est pas trop sec",
    "warn_en": "Use carefully in very dry climates; rinse well.",
    "warn_fr": "À utiliser avec prudence en climat très sec; bien rincer.",
    "url": "https://www.amazon.com/s?k=raw+honey+hair+mask+natural+hair",
    "id": "d_seed_6"
  },
  {
    "en": "Flaxseeds",
    "fr": "Graines de lin",
    "use_en": "DIY flaxseed gel for twist-outs and definition",
    "use_fr": "Gel de lin maison pour twist-outs et définition",
    "best_en": "All porosities needing soft hold",
    "best_fr": "Toutes porosités qui veulent une tenue douce",
    "warn_en": "Refrigerate homemade gel and use quickly.",
    "warn_fr": "Conserver au frais et utiliser rapidement.",
    "url": "https://www.amazon.com/s?k=organic+flaxseeds+for+hair+gel",
    "id": "d_seed_7"
  },
  {
    "en": "Hibiscus Powder",
    "fr": "Poudre d’hibiscus",
    "use_en": "Shine rinses, herbal masks",
    "use_fr": "Rinçages brillance, masques aux plantes",
    "best_en": "Dull hair, softness routines",
    "best_fr": "Cheveux ternes, routines douceur",
    "warn_en": "Can tint very light hair or fabrics.",
    "warn_fr": "Peut colorer les cheveux très clairs ou les tissus.",
    "url": "https://www.amazon.com/s?k=hibiscus+powder+hair",
    "id": "d_seed_8"
  },
  {
    "en": "Slippery Elm Powder",
    "fr": "Poudre d’orme rouge",
    "use_en": "Slip for detangling sprays and masks",
    "use_fr": "Glissant pour sprays démêlants et masques",
    "best_en": "Tangled hair, tender-headed wash days",
    "best_fr": "Cheveux emmêlés, démêlage difficile",
    "warn_en": "Strain well to avoid residue.",
    "warn_fr": "Bien filtrer pour éviter les résidus.",
    "url": "https://www.amazon.com/s?k=slippery+elm+powder+hair",
    "id": "d_seed_9"
  }
]
};

let data = null;
let editingProductId = null;
let editingDiyId = null;
let pendingConfirm = null;
let dirty = false;

// ─── auth ────────────────────────────────────────────────────────────
async function sha256(text) {
  const buf = new TextEncoder().encode(text);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("");
}
function getAttempts() {
  try { return JSON.parse(sessionStorage.getItem(RATE_LIMIT_KEY) || '{"count":0,"until":0}'); }
  catch { return { count: 0, until: 0 }; }
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
  const hash = await sha256($("password").value);
  if (hash !== ADMIN_PASSWORD_HASH) {
    bumpAttempts();
    $("loginError").textContent = "Mot de passe incorrect.";
    $("loginError").style.display = "block";
    $("password").value = "";
    return;
  }
  clearAttempts();
  sessionStorage.setItem("schic_amazon_admin_logged", "true");
  showDashboard();
};
$("password").addEventListener("keydown", e => { if (e.key === "Enter") $("loginBtn").click(); });
$("logoutBtn").onclick = () => {
  sessionStorage.removeItem("schic_amazon_admin_logged");
  location.reload();
};

function showDashboard() {
  $("login").classList.add("hidden");
  $("dashboard").classList.remove("hidden");
  $("logoutBtn").classList.remove("hidden");
  loadData();
  renderAll();
}

// ─── data ────────────────────────────────────────────────────────────
function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (saved && saved.products) {
      data = saved;
      // Backfill copy/affiliateTag in case of older save
      data.affiliateTag = data.affiliateTag || DEFAULTS.affiliateTag;
      data.copy = { ...DEFAULTS.copy, ...(data.copy || {}) };
    } else {
      data = JSON.parse(JSON.stringify(DEFAULTS));
    }
  } catch (e) {
    data = JSON.parse(JSON.stringify(DEFAULTS));
  }
  // Add ids if missing
  data.products.forEach(p => { if (!p.id) p.id = generateId("p"); });
  data.diy.forEach(d => { if (!d.id) d.id = generateId("d"); });
}
function saveData() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    setDirty(true);
  } catch (e) {
    toast("Sauvegarde impossible (stockage plein ?).", "err");
  }
}
function generateId(prefix) {
  return prefix + "_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6);
}
function setDirty(d) {
  dirty = d;
  if (d) {
    $("publishBanner").classList.add("dirty");
    $("publishText").innerHTML = `<span class="dot-dirty"></span><strong>Modifications non publiées.</strong><br>Clique sur <strong>Publier sur le site</strong> pour mettre la page publique à jour.`;
  } else {
    $("publishBanner").classList.remove("dirty");
    $("publishText").innerHTML = `<strong>Toutes les modifications sont publiées.</strong><br>Ta page publique est à jour.`;
  }
}

// ─── render ──────────────────────────────────────────────────────────
function renderAll() {
  renderStats();
  renderProducts();
  renderDiy();
  renderCopy();
  renderSettings();
}

function renderStats() {
  $("statProducts").textContent = data.products.length;
  $("statDiy").textContent = data.diy.length;
  const porosities = new Set(data.products.map(p => p.por).filter(Boolean));
  $("statPorosities").textContent = porosities.size;
  const cats = new Set(data.products.map(p => p.cat_en).filter(Boolean));
  $("statCategories").textContent = cats.size;
}

function renderProducts() {
  const q = $("productSearch").value.trim().toLowerCase();
  const filter = $("productFilter").value;

  let list = data.products.slice();

  if (q) {
    list = list.filter(p =>
      (p.en || "").toLowerCase().includes(q) ||
      (p.fr || "").toLowerCase().includes(q) ||
      (p.cat_en || "").toLowerCase().includes(q) ||
      (p.ing_en || "").toLowerCase().includes(q) ||
      (p.goal_en || "").toLowerCase().includes(q)
    );
  }
  if (filter) {
    list = list.filter(p => p.por === filter);
  }

  if (list.length === 0) {
    $("productsList").innerHTML = `<div class="empty">
      <div class="big">🛍️</div>
      <p>${q || filter ? "Aucun produit ne correspond à ces filtres." : "Aucun produit. Clique sur « Nouveau produit » pour commencer."}</p>
    </div>`;
    return;
  }

  $("productsList").innerHTML = list.map(p => `
    <div class="item">
      <div class="item-icon">${p.img ? `<img src="${esc(p.img)}" alt="" onerror="this.parentElement.innerHTML='${productIcon(p)}'">` : productIcon(p)}</div>
      <div class="item-meta">
        <strong>${esc(p.en || "(sans nom)")}</strong>
        <small>${esc(p.fr || "")}</small>
        <div class="item-tags">
          <span class="porosity-tag porosity-${p.por || "all"}">${porosityLabel(p.por)}</span>
          ${p.cat_en ? `<span class="cat-tag">${esc(p.cat_en)}</span>` : ""}
        </div>
      </div>
      <div class="item-actions">
        <button class="btn btn-outline btn-sm" data-edit-product="${esc(p.id)}">✎ Modifier</button>
      </div>
    </div>
  `).join("");
}

function renderDiy() {
  const q = $("diySearch").value.trim().toLowerCase();
  let list = data.diy.slice();
  if (q) {
    list = list.filter(d =>
      (d.en || "").toLowerCase().includes(q) ||
      (d.fr || "").toLowerCase().includes(q) ||
      (d.use_en || "").toLowerCase().includes(q)
    );
  }
  if (list.length === 0) {
    $("diyList").innerHTML = `<div class="empty">
      <div class="big">🌿</div>
      <p>${q ? "Aucun ingrédient ne correspond." : "Aucun ingrédient. Clique sur « Nouvel ingrédient » pour commencer."}</p>
    </div>`;
    return;
  }
  $("diyList").innerHTML = list.map(d => `
    <div class="item">
      <div class="item-icon">${d.img ? `<img src="${esc(d.img)}" alt="" onerror="this.parentElement.innerHTML='${diyIcon(d.en)}'">` : diyIcon(d.en)}</div>
      <div class="item-meta">
        <strong>${esc(d.en || "(sans nom)")}</strong>
        <small>${esc(d.fr || "")}</small>
      </div>
      <div class="item-actions">
        <button class="btn btn-outline btn-sm" data-edit-diy="${esc(d.id)}">✎ Modifier</button>
      </div>
    </div>
  `).join("");
}

function renderCopy() {
  $("copy_hero_title_en").value = data.copy.hero_title_en || "";
  $("copy_hero_title_fr").value = data.copy.hero_title_fr || "";
  $("copy_hero_sub_en").value = data.copy.hero_sub_en || "";
  $("copy_hero_sub_fr").value = data.copy.hero_sub_fr || "";
  $("copy_start_en").value = data.copy.start_en || "";
  $("copy_start_fr").value = data.copy.start_fr || "";
  $("copy_disclosure_en").value = data.copy.disclosure_en || "";
  $("copy_disclosure_fr").value = data.copy.disclosure_fr || "";
}

function renderSettings() {
  $("affiliateTag").value = data.affiliateTag || "";
}

// ─── interactions ────────────────────────────────────────────────────
$("productSearch").addEventListener("input", renderProducts);
$("productFilter").addEventListener("change", renderProducts);
$("diySearch").addEventListener("input", renderDiy);

document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`[data-panel="${btn.dataset.tab}"]`).classList.add("active");
  };
});

document.addEventListener("click", e => {
  const t = e.target.closest("[data-edit-product],[data-edit-diy],[data-close-modal]");
  if (!t) return;
  if (t.dataset.editProduct) openProductModal(t.dataset.editProduct);
  else if (t.dataset.editDiy) openDiyModal(t.dataset.editDiy);
  else if (t.hasAttribute("data-close-modal")) closeModals();
});

document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeModals();
});

function closeModals() {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("open"));
  editingProductId = null;
  editingDiyId = null;
  pendingConfirm = null;
}

// ─── product modal ───────────────────────────────────────────────────
$("addProductBtn").onclick = () => openProductModal(null);

function openProductModal(id) {
  editingProductId = id;
  const p = id ? data.products.find(x => x.id === id) : null;
  $("productModalTitle").textContent = id ? "Modifier le produit" : "Ajouter un produit";
  $("productModalId").textContent = id ? `ID ${id}` : "Nouveau produit";
  $("p_en").value = p?.en || "";
  $("p_fr").value = p?.fr || "";
  $("p_cat_en").value = p?.cat_en || "";
  $("p_cat_fr").value = p?.cat_fr || "";
  $("p_goal_en").value = p?.goal_en || "";
  $("p_goal_fr").value = p?.goal_fr || "";
  $("p_por").value = p?.por || "all";
  $("p_why_en").value = p?.why_en || "";
  $("p_why_fr").value = p?.why_fr || "";
  $("p_trust_en").value = p?.trust_en || "";
  $("p_trust_fr").value = p?.trust_fr || "";
  $("p_ing_en").value = p?.ing_en || "";
  $("p_ing_fr").value = p?.ing_fr || "";
  $("p_url").value = stripTag(p?.url || "");
  $("p_img").value = p?.img || "";
  updateImgPreview("p_imgPreview", "p_imgInfo", p?.img || "");
  $("deleteProductBtn").style.display = id ? "" : "none";
  $("productModal").classList.add("open");
}

$("saveProductBtn").onclick = () => {
  const url = $("p_url").value.trim();
  const fields = {
    en: $("p_en").value.trim(),
    fr: $("p_fr").value.trim(),
    cat_en: $("p_cat_en").value.trim(),
    cat_fr: $("p_cat_fr").value.trim(),
    goal_en: $("p_goal_en").value.trim(),
    goal_fr: $("p_goal_fr").value.trim(),
    por: $("p_por").value,
    why_en: $("p_why_en").value.trim(),
    why_fr: $("p_why_fr").value.trim(),
    trust_en: $("p_trust_en").value.trim(),
    trust_fr: $("p_trust_fr").value.trim(),
    ing_en: $("p_ing_en").value.trim(),
    ing_fr: $("p_ing_fr").value.trim(),
    img: $("p_img").value.trim(),
    url
  };
  if (!fields.en && !fields.fr) {
    toast("Au moins un nom (EN ou FR), merci.", "err");
    return;
  }
  if (editingProductId) {
    const idx = data.products.findIndex(p => p.id === editingProductId);
    if (idx >= 0) data.products[idx] = { ...data.products[idx], ...fields };
    toast("Produit modifié.", "ok");
  } else {
    data.products.push({ id: generateId("p"), ...fields });
    toast("Produit ajouté.", "ok");
  }
  saveData();
  renderAll();
  closeModals();
};

$("deleteProductBtn").onclick = () => {
  if (!editingProductId) return;
  const p = data.products.find(x => x.id === editingProductId);
  if (!p) return;
  $("confirmTitle").textContent = "Supprimer ce produit ?";
  $("confirmText").innerHTML = `<strong>${esc(p.en || "(sans nom)")}</strong><br><br>Le produit sera retiré de la liste publique au prochain téléchargement.`;
  pendingConfirm = () => {
    data.products = data.products.filter(x => x.id !== editingProductId);
    saveData();
    renderAll();
    toast("Produit supprimé.", "ok");
    closeModals();
  };
  $("confirmModal").classList.add("open");
};

// ─── diy modal ───────────────────────────────────────────────────────
$("addDiyBtn").onclick = () => openDiyModal(null);

function openDiyModal(id) {
  editingDiyId = id;
  const d = id ? data.diy.find(x => x.id === id) : null;
  $("diyModalTitle").textContent = id ? "Modifier l'ingrédient" : "Ajouter un ingrédient";
  $("diyModalId").textContent = id ? `ID ${id}` : "Nouvel ingrédient";
  $("d_en").value = d?.en || "";
  $("d_fr").value = d?.fr || "";
  $("d_use_en").value = d?.use_en || "";
  $("d_use_fr").value = d?.use_fr || "";
  $("d_best_en").value = d?.best_en || "";
  $("d_best_fr").value = d?.best_fr || "";
  $("d_warn_en").value = d?.warn_en || "";
  $("d_warn_fr").value = d?.warn_fr || "";
  $("d_url").value = stripTag(d?.url || "");
  $("d_img").value = d?.img || "";
  updateImgPreview("d_imgPreview", "d_imgInfo", d?.img || "");
  $("deleteDiyBtn").style.display = id ? "" : "none";
  $("diyModal").classList.add("open");
}

$("saveDiyBtn").onclick = () => {
  const fields = {
    en: $("d_en").value.trim(),
    fr: $("d_fr").value.trim(),
    use_en: $("d_use_en").value.trim(),
    use_fr: $("d_use_fr").value.trim(),
    best_en: $("d_best_en").value.trim(),
    best_fr: $("d_best_fr").value.trim(),
    warn_en: $("d_warn_en").value.trim(),
    warn_fr: $("d_warn_fr").value.trim(),
    img: $("d_img").value.trim(),
    url: $("d_url").value.trim()
  };
  if (!fields.en && !fields.fr) {
    toast("Au moins un nom (EN ou FR), merci.", "err");
    return;
  }
  if (editingDiyId) {
    const idx = data.diy.findIndex(d => d.id === editingDiyId);
    if (idx >= 0) data.diy[idx] = { ...data.diy[idx], ...fields };
    toast("Ingrédient modifié.", "ok");
  } else {
    data.diy.push({ id: generateId("d"), ...fields });
    toast("Ingrédient ajouté.", "ok");
  }
  saveData();
  renderAll();
  closeModals();
};

$("deleteDiyBtn").onclick = () => {
  if (!editingDiyId) return;
  const d = data.diy.find(x => x.id === editingDiyId);
  if (!d) return;
  $("confirmTitle").textContent = "Supprimer cet ingrédient ?";
  $("confirmText").innerHTML = `<strong>${esc(d.en || "(sans nom)")}</strong><br><br>L'ingrédient sera retiré au prochain téléchargement.`;
  pendingConfirm = () => {
    data.diy = data.diy.filter(x => x.id !== editingDiyId);
    saveData();
    renderAll();
    toast("Ingrédient supprimé.", "ok");
    closeModals();
  };
  $("confirmModal").classList.add("open");
};

// ─── copy tab save ───────────────────────────────────────────────────
$("saveCopyBtn").onclick = () => {
  data.copy = {
    hero_title_en: $("copy_hero_title_en").value,
    hero_title_fr: $("copy_hero_title_fr").value,
    hero_sub_en: $("copy_hero_sub_en").value,
    hero_sub_fr: $("copy_hero_sub_fr").value,
    start_en: $("copy_start_en").value,
    start_fr: $("copy_start_fr").value,
    disclosure_en: $("copy_disclosure_en").value,
    disclosure_fr: $("copy_disclosure_fr").value
  };
  saveData();
  toast("Textes enregistrés.", "ok");
};

// ─── settings tab ────────────────────────────────────────────────────
$("affiliateTag").addEventListener("change", () => {
  data.affiliateTag = $("affiliateTag").value.trim();
  saveData();
  toast("Identifiant Amazon enregistré.", "ok");
});

$("exportAllBtn").onclick = () => {
  downloadBlob(JSON.stringify(data, null, 2), `schicgirl-amazon-backup-${todayStr()}.json`, "application/json");
  toast("Sauvegarde téléchargée.", "ok");
};

$("importBtn").onclick = () => $("importFile").click();
$("importFile").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.products && !parsed.diy) throw new Error("invalid");
      data = {
        affiliateTag: parsed.affiliateTag || DEFAULTS.affiliateTag,
        copy: { ...DEFAULTS.copy, ...(parsed.copy || {}) },
        products: parsed.products || [],
        diy: parsed.diy || []
      };
      data.products.forEach(p => { if (!p.id) p.id = generateId("p"); });
      data.diy.forEach(d => { if (!d.id) d.id = generateId("d"); });
      saveData();
      renderAll();
      toast("Sauvegarde restaurée.", "ok");
    } catch (err) {
      toast("Fichier invalide.", "err");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
});

$("resetBtn").onclick = () => {
  $("confirmTitle").textContent = "Réinitialiser toutes les données ?";
  $("confirmText").innerHTML = "Cela remettra l'admin dans son état d'origine.<br><strong>Tous tes produits et modifications seront perdus</strong> (sauf si tu as une sauvegarde JSON).";
  pendingConfirm = () => {
    data = JSON.parse(JSON.stringify(DEFAULTS));
    saveData();
    renderAll();
    toast("Réinitialisation effectuée.", "ok");
    closeModals();
  };
  $("confirmModal").classList.add("open");
};

$("confirmYes").onclick = () => { if (pendingConfirm) pendingConfirm(); };

// ─── publish (download amazon-data.json) ─────────────────────────────
$("publishBtn").onclick = () => {
  // Build the payload that the public page will fetch.
  // We apply the affiliate tag to all URLs at publish time so the public
  // page doesn't need to do it.
  const tag = data.affiliateTag || "";
  const payload = {
    generatedAt: new Date().toISOString(),
    affiliateTag: tag,
    copy: data.copy,
    products: data.products.map(p => ({ ...p, url: applyTag(p.url, tag) })),
    diy: data.diy.map(d => ({ ...d, url: applyTag(d.url, tag) }))
  };
  downloadBlob(JSON.stringify(payload, null, 2), "amazon-data.json", "application/json");
  toast("amazon-data.json téléchargé. (Secours — préfère le bouton « Publier sur le site ».)", "ok");
};

// ─── GitHub publishing (one-click, no file handling) ─────────────────
const GH_KEY = "schic_amazon_gh_cfg";
function getGhCfg() {
  let c = {};
  try { c = JSON.parse(localStorage.getItem(GH_KEY) || "{}"); } catch (e) {}
  return {
    owner: c.owner || "", repo: c.repo || "",
    branch: c.branch || "main", path: c.path || "amazon-data.json",
    token: c.token || ""
  };
}
function loadGhCfgIntoForm() {
  const c = getGhCfg();
  if (!$("gh_owner")) return;
  $("gh_owner").value = c.owner; $("gh_repo").value = c.repo;
  $("gh_branch").value = c.branch; $("gh_path").value = c.path;
  $("gh_token").value = c.token;
  updateGhStatus();
}
function updateGhStatus() {
  const c = getGhCfg(), el = $("ghStatus");
  if (!el) return;
  if (c.owner && c.repo && c.token) {
    el.textContent = "✅ Configuré";
    el.style.color = "#3f7d3f";
  } else {
    el.textContent = "⚠️ À configurer";
    el.style.color = "#b06a1e";
  }
}
function buildPayload() {
  const tag = data.affiliateTag || "";
  return {
    generatedAt: new Date().toISOString(),
    affiliateTag: tag,
    copy: data.copy,
    products: data.products.map(p => ({ ...p, url: applyTag(p.url, tag) })),
    diy: data.diy.map(d => ({ ...d, url: applyTag(d.url, tag) }))
  };
}
// UTF-8 safe base64 (handles French accents, é, à, etc.)
function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin);
}
async function ghErrMessage(res) {
  try { const j = await res.json(); return j.message || ("HTTP " + res.status); }
  catch (e) { return "HTTP " + res.status; }
}
function ghApiUrl(c) {
  const path = c.path.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${path}`;
}
function ghHeaders(c) {
  return {
    "Authorization": "Bearer " + c.token,
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}
async function publishToGitHub() {
  const c = getGhCfg();
  if (!c.owner || !c.repo || !c.token) {
    toast("Renseigne d'abord les réglages GitHub.", "error");
    const s = $("ghSettings"); if (s) s.open = true;
    return;
  }
  const btn = $("publishGithubBtn");
  const original = btn.textContent;
  btn.disabled = true; btn.textContent = "⏳ Publication…";
  try {
    const content = utf8ToBase64(JSON.stringify(buildPayload(), null, 2));
    const url = ghApiUrl(c), headers = ghHeaders(c);
    // 1. look up existing file SHA (needed to update; 404 means create new)
    let sha;
    const getRes = await fetch(`${url}?ref=${encodeURIComponent(c.branch)}`, { headers });
    if (getRes.ok) { sha = (await getRes.json()).sha; }
    else if (getRes.status !== 404) { throw new Error(await ghErrMessage(getRes)); }
    // 2. write the file
    const body = { message: "Update amazon-data.json via Schicgirl admin", content, branch: c.branch };
    if (sha) body.sha = sha;
    const putRes = await fetch(url, { method: "PUT", headers, body: JSON.stringify(body) });
    if (!putRes.ok) { throw new Error(await ghErrMessage(putRes)); }
    setDirty(false);
    toast("✅ Publié ! La page publique se met à jour dans ~1 minute.", "ok");
  } catch (e) {
    toast("Échec : " + e.message, "error");
  } finally {
    btn.disabled = false; btn.textContent = original;
  }
}
async function testGhConnection() {
  const c = getGhCfg();
  if (!c.owner || !c.repo || !c.token) { toast("Remplis owner, repo et token d'abord.", "error"); return; }
  const btn = $("ghTestBtn"), original = btn.textContent;
  btn.disabled = true; btn.textContent = "⏳ Test…";
  try {
    const res = await fetch(`https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}`, { headers: ghHeaders(c) });
    if (!res.ok) throw new Error(await ghErrMessage(res));
    const j = await res.json();
    if (j.permissions && (j.permissions.push || j.permissions.admin)) {
      toast("✅ Connexion OK — accès en écriture confirmé.", "ok");
    } else {
      toast("Connecté, mais le token n'a pas l'accès en écriture sur ce dépôt.", "error");
    }
  } catch (e) {
    toast("Test échoué : " + e.message, "error");
  } finally {
    btn.disabled = false; btn.textContent = original;
  }
}
$("publishGithubBtn").onclick = publishToGitHub;
$("ghTestBtn").onclick = testGhConnection;
$("ghSaveBtn").onclick = () => {
  const cfg = {
    owner: $("gh_owner").value.trim(),
    repo: $("gh_repo").value.trim(),
    branch: $("gh_branch").value.trim() || "main",
    path: $("gh_path").value.trim() || "amazon-data.json",
    token: $("gh_token").value.trim()
  };
  localStorage.setItem(GH_KEY, JSON.stringify(cfg));
  updateGhStatus();
  toast("Réglages GitHub enregistrés.", "ok");
};
loadGhCfgIntoForm();

// ─── image picker ────────────────────────────────────────────────────
// Refresh the small preview tile + the info line (size warning) for one
// of the two image pickers (product or DIY). `src` is either a URL or a
// data: URI; we don't care, browsers handle both.
function updateImgPreview(previewId, infoId, src) {
  const preview = $(previewId);
  const info = $(infoId);
  if (!preview) return;
  if (src) {
    // Show the image. If it fails to load (broken URL), fall back to the placeholder.
    preview.innerHTML = `<img src="${esc(src)}" alt="" onerror="this.parentElement.innerHTML='';this.parentElement.removeAttribute('style')">`;
  } else {
    preview.innerHTML = "";
  }
  if (!info) return;
  // Size warning for base64 images
  if (src && src.startsWith("data:")) {
    const kb = Math.round(src.length / 1024);
    if (kb > 200) {
      info.className = "file-info warn";
      info.textContent = `⚠ Image volumineuse (${kb} Ko). Pour de meilleures performances, héberge-la sur Cloudinary ou utilise l'URL Amazon directe.`;
    } else {
      info.className = "file-info";
      info.textContent = `Image intégrée (${kb} Ko). OK pour quelques produits ; au-delà, préfère une URL.`;
    }
  } else if (src) {
    info.className = "file-info";
    info.textContent = "Image chargée depuis une URL externe (rapide, léger).";
  } else {
    info.className = "file-info";
    info.textContent = "Astuce : clic droit sur une image Amazon → \"Copier l'adresse de l'image\" → colle ici. Plus rapide et léger qu'un upload.";
  }
}

// Read a File from a <input type=file>, return a data: URI string.
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}

// Hook up both image pickers (product + DIY) the same way.
function wireImagePicker(prefix) {
  const urlInput = $(`${prefix}_img`);
  const fileInput = $(`${prefix}_imgFile`);
  const uploadBtn = $(`${prefix}_imgUploadBtn`);
  const clearBtn = $(`${prefix}_imgClearBtn`);
  const previewId = `${prefix}_imgPreview`;
  const infoId = `${prefix}_imgInfo`;

  urlInput.addEventListener("input", () => {
    updateImgPreview(previewId, infoId, urlInput.value.trim());
  });
  uploadBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", async e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast("Ce fichier n'est pas une image.", "err");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast("Image trop grande (max 2 Mo). Compresse-la d'abord.", "err");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file);
      urlInput.value = dataUrl;
      updateImgPreview(previewId, infoId, dataUrl);
    } catch (err) {
      toast("Impossible de lire le fichier.", "err");
    }
    e.target.value = "";
  });
  clearBtn.addEventListener("click", () => {
    urlInput.value = "";
    updateImgPreview(previewId, infoId, "");
  });
}
wireImagePicker("p");
wireImagePicker("d");

// ─── helpers ─────────────────────────────────────────────────────────
function applyTag(url, tag) {
  if (!url) return url;
  if (!tag) return url;
  // Remove any existing ?tag= or &tag= and add the current one
  let cleaned = url.replace(/([?&])tag=[^&]*&?/g, "$1").replace(/[?&]$/, "");
  const sep = cleaned.includes("?") ? "&" : "?";
  return cleaned + sep + "tag=" + encodeURIComponent(tag);
}
function stripTag(url) {
  if (!url) return "";
  return url.replace(/([?&])tag=[^&]*&?/g, "$1").replace(/[?&]$/, "");
}
function porosityLabel(p) {
  return { low: "Faible", normal: "Normale", high: "Forte", all: "Toutes" }[p] || "Toutes";
}
function productIcon(p) {
  const c = (p.cat_en || "").toLowerCase();
  if (c.includes("shampoo")) return "🫧";
  if (c.includes("mask") || c.includes("deep")) return "🍯";
  if (c.includes("oil")) return "🌿";
  if (c.includes("protein") || c.includes("bond")) return "💪";
  if (c.includes("gel") || c.includes("foam")) return "✨";
  return "🧴";
}
function diyIcon(name) {
  name = (name || "").toLowerCase();
  if (name.includes("shea")) return "🧈";
  if (name.includes("aloe")) return "🌱";
  if (name.includes("castor")) return "🖤";
  if (name.includes("rosemary")) return "🌿";
  if (name.includes("honey")) return "🍯";
  if (name.includes("flax")) return "🌾";
  if (name.includes("hibiscus")) return "🌺";
  return "🧴";
}
function esc(v) {
  return String(v ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
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

// ─── boot ────────────────────────────────────────────────────────────
if (sessionStorage.getItem("schic_amazon_admin_logged") === "true") showDashboard();
