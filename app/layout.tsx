import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { siteConfig } from "../config/site";
import { getPublishedById } from "../lib/cms-public";
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
  const settings = (await getPublishedById("settings", "site"))?.data ?? {};
  const name = String(settings.name ?? siteConfig.brand.name);
  const title = String(settings.seoTitle ?? `${name} | ${settings.descriptor ?? siteConfig.brand.descriptor}`);
  const description = String(settings.seoDescription ?? siteConfig.description);
  const socialImage = typeof settings.socialImage === "string" && settings.socialImage ? settings.socialImage : undefined;

  return {
    title,
    description,
    keywords: ["formación profesional de doblaje", `doblaje ${siteConfig.location}`, "formación anual de doblaje", "formación de doblaje"],
    applicationName: name,
    icons: {
      icon: siteConfig.brand.favicon,
      shortcut: siteConfig.brand.favicon,
    },
    openGraph: {
      type: "website",
      locale: "es_ES",
      url: origin,
      siteName: name,
      title,
      description,
      images: socialImage ? [socialImage] : [],
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title,
      description,
      images: socialImage ? [socialImage] : [],
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
