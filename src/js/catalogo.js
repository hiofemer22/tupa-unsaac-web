/* =========================================================
   Catálogo: dibuja las tarjetas de procedimientos
   ========================================================= */

(function () {
  var grilla = document.getElementById("grilla");
  var resumen = document.getElementById("catalogo-resumen");

  function tarjeta(p) {
    var gratis = p.costo === 0;
    return (
      '<a class="proc-card" href="procedimiento.html?codigo=' + p.codigo + '">' +
      '<div class="proc-card__top"><span class="code-chip">' + p.codigo + "</span>" +
      '<span class="badge ' + (gratis ? "badge--gratuito" : "badge--de-pago") + '">' + (gratis ? "Gratuito" : "De pago") + "</span></div>" +
      '<h3 class="proc-card__title">' + Fmt.escapar(p.nombre) + "</h3>" +
      '<p class="proc-card__unit">' + Fmt.escapar(p.unidad) + "</p>" +
      '<p class="proc-card__desc">' + Fmt.escapar(p.resumen) + "</p>" +
      '<div class="proc-card__foot">' + icon("clock", 16) + "<span>" + Fmt.dias(p.plazo) + "</span>" +
      '<span class="proc-card__cost' + (gratis ? " proc-card__cost--free" : "") + '">' + Fmt.moneda(p.costo) + "</span></div>" +
      "</a>"
    );
  }

  var lista = Store.getProcedimientos().filter(function (p) { return p.activo; });
  grilla.innerHTML = lista.map(tarjeta).join("");
  resumen.textContent = "Mostrando " + lista.length + " procedimientos · montos referenciales del prototipo";
})();
