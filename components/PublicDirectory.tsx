/* eslint-disable @next/next/no-html-link-for-pages -- vinext 1.0.0-beta.2 currently throws while hydrating next/link. */
import Image from "next/image";
import type { PublicCmsRecord } from "../lib/cms-public";

export function PublicDirectory({ eyebrow, title, introduction, records, type }: { eyebrow: string; title: string; introduction: string; records: PublicCmsRecord[]; type: "talent" | "news" }) {
  return <main className="directory-page"><header className="directory-header"><div className="shell"><a href="/">← MASTER DUB</a><p>{eyebrow}</p><h1>{title}</h1><span>{introduction}</span></div></header><section className="shell directory-grid">
    {records.length === 0 ? <p className="directory-empty">Todavía no hay contenido publicado.</p> : records.map((record) => {
      const data = record.data; const name = String(data.name ?? data.title ?? ""); const image = String(data.photo ?? data.coverImage ?? "");
      const href = type === "talent" ? `/${record.slug}` : `/noticias/${record.slug}`;
      return <article key={record.id}>{image && <figure><Image src={image} alt={String(data.photoAlt ?? data.coverAlt ?? "")} fill sizes="(max-width: 760px) 100vw, 33vw" /></figure>}<div><p>{type === "talent" ? "Talento MASTER DUB" : String(data.date ?? "Noticia")}</p><h2>{name}</h2><span>{String(data.professionalTitle ?? data.introduction ?? "")}</span><a href={href}>{type === "talent" ? "Ver perfil" : "Leer noticia"} →</a></div></article>;
    })}
  </section></main>;
}
