import assert from "node:assert/strict";
import test from "node:test";
import { formatearFecha, formatearMonto, iniciarAplicacion } from "../js/app.js";

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
}

function crearAlmacenamientoSimulado() {
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
