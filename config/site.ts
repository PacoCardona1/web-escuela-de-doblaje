export type SocialNetwork = "instagram" | "tiktok" | "facebook" | "youtube";

const siteLocation = "Sevilla";

export const siteConfig = {
  brand: {
    name: "MASTER DUB",
    shortName: "MASTER DUB",
    descriptor: `Escuela de Doblaje · ${siteLocation}`,
    signature: "Por Paco Cardona",
    domain: "masterdub.es",
    logo: {
      symbol: {
        light: "/brand/master-dub-symbol-light.png",
        dark: "/brand/master-dub-symbol-dark.png",
      },
      wordmark: {
        light: "/brand/master-dub-wordmark-light.png",
        dark: "/brand/master-dub-wordmark-dark.png",
      },
      full: {
        light: "/brand/master-dub-logo-light.png",
        dark: "/brand/master-dub-logo-dark.png",
      },
    },
    favicon: "/brand/master-dub-symbol-dark.png",
  },
  location: siteLocation,
  description:
    `Formación práctica de doblaje en ${siteLocation}: trabajo ante el atril, dirección y seguimiento individual en grupos reducidos.`,
  annualCourse: {
    period: "Octubre — Junio",
    weeklySchedule: "1 día por semana",
    classDuration: "3 horas por clase",
    groupSize: "Grupos muy reducidos",
    access: "Entrevista previa",
    areas: [
      "Interpretación",
      "Sincronía",
      "Técnica de atril",
      "Personajes y registros",
      "Recepción y aplicación de indicaciones",
      "Técnica vocal",
      "Adaptación progresiva al ritmo profesional",
    ],
  },
  contact: {
    email: "info@masterdub.es",
    emailOperational: false,
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
