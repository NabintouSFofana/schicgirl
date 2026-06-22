# Automation Setup Runbook — "Stop the Breakage: A 21-Day Length Retention Challenge"

**Audience for this doc:** the one non-technical owner who will launch this.
Follow it top to bottom. Every step is something you click, paste, or type — no code.

**Stack reminder:** Selar = checkout + file delivery. ESP = your email tool (Brevo /
MailerLite-style automations). Site = bilingual `/fr/` + `/en/` static pages.
Facebook = launch traffic. Everything must exist in **both FR and EN**, with matching
behaviour — that's "bilingual parity," and it's non-negotiable.

**The honest-promise guardrail (applies to EVERY subject line, ad, and button):**
never promise length. The hair grows ~1–1.5 cm/month no matter what. We only ever
promise *less breakage* + *a 5-minute routine that sticks*. If a subject line implies
"longer hair in 21 days," it does not ship.

---

## 0. Before you touch anything — gather these

- [ ] Final PDFs exported into `products/21-day-breakage-challenge/dist/`:
  - `workbook-fr.pdf`, `workbook-en.pdf`
  - `tracker-fr.pdf`, `tracker-en.pdf`
  *(dist/ is currently empty — the product is not deliverable until these four files exist.)*
- [ ] The 6 email texts (file `05-email-sequence.md`) in **FR and EN**.
- [ ] Your privacy-policy URLs: `/fr/confidentialite` and `/en/privacy` (or wherever they live).
- [ ] Your sender domain set up in the ESP (see §6).

---

## 1. Selar product setup

### 1.1 Create the product
1. Selar dashboard → **Products → Add Product → Digital Product / File**.
2. Because the brand is bilingual, the cleanest approach is **two Selar products**, one
   per language, so the buyer gets the right-language files and the right-language emails
   automatically:
   - **FR:** *Stop la Casse — Le Défi Rétention 21 Jours*
   - **EN:** *Stop the Breakage — 21-Day Length Retention Challenge*
   *(One combined product with both languages bundled is the fallback if you want a single
   link, but then the buyer gets all four PDFs and you lose clean language routing. Prefer two.)*

### 1.2 Files to attach (post-purchase delivery)
- FR product → attach `workbook-fr.pdf` + `tracker-fr.pdf`
- EN product → attach `workbook-en.pdf` + `tracker-en.pdf`

Selar delivers the files automatically on its own thank-you/download page **and** in
Selar's own purchase-confirmation email. Email 1 from your ESP (§3) is the *branded*
delivery on top of that — both carry the download links so nobody is ever stuck.

### 1.3 PRICE — recommendation

**Recommended: a low "tripwire" / activation price.**

- **EUR market: €5–€7** (anchor at **€6**).
- **West-Africa / XOF market: 2 000–3 500 FCFA** (anchor at **~3 000 FCFA**).

**Rationale.** This product is the *activation layer* on the ladder
(Entry → **Grow** → Type 4 Hair Routine System). Its job is not profit — it's to convert a
free-gift subscriber into a **paying** customer (the single hardest step in any funnel) and
to earn the right to upsell Grow and the flagship. So:
- Price it clearly **below Grow** so Grow still feels like the bigger commitment/value.
- Keep it high enough to filter for real intent and to feel "worth saving to your phone,"
  but low enough to be an impulse yes after a Facebook post.
- A round, friction-free number (€6 / 3 000 FCFA) reads as an easy decision on mobile.
- **Do not** discount it to free — free buyers don't graduate; a small paid commitment is
  exactly what predicts a Day-21 finisher.

### 1.4 Upsell links (set inside each Selar product)
Selar lets you add an **upsell / "recommended next" link** and a thank-you-page link.

- **Entry → Grow:** on the Challenge thank-you page + in the Selar confirmation, add
  "Want the full *why*? → **Grow** ebook." Use the matching-language Grow link.
- **Day-21 → flagship:** the Day-21 email (Email 5) carries the **Type 4 Hair Routine System**
  link — that's the graduation upsell. Put the flagship link in your ESP for Email 5 (§3),
  not on the immediate Selar thank-you page (Day-21 buyers aren't ready at minute one).

> **Action:** confirm the live Selar URLs for Grow (FR/EN) and the Routine System (FR/EN)
> before launch and drop them in the table in §7. The Selar storefront is
> `selar.com/m/schicgirl`.

---

## 2. Opt-in capture → tag → trigger flow

Two entry paths feed the same machine:

**Path A — Free-gift subscriber who then buys** (most common): they're already on the list
from a lead magnet (see `assets/site.json` "gifts"). When they buy the Challenge on Selar,
the purchase is the trigger.

**Path B — Direct Challenge buyer from Facebook:** buys on Selar with no prior opt-in. The
Selar purchase still creates/updates their contact.

### 2.1 Connect Selar → ESP
- Easiest: Selar → **Integrations / Webhooks** → connect your ESP (or pipe via Zapier/Make
  if no native integration). On every Challenge purchase, push the buyer's **email + first
  name + language** into the ESP.
- If no integration exists, use the ESP's **"add to automation on form/landing"** and have
  the Selar thank-you page redirect to an ESP confirmation — but the webhook is cleaner.

### 2.2 Fields to capture
- `email` (required)
- `first_name`
- `language` = `fr` or `en` (set by *which* product they bought — this is why two products matter)
- `product` = `challenge`
- `purchase_date` (used for the Day-1/7/14/21 timing)

### 2.3 Tag names (use these exact strings)
- `challenge-buyer` — applied to every Challenge purchaser.
- `lang-fr` / `lang-en` — language routing tag.
- `challenge-active` — added at Email 1, removed at Email 5 (graduation) so only in-flight
  people get the recovery nudge.
- `challenge-graduate` — added at Email 5; this is the audience for future flagship offers.
- (optional, only if log-tracking is wired) `logged-recent` — set when a buyer logs a day;
  its **absence for 2+ days** triggers the recovery email.

### 2.4 Language routing rule
- FR purchase → tag `lang-fr` → enters the **FR** automation (FR emails, FR PDFs, FR links).
- EN purchase → tag `lang-en` → enters the **EN** automation.
- Build the automation **twice, once per language.** Same steps, same timing, same logic —
  only the text and links differ. That is bilingual parity.

### 2.5 Thank-you / delivery
- Selar's native thank-you page + confirmation deliver the files instantly.
- Your ESP's **Email 1** (fires immediately on the `challenge-buyer` tag) is the branded
  delivery and onboarding — it repeats the workbook + tracker download links so the buyer
  always has them.

---

## 3. ESP sequence — map the 6 emails to automation steps

Build **one automation per language.** Entry trigger: tag `challenge-buyer` is added
(i.e. a Challenge purchase). On entry, also add `challenge-active`.

Timing is measured from **enrolment (purchase) = Day 0**.

| Step | Email | Send timing | Audience / condition | Notes |
|---|---|---|---|---|
| 1 | **Email 1 — Onboarding / Delivery** | Immediately (Day 0) | all `challenge-buyer` | Carries both download links. Adds `challenge-active`. |
| 2 | **Email 2 — Baseline (Day 1)** | +1 day | `challenge-active` | The "before" photo + comb test. |
| 3 | **Email 3 — First wash-day check (Day 7)** | +7 days | `challenge-active` | Timed to their *first* wash day; copy already says "do it on whatever day your wash lands." |
| 4 | **Email 4 — Compare D7 vs D14** | +14 days | `challenge-active` | Side-by-side pile comparison. |
| 5 | **Email 5 — Results + Flagship graduation (Day 21)** | +21 days | `challenge-active` | Carries the **Type 4 Hair Routine System** upsell link. On send: add `challenge-graduate`, remove `challenge-active`. |
| 6 | **Email 6 — Recovery** | see §3.1 (behavior-triggered, with fixed fallback) | `challenge-active` only | Never sent to graduates. |

### 3.1 The recovery email — preferred vs fallback

**Preferred (behavior-triggered):** if you wired log-tracking (a "log today" link/button in
each email that sets `logged-recent`), build a parallel watcher:
- Condition: contact has `challenge-active` AND has **not** logged for **2+ days**.
- Action: send **Email 6**, then wait/cool-down so it doesn't re-fire daily (e.g. don't
  re-send for 4 days).

**Fallback (use this if log-tracking is NOT wired — most likely at launch):** send Email 6
as **two fixed nudges** at the two highest drop-off points:
- **Day 4** (+4 days from purchase) — to anyone still `challenge-active`.
- **Day 10** (+10 days from purchase) — to anyone still `challenge-active`.
Both pull the same Email 6 copy ("you didn't fall behind, pick up right here"). Because the
audience is gated on `challenge-active`, graduates never receive it.

> Start with the **fixed Day-4 / Day-10 fallback**. Upgrade to behavior-triggered later only
> if you add real log tracking — don't block launch on it.

---

## 4. Analytics & tracking

### 4.1 Events to track
| Event | Where it's captured | How |
|---|---|---|
| **Opt-in** (free gift) | ESP | subscriber created via lead-magnet form |
| **Purchase** (Challenge) | Selar dashboard + ESP tag `challenge-buyer` | Selar sales report; ESP automation entries |
| **Email opens / clicks** | ESP campaign stats | per-step open & click rate |
| **Upsell clicks** (Grow, Routine System) | UTM on the link → site/Selar analytics | see UTM scheme below |
| **Graduation** | ESP tag `challenge-graduate` count | how many reached Day 21 |

### 4.2 UTM scheme for the 3-day Facebook launch
Tag **every** Facebook link to the Selar product so you can tell which post sold.

Format: `?utm_source=facebook&utm_medium=<type>&utm_campaign=challenge-launch&utm_content=<asset>`

- `utm_source` = `facebook`
- `utm_medium` = `feed` (feed post) | `reel` | `bio` (link in bio) | `comment` (reply-with-link)
- `utm_campaign` = `challenge-launch` (same for the whole 3-day push)
- `utm_content` = the specific asset, matching `07-facebook-launch.md`, e.g.
  `d3-direct-post`, `reel2-broken-vs-shed`, `d1-retention-reframe`, `d3-post3`

Examples:
- Day-3 direct launch post (FR): `selar.com/<fr-challenge>?utm_source=facebook&utm_medium=feed&utm_campaign=challenge-launch&utm_content=d3-direct-post&utm_term=fr`
- Reel 2 with link (EN): `selar.com/<en-challenge>?utm_source=facebook&utm_medium=reel&utm_campaign=challenge-launch&utm_content=reel2-broken-vs-shed&utm_term=en`

Add `utm_term=fr` / `utm_term=en` so FR vs EN performance is separable.

### 4.3 Where to view results
- **Sales & revenue:** Selar dashboard → Sales / Analytics (filter by product).
- **Traffic source per sale:** UTM data in your site analytics (the same analytics already
  on the bilingual site / AdSense property).
- **Funnel health (open/click/graduation):** ESP automation report — watch Email 3 (Day 7)
  and the Day-4 nudge; those are your drop-off cliffs.

---

## 5. Consent / GDPR

### 5.1 Opt-in consent language (place under every email field; checkbox not pre-ticked)

**FR:**
> En vous inscrivant, vous acceptez de recevoir les e-mails du Défi 21 Jours et des conseils
> capillaires de Schicgirl. Vous pouvez vous désabonner à tout moment. Voir notre
> [Politique de confidentialité](/fr/confidentialite).

**EN:**
> By signing up, you agree to receive the 21-Day Challenge emails and hair-care tips from
> Schicgirl. You can unsubscribe at any time. See our [Privacy Policy](/en/privacy).

*(Buyers on Selar are transactional contacts for delivery; the consent line above covers the
ongoing marketing/tips emails. Keep proof of consent — the ESP stores opt-in timestamp/source.)*

### 5.2 Unsubscribe
- Every email must include a working **unsubscribe** link (FR: "Se désabonner" / EN:
  "Unsubscribe") — your ESP adds this automatically; confirm it renders in both languages.
- Unsubscribing removes `challenge-active`/marketing tags so all sequences stop.

### 5.3 Privacy-policy linking
- Footer of every email links the matching-language privacy policy
  (`/fr/confidentialite`, `/en/privacy`).
- Sender name + a physical/contact address in the footer (required for CAN-SPAM/GDPR).

---

## 6. Deliverability

### 6.1 Sender authentication (do this once, before launch)
- In the ESP, verify your sending domain and publish **SPF, DKIM, and DMARC** DNS records
  for `schicgirl.me` (or your sending subdomain). Without these, the 6-email sequence lands
  in spam and the whole funnel quietly fails.
- Use a real **from-name** ("Schicgirl") and a monitored reply-to address — not no-reply.

### 6.2 List hygiene
- Only mail people who opted in or bought (no scraped/bought lists).
- Let the ESP auto-suppress hard bounces and unsubscribes.
- After a few cycles, suppress never-openers from broadcast sends to protect domain reputation.
- Warm up gradually if the domain is new — don't blast the full list cold on Day 1.

### 6.3 Spam-trigger check of the 6 subject lines
| # | Subject | Verdict |
|---|---|---|
| 1 | You're in. Here's your workbook + tracker (open this first) | **OK.** Transactional, honest. |
| 2 | Today's the only "before" you'll ever take — let's get it right | **OK.** No spam words. |
| 3 | Your first wash-day check — what's in the pile? | **OK.** |
| 4 | Put the two piles side by side. Look closely. | **OK.** |
| 5 | Day 21. Take the photo that proves it. | **OK.** "Proves it" refers to the *photo*, not a length claim — keep it that way. |
| 6 | You didn't fall behind. Pick up right here. | **OK.** Warm, no triggers. |

- **No** ALL-CAPS, no "FREE!!!", no "🔥🔥", no "guaranteed," no "longer hair," no excess `!`.
  All six pass. **Keep the FR translations equally clean** — don't let "GRATUIT" in caps or
  "résultats garantis" creep into FR subjects.
- Honest-promise check: none of the six implies length gain. Maintain this in FR.

---

## 7. Links to confirm before launch (fill in, then verify each opens)

| Asset | FR URL | EN URL |
|---|---|---|
| Challenge product (Selar) | `__________` | `__________` |
| Grow ebook (upsell) | `__________` | `__________` |
| Type 4 Hair Routine System (flagship) | `__________` | `__________` |
| Privacy policy | `/fr/confidentialite` | `/en/privacy` |

---

## 8. MUST be live before you flip the switch (launch checklist)

- [ ] **Four PDFs in `dist/`** and uploaded to the correct-language Selar product.
- [ ] **Two Selar products** live (FR + EN), priced (€6 / ~3 000 FCFA), files attached,
      thank-you + upsell links set.
- [ ] **Grow** and **Routine System** Selar links confirmed live in both languages (§7 table filled).
- [ ] **Selar → ESP** purchase webhook/integration tested with one real test purchase.
- [ ] **Two ESP automations** built (FR + EN), all 6 emails loaded, timing set
      (0 / +1 / +7 / +14 / +21), tags wired (`challenge-buyer`, `challenge-active`,
      `challenge-graduate`).
- [ ] **Recovery nudge** scheduled as fixed **Day-4 + Day-10**, gated on `challenge-active`.
- [ ] **Email 5** carries the flagship link; on send adds `challenge-graduate`, removes `challenge-active`.
- [ ] **SPF + DKIM + DMARC** published and verified for the sending domain.
- [ ] **Consent line + unsubscribe + privacy link** present in both languages.
- [ ] **UTM links** built for every Facebook asset (`utm_campaign=challenge-launch`, with `utm_term=fr|en`).
- [ ] **End-to-end test:** test-buy FR and EN → confirm files download, Email 1 arrives,
      automation enrols, tags apply.
