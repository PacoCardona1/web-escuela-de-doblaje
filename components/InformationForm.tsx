"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ContactPreference,
  InformationRequest,
  TrainingInterest,
  contactPreferenceOptions,
  createEmptyInformationRequest,
  informationInterestEvent,
  informationRequestIntegration,
  trainingInterestOptions,
} from "../config/information";
import { siteConfig } from "../config/site";

type FormErrors = Partial<Record<"fullName" | "email" | "phone" | "trainingInterest" | "message" | "privacy", string>>;
type SubmissionStatus = "idle" | "submitting" | "success" | "error";

type SubmissionResponse = {
  ok: boolean;
  message?: string;
  fieldErrors?: FormErrors;
};

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <span className="field-error" id={id} role="alert">{message}</span> : null;
}

export function InformationForm() {
  const [request, setRequest] = useState<InformationRequest>(createEmptyInformationRequest);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const formStartedAt = useRef(0);
  const submissionId = useRef<string | null>(null);

  useEffect(() => {
    formStartedAt.current = Date.now();

    function selectRequestedTraining(event: Event) {
      const interest = (event as CustomEvent<TrainingInterest>).detail;
      if (interest) setRequest((current) => ({ ...current, trainingInterest: interest }));
    }

    window.addEventListener(informationInterestEvent, selectRequestedTraining);
    const requestedTraining = new URLSearchParams(window.location.search).get("formacion");
    const frame = requestedTraining === "intensivo"
      ? window.requestAnimationFrame(() => {
        setRequest((current) => ({ ...current, trainingInterest: "intensive" }));
        document.getElementById("informacion")?.scrollIntoView();
      })
      : null;

    return () => {
      window.removeEventListener(informationInterestEvent, selectRequestedTraining);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  function update(patch: Partial<InformationRequest>) {
    setRequest((current) => ({ ...current, ...patch }));
    setStatus("idle");
    setStatusMessage("");
    submissionId.current = null;
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!request.fullName.trim()) nextErrors.fullName = "Escribe tu nombre y apellidos.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) nextErrors.email = "Introduce un email válido.";
    if (request.phone.replace(/\D/g, "").length < 6) nextErrors.phone = "Introduce un teléfono válido.";
    if (!request.trainingInterest) nextErrors.trainingInterest = "Selecciona la formación que te interesa.";
    if (!request.message.trim()) nextErrors.message = "Escribe brevemente tu consulta.";
    if (!request.privacyAccepted) nextErrors.privacy = "Debes confirmar que has leído la información de privacidad.";
    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting" || status === "success") return;

    const form = event.currentTarget;
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("#information-form [aria-invalid='true']")?.focus();
      });
      return;
    }

    setStatus("submitting");
    setStatusMessage("");
    submissionId.current ??= crypto.randomUUID();

    try {
      const response = await fetch("/api/information-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...request,
          company: String(new FormData(form).get("company") ?? ""),
          formStartedAt: formStartedAt.current,
          submissionId: submissionId.current,
        }),
      });
      const result = await response.json() as SubmissionResponse;

      if (!response.ok || !result.ok) {
        if (result.fieldErrors) setErrors(result.fieldErrors);
        setStatus("error");
        setStatusMessage(result.message ?? "No hemos podido enviar tu solicitud. Inténtalo de nuevo.");
        return;
      }

      setRequest(createEmptyInformationRequest());
      setErrors({});
      setStatus("success");
      setStatusMessage(result.message ?? "Tu solicitud se ha enviado correctamente.");
      formStartedAt.current = Date.now();
    } catch {
      setStatus("error");
      setStatusMessage("No hemos podido conectar con el servicio de envío. Tus datos siguen en el formulario para que puedas intentarlo de nuevo.");
    }
  }

  return (
    <form className="information-form" id="information-form" onSubmit={handleSubmit} noValidate aria-describedby="information-form-note">
      <div className="information-form-heading">
        <p>Formulario único · Información</p>
        <h3>Cuéntanos<br />qué necesitas.</h3>
      </div>

      <div className="field-row">
        <label>
          <span>Nombre y apellidos</span>
          <input name="fullName" autoComplete="name" required value={request.fullName} onChange={(event) => update({ fullName: event.target.value })} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "error-fullName" : undefined} />
          <FieldError id="error-fullName" message={errors.fullName} />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" required value={request.email} onChange={(event) => update({ email: event.target.value })} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "error-email" : undefined} />
          <FieldError id="error-email" message={errors.email} />
        </label>
      </div>

      <div className="field-row">
        <label>
          <span>Teléfono</span>
          <input name="phone" type="tel" autoComplete="tel" required value={request.phone} onChange={(event) => update({ phone: event.target.value })} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "error-phone" : undefined} />
          <FieldError id="error-phone" message={errors.phone} />
        </label>
        <label>
          <span>Formación que te interesa</span>
          <select name="trainingInterest" required value={request.trainingInterest} onChange={(event) => update({ trainingInterest: event.target.value as TrainingInterest })} aria-invalid={Boolean(errors.trainingInterest)} aria-describedby={errors.trainingInterest ? "error-trainingInterest" : undefined}>
            <option value="">Selecciona una opción</option>
            {trainingInterestOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
          <FieldError id="error-trainingInterest" message={errors.trainingInterest} />
        </label>
      </div>

      <label>
        <span>Mensaje</span>
        <textarea name="message" rows={5} required placeholder="Cuéntanos brevemente qué información necesitas" value={request.message} onChange={(event) => update({ message: event.target.value })} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "error-message" : undefined} />
        <FieldError id="error-message" message={errors.message} />
      </label>

      <label className="honeypot-field" aria-hidden="true">
        <span>Empresa</span>
        <input name="company" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      <fieldset className="contact-preference">
        <legend>Prefiero que me contactéis por <small>Opcional</small></legend>
        <div>
          {contactPreferenceOptions.map((option) => (
            <label key={option.value}>
              <input type="radio" name="contactPreference" value={option.value} checked={request.contactPreference === option.value} onChange={() => update({ contactPreference: option.value as ContactPreference })} />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="check-field privacy-check">
        <input type="checkbox" name="privacyAccepted" required checked={request.privacyAccepted} onChange={(event) => update({ privacyAccepted: event.target.checked })} aria-invalid={Boolean(errors.privacy)} aria-describedby={errors.privacy ? "error-privacy" : undefined} />
        <span>He leído la información sobre protección de datos y la <a href="/politica-de-privacidad" target="_blank" rel="noreferrer">política de privacidad</a>.</span>
      </label>
      <FieldError id="error-privacy" message={errors.privacy} />

      <div className="privacy-layer" aria-label="Información básica sobre protección de datos">
        <p><strong>Responsable</strong><span>{siteConfig.legal.owner}</span></p>
        <p><strong>Finalidad</strong><span>Atender y gestionar tu solicitud de información.</span></p>
        <p><strong>Legitimación</strong><span>Medidas precontractuales solicitadas o consentimiento, según la consulta.</span></p>
        <p><strong>Destinatarios</strong><span>Proveedores necesarios para prestar el servicio y autoridades cuando exista obligación legal.</span></p>
        <p><strong>Derechos</strong><span>Acceso, rectificación, supresión, oposición, limitación y portabilidad cuando proceda, escribiendo a {siteConfig.legal.privacyEmail}.</span></p>
        <a href="/politica-de-privacidad" target="_blank" rel="noreferrer">Información adicional en la Política de Privacidad</a>
      </div>

      <div className="information-form-action">
        <button className="button button-dark" type="submit" disabled={status === "submitting" || status === "success"}>
          {status === "submitting" ? "Enviando…" : status === "success" ? "Solicitud enviada" : "Enviar solicitud"} <span>→</span>
        </button>
        <p id="information-form-note">La solicitud se enviará a {informationRequestIntegration.destination}. No se utilizará para publicidad ni boletines.</p>
      </div>

      {status !== "idle" && status !== "submitting" && (
        <p className={`form-status form-status-${status}`} role={status === "error" ? "alert" : "status"} aria-live="polite">
          {statusMessage}
        </p>
      )}
    </form>
  );
}
