/* =========================================================
   Paso 1 · Interesado
   ========================================================= */

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var estado = Tramite.cargar();
  var i = estado.interesado;

  Tramite.renderCabecera(1);
  Tramite.renderLateral();

  /* Iconos declarativos: <span data-icon="lock"> */
  Array.prototype.forEach.call(document.querySelectorAll("[data-icon]"), function (el) {
    el.innerHTML = icon(el.getAttribute("data-icon"), el.getAttribute("data-icon") === "check" ? 14 : 14);
  });

  /* ---- Tipo de interesado ---- */
  function dibujarTipos() {
    $("tipos").innerHTML = window.TUPA.tiposInteresado.map(function (tipo) {
      var activo = tipo === i.tipo;
      return (
        '<button type="button" class="chip' + (activo ? " is-active" : "") + '" aria-pressed="' + activo + '" data-tipo="' + tipo + '">' +
        (activo ? icon("check", 14) : "") + tipo + "</button>"
      );
    }).join("");
    var esEstudiante = i.tipo === "Estudiante";
    $("bloque-estudiante").hidden = !esEstudiante;
    $("bloque-otro").hidden = esEstudiante;
  }

  $("tipos").addEventListener("click", function (e) {
    var boton = e.target.closest("[data-tipo]");
    if (!boton) return;
    i.tipo = boton.getAttribute("data-tipo");
    Tramite.guardar();
    dibujarTipos();
  });

  /* ---- Búsqueda de código de estudiante con autocompletado ---- */
  function mostrarEncontrado() {
    var visible = i.tipo === "Estudiante" && i.encontrado;
    $("encontrado").hidden = !visible;
    if (!visible) return;
    $("encontrado-titulo").innerHTML = icon("circle-check", 16) + "Datos encontrados en el sistema académico";
    $("nombres-ro").value = i.nombres;
    $("facultad-ro").value = i.facultad;
    $("carrera-ro").value = i.carrera;
  }

  function buscarCodigo(codigo) {
    var alumno = window.TUPA.estudiantes[codigo];
    if (!alumno) {
      i.encontrado = false;
      Tramite.guardar();
      mostrarEncontrado();
      Tramite.mostrarError("codigoEst", "No encontramos ese código. Verifique e intente de nuevo (ejemplo: 201234).");
      return;
    }
    i.codigoEst = codigo;
    i.nombres = alumno.nombres;
    i.facultad = alumno.facultad;
    i.carrera = alumno.carrera;
    i.encontrado = true;
    Tramite.guardar();
    $("codigoEst").value = codigo;
    Tramite.mostrarError("codigoEst", "");
    mostrarEncontrado();
  }

  var campoCodigo = $("codigoEst");
  campoCodigo.value = i.codigoEst;

  function sugerir() {
    var q = campoCodigo.value.trim();
    var lista = q.length < 2 ? [] : Object.keys(window.TUPA.estudiantes).filter(function (c) { return c.indexOf(q) === 0 && c !== q; });
    var caja = $("sugerencias");
    caja.hidden = lista.length === 0;
    caja.innerHTML = lista.map(function (c) {
      return '<button type="button" class="suggest__item" role="option" data-codigo="' + c + '"><span class="suggest__code">' + c +
        '</span><span class="suggest__name">' + Fmt.escapar(window.TUPA.estudiantes[c].nombres) + "</span></button>";
    }).join("");
  }

  campoCodigo.addEventListener("input", function () {
    campoCodigo.value = campoCodigo.value.replace(/\D/g, "");
    i.codigoEst = campoCodigo.value;
    i.encontrado = false;
    Tramite.guardar();
    Tramite.mostrarError("codigoEst", "");
    mostrarEncontrado();
    sugerir();
  });

  campoCodigo.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      $("buscar").click();
    }
  });

  $("sugerencias").addEventListener("click", function (e) {
    var item = e.target.closest("[data-codigo]");
    if (!item) return;
    $("sugerencias").hidden = true;
    buscarCodigo(item.getAttribute("data-codigo"));
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".suggest-wrap")) $("sugerencias").hidden = true;
  });

  $("buscar").addEventListener("click", function () {
    $("sugerencias").hidden = true;
    var codigo = campoCodigo.value.trim();
    if (!/^\d{6}$/.test(codigo)) {
      Tramite.mostrarError("codigoEst", "Ingrese los 6 dígitos de su código.");
      return;
    }
    buscarCodigo(codigo);
  });

  /* ---- Campos de texto ---- */
  Tramite.vincular("documento", i, "documento", function (v) { return v.replace(/\D/g, ""); });
  Tramite.vincular("nombres", i, "nombres");
  Tramite.vincular("telefono", i, "telefono");
  Tramite.vincular("correo", i, "correo");
  Tramite.vincular("direccion", i, "direccion");
  Tramite.vincular("autoriza", i, "autoriza");

  dibujarTipos();
  mostrarEncontrado();

  /* ---- Envío ---- */
  var IDS = {
    codigoEst: "codigoEst",
    documento: "documento",
    nombres: "nombres",
    telefono: "telefono",
    correo: "correo",
    direccion: "direccion"
  };

  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var errores = Tramite.validarPaso1();
    Tramite.mostrarErrores(errores, IDS);
    if (Object.keys(errores).length) return;
    window.location.href = "tramite-2-peticion.html";
  });

  $("cancelar").addEventListener("click", function () {
    Tramite.reiniciar();
  });
})();
