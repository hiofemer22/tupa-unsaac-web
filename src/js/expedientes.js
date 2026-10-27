/* =========================================================
   Expedientes de ejemplo + API de acceso.
   Los datos son ficticios. Los expedientes nuevos se guardan
   en localStorage; en la Unidad 2 esto pasará a una API.
   ========================================================= */

(function () {
  var HOY = "2026-10-26";
  var CLAVE = "expedientes-nuevos";
  var CLAVE_CAMBIOS = "expedientes-cambios";
  var CLAVE_CONTADOR = "expedientes-contador";

  var NOMBRES = [
    "Rodrigo Aníbal Ccori Huamán", "María Quispe Huamán", "Luis Condori Mamani", "Ana Lucía Mamani Torres",
    "José Carlos Huillca Pari", "Rosa Elena Paucar Cusi", "Miguel Ángel Ccama Flores", "Carmen Rojas Yupanqui",
    "Jhon Edwin Apaza Callo", "Lucero Valdez Béjar", "Walter Zúñiga Puma", "Daniela Sallo Huaman",
    "Percy Alvarez Quispe", "Katherine Ochoa Loayza", "Edgar Mendoza Champi", "Yesenia Ttito Mayta"
  ];

  var FACULTADES = [
    "Ing. Eléctrica, Electrónica, Informática y Mecánica",
    "Ciencias Económicas, Administrativas y Contables",
    "Ingeniería Civil",
    "Derecho y Ciencias Sociales",
    "Ciencias de la Salud"
  ];

  var CODIGOS = ["TUPA-014", "TUPA-021", "TUPA-033", "TUPA-047", "TUPA-052", "TUPA-068", "TUPA-080", "TUPA-095"];

  /* Secuencia de estados: los 8 primeros coinciden con el diseño en Figma */
  var ESTADOS_INICIALES = [
    "En evaluación", "Registrado", "Observado", "Derivado", "Aprobado", "Finalizado", "Rechazado", "En evaluación"
  ];
  var ESTADOS_RESTO = [];
  function repetir(estado, n) { for (var i = 0; i < n; i++) ESTADOS_RESTO.push(estado); }
  repetir("En evaluación", 19);
  repetir("Observado", 5);
  repetir("Registrado", 3);
  repetir("Derivado", 2);
  repetir("Aprobado", 1);
  /* Mezcla determinista para que no queden agrupados */
  var ORDEN = [3, 11, 0, 17, 8, 25, 14, 1, 21, 6, 28, 12, 19, 4, 26, 9, 15, 22, 2, 29, 7, 13, 24, 5, 18, 10, 27, 16, 23, 20];
  var ESTADOS_MEZCLADOS = ORDEN.map(function (i) { return ESTADOS_RESTO[i]; });

  function pad(n) { return String(n).padStart(6, "0"); }

  function sumarDias(iso, dias) {
    var d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + dias);
    return d.toISOString().slice(0, 10);
  }

  function procedimientoDe(codigo) {
    var lista = window.TUPA.procedimientos;
    for (var i = 0; i < lista.length; i++) if (lista[i].codigo === codigo) return lista[i];
    return lista[0];
  }

  function dosDigitos(n) { return String(n).padStart(2, "0"); }

  function aIso(d) {
    return d.getFullYear() + "-" + dosDigitos(d.getMonth() + 1) + "-" + dosDigitos(d.getDate()) + "T" + dosDigitos(d.getHours()) + ":" + dosDigitos(d.getMinutes()) + ":00";
  }

  /* Historial coherente: nunca antes del registro ni después de "hoy" */
  function historialPara(estado, isoRegistro, unidad) {
    var tope = new Date(HOY + "T17:30:00");
    var anterior = new Date(isoRegistro);
    function hito(evento, unidadHito, detalle, diasDespues, hora, minuto) {
      var d = new Date(isoRegistro);
      if (diasDespues === 0) {
        d = new Date(anterior.getTime() + 25 * 60000);
      } else {
        d.setDate(d.getDate() + diasDespues);
        d.setHours(hora, minuto, 0, 0);
      }
      if (d > tope) d = new Date(tope.getTime());
      if (d <= anterior) d = new Date(anterior.getTime() + 10 * 60000);
      anterior = d;
      return { fecha: aIso(d), evento: evento, unidad: unidadHito, detalle: detalle };
    }
    var h = [{ fecha: isoRegistro, evento: "Solicitud registrada", unidad: "Mesa de Partes virtual", detalle: "El interesado registró su solicitud en línea." }];
    if (estado === "Registrado") return h;
    h.push(hito("Derivado a la unidad responsable", unidad, "Trámite Documentario derivó el expediente.", 0));
    if (estado === "Derivado") return h;
    h.push(hito("En evaluación", unidad, "El funcionario inició la revisión de requisitos y pago.", 1, 10, 5));
    if (estado === "En evaluación") return h;
    if (estado === "Observado") {
      h.push(hito("Observado", unidad, "Falta subsanar un requisito: adjuntar copia legible del DNI.", 2, 11, 20));
    } else if (estado === "Rechazado") {
      h.push(hito("Rechazado", unidad, "El pago no corresponde al procedimiento solicitado.", 2, 11, 20));
    } else {
      h.push(hito("Aprobado", unidad, "Se verificó el pago y se aprobó la solicitud.", 2, 11, 20));
      if (estado === "Finalizado") h.push(hito("Finalizado", unidad, "Documento entregado al interesado.", 3, 15, 30));
    }
    return h;
  }

  function fabricar(numero, estado, indice, hoyForzado) {
    var codigoProc = CODIGOS[indice % CODIGOS.length];
    var proc = procedimientoDe(codigoProc);
    var nombre = NOMBRES[indice % NOMBRES.length];
    var estudiante = indice % 4 !== 3;
    var codEst = String(190000 + ((indice * 7919) % 30000)).slice(0, 6);
    var documento = String(40000000 + ((indice * 104729) % 9999999));
    var conocido = null;
    Object.keys(window.TUPA.estudiantes).forEach(function (k) {
      if (window.TUPA.estudiantes[k].nombres === nombre) conocido = k;
    });
    if (conocido) { codEst = conocido; estudiante = true; documento = "7" + conocido + "1"; }
    var cuantosDias = hoyForzado ? 0 : indice % Math.max(proc.plazo, 1);
    var fecha = sumarDias(HOY, -cuantosDias);
    var diasRestantes = proc.plazo - cuantosDias;
    if (["Aprobado", "Finalizado", "Rechazado"].indexOf(estado) !== -1) diasRestantes = null;
    var hayPago = proc.costo > 0;
    var clave = String(40000 + ((numero * 3571) % 9000));
    return {
      codigo: "EXP-2026-" + pad(numero),
      procedimiento: proc.codigo,
      procedimientoNombre: proc.nombre,
      unidad: proc.unidad,
      estado: estado,
      fechaRegistro: fecha + "T08:12:00",
      plazo: proc.plazo,
      diasRestantes: diasRestantes,
      folios: 2 + (indice % 4),
      tipoDoc: "Solicitud",
      nroDoc: String(1 + (indice % 9)),
      asunto: "Solicito " + proc.nombre.toLowerCase() + " del semestre 2026-2",
      aclaracion: "",
      solicitante: {
        tipo: estudiante ? "Estudiante" : "Egresado",
        nombres: nombre,
        codigoEst: estudiante ? codEst : "",
        documento: documento,
        facultad: FACULTADES[indice % FACULTADES.length],
        correo: nombre.split(" ")[0].toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "") + "@correo.com",
        telefono: "9" + String(10000000 + ((indice * 7331) % 89999999))
      },
      pago: hayPago
        ? { medio: ["Caja Cusco", "BiPay", "Niubiz"][indice % 3], clave: clave, fecha: sumarDias(fecha, -1), monto: proc.costo, validado: estado !== "Registrado" && estado !== "Observado" }
        : { medio: "", clave: "", fecha: "", monto: 0, validado: true },
      archivos: hayPago
        ? [{ nombre: "voucher_pago_" + clave + ".pdf", tamano: 188416, categoria: "Voucher" }, { nombre: "copia_dni.pdf", tamano: 421888, categoria: "Requisito" }]
        : [{ nombre: "copia_dni.pdf", tamano: 421888, categoria: "Requisito" }],
      historial: []
    };
  }

  function sembrar() {
    var lista = [];
    var numero = 123;
    var indice = 0;
    ESTADOS_INICIALES.forEach(function (estado) {
      lista.push(fabricar(numero--, estado, indice++, false));
    });
    ESTADOS_MEZCLADOS.forEach(function (estado) {
      lista.push(fabricar(numero--, estado, indice++, false));
    });
    /* Dos expedientes activos con plazo vencido, para probar la alerta */
    [14, 22, 25].forEach(function (i, n) {
      if (lista[i].diasRestantes !== null) lista[i].diasRestantes = -(n + 1);
    });
    /* El expediente 116 de la bandeja del diseño vence hoy */
    lista[7].diasRestantes = 0;
    lista[7].fechaRegistro = sumarDias(HOY, -lista[7].plazo) + "T08:12:00";
    /* 14 solicitudes registradas hoy (KPI "Registrados hoy") */
    var hoy = 0;
    lista.forEach(function (e) {
      /* Los demás se registraron como mínimo ayer */
      if (e.fechaRegistro.slice(0, 10) === HOY) {
        e.fechaRegistro = sumarDias(HOY, -1) + "T16:45:00";
        if (e.diasRestantes !== null && e.diasRestantes > 0) e.diasRestantes -= 1;
      }
    });
    lista.forEach(function (e, i) {
      if (hoy < 14 && i !== 7 && e.estado !== "Finalizado") {
        e.fechaRegistro = HOY + "T" + String(7 + (hoy % 11)).padStart(2, "0") + ":" + String(10 + hoy * 3).padStart(2, "0") + ":00";
        e.diasRestantes = e.diasRestantes === null ? null : e.plazo;
        hoy++;
      }
    });
    lista.forEach(function (e) {
      e.historial = historialPara(e.estado, e.fechaRegistro, e.unidad);
    });
    return lista;
  }

  var BASE = sembrar();

  function nuevos() { return Store.local.get(CLAVE, []); }
  function cambios() { return Store.local.get(CLAVE_CAMBIOS, {}); }

  function aplicarCambios(lista) {
    var c = cambios();
    return lista.map(function (e) {
      return c[e.codigo] ? Object.assign({}, e, c[e.codigo]) : e;
    });
  }

  window.Expedientes = {
    HOY: HOY,
    ESTADOS: ["Registrado", "En evaluación", "Observado", "Derivado", "Aprobado", "Finalizado", "Rechazado"],

    /* Todos: los nuevos primero, luego los de ejemplo */
    todos: function () {
      return aplicarCambios(nuevos().concat(BASE));
    },

    porCodigo: function (codigo) {
      var buscado = String(codigo).trim().toUpperCase();
      return this.todos().filter(function (e) { return e.codigo.toUpperCase() === buscado; })[0] || null;
    },

    /* Acepta "123", "000123" o el código completo */
    buscarNumero: function (texto) {
      var limpio = String(texto).replace(/\D/g, "");
      if (!limpio) return null;
      return this.porCodigo("EXP-2026-" + pad(Number(limpio)));
    },

    proximoNumero: function () {
      return Store.local.get(CLAVE_CONTADOR, 124);
    },

    /* Crea un expediente a partir del estado del asistente */
    crear: function (estado) {
      var numero = this.proximoNumero();
      var seleccion = estado.peticion.tramites.map(function (c) { return procedimientoDe(c); });
      var proc = Store.getProcedimiento(estado.codigo) || seleccion[0];
      var total = seleccion.reduce(function (s, p) { return s + p.costo; }, 0);
      var plazo = seleccion.reduce(function (m, p) { return Math.max(m, p.plazo); }, 0);
      var i = estado.interesado;
      var ahora = new Date();
      var iso = ahora.getFullYear() + "-" + String(ahora.getMonth() + 1).padStart(2, "0") + "-" + String(ahora.getDate()).padStart(2, "0") +
        "T" + String(ahora.getHours()).padStart(2, "0") + ":" + String(ahora.getMinutes()).padStart(2, "0") + ":00";
      var exp = {
        codigo: "EXP-2026-" + pad(numero),
        procedimiento: proc.codigo,
        procedimientoNombre: seleccion.map(function (p) { return p.nombre; }).join(" + "),
        unidad: proc.unidad,
        estado: "Registrado",
        fechaRegistro: iso,
        plazo: plazo,
        diasRestantes: plazo,
        folios: Math.max(1, estado.pago.archivos.length),
        tipoDoc: estado.peticion.tipoDoc,
        nroDoc: estado.peticion.nroDoc,
        asunto: estado.peticion.asunto,
        aclaracion: estado.pago.aclaracion,
        solicitante: {
          tipo: i.tipo,
          nombres: i.nombres,
          codigoEst: i.codigoEst,
          documento: i.documento,
          facultad: i.facultad,
          correo: i.correo,
          telefono: i.telefono
        },
        pago: total > 0
          ? { medio: estado.pago.medio, clave: estado.pago.clave, fecha: estado.pago.fecha, monto: total, validado: false }
          : { medio: "", clave: "", fecha: "", monto: 0, validado: true },
        archivos: estado.pago.archivos.slice(),
        historial: [{ fecha: iso, evento: "Solicitud registrada", unidad: "Mesa de Partes virtual", detalle: "El interesado registró su solicitud en línea." }]
      };
      var lista = nuevos();
      lista.unshift(exp);
      Store.local.set(CLAVE, lista);
      Store.local.set(CLAVE_CONTADOR, numero + 1);
      return exp;
    },

    /* Guarda cambios (estado, historial…) sobre un expediente existente */
    actualizar: function (codigo, parche) {
      var nuevosLista = nuevos();
      for (var i = 0; i < nuevosLista.length; i++) {
        if (nuevosLista[i].codigo === codigo) {
          nuevosLista[i] = Object.assign({}, nuevosLista[i], parche);
          Store.local.set(CLAVE, nuevosLista);
          return nuevosLista[i];
        }
      }
      var c = cambios();
      c[codigo] = Object.assign({}, c[codigo] || {}, parche);
      Store.local.set(CLAVE_CAMBIOS, c);
      return this.porCodigo(codigo);
    },

    /* Restablece los datos de demostración */
    reiniciarDemo: function () {
      Store.local.remove(CLAVE);
      Store.local.remove(CLAVE_CAMBIOS);
      Store.local.remove(CLAVE_CONTADOR);
    },

    esHoy: function (e) { return e.fechaRegistro.slice(0, 10) === HOY; },

    /* Texto de plazo: "Vence hoy", "3 días", "Vencido" o "—" */
    textoPlazo: function (e) {
      if (e.diasRestantes === null || e.diasRestantes === undefined) return "—";
      if (e.diasRestantes < 0) return "Vencido";
      if (e.diasRestantes === 0) return "Vence hoy";
      return e.diasRestantes + (e.diasRestantes === 1 ? " día" : " días");
    }
  };
})();
