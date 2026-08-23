export const trainingInterestOptions = [
  { value: "annual", label: "Curso Anual" },
  { value: "intensive", label: "Intensivo Profesional" },
  { value: "general", label: "Información general / Otra consulta" },
] as const;

export const contactPreferenceOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Teléfono" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

export type TrainingInterest = (typeof trainingInterestOptions)[number]["value"] | "";
export type ContactPreference = (typeof contactPreferenceOptions)[number]["value"] | "";

export const informationInterestEvent = "school:information-interest";

export type InformationRequest = {
  schemaVersion: 1;
  fullName: string;
  email: string;
  phone: string;
  trainingInterest: TrainingInterest;
  message: string;
  contactPreference: ContactPreference;
  privacyAccepted: boolean;
  origin: "website";
  createdAt: string | null;
};

export function createEmptyInformationRequest(): InformationRequest {
  return {
    schemaVersion: 1,
    fullName: "",
    email: "",
    phone: "",
    trainingInterest: "",
    message: "",
    contactPreference: "",
    privacyAccepted: false,
    origin: "website",
    createdAt: null,
  };
}

export const informationRequestIntegration = {
  backendConnected: false,
  destination: "Gestión Escuela",
  futureRecordType: "Nuevo contacto / candidato potencial",
  futureFields: [
    "Origen: web",
    "Formación de interés",
    "Datos de contacto",
    "Mensaje",
    "Preferencia de contacto",
    "Fecha",
  ],
} as const;
