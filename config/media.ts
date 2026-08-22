export type ImageAsset = {
  src: string;
  alt: string;
  position: string;
  mobilePosition?: string;
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
      src: "/images/hero-dubbing-booth-v7.jpg",
      alt: "",
      position: "55% 50%",
      mobilePosition: "64% 50%",
    },
    annualCourse: {
      src: "/images/studio-session-1.jpg",
      alt: "Imagen provisional de una sesión de trabajo en estudio",
      position: "center center",
    },
    methodology: {
      src: "/images/studio-session-2.jpg",
      alt: "Imagen provisional de una persona trabajando ante un micrófono en estudio",
      position: "center center",
    },
    intensive: {
      src: "/images/studio-session-4.jpg",
      alt: "Imagen provisional de una sesión intensiva en estudio",
      position: "center center",
    },
  } satisfies Record<string, ImageAsset>,
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
  credits: ["Portada generada provisionalmente", "cottonbro studio / Pexels"],
};
