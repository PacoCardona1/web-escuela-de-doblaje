import { reservedTalentSlugs } from "../db/schema";
import { cmsSeedRecords } from "../config/cms-seed";

type CmsEnv = {
  DB?: D1Database;
  BUCKET?: R2Bucket;
  CMS_ADMIN_EMAILS?: string;
  CMS_DEV_BYPASS?: string;
};

type RecordRow = {
  collection: string;
  id: string;
  slug: string | null;
  draft_json: string;
  published_json: string | null;
  status: "draft" | "published" | "trashed";
  visible: number;
  sort_order: number;
  protected: number;
  featured: number;
  listed: number;
  authorized: number;
  authorization_date: string | null;
  updated_at: string;
  published_at: string | null;
  deleted_at: string | null;
};

type UsageRow = { media_id: string; collection: string; record_id: string; field_path: string; title: string | null };

const collections = new Set(["home", "settings", "professionals", "news", "talents", "media"]);
const MAX_JSON_BYTES = 256 * 1024;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const imageTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const urlKeys = new Set(["url", "href", "src", "primaryHref", "secondaryHref", "instagram", "tiktok", "youtube", "linkedin", "website", "socialImage", "photo", "backgroundImage", "coverImage", "logo", "image"]);

function json(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" } });
}

function adminIdentity(request: Request, env: CmsEnv): { email: string } | Response {
  const url = new URL(request.url);
  if ((url.hostname === "localhost" || url.hostname === "127.0.0.1") && env.CMS_DEV_BYPASS === "true") {
    return { email: "desarrollo-local@masterdub.es" };
  }
  const email = request.headers.get("oai-authenticated-user-email")?.trim().toLowerCase();
  if (!email) return json({ ok: false, code: "AUTH_REQUIRED", signIn: "/signin-with-chatgpt?return_to=/admin" }, 401);
  const allowed = (env.CMS_ADMIN_EMAILS ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  if (allowed.length === 0) return json({ ok: false, code: "ADMIN_NOT_CONFIGURED" }, 503);
  if (!allowed.includes(email)) return json({ ok: false, code: "FORBIDDEN" }, 403);
  return { email };
}

export function protectCmsPage(request: Request, env: CmsEnv): Response | null {
  const identity = adminIdentity(request, env);
  if (!(identity instanceof Response)) return null;
  if (identity.status === 401) {
    const signIn = new URL("/signin-with-chatgpt", request.url);
    signIn.searchParams.set("return_to", "/admin");
    return Response.redirect(signIn, 302);
  }
  const title = identity.status === 503 ? "Administración pendiente de configurar" : "Acceso no autorizado";
  return new Response(`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex"><title>${title}</title><body style="margin:0;background:#121311;color:#f3f0e7;font:16px system-ui;display:grid;place-items:center;min-height:100vh"><main style="max-width:620px;padding:40px;border:1px solid #50472f"><p style="color:#cfae57;letter-spacing:.14em">MASTER DUB</p><h1>${title}</h1><p>Comprueba la cuenta autorizada y la configuración del CMS.</p><a style="color:#f3f0e7" href="/">Volver a la web</a></main></body></html>`, { status: identity.status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

function safeId(value: string) {
  return /^[a-z0-9][a-z0-9_-]{0,79}$/i.test(value);
}

function safeSlug(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") return null;
  const slug = value.trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug.length > 80 || reservedTalentSlugs.has(slug)) return null;
  return slug;
}

function safePublicUrl(value: string): boolean {
  if (!value) return true;
  if (/^#[a-z][a-z0-9_-]*$/i.test(value)) return true;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}

function validatePublicUrls(value: unknown, key = "", depth = 0): boolean {
  if (depth > 12) return false;
  if (typeof value === "string") return !urlKeys.has(key) || safePublicUrl(value);
  if (Array.isArray(value)) return value.every((item) => validatePublicUrls(item, key, depth + 1));
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (urlKeys.has(key) && typeof object.value === "string" && !safePublicUrl(object.value)) return false;
    if (key === "other" && typeof object.value === "string" && !safePublicUrl(object.value)) return false;
    return Object.entries(object).every(([childKey, item]) => validatePublicUrls(item, childKey, depth + 1));
  }
  return true;
}

function matchesImageSignature(bytes: Uint8Array, contentType: string): boolean {
  if (contentType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === "image/png") return bytes.length >= 8 && [0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a].every((value,index)=>bytes[index]===value);
  const text = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (contentType === "image/webp") return bytes.length >= 12 && text(0,4) === "RIFF" && text(8,12) === "WEBP";
  if (contentType === "image/avif") return bytes.length >= 16 && text(4,8) === "ftyp" && [text(8,12), text(12,16)].some((brand)=>brand === "avif" || brand === "avis");
  return false;
}

function validMutationOrigin(request: Request): boolean {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return true;
  const origin = request.headers.get("origin");
  return Boolean(origin && origin === new URL(request.url).origin);
}

function publicationProblem(row: RecordRow): string | null {
  const data = JSON.parse(row.draft_json) as Record<string, unknown>;
  if (row.collection === "talents") {
    if (!row.slug || typeof data.name !== "string" || !data.name.trim()) return "Completa el nombre y la dirección pública antes de publicar.";
    if (!row.authorized) return "Falta registrar la autorización de publicación.";
  }
  if (row.collection === "news" && (!row.slug || typeof data.title !== "string" || !data.title.trim())) return "Completa el título y la dirección pública antes de publicar.";
  if (row.collection === "professionals" && (typeof data.name !== "string" || !data.name.trim())) return "Completa el nombre antes de publicar.";
  return null;
}

function parseRow(row: RecordRow) {
  return {
    id: row.id,
    collection: row.collection,
    slug: row.slug,
    draft: JSON.parse(row.draft_json),
    published: row.published_json ? JSON.parse(row.published_json) : null,
    status: row.status,
    visible: Boolean(row.visible),
    order: row.sort_order,
    protected: Boolean(row.protected),
    featured: Boolean(row.featured),
    listed: Boolean(row.listed),
    authorized: Boolean(row.authorized),
    authorizationDate: row.authorization_date,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    deletedAt: row.deleted_at,
  };
}

async function requestJson(request: Request): Promise<Record<string, unknown>> {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_JSON_BYTES) throw new Error("PAYLOAD_TOO_LARGE");
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > MAX_JSON_BYTES) throw new Error("PAYLOAD_TOO_LARGE");
  const value = JSON.parse(text);
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("INVALID_JSON");
  return value as Record<string, unknown>;
}

async function listAll(db: D1Database) {
  const [records, usages] = await Promise.all([
    db.prepare("SELECT * FROM cms_records ORDER BY collection, sort_order, updated_at DESC").all<RecordRow>(),
    db.prepare(`SELECT u.media_id, u.collection, u.record_id, u.field_path,
      COALESCE(json_extract(r.draft_json, '$.label'), json_extract(r.draft_json, '$.name'), json_extract(r.draft_json, '$.title'), r.id) AS title
      FROM cms_media_usage u LEFT JOIN cms_records r ON r.collection=u.collection AND r.id=u.record_id`).all<UsageRow>(),
  ]);
  const byMedia = new Map<string, UsageRow[]>();
  for (const usage of usages.results) byMedia.set(usage.media_id, [...(byMedia.get(usage.media_id) ?? []), usage]);
  return records.results.map((row) => ({ ...parseRow(row), usages: row.collection === "media" ? (byMedia.get(row.id) ?? []).map((usage) => ({ collection: usage.collection, recordId: usage.record_id, fieldPath: usage.field_path, title: usage.title ?? undefined })) : undefined }));
}

function collectMediaUsages(value: unknown, path = "contenido", found: Array<{ id: string; path: string }> = []) {
  if (typeof value === "string") {
    const match = value.match(/^\/cms-media\/cms\/([a-z0-9-]+)\.(?:jpg|png|webp|avif)$/i);
    if (match) found.push({ id: match[1], path });
    return found;
  }
  if (Array.isArray(value)) value.forEach((item, index) => collectMediaUsages(item, `${path}.${index + 1}`, found));
  else if (value && typeof value === "object") Object.entries(value).forEach(([key, item]) => collectMediaUsages(item, `${path}.${key}`, found));
  return found;
}

async function syncMediaUsage(db: D1Database, collection: string, id: string, data: unknown) {
  const usages = collectMediaUsages(data);
  const statements = [db.prepare("DELETE FROM cms_media_usage WHERE collection=? AND record_id=?").bind(collection, id)];
  for (const usage of usages) statements.push(db.prepare("INSERT OR IGNORE INTO cms_media_usage (media_id, collection, record_id, field_path) VALUES (?, ?, ?, ?)").bind(usage.id, collection, id, usage.path));
  await db.batch(statements);
}

async function recordVersion(db: D1Database, collection: string, id: string, data: unknown, action: string, actor: string) {
  await db.prepare("INSERT INTO cms_versions (collection, record_id, data_json, action, actor_email) VALUES (?, ?, ?, ?, ?)")
    .bind(collection, id, JSON.stringify(data), action, actor).run();
}

export async function handleCmsRequest(request: Request, env: CmsEnv): Promise<Response> {
  const identity = adminIdentity(request, env);
  if (identity instanceof Response) return identity;
  if (!validMutationOrigin(request)) return json({ ok: false, code: "INVALID_ORIGIN" }, 403);
  if (!env.DB) return json({ ok: false, code: "CMS_STORAGE_NOT_CONFIGURED" }, 503);
  const db = env.DB;
  const url = new URL(request.url);
  const segments = url.pathname.split("/").filter(Boolean).slice(2);

  try {
    if (segments[0] === "bootstrap" && request.method === "GET") {
      const [records, versions] = await Promise.all([
        listAll(db),
        db.prepare("SELECT collection, record_id, action, actor_email, created_at FROM cms_versions ORDER BY created_at DESC LIMIT 12").all(),
      ]);
      return json({ ok: true, actor: identity.email, records, activity: versions.results });
    }

    if (segments[0] === "seed" && request.method === "POST") {
      const existing = await db.prepare("SELECT COUNT(*) AS total FROM cms_records").first<{ total: number }>();
      if ((existing?.total ?? 0) > 0) return json({ ok: false, message: "El CMS ya contiene datos; no se ha sobrescrito nada." }, 409);
      const statements = cmsSeedRecords.map((record) => {
        const value = JSON.stringify(record.data);
        return db.prepare(`INSERT INTO cms_records
          (collection, id, slug, draft_json, published_json, status, visible, sort_order, protected)
          VALUES (?, ?, ?, ?, ?, 'published', ?, ?, ?)`)
          .bind(record.collection, record.id, record.slug ?? null, value, value, record.visible === false ? 0 : 1, record.order ?? 0, record.protected ? 1 : 0);
      });
      await db.batch(statements);
      return json({ ok: true, count: statements.length });
    }

    if (segments[0] === "media" && segments[1] === "upload" && request.method === "POST") {
      if (!env.BUCKET) return json({ ok: false, code: "CMS_MEDIA_NOT_CONFIGURED" }, 503);
      const contentType = request.headers.get("content-type")?.split(";")[0] ?? "";
      const contentLength = Number(request.headers.get("content-length") ?? 0);
      if (!imageTypes.has(contentType)) return json({ ok: false, message: "Formato de imagen no permitido." }, 415);
      if (!request.body || contentLength > MAX_IMAGE_BYTES) return json({ ok: false, message: "La imagen supera el límite de 8 MB." }, 413);
      const upload = await request.arrayBuffer();
      const bytes = new Uint8Array(upload);
      if (bytes.byteLength === 0 || bytes.byteLength > MAX_IMAGE_BYTES) return json({ ok: false, message: "La imagen supera el límite de 8 MB." }, 413);
      if (!matchesImageSignature(bytes, contentType)) return json({ ok: false, message: "El contenido del archivo no coincide con el formato indicado." }, 415);
      let decodedName = "imagen";
      try { decodedName = decodeURIComponent(request.headers.get("x-file-name") ?? "imagen"); } catch { return json({ ok: false, message: "El nombre del archivo no es válido." }, 422); }
      const original = decodedName.replace(/[^a-z0-9._-]+/gi, "-").slice(0, 100) || "imagen";
      const id = crypto.randomUUID();
      const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>)[contentType];
      const key = `cms/${id}.${extension}`;
      await env.BUCKET.put(key, upload, { httpMetadata: { contentType }, customMetadata: { original, uploadedBy: identity.email } });
      const width = Number(request.headers.get("x-image-width") ?? 0);
      const height = Number(request.headers.get("x-image-height") ?? 0);
      const data = { kind: "image", name: original, key, url: `/cms-media/${key}`, contentType, size: bytes.byteLength, width: width > 0 ? width : undefined, height: height > 0 ? height : undefined, alt: "", visible: true };
      try {
        await db.batch([
          db.prepare("INSERT INTO cms_records (collection, id, draft_json, published_json, status) VALUES ('media', ?, ?, ?, 'published')").bind(id, JSON.stringify(data), JSON.stringify(data)),
          db.prepare("INSERT INTO cms_versions (collection, record_id, data_json, action, actor_email) VALUES ('media', ?, ?, 'upload', ?)").bind(id, JSON.stringify(data), identity.email),
        ]);
      } catch (error) {
        await env.BUCKET.delete(key);
        throw error;
      }
      return json({ ok: true, record: { id, ...data } }, 201);
    }

    const [collection, id, action] = segments;
    if (!collection || !collections.has(collection) || !id || !safeId(id)) return json({ ok: false, message: "Ruta de CMS no válida." }, 404);

    if (request.method === "PUT" && !action) {
      const input = await requestJson(request);
      const data = input.data;
      if (!data || typeof data !== "object" || Array.isArray(data)) return json({ ok: false, message: "El contenido no es válido." }, 422);
      if (!validatePublicUrls(data)) return json({ ok: false, message: "Hay una URL no segura. Usa HTTPS o una ruta interna válida." }, 422);
      const requestedSlug = collection === "talents" || collection === "news" ? input.slug : null;
      const slug = requestedSlug ? safeSlug(requestedSlug) : null;
      if (requestedSlug && !slug) return json({ ok: false, message: "El slug no es válido o está reservado." }, 422);
      const existing = await db.prepare("SELECT protected, published_json FROM cms_records WHERE collection = ? AND id = ?").bind(collection, id).first<{ protected: number; published_json: string | null }>();
      const flags = {
        visible: input.visible === false ? 0 : 1,
        order: Number.isInteger(input.order) ? Number(input.order) : 0,
        featured: input.featured === true ? 1 : 0,
        listed: input.listed === false ? 0 : 1,
        authorized: input.authorized === true ? 1 : 0,
        authorizationDate: typeof input.authorizationDate === "string" ? input.authorizationDate : null,
      };
      if (collection === "media" && flags.visible === 0) {
        const usage = await db.prepare("SELECT COUNT(*) AS total FROM cms_media_usage WHERE media_id = ?").bind(id).first<{ total: number }>();
        if ((usage?.total ?? 0) > 0) return json({ ok: false, message: "La imagen está siendo utilizada y no puede ocultarse." }, 409);
      }
      await db.prepare(`INSERT INTO cms_records
        (collection, id, slug, draft_json, status, visible, sort_order, protected, featured, listed, authorized, authorization_date)
        VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(collection, id) DO UPDATE SET slug=excluded.slug, draft_json=excluded.draft_json,
        status=CASE WHEN cms_records.status='trashed' THEN 'draft' ELSE cms_records.status END,
        visible=excluded.visible, sort_order=excluded.sort_order, featured=excluded.featured,
        listed=excluded.listed, authorized=excluded.authorized, authorization_date=excluded.authorization_date,
        updated_at=CURRENT_TIMESTAMP, deleted_at=NULL`)
        .bind(collection, id, slug, JSON.stringify(data), flags.visible, flags.order, existing?.protected ?? (input.protected === true ? 1 : 0), flags.featured, flags.listed, flags.authorized, flags.authorizationDate).run();
      if (collection !== "media") await syncMediaUsage(db, collection, id, [data, existing?.published_json ? JSON.parse(existing.published_json) : null]);
      await recordVersion(db, collection, id, data, "save_draft", identity.email);
      return json({ ok: true });
    }

    const row = await db.prepare("SELECT * FROM cms_records WHERE collection = ? AND id = ?").bind(collection, id).first<RecordRow>();
    if (!row) return json({ ok: false, message: "Contenido no encontrado." }, 404);

    if (request.method === "POST" && action === "publish") {
      const problem = publicationProblem(row);
      if (problem) return json({ ok: false, message: problem }, 422);
      await db.prepare("UPDATE cms_records SET published_json=draft_json, status='published', published_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP, deleted_at=NULL WHERE collection=? AND id=?")
        .bind(collection, id).run();
      if (collection !== "media") await syncMediaUsage(db, collection, id, JSON.parse(row.draft_json));
      await recordVersion(db, collection, id, JSON.parse(row.draft_json), "publish", identity.email);
      return json({ ok: true });
    }

    if (request.method === "POST" && action === "trash") {
      if (row.protected) return json({ ok: false, message: "Este contenido está protegido contra borrado." }, 409);
      if (collection === "media") {
        const usage = await db.prepare("SELECT COUNT(*) AS total FROM cms_media_usage WHERE media_id = ?").bind(id).first<{ total: number }>();
        if ((usage?.total ?? 0) > 0) return json({ ok: false, message: "La imagen está siendo utilizada. Retírala de sus contenidos antes de enviarla a la papelera." }, 409);
      }
      await db.prepare("UPDATE cms_records SET status='trashed', deleted_at=CURRENT_TIMESTAMP, updated_at=CURRENT_TIMESTAMP WHERE collection=? AND id=?").bind(collection, id).run();
      await recordVersion(db, collection, id, JSON.parse(row.draft_json), "trash", identity.email);
      return json({ ok: true });
    }

    if (request.method === "POST" && action === "restore") {
      await db.prepare("UPDATE cms_records SET status=CASE WHEN published_json IS NULL THEN 'draft' ELSE 'published' END, deleted_at=NULL, updated_at=CURRENT_TIMESTAMP WHERE collection=? AND id=?").bind(collection, id).run();
      await recordVersion(db, collection, id, JSON.parse(row.draft_json), "restore", identity.email);
      return json({ ok: true });
    }

    if (request.method === "DELETE" && action === "permanent") {
      if (row.protected) return json({ ok: false, message: "Este contenido está protegido contra borrado." }, 409);
      if (row.status !== "trashed") return json({ ok: false, message: "Envía el contenido a la papelera antes de eliminarlo." }, 409);
      if (collection === "media") {
        const usage = await db.prepare("SELECT COUNT(*) AS total FROM cms_media_usage WHERE media_id = ?").bind(id).first<{ total: number }>();
        if ((usage?.total ?? 0) > 0) return json({ ok: false, message: "La imagen está siendo utilizada." }, 409);
        const media = JSON.parse(row.draft_json) as { key?: string };
        if (media.key && env.BUCKET) await env.BUCKET.delete(media.key);
      }
      await db.batch([
        db.prepare("DELETE FROM cms_media_usage WHERE (collection=? AND record_id=?) OR media_id=?").bind(collection, id, id),
        db.prepare("DELETE FROM cms_versions WHERE collection=? AND record_id=?").bind(collection, id),
        db.prepare("DELETE FROM cms_records WHERE collection=? AND id=?").bind(collection, id),
      ]);
      return json({ ok: true });
    }

    return json({ ok: false, message: "Operación no permitida." }, 405);
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    if (message.includes("UNIQUE")) return json({ ok: false, message: "Ese slug ya está en uso." }, 409);
    if (message === "PAYLOAD_TOO_LARGE") return json({ ok: false, message: "El contenido supera el tamaño permitido." }, 413);
    return json({ ok: false, message: "No se ha podido completar la operación." }, 500);
  }
}

export async function handleCmsMedia(request: Request, env: CmsEnv): Promise<Response> {
  if (!env.BUCKET || !env.DB || request.method !== "GET") return new Response("Not found", { status: 404 });
  let key = "";
  try { key = decodeURIComponent(new URL(request.url).pathname.replace(/^\/cms-media\//, "")); } catch { return new Response("Not found", { status: 404 }); }
  if (!/^cms\/[a-f0-9-]{36}\.(?:jpg|png|webp|avif)$/i.test(key)) return new Response("Not found", { status: 404 });
  const mediaId = key.slice(4, key.lastIndexOf("."));
  const published = await env.DB.prepare("SELECT 1 AS available FROM cms_records WHERE collection='media' AND id=? AND status='published' AND visible=1 AND json_extract(published_json, '$.key')=?").bind(mediaId, key).first<{ available: number }>();
  if (!published?.available) return new Response("Not found", { status: 404 });
  const object = await env.BUCKET.get(key);
  if (!object) return new Response("Not found", { status: 404 });
  const headers = new Headers({ "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" });
  object.writeHttpMetadata(headers);
  return new Response(object.body, { headers });
}
