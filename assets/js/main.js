/* RENIBO BOUW — interacties */
(function () {
  "use strict";

  /* ---- mobiel menu ---- */
  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.querySelectorAll(".mainnav__menu a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("nav-open"); });
    });
  }

  /* ---- header: infobalk verbergen bij omlaag scrollen, tonen bij omhoog ---- */
  var head = document.getElementById("siteHead");
  if (head) {
    var onScroll = function () {
      var yy = window.scrollY;
      head.classList.toggle("scrolled", yy > 4);
      head.classList.toggle("hide-top", yy > 8); // balk enkel helemaal bovenaan
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- contactformulier (demo, geen backend) ---- */
  var form = document.querySelector(".form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = form.querySelector(".form__success");
      if (ok) { ok.classList.add("show"); ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
      form.querySelectorAll("input, textarea, select").forEach(function (f) {
        if (f.type !== "submit") f.value = "";
      });
    });
  }

  /* ---- jaartal ---- */
  var y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();

  /* ====================== DIENSTEN-DATA ====================== */
  var PAD = "assets/img/";
  var DIENSTEN = [
    { id: "dakwerken",    titel: "Dakwerken",            kort: "Hellende en platte daken, nieuw of in renovatie.", punten: ["Pannen- en leiendaken", "Platte daken (EPDM, roofing)", "Dakgoten en zinkwerk", "Dakherstellingen"], fotos: ["dakwerken-1","dakwerken-2","dakwerken-3","dakwerken-4","dakwerken-5","dakwerken-6","dakwerken-7","dakwerken-8"] },
    { id: "gevelwerken",  titel: "Gevelwerken",          kort: "Een strakke, beter geïsoleerde gevel.", punten: ["Gevelbekleding", "Sierpleister en crepi", "Gevelrenovatie", "Gevelreiniging"], fotos: ["gevel-1","gevel-2","gevel-3","gevel-4","gevel-5","gevel-6"] },
    { id: "isolatie",     titel: "Isolatie & zolderafwerking", kort: "Isoleren en afwerken van dak en zolder.", punten: ["Dakisolatie", "Muur- en vloerisolatie", "Zolderinrichting", "Zolderafwerking"], fotos: ["isolatie-1","isolatie-2","isolatie-3","isolatie-4","isolatie-5","isolatie-6","isolatie-7","isolatie-8"] },
    { id: "ramen-deuren", titel: "Ramen, deuren & veluxen", kort: "Plaatsen van ramen, deuren en dakvensters.", punten: ["Ramen en deuren", "Velux-dakvensters", "Lichtkoepels"], fotos: ["ramen-1","ramen-2","ramen-3","ramen-4"] },
    { id: "lichtstraten", titel: "Lichtstraten",         kort: "Maximaal daglicht met lichtstraten en koepels.", punten: ["Lichtstraten op maat", "Lichtkoepels", "Glasdaken"], fotos: ["licht-1"] },
    { id: "zonnepanelen", titel: "Zonnepanelen",         kort: "Zonnepanelen voor een lagere energiefactuur.", punten: ["Plaatsing op hellend en plat dak", "Advies en afwerking"], fotos: ["zon-1","zon-2","zon-3","zon-4","zon-5"] },
    { id: "afwerking",    titel: "Afwerking & plafonds", kort: "Vakkundige binnenafwerking.", punten: ["Pleisterwerk", "Plafonds", "Vloeren", "Algemene afwerking"], fotos: ["afwerking-1","afwerking-2","afwerking-3","afwerking-4"] },
    { id: "asbest",       titel: "Asbestverwijdering",   kort: "Veilige verwijdering en vernieuwing.", punten: ["Verwijderen asbestdaken", "Vernieuwen dakbedekking", "Conform de regelgeving"], fotos: ["asbest-1","asbest-2","asbest-3","asbest-4"] },
    { id: "ontmossen",    titel: "Ontmossen van daken",  kort: "Reinigen en ontmossen van uw dak.", punten: ["Ontmossen", "Reinigen", "Beschermende behandeling"], fotos: ["ontmossen-1","ontmossen-2","ontmossen-3","ontmossen-4"] },
    { id: "tuinaanleg",   titel: "Tuinaanleg & paden",   kort: "Aanleg van paden en buitenverharding.", punten: ["Tuinpaden", "Opritten", "Verhardingen"], fotos: ["tuin-1","tuin-2","tuin-3","tuin-4"] },
    { id: "opruiming",    titel: "Opruim- & afbraakwerken", kort: "Opruim-, sloop- en afbraakwerken.", punten: ["Afbraakwerken", "Werf opruimen", "Afvoer puin"], fotos: ["opruiming-1","opruiming-2","opruiming-3","opruiming-4"] },
    { id: "ontruiming",   titel: "Opruiming na brand of overlijden", kort: "Discrete en volledige ontruiming en opruiming.", punten: ["Ontruiming na brand", "Leegmaken bij overlijden", "Sorteren en afvoeren", "Discreet en respectvol"], fotos: ["ontruiming-1","ontruiming-2","ontruiming-3","ontruiming-4"] }
  ];
  function byId(id) { for (var i = 0; i < DIENSTEN.length; i++) if (DIENSTEN[i].id === id) return DIENSTEN[i]; return null; }
  function getParam(n) { var m = new RegExp("[?&]" + n + "=([^&]+)").exec(location.search); return m ? decodeURIComponent(m[1]) : null; }
  var ARROW = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  /* ====================== DIENSTEN-OVERZICHT (kaarten → detailpagina) ====================== */
  var grid = document.getElementById("dienstGrid");
  if (grid) {
    DIENSTEN.forEach(function (d) {
      var a = document.createElement("a");
      a.className = "dienst-card";
      a.href = d.id + ".html";
      a.setAttribute("aria-label", d.titel);
      a.innerHTML =
        '<span class="dienst-card__img"><img src="' + PAD + d.fotos[0] + '.jpg" alt="' + d.titel + '" loading="lazy">' +
        '<span class="dienst-card__count">' + d.fotos.length + (d.fotos.length === 1 ? " foto" : " foto’s") + "</span></span>" +
        '<span class="dienst-card__body"><h3>' + d.titel + "</h3><p>" + d.kort + "</p>" +
        '<span class="dienst-card__more">Meer info ' + ARROW + "</span></span>";
      grid.appendChild(a);
    });
  }

  /* ====================== FOTOGALERIJ-LIGHTBOX (statische dienstpaginas) ====================== */
  var lb = document.getElementById("lightbox");
  var lbItems = Array.prototype.slice.call(document.querySelectorAll(".lb-item"));
  if (lb && lbItems.length) {
    var lbImg = lb.querySelector(".lightbox__img");
    var lbCount = lb.querySelector(".lightbox__count");
    var srcs = lbItems.map(function (el) { return el.getAttribute("data-full"); });
    var idx = 0;
    function lbShow(i) { idx = (i + srcs.length) % srcs.length; lbImg.src = srcs[idx]; if (lbCount) lbCount.textContent = (idx + 1) + " / " + srcs.length; }
    function lbOpen(i) { lbShow(i); lb.hidden = false; document.body.classList.add("lb-open"); }
    function lbClose() { lb.hidden = true; document.body.classList.remove("lb-open"); }
    lbItems.forEach(function (el, i) { el.addEventListener("click", function (e) { e.preventDefault(); lbOpen(i); }); });
    var cl = lb.querySelector(".lightbox__close"); if (cl) cl.addEventListener("click", lbClose);
    var pv = lb.querySelector(".lb-prev"); if (pv) pv.addEventListener("click", function () { lbShow(idx - 1); });
    var nx = lb.querySelector(".lb-next"); if (nx) nx.addEventListener("click", function () { lbShow(idx + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) lbClose(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") lbClose();
      else if (e.key === "ArrowLeft") lbShow(idx - 1);
      else if (e.key === "ArrowRight") lbShow(idx + 1);
    });
  }
})();
