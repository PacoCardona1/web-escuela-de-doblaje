"use client";
/* eslint-disable @next/next/no-img-element */

import { useMemo, useRef, useState } from "react";
import { cmsApi, type CmsRecord, type MediaData, recordTitle } from "./types";
import { Field, FieldGroup, SelectField, Switch, TextArea } from "./fields";
import { ExternalMedia } from "../ExternalMedia";

type UploadResult = { id: string; name: string; url: string; contentType: string; size: number; width?: number; height?: number };

function mediaData(record: CmsRecord): MediaData { return record.draft as MediaData; }
function readableBytes(bytes = 0) { return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`; }

function imageDimensions(file: Blob): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);
    image.onload = () => { URL.revokeObjectURL(url); resolve({ width: image.naturalWidth, height: image.naturalHeight }); };
    image.onerror = () => { URL.revokeObjectURL(url); reject(new Error("No se ha podido leer la imagen.")); };
    image.src = url;
  });
}

async function optimizeImage(file: File): Promise<{ blob: Blob; name: string; width: number; height: number }> {
  const original = await imageDimensions(file);
  if (file.type === "image/png" || file.type === "image/avif" || (original.width <= 2400 && original.height <= 2400 && file.size <= 2_000_000)) {
    return { blob: file, name: file.name, ...original };
  }
  const scale = Math.min(1, 2400 / Math.max(original.width, original.height));
  const width = Math.max(1, Math.round(original.width * scale));
  const height = Math.max(1, Math.round(original.height * scale));
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height;
  const context = canvas.getContext("2d"); if (!context) throw new Error("El navegador no puede optimizar esta imagen.");
  context.drawImage(bitmap, 0, 0, width, height); bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob((value) => value ? resolve(value) : reject(new Error("No se ha podido optimizar la imagen.")), "image/webp", .86));
  return { blob, name: file.name.replace(/\.[^.]+$/, ".webp"), width, height };
}

async function uploadCmsImage(file: File): Promise<UploadResult> {
  if (!file.type.startsWith("image/")) throw new Error("Selecciona una imagen compatible.");
  const optimized = await optimizeImage(file);
  if (optimized.blob.size > 8 * 1024 * 1024) throw new Error("La imagen supera el límite de 8 MB.");
  const response = await fetch("/api/cms/media/upload", {
    method: "POST",
    headers: {
      "Content-Type": optimized.blob.type || file.type,
      "X-File-Name": encodeURIComponent(optimized.name),
      "X-Image-Width": String(optimized.width),
      "X-Image-Height": String(optimized.height),
    },
    body: optimized.blob,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message ?? "No se ha podido subir la imagen.");
  return result.record as UploadResult;
}

export function ImagePicker({ label, value, media, onChange, onUploaded, help }: { label: string; value: string; media: CmsRecord[]; onChange: (value: string) => void; onUploaded: () => Promise<void> | void; help?: string }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const images = useMemo(() => media.filter((record) => (mediaData(record).kind ?? "image") === "image" && textMatch(mediaData(record), query)), [media, query]);
  async function upload(file: File) {
    setStatus("Optimizando y subiendo…");
    try { const result = await uploadCmsImage(file); onChange(result.url); await onUploaded(); setStatus("Imagen lista para usar."); setOpen(false); }
    catch (error) { setStatus(error instanceof Error ? error.message : "No se ha podido subir."); }
  }
  return <div className="admin-image-field"><span>{label}</span>{value ? <div className="admin-image-selected">{ }<img src={value} alt="Previsualización seleccionada" /><div><button type="button" onClick={() => setOpen(true)}>Cambiar</button><button type="button" className="is-danger" onClick={() => onChange("")}>Quitar</button></div></div> : <button type="button" className="admin-image-empty" onClick={() => setOpen(true)}>＋ Seleccionar imagen</button>}{help && <small>{help}</small>}
    {open && <div className="admin-picker-backdrop" role="presentation"><section className="admin-picker" role="dialog" aria-modal="true" aria-label={`Seleccionar ${label}`}><header><div><small>Multimedia</small><h3>Seleccionar imagen</h3></div><button type="button" onClick={() => setOpen(false)} aria-label="Cerrar">×</button></header><div className="admin-picker-tools"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre" /><button type="button" onClick={() => inputRef.current?.click()}>Subir nueva</button><input ref={inputRef} className="sr-only" type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /></div>{status && <p className="admin-inline-status">{status}</p>}<div className="admin-picker-grid">{images.map((record) => { const item = mediaData(record); return <button type="button" key={record.id} onClick={() => { onChange(item.url ?? ""); setOpen(false); }}>{ }<img src={item.url} alt={item.alt || item.name || "Imagen"} /><span>{item.name || "Imagen"}</span></button>; })}{images.length === 0 && <p className="admin-empty">No hay imágenes que coincidan.</p>}</div></section></div>}
  </div>;
}

function textMatch(data: MediaData, query: string) { return !query.trim() || `${data.name ?? ""} ${data.title ?? ""} ${data.alt ?? ""}`.toLowerCase().includes(query.trim().toLowerCase()); }

export function MediaLibrary({ records, onReload, onEdit, onAction }: { records: CmsRecord[]; onReload: () => Promise<void>; onEdit: (record: CmsRecord) => void; onAction: (record: CmsRecord, action: "trash" | "restore" | "permanent") => void }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [mode, setMode] = useState<"image" | "external" | null>(null);
  const [preview, setPreview] = useState<CmsRecord | null>(null);
  const [status, setStatus] = useState("");
  const [external, setExternal] = useState({ kind: "video", title: "", url: "", description: "", category: "", visible: true });
  const visible = useMemo(() => records.filter((record) => { const data = mediaData(record); const recordKind = data.kind ?? "image"; return (kind === "all" || recordKind === kind) && textMatch(data, query); }), [records, kind, query]);
  async function upload(file: File) { setStatus("Optimizando y subiendo…"); try { await uploadCmsImage(file); setStatus("Imagen añadida a la biblioteca."); await onReload(); setMode(null); } catch (error) { setStatus(error instanceof Error ? error.message : "No se ha podido subir."); } }
  async function addExternal() {
    setStatus("Guardando enlace…");
    try {
      if (!/^https?:\/\//i.test(external.url)) throw new Error("Introduce una URL completa y válida.");
      const id = crypto.randomUUID(); const provider = detectProvider(external.url);
      await cmsApi(`media/${id}`, { method: "PUT", body: JSON.stringify({ data: { ...external, provider, name: external.title }, visible: external.visible, order: 0 }) });
      await cmsApi(`media/${id}/publish`, { method: "POST", body: "{}" });
      setExternal({ kind: "video", title: "", url: "", description: "", category: "", visible: true }); setStatus("Contenido externo añadido."); setMode(null); await onReload();
    } catch (error) { setStatus(error instanceof Error ? error.message : "No se ha podido guardar."); }
  }
  return <>
    <section className="admin-media-toolbar"><div><button type="button" className="is-primary" onClick={() => setMode("image")}>＋ Subir imagen</button><button type="button" onClick={() => setMode("external")}>＋ Añadir vídeo o audio por enlace</button></div><div><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar multimedia" /><select value={kind} onChange={(event) => setKind(event.target.value)}><option value="all">Todo</option><option value="image">Imágenes</option><option value="video">Vídeos</option><option value="audio">Audio</option></select></div></section>
    {status && <p className="admin-flash">{status}<button type="button" onClick={() => setStatus("")}>×</button></p>}
    <div className="admin-media-grid">{visible.map((record) => { const item = mediaData(record); const itemKind = item.kind ?? "image"; return <article key={record.id}>{itemKind === "image" ? <button className="admin-media-preview" type="button" onClick={() => setPreview(record)}>{ }<img src={item.url} alt={item.alt || item.name || "Imagen"} /></button> : <button className="admin-media-external" type="button" onClick={() => setPreview(record)}><span>{itemKind === "video" ? "▶" : "♪"}</span><small>{item.provider || "Enlace externo"}</small></button>}<div><small>{itemKind === "image" ? `${item.width ?? "—"} × ${item.height ?? "—"} · ${readableBytes(item.size)}` : item.provider || "Enlace externo"}</small><h2>{item.name || item.title || recordTitle(record)}</h2>{record.usages?.length ? <p>En uso en {record.usages.map((usage) => usage.title ?? usage.collection).join(", ")}</p> : <p>Sin asociaciones publicadas.</p>}<footer><button type="button" onClick={() => onEdit(record)}>Editar</button><button type="button" onClick={() => setPreview(record)}>Ver</button>{!record.protected && <button type="button" className="is-danger" onClick={() => onAction(record, "trash")}>Papelera</button>}</footer></div></article>; })}{visible.length === 0 && <p className="admin-empty">La biblioteca está vacía.</p>}</div>
    {mode && <div className="admin-picker-backdrop"><section className="admin-picker admin-picker-small"><header><div><small>Multimedia</small><h3>{mode === "image" ? "Subir imagen" : "Añadir enlace externo"}</h3></div><button type="button" onClick={() => setMode(null)} aria-label="Cerrar">×</button></header>{mode === "image" ? <label className="admin-dropzone">Selecciona una imagen<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} /><small>Se reduce automáticamente si supera 2400 px. PNG y AVIF se conservan sin recomprimir.</small></label> : <div className="admin-editor-body"><FieldGroup title="Contenido externo" text="El archivo permanece en YouTube, Vimeo o el proveedor de audio."><SelectField label="Tipo" value={external.kind} onChange={(value) => setExternal({ ...external, kind: value })}><option value="video">Vídeo</option><option value="audio">Audio</option></SelectField><Field label="Título" value={external.title} onChange={(value) => setExternal({ ...external, title: value })} required /><Field label="URL" type="url" value={external.url} onChange={(value) => setExternal({ ...external, url: value })} required /><Field label="Categoría" value={external.category} onChange={(value) => setExternal({ ...external, category: value })} /><TextArea label="Descripción" value={external.description} onChange={(value) => setExternal({ ...external, description: value })} /><Switch label="Visible" checked={external.visible} onChange={(value) => setExternal({ ...external, visible: value })} /></FieldGroup><button className="admin-primary-button" type="button" onClick={() => void addExternal()}>Guardar enlace</button></div>}</section></div>}
    {preview && <div className="admin-picker-backdrop"><section className="admin-picker admin-picker-small"><header><div><small>Previsualización</small><h3>{recordTitle(preview)}</h3></div><button type="button" onClick={() => setPreview(null)} aria-label="Cerrar">×</button></header><MediaPreview record={preview} /></section></div>}
  </>;
}

function detectProvider(url: string) { try { const host = new URL(url).hostname.replace("www.", ""); if (host.includes("youtube") || host.includes("youtu.be")) return "YouTube"; if (host.includes("vimeo")) return "Vimeo"; return host; } catch { return "Externo"; } }

function MediaPreview({ record }: { record: CmsRecord }) {
  const item = mediaData(record); const kind = item.kind ?? "image";
  if (kind === "image") return <div className="admin-large-preview">{ }<img src={item.url} alt={item.alt || item.name || "Imagen"} /><dl><div><dt>Dimensiones</dt><dd>{item.width ?? "—"} × {item.height ?? "—"}</dd></div><div><dt>Peso</dt><dd>{readableBytes(item.size)}</dd></div></dl></div>;
  return <div className="admin-large-preview admin-external-preview"><span>{kind === "video" ? "▶" : "♪"}</span><h4>{item.title}</h4><p>{item.description}</p>{kind === "video" && item.url ? <ExternalMedia url={item.url} title={item.title || item.name || "Vídeo"} /> : <a href={item.url} target="_blank" rel="noreferrer">Abrir en {item.provider || "el proveedor"} ↗</a>}<small>Los reproductores externos no se cargan automáticamente.</small></div>;
}
