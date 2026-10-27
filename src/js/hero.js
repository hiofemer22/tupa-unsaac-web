/* =========================================================
   Hero del catálogo: buscador principal y consulta rápida
   ========================================================= */

(function () {
  var $ = function (id) { return document.getElementById(id); };

  $("hero-eyebrow").innerHTML = icon("shield-check", 14) + "Texto Único de Procedimientos Administrativos 2025";
  $("hero-search-icon").innerHTML = icon("search", 22);
  $("quick-icon").innerHTML = icon("search", 20);

  var activos = Store.getProcedimientos().filter(function (p) { return p.activo; });
  $("stat-total").textContent = activos.length;

  /* Buscador principal: filtra el catálogo de esta misma página */
  $("hero-search").addEventListener("submit", function (e) {
    e.preventDefault();
    var q = $("hero-q").value.trim();
    if (window.Catalogo && typeof window.Catalogo.buscar === "function") {
      window.Catalogo.buscar(q);
    }
    $("catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  /* Consulta rápida: lleva a la página de seguimiento con el código */
  $("quick-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var codigo = $("quick-code").value.trim().toUpperCase();
    var campo = $("quick-field");
    if (!codigo) {
      campo.classList.add("field--error");
      $("quick-code").focus();
      return;
    }
    campo.classList.remove("field--error");
    window.location.href = "seguimiento.html?valor=" + encodeURIComponent(codigo);
  });
})();
