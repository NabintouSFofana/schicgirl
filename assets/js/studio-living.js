/* SCHICGIRL — Le Studio Premium : proof, and a Studio that keeps growing.
   Loads AFTER studio-path.js.

   Two panels:

   1. "Your 90 days" — retention is invisible week to week. She measures, forgets
      what she measured, and concludes nothing is working. This reads the length
      log and wash-day tracker she already fills in and shows her the DELTA:
      what she kept, not just what she wrote down. Every number is computed from
      her own entries — nothing is estimated, and an empty log says so plainly
      instead of showing a flattering zero.

   2. "New this month" — a one-time purchase that keeps arriving is worth more
      than one that lands once. Content comes from assets/studio-monthly.json so
      adding next month's entry is editing one file, no code.                    */
(function () {

  /* ---------- shared helpers ---------- */

  /* Entries are typed by hand: "12", "12,5", "12.5 cm", " 13 in ". Accept all
     of it, reject anything that is not really a measurement. */
  function num(v) {
    if (v === undefined || v === null) return null;
    var m = String(v).replace(',', '.').match(/-?\d+(\.\d+)?/);
    if (!m) return null;
    var n = parseFloat(m[0]);
    return isFinite(n) && n > 0 && n < 400 ? n : null;
  }

  var MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

  /* The length tracker is table 'l': 12 rows (one per month),
     col 1 = front, col 2 = crown, col 3 = nape. */
  var SPOTS = [[1, 'Front', 'Devant'], [2, 'Crown', 'Sommet'], [3, 'Nape', 'Nuque']];

  function readLengths() {
    var T = S.tables || {}, out = [];
    SPOTS.forEach(function (sp) {
      var points = [];
      for (var r = 0; r < 12; r++) {
        var n = num(T['l_' + r + '_' + sp[0]]);
        if (n !== null) points.push({ row: r, v: n });
      }
      out.push({ col: sp[0], en: sp[1], fr: sp[2], points: points });
    });
    return out;
  }

  function washCount() {
    var T = S.tables || {}, n = 0;
    for (var k in T) if (/^w_\d+_0$/.test(k) && String(T[k]).trim()) n++;
    return n;
  }

  /* Views you read are not sections you complete — counting them would quietly
     inflate the denominator and make her look further behind than she is. */
  var NOT_COMPLETABLE = { 'live-new': 1, 'live-90': 1, 'crs-path': 1, 'home': 1 };

  function lessonsDone() {
    var done = 0, total = 0;
    (typeof IDS !== 'undefined' ? IDS : []).forEach(function (id) {
      if (NOT_COMPLETABLE[id]) return;
      total++;
      if (S.done && S.done[id]) done++;
    });
    return { done: done, total: total };
  }

  /* ---------- panel 1: your 90 days ---------- */

  function ninetyHTML() {
    var lens = readLengths(), wash = washCount(), les = lessonsDone();
    var months = (L === 'fr' ? MONTHS_FR : MONTHS_EN);
    var measured = lens.filter(function (l) { return l.points.length >= 2; });
    var anyPoint = lens.some(function (l) { return l.points.length >= 1; });

    var body = '';

    if (!anyPoint) {
      /* Nothing logged. Say so honestly and make the next step tiny. */
      body += '<div class="card"><p>' + t(
        'You have not logged a length yet — so there is nothing to compare, and I will not invent a number for you.',
        'Tu n\'as encore noté aucune longueur — il n\'y a donc rien à comparer, et je ne vais pas inventer un chiffre.') + '</p><p>' + t(
        'Measure stretched hair at three spots today, write it in the Progress tracker, and come back next month. That second measurement is the one that tells the truth.',
        'Mesure tes cheveux étirés à trois endroits aujourd\'hui, note-le dans le suivi Progrès, et reviens le mois prochain. C\'est la deuxième mesure qui dit la vérité.')
        + '</p><button class="btn" onclick="go(\'progress\')">' + t('Open the length tracker →', 'Ouvrir le suivi longueur →') + '</button></div>';
    } else if (!measured.length) {
      body += '<div class="card"><p>' + t(
        'One measurement is a starting point, not a result. Log a second one next month and this page will show you what you kept.',
        'Une seule mesure est un point de départ, pas un résultat. Note-en une deuxième le mois prochain et cette page te montrera ce que tu as gardé.')
        + '</p><button class="btn" onclick="go(\'progress\')">' + t('Open the length tracker →', 'Ouvrir le suivi longueur →') + '</button></div>';
    } else {
      body += '<div class="l90-grid">' + measured.map(function (l) {
        var first = l.points[0], last = l.points[l.points.length - 1];
        var d = Math.round((last.v - first.v) * 10) / 10;
        var span = last.row - first.row;
        var cls = d > 0 ? 'up' : (d < 0 ? 'down' : 'flat');
        var sign = d > 0 ? '+' : '';
        return '<div class="l90 ' + cls + '"><div class="l90-h">' + t(l.en, l.fr) + '</div>'
          + '<div class="l90-d">' + sign + d + '</div>'
          + '<div class="l90-s">' + months[first.row] + ' ' + first.v + '  →  ' + months[last.row] + ' ' + last.v + '</div>'
          + '<div class="l90-n">' + (span > 0
              ? t('over ' + span + ' month' + (span > 1 ? 's' : ''), 'sur ' + span + ' mois')
              : t('same month', 'même mois')) + '</div></div>';
      }).join('') + '</div>';

      /* One honest sentence about what the numbers mean. */
      var best = measured.map(function (l) { return l.points[l.points.length - 1].v - l.points[0].v; })
                         .sort(function (a, b) { return b - a; })[0];
      var verdict = best > 0
        ? t('That is length you kept — not length you grew. Growth happened anyway; keeping it is the part you did.',
            'C\'est de la longueur que tu as gardée — pas de la longueur poussée. La pousse a eu lieu de toute façon ; la garder, c\'est toi.')
        : (best === 0
          ? t('Flat is information, not failure: your hair grew and the ends came off at the same rate. That is a breakage problem, and it is fixable.',
              'Stagner est une information, pas un échec : tes cheveux ont poussé et les pointes sont parties au même rythme. C\'est un problème de casse, et ça se corrige.')
          : t('You lost length. Almost always breakage or a trim — check your wash-day handling before you change a single product.',
              'Tu as perdu de la longueur. Presque toujours la casse ou une coupe — revois tes gestes du wash day avant de changer un seul produit.'));
      body += comp('win', '✦ ' + t('What this says', 'Ce que ça dit'), verdict);
    }

    /* Consistency: the habits underneath the numbers. */
    body += '<h3 class="sec" style="margin-top:22px">' + t('The work underneath', 'Le travail en dessous') + '</h3>'
      + '<div class="l90-stats">'
      + '<div class="l90-st"><b>' + wash + '</b><span>' + t('wash days logged', 'wash days notés') + '</span></div>'
      + '<div class="l90-st"><b>' + les.done + '/' + les.total + '</b><span>' + t('sections completed', 'sections terminées') + '</span></div>'
      + '<div class="l90-st"><b>' + (S.streak || 0) + '</b><span>' + t('day streak', 'jours d\'affilée') + '</span></div>'
      + '</div>';

    return head(t('Care & track', 'Soin & suivi'), t('Your 90 days', 'Tes 90 jours'),
      t('Retention is invisible week to week. This is the page that makes it visible.',
        'La rétention est invisible semaine après semaine. Voici la page qui la rend visible.'))
      + body
      + comp('tip', '✦ ' + t('How to measure', 'Comment mesurer'),
          t('Always stretched, always the same three spots, always the same day of the month. Consistency matters more than precision.',
            'Toujours étiré, toujours les mêmes trois endroits, toujours le même jour du mois. La régularité compte plus que la précision.'));
  }

  /* ---------- panel 2: new this month ---------- */

  var MONTHLY = null, MONTHLY_STATE = 'idle';

  function monthKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2);
  }

  function monthlyHTML() {
    var inner;
    if (MONTHLY_STATE === 'error') {
      inner = '<div class="card"><p>' + t('This month\'s update could not be loaded. It will be here next time you open the Studio.',
        'La mise à jour du mois n\'a pas pu être chargée. Elle sera là à ta prochaine visite.') + '</p></div>';
    } else if (MONTHLY_STATE !== 'ready') {
      inner = '<div class="card">' + t('Loading…', 'Chargement…') + '</div>';
    } else {
      var now = monthKey();
      var live = (MONTHLY.entries || []).filter(function (e) { return e.month <= now; })
                  .sort(function (a, b) { return a.month < b.month ? 1 : -1; });
      if (!live.length) {
        inner = '<div class="card"><p>' + t('The first monthly update lands soon.', 'La première mise à jour mensuelle arrive bientôt.') + '</p></div>';
      } else {
        var cur = live[0], rest = live.slice(1);
        inner = '<div class="card mo-card"><div class="mo-kick">' + t(cur.kicker_en, cur.kicker_fr) + ' · ' + cur.month + '</div>'
          + '<h3 class="mo-t">' + t(cur.title_en, cur.title_fr) + '</h3>'
          + '<div class="mo-b">' + t(cur.body_en, cur.body_fr) + '</div>'
          + (cur.link_en ? '<a class="btn" href="' + t(cur.link_en, cur.link_fr) + '" target="_blank" rel="noopener">'
              + t(cur.cta_en || 'Open →', cur.cta_fr || 'Ouvrir →') + '</a>' : '')
          + '</div>';
        if (rest.length) {
          inner += '<h3 class="sec" style="margin-top:22px">' + t('Earlier months', 'Les mois précédents') + '</h3>'
            + rest.map(function (e) {
              return '<details class="acc"><summary>' + e.month + ' · ' + t(e.title_en, e.title_fr)
                + '<span class="cv">›</span></summary><div class="bd">' + t(e.body_en, e.body_fr) + '</div></details>';
            }).join('');
        }
      }
    }
    return head(t('Start', 'Commencer'), t('New this month', 'Nouveau ce mois-ci'),
      t('Your Studio is not finished — it grows. Something new lands here every month, and it stays yours.',
        'Ton Studio n\'est pas figé — il grandit. Quelque chose de nouveau arrive ici chaque mois, et ça reste à toi.'))
      + inner;
  }

  function loadMonthly() {
    if (MONTHLY_STATE === 'loading' || MONTHLY_STATE === 'ready') return;
    MONTHLY_STATE = 'loading';
    fetch('assets/studio-monthly.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (d) {
        MONTHLY = d; MONTHLY_STATE = 'ready';
        if ((location.hash || '').slice(1) === 'live-new') go('live-new');
      })
      .catch(function () {
        MONTHLY_STATE = 'error';
        if ((location.hash || '').slice(1) === 'live-new') go('live-new');
      });
  }

  /* ---------- wiring ---------- */

  var STYLE = '<style>'
    + '.l90-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:6px}'
    + '.l90{border:1px solid rgba(0,0,0,.10);border-radius:10px;padding:14px;text-align:center}'
    + '.l90-h{font-size:.86em;letter-spacing:.08em;text-transform:uppercase;opacity:.7}'
    + '.l90-d{font-size:2.1em;font-weight:700;line-height:1.15;margin:4px 0}'
    + '.l90.up .l90-d{color:#2f7d54}.l90.down .l90-d{color:#a4453c}.l90.flat .l90-d{opacity:.65}'
    + '.l90-s{font-size:.9em;opacity:.85}.l90-n{font-size:.82em;opacity:.6;margin-top:2px}'
    + '.l90-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}'
    + '.l90-st{border:1px solid rgba(0,0,0,.10);border-radius:10px;padding:12px;text-align:center}'
    + '.l90-st b{display:block;font-size:1.6em;line-height:1.2}'
    + '.l90-st span{font-size:.84em;opacity:.72}'
    + '.mo-card{border-left:4px solid var(--gold,#b08a3c)}'
    + '.mo-kick{font-size:.8em;letter-spacing:.12em;text-transform:uppercase;opacity:.7}'
    + '.mo-t{margin:6px 0 8px}'
    + '.mo-b p{margin:0 0 10px;line-height:1.6}'
    + '</style>';

  var _p = panelHTML;
  panelHTML = function (id) {
    if (id === 'live-90') return STYLE + ninetyHTML();
    if (id === 'live-new') { loadMonthly(); return STYLE + monthlyHTML(); }
    return _p(id);
  };

  function addAfter(groupMatch, afterId, item) {
    for (var g = 0; g < NAV.length; g++) {
      var items = NAV[g][1];
      for (var i = 0; i < items.length; i++) {
        if (items[i][0] === afterId) { items.splice(i + 1, 0, item); return true; }
      }
    }
    return false;
  }

  addAfter(null, 'home', ['live-new', '🎁', 'New this month', 'Nouveau ce mois-ci']);
  addAfter(null, 'progress', ['live-90', '📈', 'Your 90 days', 'Tes 90 jours']);
  IDS.push('live-new', 'live-90');
  buildNav();
  loadMonthly();
})();
