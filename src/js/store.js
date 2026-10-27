/* =========================================================
   Persistencia simple en el navegador (localStorage y
   sessionStorage). Sustituye al backend durante el prototipo;
   en la Unidad 2 se reemplazará por llamadas a la API.
   ========================================================= */

(function () {
  var PREFIX = "tupa:";

  function read(storage, key, fallback) {
    try {
      var raw = storage.getItem(PREFIX + key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function write(storage, key, value) {
    try {
      storage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      /* almacenamiento no disponible: se ignora */
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  window.Store = {
    /* Datos que deben sobrevivir al cierre de la pestaña */
    local: {
      get: function (key, fallback) { return read(window.localStorage, key, fallback); },
      set: function (key, value) { write(window.localStorage, key, value); },
      remove: function (key) { try { window.localStorage.removeItem(PREFIX + key); } catch (e) {} }
    },
    /* Datos de la sesión actual (trámite en curso, sesión de admin) */
    session: {
      get: function (key, fallback) { return read(window.sessionStorage, key, fallback); },
      set: function (key, value) { write(window.sessionStorage, key, value); },
      remove: function (key) { try { window.sessionStorage.removeItem(PREFIX + key); } catch (e) {} }
    },

    /* Catálogo de procedimientos (editable desde el panel de mantenimiento) */
    getProcedimientos: function () {
      return this.local.get("procedimientos", clone(window.TUPA.procedimientos));
    },
    saveProcedimientos: function (lista) {
      this.local.set("procedimientos", lista);
    },
    getProcedimiento: function (codigo) {
      return this.getProcedimientos().filter(function (p) { return p.codigo === codigo; })[0] || null;
    }
  };
})();
