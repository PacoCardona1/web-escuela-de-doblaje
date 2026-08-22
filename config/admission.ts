export const experienceOptions = [
  { value: "none", label: "Ninguna" },
  { value: "dubbing", label: "Doblaje" },
  { value: "acting", label: "Interpretación / teatro" },
  { value: "voiceover", label: "Locución" },
  { value: "singing", label: "Canto" },
  { value: "vocal-technique", label: "Técnica vocal" },
  { value: "other", label: "Otra" },
] as const;

export const workInterestOptions = [
  { value: "film", label: "Cine" },
  { value: "series", label: "Series" },
  { value: "animation", label: "Animación" },
  { value: "documentaries", label: "Documentales" },
  { value: "videogames", label: "Videojuegos" },
  { value: "advertising", label: "Publicidad / locución" },
  { value: "other", label: "Otros" },
] as const;

export const trainingGoalOptions = [
  { value: "start", label: "Aprender doblaje desde cero" },
  { value: "acting", label: "Mejorar mi interpretación" },
  { value: "voice", label: "Mejorar mi técnica vocal" },
  { value: "complement-acting", label: "Complementar mi formación como actor/actriz" },
  { value: "professional", label: "Prepararme para intentar trabajar profesionalmente" },
  { value: "understand-industry", label: "Conocer cómo funciona realmente el doblaje" },
  { value: "personal", label: "Desarrollo personal / afición" },
  { value: "other", label: "Otro" },
] as const;

export const professionalExpectationOptions = [
  { value: "professional", label: "Sí, me gustaría intentar dedicarme profesionalmente" },
  { value: "explore", label: "Me gustaría explorarlo" },
  { value: "not-primary", label: "No es mi objetivo principal" },
  { value: "unknown", label: "Todavía no lo sé" },
] as const;

export type ExperienceArea = (typeof experienceOptions)[number]["value"];
export type WorkInterest = (typeof workInterestOptions)[number]["value"];
export type TrainingGoal = (typeof trainingGoalOptions)[number]["value"];
export type ProfessionalExpectation = (typeof professionalExpectationOptions)[number]["value"] | "";

export type AdmissionApplication = {
  schemaVersion: 1;
  personal: {
    fullName: string;
    age: string;
    email: string;
    phone: string;
    city: string;
  };
  availability: {
    general: string;
  };
  experience: {
    areas: ExperienceArea[];
    summary: string;
  };
  interests: {
    workTypes: WorkInterest[];
    dreamCharacter: string;
    admiredProfessional: string;
  };
  objectives: {
    trainingGoals: TrainingGoal[];
    professionalExpectation: ProfessionalExpectation;
  };
  pedagogicalProfile: {
    expectedChange: string;
    motivation: string;
    additionalContext: string;
  };
  consent: {
    privacyAccepted: boolean;
  };
  admission: {
    course: "annual";
    source: "website";
    status: "draft" | "received" | "under-review" | "interview" | "admitted" | "waitlisted" | "declined";
    submittedAt: string | null;
  };
};

export function createEmptyAdmissionApplication(): AdmissionApplication {
  return {
    schemaVersion: 1,
    personal: { fullName: "", age: "", email: "", phone: "", city: "" },
    availability: { general: "" },
    experience: { areas: [], summary: "" },
    interests: { workTypes: [], dreamCharacter: "", admiredProfessional: "" },
    objectives: { trainingGoals: [], professionalExpectation: "" },
    pedagogicalProfile: { expectedChange: "", motivation: "", additionalContext: "" },
    consent: { privacyAccepted: false },
    admission: { course: "annual", source: "website", status: "draft", submittedAt: null },
  };
}

export const admissionDemoMode = true;
