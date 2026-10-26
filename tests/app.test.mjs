import assert from "node:assert/strict";
import test from "node:test";
import {
  formatearFecha,
  formatearMonto,
  iniciarAplicacion,
  registrarInicio,
} from "../js/app.js";
import { fechaLocalActual } from "../js/gastos.js";

test("muestra los montos en bolivianos con dos decimales", () => {
  assert.match(formatearMonto(12.5), /Bs.*12,50/);
});

test("formatea la fecha sin desplazar el día por la zona horaria", () => {
  assert.match(formatearFecha("2026-10-26"), /26.*octubre.*2026/);
});

class ElementoFalso {
  constructor(etiqueta, documento) {
    this.etiqueta = etiqueta;
    this.documento = documento;
    this.atributos = {};
    this.hijos = [];
    this.escuchadores = {};
    this.textContent = "";
    this.value = "";
    this.hidden = false;
    this.disabled = false;
  }

  addEventListener(tipo, callback) {
    this.escuchadores[tipo] = callback;
  }

  setAttribute(nombre, valor) {
    this.atributos[nombre] = valor;
  }

  append(...hijos) {
    this.hijos.push(...hijos);
  }

  replaceChildren(...hijos) {
    this.hijos = [...hijos];
  }

  querySelector(selector) {
    if (selector === "button[type='submit']") return this.documento.querySelector("#boton-enviar");
    return null;
  }

  reset() {
    this.documento.querySelector("#monto").value = "";
    this.documento.querySelector("#descripcion").value = "";
  }

  focus() {}
}

class DocumentoFalso {
  constructor() {
    this.elementos = new Map();
    this.escuchadores = {};
    for (const selector of [
      "#formulario-gasto",
      "#monto",
      "#descripcion",
      "#mensaje",
      "#total-dia",
      "#lista-gastos",
      "#estado-vacio",
      "#cantidad-gastos",
      "#fecha-actual",
      "#boton-enviar",
      "#titulo-resumen",
      "#titulo-gastos",
      "#lista-dias",
      "#estado-vacio-dias",
      "#volver-hoy",
    ]) {
      this.elementos.set(selector, new ElementoFalso("div", this));
    }
  }

  querySelector(selector) {
    return this.elementos.get(selector) ?? null;
  }

  createElement(etiqueta) {
    return new ElementoFalso(etiqueta, this);
  }

  addEventListener(tipo, callback) {
    this.escuchadores[tipo] = callback;
  }
}

function crearAlmacenamientoSimulado(gastos = null) {
  const valores = new Map();
  if (gastos !== null) {
    valores.set("calculadora-gastos.registros.v1", JSON.stringify(gastos));
  }
  return {
    getItem(clave) {
      return valores.has(clave) ? valores.get(clave) : null;
    },
    setItem(clave, valor) {
      valores.set(clave, String(valor));
    },
  };
}

test("la interfaz registra, lista y elimina un gasto actualizando el total", () => {
  const documento = new DocumentoFalso();
  const almacenamiento = crearAlmacenamientoSimulado();
  iniciarAplicacion(documento, almacenamiento);

  const formulario = documento.querySelector("#formulario-gasto");
  const entradaMonto = documento.querySelector("#monto");
  const entradaDescripcion = documento.querySelector("#descripcion");
  const mensaje = documento.querySelector("#mensaje");
  const lista = documento.querySelector("#lista-gastos");

  assert.match(documento.querySelector("#total-dia").textContent, /Bs.*0,00/);
  assert.equal(documento.querySelector("#estado-vacio").hidden, false);
  assert.equal(lista.hidden, true);
  assert.equal(documento.querySelector("#estado-vacio-dias").hidden, false);
  assert.equal(documento.querySelector("#lista-dias").hidden, true);

  entradaMonto.value = "0";
  entradaDescripcion.value = "Cena";
  formulario.escuchadores.submit({ preventDefault() {} });
  assert.match(mensaje.textContent, /mayor que cero/);
  assert.equal(almacenamiento.getItem("calculadora-gastos.registros.v1"), null);

  entradaMonto.value = "12,50";
  formulario.escuchadores.submit({ preventDefault() {} });
  assert.match(mensaje.textContent, /Gasto registrado/);
  assert.match(documento.querySelector("#total-dia").textContent, /12,50/);
  assert.equal(documento.querySelector("#estado-vacio").hidden, true);
  assert.equal(lista.hijos.length, 1);
  assert.equal(lista.hijos[0].hijos[0].hijos[0].textContent, "Cena");

  lista.hijos[0].hijos[1].escuchadores.click();
  assert.match(mensaje.textContent, /Gasto eliminado/);
  assert.match(documento.querySelector("#total-dia").textContent, /Bs.*0,00/);
  assert.equal(documento.querySelector("#estado-vacio").hidden, false);
  assert.equal(lista.hidden, true);
});

test("el evento de carga inicializa la app usando el documento y no el evento", () => {
  const documento = new DocumentoFalso();
  registrarInicio(documento, crearAlmacenamientoSimulado());

  documento.escuchadores.DOMContentLoaded({ type: "DOMContentLoaded" });

  assert.match(documento.querySelector("#fecha-actual").textContent, /\d{4}/);
  assert.match(documento.querySelector("#total-dia").textContent, /Bs.*0,00/);
});

test("la interfaz impide registrar si no puede leer el almacenamiento", () => {
  const documento = new DocumentoFalso();
  const almacenamiento = {
    getItem() {
      throw new Error("fallo simulado");
    },
  };

  iniciarAplicacion(documento, almacenamiento);

  assert.match(documento.querySelector("#mensaje").textContent, /No se pudieron leer/);
  assert.equal(documento.querySelector("#boton-enviar").disabled, true);
});

test("la interfaz no confirma un registro si falla la escritura", () => {
  const documento = new DocumentoFalso();
  const almacenamiento = {
    getItem() {
      return null;
    },
    setItem() {
      throw new Error("fallo simulado");
    },
  };
  iniciarAplicacion(documento, almacenamiento);

  documento.querySelector("#monto").value = "8";
  documento.querySelector("#descripcion").value = "Pasaje";
  documento.querySelector("#formulario-gasto").escuchadores.submit({ preventDefault() {} });

  assert.match(documento.querySelector("#mensaje").textContent, /No se pudieron guardar/);
  assert.match(documento.querySelector("#total-dia").textContent, /Bs.*0,00/);
  assert.equal(documento.querySelector("#lista-gastos").hidden, true);
});

test("la interfaz permite consultar días anteriores y volver a hoy", () => {
  const hoy = fechaLocalActual();
  const ahora = new Date();
  const ayer = fechaLocalActual(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 1));
  const anteayer = fechaLocalActual(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 2));
  const gastos = [
    { id: "hoy-1", monto: 5, descripcion: "Desayuno", fecha: hoy },
    { id: "ayer-1", monto: 12.5, descripcion: "Almuerzo", fecha: ayer },
    { id: "ayer-2", monto: 2.5, descripcion: "Refresco", fecha: ayer },
    { id: "antes-1", monto: 8, descripcion: "Pasaje", fecha: anteayer },
  ];
  const documento = new DocumentoFalso();
  iniciarAplicacion(documento, crearAlmacenamientoSimulado(gastos));

  const listaDias = documento.querySelector("#lista-dias");
  const botonAyer = listaDias.hijos
    .map((fila) => fila.hijos[0])
    .find((boton) => boton.atributos["data-fecha"] === ayer);

  assert.equal(listaDias.hijos.length, 3);
  assert.equal(botonAyer.atributos["aria-pressed"], "false");
  botonAyer.escuchadores.click();

  assert.equal(documento.querySelector("#fecha-actual").textContent, formatearFecha(ayer));
  assert.equal(documento.querySelector("#titulo-resumen").textContent, "Total del día");
  assert.match(documento.querySelector("#total-dia").textContent, /15,00/);
  assert.equal(documento.querySelector("#lista-gastos").hijos.length, 2);
  assert.equal(
    listaDias.hijos.map((fila) => fila.hijos[0]).find((boton) => boton.atributos["data-fecha"] === ayer)
      .atributos["aria-pressed"],
    "true",
  );

  documento.querySelector("#volver-hoy").escuchadores.click();
  assert.equal(documento.querySelector("#fecha-actual").textContent, formatearFecha(hoy));
  assert.equal(documento.querySelector("#titulo-resumen").textContent, "Total de hoy");
  assert.match(documento.querySelector("#total-dia").textContent, /5,00/);
});

test("si se elimina el último gasto de un día, ese día sale del historial", () => {
  const hoy = fechaLocalActual();
  const ahora = new Date();
  const ayer = fechaLocalActual(new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() - 1));
  const documento = new DocumentoFalso();
  iniciarAplicacion(documento, crearAlmacenamientoSimulado([
    { id: "hoy-1", monto: 5, descripcion: "Desayuno", fecha: hoy },
    { id: "ayer-1", monto: 12.5, descripcion: "Almuerzo", fecha: ayer },
  ]));

  const listaDias = documento.querySelector("#lista-dias");
  listaDias.hijos.map((fila) => fila.hijos[0])
    .find((boton) => boton.atributos["data-fecha"] === ayer).escuchadores.click();
  documento.querySelector("#lista-gastos").hijos[0].hijos[1].escuchadores.click();

  assert.match(documento.querySelector("#total-dia").textContent, /Bs.*0,00/);
  assert.equal(documento.querySelector("#estado-vacio").hidden, false);
  assert.equal(listaDias.hijos.length, 1);
  assert.equal(listaDias.hijos[0].hijos[0].atributos["data-fecha"], hoy);
});
