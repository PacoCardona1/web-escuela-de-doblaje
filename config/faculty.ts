export type FacultyType = "direccion" | "profesorado-estable" | "invitado";

export type FacultyProfile = {
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  photoPosition: string;
  introduction: string;
  website: { label: string; href: string } | null;
  type: FacultyType;
};

export type InvitedProfile = {
  id: string;
  name: string;
  specialty: string;
  label?: string;
  photo: string | null;
  photoAlt: string;
  photoPosition: string;
  type: "invitado";
};

export const facultyTypeLabels: Record<FacultyType, string> = {
  direccion: "Dirección de MASTER DUB",
  "profesorado-estable": "Profesorado estable",
  invitado: "Profesional invitado",
};

export const facultyConfig = {
  placeholderPhoto: "/images/faculty-placeholder-pixelated.webp",
  profiles: [
    {
      name: "Paco Cardona",
      role: "Actor, ajustador y director de doblaje en activo.",
      photo: "/images/paco-cardona.webp",
      photoAlt: "Paco Cardona trabajando ante un atril y un micrófono",
      photoPosition: "center 42%",
      introduction: "Más de 30 años de experiencia profesional.",
      website: { label: "pacocardona.com", href: "https://pacocardona.com" },
      type: "direccion",
    },
    {
      name: "Ahimsa Sánchez",
      role: "Actriz, ajustadora y directora de doblaje en activo.",
      photo: "/images/ahimsa-sanchez.webp",
      photoAlt: "Ahimsa Sánchez trabajando ante un atril y un micrófono",
      photoPosition: "center 45%",
      introduction: "Más de 30 años de experiencia profesional.",
      website: null,
      type: "profesorado-estable",
    },
  ] satisfies FacultyProfile[],
  invited: {
    title: "Profesionales invitados",
    introduction:
      "Determinadas sesiones podrán contar con profesionales especializados en áreas concretas del trabajo vocal, interpretativo o técnico.",
    profiles: [] as InvitedProfile[],
    placeholders: ["01", "02", "03", "04"],
  },
} as const;
