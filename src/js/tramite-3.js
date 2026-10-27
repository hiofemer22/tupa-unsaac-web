/* =========================================================
   Paso 3 · Archivos y pago
   Valida la clave de pago, el voucher (obligatorio cuando hay
   tasa) y los adjuntos: PDF, ZIP o RAR, máximo 50 MB en total.
   ========================================================= */

(function () {
  var $ = function (id) { return document.getElementById(id); };
  var estado = Tramite.cargar();
  if (!Tramite.exigirPaso(3)) return;
  var pago = estado.pago;
  var cfg = window.TUPA.config;
  var LIMITE = cfg.maxAdjuntosMB * 1024 * 1024;
  var hayPago = Tramite.totalPagar() > 0;

  Tramite.renderCabecera(3);
  Tramite.renderLateral();

  Array.prototype.forEach.call(document.querySelectorAll("[data-icon]"), function (el) {
    el.innerHTML = icon(el.getAttribute("data-icon"), Number(el.getAttribute("data-size")) || 18);
  });

  /* ---- Pago ---- */
  $("con-pago").hidden = !hayPago;
  $("sin-pago").hidden = hayPago;
  $("pago-sub").hidden = !hayPago;
  $("aviso-voucher").hidden = !hayPago;
  $("docs-sub").textContent = hayPago
    ? "Adjunte el voucher de pago (obligatorio) y los requisitos del procedimiento."
    : "Adjunte los requisitos del procedimiento.";

  if (hayPago) {
    $("monto-texto").textContent = "Monto a pagar: " + Fmt.moneda(Tramite.totalPagar());
    $("concepto-texto").textContent = "Concepto: " + Tramite.seleccionados().map(function (p) {
      return p.nombre + " · " + p.codigo;
    }).join(", ");

    $("ir-pagar").addEventListener("click", function () {
      UI.toast("En la versión final se abrirá el portal de recaudación de la UNSAAC. En este prototipo el pago es simulado.");
    });

    $("medios").innerHTML = window.TUPA.mediosPago.map(function (m) {
      var activo = m === pago.medio;
      return '<button type="button" class="chip' + (activo ? " is-active" : "") + '" aria-pressed="' + activo + '" data-medio="' + m + '">' +
        (activo ? icon("check", 14) : "") + m + "</button>";
    }).join("");

    $("medios").addEventListener("click", function (e) {
      var b = e.target.closest("[data-medio]");
      if (!b) return;
      pago.medio = b.getAttribute("data-medio");
      Tramite.guardar();
      Array.prototype.forEach.call($("medios").children, function (chip) {
        var activo = chip.getAttribute("data-medio") === pago.medio;
        chip.classList.toggle("is-active", activo);
        chip.setAttribute("aria-pressed", activo);
        chip.innerHTML = (activo ? icon("check", 14) : "") + chip.getAttribute("data-medio");
      });
    });

    Tramite.vincular("clave", pago, "clave", function (v) { return v.replace(/\D/g, ""); });
    Tramite.vincular("fecha", pago, "fecha");
    $("fecha").max = new Date().toISOString().slice(0, 10);

    $("ayuda-clave").addEventListener("click", function () {
      $("ayuda-clave-texto").hidden = !$("ayuda-clave-texto").hidden;
    });
  }

  /* ---- Archivos ---- */
  function totalBytes() {
    return pago.archivos.reduce(function (s, a) { return s + a.tamano; }, 0);
  }

  function hayVoucher() {
    return pago.archivos.some(function (a) { return a.categoria === "Voucher"; });
  }

  function dibujarArchivos() {
    $("archivos").innerHTML = pago.archivos.map(function (a, idx) {
      return (
        '<div class="file-row">' + icon("file-text", 22) +
        '<div class="file-row__info"><p class="file-row__name">' + Fmt.escapar(a.nombre) + "</p>" +
        '<p class="file-row__meta">' + Fmt.tamano(a.tamano) + " · " + (a.categoria === "Voucher" ? "Voucher de pago" : "Requisito") + "</p></div>" +
        '<button type="button" class="file-row__tag" data-cambiar="' + idx + '" title="Cambiar tipo de documento">' +
        icon("check", 12) + a.categoria + "</button>" +
        '<button type="button" class="file-row__remove" data-quitar="' + idx + '" aria-label="Quitar ' + Fmt.escapar(a.nombre) + '">' + icon("x", 18) + "</button></div>"
      );
    }).join("");

    var usado = totalBytes();
    $("uso-texto").textContent = (usado / 1048576).toFixed(1) + " MB de " + cfg.maxAdjuntosMB + " MB";
    $("uso-barra").style.width = Math.max(1, Math.min(100, (usado / LIMITE) * 100)) + "%";
    $("uso").classList.toggle("is-over", usado > LIMITE);

    var campoAviso = $("aviso-voucher");
    if (hayPago) {
      var faltaVoucher = !hayVoucher();
      campoAviso.hidden = false;
      campoAviso.style.display = faltaVoucher ? "" : "none";
    }
  }

  function agregar(archivos) {
    var mensajes = [];
    archivos.forEach(function (f) {
      var ext = (f.name.split(".").pop() || "").toLowerCase();
      if (cfg.extensionesPermitidas.indexOf(ext) === -1) {
        mensajes.push("«" + f.name + "»: solo se permiten archivos PDF, ZIP o RAR.");
        return;
      }
      if (totalBytes() + f.size > LIMITE) {
        mensajes.push("«" + f.name + "»: supera el límite de " + cfg.maxAdjuntosMB + " MB en total.");
        return;
      }
      var categoria = hayPago && !hayVoucher() ? "Voucher" : "Requisito";
      pago.archivos.push({ nombre: f.name, tamano: f.size, categoria: categoria });
    });
    Tramite.guardar();
    Tramite.mostrarError("zona", "");
    $("errores-carga").hidden = mensajes.length === 0;
    $("errores-carga").innerHTML = mensajes.join("<br>");
    dibujarArchivos();
  }

  $("archivo").addEventListener("change", function () {
    agregar(Array.prototype.slice.call(this.files));
    this.value = "";
  });

  ["dragenter", "dragover"].forEach(function (ev) {
    $("zona").addEventListener(ev, function (e) {
      e.preventDefault();
      $("zona").classList.add("is-over");
    });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    $("zona").addEventListener(ev, function (e) {
      e.preventDefault();
      $("zona").classList.remove("is-over");
    });
  });
  $("zona").addEventListener("drop", function (e) {
    agregar(Array.prototype.slice.call(e.dataTransfer.files));
  });

  $("demo").addEventListener("click", function () {
    var ejemplos = [];
    if (hayPago) ejemplos.push({ name: "voucher_pago_" + (pago.clave || "49625") + ".pdf", size: 188416 });
    ejemplos.push({ name: "copia_dni.pdf", size: 421888 });
    agregar(ejemplos.filter(function (e) {
      return !pago.archivos.some(function (a) { return a.nombre === e.name; });
    }));
  });

  $("archivos").addEventListener("click", function (e) {
    var quitar = e.target.closest("[data-quitar]");
    var cambiar = e.target.closest("[data-cambiar]");
    if (quitar) {
      pago.archivos.splice(Number(quitar.getAttribute("data-quitar")), 1);
    } else if (cambiar && hayPago) {
      var a = pago.archivos[Number(cambiar.getAttribute("data-cambiar"))];
      a.categoria = a.categoria === "Voucher" ? "Requisito" : "Voucher";
    } else {
      return;
    }
    Tramite.guardar();
    dibujarArchivos();
  });

  /* ---- Aclaración (máx. 180 caracteres) ---- */
  var area = Tramite.vincular("aclaracion", pago, "aclaracion");
  function contar() {
    var n = area.value.length;
    $("contador").textContent = n + " / " + cfg.maxAclaracion + " caracteres";
    $("contador").classList.toggle("is-limit", n >= cfg.maxAclaracion);
  }
  area.addEventListener("input", contar);
  contar();

  dibujarArchivos();

  /* ---- Envío ---- */
  $("form").addEventListener("submit", function (e) {
    e.preventDefault();
    var errores = Tramite.validarPaso3();
    Tramite.mostrarErrores(errores, { clave: "clave", fecha: "fecha" });
    if (errores.voucher) {
      UI.toast("Adjunte el voucher de pago para continuar.", "error");
      $("zona").scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (Object.keys(errores).length) return;
    window.location.href = "tramite-4-confirmar.html";
  });
})();
