SchicBlog.init({ ctx: "index" });
  var LANG = "fr";
  function setLang(l) {
    LANG = l;
    document.getElementById("btnEn").classList.toggle("is-active", l === "en");
    document.getElementById("btnFr").classList.toggle("is-active", l === "fr");
    document.documentElement.lang = l;
    document.querySelectorAll("[data-fr]").forEach(function (el) {
      el.innerHTML = l === "fr" ? el.getAttribute("data-fr") : el.getAttribute("data-en");
    });
    document.querySelectorAll("[data-lang]").forEach(function (el) {
      el.classList.toggle("hide", el.getAttribute("data-lang") !== l);
    });
    SchicBlog.render(l);
  }
  var qp = new URLSearchParams(location.search).get("lang");
  setLang(qp === "en" ? "en" : "fr");
  try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}

  /* ── Swipeable hero carousel ── */
  (function () {
    var track = document.getElementById("hcTrack");
    if (!track) return;
    var slides = track.children;
    var dotsBox = document.getElementById("hcDots");
    var n = slides.length, i = 0, timer = null;

    for (var d = 0; d < n; d++) {
      (function (k) {
        var b = document.createElement("button");
        b.setAttribute("aria-label", "Image " + (k + 1));
        b.addEventListener("click", function () { go(k); rest(); });
        dotsBox.appendChild(b);
      })(d);
    }
    var dots = dotsBox.children;

    function setDots() { for (var k = 0; k < n; k++) dots[k].classList.toggle("is-active", k === i); }
    function go(k) { i = (k + n) % n; track.scrollLeft = i * track.clientWidth; setDots(); }
    function next() { go(i + 1); }
    function prev() { go(i - 1); }

    document.getElementById("hcNext").addEventListener("click", function () { next(); rest(); });
    document.getElementById("hcPrev").addEventListener("click", function () { prev(); rest(); });

    // keep dots in sync when the user swipes (native scroll)
    var st;
    track.addEventListener("scroll", function () {
      clearTimeout(st);
      st = setTimeout(function () { i = Math.round(track.scrollLeft / track.clientWidth); setDots(); }, 80);
    });

    function play() { timer = setInterval(next, 5000); }
    function rest() { clearInterval(timer); play(); }
    ["pointerdown", "touchstart", "mouseenter"].forEach(function (ev) {
      track.addEventListener(ev, function () { clearInterval(timer); }, { passive: true });
    });
    track.addEventListener("mouseleave", play);
    window.addEventListener("resize", function () { track.scrollLeft = i * track.clientWidth; });

    setDots(); play();
  })();
