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
  assert.match(html, /MASTER DUB/);
  assert.match(html, /Escuela de Doblaje · Sevilla/);
  assert.match(html, /Por Paco Cardona/);
  assert.match(html, /masterdub\.es/);
  assert.match(html, /info@masterdub\.es/);
  assert.doesNotMatch(html, /mailto:/i);
  assert.doesNotMatch(html, /Identidad provisional/i);
  assert.doesNotMatch(html, /\bEDS\b/i);
  assert.match(html, /Aprende doblaje/);
  assert.match(html, /Grupos muy reducidos/i);
  assert.doesNotMatch(html, /Máximo 8 alumnos|8 alumnos/i);
  assert.match(html, /Mirar desde una silla[^]*aprender en el atril/i);
  assert.match(html, /Con personajes y actores\/actrices siempre adaptados a tu edad y tipo de voz/i);
  assert.match(html, /Solicita información/i);
  assert.doesNotMatch(html, /Solicita tu plaza|Admisión anual/i);
  assert.match(html, /Intensivo/);
  assert.match(html, /No saldrás del atril[^]*Con posibilidad de asistir como oyente a trabajos reales/i);
  assert.match(html, /Invierte tu tiempo, tu dinero, tus ilusiones y tu futuro en manos de auténticos profesionales/i);
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
  assert.match(html, /Solicita información sobre el Intensivo/i);
  assert.match(html, /formacion=intensivo#informacion/i);
  assert.doesNotMatch(html, /te conseguiremos trabajo|encontraremos trabajo para ti|bolsa de empleo garantizada|acceso directo a estudios/i);
  assert.match(html, /Paco Cardona/);
  assert.match(html, /Ahimsa Sánchez/);
  assert.match(html, /Profesionales invitados/);
  assert.match(html, /Perfil pendiente/);
  assert.match(html, /Acceso alumnos/);
  assert.match(html, /Próximamente/);
  assert.match(html, /id="informacion"/i);
  assert.match(html, /Formulario único[\s\S]*Información/i);
  assert.match(html, /Política de privacidad/i);
  assert.match(html, /Modo demostración: todavía no existe envío/i);
  assert.match(html, /Redes sociales/);
  assert.match(html, /Vídeo pendiente/);
  assert.match(html, /Testimonio real pendiente/);
  assert.doesNotMatch(html, /href=""/i);
  assert.doesNotMatch(html, /autoplay/i);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("information and future-profile flows remain explicit and disconnected", async () => {
  const [informationSource, informationConfig, intensiveSource, readme] = await Promise.all([
    readFile(new URL("../components/InformationForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../config/information.ts", import.meta.url), "utf8"),
    readFile(new URL("../config/intensive.ts", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(informationSource, /No se ha enviado ni almacenado ninguna información/i);
  assert.match(informationSource, /privacyAccepted/i);
  assert.match(informationSource, /formacion[\s\S]*intensivo/i);
  assert.doesNotMatch(informationSource, /fetch\(|axios|Solicitud recibida|Enviar solicitud/i);
  assert.match(informationConfig, /backendConnected: false/i);
  assert.match(informationConfig, /Nuevo contacto \/ candidato potencial/i);
  assert.match(informationConfig, /origin: "website"/i);
  assert.match(readme, /Modelo conceptual de candidato conservado/i);
  assert.match(readme, /perfil pedagógico[\s\S]*expectativas profesionales/i);
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
