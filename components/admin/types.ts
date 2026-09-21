export type CmsData = Record<string, unknown>;

export type CmsRecord = {
  id: string;
  collection: string;
  slug: string | null;
  draft: CmsData;
  published: CmsData | null;
  status: "draft" | "published" | "trashed";
  visible: boolean;
  order: number;
  protected: boolean;
  featured: boolean;
  listed: boolean;
  authorized: boolean;
  authorizationDate: string | null;
  updatedAt: string;
  publishedAt?: string | null;
  usages?: MediaUsage[];
};

export type MediaUsage = { collection: string; recordId: string; fieldPath: string; title?: string };
export type Activity = { collection: string; record_id: string; action: string; actor_email: string | null; created_at: string };
export type AdminSection = "dashboard" | "web" | "talents" | "professionals" | "news" | "media" | "settings" | "trash";

export type MediaData = {
  kind?: "image" | "video" | "audio";
  name?: string;
  title?: string;
  key?: string;
  url?: string;
  contentType?: string;
  size?: number;
  width?: number;
  height?: number;
  alt?: string;
  provider?: string;
  description?: string;
  category?: string;
  visible?: boolean;
};

export const labels: Record<string, string> = {
  home: "Web",
  talents: "Talento",
  professionals: "Profesional",
  news: "Noticia",
  media: "Multimedia",
  settings: "Ajustes",
};

export async function cmsApi(path: string, init?: RequestInit) {
  const response = await fetch(`/api/cms/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const result = await response.json();
  if (!response.ok) throw Object.assign(new Error(result.message ?? result.code ?? "Error"), { status: response.status, result });
  return result;
}

export function recordTitle(record: CmsRecord) {
  return String(record.draft.label ?? record.draft.name ?? record.draft.title ?? record.id);
}

export function recordStateLabel(record: CmsRecord) {
  if (record.status === "trashed") return "Papelera";
  if (record.status === "draft" || !record.published) return "Borrador";
  if (record.publishedAt && new Date(`${record.updatedAt.replace(" ", "T")}Z`).getTime() > new Date(`${record.publishedAt.replace(" ", "T")}Z`).getTime()) return "Publicado · cambios en borrador";
  return "Publicado";
}

export function text(value: unknown) { return typeof value === "string" ? value : ""; }
export function bool(value: unknown, fallback = false) { return typeof value === "boolean" ? value : fallback; }
export function numberValue(value: unknown, fallback = 0) { return typeof value === "number" ? value : Number(value) || fallback; }
export function objectValue(value: unknown): CmsData { return value && typeof value === "object" && !Array.isArray(value) ? value as CmsData : {}; }
export function arrayValue<T = unknown>(value: unknown): T[] { return Array.isArray(value) ? value as T[] : []; }
