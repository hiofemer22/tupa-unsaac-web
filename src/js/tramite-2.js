/* =========================================================
   Paso 2 · Petición (documento y trámites solicitados)
   ========================================================= */

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var estado = Tramite.cargar();
  if (!Tramite.exigirPaso(2)) return;
  var p = estado.peticion;

  Tramite.renderCabecera(2);
  Tramite.renderLateral();

  Array.prototype.forEach.call(document.querySelectorAll("[data-icon]"), function (el) {
    el.innerHTML = icon(el.getAttribute("data-icon"), 18);
  });

  /* ---- Documento ---- */
  $("tipoDoc").innerHTML = window.TUPA.tiposDocumento.map(function (t) {
    return '<option value="' + t + '"' + (t === p.tipoDoc ? " selected" : "") + ">" + t + "</option>";
  }).join("");
  Tramite.vincular("tipoDoc", p, "tipoDoc");
  Tramite.vincular("nroDoc", p, "nroDoc");
  Tramite.vincular("asunto", p, "asunto");

  /* Sugerencia de asunto según el trámite principal */
  if (!p.asunto) {
    $("asunto").placeholder = "Ej. Solicito " + Tramite.procedimiento().nombre.toLowerCase();
  }

  /* ---- Trámites ---- */
  var filtroCategoria = "";
  var consulta = "";

  $("categoria").innerHTML =
    '<option value="">Todas las categorías</option>' +
    window.TUPA.categorias.map(function (c) { return '<option value="' + c + '">' + c + "</option>"; }).join("");

  function normalizar(t) {
    return String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function dibujarLista() {
    var q = normalizar(consulta);
    var lista = Store.getProcedimientos().filter(function (x) {
      if (!x.activo) return false;
      if (filtroCategoria && x.categoria !== filtroCategoria) return false;
      if (q && normalizar(x.nombre + " " + x.codigo).indexOf(q) === -1) return false;
      return true;
    });

    if (!lista.length) {
      $("lista").innerHTML = '<p class="t-body-s text-secondary" style="padding:16px 0">No hay trámites con esos criterios.</p>';
      return;
    }

    $("lista").innerHTML = lista.map(function (x) {
      var marcado = p.tramites.indexOf(x.codigo) !== -1;
      var gratis = x.costo === 0;
      return (
        '<div class="tramite-pick' + (marcado ? " is-selected" : "") + '" data-codigo="' + x.codigo + '">' +
        '<label class="check" style="flex:1;align-items:center">' +
        '<input type="checkbox" value="' + x.codigo + '"' + (marcado ? " checked" : "") + " />" +
        '<span class="check__box">' + icon("check", 14) + "</span>" +
        '<span class="tramite-pick__body"><span class="tramite-pick__name">' + Fmt.escapar(x.nombre) + "</span><br>" +
        '<span class="tramite-pick__code">' + x.codigo + "</span></span></label>" +
        '<span class="tramite-pick__cost' + (gratis ? " tramite-pick__cost--free" : "") + '">' + Fmt.moneda(x.costo) + "</span>" +
        '<a class="tramite-pick__req" href="procedimiento.html?codigo=' + x.codigo + '" target="_blank" rel="noopener">Requisitos ' + icon("external-link", 14) + "</a>" +
        "</div>"
      );
    }).join("");
  }

  $("lista").addEventListener("change", function (e) {
    var casilla = e.target;
    if (casilla.type !== "checkbox") return;
    var codigo = casilla.value;
    var pos = p.tramites.indexOf(codigo);
    if (casilla.checked && pos === -1) p.tramites.push(codigo);
    if (!casilla.checked && pos !== -1) p.tramites.splice(pos, 1);

    /* El primer trámite marcado pasa a ser el principal de la cabecera */
    if (p.tramites.length) estado.codigo = p.tramites[0];
    Tramite.guardar();
    Tramite.mostrarError("campo-tramites", "");
    casilla.closest(".tramite-pick").classList.toggle("is-selected", casilla.checked);
    Tramite.renderCabecera(2);
    Tramite.renderLateral();
  });

  $("categoria").addEventListener("change", function () {
    filtroCategoria = this.value;
    dibujarLista();
  });

  $("buscar").addEventListener("input", function () {
    consulta = this.value;
    dibujarLista();
  });

  dibujarLista();

  /* ---- Envío ---- */
  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var errores = Tramite.validarPaso2();
    var campoTramites = $("campo-tramites");
    campoTramites.classList.toggle("field--error", !!errores.tramites);
    campoTramites.querySelector(".field__error").textContent = errores.tramites || "";
    Tramite.mostrarError("asunto", errores.asunto || "");
    if (errores.asunto) $("asunto").focus();
    if (Object.keys(errores).length) return;
    window.location.href = "tramite-3-pago.html";
  });
})();
