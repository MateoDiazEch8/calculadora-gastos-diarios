# Especificación: Calculadora de gastos diarios

## 1. Problema

Al hacer varios gastos durante el día, es fácil perder la cuenta de cuánto se ha gastado. La aplicación permitirá registrar los gastos personales y consultar el total por día, incluidos días anteriores.

## 2. Usuarios

Una persona que quiere controlar sus gastos personales diarios.

## 3. Historias

- Como persona que controla sus gastos, quiero registrar el monto y la descripción de cada gasto para llevar la cuenta de lo que gasto.
- Como persona que controla sus gastos, quiero ver la lista de gastos y el total del día para saber cuánto he gastado.
- Como persona que controla sus gastos, quiero eliminar un gasto para corregir un registro equivocado.
- Como persona que controla sus gastos, quiero consultar una lista de días con gastos y seleccionar un día para revisar cuánto gasté entonces.
- Como persona que controla sus gastos, quiero que mis registros se conserven al cerrar o recargar la aplicación para no perderlos.

## 4. Criterios de aceptación

- El sistema DEBE expresar los montos en bolivianos (Bs) y permitir registrar hasta dos decimales.
- CUANDO el usuario registre un gasto con un monto mayor que Bs 0 y una descripción no vacía, el sistema DEBE guardar el gasto con la fecha del día actual.
- CUANDO el usuario intente registrar un monto igual o menor que Bs 0, el sistema DEBE impedir el registro e indicar que el monto debe ser mayor que cero.
- CUANDO el usuario intente registrar una descripción vacía, el sistema DEBE impedir el registro e indicar que la descripción es obligatoria.
- SI el usuario cierra o recarga la aplicación, ENTONCES el sistema DEBE conservar los gastos registrados.
- CUANDO el usuario abra la aplicación o vuelva a la vista de hoy, el sistema DEBE mostrar los gastos del día actual y el total de esos gastos en Bs.
- Siempre, el sistema DEBE mostrar el total como la suma de los montos de los gastos del día seleccionado.
- Siempre, el sistema DEBE mostrar una lista de los días que tengan al menos un gasto registrado.
- CUANDO el usuario seleccione un día de la lista, el sistema DEBE mostrar los gastos de ese día y su total en Bs.
- CUANDO el usuario elimine un gasto, el sistema DEBE quitarlo de su día y actualizar el total de ese día.
- SI el día actual o el día seleccionado no tiene gastos, ENTONCES el sistema DEBE mostrar un total de Bs 0 y un mensaje que indique que no hay gastos registrados para ese día.

## 5. Fuera de alcance

- Cuentas de usuario, inicio de sesión y uso compartido entre varias personas.
- Categorías de gastos y presupuestos.
- Editar un gasto existente; para corregirlo, se elimina y se registra de nuevo.
- Gráficos, reportes y exportación de datos.
- Funciones distintas del registro y consulta de gastos personales.

## 6. Preguntas abiertas

- ¿Qué estilo visual prefieres para la aplicación?
- ¿Hay alguna preferencia de formato para las fechas mostradas?
