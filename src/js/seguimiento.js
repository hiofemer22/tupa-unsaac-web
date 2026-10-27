/* =========================================================
   Seguimiento: búsqueda de expedientes y detalle con
   línea de tiempo, datos y plazo restante.
   ========================================================= */

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var PLACEHOLDERS = {
    expediente: "Ej. 000123 o EXP-2026-000123",
    codigo: "Ej. 201234",
    documento: "Ej. 70123456"
  };
  var seleccionado = null;

  $("buscar").innerHTML = icon("search", 18) + "Buscar";

  /* Último grupo de dígitos: "EXP-2026-000123" y "123" dan 123 */
  function numeroDe(texto) {
    var m = String(texto).match(/(\d+)\D*$/);
    return m ? Number(m[1]) : null;
  }

  function coincide(e, por, valor) {
    var s = e.solicitante;
    if (por === "expediente") {
      return numeroDe(valor) !== null && numeroDe(valor) === numeroDe(e.codigo);
    }
    if (por === "codigo") return s.codigoEst === valor.trim();
    return s.documento === valor.trim();
  }

  function buscar(por, valor, anio) {
    return Expedientes.todos().filter(function (e) {
      return e.fechaRegistro.slice(0, 4) === String(anio) && coincide(e, por, valor);
    });
  }

  function mostrarError(mensaje) {
    var campo = $("valor").closest(".field");
    campo.classList.toggle("field--error", !!mensaje);
    campo.querySelector(".field__error").textContent = mensaje || "";
  }

  function pintarResultados(lista) {
    $("ayuda-inicial").hidden = true;
    $("sin-resultados").hidden = lista.length !== 0;
    $("resultados").hidden = lista.length === 0;
    $("detalle").hidden = true;
    if (!lista.length) return;

    $("resultados-titulo").textContent = lista.length + (lista.length === 1 ? " expediente encontrado" : " expedientes encontrados");
    $("tabla-resultados").querySelector("tbody").innerHTML = lista.map(function (e) {
      return (
        '<tr data-codigo="' + e.codigo + '">' +
        '<td><span class="code-chip">' + e.codigo + "</span></td>" +
        "<td>" + Fmt.fechaCorta(e.fechaRegistro) + "</td>" +
        "<td>" + Fmt.escapar(e.tipoDoc + " N.° " + e.nroDoc) + "</td>" +
        '<td class="num">' + e.folios + "</td>" +
        "<td>" + Fmt.escapar(e.solicitante.nombres) + "</td>" +
        "<td>" + Fmt.escapar(e.unidad) + "</td>" +
        "<td>" + Fmt.badgeEstado(e.estado) + "</td>" +
        '<td><button type="button" class="table-row-btn" data-ver="' + e.codigo + '">' + icon("eye", 16) + "Ver</button></td></tr>"
      );
    }).join("");

    if (lista.length === 1) abrirDetalle(lista[0].codigo);
  }

  function claseHito(evento, esUltimo, estado) {
    if (evento === "Observado") return "is-warn";
    if (evento === "Rechazado") return "is-bad";
    if (esUltimo && estado !== "Finalizado" && estado !== "Aprobado" && estado !== "Rechazado") return "is-current";
    return "is-done";
  }

  function pintarPlazo(e) {
    var transcurridos = e.diasRestantes === null ? e.plazo : Math.max(0, e.plazo - e.diasRestantes);
    var porcentaje = Math.min(100, Math.round((transcurridos / e.plazo) * 100));
    var clase = "";
    var nota;
    if (e.diasRestantes === null) {
      porcentaje = 100;
      nota = "El trámite ya fue resuelto.";
    } else if (e.diasRestantes < 0) {
      clase = " is-late";
      porcentaje = 100;
      nota = "El plazo venció hace " + Math.abs(e.diasRestantes) + (Math.abs(e.diasRestantes) === 1 ? " día hábil." : " días hábiles.");
    } else if (e.diasRestantes === 0) {
      clase = " is-today";
      nota = "El plazo vence hoy.";
    } else {
      nota = "Quedan " + Fmt.dias(e.diasRestantes) + " para la atención.";
    }
    return (
      '<div class="plazo' + clase + '"><div class="plazo__row"><span>Plazo de atención</span><strong>' + Fmt.dias(e.plazo) + "</strong></div>" +
      '<div class="progress progress--track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + porcentaje + '"><div class="progress__bar" style="width:' + porcentaje + '%"></div></div>' +
      '<p class="plazo__note">' + nota + "</p></div>"
    );
  }

  function abrirDetalle(codigo) {
    var e = Expedientes.porCodigo(codigo);
    if (!e) return;
    seleccionado = e;
    Array.prototype.forEach.call($("tabla-resultados").querySelectorAll("tbody tr"), function (tr) {
      tr.classList.toggle("is-selected", tr.getAttribute("data-codigo") === codigo);
    });

    var s = e.solicitante;
    var hitos = e.historial.map(function (h, idx) {
      var ultimo = idx === e.historial.length - 1;
      var clase = claseHito(h.evento, ultimo, e.estado);
      var marca = clase === "is-warn" ? icon("triangle-alert", 14) : icon("check", 14);
      return (
        '<li class="timeline__item ' + clase + '"><span class="timeline__dot">' + marca + "</span><div>" +
        '<p class="timeline__title">' + Fmt.escapar(h.evento) + "</p>" +
        '<p class="timeline__meta">' + Fmt.fechaHora(h.fecha) + " · " + Fmt.escapar(h.unidad) + "</p>" +
        (h.detalle ? '<p class="timeline__detail">' + Fmt.escapar(h.detalle) + "</p>" : "") +
        "</div></li>"
      );
    }).reverse().join("");

    var pagoTexto = e.pago.monto > 0
      ? Fmt.moneda(e.pago.monto) + " · " + e.pago.medio + " · clave " + e.pago.clave + (e.pago.validado ? " (validado)" : " (pendiente de validación)")
      : "Gratuito";

    $("detalle").innerHTML =
      '<div class="seg-detail__title"><h2>' + e.codigo + "</h2>" + Fmt.badgeEstado(e.estado) + "</div>" +
      '<div class="card seg-card"><h3 class="t-h3">Historial del expediente</h3><ol class="timeline">' + hitos + "</ol></div>" +
      '<div class="seg-side">' +
      '<div class="card seg-card"><h3 class="t-h3">Datos del expediente</h3><dl class="datos">' +
      "<div><dt>Procedimiento</dt><dd>" + Fmt.escapar(e.procedimientoNombre) + " (" + e.procedimiento + ")</dd></div>" +
      "<div><dt>Asunto</dt><dd>" + Fmt.escapar(e.asunto) + "</dd></div>" +
      "<div><dt>Interesado</dt><dd>" + Fmt.escapar(s.nombres) + "</dd></div>" +
      "<div><dt>Unidad responsable</dt><dd>" + Fmt.escapar(e.unidad) + "</dd></div>" +
      "<div><dt>Fecha de registro</dt><dd>" + Fmt.fechaHora(e.fechaRegistro) + "</dd></div>" +
      "<div><dt>Pago</dt><dd>" + Fmt.escapar(pagoTexto) + "</dd></div>" +
      "</dl></div>" +
      '<div class="card seg-card">' + pintarPlazo(e) + "</div>" +
      '<button type="button" class="btn btn--secondary btn--block no-print" id="constancia">' + icon("download", 18) + "Descargar constancia de registro</button>" +
      "</div>";
    $("detalle").hidden = false;
    $("constancia").addEventListener("click", function () { window.print(); });
    $("detalle").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function ejecutarBusqueda() {
    var por = $("por").value;
    var valor = $("valor").value.trim();
    if (!valor) {
      mostrarError("Ingrese el valor a buscar.");
      return;
    }
    if (por === "expediente" && !/\d/.test(valor)) {
      mostrarError("Ingrese el número del expediente (por ejemplo 000123).");
      return;
    }
    if (por === "codigo" && !/^\d{6}$/.test(valor)) {
      mostrarError("El código de estudiante tiene 6 dígitos.");
      return;
    }
    if (por === "documento" && !/^\d{8,11}$/.test(valor)) {
      mostrarError("Ingrese un DNI (8 dígitos) o RUC (11 dígitos).");
      return;
    }
    mostrarError("");
    var lista = buscar(por, valor, $("anio").value);
    $("sin-resultados-texto").textContent =
      "No hay expedientes del año " + $("anio").value + " para «" + valor + "». Verifique el dato o cambie el año de búsqueda.";
    pintarResultados(lista);
  }

  $("form-busqueda").addEventListener("submit", function (ev) {
    ev.preventDefault();
    ejecutarBusqueda();
  });

  $("por").addEventListener("change", function () {
    $("valor").placeholder = PLACEHOLDERS[$("por").value];
    mostrarError("");
  });

  $("valor").addEventListener("input", function () { mostrarError(""); });

  $("tabla-resultados").addEventListener("click", function (ev) {
    var b = ev.target.closest("[data-ver]");
    if (b) abrirDetalle(b.getAttribute("data-ver"));
  });

  $("usar-ejemplo").addEventListener("click", function () {
    $("por").value = "expediente";
    $("valor").value = "EXP-2026-000123";
    ejecutarBusqueda();
  });

  /* Enlaces desde otras pantallas: seguimiento.html?valor=EXP-2026-000124 */
  var valorURL = new URLSearchParams(window.location.search).get("valor");
  if (valorURL) {
    $("valor").value = valorURL;
    $("por").value = /^[1-9]\d{5}$/.test(valorURL) ? "codigo" : /^\d{8,11}$/.test(valorURL) ? "documento" : "expediente";
    $("valor").placeholder = PLACEHOLDERS[$("por").value];
    ejecutarBusqueda();
  }
})();
