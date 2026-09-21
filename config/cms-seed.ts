import { facultyConfig } from "./faculty";
import { intensiveConfig } from "./intensive";
import { mediaConfig } from "./media";
import { siteConfig } from "./site";

export type CmsSeedRecord = {
  collection: string;
  id: string;
  slug?: string | null;
  data: Record<string, unknown>;
  protected?: boolean;
  visible?: boolean;
  order?: number;
};

export const cmsSeedRecords: CmsSeedRecord[] = [
  {
    collection: "settings", id: "site", protected: true, data: {
      name: siteConfig.brand.name, descriptor: siteConfig.brand.descriptor, strapline: siteConfig.brand.strapline, logo: siteConfig.brand.logo,
      email: siteConfig.contact.email, phone: siteConfig.contact.phone, address: siteConfig.contact.address,
      instagram: "https://www.instagram.com/masterdub.es/", tiktok: "https://www.tiktok.com/@masterdub.es",
      youtube: "https://www.youtube.com/@masterdub_es", seoTitle: `${siteConfig.brand.name} | ${siteConfig.brand.descriptor}`,
      seoDescription: siteConfig.description, socialImage: "/og.png",
    },
  },
  {
    collection: "home", id: "hero", order: 10, protected: true, data: {
      label: "Hero", eyebrow: siteConfig.brand.descriptor, title: "Aprende doblaje.",
      titleEmphasis: "Trabaja como se trabaja en sala.",
      body: "Formación ante el atril, dentro del entorno profesional del doblaje y bajo la dirección de profesionales en activo.",
      primaryButton: "Solicita información", primaryHref: "#informacion", secondaryButton: "En sala", secondaryHref: "#en-sala",
      image: mediaConfig.images.hero,
    },
  },
  {
    collection: "home", id: "master-dub", order: 20, protected: true,
    data: { label: "MASTER DUB", ...intensiveConfig, image: mediaConfig.images.masterDub, lanyard: mediaConfig.images.masterDubLanyard },
  },
  {
    collection: "home", id: "annual", order: 30, protected: true, data: {
      label: "Formación Anual", kicker: "02 · Formación anual", title: "Construye una base sólida desde el atril.",
      lead: ["Para quienes todavía no han trabajado profesionalmente en doblaje o necesitan consolidar su base con tiempo, práctica y seguimiento.", "Cada alumno trabaja con material adaptado progresivamente a su edad, voz, registro, evolución, fortalezas y dificultades."],
      purpose: "Cada take tiene un propósito formativo.", principles: ["Trabajo desde el atril", "Dirección profesional", "Material seleccionado", "Seguimiento individual"],
      facts: { ...siteConfig.annualCourse, access: "Entrevista y valoración previa · Plazas limitadas" }, areas: siteConfig.annualCourse.areas,
      cta: "Solicita información", href: "#informacion", image: mediaConfig.images.annualCourse,
    },
  },
  {
    collection: "home", id: "facilities", order: 40, protected: true,
    data: { label: "Instalaciones", ...mediaConfig.facilities, images: [mediaConfig.images.facilitiesRoom, mediaConfig.images.facilitiesWorkstation, mediaConfig.images.facilitiesConsole] },
  },
  {
    collection: "home", id: "professionals", order: 50, protected: true,
    data: { label: "Profesionales", title: "Dirección conocida. Seguimiento cercano.", invitedTitle: facultyConfig.invited.title, invitedIntroduction: facultyConfig.invited.introduction },
  },
  {
    collection: "home", id: "studio", order: 60, protected: true,
    data: { label: "En Sala", kicker: "05 · En sala", title: "Así se trabaja.", description: "Aquí irán los vídeos que muestran cómo se trabaja. Próximamente se sustituirá el material provisional por imágenes reales de MASTER DUB.", videos: mediaConfig.videos },
  },
  {
    collection: "home", id: "talents", order: 70, protected: true, visible: false,
    data: { label: "Talentos", title: "Talentos MASTER DUB", body: "Perfiles profesionales destacados.", button: "Descubre Talentos MASTER DUB" },
  },
  {
    collection: "home", id: "news", order: 80, protected: true, visible: false,
    data: { label: "Noticias", title: "Actualidad MASTER DUB", body: "Noticias destacadas de la escuela." },
  },
  {
    collection: "home", id: "information", order: 90, protected: true,
    data: { label: "Información / Contacto", kicker: "06 · Información", title: "Solicita información.", body: "Cuéntanos qué formación te interesa. Este formulario no inicia una admisión, una valoración ni una matrícula." },
  },
  {
    collection: "home", id: "footer", order: 100, protected: true,
    data: { label: "Footer", descriptor: siteConfig.brand.descriptor, signature: siteConfig.brand.signature, email: siteConfig.contact.email },
  },
  ...facultyConfig.profiles.map((profile, index) => ({
    collection: "professionals", id: index === 0 ? "paco-cardona" : "ahimsa-sanchez", order: index + 1,
    protected: true, data: { ...profile, visible: true },
  })),
  ...facultyConfig.invited.placeholders.map((label, index) => ({
    collection: "professionals", id: `invitado-${index + 1}`, order: 100 + index,
    data: { name: "Por confirmar", role: "Profesional invitado", introduction: "", photo: "", photoAlt: "", photoPosition: "center 38%", website: null, links: [], type: "invitado", placeholderLabel: label },
  })),
];
