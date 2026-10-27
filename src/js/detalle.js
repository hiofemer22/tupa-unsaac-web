/* =========================================================
   Detalle de procedimiento: lee ?codigo=TUPA-014 de la URL
   ========================================================= */

(function () {
  var codigo = new URLSearchParams(window.location.search).get("codigo");
  var p = codigo ? Store.getProcedimiento(codigo) : null;
  var migas = document.getElementById("migas");
  var cont = document.getElementById("detalle");

  if (!p) {
    migas.innerHTML = '<a href="index.html">Catálogo TUPA</a>';
    cont.innerHTML =
      '<div class="detalle__vacio"><h1 class="t-h1">No encontramos ese procedimiento</h1>' +
      '<p class="text-secondary" style="margin:12px 0 24px">Verifique el código o vuelva al catálogo.</p>' +
      '<a class="btn btn--primary" href="index.html">Volver al catálogo</a></div>';
    return;
  }

  document.title = p.nombre + " · Catálogo TUPA · UNSAAC";
  var gratis = p.costo === 0;

  migas.innerHTML =
    '<a href="index.html">Catálogo TUPA</a>' + icon("chevron-right", 14) +
    "<span>" + Fmt.escapar(p.categoria) + "</span>" + icon("chevron-right", 14) +
    "<span>" + Fmt.escapar(p.nombre) + "</span>";

  var requisitos = p.requisitos.map(function (r) {
    return "<li>" + icon("circle-check", 20) + "<span>" + Fmt.escapar(r) + "</span></li>";
  }).join("");

  var pasos = window.TUPA.pasosAtencion.map(function (paso, i) {
    return (
      '<li><span class="pasos__num">' + (i + 1) + "</span><div>" +
      '<p class="pasos__titulo">' + paso.titulo + "</p>" +
      '<p class="pasos__detalle">' + paso.detalle + "</p></div></li>"
    );
  }).join("");

  cont.innerHTML =
    '<div class="detalle">' +
    '<div class="detalle__main">' +
    "<header>" +
    '<div class="detalle__meta"><span class="code-chip">' + p.codigo + "</span>" +
    '<span class="badge ' + (gratis ? "badge--gratuito" : "badge--de-pago") + '">' + (gratis ? "Gratuito" : "De pago") + "</span>" +
    '<span class="t-caption text-tertiary">Última actualización: TUPA 2025</span></div>' +
    '<h1 class="t-h1 detalle__title">' + Fmt.escapar(p.nombre) + "</h1>" +
    '<p class="detalle__lead">' + Fmt.escapar(p.descripcion) + "</p></header>" +
    '<section class="card detalle__block"><h2>Requisitos</h2><ul class="requisitos">' + requisitos + "</ul></section>" +
    '<section class="card detalle__block"><h2>¿Cómo se atiende su solicitud?</h2><ol class="pasos">' + pasos + "</ol></section>" +
    '<section class="card detalle__block"><h2 class="with-icon">' + icon("scale", 22) + "Base legal y calificación</h2>" +
    '<p class="t-body-s text-secondary">Texto Único de Procedimientos Administrativos (TUPA) de la UNSAAC · Ley N.° 27444, Ley del Procedimiento Administrativo General · Calificación: evaluación previa con silencio administrativo negativo.</p></section>' +
    "</div>" +
    '<aside class="detalle__aside">' +
    '<div class="card card--raised resumen"><h2 class="resumen__title">Resumen del trámite</h2>' +
    '<div class="resumen__item"><span class="resumen__icon">' + icon("banknote", 18) + "</span><div>" +
    '<p class="resumen__label">Costo</p><p class="resumen__value resumen__value--big">' + Fmt.moneda(p.costo) + "</p></div></div>" +
    '<div class="resumen__item"><span class="resumen__icon">' + icon("clock", 18) + "</span><div>" +
    '<p class="resumen__label">Plazo de atención</p><p class="resumen__value">' + Fmt.dias(p.plazo) + "</p></div></div>" +
    '<div class="resumen__item"><span class="resumen__icon">' + icon("building-2", 18) + "</span><div>" +
    '<p class="resumen__label">Unidad responsable</p><p class="resumen__value">' + Fmt.escapar(p.unidad) + "</p></div></div>" +
    '<div class="resumen__actions">' +
    '<a class="btn btn--primary btn--block" href="tramite-1-interesado.html?codigo=' + p.codigo + '">Iniciar trámite</a>' +
    '<button class="btn btn--secondary btn--block" type="button" id="imprimir">Descargar requisitos (PDF)</button>' +
    "</div></div>" +
    '<div class="callout callout--gold"><p class="callout__title">' + icon("info", 16) + "Canales de pago autorizados</p>" +
    "<p>Caja Cusco, BiPay (Bitel) y Niubiz (tarjeta, Yape y otros). Conserve su voucher y su clave de pago: los necesitará en el paso 3.</p></div>" +
    "</aside></div>";

  /* El navegador permite guardar la vista como PDF desde el cuadro de impresión */
  document.getElementById("imprimir").addEventListener("click", function () {
    window.print();
  });
})();
