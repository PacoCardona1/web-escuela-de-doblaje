import { siteConfig, type SocialNetwork } from "../config/site";

export function StudentAccess({ className = "" }: { className?: string }) {
  const { label, pendingLabel, url } = siteConfig.studentAccess;
  const classes = `${className} student-access${url ? " is-active" : " is-pending"}`.trim();

  return url
    ? <a className={classes} href={url}>{label}</a>
    : (
      <span className={classes} aria-disabled="true" aria-label={`${label}: ${pendingLabel}`} title="Enlace pendiente de configurar">
        <span>{label}</span>
        <small>{pendingLabel}</small>
      </span>
    );
}

const socialMeta: Array<{ key: SocialNetwork; label: string; glyph: string }> = [
  { key: "instagram", label: "Instagram", glyph: "" },
  { key: "tiktok", label: "TikTok", glyph: "♪" },
  { key: "youtube", label: "YouTube", glyph: "▶" },
];

export function SocialLinks({ social = siteConfig.social }: { social?: Partial<Record<SocialNetwork, string>> }) {
  return (
    <nav className="footer-social" aria-label="Redes sociales">
      <p>Redes sociales</p>
      <div>
        {socialMeta.map(({ key, label, glyph }) => {
          const url = social[key] ?? "";
          const icon = <span className={`social-icon social-icon-${key}`} aria-hidden="true">{glyph}</span>;

          return url
            ? <a className="social-link is-active" href={url} target="_blank" rel="noreferrer" aria-label={label} key={key}>{icon}</a>
            : <span className="social-link is-pending" aria-label={`${label}: enlace pendiente de configurar`} aria-disabled="true" title={`${label}: pendiente`} key={key}>{icon}</span>;
        })}
      </div>
    </nav>
  );
}
