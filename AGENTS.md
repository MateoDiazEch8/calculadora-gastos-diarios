# Constitución del proyecto

## Desarrollo guiado por especificaciones (SDD)

- La especificación aprobada en `specs/<proyecto>/spec.md` es la fuente de verdad del comportamiento esperado.
- No se escribe código de la aplicación sin una tarea explícita y aprobada que figure en `specs/<proyecto>/tasks.md`.
- Si una implementación o un criterio no coincide con lo acordado, primero se corrige y aprueba la SPEC; después se ajusta el código.
- Al cambiar el alcance o el comportamiento esperado, se actualiza la SPEC para reflejar el acuerdo antes de implementar.

## Tareas, pruebas y commits

- Se trabaja en una tarea a la vez.
- Cada tarea completada produce un commit, con mensaje en español y formato `T-n: descripción`.
- Los documentos y los mensajes de commit se redactan en español.
- Las pruebas deben estar en verde antes de pasar a la siguiente tarea.
- Las pruebas no dependen de la red: usan respuestas simuladas para servicios externos.

## Aprobaciones del flujo

- Al terminar cada fase, se informa qué se creó y se espera la aprobación explícita de la persona usuaria antes de iniciar la fase siguiente.
- Durante la implementación, después de cada commit se informa el resultado y se espera que la persona usuaria escriba «sigue» antes de continuar.
- No se hace `push` ni se publica el repositorio o sus cambios sin una instrucción explícita de la persona usuaria.
