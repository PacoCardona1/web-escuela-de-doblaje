/* eslint-disable @next/next/no-html-link-for-pages -- vinext 1.0.0-beta.2 currently throws while hydrating next/link. */
import Image from "next/image";
import { Brand } from "../components/Brand";
import { InformationForm } from "../components/InformationForm";
import { IntensiveExperience } from "../components/IntensiveExperience";
import { WorkVideos } from "../components/MediaShowcase";
import { MobileMenu } from "../components/MobileMenu";
import { SocialLinks, StudentAccess } from "../components/SiteLinks";
import { facultyConfig, facultyTypeLabels } from "../config/faculty";
import { intensiveConfig } from "../config/intensive";
import { mediaConfig } from "../config/media";
import { siteConfig } from "../config/site";
import { HomeCmsHighlights } from "../components/HomeCmsHighlights";
import { getPublishedById, hasCmsCollection, listPublished } from "../lib/cms-public";
import type { FacultyProfile } from "../config/faculty";
import type { ImageAsset, WorkVideo } from "../config/media";

const annualPrinciples = [
  "Trabajo desde el atril",
  "Dirección profesional",
  "Material seleccionado",
  "Seguimiento individual",
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const { annualCourse } = siteConfig;
  const { images } = mediaConfig;
  const [cmsSections, cmsSettings, cmsProfessionals, homeConfigured, professionalsConfigured] = await Promise.all([listPublished("home"), getPublishedById("settings", "site"), listPublished("professionals"), hasCmsCollection("home"), hasCmsCollection("professionals")]);
  const cms = Object.fromEntries(cmsSections.map((record) => [record.id, record.data]));
  const text = (section: string, key: string, fallback: string) => typeof cms[section]?.[key] === "string" ? String(cms[section][key]) : fallback;
  const strings = (section: string, key: string, fallback: readonly string[]) => Array.isArray(cms[section]?.[key]) ? (cms[section][key] as unknown[]).filter((item): item is string => typeof item === "string") : [...fallback];
  const image = (section: string, key: string, fallback: ImageAsset): ImageAsset => {
    const value = cms[section]?.[key];
    if (typeof value === "string") return { ...fallback, src: value };
    if (value && typeof value === "object" && !Array.isArray(value)) return { ...fallback, ...(value as Partial<ImageAsset>) };
    return fallback;
  };
  const masterDub = cms["master-dub"] ? cms["master-dub"] as unknown as typeof intensiveConfig : intensiveConfig;
  const annualFacts = cms.annual?.facts && typeof cms.annual.facts === "object" && !Array.isArray(cms.annual.facts) ? cms.annual.facts as typeof annualCourse : annualCourse;
  const facilitiesImages = Array.isArray(cms.facilities?.images) ? (cms.facilities.images as unknown[]).map((item,index)=>typeof item === "string" ? { ...[images.facilitiesRoom,images.facilitiesWorkstation,images.facilitiesConsole][index % 3], src:item } : item as ImageAsset) : [images.facilitiesRoom,images.facilitiesWorkstation,images.facilitiesConsole];
  const cmsMainProfessionals = cmsProfessionals.filter((record) => record.data.type !== "invitado").map((record)=>record.data as unknown as FacultyProfile);
  const cmsInvitedProfessionals = cmsProfessionals.filter((record) => record.data.type === "invitado");
  const professionals = professionalsConfigured ? cmsMainProfessionals : facultyConfig.profiles;
  const studioVideos = Array.isArray(cms.studio?.videos) ? cms.studio.videos as unknown as WorkVideo[] : mediaConfig.videos;
  const settings = cmsSettings?.data ?? {};
  const brandName = String(settings.name ?? siteConfig.brand.name);
  const brandDescriptor = String(settings.descriptor ?? siteConfig.brand.descriptor);
  const brandStrapline = String(settings.strapline ?? siteConfig.brand.strapline);
  const brandLogo = String(settings.logo ?? siteConfig.brand.logo);
  const sectionVisible = (id: string) => !homeConfigured || Boolean(cms[id]);
  const professionalsTitle = text("professionals","title","Dirección conocida. Seguimiento cercano.");
  const professionalsTitleParts = professionalsTitle.split(/(?<=\.)\s+/, 2);

  return (
    <main id="main-content">
      <a className="skip-link" href="#master-dub">Saltar al contenido principal</a>
      <section className="hero" id="inicio" hidden={!sectionVisible("hero")} style={{ "--hero-image": `url(${image("hero","image",images.hero).src})`, "--hero-position": image("hero","image",images.hero).position, "--hero-mobile-position": image("hero","image",images.hero).mobilePosition } as React.CSSProperties}>
        <div className="hero-shade" />
        <nav className="nav shell" aria-label="Navegación principal">
          <a href="#inicio" aria-label={`${brandName}, inicio`}><Brand name={brandName} logo={brandLogo} strapline={brandStrapline} /></a>
          <div className="nav-links">
            <a href="#master-dub">¿Qué es una MASTER DUB?</a>
            <a href="#curso">Formación anual</a>
            <a href="#instalaciones">Instalaciones</a>
            <a href="#direccion">Profesionales</a>
            <a href="#en-sala">En sala</a>
            <a className="nav-cta" href="#informacion">INFÓRMATE</a>
            <StudentAccess />
          </div>
          <MobileMenu />
        </nav>
        <div className="hero-content shell">
          <p className="eyebrow"><span /> {text("hero", "eyebrow", brandDescriptor)}</p>
          <h1>{text("hero", "title", "Aprende doblaje.")}<br /><em>{text("hero", "titleEmphasis", "Trabaja como se trabaja en sala.")}</em></h1>
          <p className="hero-copy">{text("hero", "body", "Formación ante el atril, dentro del entorno profesional del doblaje y bajo la dirección de profesionales en activo.")}</p>
          <div className="hero-actions">
            <a className="button button-primary" href={text("hero","primaryHref","#informacion")}>{text("hero","primaryButton","Solicita información")} <span>↗</span></a>
            <a className="button button-ghost" href={text("hero","secondaryHref","#en-sala")}>{text("hero","secondaryButton","En sala")} <span>↓</span></a>
          </div>
        </div>
        <div className="hero-facts shell" aria-label="Datos principales de MASTER DUB">
          <div><small>MASTER DUB</small><strong>{intensiveConfig.facts[0].value} participantes</strong></div>
          <div><small>Trabajo efectivo</small><strong>{intensiveConfig.facts[3].value}</strong></div>
          <a href="#master-dub" aria-label="Descubrir MASTER DUB">Descubre MASTER DUB <span>↓</span></a>
        </div>
      </section>

      <IntensiveExperience visible={sectionVisible("master-dub")} image={image("master-dub","image",images.masterDub)} lanyard={image("master-dub","lanyard",images.masterDubLanyard)} content={masterDub} />

      <section className="course section shell" id="curso" hidden={!sectionVisible("annual")}>
        <div className="course-heading">
          <div>
            <p className="section-kicker">{text("annual","kicker","02 · Formación anual")}</p>
            <h2>{text("annual", "title", "Construye una base sólida desde el atril.")}</h2>
          </div>
          <div className="course-lead">
            {strings("annual","lead",["Para quienes todavía no han trabajado profesionalmente en doblaje o necesitan consolidar su base con tiempo, práctica y seguimiento.","Cada alumno trabaja con material adaptado progresivamente a su edad, voz, registro, evolución, fortalezas y dificultades."]).map((paragraph)=><p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>

        <div className="course-overview compact">
          <figure className="course-photo photo-frame" style={{ "--course-photo-position": image("annual","image",images.annualCourse).position, "--course-photo-mobile-position": image("annual","image",images.annualCourse).mobilePosition } as React.CSSProperties}>
            <Image src={image("annual","image",images.annualCourse).src} alt={image("annual","image",images.annualCourse).alt} fill sizes="(max-width: 760px) 100vw, 48vw" />
          </figure>
          <div className="course-details">
            <p className="course-purpose">{text("annual","purpose","Cada take tiene un propósito formativo.")}</p>
            <ul className="annual-principles">
              {strings("annual","principles",annualPrinciples).map((principle, index) => <li key={principle}><span>{String(index + 1).padStart(2, "0")}</span>{principle}</li>)}
            </ul>
            <dl className="course-facts compact-facts">
              <div><dt>Calendario</dt><dd>{annualFacts.period}</dd></div>
              <div><dt>Ritmo</dt><dd>{annualFacts.weeklySchedule}</dd></div>
              <div><dt>Sesión</dt><dd>{annualFacts.classDuration}</dd></div>
              <div><dt>Grupo</dt><dd>{annualFacts.groupSize}</dd></div>
            </dl>
            <p className="course-access">{annualFacts.access ?? "Entrevista y valoración previa · Plazas limitadas"}</p>
            <a className="button button-dark" href={text("annual","href","#informacion")}>{text("annual","cta","Solicita información")} <span>↗</span></a>
          </div>
        </div>

        <div className="annual-areas" aria-label="Áreas de trabajo de la Formación Anual">
          <span>Áreas de trabajo</span>
          <p>{strings("annual","areas",annualCourse.areas).join(" · ")}</p>
        </div>
      </section>

      <section className="facilities section-dark" id="instalaciones" aria-labelledby="facilities-title" hidden={!sectionVisible("facilities")}>
        <div className="shell">
          <div className="facilities-heading">
            <div>
              <p className="section-kicker light">03 · {text("facilities","eyebrow",mediaConfig.facilities.eyebrow)}</p>
              <h2 id="facilities-title">{text("facilities","title",mediaConfig.facilities.title)}</h2>
            </div>
            <p>{text("facilities","description",mediaConfig.facilities.description)}</p>
          </div>
          <div className="facilities-gallery">
            {facilitiesImages.map((facilityImage) => (
              <figure key={facilityImage.src}>
                <Image src={facilityImage.src} alt={facilityImage.alt ?? ""} fill sizes="(max-width: 760px) 100vw, 33vw" style={{ objectPosition: facilityImage.position ?? "center" }} />
              </figure>
            ))}
          </div>
          <p className="facilities-credit"><span />{text("facilities","collaboration",mediaConfig.facilities.collaboration)}</p>
        </div>
      </section>

      <section className="direction section-dark" id="direccion" hidden={!sectionVisible("professionals")}>
        <div className="shell">
          <header className="faculty-heading compact-heading">
            <div>
              <p className="section-kicker light">04 · Profesionales</p>
              <h2>{professionalsTitleParts[0]}{professionalsTitleParts[1] && <><br /><em>{professionalsTitleParts[1]}</em></>}</h2>
            </div>
          </header>

          <div className="faculty-list compact-faculty" aria-label="Profesionales de la formación">
          {professionals.map((profile, index) => (
            <article className={`faculty-profile is-${profile.type}`} key={profile.name}>
              <figure className="faculty-portrait" style={{ "--faculty-position": profile.photoPosition } as React.CSSProperties}>
                <Image src={profile.photo} alt={profile.photoAlt} fill sizes="(max-width: 760px) 100vw, 42vw" />
                <span className="faculty-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              </figure>
              <div className="faculty-copy">
                <p className="faculty-type"><span />{facultyTypeLabels[profile.type]}</p>
                <h3>{profile.name}</h3>
                <p className="faculty-role">{profile.role}</p>
                <p className="faculty-introduction">{profile.introduction}</p>
                {profile.website ? (
                  <a className="faculty-website" href={profile.website.href} target="_blank" rel="noreferrer">{profile.website.label}<span aria-hidden="true">↗</span></a>
                ) : (
                  <span className="faculty-website-space" aria-hidden="true" />
                )}
              </div>
            </article>
          ))}
          </div>

          <aside className="invited-faculty compact-invited" aria-labelledby="invited-title">
          <header className="invited-heading">
            <div><p className="section-kicker">Equipo ampliado</p><h3 id="invited-title">{text("professionals","invitedTitle",facultyConfig.invited.title)}</h3></div>
            <p>{text("professionals","invitedIntroduction",facultyConfig.invited.introduction)}</p>
          </header>
          <div className="invited-grid">
            {(professionalsConfigured ? cmsInvitedProfessionals : facultyConfig.invited.placeholders.map((placeholderLabel, index) => ({ id: `fallback-${index}`, data: { name: "Por confirmar", role: "Profesional invitado", photo: "", placeholderLabel } }))).map((record, index) => {
              const invited = record.data as Record<string, unknown>;
              const photo = typeof invited.photo === "string" ? invited.photo : "";
              const website = invited.website && typeof invited.website === "object" ? invited.website as { label?: string; href?: string } : null;
              const links = Array.isArray(invited.links) ? invited.links.filter((item): item is { label?: string; href?: string } => Boolean(item && typeof item === "object" && "href" in item)) : [];
              return <article className={`invited-profile${photo ? "" : " is-pending"}`} key={record.id}>
                <figure>
                  <Image src={photo || facultyConfig.placeholderPhoto} alt={photo ? String(invited.photoAlt ?? invited.name ?? "") : ""} fill sizes="(max-width: 760px) 44vw, 20vw" style={{ objectPosition: String(invited.photoPosition ?? "center 38%") }} />
                  {!photo && <i aria-hidden="true">{String(invited.placeholderLabel ?? String(index + 1).padStart(2,"0"))}</i>}
                </figure>
                <strong>{String(invited.name ?? "Por confirmar")}</strong>
                <span>{String(invited.role ?? "Profesional invitado")}</span>
                {Boolean(invited.introduction) && <small>{String(invited.introduction)}</small>}
                {website?.href && <a href={website.href} target="_blank" rel="noreferrer">{website.label || "Más información"} ↗</a>}
                {links.map((link, linkIndex) => link.href ? <a key={`${link.href}-${linkIndex}`} href={link.href} target="_blank" rel="noreferrer">{link.label || "Más información"} ↗</a> : null)}
              </article>;
            })}
          </div>
          </aside>
        </div>
      </section>

      <section className="videos section-muted" id="en-sala" hidden={!sectionVisible("studio")}>
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="section-kicker">{text("studio","kicker","05 · En sala")}</p><h2>{text("studio","title","Así se trabaja.")}</h2></div>
            <p>{text("studio","description","Aquí irán los vídeos que muestran cómo se trabaja. Próximamente se sustituirá el material provisional por imágenes reales de MASTER DUB.")}</p>
          </div>
          <WorkVideos videos={studioVideos} />
        </div>
      </section>

      <HomeCmsHighlights talentsSection={cms.talents} newsSection={cms.news} />

      <section className="information section shell" id="informacion" hidden={!sectionVisible("information")}>
        <div className="information-intro">
          <p className="section-kicker">{text("information","kicker","06 · Información")}</p>
          <h2>{text("information", "title", "Solicita información.")}</h2>
          <p>{text("information", "body", "Cuéntanos qué formación te interesa. Este formulario no inicia una admisión, una valoración ni una matrícula.")}</p>
          <div className="information-note"><span>Dos propuestas</span><strong>MASTER DUB · Formación Anual</strong><small>Acceso adaptado al nivel de partida</small></div>
        </div>
        <InformationForm />
      </section>

      <section className="contact" id="contacto" hidden={!sectionVisible("information")}>
        <div className="shell contact-grid">
          <div><p className="section-kicker light">07 · Contacto</p><h2>¿Hablamos?</h2></div>
          <div className="contact-items">
            <p><small>Email</small><strong>{String(settings.email ?? siteConfig.contact.email) || "Disponible próximamente"}</strong></p>
            <p><small>Teléfono</small><strong>{String(settings.phone ?? siteConfig.contact.phone) || "Disponible próximamente"}</strong></p>
            <p><small>Ubicación</small><strong>{String(settings.address ?? siteConfig.contact.address) || `${siteConfig.location} · Dirección por confirmar`}</strong></p>
          </div>
        </div>
      </section>

      <footer hidden={!sectionVisible("footer")}>
        <div className="shell footer-top">
          <a href="#inicio" aria-label={`${brandName}, inicio`}><Brand full name={brandName} logo={brandLogo} strapline={brandStrapline} /></a>
          <p className="footer-identity">{text("footer","descriptor",brandDescriptor)}<br /><small>{text("footer","signature",siteConfig.brand.signature)}</small><br /><span>{text("footer","email",siteConfig.contact.email)}</span></p>
          <nav className="footer-nav" aria-label="Navegación de pie">
            <a href="#master-dub">MASTER DUB</a><a href="#curso">Formación anual</a><a href="#direccion">Profesionales</a><a href="#en-sala">En sala</a><a href="#informacion">Información</a>
          </nav>
          <SocialLinks social={cmsSettings?.data ?? siteConfig.social} />
        </div>
        <div className="shell footer-bottom">
          <p>© {new Date().getFullYear()} {brandName} · {siteConfig.brand.domain}</p>
          <div><a href="/aviso-legal">Aviso legal</a><a href="/politica-de-privacidad">Privacidad</a><a href="/politica-de-cookies">Cookies</a></div>
          <p>Material provisional claramente identificado</p>
        </div>
      </footer>
    </main>
  );
}
