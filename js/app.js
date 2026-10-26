import {
  calcularTotalDelDia,
  crearGasto,
  eliminarGasto,
  fechaLocalActual,
  obtenerGastosDelDia,
} from "./gastos.js";
import { cargarGastos, guardarGastos } from "./almacenamiento.js";

const formatoDinero = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatoFecha = new Intl.DateTimeFormat("es-BO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatearMonto(monto) {
  return formatoDinero.format(monto);
}

export function formatearFecha(fechaISO) {
  const [anio, mes, dia] = fechaISO.split("-").map(Number);
  return formatoFecha.format(new Date(anio, mes - 1, dia));
}

function crearElemento(documento, tag, clase, texto) {
  const elemento = documento.createElement(tag);
  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;
  return elemento;
}

export function iniciarAplicacion(documento = document, almacenamiento) {
  const formulario = documento.querySelector("#formulario-gasto");
  if (!formulario) return;

  const entradaMonto = documento.querySelector("#monto");
  const entradaDescripcion = documento.querySelector("#descripcion");
  const mensaje = documento.querySelector("#mensaje");
  const total = documento.querySelector("#total-dia");
  const lista = documento.querySelector("#lista-gastos");
  const estadoVacio = documento.querySelector("#estado-vacio");
  const cantidad = documento.querySelector("#cantidad-gastos");
  const fecha = fechaLocalActual();
  documento.querySelector("#fecha-actual").textContent = formatearFecha(fecha);

  let gastos;
  try {
    gastos = cargarGastos(almacenamiento);
  } catch (error) {
    gastos = [];
    mensaje.textContent = error.message;
    formulario.querySelector("button[type='submit']").disabled = true;
  }

  function renderizar() {
    const gastosHoy = obtenerGastosDelDia(gastos, fecha);
    total.textContent = formatearMonto(calcularTotalDelDia(gastos, fecha));
    cantidad.textContent = gastosHoy.length === 1
      ? "1 movimiento registrado"
      : `${gastosHoy.length} movimientos registrados`;
    estadoVacio.hidden = gastosHoy.length > 0;
    lista.hidden = gastosHoy.length === 0;
    lista.replaceChildren();

    for (const gasto of [...gastosHoy].reverse()) {
      const fila = crearElemento(documento, "li", "gasto");
      const detalle = crearElemento(documento, "div", "gasto-detalle");
      const descripcion = crearElemento(documento, "p", "gasto-descripcion", gasto.descripcion);
      const monto = crearElemento(documento, "p", "gasto-monto", formatearMonto(gasto.monto));
      const boton = crearElemento(documento, "button", "boton-eliminar", "Eliminar");

      monto.setAttribute("aria-label", `Monto: ${formatearMonto(gasto.monto)}`);
      boton.type = "button";
      boton.setAttribute("aria-label", `Eliminar gasto: ${gasto.descripcion}`);
      boton.addEventListener("click", () => {
        const nuevosGastos = eliminarGasto(gastos, gasto.id);
        try {
          guardarGastos(nuevosGastos, almacenamiento);
          gastos = nuevosGastos;
          mensaje.textContent = "Gasto eliminado.";
          renderizar();
        } catch (error) {
          mensaje.textContent = error.message;
        }
      });

      detalle.append(descripcion, monto);
      fila.append(detalle, boton);
      lista.append(fila);
    }
  }

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();
    mensaje.textContent = "";

    try {
      const gasto = crearGasto({
        monto: entradaMonto.value,
        descripcion: entradaDescripcion.value,
      });
      const nuevosGastos = [...gastos, gasto];
      guardarGastos(nuevosGastos, almacenamiento);
      gastos = nuevosGastos;
      formulario.reset();
      mensaje.textContent = "Gasto registrado.";
      entradaMonto.focus();
      renderizar();
    } catch (error) {
      mensaje.textContent = error.message;
    }
  });

  renderizar();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", iniciarAplicacion);
}
