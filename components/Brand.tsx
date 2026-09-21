import { siteConfig } from "../config/site";
import Image from "next/image";

export function Brand({ dark = false, full = false, name = siteConfig.brand.name, logo = siteConfig.brand.logo, strapline = siteConfig.brand.strapline }: { dark?: boolean; full?: boolean; name?: string; logo?: string; strapline?: string }) {
  const accessibleName = `${name} — ${strapline}`;

  return (
    <span className={`brand${full ? " brand-full" : ""}${dark ? " brand-on-light" : ""}`}>
      <Image
        className="brand-logo-official"
        src={logo}
        alt={accessibleName}
        width={1944}
        height={809}
        priority={!dark}
      />
    </span>
  );
}
