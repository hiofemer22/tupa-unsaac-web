/* =========================================================
   Utilidades de formato compartidas
   ========================================================= */

(function () {
  var MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

  window.Fmt = {
    moneda: function (valor) {
      return valor > 0 ? "S/ " + Number(valor).toFixed(2) : "Gratuito";
    },
    dias: function (n) {
      return n + (n === 1 ? " día hábil" : " días hábiles");
    },
    /* "en-evaluacion" para usar en clases CSS de badges */
    slug: function (texto) {
      return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    },
    badgeEstado: function (estado) {
      return '<span class="badge badge--' + Fmt.slug(estado) + '">' + estado + "</span>";
    },
    fechaCorta: function (iso) {
      var d = new Date(iso);
      return d.getDate() + " " + MESES[d.getMonth()] + " " + d.getFullYear();
    },
    fechaHora: function (iso) {
      var d = new Date(iso);
      var h = String(d.getHours()).padStart(2, "0");
      var m = String(d.getMinutes()).padStart(2, "0");
      return d.getDate() + " " + MESES[d.getMonth()] + " " + d.getFullYear() + " · " + h + ":" + m;
    },
    tamano: function (bytes) {
      if (bytes >= 1048576) return (bytes / 1048576).toFixed(1) + " MB";
      return Math.max(1, Math.round(bytes / 1024)) + " KB";
    },
    escapar: function (texto) {
      return String(texto).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }
  };
})();
