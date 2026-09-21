export type SocialNetwork = "instagram" | "tiktok" | "youtube";

const siteLocation = "Sevilla";

export const siteConfig = {
  brand: {
    name: "MASTER DUB",
    shortName: "MASTER DUB",
    descriptor: `Formación de Doblaje · ${siteLocation}`,
    signature: "Por Paco Cardona",
    strapline: "FORMACIÓN PROFESIONAL DE DOBLAJE",
    domain: "masterdub.es",
    logo: "/brand/master-dub-official-final.png",
    favicon: "/brand/master-dub-symbol-official.png",
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
    instagram: "https://www.instagram.com/masterdub.es/",
    tiktok: "https://www.tiktok.com/@masterdub.es",
    youtube: "https://www.youtube.com/@masterdub_es",
  } as Record<SocialNetwork, string>,
  legal: {
    owner: "Francisco Martínez Cardona",
    taxId: "28902026L",
    address: "Avenida de Astronomía 1, Torre 3, Planta 7, módulo 12, 41015 Sevilla, España",
    privacyEmail: "info@masterdub.es",
  },
} as const;
