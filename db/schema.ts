/** Logical CMS schema. Production changes are applied only through drizzle/*.sql. */
export const cmsCollections = ["home", "settings", "professionals", "news", "talents", "media"] as const;
export type CmsCollection = (typeof cmsCollections)[number];

export const reservedTalentSlugs = new Set([
  "admin", "api", "noticias", "talentos", "aviso-legal", "politica-de-privacidad",
  "politica-de-cookies", "cms-media", "inicio", "informacion", "contacto",
]);
