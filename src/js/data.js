/* =========================================================
   Datos de ejemplo del prototipo (ficticios).
   Los montos, plazos y nombres NO son oficiales.
   ========================================================= */

(function () {
  var CATEGORIAS = [
    "Registro y Servicios Académicos",
    "Facultades",
    "Tesorería",
    "Secretaría General"
  ];

  var UNIDADES = [
    "Oficina de Registro Académico",
    "Dirección de Servicios Académicos",
    "Bienestar Universitario",
    "Tesorería",
    "Secretaría General",
    "Facultad de Ingeniería Eléctrica, Electrónica, Informática y Mecánica"
  ];

  var PROCEDIMIENTOS = [
    {
      codigo: "TUPA-014",
      nombre: "Constancia de estudios",
      unidad: "Oficina de Registro Académico",
      unidadCorta: "Registro Académico",
      categoria: "Registro y Servicios Académicos",
      descripcion: "Documento que acredita la condición de estudiante regular durante el semestre vigente. Se emite en formato digital con código de verificación.",
      resumen: "Documento que acredita la condición de estudiante regular durante el semestre vigente.",
      plazo: 5,
      costo: 15,
      activo: true,
      requisitos: [
        "Solicitud dirigida al Jefe de la Oficina de Registro Académico (se genera en línea)",
        "Copia simple del DNI vigente",
        "Comprobante de pago de la tasa por derecho de trámite (S/ 15.00)",
        "Código de estudiante y escuela profesional"
      ]
    },
    {
      codigo: "TUPA-021",
      nombre: "Certificado de estudios",
      unidad: "Oficina de Registro Académico",
      unidadCorta: "Registro Académico",
      categoria: "Registro y Servicios Académicos",
      descripcion: "Detalle oficial de asignaturas cursadas, créditos y calificaciones por semestre académico.",
      resumen: "Detalle oficial de asignaturas cursadas, créditos y calificaciones por semestre.",
      plazo: 7,
      costo: 30,
      activo: true,
      requisitos: [
        "Solicitud dirigida al Jefe de la Oficina de Registro Académico (se genera en línea)",
        "Copia simple del DNI vigente",
        "Comprobante de pago de la tasa por derecho de trámite (S/ 30.00)",
        "Código de estudiante y escuela profesional"
      ]
    },
    {
      codigo: "TUPA-033",
      nombre: "Rectificación de matrícula",
      unidad: "Dirección de Servicios Académicos",
      unidadCorta: "Serv. Académicos",
      categoria: "Registro y Servicios Académicos",
      descripcion: "Corrección de errores en la matrícula del semestre dentro del plazo establecido por el calendario académico.",
      resumen: "Corrección de errores en la matrícula del semestre dentro del plazo establecido.",
      plazo: 3,
      costo: 0,
      activo: true,
      requisitos: [
        "Solicitud dirigida al Director de Servicios Académicos (se genera en línea)",
        "Copia de la ficha de matrícula del semestre",
        "Código de estudiante y escuela profesional"
      ]
    },
    {
      codigo: "TUPA-047",
      nombre: "Constancia de egresado",
      unidad: "Oficina de Registro Académico",
      unidadCorta: "Registro Académico",
      categoria: "Facultades",
      descripcion: "Acredita la culminación del plan de estudios de su escuela profesional.",
      resumen: "Acredita la culminación del plan de estudios de su escuela profesional.",
      plazo: 5,
      costo: 25,
      activo: true,
      requisitos: [
        "Solicitud dirigida al Decano de la facultad (se genera en línea)",
        "Copia simple del DNI vigente",
        "Comprobante de pago de la tasa por derecho de trámite (S/ 25.00)",
        "Constancia de haber aprobado todas las asignaturas del plan de estudios"
      ]
    },
    {
      codigo: "TUPA-052",
      nombre: "Duplicado de carné universitario",
      unidad: "Bienestar Universitario",
      unidadCorta: "Bienestar Univ.",
      categoria: "Secretaría General",
      descripcion: "Emisión de un nuevo carné por pérdida, deterioro o actualización de datos.",
      resumen: "Emisión de un nuevo carné por pérdida, deterioro o actualización de datos.",
      plazo: 10,
      costo: 20,
      activo: true,
      requisitos: [
        "Solicitud dirigida al Director de Bienestar Universitario (se genera en línea)",
        "Denuncia policial o carné deteriorado (según el caso)",
        "Comprobante de pago de la tasa por derecho de trámite (S/ 20.00)",
        "Fotografía digital tamaño carné"
      ]
    },
    {
      codigo: "TUPA-068",
      nombre: "Constancia de no adeudo",
      unidad: "Tesorería",
      unidadCorta: "Tesorería",
      categoria: "Tesorería",
      descripcion: "Certifica que no mantiene deudas pendientes con la universidad.",
      resumen: "Certifica que no mantiene deudas pendientes con la universidad.",
      plazo: 2,
      costo: 0,
      activo: true,
      requisitos: [
        "Solicitud dirigida al Jefe de Tesorería (se genera en línea)",
        "Copia simple del DNI vigente",
        "Código de estudiante y escuela profesional"
      ]
    },
    {
      codigo: "TUPA-071",
      nombre: "Traslado interno",
      unidad: "Dirección de Servicios Académicos",
      unidadCorta: "Serv. Académicos",
      categoria: "Registro y Servicios Académicos",
      descripcion: "Cambio de escuela profesional dentro de la universidad, sujeto a vacantes.",
      resumen: "Cambio de escuela profesional dentro de la universidad, sujeto a vacantes.",
      plazo: 15,
      costo: 40,
      activo: false,
      requisitos: [
        "Solicitud dirigida al Director de Servicios Académicos (se genera en línea)",
        "Récord académico",
        "Comprobante de pago de la tasa por derecho de trámite (S/ 40.00)"
      ]
    },
    {
      codigo: "TUPA-080",
      nombre: "Expedición de grado de bachiller",
      unidad: "Secretaría General",
      unidadCorta: "Secretaría General",
      categoria: "Facultades",
      descripcion: "Trámite para la obtención del grado académico de bachiller una vez culminado el plan de estudios.",
      resumen: "Trámite para la obtención del grado académico de bachiller.",
      plazo: 20,
      costo: 120,
      activo: true,
      requisitos: [
        "Solicitud dirigida al Decano de la facultad (se genera en línea)",
        "Constancia de egresado",
        "Constancia de no adeudo",
        "Comprobante de pago de la tasa por derecho de trámite (S/ 120.00)"
      ]
    },
    {
      codigo: "TUPA-095",
      nombre: "Copia certificada de resolución",
      unidad: "Secretaría General",
      unidadCorta: "Secretaría General",
      categoria: "Secretaría General",
      descripcion: "Entrega de copia certificada de resoluciones emitidas por los órganos de gobierno de la universidad.",
      resumen: "Entrega de copia certificada de resoluciones emitidas por los órganos de gobierno.",
      plazo: 4,
      costo: 10,
      activo: true,
      requisitos: [
        "Solicitud dirigida al Secretario General (se genera en línea)",
        "Número y fecha de la resolución solicitada",
        "Comprobante de pago de la tasa por derecho de trámite (S/ 10.00)"
      ]
    }
  ];

  var PASOS_ATENCION = [
    { titulo: "Registre su solicitud", detalle: "Complete sus datos y adjunte los documentos en línea." },
    { titulo: "Pague la tasa", detalle: "Pague por Caja Cusco, BiPay o Niubiz y adjunte su voucher." },
    { titulo: "Evaluación", detalle: "La unidad responsable revisa su expediente y puede observarlo." },
    { titulo: "Reciba su documento", detalle: "Se notifica por correo y el documento queda disponible para descarga." }
  ];

  var TIPOS_INTERESADO = [
    "Estudiante",
    "Docente / Cesante",
    "Administrativo / Cesante",
    "Dependencia administrativa",
    "Institución pública / privada",
    "Público en general",
    "Usuario externo"
  ];

  var TIPOS_DOCUMENTO = ["Solicitud", "Oficio", "Informe", "Memorándum", "Carta"];

  var MEDIOS_PAGO = ["Caja Cusco", "BiPay", "Niubiz"];

  /* Estudiantes de ejemplo para la búsqueda por código (paso 1) */
  var ESTUDIANTES = {
    "201234": {
      nombres: "Rodrigo Aníbal Ccori Huamán",
      facultad: "Ing. Eléctrica, Electrónica, Informática y Mecánica",
      carrera: "Ingeniería Informática y de Sistemas"
    },
    "195678": {
      nombres: "María Quispe Huamán",
      facultad: "Ciencias Económicas, Administrativas y Contables",
      carrera: "Administración"
    },
    "210045": {
      nombres: "Luis Condori Mamani",
      facultad: "Ingeniería Civil",
      carrera: "Ingeniería Civil"
    }
  };

  window.TUPA = {
    categorias: CATEGORIAS,
    unidades: UNIDADES,
    procedimientos: PROCEDIMIENTOS,
    pasosAtencion: PASOS_ATENCION,
    tiposInteresado: TIPOS_INTERESADO,
    tiposDocumento: TIPOS_DOCUMENTO,
    mediosPago: MEDIOS_PAGO,
    estudiantes: ESTUDIANTES,
    config: {
      horaInicioRecepcion: "07:15",
      horaFinRecepcion: "18:00",
      maxAdjuntosMB: 50,
      maxAclaracion: 180,
      extensionesPermitidas: ["pdf", "zip", "rar"]
    }
  };
})();
