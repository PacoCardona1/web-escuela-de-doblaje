import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
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

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  return (await import(workerUrl.href)).default;
}

function validInformationPayload(overrides = {}) {
  return {
    schemaVersion: 1,
    fullName: "Persona interesada",
    email: "persona@example.com",
    phone: "+34 600 000 000",
    trainingInterest: "annual",
    message: "Quiero recibir información sobre la formación.",
    contactPreference: "email",
    privacyAccepted: true,
    origin: "website",
    createdAt: null,
    company: "",
    formStartedAt: Date.now() - 5_000,
    submissionId: "1b4e28ba-2fa1-4f4c-91d2-6a8164f70101",
    ...overrides,
  };
}

async function readBuiltClient() {
  const directory = new URL("../dist/client/", import.meta.url);
  const files = await readdir(directory, { recursive: true, withFileTypes: true });
  const contents = await Promise.all(files
    .filter((entry) => entry.isFile())
    .map((entry) => readFile(join(entry.parentPath, entry.name), "utf8").catch(() => "")));
  return contents.join("\n");
}

test("server-renders the production homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /MASTER DUB/);
  assert.match(html, /Formación de Doblaje · Sevilla/);
  assert.match(html, /Por Paco Cardona/);
  assert.match(html, /\/brand\/master-dub-official-final\.png/);
  assert.doesNotMatch(html, /\/brand\/master-dub-official\.png/);
  assert.match(html, /MASTER DUB — FORMACIÓN PROFESIONAL DE DOBLAJE/);
  assert.doesNotMatch(html, /master-dub-(?:lockup|logo-(?:dark|light)|symbol-(?:dark|light)|wordmark)/i);
  assert.match(html, /masterdub\.es/);
  assert.match(html, /info@masterdub\.es/);
  assert.doesNotMatch(html, /mailto:/i);
  assert.doesNotMatch(html, /Identidad provisional/i);
  assert.doesNotMatch(html, /\bEDS\b/i);
  assert.match(html, /Aprende doblaje/);
  assert.match(html, /No vienes a clase\. Vienes a doblar\./i);
  assert.match(html, /personas con formación previa/i);
  assert.doesNotMatch(html, /con formación (?:y|o) experiencia previa/i);
  assert.match(html, /2 participantes/i);
  assert.match(html, /<dd>2<\/dd><dt>Jornadas<\/dt>/i);
  assert.match(html, /3 horas/i);
  assert.match(html, /6 horas/i);
  assert.doesNotMatch(html, /5 horas|10 horas|16 horas/i);
  assert.match(html, /No es formación de iniciación/i);
  assert.match(html, /El trabajo se prepara para ti/i);
  assert.match(html, /Aquí no vienes a esperar tu turno\. Vienes a trabajar\./i);
  assert.match(html, /Sabes quién va a analizarte, dirigirte y corregirte/i);
  assert.match(html, /Acreditación MASTER DUB/i);
  assert.match(html, /únicamente si existe una sesión adecuada/i);
  assert.match(html, /La formación no implica trabajo, representación ni contratación/i);
  assert.match(html, /Aprende en un estudio de doblaje profesional/i);
  assert.match(html, /Las clases de Master Dub se imparten en las instalaciones de Recording Words/i);
  assert.match(html, /En colaboración con Recording Words/i);
  assert.match(html, /class="facilities section-dark"/i);
  assert.match(html, /class="direction section-dark"/i);
  assert.match(html, /Grupos muy reducidos/i);
  assert.doesNotMatch(html, /Máximo 8 alumnos|8 alumnos/i);
  assert.match(html, /Construye una base sólida desde el atril/i);
  assert.match(html, /Cada take tiene un propósito formativo/i);
  assert.match(html, /Formación anual/i);
  assert.doesNotMatch(html, /Curso anual/i);
  assert.match(html, /Solicita información/i);
  assert.doesNotMatch(html, /Solicita tu plaza|Admisión anual/i);
  assert.doesNotMatch(html, /Intensivo Profesional|Masterclass/i);
  assert.doesNotMatch(html, /id="metodologia"/i);
  assert.match(html, /Solicita información sobre MASTER DUB/i);
  assert.match(html, /formacion=intensivo#informacion/i);
  assert.doesNotMatch(html, /te conseguiremos trabajo|encontraremos trabajo para ti|bolsa de empleo garantizada|acceso directo a estudios/i);
  assert.match(html, /Paco Cardona/);
  assert.match(html, /Ahimsa Sánchez/);
  assert.match(html, /Actor, ajustador y director de doblaje en activo\./);
  assert.match(html, /Actriz, ajustadora y directora de doblaje en activo\./);
  assert.match(html, /Más de 30 años de experiencia profesional\./);
  assert.match(html, /href="https:\/\/pacocardona\.com"/i);
  assert.doesNotMatch(html, /ahimsa[^<]{0,80}href=/i);
  assert.match(html, /paco-cardona\.webp/);
  assert.match(html, /ahimsa-sanchez\.webp/);
  assert.doesNotMatch(html, /Fotografía provisional · No representa a (?:Paco Cardona|Ahimsa Sánchez)/i);
  assert.match(html, /Profesionales invitados/);
  assert.match(html, /Por confirmar/);
  assert.doesNotMatch(html, /Perfil pendiente|Foto pendiente/);
  assert.match(html, /Acceso alumnos/);
  assert.match(html, /Próximamente/);
  assert.match(html, /id="informacion"/i);
  assert.match(html, /Formulario único[\s\S]*Información/i);
  assert.match(html, /Política de privacidad/i);
  assert.match(html, /Enviar solicitud/i);
  assert.doesNotMatch(html, /Modo demostración: todavía no existe envío/i);
  assert.match(html, /Francisco Martínez Cardona/i);
  assert.match(html, /Atender y gestionar tu solicitud de información/i);
  assert.match(html, /Redes sociales/);
  assert.match(html, /video-poster-lectern\.webp/);
  assert.match(html, /video-poster-script\.webp/);
  assert.match(html, /video-poster-control\.webp/);
  assert.match(html, /master-dub-lanyard\.webp/);
  assert.match(html, /masterdub-no-vienes-a-clase\.webp/);
  assert.match(html, /masterdub-seccion-02\.webp/);
  assert.doesNotMatch(html, /Imagen provisional · No representa las instalaciones de MASTER DUB/i);
  assert.match(html, /Una experiencia dentro de la profesión/);
  assert.doesNotMatch(html, /Vídeo pendiente|Duración pendiente/);
  assert.doesNotMatch(html, /Testimonio real pendiente/);
  assert.doesNotMatch(html, /href=""/i);
  assert.doesNotMatch(html, /autoplay/i);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);

  const documentHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  const masterDubPosition = documentHtml.indexOf('id="master-dub"');
  const annualPosition = documentHtml.indexOf('id="curso"');
  const facilitiesPosition = documentHtml.indexOf('id="instalaciones"');
  const professionalsPosition = documentHtml.indexOf('id="direccion"');
  const videosPosition = documentHtml.indexOf('id="en-sala"');
  const informationPosition = documentHtml.indexOf('id="informacion"');
  assert.ok(masterDubPosition > -1 && masterDubPosition < annualPosition);
  assert.ok(annualPosition < facilitiesPosition && facilitiesPosition < professionalsPosition);
  assert.ok(professionalsPosition < videosPosition && videosPosition < informationPosition);
  assert.match(documentHtml, /href="#en-sala"[^>]*>En sala/i);

  const withoutFacilities = documentHtml.slice(0, facilitiesPosition) + documentHtml.slice(professionalsPosition);
  assert.doesNotMatch(withoutFacilities, /Recording Words/i);
});

test("information flow is connected while future-profile flow remains explicit and disconnected", async () => {
  const [informationSource, informationConfig, intensiveSource, readme] = await Promise.all([
    readFile(new URL("../components/InformationForm.tsx", import.meta.url), "utf8"),
    readFile(new URL("../config/information.ts", import.meta.url), "utf8"),
    readFile(new URL("../config/intensive.ts", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
  ]);

  assert.match(informationSource, /\/api\/information-request/i);
  assert.match(informationSource, /privacyAccepted/i);
  assert.match(informationSource, /formacion[\s\S]*intensivo/i);
  assert.match(informationSource, /fetch\(/i);
  assert.match(informationConfig, /backendConnected: true/i);
  assert.match(informationConfig, /Nuevo contacto \/ candidato potencial/i);
  assert.match(informationConfig, /origin: "website"/i);
  assert.match(readme, /Modelo conceptual de candidato conservado/i);
  assert.match(readme, /perfil pedagógico[\s\S]*expectativas profesionales/i);
  assert.match(intensiveSource, /backendConnected: false/i);
  assert.match(intensiveSource, /Consentimiento voluntario para formar parte del directorio/i);
  assert.match(intensiveSource, /no implica aparecer en el directorio ni autoriza la publicación/i);
});

test("information endpoint validates input and sends through Resend without exposing its secret", async () => {
  const worker = await loadWorker();
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (input, init) => {
    calls.push({ input: String(input), init });
    return Response.json({ id: "email-test-id" });
  };

  try {
    const response = await worker.fetch(
      new Request("https://masterdub.es/api/information-request", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://masterdub.es" },
        body: JSON.stringify(validInformationPayload()),
      }),
      { RESEND_API_KEY: "test-server-secret" },
      { waitUntil() {}, passThroughOnException() {} },
    );

    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), {
      ok: true,
      message: "Tu solicitud se ha enviado correctamente. Nos pondremos en contacto contigo.",
    });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].input, "https://api.resend.com/emails");
    assert.equal(calls[0].init.headers.Authorization, "Bearer test-server-secret");
    const email = JSON.parse(calls[0].init.body);
    assert.equal(email.from, "MASTER DUB <info@masterdub.es>");
    assert.deepEqual(email.to, ["info@masterdub.es"]);
    assert.equal(email.reply_to, "persona@example.com");

    const invalidResponse = await worker.fetch(
      new Request("https://masterdub.es/api/information-request", {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "https://masterdub.es" },
        body: JSON.stringify(validInformationPayload({ email: "incorrecto" })),
      }),
      { RESEND_API_KEY: "test-server-secret" },
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(invalidResponse.status, 422);
    assert.equal(calls.length, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }

  const builtClientFiles = await readBuiltClient();
  assert.doesNotMatch(builtClientFiles, /test-server-secret|RESEND_API_KEY/);
});

test("server-renders the complete privacy policy", async () => {
  const response = await render("/politica-de-privacidad");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Política de privacidad/);
  assert.match(html, /Francisco Martínez Cardona/i);
  assert.match(html, /28902026L/i);
  assert.match(html, /Agencia Española de Protección de Datos/i);
  assert.match(html, /Transferencias internacionales/i);
  assert.match(html, /Resend/i);
  assert.doesNotMatch(html, /pendiente de completar|versión de demostración/i);
});

test("server-renders the legal notice and truthful cookies policy", async () => {
  const legalNotice = await render("/aviso-legal");
  assert.equal(legalNotice.status, 200);
  const legalHtml = await legalNotice.text();
  assert.match(legalHtml, /Francisco Martínez Cardona/i);
  assert.match(legalHtml, /28902026L/i);
  assert.match(legalHtml, /Avenida de Astronomía 1/i);
  assert.match(legalHtml, /Propiedad intelectual e industrial/i);
  assert.doesNotMatch(legalHtml, /pendiente de completar/i);

  const cookiesPolicy = await render("/politica-de-cookies");
  assert.equal(cookiesPolicy.status, 200);
  const cookiesHtml = await cookiesPolicy.text();
  assert.match(cookiesHtml, /no instala actualmente cookies propias ni de terceros/i);
  assert.match(cookiesHtml, /Google Analytics/i);
  assert.doesNotMatch(cookiesHtml, /pendiente de completar/i);
});
