export type ImageAsset = {
  src: string;
  alt: string;
  position: string;
  mobilePosition?: string;
  credit?: string;
};

type WorkVideoDetails = {
  id: string;
  poster: ImageAsset | null;
  title: string;
  description: string;
  duration: string | null;
  accessibilityLabel: string;
};

export type WorkVideo = WorkVideoDetails & (
  | { src: null; captions: null }
  | { src: string; captions: string }
);

export type Testimonial = {
  id: string;
  name: string;
  photo?: ImageAsset | null;
  courseEdition: string;
  comment: string;
  highlight?: string;
};

export const mediaConfig = {
  images: {
    hero: {
      src: "/images/hero-lab-intimate-room.jpg",
      alt: "",
      position: "50% 50%",
      mobilePosition: "77% 50%",
    },
    annualCourse: {
      src: "/images/recording-words-annual-course.jpg",
      alt: "Sala de control y cabina de doblaje de Recording Words en Sevilla",
      position: "55% center",
      credit: "Recording Words · Sevilla",
    },
    methodology: {
      src: "/images/recording-words-methodology.jpg",
      alt: "Control profesional de Recording Words con mesa, monitores y ventana hacia la cabina",
      position: "center center",
      credit: "Recording Words · Sevilla",
    },
    intensive: {
      src: "/images/recording-words-facilities-booth.jpg",
      alt: "Atril y micrófono profesional en una cabina de Recording Words",
      position: "center center",
      credit: "Recording Words · Sevilla",
    },
    workDetail: {
      src: "/images/recording-words-microphone-detail.jpg",
      alt: "Detalle de micrófono, filtro antipop y atril con iPad en Recording Words",
      position: "50% 48%",
    },
    facilitiesRoom: {
      src: "/images/recording-words-intensive.jpg",
      alt: "Sala de doblaje de Recording Words con atril, pantalla y vista hacia control",
      position: "58% center",
    },
    facilitiesWorkstation: {
      src: "/images/recording-words-facilities-room.jpg",
      alt: "Puesto de doblaje con atril, pantalla y equipamiento profesional en Recording Words",
      position: "62% center",
    },
    facilitiesConsole: {
      src: "/images/recording-words-facilities-console.jpg",
      alt: "Detalle de la mesa de mezclas y monitores del control de Recording Words",
      position: "center center",
    },
  } satisfies Record<string, ImageAsset>,
  facilities: {
    eyebrow: "Instalaciones",
    title: "Aprende en un estudio de doblaje profesional",
    description:
      "Las clases de Master Dub se imparten en las instalaciones de Recording Words, estudio profesional de doblaje en activo.",
    collaboration: "En colaboración con Recording Words",
  },
  videos: [
    {
      id: "01",
      src: null,
      poster: null,
      captions: null,
      title: "Trabajo ante el atril",
      description: "Fragmento de clase",
      duration: null,
      accessibilityLabel: "Trabajo ante el atril. Vídeo pendiente de incorporar.",
    },
    {
      id: "02",
      src: null,
      poster: null,
      captions: null,
      title: "Dirección y correcciones",
      description: "Dinámica en sala",
      duration: null,
      accessibilityLabel: "Dirección y correcciones. Vídeo pendiente de incorporar.",
    },
    {
      id: "03",
      src: null,
      poster: null,
      captions: null,
      title: "Ritmo real de trabajo",
      description: "Proceso completo",
      duration: null,
      accessibilityLabel: "Ritmo real de trabajo. Vídeo pendiente de incorporar.",
    },
  ] as WorkVideo[],
  testimonials: [] as Testimonial[],
  testimonialPlaceholders: [
    { id: "01", label: "Voz de antiguo alumno", status: "Testimonio real pendiente" },
    { id: "02", label: "Voz de antiguo alumno", status: "Testimonio real pendiente" },
    { id: "03", label: "Voz de antiguo alumno", status: "Testimonio real pendiente" },
  ],
  credits: ["Recording Words · instalaciones", "material provisional identificado en profesorado"],
};
