# TUPA UNSAAC

Sistema de Trámites Administrativos (TUPA) de la Universidad Nacional de San Antonio Abad del
Cusco: catálogo de procedimientos, asistente de solicitud, seguimiento de expedientes y panel de
gestión para funcionarios.

## Integrantes

- Integrante A
- Integrante B
- Integrante C

## Estructura del repositorio

```
docs/
  requerimientos/ Documento de requerimientos y alcance del proyecto
  modelo-datos/   Modelo de la BD (DBML para dbdiagram.io y script PostgreSQL)
  diseno/         Capturas y enlace al prototipo de Figma
  actas/          Actas de planificación, revisión y retrospectiva por sprint
partes/           Parches de desarrollo por partes (ver COMMITS.md)
.github/          Plantillas de issues y pull requests
```

El código del frontend se agrega en `src/` conforme avanzan los sprints.

## Metodología y flujo de trabajo

Las contribuciones se organizan por partes pequeñas (ver `COMMITS.md`), cada una con su propio
commit y, cuando corresponde, su propia rama y pull request hacia `develop`.
