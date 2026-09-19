export type TalentDirectoryLifecycle = {
  isSchoolStudent: boolean;
  isIntensiveParticipant: boolean;
  isReadyForDirectory: boolean;
  hasVoluntaryDirectoryConsent: boolean;
  isPublicProfileEnabled: boolean;
};

export type FutureTalentProfile = {
  professionalName: string;
  photo: string | null;
  vocalProfile: string;
  languagesAndAccents: string[];
  demos: Array<{ title: string; url: string }>;
  specialties: string[];
  professionalContact: string;
  publicationAuthorized: boolean;
};

export const intensiveConfig = {
  name: "MASTER DUB",
  director: "Paco Cardona",
  eyebrow: "MASTER DUB · Paco Cardona",
  headline: "No vienes a clase. Vienes a doblar.",
  introduction:
    "Una experiencia inmersiva para personas con formación previa, planteada para acercar su trabajo a la dinámica de una convocatoria profesional de doblaje.",
  eligibility: "No es formación de iniciación · Entrevista y valoración previa",
  facts: [
    { label: "Participantes", value: "2" },
    { label: "Jornadas", value: "2" },
    { label: "Por jornada", value: "3 horas" },
    { label: "Trabajo total", value: "6 horas" },
  ],
  preparation: {
    eyebrow: "Antes de entrar en sala",
    title: "El trabajo se prepara para ti.",
    description:
      "Antes de comenzar analizamos el punto de partida de cada participante y preparamos convocatorias y personajes adecuados a su perfil.",
    criteria: ["Experiencia", "Voz", "Registro", "Necesidades", "Capacidades", "Aspectos a trabajar"],
    principle: "No trabajas una colección de ejercicios genéricos.",
  },
  work: {
    eyebrow: "Durante la experiencia",
    title: "Aquí no vienes a esperar tu turno. Vienes a trabajar.",
    description:
      "Las seis horas están organizadas para maximizar el trabajo efectivo en el atril, alternando a los dos participantes con ritmo y dirección constante.",
    dynamics: ["Muchos takes", "Corrección inmediata", "Repetición", "Concentración", "Ritmo", "Exigencia profesional"],
    genres: ["Película", "Serie", "Animación", "Documental", "Otros formatos adecuados"],
    adaptation:
      "Personajes y materiales seleccionados según la voz, la edad, el registro y las necesidades de cada participante.",
  },
  direction: {
    title: "Sabes quién va a analizarte, dirigirte y corregirte.",
    description:
      "Paco Cardona supervisa y dirige la experiencia desde más de 30 años de actividad continua y demostrable como actor y director de doblaje.",
  },
  outcome: {
    eyebrow: "Al finalizar",
    title: "Una valoración profesional y precisa.",
    description:
      "Revisaremos tus capacidades, fortalezas, los aspectos que debes seguir trabajando y una posible aproximación progresiva al entorno profesional.",
    assessment: ["Capacidades", "Fortalezas", "Aspectos a trabajar", "Orientación profesional"],
    accreditation: "Acreditación MASTER DUB",
    observerNote:
      "La acreditación podrá permitir la asistencia como oyente a un trabajo real únicamente si existe una sesión adecuada, hay disponibilidad, las circunstancias de producción lo permiten y es posible admitir oyentes.",
    disclaimer: "La formación no implica trabajo, representación ni contratación.",
  },
  access: {
    cta: "Solicita información sobre MASTER DUB",
    href: "/?formacion=intensivo#informacion",
    availability: "Solo 2 participantes por edición",
  },
} as const;

export const talentDirectoryArchitecture = {
  backendConnected: false,
  managementPlatformConnected: false,
  stages: [
    "Alumno de la formación anual",
    "Participante de MASTER DUB",
    "Perfil considerado preparado para directorio",
    "Consentimiento voluntario para formar parte del directorio",
    "Perfil público o promocionable",
  ],
  profileFields: [
    "Nombre profesional",
    "Fotografía",
    "Perfil vocal",
    "Idiomas o acento, si procede",
    "Demos",
    "Especialidades",
    "Contacto profesional",
    "Autorización de publicación",
  ],
  rule:
    "Participar en una formación no implica aparecer en el directorio ni autoriza la publicación del perfil.",
} as const;
