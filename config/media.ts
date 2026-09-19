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
      src: "/images/masterdub-seccion-02.webp",
      alt: "Dos participantes trabajan junto al atril y el micrófono en una sala de doblaje",
      position: "62% center",
      mobilePosition: "63% center",
    },
    masterDub: {
      src: "/images/masterdub-no-vienes-a-clase.webp",
      alt: "Una alumna trabaja ante el atril y el micrófono acompañada por Paco Cardona",
      position: "70% center",
      mobilePosition: "62% center",
    },
    masterDubLanyard: {
      src: "/images/master-dub-lanyard.webp",
      alt: "Detalle editorial de una acreditación MASTER DUB llevada al cuello en un entorno de doblaje",
      position: "center 55%",
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
      poster: {
        src: "/images/video-poster-lectern.webp",
        alt: "",
        position: "center center",
      },
      captions: null,
      title: "Trabajo ante el atril",
      description: "Fragmento de clase",
      duration: null,
      accessibilityLabel: "Imagen provisional de un atril en una sala de doblaje. Vídeo disponible próximamente.",
    },
    {
      id: "02",
      src: null,
      poster: {
        src: "/images/video-poster-script.webp",
        alt: "",
        position: "center center",
      },
      captions: null,
      title: "Dirección y correcciones",
      description: "Dinámica en sala",
      duration: null,
      accessibilityLabel: "Imagen provisional de unas manos con un guion ante el micrófono. Vídeo disponible próximamente.",
    },
    {
      id: "03",
      src: null,
      poster: {
        src: "/images/video-poster-control.webp",
        alt: "",
        position: "center center",
      },
      captions: null,
      title: "Ritmo real de trabajo",
      description: "Proceso completo",
      duration: null,
      accessibilityLabel: "Imagen provisional del control de una sala de doblaje. Vídeo disponible próximamente.",
    },
  ] as WorkVideo[],
  testimonials: [] as Testimonial[],
  testimonialPlaceholders: [
    { id: "01", label: "Voz de antiguo alumno", status: "Testimonio real pendiente" },
    { id: "02", label: "Voz de antiguo alumno", status: "Testimonio real pendiente" },
    { id: "03", label: "Voz de antiguo alumno", status: "Testimonio real pendiente" },
  ],
  credits: ["Recording Words · instalaciones", "material provisional identificado en las formaciones y profesionales"],
};
