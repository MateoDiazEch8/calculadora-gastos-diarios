import assert from "node:assert/strict";
import test from "node:test";
import { cargarGastos, CLAVE_GASTOS, guardarGastos } from "../js/almacenamiento.js";

function crearAlmacenamientoMemoria() {
  const valores = new Map();
  return {
    getItem(clave) {
      return valores.has(clave) ? valores.get(clave) : null;
    },
    setItem(clave, valor) {
      valores.set(clave, String(valor));
    },
  };
}

test("devuelve una lista vacía cuando no hay gastos guardados", () => {
  assert.deepEqual(cargarGastos(crearAlmacenamientoMemoria()), []);
});

test("guarda y carga los gastos desde el almacenamiento simulado", () => {
  const almacenamiento = crearAlmacenamientoMemoria();
  const gastos = [
    { id: "g1", monto: 12.5, descripcion: "Almuerzo", fecha: "2026-10-26" },
  ];

  guardarGastos(gastos, almacenamiento);

  assert.deepEqual(cargarGastos(almacenamiento), gastos);
});

test("usa una clave versionada para los registros", () => {
  assert.match(CLAVE_GASTOS, /\.v1$/);
});

test("informa si falla la escritura", () => {
  const almacenamiento = {
    setItem() {
      throw new Error("cuota excedida");
    },
  };

  assert.throws(() => guardarGastos([], almacenamiento), /No se pudieron guardar/);
});

test("informa si falla la lectura o los datos guardados no son válidos", () => {
  const errorAlLeer = {
    getItem() {
      throw new Error("acceso denegado");
    },
  };
  const datosCorruptos = {
    getItem() {
      return "no es JSON";
    },
  };
  const datosNoSonLista = {
    getItem() {
      return JSON.stringify({ gasto: "g1" });
    },
  };

  assert.throws(() => cargarGastos(errorAlLeer), /No se pudieron leer/);
  assert.throws(() => cargarGastos(datosCorruptos), /No se pudieron leer/);
  assert.throws(() => cargarGastos(datosNoSonLista), /No se pudieron leer/);
});
