import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the production homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Escuela de Doblaje/);
  assert.match(html, /Identidad provisional/i);
  assert.doesNotMatch(html, /\bEDS\b/i);
  assert.match(html, /Aprende doblaje/);
  assert.match(html, /Solicita tu plaza/i);
  assert.match(html, /Solicitud[\s\S]*admisión/i);
  assert.match(html, /Intensivo/);
  assert.match(html, /Dos días\.[\s\S]*Dos alumnos\.[\s\S]*Una convocatoria diseñada para ti\./i);
  assert.match(html, /Antes de entrar en sala/i);
  assert.match(html, /No todos los participantes trabajan exactamente el mismo material/i);
  assert.match(html, /Una convocatoria diseñada para ti/i);
  assert.match(html, /Día 1[\s\S]*Conocer, ajustar, preparar/i);
  assert.match(html, /Día 2[\s\S]*Trabajar como en una convocatoria/i);
  assert.match(html, /Hoy has venido a trabajar/i);
  assert.match(html, /Después del atril/i);
  assert.match(html, /futuro directorio de talento/i);
  assert.match(html, /Máximo 2 participantes por edición/i);
  assert.match(html, /href="#intensive-access"/i);
  assert.match(html, /id="intensive-access"/i);
  assert.doesNotMatch(html, /te conseguiremos trabajo|encontraremos trabajo para ti|bolsa de empleo garantizada|acceso directo a estudios/i);
  assert.match(html, /Paco Cardona/);
  assert.match(html, /Ahimsa Sánchez/);
  assert.match(html, /Profesionales invitados/);
  assert.match(html, /Perfil pendiente/);
  assert.match(html, /Acceso alumnos/);
  assert.match(html, /Próximamente/);
  assert.match(html, /Admisión anual/);
  assert.match(html, /Redes sociales/);
  assert.match(html, /Vídeo pendiente/);
  assert.match(html, /Testimonio real pendiente/);
  assert.doesNotMatch(html, /href=""/i);
  assert.doesNotMatch(html, /autoplay/i);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("demo and future-profile flows remain explicit and disconnected", async () => {
  const [admissionSource, intensiveSource] = await Promise.all([
    readFile(new URL("../components/AdmissionForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../config/intensive.ts", import.meta.url), "utf8"),
  ]);

  assert.match(admissionSource, /Finalizar demostración/i);
  assert.match(admissionSource, /No se ha enviado ni almacenado ninguna respuesta/i);
  assert.doesNotMatch(admissionSource, /Solicitud recibida|Enviar solicitud/i);
  assert.match(intensiveSource, /backendConnected: false/i);
  assert.match(intensiveSource, /Consentimiento voluntario para formar parte del directorio/i);
  assert.match(intensiveSource, /no implica aparecer en el directorio ni autoriza la publicación/i);
});

test("server-renders a legal placeholder route", async () => {
  const response = await render("/politica-de-privacidad");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Política de privacidad/);
  assert.match(html, /no envía ni almacena datos personales/i);
});

test("server-renders the remaining legal routes as provisional documents", async () => {
  const legalNotice = await render("/aviso-legal");
  assert.equal(legalNotice.status, 200);
  assert.match(await legalNotice.text(), /pendiente de completar antes de la publicación/i);

  const cookiesPolicy = await render("/politica-de-cookies");
  assert.equal(cookiesPolicy.status, 200);
  assert.match(await cookiesPolicy.text(), /panel de consentimiento se actualizarán/i);
});
