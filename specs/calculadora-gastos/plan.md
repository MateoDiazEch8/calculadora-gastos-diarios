# Plan técnico: Calculadora de gastos diarios

## Objetivo

Implementar los comportamientos definidos en `spec.md` para una aplicación personal y pequeña, adecuada para el alcance de una tarea de 1–2 horas.

## Stack elegido

Se implementará una aplicación web estática con **HTML, CSS y JavaScript sin framework**, y `localStorage` del navegador para conservar los registros entre recargas y cierres. Un servidor HTTP local pequeño, incluido en el proyecto y basado en Node.js, entregará los archivos estáticos durante el desarrollo; no habrá backend ni cuenta.

Se consideró **React con Vite**, pero añade configuración y conceptos que no son necesarios para este alcance.

Los datos quedan en el navegador y dispositivo donde se usó la aplicación. No habrá sincronización entre dispositivos.

## Estructura propuesta

```text
/
├── index.html
├── README.md
├── server.mjs
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── gastos.js
│   └── almacenamiento.js
└── tests/
    ├── gastos.test.mjs
    ├── almacenamiento.test.mjs
    └── app.test.mjs
```

`app.js` conecta la interfaz con las operaciones; `gastos.js` contiene validación, cálculo de totales y agrupación por fecha; `almacenamiento.js` lee y guarda los gastos. Las pruebas de lógica usan datos simulados y un almacenamiento en memoria.

## Datos y persistencia

- Cada registro tendrá un identificador, monto en bolivianos, descripción y fecha local de registro.
- Los montos se normalizarán a dos decimales para evitar errores de suma con fracciones.
- La fecha del gasto se asignará automáticamente usando la fecha local del dispositivo.
- Al cargar la aplicación, se leerán los registros guardados; al crear o eliminar uno, se actualizará el almacenamiento.
- La vista agrupará registros por día y calculará el total del día seleccionado.

## API y red

No se necesita API externa: los datos ingresados por la persona usuaria son la única fuente de información. La funcionalidad principal operará sin conexión.

## Manejo de errores y estados

- Rechazar montos vacíos, no numéricos, iguales o menores que cero, o con más de dos decimales, indicando cómo corregirlos.
- Rechazar descripciones vacías y señalar el campo requerido.
- Si la lectura o escritura del almacenamiento local falla, mostrar un mensaje claro y evitar indicar que el cambio se guardó correctamente.
- Cuando un día no tenga gastos, mostrar Bs 0 y el estado vacío definido en la SPEC.

## Estrategia de pruebas

- Probar validación de monto y descripción, suma de totales, agrupación por fecha y eliminación.
- Probar carga y guardado con un almacenamiento simulado en memoria, sin acceder a la red.
- Verificar que los estados vacíos y errores de persistencia se representen en la interfaz.
- Ejecutar `node --test` antes de dar por terminada cada tarea.

## Temas visuales pendientes

- Acordar el estilo visual y el formato visible de las fechas al preparar las tareas, sin contradecir la SPEC.
