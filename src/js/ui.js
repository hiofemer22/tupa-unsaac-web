/* =========================================================
   Utilidades de interfaz: avisos emergentes (toast)
   ========================================================= */

(function () {
  var anfitrion = null;

  window.UI = {
    toast: function (mensaje, tipo) {
      if (!anfitrion) {
        anfitrion = document.createElement("div");
        anfitrion.className = "toast-host";
        anfitrion.setAttribute("role", "status");
        anfitrion.setAttribute("aria-live", "polite");
        document.body.appendChild(anfitrion);
      }
      var aviso = document.createElement("div");
      aviso.className = "toast";
      aviso.innerHTML = icon(tipo === "error" ? "triangle-alert" : "info", 18) + "<span>" + Fmt.escapar(mensaje) + "</span>";
      anfitrion.appendChild(aviso);
      setTimeout(function () {
        aviso.remove();
      }, 4200);
    }
  };
})();
