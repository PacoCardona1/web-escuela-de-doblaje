import { siteConfig } from "../config/site";

export function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <span className={`brand ${dark ? "brand-dark" : ""}`}>
      <span className="brand-mark" aria-hidden="true"><i /></span>
      <span>{siteConfig.brand.name}</span>
    </span>
  );
}
