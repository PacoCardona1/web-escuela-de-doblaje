"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  AdmissionApplication,
  ExperienceArea,
  ProfessionalExpectation,
  TrainingGoal,
  WorkInterest,
  admissionDemoMode,
  createEmptyAdmissionApplication,
  experienceOptions,
  professionalExpectationOptions,
  trainingGoalOptions,
  workInterestOptions,
} from "../config/admission";

const steps = ["Sobre ti", "Tu experiencia", "Tus gustos", "Tus objetivos", "Para terminar"] as const;
const lastStep = steps.length - 1;

type FormErrors = Record<string, string>;

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <span className="field-error" id={id} role="alert">{message}</span> : null;
}

export function AdmissionForm() {
  const [application, setApplication] = useState<AdmissionApplication>(createEmptyAdmissionApplication);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [demoCompleted, setDemoCompleted] = useState(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const focusStepRef = useRef(false);

  useEffect(() => {
    if (focusStepRef.current) {
      stepHeadingRef.current?.focus();
      focusStepRef.current = false;
    }
  }, [currentStep]);

  function updatePersonal(patch: Partial<AdmissionApplication["personal"]>) {
    setApplication((current) => ({ ...current, personal: { ...current.personal, ...patch } }));
  }

  function updateAvailability(patch: Partial<AdmissionApplication["availability"]>) {
    setApplication((current) => ({ ...current, availability: { ...current.availability, ...patch } }));
  }

  function updateInterests(patch: Partial<AdmissionApplication["interests"]>) {
    setApplication((current) => ({ ...current, interests: { ...current.interests, ...patch } }));
  }

  function updateObjectives(patch: Partial<AdmissionApplication["objectives"]>) {
    setApplication((current) => ({ ...current, objectives: { ...current.objectives, ...patch } }));
  }

  function updatePedagogicalProfile(patch: Partial<AdmissionApplication["pedagogicalProfile"]>) {
    setApplication((current) => ({ ...current, pedagogicalProfile: { ...current.pedagogicalProfile, ...patch } }));
  }

  function toggleExperience(value: ExperienceArea) {
    setApplication((current) => {
      const selected = current.experience.areas;
      const areas = value === "none"
        ? (selected.includes("none") ? [] : ["none"] as ExperienceArea[])
        : selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected.filter((item) => item !== "none"), value];
      return { ...current, experience: { ...current.experience, areas } };
    });
    setErrors((current) => ({ ...current, experienceAreas: "" }));
  }

  function toggleWorkInterest(value: WorkInterest) {
    setApplication((current) => {
      const selected = current.interests.workTypes;
      const workTypes = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
      return { ...current, interests: { ...current.interests, workTypes } };
    });
  }

  function toggleTrainingGoal(value: TrainingGoal) {
    setApplication((current) => {
      const selected = current.objectives.trainingGoals;
      const trainingGoals = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
      return { ...current, objectives: { ...current.objectives, trainingGoals } };
    });
    setErrors((current) => ({ ...current, trainingGoals: "" }));
  }

  function validateStep(step: number): FormErrors {
    const nextErrors: FormErrors = {};

    if (step === 0) {
      if (!application.personal.fullName.trim()) nextErrors.fullName = "Escribe tu nombre y apellidos.";
      if (!application.personal.age.trim() || Number(application.personal.age) <= 0) nextErrors.age = "Indica una edad válida.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.personal.email)) nextErrors.email = "Introduce un email válido.";
      if (application.personal.phone.replace(/\D/g, "").length < 6) nextErrors.phone = "Introduce un teléfono válido.";
      if (!application.personal.city.trim()) nextErrors.city = "Indica tu ciudad o localidad.";
      if (!application.availability.general.trim()) nextErrors.availability = "Cuéntanos brevemente tu disponibilidad.";
    }

    if (step === 1 && application.experience.areas.length === 0) {
      nextErrors.experienceAreas = "Selecciona una opción. Puedes indicar que no tienes experiencia.";
    }

    if (step === 3) {
      if (application.objectives.trainingGoals.length === 0) nextErrors.trainingGoals = "Selecciona al menos un objetivo.";
      if (!application.objectives.professionalExpectation) nextErrors.professionalExpectation = "Selecciona la opción que mejor te representa.";
      if (!application.pedagogicalProfile.expectedChange.trim()) nextErrors.expectedChange = "Cuéntanos qué cambio esperas conseguir.";
    }

    if (step === 4) {
      if (!application.pedagogicalProfile.motivation.trim()) nextErrors.motivation = "Cuéntanos por qué quieres estudiar doblaje.";
      if (!application.consent.privacyAccepted) nextErrors.privacy = "Debes aceptar la política de privacidad para continuar.";
    }

    return nextErrors;
  }

  function focusFirstError() {
    window.requestAnimationFrame(() => {
      const firstInvalid = document.querySelector<HTMLElement>("#admission-form [aria-invalid='true']");
      firstInvalid?.focus();
    });
  }

  function goForward() {
    const nextErrors = validateStep(currentStep);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError();
      return;
    }
    if (currentStep < lastStep) {
      focusStepRef.current = true;
      setCurrentStep((step) => step + 1);
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setErrors({});
      focusStepRef.current = true;
      setCurrentStep((step) => step - 1);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (currentStep < lastStep) {
      goForward();
      return;
    }

    const nextErrors = validateStep(currentStep);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      focusFirstError();
      return;
    }

    // DEMO ONLY: no network request, persistence, email, or external submission occurs here.
    // A future backend adapter can receive `application` without changing the form data model.
    if (admissionDemoMode) setDemoCompleted(true);
  }

  if (demoCompleted) {
    return (
      <div className="admission-confirmation" role="status" aria-live="polite">
        <span className="confirmation-mark" aria-hidden="true"><i /></span>
        <p className="section-kicker">Formulario completado · Modo demostración</p>
        <h3>Demostración<br />completada.</h3>
        <p>Has llegado al final del formulario provisional de admisión.</p>
        <p>Cuando exista un sistema real de envío, este paso confirmará la recepción y explicará cómo continuará el proceso.</p>
        <p className="demo-disclaimer">No se ha enviado ni almacenado ninguna respuesta porque todavía no existe un backend conectado.</p>
        <a className="button button-dark" href="#inicio">Volver al inicio <span>↑</span></a>
      </div>
    );
  }

  return (
    <form className="admission-form" id="admission-form" onSubmit={handleSubmit} noValidate aria-describedby="form-note">
      <div className="admission-progress">
        <p><span>Paso {currentStep + 1}</span> de {steps.length}</p>
        <ol aria-label="Progreso de la solicitud">
          {steps.map((step, index) => (
            <li className={index < currentStep ? "is-complete" : index === currentStep ? "is-current" : ""} key={step} aria-current={index === currentStep ? "step" : undefined} aria-label={`Paso ${index + 1}: ${step}`}>
              <i aria-hidden="true">{index < currentStep ? "✓" : String(index + 1).padStart(2, "0")}</i>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="form-step" key={currentStep}>
        <div className="form-step-heading">
          <p>0{currentStep + 1} · {steps[currentStep]}</p>
          <h3 ref={stepHeadingRef} tabIndex={-1}>{steps[currentStep]}</h3>
        </div>

        {currentStep === 0 && (
          <fieldset>
            <legend className="sr-only">Datos personales y disponibilidad</legend>
            <div className="field-row">
              <label>
                <span>Nombre y apellidos</span>
                <input name="fullName" autoComplete="name" required value={application.personal.fullName} onChange={(event) => updatePersonal({ fullName: event.target.value })} aria-invalid={Boolean(errors.fullName)} aria-describedby={errors.fullName ? "error-fullName" : undefined} />
                <FieldError id="error-fullName" message={errors.fullName} />
              </label>
              <label>
                <span>Edad</span>
                <input name="age" type="number" min="1" max="120" inputMode="numeric" required value={application.personal.age} onChange={(event) => updatePersonal({ age: event.target.value })} aria-invalid={Boolean(errors.age)} aria-describedby={errors.age ? "error-age" : undefined} />
                <FieldError id="error-age" message={errors.age} />
              </label>
            </div>
            <div className="field-row">
              <label>
                <span>Email</span>
                <input name="email" type="email" autoComplete="email" required value={application.personal.email} onChange={(event) => updatePersonal({ email: event.target.value })} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "error-email" : undefined} />
                <FieldError id="error-email" message={errors.email} />
              </label>
              <label>
                <span>Teléfono</span>
                <input name="phone" type="tel" autoComplete="tel" required value={application.personal.phone} onChange={(event) => updatePersonal({ phone: event.target.value })} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "error-phone" : undefined} />
                <FieldError id="error-phone" message={errors.phone} />
              </label>
            </div>
            <label>
              <span>Ciudad / localidad</span>
              <input name="city" autoComplete="address-level2" required value={application.personal.city} onChange={(event) => updatePersonal({ city: event.target.value })} aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? "error-city" : undefined} />
              <FieldError id="error-city" message={errors.city} />
            </label>
            <label>
              <span>Disponibilidad general</span>
              <textarea name="availability" rows={3} required placeholder="Días, franjas horarias o cualquier circunstancia que debamos conocer" value={application.availability.general} onChange={(event) => updateAvailability({ general: event.target.value })} aria-invalid={Boolean(errors.availability)} aria-describedby={errors.availability ? "error-availability" : undefined} />
              <FieldError id="error-availability" message={errors.availability} />
            </label>
          </fieldset>
        )}

        {currentStep === 1 && (
          <fieldset>
            <legend>¿Tienes experiencia previa relacionada con la interpretación o la voz?</legend>
            <p className="question-hint">Puedes seleccionar varias opciones. No es necesario tener experiencia previa.</p>
            <div className="choice-grid" aria-invalid={Boolean(errors.experienceAreas)} tabIndex={errors.experienceAreas ? -1 : undefined} aria-describedby={errors.experienceAreas ? "error-experienceAreas" : undefined}>
              {experienceOptions.map((option) => (
                <label className="choice-option" key={option.value}>
                  <input type="checkbox" name="experienceAreas" value={option.value} checked={application.experience.areas.includes(option.value)} onChange={() => toggleExperience(option.value)} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <FieldError id="error-experienceAreas" message={errors.experienceAreas} />
            <label className="open-question">
              <span>Cuéntanos brevemente tu experiencia o formación previa.</span>
              <textarea name="experienceSummary" rows={5} placeholder="Si no tienes experiencia, puedes dejar este campo vacío" value={application.experience.summary} onChange={(event) => setApplication((current) => ({ ...current, experience: { ...current.experience, summary: event.target.value } }))} />
            </label>
          </fieldset>
        )}

        {currentStep === 2 && (
          <fieldset>
            <legend>¿Qué tipo de trabajos te atraen especialmente?</legend>
            <p className="question-hint">Selecciona todos los que quieras. Este paso nos ayuda a conocerte; sus preguntas son opcionales.</p>
            <div className="choice-grid">
              {workInterestOptions.map((option) => (
                <label className="choice-option" key={option.value}>
                  <input type="checkbox" name="workTypes" value={option.value} checked={application.interests.workTypes.includes(option.value)} onChange={() => toggleWorkInterest(option.value)} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <label className="open-question">
              <span>Si pudieras entrar mañana en una sala de doblaje y doblar cualquier personaje, ¿cuál elegirías y por qué?</span>
              <textarea name="dreamCharacter" rows={4} value={application.interests.dreamCharacter} onChange={(event) => updateInterests({ dreamCharacter: event.target.value })} />
            </label>
            <label className="open-question">
              <span>¿Hay algún actor, actriz de doblaje o intérprete cuyo trabajo te interese especialmente?</span>
              <textarea name="admiredProfessional" rows={3} value={application.interests.admiredProfessional} onChange={(event) => updateInterests({ admiredProfessional: event.target.value })} />
            </label>
          </fieldset>
        )}

        {currentStep === 3 && (
          <fieldset>
            <legend>¿Qué te gustaría conseguir con esta formación?</legend>
            <p className="question-hint">Puedes seleccionar más de un objetivo.</p>
            <div className="choice-grid" aria-invalid={Boolean(errors.trainingGoals)} tabIndex={errors.trainingGoals ? -1 : undefined} aria-describedby={errors.trainingGoals ? "error-trainingGoals" : undefined}>
              {trainingGoalOptions.map((option) => (
                <label className="choice-option" key={option.value}>
                  <input type="checkbox" name="trainingGoals" value={option.value} checked={application.objectives.trainingGoals.includes(option.value)} onChange={() => toggleTrainingGoal(option.value)} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            <FieldError id="error-trainingGoals" message={errors.trainingGoals} />

            <fieldset className="nested-fieldset" aria-invalid={Boolean(errors.professionalExpectation)} tabIndex={errors.professionalExpectation ? -1 : undefined} aria-describedby={errors.professionalExpectation ? "error-professionalExpectation" : undefined}>
              <legend>¿Tienes expectativas profesionales relacionadas con el doblaje?</legend>
              <div className="choice-grid single-choice">
                {professionalExpectationOptions.map((option) => (
                  <label className="choice-option" key={option.value}>
                    <input type="radio" name="professionalExpectation" value={option.value} checked={application.objectives.professionalExpectation === option.value} onChange={() => { updateObjectives({ professionalExpectation: option.value as ProfessionalExpectation }); setErrors((current) => ({ ...current, professionalExpectation: "" })); }} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              <FieldError id="error-professionalExpectation" message={errors.professionalExpectation} />
            </fieldset>

            <label className="open-question">
              <span>¿Qué esperas que haya cambiado en ti después de nueve meses de formación?</span>
              <textarea name="expectedChange" rows={5} required value={application.pedagogicalProfile.expectedChange} onChange={(event) => updatePedagogicalProfile({ expectedChange: event.target.value })} aria-invalid={Boolean(errors.expectedChange)} aria-describedby={errors.expectedChange ? "error-expectedChange" : undefined} />
              <FieldError id="error-expectedChange" message={errors.expectedChange} />
            </label>
          </fieldset>
        )}

        {currentStep === 4 && (
          <fieldset>
            <legend className="sr-only">Motivación y privacidad</legend>
            <label className="open-question first-question">
              <span>¿Por qué quieres estudiar doblaje?</span>
              <textarea name="motivation" rows={6} required value={application.pedagogicalProfile.motivation} onChange={(event) => updatePedagogicalProfile({ motivation: event.target.value })} aria-invalid={Boolean(errors.motivation)} aria-describedby={errors.motivation ? "error-motivation" : undefined} />
              <FieldError id="error-motivation" message={errors.motivation} />
            </label>
            <label className="open-question">
              <span>¿Hay algo más que consideres importante que sepamos antes de conocerte?</span>
              <textarea name="additionalContext" rows={5} value={application.pedagogicalProfile.additionalContext} onChange={(event) => updatePedagogicalProfile({ additionalContext: event.target.value })} />
            </label>
            <label className="check-field privacy-check">
              <input type="checkbox" name="privacyAccepted" required checked={application.consent.privacyAccepted} onChange={(event) => { setApplication((current) => ({ ...current, consent: { privacyAccepted: event.target.checked } })); setErrors((current) => ({ ...current, privacy: "" })); }} aria-invalid={Boolean(errors.privacy)} aria-describedby={errors.privacy ? "error-privacy" : undefined} />
              <span>He leído y acepto la <a href="/politica-de-privacidad" target="_blank" rel="noreferrer">política de privacidad</a>.</span>
            </label>
            <FieldError id="error-privacy" message={errors.privacy} />
          </fieldset>
        )}

        <div className="form-actions">
          {currentStep > 0 ? <button className="form-back" type="button" onClick={goBack}>← Volver</button> : <span />}
          {currentStep < lastStep
            ? <button className="button button-dark" type="button" onClick={goForward}>Continuar <span>→</span></button>
            : <button className="button button-dark" type="submit">Finalizar demostración <span>→</span></button>}
        </div>
      </div>

      <p className="demo-form-note" id="form-note">Modo demostración: tus respuestas se conservan al avanzar y retroceder, pero todavía no se envían ni se almacenan.</p>
    </form>
  );
}
