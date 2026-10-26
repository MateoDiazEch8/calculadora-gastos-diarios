import { createReadStream, statSync } from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.dirname(fileURLToPath(import.meta.url));
const puerto = Number(process.argv[2] ?? 4173);

if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
  throw new Error("Indica un puerto válido entre 1 y 65535.");
}

const tiposDeContenido = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

const servidor = createServer((solicitud, respuesta) => {
  if (solicitud.method !== "GET" && solicitud.method !== "HEAD") {
    respuesta.writeHead(405, { Allow: "GET, HEAD" }).end("Método no permitido.");
    return;
  }

  let segmentos;
  try {
    const ruta = decodeURIComponent(new URL(solicitud.url, "http://localhost").pathname);
    segmentos = ruta.split("/").filter(Boolean);
  } catch {
    respuesta.writeHead(400).end("La ruta no es válida.");
    return;
  }

  if (segmentos.length === 0) segmentos = ["index.html"];
  const esRecursoPermitido =
    (segmentos.length === 1 && segmentos[0] === "index.html") ||
    (segmentos.length === 2 && ["css", "js"].includes(segmentos[0]));

  if (!esRecursoPermitido) {
    respuesta.writeHead(404).end("No se encontró el recurso.");
    return;
  }

  const archivo = path.resolve(raiz, ...segmentos);
  const rutaRelativa = path.relative(raiz, archivo);
  if (rutaRelativa.startsWith("..") || path.isAbsolute(rutaRelativa)) {
    respuesta.writeHead(404).end("No se encontró el recurso.");
    return;
  }

  try {
    if (!statSync(archivo).isFile()) {
      respuesta.writeHead(404).end("No se encontró el recurso.");
      return;
    }
  } catch {
    respuesta.writeHead(404).end("No se encontró el recurso.");
    return;
  }

  respuesta.writeHead(200, {
    "Cache-Control": "no-store",
    "Content-Type": tiposDeContenido[path.extname(archivo)] ?? "application/octet-stream",
  });

  if (solicitud.method === "HEAD") {
    respuesta.end();
    return;
  }

  createReadStream(archivo).pipe(respuesta);
});

servidor.listen(puerto, "127.0.0.1", () => {
  process.stdout.write(`Calculadora disponible en http://127.0.0.1:${puerto}\n`);
});
