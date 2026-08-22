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

const intensiveDirector = "Paco Cardona";

export const intensiveConfig = {
  name: `Intensivo Profesional de ${intensiveDirector}`,
  director: intensiveDirector,
  headline: {
    lines: ["Dos días.", "Dos alumnos."],
    emphasis: "Una convocatoria diseñada para ti.",
  },
  introduction:
    "Una experiencia de formación avanzada para personas con formación o experiencia previa que quieren acercar su trabajo a las condiciones reales de la profesión.",
  eligibility: "Requiere formación o experiencia previa",
  facts: [
    { label: "Duración", value: "2 días" },
    { label: "Trabajo total", value: "16 horas" },
    { label: "Formato", value: "4 jornadas de 4 horas" },
    { label: "Grupo", value: "Máximo 2 participantes" },
    { label: "Acceso", value: "Prueba previa" },
  ],
  assessment: {
    title: "Antes de entrar en sala",
    introduction:
      "El intensivo comienza con un análisis individual para comprender desde dónde trabaja cada participante y qué necesita desarrollar.",
    criteria: [
      "Características de su voz",
      "Cualidades interpretativas",
      "Experiencia previa",
      "Fortalezas",
      "Aspectos que necesita desarrollar",
    ],
    principle: "No todos los participantes trabajan exactamente el mismo material.",
    conclusion:
      "A partir de este punto se diseña una convocatoria adaptada al perfil y a las necesidades de cada participante.",
  },
  callSheet: {
    title: "Una convocatoria diseñada para ti",
    introduction:
      "El participante recibe personaje y material de trabajo de forma similar a una convocatoria profesional. La variedad permite observar cómo responde ante registros, ritmos y situaciones diferentes.",
    genres: ["Cine", "Series", "Animación", "Publicidad", "Documental"],
    registers: ["Comedia", "Drama", "Personajes", "Situaciones"],
  },
  days: [
    {
      id: "01",
      label: "Día 1",
      title: "Conocer, ajustar, preparar",
      introduction:
        "Una primera jornada flexible para conocer el perfil, aproximarse al personaje y empezar a tomar decisiones ante el atril.",
      steps: [
        "Toma de contacto y análisis del perfil",
        "Asignación y aproximación al personaje",
        "Interpretación, sincronía y primeras escenas",
        "Detección de fortalezas y aspectos a trabajar",
        "Correcciones individualizadas",
      ],
    },
    {
      id: "02",
      label: "Día 2",
      title: "Trabajar como en una convocatoria",
      introduction:
        "La exigencia aumenta: el material está preparado, el personaje asignado y el trabajo se acerca al ritmo de una convocatoria profesional.",
      steps: [
        "Trabajo ante atril y dirección",
        "Correcciones y repetición",
        "Ritmo y resolución de escenas",
        "Adaptación a diferentes géneros",
        "Aplicación de indicaciones con mayor autonomía",
      ],
      statement: "Hoy has venido a trabajar.",
    },
  ],
  direction: {
    title: "Dirección profesional",
    introduction:
      `Todo el proceso está supervisado por ${intensiveDirector}, que acompaña el trabajo y aumenta progresivamente la exigencia de cada participante.`,
    responsibilities: [
      "Observar cómo trabaja",
      "Detectar fortalezas",
      "Identificar aspectos que debe mejorar",
      "Dirigir escenas",
      "Aumentar progresivamente la exigencia",
      "Ofrecer feedback individualizado",
    ],
  },
  afterAtril: {
    title: "Después del atril",
    introduction:
      "La experiencia no termina al finalizar las 16 horas. El participante recibe orientación para aproximarse a sus primeros pasos profesionales con expectativas realistas.",
    guidance: [
      "Cómo afrontar los primeros pasos",
      "Cómo presentarse",
      "Qué material profesional puede necesitar",
      "Qué aspectos debería seguir trabajando",
      "Qué expectativas son realistas dentro del sector",
    ],
    disclaimer: "La formación no implica trabajo, representación ni contratación.",
  },
  directory: {
    title: "Tu formación no termina al salir de la sala.",
    description:
      "Si su perfil está preparado y desea formar parte de él, el participante podrá incorporarse voluntariamente al futuro directorio de talento de la escuela, creado para dar visibilidad a nuevas voces ante estudios, directores y otros profesionales del sector.",
    status: "Directorio pendiente de desarrollo y conexión con la plataforma de gestión de la escuela.",
  },
  access: {
    cta: "Solicitar prueba de acceso",
    href: "#intensive-access",
    title: "Prueba de acceso al Intensivo Profesional",
    description:
      "Este proceso tendrá un formulario propio para conocer la formación previa, la experiencia y los objetivos del candidato.",
    availability: "Máximo 2 participantes por edición",
    status: "Formulario específico pendiente de activar",
  },
} as const;

export const talentDirectoryArchitecture = {
  backendConnected: false,
  managementPlatformConnected: false,
  stages: [
    "Alumno de la escuela",
    "Participante del Intensivo Profesional",
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
    "Participar en el curso no implica aparecer en el directorio ni autoriza la publicación del perfil.",
} as const;
