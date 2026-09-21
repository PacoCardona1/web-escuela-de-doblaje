import type { Metadata } from "next";
import { PublicDirectory } from "../../components/PublicDirectory";
import { getPublishedById, listPublished } from "../../lib/cms-public";

export const metadata: Metadata = { title: "Noticias | MASTER DUB", description: "Actualidad de MASTER DUB." };
export const dynamic = "force-dynamic";
export default async function NewsPage() {
  const [records, section] = await Promise.all([listPublished("news"), getPublishedById("home", "news")]);
  return <PublicDirectory eyebrow="Actualidad" title={String(section?.data.title ?? "Noticias")} introduction={String(section?.data.body ?? "Actualidad de MASTER DUB.")} records={records} type="news" />;
}
