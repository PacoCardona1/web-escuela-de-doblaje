export type SocialNetwork = "instagram" | "tiktok" | "facebook" | "youtube";

const siteLocation = "Sevilla";

export const siteConfig = {
  brand: {
    name: "Escuela de Doblaje",
    shortName: "ED",
    status: "provisional",
    logo: null,
    favicon: "/favicon.svg",
  },
  location: siteLocation,
  description:
    `Formación práctica de doblaje en ${siteLocation}: trabajo ante el atril, dirección y seguimiento individual en grupos reducidos.`,
  annualCourse: {
    period: "Octubre — Junio",
    weeklySchedule: "1 día por semana",
    classDuration: "3 horas por clase",
    groupSize: "Máximo 8 alumnos",
    access: "Entrevista previa",
    areas: [
      "Interpretación",
      "Sincronía",
      "Técnica de atril",
      "Personajes y registros",
      "Recepción y aplicación de indicaciones",
      "Adaptación progresiva al ritmo profesional",
      "Técnica vocal cuando resulte necesario",
    ],
  },
  contact: {
    email: "",
    phone: "",
    address: "",
  },
  studentAccess: {
    label: "Acceso alumnos",
    pendingLabel: "Próximamente",
    url: "" as string,
  },
  social: {
    instagram: "",
    tiktok: "",
    facebook: "",
    youtube: "",
  } as Record<SocialNetwork, string>,
  legal: {
    owner: "",
    taxId: "",
  },
} as const;
