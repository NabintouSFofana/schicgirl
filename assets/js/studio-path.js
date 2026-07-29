/* SCHICGIRL — Le Studio Premium : the diagnosis spine.
   Loads AFTER studio-premium.page.js.

   The Studio already asked the right six questions (porosity, curl, density,
   strand width, scalp, elasticity) but then did nothing with the answers: every
   member saw the same six courses in the same order. This layer turns those
   answers into two things:

     1. a Hair Profile Card — what each trait actually means for HER hair;
     2. a personalised course order, where every position carries the reason it
        is in that position.

   Nothing is locked. The order is advice, not a gate: she paid for all of it.  */
(function () {

  /* One extra question the six traits cannot answer. Whether she is growing out
     relaxed hair changes the order more than any other single fact, so it is
     worth asking outright rather than guessing. */
  var TRANSITION_Q = ['transitioning', '🦋', 'Growing out relaxed hair?', 'Tu fais une transition ?',
    [['yes', 'Yes, transitioning', 'Oui, en transition'],
     ['no', 'No, all natural', 'Non, tout naturel']]];

  /* What each answer MEANS. The card is only worth reading if it tells her
     something she did not already know about her own head. */
  var MEANING = {
    porosity: {
      low: ['Water sits on top before it goes in — heat and lightweight products are your levers.',
            'L\'eau reste en surface avant d\'entrer — la chaleur et les produits légers sont tes leviers.'],
      medium: ['The most forgiving porosity. Your routine has room for error.',
               'La porosité la plus tolérante. Ta routine a droit à l\'erreur.'],
      high: ['Your hair drinks fast and loses fast. Sealing matters more than soaking.',
             'Tes cheveux boivent vite et perdent vite. Sceller compte plus que tremper.']
    },
    density: {
      low: ['Fewer strands to work with, so every one you keep counts. Scalp shows more.',
            'Moins de cheveux, donc chacun compte. Le cuir chevelu se voit davantage.'],
      medium: ['Enough hair to section comfortably without fighting it.',
               'Assez de cheveux pour sectionner sans se battre.'],
      high: ['A lot of hair. Sectioning is not optional — it is the whole difference.',
             'Beaucoup de cheveux. Sectionner n\'est pas optionnel, c\'est toute la différence.']
    },
    width: {
      fine: ['Fine strands snap under heavy product and rough hands. Technique beats products.',
             'Les cheveux fins cassent sous les produits lourds et les gestes brusques. La technique prime.'],
      medium: ['Middle ground — most products behave the way the label promises.',
               'Juste milieu — la plupart des produits se comportent comme annoncé.'],
      coarse: ['Thick strands need richer mixes and more patience to soften.',
               'Des cheveux épais demandent des mélanges plus riches et plus de patience.']
    },
    scalp: {
      dry: ['A dry scalp will undo good lengths. It gets treated first.',
            'Un cuir chevelu sec ruine de bonnes longueurs. On le traite en premier.'],
      normal: ['Nothing to fix here — protect it.', 'Rien à réparer ici — protège-le.'],
      oily: ['Oil at the root with dry ends is a washing problem, not a moisture problem.',
             'Gras aux racines et pointes sèches : un problème de lavage, pas d\'hydratation.']
    },
    elasticity: {
      low: ['Low elasticity is the clearest sign of a protein/moisture imbalance.',
            'Une faible élasticité est le signe le plus clair d\'un déséquilibre protéines/hydratation.'],
      normal: ['Healthy spring. Your balance is where it should be.',
               'Bon ressort. Ton équilibre est au bon endroit.'],
      high: ['Very stretchy, slow to spring back — usually too much moisture, not enough protein.',
             'Très élastique et lent à revenir — souvent trop d\'hydratation, pas assez de protéines.']
    }
  };

  var LABEL = {
    porosity: ['Porosity', 'Porosité'], density: ['Density', 'Densité'],
    width: ['Strand width', 'Épaisseur du cheveu'], scalp: ['Scalp', 'Cuir chevelu'],
    elasticity: ['Elasticity', 'Élasticité'], curl: ['Curl pattern', 'Type de boucle']
  };
  var VALUE = {
    low: ['Low', 'Faible'], medium: ['Medium', 'Moyenne'], high: ['High', 'Élevée'],
    fine: ['Fine', 'Fin'], coarse: ['Coarse', 'Épais'], dry: ['Dry', 'Sec'],
    normal: ['Normal', 'Normal'], oily: ['Oily', 'Gras'],
    '4a': ['4A', '4A'], '4b': ['4B', '4B'], '4c': ['4C', '4C'],
    yes: ['Yes', 'Oui'], no: ['No', 'Non']
  };

  function vlabel(v) { return VALUE[v] ? t(VALUE[v][0], VALUE[v][1]) : v; }

  /* ---------- the order, and why ---------- */

  /* Base weights are the teaching order: understand, then moisturise, then
     build the routine everything else plugs into. Personalisation moves a
     course up only when there is a concrete reason, and that reason is shown. */
  var BASE = { 'crs-wnw': 100, 'crs-hydra': 90, 'crs-routine': 80, 'crs-scalp': 70, 'crs-recipes': 60, 'crs-transition': 40 };

  function ranked() {
    var p = S.profile || {}, goals = S.goals || [];
    var score = {}, why = {};
    for (var k in BASE) { score[k] = BASE[k]; why[k] = null; }

    function bump(id, n, en, fr) {
      score[id] += n;
      if (!why[id]) why[id] = [en, fr];        // keep the strongest reason, not the last
    }

    var done = p.porosity && p.density && p.width && p.scalp;
    if (done) {
      // she has answered: the diagnosis course becomes reference, not homework
      score['crs-wnw'] -= 45;
      why['crs-wnw'] = ['You already know your profile — keep this one as your reference.',
                        'Tu connais déjà ton profil — garde ce cours comme référence.'];
    } else {
      why['crs-wnw'] = ['Start here: every other course adapts to the answers you give in this one.',
                        'Commence ici : tous les autres cours s\'adaptent à tes réponses.'];
    }

    if (p.scalp === 'dry' || p.scalp === 'oily')
      bump('crs-scalp', 45, 'Your scalp came back ' + (p.scalp === 'dry' ? 'dry' : 'oily') + ' — treat the soil before the plant.',
           'Ton cuir chevelu est ' + (p.scalp === 'dry' ? 'sec' : 'gras') + ' — on soigne la terre avant la plante.');
    if (p.porosity === 'high')
      bump('crs-hydra', 40, 'High porosity: water leaves as fast as it enters. Sealing is your whole game.',
           'Porosité élevée : l\'eau part aussi vite qu\'elle entre. Tout se joue sur le scellage.');
    if (p.porosity === 'low')
      bump('crs-hydra', 35, 'Low porosity: the order you layer in decides whether water ever gets in.',
           'Porosité faible : l\'ordre de superposition décide si l\'eau entre ou non.');
    if (p.elasticity === 'low' || p.elasticity === 'high')
      bump('crs-hydra', 25, 'Your elasticity says protein and moisture are out of balance.',
           'Ton élasticité indique un déséquilibre protéines/hydratation.');
    if (p.width === 'fine')
      bump('crs-routine', 22, 'Fine strands break from handling, not from bad products — technique first.',
           'Les cheveux fins cassent à cause des gestes, pas des produits — la technique d\'abord.');
    if (p.width === 'coarse')
      bump('crs-recipes', 18, 'Coarse strands soften with richer, heavier mixes than shop products give.',
           'Les cheveux épais s\'assouplissent avec des mélanges plus riches que ceux du commerce.');
    if (p.density === 'high')
      bump('crs-routine', 15, 'With this much hair, sectioning is the difference between 40 minutes and 3 hours.',
           'Avec autant de cheveux, sectionner fait la différence entre 40 minutes et 3 heures.');
    if (p.transitioning === 'yes')
      bump('crs-transition', 70, 'You are growing out relaxed hair — the fragile line needs its own rules.',
           'Tu fais une transition — la ligne de démarcation a ses propres règles.');
    if (p.transitioning === 'no') score['crs-transition'] -= 25;

    if (goals.indexOf('scalp') >= 0) bump('crs-scalp', 30, 'You asked for a healthier scalp.', 'Tu as demandé un cuir chevelu sain.');
    if (goals.indexOf('edges') >= 0) bump('crs-scalp', 25, 'Edges regrow from the scalp, not from the lengths.', 'Les contours repoussent du cuir chevelu, pas des longueurs.');
    if (goals.indexOf('moisture') >= 0) bump('crs-hydra', 30, 'You asked for more moisture.', 'Tu as demandé plus d\'hydratation.');
    if (goals.indexOf('retention') >= 0) bump('crs-routine', 28, 'Length is kept by a routine you repeat, not by one good wash day.', 'La longueur se garde par une routine répétée, pas par un bon wash day.');
    if (goals.indexOf('protective') >= 0) bump('crs-routine', 18, 'Protective styling only works on top of a routine.', 'Les coiffures protectrices ne marchent que sur une routine solide.');
    if (goals.indexOf('definition') >= 0) bump('crs-recipes', 20, 'Definition comes from what you apply and how — start with the recipes.', 'La définition vient de ce que tu appliques et comment — commence par les recettes.');

    var list = COURSES.slice().sort(function (a, b) { return score[b.id] - score[a.id]; });
    return { list: list, why: why, done: done };
  }

  /* ---------- rendering ---------- */

  function profileCard() {
    var p = S.profile || {};
    var keys = ['porosity', 'density', 'width', 'scalp', 'elasticity', 'curl'];
    var missing = 0;
    var rows = keys.map(function (k) {
      var v = p[k];
      if (!v) { missing++; return '<div class="pf-row pf-miss"><b>' + t(LABEL[k][0], LABEL[k][1]) + '</b>'
        + '<span class="pf-val">' + t('not answered yet', 'pas encore répondu') + '</span></div>'; }
      var mean = MEANING[k] && MEANING[k][v] ? t(MEANING[k][v][0], MEANING[k][v][1]) : '';
      return '<div class="pf-row"><b>' + t(LABEL[k][0], LABEL[k][1]) + '</b>'
        + '<span class="pf-val">' + vlabel(v) + '</span>'
        + (mean ? '<p class="pf-mean">' + mean + '</p>' : '') + '</div>';
    }).join('');
    var name = (p.name || '').trim();
    return '<div class="card pf-card"><div class="pf-head"><span class="pill">'
      + t('Hair Profile Card', 'Fiche Profil Capillaire') + '</span>'
      + (name ? '<span class="pf-name">' + name + '</span>' : '') + '</div>'
      + rows
      + (missing ? '<button class="btn" style="margin-top:12px" onclick="go(\'diagnosis\')">'
          + t('Answer the ' + missing + ' missing question' + (missing > 1 ? 's' : '') + ' →',
              'Répondre aux ' + missing + ' question' + (missing > 1 ? 's' : '') + ' manquante' + (missing > 1 ? 's' : '') + ' →') + '</button>'
        : '<button class="btn ghost" style="margin-top:12px" onclick="go(\'diagnosis\')">'
          + t('My hair changed — retake it', 'Mes cheveux ont changé — refaire le test') + '</button>')
      + '</div>';
  }

  function transitionChips() {
    var q = TRANSITION_Q, cur = (S.profile || {}).transitioning;
    return '<div class="card"><div class="ql"><span class="qi">' + q[1] + '</span>' + t(q[2], q[3]) + '</div>'
      + '<div class="chips">' + q[4].map(function (o) {
        return '<button class="chip ' + (cur === o[0] ? 'sel' : '') + '" onclick="sgSetTransition(\'' + o[0] + '\')">'
          + t(o[1], o[2]) + '</button>';
      }).join('') + '</div></div>';
  }

  function pathHTML() {
    var r = ranked();
    var cards = r.list.map(function (c, i) {
      var w = r.why[c.id];
      return '<div class="pth"><div class="pth-n">' + (i + 1) + '</div>'
        + '<div class="pth-b"><h4>' + c.icon + ' ' + t(c.ten, c.tfr) + '</h4>'
        + (w ? '<p class="pth-why">' + t(w[0], w[1]) + '</p>'
             : '<p class="pth-why muted">' + t('Part of the path, in its natural place.', 'Fait partie du parcours, à sa place naturelle.') + '</p>')
        + '<button class="btn bsm" onclick="go(\'' + c.id + '\')">' + t('Open →', 'Ouvrir →') + '</button>'
        + '</div></div>';
    }).join('');

    var intro = r.done
      ? t('This is your order — not everyone\'s. It is built from the answers you gave, and each place explains itself.',
          'Voici ton ordre — pas celui de tout le monde. Il vient de tes réponses, et chaque place s\'explique.')
      : t('Answer the diagnosis and this page rebuilds itself around your hair. Until then, here is the order that works for most Type 4 heads.',
          'Réponds au diagnostic et cette page se reconstruit autour de tes cheveux. En attendant, voici l\'ordre qui marche pour la plupart des Type 4.');

    return head(t('Start here', 'Commence ici'), t('Your path', 'Ton parcours'), intro)
      + profileCard()
      + transitionChips()
      + '<h3 class="sec" style="margin-top:24px">' + t('Your order', 'Ton ordre') + '</h3>'
      + '<div class="pth-wrap">' + cards + '</div>'
      + comp('tip', '✦ ' + t('Nothing is locked', 'Rien n\'est verrouillé'),
          t('You paid for all six. This is the order I would put them in for your hair — open any of them whenever you like.',
            'Tu as payé les six. C\'est l\'ordre que je choisirais pour tes cheveux — ouvre celui que tu veux, quand tu veux.'));
  }

  /* ---------- wire into the app ---------- */

  window.sgSetTransition = function (v) {
    S.profile = S.profile || {};
    S.profile.transitioning = v;
    sv();
    go('crs-path');            // go() is what swaps the panel; render() only runs hooks
  };

  var STYLE = '<style>'
    + '.pf-card{margin-bottom:16px}'
    + '.pf-head{display:flex;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}'
    + '.pf-name{font-weight:600;opacity:.75}'
    + '.pf-row{padding:9px 0;border-top:1px solid rgba(0,0,0,.08)}'
    + '.pf-row:first-of-type{border-top:0}'
    + '.pf-row b{display:inline-block;min-width:9.5em}'
    + '.pf-val{font-weight:600}'
    + '.pf-miss .pf-val{font-weight:400;opacity:.55;font-style:italic}'
    + '.pf-mean{margin:4px 0 0;font-size:.92em;opacity:.8;line-height:1.5}'
    + '.pth-wrap{display:flex;flex-direction:column;gap:10px}'
    + '.pth{display:flex;gap:12px;align-items:flex-start;padding:14px;border:1px solid rgba(0,0,0,.10);border-radius:10px}'
    + '.pth-n{flex:0 0 30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;background:rgba(0,0,0,.06)}'
    + '.pth-b{flex:1 1 auto;min-width:0}'
    + '.pth-b h4{margin:2px 0 4px}'
    + '.pth-why{margin:0 0 8px;font-size:.94em;line-height:1.5;opacity:.85}'
    + '@media(max-width:520px){.pf-row b{min-width:0;display:block}}'
    + '</style>';

  /* go() builds the panel from panelHTML(), so overriding that is enough.
     The courses layer wraps panelHTML too, and its wrapper falls through to
     ours for any id it does not own. */
  var _p = panelHTML;
  panelHTML = function (id) { return id === 'crs-path' ? STYLE + pathHTML() : _p(id); };

  // sits in "Start", right after the diagnosis it depends on
  for (var g = 0; g < NAV.length; g++) {
    var items = NAV[g][1];
    for (var i = 0; i < items.length; i++) {
      if (items[i][0] === 'diagnosis') {
        items.splice(i + 1, 0, ['crs-path', '🧭', 'Your path', 'Ton parcours']);
        g = NAV.length;
        break;
      }
    }
  }
  IDS.push('crs-path');
  buildNav();
})();
