/* =========================================================
   Layout público: renderiza la barra de navegación y el pie
   de página en los contenedores #navbar y #footer.
   El enlace activo se toma de <body data-nav="...">.
   ========================================================= */

(function () {
  var NAV_ITEMS = [
    { id: "catalogo", label: "Catálogo TUPA", href: "index.html" },
    { id: "tramite", label: "Iniciar trámite", href: "tramite-1-interesado.html" },
    { id: "seguimiento", label: "Seguimiento", href: "seguimiento.html" }
  ];

  function renderNavbar() {
    var mount = document.getElementById("navbar");
    if (!mount) return;
    var active = document.body.getAttribute("data-nav");

    var links = NAV_ITEMS.map(function (item) {
      var cls = "navbar__link" + (item.id === active ? " is-active" : "");
      var current = item.id === active ? ' aria-current="page"' : "";
      return '<a class="' + cls + '" href="' + item.href + '"' + current + ">" + item.label + "</a>";
    }).join("");

    mount.innerHTML =
      '<header class="navbar">' +
      '<div class="navbar__inner">' +
      '<a class="navbar__brand" href="index.html" aria-label="Inicio · Plataforma TUPA UNSAAC">' +
      '<img src="assets/escudo-unsaac.png" alt="Escudo de la UNSAAC" />' +
      '<span class="navbar__brand-text">' +
      '<span class="navbar__brand-name">Universidad Nacional de San Antonio Abad del Cusco</span>' +
      '<span class="navbar__brand-sub">Plataforma TUPA · Trámites en línea</span>' +
      "</span></a>" +
      '<nav class="navbar__links" aria-label="Principal">' + links + "</nav>" +
      '<a class="btn btn--outline-light navbar__cta" href="admin/login.html">' +
      icon("log-in", 18) + "Acceso funcionarios</a>" +
      "</div></header>";

  }

  function renderFooter() {
    var mount = document.getElementById("footer");
    if (!mount) return;
    mount.innerHTML =
      '<footer class="footer"><div class="footer__inner">' +
      '<div class="footer__grid">' +
      '<div class="footer__brand">' +
      '<div class="footer__brand-head"><img src="assets/escudo-unsaac.png" alt="" />' +
      '<span class="footer__brand-name">Universidad Nacional de San Antonio Abad del Cusco</span></div>' +
      '<p class="footer__info">' + icon("map-pin", 16) +
      "<span>Av. de la Cultura N.° 733, Cusco · Unidad de Trámite Documentario y Comunicaciones</span></p>" +
      '<p class="footer__info">' + icon("clock", 16) +
      "<span>Plataforma disponible 24 h · Atención en días hábiles</span></p>" +
      "</div>" +
      '<div><h2 class="footer__title">Servicios</h2><ul class="footer__list">' +
      '<li><a href="index.html">Catálogo TUPA</a></li>' +
      '<li><a href="tramite-1-interesado.html">Iniciar trámite</a></li>' +
      '<li><a href="seguimiento.html">Seguimiento de expediente</a></li>' +
      '<li><a href="#">Pagos y tasas</a></li></ul></div>' +
      '<div><h2 class="footer__title">Transparencia</h2><ul class="footer__list">' +
      '<li><a href="#">TUPA vigente</a></li>' +
      '<li><a href="#">Tarifario de servicios</a></li>' +
      '<li><a href="#">Libro de reclamaciones</a></li>' +
      '<li><a href="#">Portal de transparencia</a></li></ul></div>' +
      "</div>" +
      '<p class="footer__bottom">© 2026 UNSAAC · Prototipo académico — Desarrollo de Software I · Ingeniería Informática y de Sistemas</p>' +
      "</div></footer>";
  }

  renderNavbar();
  renderFooter();
})();
