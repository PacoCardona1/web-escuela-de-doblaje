import { siteConfig } from "../config/site";
import Image from "next/image";

export function Brand({ dark = false, full = false }: { dark?: boolean; full?: boolean }) {
  const accessibleName = `${siteConfig.brand.name} — ${siteConfig.brand.strapline}`;

  return (
    <span className={`brand${full ? " brand-full" : ""}${dark ? " brand-on-light" : ""}`}>
      <Image
        className="brand-logo-official"
        src={siteConfig.brand.logo}
        alt={accessibleName}
        width={1944}
        height={809}
        priority={!dark}
      />
    </span>
  );
}
