# Calculadora de gastos diarios

Aplicación personal para registrar gastos en bolivianos, consultar el total por día y revisar días anteriores. Los datos se guardan en el navegador y dispositivo donde se usa la aplicación.

## Requisitos

- Node.js 20 o posterior.
- Un navegador web moderno.

## Ejecutar localmente

Desde la carpeta del proyecto, ejecuta:

```text
node server.mjs
```

Abre `http://127.0.0.1:4173` en el navegador. Para usar otro puerto, indícalo al iniciar el servidor, por ejemplo `node server.mjs 8080`. Detén el servidor con `Ctrl+C`.

El servidor solo entrega `index.html`, `css/` y `js/` en la interfaz local. No hay backend, cuenta ni servicio externo.

## Ejecutar las pruebas

```text
node --test
```

Las pruebas usan datos y almacenamiento simulados; no necesitan conexión a internet.

## Documentos SDD

- [Especificación](specs/calculadora-gastos/spec.md)
- [Plan técnico](specs/calculadora-gastos/plan.md)
- [Tareas](specs/calculadora-gastos/tasks.md)
- [Verificación](specs/calculadora-gastos/verificacion.md)
