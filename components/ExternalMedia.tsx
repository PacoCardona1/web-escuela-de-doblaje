"use client";
import { useState } from "react";

function externalEmbed(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (host === "youtu.be" || host === "youtube.com" || host === "m.youtube.com") {
      const id = host === "youtu.be" ? parsed.pathname.split("/").filter(Boolean)[0] : parsed.searchParams.get("v") ?? (parsed.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1] ?? null);
      return id && /^[a-zA-Z0-9_-]{6,20}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0` : null;
    }
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const id = parsed.pathname.match(/\/(?:video\/)?(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}?dnt=1` : null;
    }
    return null;
  } catch { return null; }
}

export function ExternalMedia({ url, title }: { url: string; title: string }) {
  const [allowed, setAllowed] = useState(false);
  const embed = externalEmbed(url);
  if (!embed) return <a className="talent-media-link" href={url} target="_blank" rel="noreferrer">Abrir {title} ↗</a>;
  return <div className="talent-embed">{allowed ? <iframe src={embed} title={title} loading="lazy" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" /> : <button type="button" onClick={() => setAllowed(true)}><span>▶</span><strong>{title}</strong><small>El reproductor externo solo se cargará al pulsar.</small></button>}</div>;
}
