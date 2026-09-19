import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { siteConfig } from "../config/site";
import "@fontsource-variable/bitter/wght.css";
import "@fontsource-variable/bitter/wght-italic.css";
import "@fontsource-variable/manrope/wght.css";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121311",
};

export async function generateMetadata(): Promise<Metadata> {
  const incomingHeaders = await headers();
  const host = incomingHeaders.get("x-forwarded-host") ?? incomingHeaders.get("host") ?? "localhost:3000";
  const protocol = incomingHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const title = `${siteConfig.brand.name} | ${siteConfig.brand.descriptor}`;

  return {
    title,
    description: siteConfig.description,
    keywords: ["formación profesional de doblaje", `doblaje ${siteConfig.location}`, "formación anual de doblaje", "formación de doblaje"],
    applicationName: siteConfig.brand.name,
    icons: {
      icon: siteConfig.brand.favicon,
      shortcut: siteConfig.brand.favicon,
    },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: origin,
      siteName: siteConfig.brand.name,
      title,
      description: siteConfig.description,
    },
    twitter: {
      card: "summary",
      title,
      description: siteConfig.description,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
