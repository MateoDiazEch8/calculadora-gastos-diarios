# Tareas: Calculadora de gastos diarios

Los criterios `C1`–`C11` corresponden a los criterios de aceptación de la sección 4 de `spec.md`, en el mismo orden.

## T-1 — Lógica de gastos y validación

- **Descripción:** implementar las operaciones para validar y crear gastos, sumar montos por día y eliminar un gasto; cubrirlas con pruebas de datos simulados.
- **Criterios de aceptación de la SPEC:** C1, C2, C3, C4 y C10.
- **Responsable:** Codex.

## T-2 — Persistencia local

- **Descripción:** guardar y cargar los gastos entre sesiones mediante el almacenamiento local del navegador, con pruebas que usen almacenamiento simulado en memoria.
- **Criterios de aceptación de la SPEC:** C5.
- **Responsable:** Codex.

## T-3 — Vista de gastos de hoy

- **Descripción:** crear la interfaz para ingresar monto y descripción, mostrar los gastos de hoy en Bs y su total, permitir eliminarlos y mostrar el estado vacío cuando corresponda.
- **Criterios de aceptación de la SPEC:** C1, C2, C6, C10 y C11.
- **Responsable:** Codex.

## T-4 — Consulta de días anteriores

- **Descripción:** mostrar la lista de días con gastos y permitir seleccionar un día para ver sus registros y total; verificar los estados sin gastos.
- **Criterios de aceptación de la SPEC:** C7, C8, C9 y C11.
- **Responsable:** Codex.

## T-5 — Precisar el criterio de la vista diaria

- **Descripción:** aclarar que la vista inicial y el retorno muestran el día actual, mientras que la selección de una fecha muestra ese día.
- **Criterios de aceptación de la SPEC:** C6 y C9.
- **Responsable:** Codex.

## Criterios de avance

- Trabajar una tarea a la vez y crear un commit en español por tarea, con el formato `T-n: descripción`.
- Ejecutar las pruebas pertinentes y confirmar que estén en verde antes de presentar el commit de cada tarea.
- Después de cada commit, informar el resultado y esperar que la persona usuaria escriba «sigue» antes de iniciar la tarea siguiente.
