const RESEND_ENDPOINT = "https://api.resend.com/emails";
const MAX_BODY_BYTES = 16 * 1024;
const MIN_FORM_COMPLETION_MS = 1_500;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;

const trainingLabels = {
  annual: "Formación Anual",
  intensive: "MASTER DUB",
  general: "Información general / Otra consulta",
} as const;

const contactPreferenceLabels = {
  email: "Email",
  phone: "Teléfono",
  whatsapp: "WhatsApp",
  "": "Sin preferencia",
} as const;

type InformationPayload = {
  fullName: string;
  email: string;
  phone: string;
  trainingInterest: keyof typeof trainingLabels;
  message: string;
  contactPreference: keyof typeof contactPreferenceLabels;
  privacyAccepted: true;
  contactGuard: "";
  formStartedAt: number;
  submissionId: string;
};

type FieldName = "fullName" | "email" | "phone" | "trainingInterest" | "message" | "privacy";
type FieldErrors = Partial<Record<FieldName, string>>;

export type InformationRequestEnv = {
  RESEND_API_KEY?: string;
};

function jsonResponse(body: object, status: number): Response {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function readBoundedJson(request: Request): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    throw new Error("payload_too_large");
  }

  if (!request.body) throw new Error("empty_body");

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BODY_BYTES) {
      await reader.cancel();
      throw new Error("payload_too_large");
    }
    chunks.push(value);
  }

  const body = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return JSON.parse(new TextDecoder().decode(body));
}

function cleanString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validatePayload(value: unknown): { payload?: InformationPayload; fieldErrors: FieldErrors } {
  const fieldErrors: FieldErrors = {};
  if (!value || typeof value !== "object" || Array.isArray(value)) return { fieldErrors };

  const input = value as Record<string, unknown>;
  const fullName = cleanString(input.fullName);
  const email = cleanString(input.email).toLowerCase();
  const phone = cleanString(input.phone);
  const trainingInterest = cleanString(input.trainingInterest);
  const message = cleanString(input.message);
  const contactPreference = cleanString(input.contactPreference);
  const contactGuard = cleanString(input.contactGuard);
  const formStartedAt = typeof input.formStartedAt === "number" ? input.formStartedAt : 0;
  const submissionId = cleanString(input.submissionId);

  if (fullName.length < 2 || fullName.length > 120) fieldErrors.fullName = "Revisa tu nombre y apellidos.";
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Introduce un email válido.";
  if (phone.length > 40 || phone.replace(/\D/g, "").length < 6) fieldErrors.phone = "Introduce un teléfono válido.";
  if (!(trainingInterest in trainingLabels)) fieldErrors.trainingInterest = "Selecciona una formación válida.";
  if (message.length < 2 || message.length > 2_000) fieldErrors.message = "El mensaje debe tener entre 2 y 2.000 caracteres.";
  if (input.privacyAccepted !== true) fieldErrors.privacy = "Debes confirmar que has leído la información de privacidad.";

  const age = Date.now() - formStartedAt;
  const validTiming = Number.isFinite(age) && age >= MIN_FORM_COMPLETION_MS && age <= MAX_FORM_AGE_MS;
  const validSubmissionId = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId);
  const validContactPreference = contactPreference in contactPreferenceLabels;

  if (Object.keys(fieldErrors).length > 0 || contactGuard || !validTiming || !validSubmissionId || !validContactPreference) return { fieldErrors };

  return {
    fieldErrors,
    payload: {
      fullName,
      email,
      phone,
      trainingInterest: trainingInterest as InformationPayload["trainingInterest"],
      message,
      contactPreference: contactPreference as InformationPayload["contactPreference"],
      privacyAccepted: true,
      contactGuard: "",
      formStartedAt,
      submissionId,
    },
  };
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
  })[character] ?? character);
}

function emailContent(payload: InformationPayload): { html: string; text: string } {
  const fields = [
    ["Nombre y apellidos", payload.fullName],
    ["Email", payload.email],
    ["Teléfono", payload.phone],
    ["Formación de interés", trainingLabels[payload.trainingInterest]],
    ["Preferencia de contacto", contactPreferenceLabels[payload.contactPreference]],
    ["Mensaje", payload.message],
    ["Privacidad", "Información de privacidad leída y aceptada"],
  ] as const;

  const htmlRows = fields.map(([label, content]) => `
    <tr>
      <th style="padding:10px 16px;text-align:left;vertical-align:top;border-bottom:1px solid #deded8;font:600 12px Arial,sans-serif;color:#555">${escapeHtml(label)}</th>
      <td style="padding:10px 16px;border-bottom:1px solid #deded8;font:14px/1.55 Arial,sans-serif;color:#181818;white-space:pre-wrap">${escapeHtml(content)}</td>
    </tr>`).join("");

  return {
    html: `<!doctype html><html lang="es"><body style="margin:0;padding:32px;background:#f4f1e8"><main style="max-width:680px;margin:auto;padding:28px;background:#fff"><h1 style="margin:0 0 24px;font:600 24px Arial,sans-serif;color:#181818">Nueva solicitud de información — MASTER DUB</h1><table style="width:100%;border-collapse:collapse">${htmlRows}</table></main></body></html>`,
    text: ["Nueva solicitud de información — MASTER DUB", "", ...fields.map(([label, content]) => `${label}: ${content}`)].join("\n"),
  };
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function handleInformationRequest(request: Request, env: InformationRequestEnv): Promise<Response> {
  if (request.method !== "POST") {
    return jsonResponse({ ok: false, message: "Método no permitido." }, 405);
  }

  if (!isSameOrigin(request)) {
    return jsonResponse({ ok: false, message: "No se ha podido validar el origen de la solicitud." }, 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return jsonResponse({ ok: false, message: "Formato de solicitud no válido." }, 415);
  }

  let body: unknown;
  try {
    body = await readBoundedJson(request);
  } catch {
    return jsonResponse({ ok: false, message: "No se han podido leer los datos enviados." }, 400);
  }

  const { payload, fieldErrors } = validatePayload(body);
  if (!payload) {
    const hasFieldErrors = Object.keys(fieldErrors).length > 0;
    return jsonResponse({
      ok: false,
      message: hasFieldErrors ? "Revisa los campos indicados e inténtalo de nuevo." : "No se ha podido procesar la solicitud.",
      ...(hasFieldErrors ? { fieldErrors } : {}),
    }, hasFieldErrors ? 422 : 400);
  }

  if (!env.RESEND_API_KEY) {
    return jsonResponse({ ok: false, message: "El servicio de envío no está disponible temporalmente. Inténtalo más tarde." }, 503);
  }

  const content = emailContent(payload);
  let resendResponse: Response;
  try {
    resendResponse = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `masterdub-information/${payload.submissionId}`,
      },
      body: JSON.stringify({
        from: "MASTER DUB <info@masterdub.es>",
        to: ["info@masterdub.es"],
        reply_to: payload.email,
        subject: "Nueva solicitud de información — MASTER DUB",
        html: content.html,
        text: content.text,
      }),
    });
  } catch {
    return jsonResponse({ ok: false, message: "No hemos podido enviar tu solicitud. Conservamos los datos en pantalla para que puedas intentarlo de nuevo." }, 502);
  }

  if (!resendResponse.ok) {
    return jsonResponse({ ok: false, message: "No hemos podido enviar tu solicitud. Conservamos los datos en pantalla para que puedas intentarlo de nuevo." }, 502);
  }

  return jsonResponse({ ok: true, message: "Tu solicitud se ha enviado correctamente. Nos pondremos en contacto contigo." }, 200);
}
