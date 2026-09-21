export type PublicCmsRecord<T extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  slug: string | null;
  data: T;
  featured: boolean;
  listed: boolean;
  order: number;
  publishedAt: string | null;
};

type PublicRow = { id: string; slug: string | null; published_json: string; featured: number; listed: number; sort_order: number; published_at: string | null };

async function database(): Promise<D1Database | null> {
  try {
    const { env } = await import("cloudflare:workers");
    return (env as unknown as { DB?: D1Database }).DB ?? null;
  } catch {
    return null;
  }
}

export async function hasCmsCollection(collection: string): Promise<boolean> {
  const db = await database();
  if (!db) return false;
  try {
    const row = await db.prepare("SELECT COUNT(*) AS total FROM cms_records WHERE collection=?").bind(collection).first<{ total: number }>();
    return (row?.total ?? 0) > 0;
  } catch { return false; }
}

export async function listPublished<T extends Record<string, unknown>>(collection: string, options: { listed?: boolean; featured?: boolean; limit?: number } = {}): Promise<PublicCmsRecord<T>[]> {
  const db = await database();
  if (!db) return [];
  try {
    const conditions = ["collection = ?", "status = 'published'", "visible = 1", "published_json IS NOT NULL"];
    const bindings: unknown[] = [collection];
    if (options.listed !== undefined) { conditions.push("listed = ?"); bindings.push(options.listed ? 1 : 0); }
    if (options.featured !== undefined) { conditions.push("featured = ?"); bindings.push(options.featured ? 1 : 0); }
    const limit = Math.min(Math.max(options.limit ?? 100, 1), 100);
    const result = await db.prepare(`SELECT id, slug, published_json, featured, listed, sort_order, published_at FROM cms_records WHERE ${conditions.join(" AND ")} ORDER BY sort_order, published_at DESC LIMIT ${limit}`).bind(...bindings).all<PublicRow>();
    return result.results.map((row) => ({ id: row.id, slug: row.slug, data: JSON.parse(row.published_json) as T, featured: Boolean(row.featured), listed: Boolean(row.listed), order: row.sort_order, publishedAt: row.published_at }));
  } catch { return []; }
}

export async function getPublishedBySlug<T extends Record<string, unknown>>(collection: string, slug: string): Promise<PublicCmsRecord<T> | null> {
  const db = await database();
  if (!db) return null;
  try {
    const row = await db.prepare("SELECT id, slug, published_json, featured, listed, sort_order, published_at FROM cms_records WHERE collection=? AND slug=? AND status='published' AND visible=1 AND published_json IS NOT NULL")
      .bind(collection, slug).first<PublicRow>();
    return row ? { id: row.id, slug: row.slug, data: JSON.parse(row.published_json) as T, featured: Boolean(row.featured), listed: Boolean(row.listed), order: row.sort_order, publishedAt: row.published_at } : null;
  } catch { return null; }
}

export async function getPublishedById<T extends Record<string, unknown>>(collection: string, id: string): Promise<PublicCmsRecord<T> | null> {
  const db = await database();
  if (!db) return null;
  try {
    const row = await db.prepare("SELECT id, slug, published_json, featured, listed, sort_order, published_at FROM cms_records WHERE collection=? AND id=? AND status='published' AND visible=1 AND published_json IS NOT NULL")
      .bind(collection, id).first<PublicRow>();
    return row ? { id: row.id, slug: row.slug, data: JSON.parse(row.published_json) as T, featured: Boolean(row.featured), listed: Boolean(row.listed), order: row.sort_order, publishedAt: row.published_at } : null;
  } catch { return null; }
}
