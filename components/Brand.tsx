import { siteConfig } from "../config/site";
import Image from "next/image";

export function Brand({ dark = false, full = false }: { dark?: boolean; full?: boolean }) {
  const tone = dark ? "dark" : "light";
  const accessibleName = `${siteConfig.brand.name} — ${siteConfig.brand.signature}`;

  if (full) {
    return (
      <span className={`brand brand-full ${dark ? "brand-dark" : ""}`}>
        <Image
          className="brand-logo-full"
          src={siteConfig.brand.logo.full[tone]}
          alt={accessibleName}
          width={720}
          height={dark ? 409 : 400}
        />
      </span>
    );
  }

  return (
    <span className={`brand ${dark ? "brand-dark" : ""}`}>
      <Image
        className="brand-logo-symbol"
        src={siteConfig.brand.logo.symbol[tone]}
        alt=""
        width={256}
        height={256}
        priority={!dark}
      />
      <Image
        className="brand-logo-wordmark"
        src={siteConfig.brand.logo.wordmark[tone]}
        alt={accessibleName}
        width={480}
        height={45}
        priority={!dark}
      />
    </span>
  );
}
