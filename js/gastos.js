const FORMATO_MONTO = /^\d+(?:[.,]\d{1,2})?$/;
const FORMATO_DECIMALES = /^\d+(?:[.,]\d+)?$/;

function errorMonto(mensaje = "El monto debe ser mayor que cero.") {
  return new Error(mensaje);
}

/** Convierte un monto en Bs a centavos para sumar sin errores de coma flotante. */
export function validarMonto(valor) {
  const texto = String(valor ?? "").trim();

  if (!FORMATO_MONTO.test(texto)) {
    if (FORMATO_DECIMALES.test(texto)) {
      throw errorMonto("El monto puede tener como máximo dos decimales.");
    }
    throw errorMonto();
  }

  const [parteEntera, parteDecimal = ""] = texto.replace(",", ".").split(".");
  const centavos = Number(parteEntera) * 100 + Number(parteDecimal.padEnd(2, "0"));

  if (!Number.isSafeInteger(centavos) || centavos <= 0) {
    throw errorMonto();
  }

  return centavos;
}

export function fechaLocalActual(fecha = new Date()) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

function generarId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function crearGasto({ monto, descripcion, fecha = fechaLocalActual(), id = generarId() }) {
  const centavos = validarMonto(monto);
  const detalle = typeof descripcion === "string" ? descripcion.trim() : "";

  if (!detalle) {
    throw new Error("La descripción es obligatoria.");
  }

  return {
    id,
    monto: Number((centavos / 100).toFixed(2)),
    descripcion: detalle,
    fecha,
  };
}

export function obtenerGastosDelDia(gastos, fecha) {
  return gastos.filter((gasto) => gasto.fecha === fecha);
}

export function calcularTotalDelDia(gastos, fecha) {
  const centavos = obtenerGastosDelDia(gastos, fecha).reduce(
    (total, gasto) => total + validarMonto(gasto.monto),
    0,
  );
  return Number((centavos / 100).toFixed(2));
}

export function eliminarGasto(gastos, id) {
  return gastos.filter((gasto) => gasto.id !== id);
}
