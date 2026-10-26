# Tareas: Calculadora de gastos diarios

Los criterios `CA-01`–`CA-11` están identificados directamente en la sección 4 de `spec.md`.

## T-1 — Lógica de gastos y validación

- **Descripción:** implementar las operaciones para validar y crear gastos, sumar montos por día y eliminar un gasto; cubrirlas con pruebas de datos simulados.
- **Criterios de aceptación de la SPEC:** CA-01, CA-02, CA-03, CA-04 y CA-10.
- **Responsable:** Codex.

## T-2 — Persistencia local

- **Descripción:** guardar y cargar los gastos entre sesiones mediante el almacenamiento local del navegador, con pruebas que usen almacenamiento simulado en memoria.
- **Criterios de aceptación de la SPEC:** CA-05.
- **Responsable:** Codex.

## T-3 — Vista de gastos de hoy

- **Descripción:** crear la interfaz para ingresar monto y descripción, mostrar los gastos de hoy en Bs y su total, permitir eliminarlos y mostrar el estado vacío cuando corresponda.
- **Criterios de aceptación de la SPEC:** CA-01, CA-02, CA-06, CA-10 y CA-11.
- **Responsable:** Codex.

## T-4 — Consulta de días anteriores

- **Descripción:** mostrar la lista de días con gastos y permitir seleccionar un día para ver sus registros y total; verificar los estados sin gastos.
- **Criterios de aceptación de la SPEC:** CA-07, CA-08, CA-09 y CA-11.
- **Responsable:** Codex.

## T-5 — Precisar el criterio de la vista diaria

- **Descripción:** aclarar que la vista inicial y el retorno muestran el día actual, mientras que la selección de una fecha muestra ese día.
- **Criterios de aceptación de la SPEC:** CA-06 y CA-09.
- **Responsable:** Codex.

## T-6 — Documentar y servir la aplicación localmente

- **Descripción:** añadir instrucciones de ejecución y pruebas, un servidor estático local sin dependencias y corregir el plan para distinguir servidor estático de backend.
- **Criterios cubiertos:** estructura de ejecución y estrategia del `plan.md`; no cambia los criterios funcionales de la SPEC.
- **Responsable:** Codex.

## T-7 — Identificar criterios y comprobar cobertura

- **Descripción:** asignar IDs estables a los criterios de aceptación, actualizar las referencias de las tareas y añadir una matriz de cobertura.
- **Criterios de aceptación de la SPEC:** CA-01 a CA-11 (trazabilidad documental; sin cambios de comportamiento).
- **Responsable:** Codex.

## Matriz de cobertura

| Criterio | Tareas |
|---|---|
| CA-01 | T-1, T-3 |
| CA-02 | T-1, T-3 |
| CA-03 | T-1 |
| CA-04 | T-1 |
| CA-05 | T-2 |
| CA-06 | T-3, T-5 |
| CA-07 | T-4 |
| CA-08 | T-4 |
| CA-09 | T-4, T-5 |
| CA-10 | T-1, T-3 |
| CA-11 | T-3, T-4 |

## Criterios de avance

- Trabajar una tarea a la vez y crear un commit en español por tarea, con el formato `T-n: descripción`.
- Ejecutar las pruebas pertinentes y confirmar que estén en verde antes de presentar el commit de cada tarea.
- Después de cada commit, informar el resultado y esperar que la persona usuaria escriba «sigue» antes de iniciar la tarea siguiente.
