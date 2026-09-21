/* eslint-disable @next/next/no-html-link-for-pages -- vinext 1.0.0-beta.2 currently throws while hydrating next/link. */
import Image from "next/image";
import { listPublished } from "../lib/cms-public";

type HighlightSection = { title?: unknown; body?: unknown; button?: unknown };

export async function HomeCmsHighlights({ talentsSection, newsSection }: { talentsSection?: HighlightSection; newsSection?: HighlightSection }) {
  const [talents, news] = await Promise.all([listPublished("talents", { featured: true, limit: 3 }), listPublished("news", { featured: true, limit: 3 })]);
  if (!talents.length && !news.length) return null;
  return <>
    {talents.length > 0 && <section className="home-highlights section shell"><header><p className="section-kicker">Talentos</p><h2>{String(talentsSection?.title ?? "Talentos MASTER DUB")}</h2>{Boolean(talentsSection?.body) && <p>{String(talentsSection?.body)}</p>}</header><div>{talents.map((record) => <article key={record.id}>{Boolean(record.data.photo) && <figure><Image src={String(record.data.photo)} alt={String(record.data.photoAlt ?? record.data.name ?? "")} fill sizes="(max-width:760px) 100vw, 33vw" /></figure>}<h3>{String(record.data.stageName ?? record.data.name ?? "")}</h3><p>{String(record.data.professionalTitle ?? record.data.introduction ?? "")}</p><a href={`/${record.slug}`}>Ver perfil →</a></article>)}</div><a className="button button-dark" href="/talentos">{String(talentsSection?.button ?? "Descubre Talentos MASTER DUB")}</a></section>}
    {news.length > 0 && <section className="home-highlights section shell"><header><p className="section-kicker">Noticias</p><h2>{String(newsSection?.title ?? "Actualidad MASTER DUB")}</h2>{Boolean(newsSection?.body) && <p>{String(newsSection?.body)}</p>}</header><div>{news.map((record) => <article key={record.id}>{Boolean(record.data.coverImage) && <figure><Image src={String(record.data.coverImage)} alt={String(record.data.coverAlt ?? "")} fill sizes="(max-width:760px) 100vw, 33vw" /></figure>}<h3>{String(record.data.title ?? "")}</h3><p>{String(record.data.introduction ?? "")}</p><a href={`/noticias/${record.slug}`}>Leer noticia →</a></article>)}</div><a className="button button-dark" href="/noticias">Todas las noticias</a></section>}
  </>;
}
