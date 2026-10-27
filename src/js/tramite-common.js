/* =========================================================
   Asistente de trámite — lógica compartida por los 4 pasos:
   estado en sessionStorage, validaciones, cabecera con
   indicador de pasos y resumen lateral.
   ========================================================= */

(function () {
  var CLAVE = "tramite";
  var CODIGO_POR_DEFECTO = "TUPA-014";

  var PASOS = [
    { n: 1, etiqueta: "Interesado", href: "tramite-1-interesado.html" },
    { n: 2, etiqueta: "Petición", href: "tramite-2-peticion.html" },
    { n: 3, etiqueta: "Archivos y pago", href: "tramite-3-pago.html" },
    { n: 4, etiqueta: "Confirmar", href: "tramite-4-confirmar.html" }
  ];

  var RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function estadoInicial(codigo) {
    return {
      codigo: codigo,
      interesado: {
        tipo: "Estudiante",
        codigoEst: "",
        documento: "",
        nombres: "",
        facultad: "",
        carrera: "",
        telefono: "",
        correo: "",
        direccion: "",
        autoriza: true,
        encontrado: false
      },
      peticion: { tipoDoc: "Solicitud", nroDoc: "", asunto: "", tramites: [codigo] },
      pago: { medio: "Caja Cusco", clave: "", fecha: "", archivos: [], aclaracion: "" },
      declaracion: false,
      captcha: false
    };
  }

  var Tramite = {
    pasos: PASOS,
    estado: null,

    /* Carga (o crea) el estado. ?codigo=TUPA-014 reinicia el trámite si cambia. */
    cargar: function () {
      var parametro = new URLSearchParams(window.location.search).get("codigo");
      var guardado = Store.session.get(CLAVE, null);
      if (parametro && Store.getProcedimiento(parametro)) {
        if (!guardado || guardado.codigo !== parametro) guardado = estadoInicial(parametro);
      }
      if (!guardado) guardado = estadoInicial(CODIGO_POR_DEFECTO);
      this.estado = guardado;
      this.guardar();
      return guardado;
    },

    guardar: function () {
      Store.session.set(CLAVE, this.estado);
    },

    reiniciar: function () {
      Store.session.remove(CLAVE);
    },

    procedimiento: function () {
      return Store.getProcedimiento(this.estado.codigo) || Store.getProcedimientos()[0];
    },

    seleccionados: function () {
      var lista = Store.getProcedimientos();
      return this.estado.peticion.tramites.map(function (c) {
        return lista.filter(function (p) { return p.codigo === c; })[0];
      }).filter(Boolean);
    },

    totalPagar: function () {
      return this.seleccionados().reduce(function (suma, p) { return suma + p.costo; }, 0);
    },

    plazoMaximo: function () {
      return this.seleccionados().reduce(function (m, p) { return Math.max(m, p.plazo); }, 0);
    },

    /* ----- Validaciones: devuelven { campo: "mensaje" } ----- */
    validarPaso1: function () {
      var i = this.estado.interesado, e = {};
      if (i.tipo === "Estudiante") {
        if (!/^\d{6}$/.test(i.codigoEst)) e.codigoEst = "Ingrese los 6 dígitos de su código.";
        else if (!i.encontrado) e.codigoEst = "Busque su código para validar sus datos.";
      } else {
        if (!/^\d{8,11}$/.test(i.documento)) e.documento = "Ingrese un DNI (8 dígitos) o RUC (11 dígitos).";
        if (i.nombres.trim().length < 3) e.nombres = "Ingrese sus nombres y apellidos o razón social.";
      }
      if (!/^9\d{8}$/.test(i.telefono.replace(/\s/g, ""))) e.telefono = "Ingrese un celular de 9 dígitos que empiece con 9.";
      if (!RE_CORREO.test(i.correo.trim())) e.correo = "Ingrese un correo electrónico válido.";
      if (i.direccion.trim().length < 5) e.direccion = "Ingrese su dirección.";
      return e;
    },

    validarPaso2: function () {
      var p = this.estado.peticion, e = {};
      if (p.asunto.trim().length < 5) e.asunto = "Describa el asunto de su solicitud (mínimo 5 caracteres).";
      if (!p.tramites.length) e.tramites = "Seleccione al menos un trámite.";
      return e;
    },

    validarPaso3: function () {
      var p = this.estado.pago, e = {};
      if (this.totalPagar() > 0) {
        if (!/^\d{4,12}$/.test(p.clave)) e.clave = "Ingrese su clave de pago (solo números, 4 a 12 dígitos).";
        if (!p.fecha) e.fecha = "Indique la fecha en que realizó el pago.";
        else if (new Date(p.fecha) > new Date()) e.fecha = "La fecha de pago no puede ser futura.";
        var hayVoucher = p.archivos.some(function (a) { return a.categoria === "Voucher"; });
        if (!hayVoucher) e.voucher = "El voucher de pago es obligatorio.";
      }
      return e;
    },

    /* Si falta información de un paso anterior, vuelve a ese paso */
    exigirPaso: function (paso) {
      var validadores = [this.validarPaso1, this.validarPaso2, this.validarPaso3];
      for (var n = 1; n < paso; n++) {
        if (Object.keys(validadores[n - 1].call(this)).length) {
          window.location.replace(PASOS[n - 1].href);
          return false;
        }
      }
      return true;
    },

    /* ----- Interfaz compartida ----- */
    renderCabecera: function (paso) {
      var p = this.procedimiento();
      var pasosHTML = PASOS.map(function (s, i) {
        var clase = s.n < paso ? "is-done" : s.n === paso ? "is-current" : "";
        var punto = s.n < paso ? icon("check", 16) : s.n;
        var linea = i < PASOS.length - 1 ? '<span class="stepper__line' + (s.n < paso ? " is-done" : "") + '"></span>' : "";
        return (
          '<li class="stepper__step ' + clase + '"' + (s.n === paso ? ' aria-current="step"' : "") + ">" +
          '<span class="stepper__dot">' + punto + '</span><span class="stepper__label">' + s.etiqueta + "</span></li>" + linea
        );
      }).join("");

      document.getElementById("tramite-head").innerHTML =
        '<div class="tramite-head"><div class="container tramite-head__inner">' +
        '<div class="tramite-head__meta"><span class="code-chip">' + p.codigo + "</span><span>Nueva solicitud</span></div>" +
        '<h1 class="t-h1 tramite-head__title">' + Fmt.escapar(p.nombre) + "</h1>" +
        '<ol class="stepper" aria-label="Pasos del trámite">' + pasosHTML + "</ol></div></div>";
    },

    renderLateral: function () {
      var lista = this.seleccionados();
      var total = this.totalPagar();
      var nombres = lista.map(function (p) { return Fmt.escapar(p.nombre); }).join("<br>");
      var unidades = lista.map(function (p) { return p.unidad; }).filter(function (u, i, a) { return a.indexOf(u) === i; }).join("<br>");
      var cfg = window.TUPA.config;

      document.getElementById("tramite-side").innerHTML =
        '<div class="card card--raised side-summary"><h2 class="side-summary__title">Resumen de su solicitud</h2><dl>' +
        "<dt>Procedimiento</dt><dd>" + (nombres || "—") + "</dd>" +
        "<dt>Unidad responsable</dt><dd>" + (unidades || "—") + "</dd>" +
        "<dt>Plazo de atención</dt><dd>" + (lista.length ? Fmt.dias(this.plazoMaximo()) : "—") + "</dd>" +
        '<dt>Tasa a pagar</dt><dd class="side-summary__total">' + (total > 0 ? Fmt.moneda(total) : "Gratuito") + "</dd>" +
        "</dl></div>" +
        '<div class="callout callout--gold"><p class="callout__title">' + icon("clock", 16) + "Horario de recepción</p>" +
        "<p>Atención 24 h, todos los días. Los documentos se derivan de lunes a viernes de " + cfg.horaInicioRecepcion + " a " + cfg.horaFinRecepcion +
        "; lo que ingrese después se considera presentado el siguiente día hábil.</p></div>" +
        '<div class="callout callout--brand"><p class="callout__title">' + icon("life-buoy", 16) + "¿Necesita ayuda?</p>" +
        "<p>Escriba a tramite.documentario@unsaac.edu.pe o acérquese a Mesa de Partes en horario de oficina.</p></div>";
    },

    /* Enlaza un control con una propiedad del estado y guarda al escribir */
    vincular: function (idControl, objeto, propiedad, transformar) {
      var control = document.getElementById(idControl);
      if (!control) return null;
      var esCasilla = control.type === "checkbox";
      if (esCasilla) control.checked = !!objeto[propiedad];
      else control.value = objeto[propiedad] || "";
      control.addEventListener(esCasilla ? "change" : "input", function () {
        var valor = esCasilla ? control.checked : control.value;
        objeto[propiedad] = transformar ? transformar(valor) : valor;
        Tramite.guardar();
        Tramite.mostrarError(idControl, "");
      });
      return control;
    },

    /* Marca/limpia el error de un campo (.field) por id de control */
    mostrarError: function (idControl, mensaje) {
      var control = document.getElementById(idControl);
      if (!control) return;
      var campo = control.closest(".field");
      if (!campo) return;
      var error = campo.querySelector(".field__error");
      if (mensaje) {
        campo.classList.add("field--error");
        if (error) error.textContent = mensaje;
      } else {
        campo.classList.remove("field--error");
      }
    },

    mostrarErrores: function (errores, ids) {
      var primero = null;
      Object.keys(ids).forEach(function (campo) {
        var mensaje = errores[campo];
        Tramite.mostrarError(ids[campo], mensaje || "");
        if (mensaje && !primero) primero = document.getElementById(ids[campo]);
      });
      if (primero) primero.focus();
    }
  };

  window.Tramite = Tramite;
})();
