"use client";

import { FormEvent, useEffect, useState } from "react";
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

type FormErrors = Partial<Record<"fullName" | "email" | "phone" | "trainingInterest" | "message" | "privacy", string>>;

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <span className="field-error" id={id} role="alert">{message}</span> : null;
}

export function InformationForm() {
  const [request, setRequest] = useState<InformationRequest>(createEmptyInformationRequest);
  const [errors, setErrors] = useState<FormErrors>({});
  const [demoChecked, setDemoChecked] = useState(false);

  useEffect(() => {
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
    setDemoChecked(false);
  }

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};
    if (!request.fullName.trim()) nextErrors.fullName = "Escribe tu nombre y apellidos.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(request.email)) nextErrors.email = "Introduce un email válido.";
    if (request.phone.replace(/\D/g, "").length < 6) nextErrors.phone = "Introduce un teléfono válido.";
    if (!request.trainingInterest) nextErrors.trainingInterest = "Selecciona la formación que te interesa.";
    if (!request.message.trim()) nextErrors.message = "Escribe brevemente tu consulta.";
    if (!request.privacyAccepted) nextErrors.privacy = "Debes aceptar la política de privacidad.";
    return nextErrors;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("#information-form [aria-invalid='true']")?.focus();
      });
      return;
    }

    // DEMO ONLY: no request, persistence, email, or external integration occurs here.
    // A future adapter can map `request` to informationRequestIntegration.futureRecordType.
    if (!informationRequestIntegration.backendConnected) setDemoChecked(true);
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
        <span>He leído y acepto la <a href="/politica-de-privacidad" target="_blank" rel="noreferrer">política de privacidad</a>.</span>
      </label>
      <FieldError id="error-privacy" message={errors.privacy} />

      <div className="information-form-action">
        <button className="button button-dark" type="submit">Comprobar formulario <span>→</span></button>
        <p id="information-form-note">Modo demostración: todavía no existe envío, almacenamiento ni conexión con Gestión Escuela.</p>
      </div>

      {demoChecked && (
        <p className="demo-validation" role="status" aria-live="polite">
          Datos validados en modo demostración. No se ha enviado ni almacenado ninguna información.
        </p>
      )}
    </form>
  );
}
