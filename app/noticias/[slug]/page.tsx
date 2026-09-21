/* eslint-disable @next/next/no-html-link-for-pages -- vinext 1.0.0-beta.2 currently throws while hydrating next/link. */
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedBySlug } from "../../../lib/cms-public";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const record = await getPublishedBySlug("news", slug); if (!record) return {};
  const data = record.data; const title = String(data.seoTitle ?? data.title ?? "Noticia"); const description = String(data.seoDescription ?? data.introduction ?? ""); const image = String(data.socialImage ?? data.coverImage ?? "");
  return { title: `${title} | MASTER DUB`, description, alternates: { canonical: `/noticias/${slug}` }, openGraph: { title, description, images: image ? [image] : [] }, twitter: { card: image ? "summary_large_image" : "summary", title, description, images: image ? [image] : [] } };
}
export default async function NewsDetail({ params }: Props) {
  const { slug } = await params; const record = await getPublishedBySlug("news", slug); if (!record) notFound(); const data = record.data;
  const body = String(data.body ?? "").split(/\n{2,}/).filter(Boolean);
  const gallery = Array.isArray(data.gallery) ? data.gallery.filter((item):item is string=>typeof item==="string"&&Boolean(item)) : [];
  return <main className="article-page"><article className="shell"><a href="/noticias">← Noticias</a><header><p>{String(data.date ?? "MASTER DUB")}{data.author ? ` · ${String(data.author)}` : ""}</p><h1>{String(data.title ?? "")}</h1><span>{String(data.introduction ?? "")}</span></header>{Boolean(data.coverImage) && <figure><Image src={String(data.coverImage)} alt={String(data.coverAlt ?? "")} fill sizes="100vw" /></figure>}<div className="article-body">{body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>{gallery.length>0&&<div className="article-gallery">{gallery.map((src,index)=><figure key={src}><Image src={src} alt={`Galería · imagen ${index+1}`} fill sizes="(max-width: 760px) 100vw, 45vw" /></figure>)}</div>}</article></main>;
}
