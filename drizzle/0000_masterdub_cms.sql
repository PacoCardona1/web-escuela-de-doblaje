CREATE TABLE IF NOT EXISTS cms_records (
  collection TEXT NOT NULL,
  id TEXT NOT NULL,
  slug TEXT,
  draft_json TEXT NOT NULL,
  published_json TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'trashed')),
  visible INTEGER NOT NULL DEFAULT 1 CHECK (visible IN (0, 1)),
  sort_order INTEGER NOT NULL DEFAULT 0,
  protected INTEGER NOT NULL DEFAULT 0 CHECK (protected IN (0, 1)),
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  listed INTEGER NOT NULL DEFAULT 1 CHECK (listed IN (0, 1)),
  authorized INTEGER NOT NULL DEFAULT 0 CHECK (authorized IN (0, 1)),
  authorization_date TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TEXT,
  deleted_at TEXT,
  PRIMARY KEY (collection, id)
);

CREATE UNIQUE INDEX IF NOT EXISTS cms_records_collection_slug_unique
  ON cms_records(collection, slug) WHERE slug IS NOT NULL AND status != 'trashed';
CREATE INDEX IF NOT EXISTS cms_records_public_idx
  ON cms_records(collection, status, visible, sort_order);
CREATE INDEX IF NOT EXISTS cms_records_featured_idx
  ON cms_records(collection, featured, status, sort_order);

CREATE TABLE IF NOT EXISTS cms_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  collection TEXT NOT NULL,
  record_id TEXT NOT NULL,
  data_json TEXT NOT NULL,
  action TEXT NOT NULL,
  actor_email TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS cms_versions_record_idx ON cms_versions(collection, record_id, created_at DESC);

CREATE TABLE IF NOT EXISTS cms_media_usage (
  media_id TEXT NOT NULL,
  collection TEXT NOT NULL,
  record_id TEXT NOT NULL,
  field_path TEXT NOT NULL,
  PRIMARY KEY (media_id, collection, record_id, field_path)
);
