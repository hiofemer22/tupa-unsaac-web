/* =========================================================
   Catálogo: filtros por categoría, búsqueda, orden y
   paginación progresiva ("Cargar más").
   ========================================================= */

(function () {
  var POR_PAGINA = 6;
  var FILTRO_TODOS = "Todos";
  var FILTRO_GRATIS = "Solo gratuitos";

  var grilla = document.getElementById("grilla");
  var resumen = document.getElementById("catalogo-resumen");
  var filtros = document.getElementById("filtros");
  var vacio = document.getElementById("vacio");
  var botonMas = document.getElementById("mas");
  var selectOrden = document.getElementById("orden");

  var estado = { filtro: FILTRO_TODOS, consulta: "", orden: "populares", visibles: POR_PAGINA };

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

  function normalizar(texto) {
    return String(texto).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  }

  function filtrar() {
    var q = normalizar(estado.consulta);
    var lista = Store.getProcedimientos().filter(function (p) {
      if (!p.activo) return false;
      if (estado.filtro === FILTRO_GRATIS && p.costo !== 0) return false;
      if (estado.filtro !== FILTRO_TODOS && estado.filtro !== FILTRO_GRATIS && p.categoria !== estado.filtro) return false;
      if (q) {
        var texto = normalizar([p.codigo, p.nombre, p.unidad, p.resumen].join(" "));
        if (texto.indexOf(q) === -1) return false;
      }
      return true;
    });

    if (estado.orden === "nombre") {
      lista.sort(function (a, b) { return a.nombre.localeCompare(b.nombre, "es"); });
    } else if (estado.orden === "costo") {
      lista.sort(function (a, b) { return a.costo - b.costo; });
    } else if (estado.orden === "plazo") {
      lista.sort(function (a, b) { return a.plazo - b.plazo; });
    }
    return lista;
  }

  function dibujarFiltros() {
    var nombres = [FILTRO_TODOS].concat(window.TUPA.categorias, [FILTRO_GRATIS]);
    filtros.innerHTML = nombres.map(function (nombre) {
      var activo = nombre === estado.filtro;
      return (
        '<button type="button" class="chip' + (activo ? " is-active" : "") + '" aria-pressed="' + activo + '" data-filtro="' + Fmt.escapar(nombre) + '">' +
        (activo ? icon("check", 14) : "") + Fmt.escapar(nombre) + "</button>"
      );
    }).join("");
  }

  function dibujar() {
    var lista = filtrar();
    var mostrados = lista.slice(0, estado.visibles);

    grilla.innerHTML = mostrados.map(tarjeta).join("");
    vacio.hidden = lista.length !== 0;
    botonMas.hidden = lista.length <= estado.visibles;

    var sufijo = estado.consulta ? " para “" + estado.consulta + "”" : "";
    resumen.textContent =
      "Mostrando " + mostrados.length + " de " + lista.length + " procedimientos" + sufijo + " · montos referenciales del prototipo";
    dibujarFiltros();
  }

  filtros.addEventListener("click", function (e) {
    var boton = e.target.closest("[data-filtro]");
    if (!boton) return;
    estado.filtro = boton.getAttribute("data-filtro");
    estado.visibles = POR_PAGINA;
    dibujar();
  });

  selectOrden.addEventListener("change", function () {
    estado.orden = selectOrden.value;
    estado.visibles = POR_PAGINA;
    dibujar();
  });

  botonMas.addEventListener("click", function () {
    estado.visibles += POR_PAGINA;
    dibujar();
  });

  /* API pública usada por el buscador del hero */
  window.Catalogo = {
    buscar: function (texto) {
      estado.consulta = texto || "";
      estado.filtro = FILTRO_TODOS;
      estado.visibles = POR_PAGINA;
      dibujar();
    }
  };

  /* Soporta enlaces del tipo index.html?q=constancia */
  var q = new URLSearchParams(window.location.search).get("q");
  if (q) estado.consulta = q;

  dibujar();
})();
