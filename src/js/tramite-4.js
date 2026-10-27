/* =========================================================
   Paso 4 · Revisión y confirmación
   Muestra un resumen editable, exige la declaración jurada y
   la verificación, y registra el expediente.
   ========================================================= */

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var estado = Tramite.cargar();
  if (!Tramite.exigirPaso(4)) return;

  Tramite.renderCabecera(4);
  Tramite.renderLateral();

  Array.prototype.forEach.call(document.querySelectorAll("[data-icon]"), function (el) {
    el.innerHTML = icon(el.getAttribute("data-icon"), Number(el.getAttribute("data-size")) || 18);
  });
  [1, 2, 3].forEach(function (n) {
    $("ed-" + n).innerHTML = icon("pencil", 16) + "Editar";
  });

  function fila(titulo, valor, ancho) {
    return '<div' + (ancho ? ' class="is-wide"' : "") + "><dt>" + titulo + "</dt><dd>" + (valor ? Fmt.escapar(valor) : "—") + "</dd></div>";
  }

  var i = estado.interesado;
  var pet = estado.peticion;
  var pago = estado.pago;
  var total = Tramite.totalPagar();

  $("rev-interesado").innerHTML =
    fila("Tipo de interesado", i.tipo) +
    (i.tipo === "Estudiante" ? fila("Código de estudiante", i.codigoEst) : fila("Documento (DNI / RUC)", i.documento)) +
    fila("Nombres y apellidos", i.nombres) +
    (i.tipo === "Estudiante" ? fila("Escuela profesional", i.carrera) : "") +
    fila("Celular", i.telefono) +
    fila("Correo electrónico", i.correo) +
    fila("Dirección", i.direccion, true) +
    fila("Notificaciones por correo", i.autoriza ? "Sí, autorizo" : "No autorizo");

  $("rev-peticion").innerHTML =
    fila("Tipo de documento", pet.tipoDoc + (pet.nroDoc ? " N.° " + pet.nroDoc : "")) +
    fila("Trámites solicitados", Tramite.seleccionados().map(function (p) { return p.nombre + " (" + p.codigo + ")"; }).join(", ")) +
    fila("Asunto", pet.asunto, true);

  var archivos = pago.archivos.map(function (a) { return a.nombre + " · " + Fmt.tamano(a.tamano); }).join("  ·  ");
  $("rev-pago").innerHTML =
    (total > 0
      ? fila("Monto pagado", Fmt.moneda(total)) +
        fila("Medio de pago", pago.medio) +
        fila("Clave de pago", pago.clave) +
        fila("Fecha de pago", pago.fecha ? Fmt.fechaCorta(pago.fecha + "T12:00:00") : "")
      : fila("Tasa", "Gratuito")) +
    fila("Documentos adjuntos", archivos, true) +
    (pago.aclaracion ? fila("Aclaración", pago.aclaracion, true) : "");

  Tramite.vincular("declaracion", estado, "declaracion");
  Tramite.vincular("captcha", estado, "captcha");

  function error(id, mensaje) {
    var p = $("error-" + id);
    p.hidden = !mensaje;
    p.textContent = mensaje || "";
  }
  $("declaracion").addEventListener("change", function () { error("declaracion", ""); });
  $("captcha").addEventListener("change", function () { error("captcha", ""); });

  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    if (!estado.declaracion) { error("declaracion", "Debe aceptar la declaración jurada para continuar."); ok = false; }
    if (!estado.captcha) { error("captcha", "Confirme que no es un robot."); ok = false; }
    if (!ok) {
      var primero = !estado.declaracion ? $("declaracion") : $("captcha");
      primero.closest("label").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    $("guardar").disabled = true;
    var exp = Expedientes.crear(estado);
    Tramite.reiniciar();
    Store.session.set("ultimo-expediente", exp.codigo);
    window.location.href = "registrado.html?codigo=" + encodeURIComponent(exp.codigo);
  });
})();
