import type { Metadata } from "next";
import { AdminDashboard } from "../../components/admin/AdminDashboard";

export const metadata: Metadata = {
  title: "Administración | MASTER DUB",
  robots: { index: false, follow: false, noarchive: true },
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminDashboard />;
}
