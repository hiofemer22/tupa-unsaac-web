/* =========================================================
   Pantalla de solicitud registrada
   ========================================================= */

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var param = new URLSearchParams(window.location.search).get("codigo") || Store.session.get("ultimo-expediente", "");
  var exp = param ? Expedientes.porCodigo(param) : null;

  if (!exp) {
    $("no-existe").hidden = false;
    return;
  }
  $("exito").hidden = false;

  Array.prototype.forEach.call(document.querySelectorAll("[data-icon]"), function (el) {
    el.innerHTML = icon(el.getAttribute("data-icon"), Number(el.getAttribute("data-size")) || 18);
  });

  $("lead").textContent =
    "Le enviaremos una copia del registro a " + (exp.solicitante.correo || "su correo") + ". Guarde su número de expediente para consultar el avance de su trámite.";
  $("codigo").textContent = exp.codigo;
  $("copiar").innerHTML = icon("copy", 16) + "Copiar";
  $("ver").href = "seguimiento.html?valor=" + encodeURIComponent(exp.codigo);

  $("hechos").innerHTML =
    '<div class="success__fact">' + icon("calendar", 20) + "Fecha de registro<strong>" + Fmt.fechaHora(exp.fechaRegistro) + "</strong></div>" +
    '<div class="success__fact">' + icon("building-2", 20) + "Unidad responsable<strong>" + Fmt.escapar(exp.unidad) + "</strong></div>" +
    '<div class="success__fact">' + icon("clock", 20) + "Plazo de atención<strong>" + Fmt.dias(exp.plazo) + "</strong></div>";

  var cfg = window.TUPA.config;
  $("aviso").innerHTML =
    icon("info", 20) +
    "<div><strong>Horario de derivación</strong><span>Su solicitud se derivó a la unidad responsable el mismo día solo si ingresó entre las " + cfg.horaInicioRecepcion +
    " y las " + cfg.horaFinRecepcion + " de lunes a viernes. En otro caso se considera presentada el siguiente día hábil.</span></div>";

  $("copiar").addEventListener("click", function () {
    var listo = function () { UI.toast("Número de expediente copiado."); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(exp.codigo).then(listo, function () { UI.toast(exp.codigo); });
    } else {
      UI.toast("Su número de expediente es " + exp.codigo);
    }
  });
})();
