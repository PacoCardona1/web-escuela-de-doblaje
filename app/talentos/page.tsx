import type { Metadata } from "next";
import { PublicDirectory } from "../../components/PublicDirectory";
import { getPublishedById, listPublished } from "../../lib/cms-public";

export const metadata: Metadata = { title: "Talentos MASTER DUB", description: "Directorio de talentos con perfiles profesionales publicados y autorizados." };
export const dynamic = "force-dynamic";
export default async function TalentsPage() {
  const [records, section] = await Promise.all([listPublished("talents", { listed: true }), getPublishedById("home", "talents")]);
  return <PublicDirectory eyebrow="Directorio profesional" title={String(section?.data.title ?? "Talentos MASTER DUB")} introduction={String(section?.data.body ?? "Perfiles profesionales publicados con autorización expresa.")} records={records} type="talent" />;
}
