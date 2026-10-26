import assert from "node:assert/strict";
import test from "node:test";
import {
  calcularTotalDelDia,
  crearGasto,
  eliminarGasto,
  fechaLocalActual,
  obtenerDiasConGastos,
  obtenerGastosDelDia,
  validarMonto,
} from "../js/gastos.js";

test("acepta montos positivos con punto o coma y hasta dos decimales", () => {
  assert.equal(validarMonto("12"), 1200);
  assert.equal(validarMonto("12.5"), 1250);
  assert.equal(validarMonto("12,50"), 1250);
});

test("rechaza montos vacíos, no numéricos, no positivos o con más de dos decimales", () => {
  for (const monto of ["", "abc", "0", "-1", "12.345"]) {
    assert.throws(() => validarMonto(monto), Error);
  }
  assert.throws(() => validarMonto("0"), /mayor que cero/);
  assert.throws(() => validarMonto("12.345"), /máximo dos decimales/);
});

test("crea un gasto limpio y asigna la fecha local actual por defecto", () => {
  const gasto = crearGasto({
    id: "gasto-1",
    monto: "12,50",
    descripcion: "  Almuerzo  ",
  });

  assert.deepEqual(gasto, {
    id: "gasto-1",
    monto: 12.5,
    descripcion: "Almuerzo",
    fecha: fechaLocalActual(),
  });
  assert.equal(fechaLocalActual(new Date(2026, 9, 26, 12, 0, 0)), "2026-10-26");
});

test("impide crear un gasto con descripción vacía", () => {
  assert.throws(
    () => crearGasto({ monto: "10", descripcion: "   ", fecha: "2026-10-26", id: "g1" }),
    /descripción es obligatoria/,
  );
});

test("filtra gastos y suma el total de un día con precisión de centavos", () => {
  const gastos = [
    { id: "g1", monto: 0.1, descripcion: "A", fecha: "2026-10-26" },
    { id: "g2", monto: 0.2, descripcion: "B", fecha: "2026-10-26" },
    { id: "g3", monto: 50, descripcion: "C", fecha: "2026-10-25" },
  ];

  assert.deepEqual(obtenerGastosDelDia(gastos, "2026-10-26").map((gasto) => gasto.id), ["g1", "g2"]);
  assert.equal(calcularTotalDelDia(gastos, "2026-10-26"), 0.3);
  assert.equal(calcularTotalDelDia(gastos, "2026-10-24"), 0);
});

test("lista los días con gastos una sola vez y del más reciente al más antiguo", () => {
  const gastos = [
    { id: "g1", monto: 10, descripcion: "A", fecha: "2026-10-25" },
    { id: "g2", monto: 5, descripcion: "B", fecha: "2026-10-26" },
    { id: "g3", monto: 2, descripcion: "C", fecha: "2026-10-25" },
    { id: "g4", monto: 8, descripcion: "D", fecha: "2026-10-24" },
  ];

  assert.deepEqual(obtenerDiasConGastos(gastos), ["2026-10-26", "2026-10-25", "2026-10-24"]);
});

test("elimina un gasto y el total del día se actualiza al recalcular", () => {
  const gastos = [
    { id: "g1", monto: 10, descripcion: "A", fecha: "2026-10-26" },
    { id: "g2", monto: 5.5, descripcion: "B", fecha: "2026-10-26" },
  ];

  const restantes = eliminarGasto(gastos, "g1");

  assert.deepEqual(restantes.map((gasto) => gasto.id), ["g2"]);
  assert.equal(calcularTotalDelDia(restantes, "2026-10-26"), 5.5);
  assert.equal(gastos.length, 2);
});
