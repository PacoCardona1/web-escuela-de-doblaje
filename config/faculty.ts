export type FacultyType = "direccion" | "profesorado-estable" | "invitado";

export type FacultyProfile = {
  name: string;
  role: string;
  photo: string;
  photoAlt: string;
  photoPosition: string;
  introduction: string;
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
  direccion: "Dirección de la escuela",
  "profesorado-estable": "Profesorado estable",
  invitado: "Profesional invitado",
};

export const facultyConfig = {
  profiles: [
    {
      name: "Paco Cardona",
      role: "Director de doblaje · Actor · Creador y director de la escuela",
      photo: "/images/studio-session-1.jpg",
      photoAlt: "Fotografía provisional que no representa a Paco Cardona",
      photoPosition: "28% center",
      introduction:
        "La escuela nace desde la experiencia profesional en sala, con una formación conectada a la práctica y a la realidad cotidiana del doblaje.",
      type: "direccion",
    },
    {
      name: "Ahimsa Sánchez",
      role: "Actriz de doblaje · Profesora del Curso Anual",
      photo: "/images/studio-session-2.jpg",
      photoAlt: "Fotografía provisional que no representa a Ahimsa Sánchez",
      photoPosition: "68% center",
      introduction:
        "Forma parte estable de la formación anual y del seguimiento práctico del alumnado durante su trabajo y evolución en sala.",
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
