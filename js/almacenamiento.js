export const CLAVE_GASTOS = "calculadora-gastos.registros.v1";

function obtenerAlmacenamiento(almacenamiento) {
  const destino = almacenamiento ?? globalThis.localStorage;
  if (!destino) {
    throw new Error("El almacenamiento local no está disponible.");
  }
  return destino;
}

export function guardarGastos(gastos, almacenamiento) {
  try {
    if (!Array.isArray(gastos)) {
      throw new TypeError("Los gastos deben ser una lista.");
    }
    obtenerAlmacenamiento(almacenamiento).setItem(CLAVE_GASTOS, JSON.stringify(gastos));
  } catch {
    throw new Error("No se pudieron guardar los gastos en el almacenamiento local.");
  }
}

export function cargarGastos(almacenamiento) {
  try {
    const texto = obtenerAlmacenamiento(almacenamiento).getItem(CLAVE_GASTOS);
    if (texto === null) {
      return [];
    }

    const gastos = JSON.parse(texto);
    if (!Array.isArray(gastos)) {
      throw new TypeError("Los datos guardados no son una lista de gastos.");
    }
    return gastos;
  } catch {
    throw new Error("No se pudieron leer los gastos del almacenamiento local.");
  }
}
