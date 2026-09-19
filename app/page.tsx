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

const annualPrinciples = [
  "Trabajo desde el atril",
  "Dirección profesional",
  "Material seleccionado",
  "Seguimiento individual",
];

export default function Home() {
  const { annualCourse } = siteConfig;
  const { images } = mediaConfig;

  return (
    <main id="main-content">
      <a className="skip-link" href="#master-dub">Saltar al contenido principal</a>
      <section className="hero" id="inicio" style={{ "--hero-image": `url(${images.hero.src})`, "--hero-position": images.hero.position, "--hero-mobile-position": images.hero.mobilePosition } as React.CSSProperties}>
        <div className="hero-shade" />
        <nav className="nav shell" aria-label="Navegación principal">
          <a href="#inicio" aria-label={`${siteConfig.brand.name}, inicio`}><Brand /></a>
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
          <p className="eyebrow"><span /> {siteConfig.brand.descriptor}</p>
          <h1>Aprende doblaje.<br /><em>Trabaja como se trabaja en sala.</em></h1>
          <p className="hero-copy">Formación ante el atril, dentro del entorno profesional del doblaje y bajo la dirección de profesionales en activo.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#informacion">Solicita información <span>↗</span></a>
            <a className="button button-ghost" href="#en-sala">En sala <span>↓</span></a>
          </div>
        </div>
        <div className="hero-facts shell" aria-label="Datos principales de MASTER DUB">
          <div><small>MASTER DUB</small><strong>{intensiveConfig.facts[0].value} participantes</strong></div>
          <div><small>Trabajo efectivo</small><strong>{intensiveConfig.facts[3].value}</strong></div>
          <a href="#master-dub" aria-label="Descubrir MASTER DUB">Descubre MASTER DUB <span>↓</span></a>
        </div>
      </section>

      <IntensiveExperience image={images.masterDub} lanyard={images.masterDubLanyard} />

      <section className="course section shell" id="curso">
        <div className="course-heading">
          <div>
            <p className="section-kicker">02 · Formación anual</p>
            <h2>Construye una base sólida desde el atril.</h2>
          </div>
          <div className="course-lead">
            <p>Para quienes todavía no han trabajado profesionalmente en doblaje o necesitan consolidar su base con tiempo, práctica y seguimiento.</p>
            <p>Cada alumno trabaja con material adaptado progresivamente a su edad, voz, registro, evolución, fortalezas y dificultades.</p>
          </div>
        </div>

        <div className="course-overview compact">
          <figure className="course-photo photo-frame" style={{ "--course-photo-position": images.annualCourse.position, "--course-photo-mobile-position": images.annualCourse.mobilePosition } as React.CSSProperties}>
            <Image src={images.annualCourse.src} alt={images.annualCourse.alt} fill sizes="(max-width: 760px) 100vw, 48vw" />
          </figure>
          <div className="course-details">
            <p className="course-purpose">Cada take tiene un propósito formativo.</p>
            <ul className="annual-principles">
              {annualPrinciples.map((principle, index) => <li key={principle}><span>{String(index + 1).padStart(2, "0")}</span>{principle}</li>)}
            </ul>
            <dl className="course-facts compact-facts">
              <div><dt>Calendario</dt><dd>{annualCourse.period}</dd></div>
              <div><dt>Ritmo</dt><dd>{annualCourse.weeklySchedule}</dd></div>
              <div><dt>Sesión</dt><dd>{annualCourse.classDuration}</dd></div>
              <div><dt>Grupo</dt><dd>{annualCourse.groupSize}</dd></div>
            </dl>
            <p className="course-access">Entrevista y valoración previa · Plazas limitadas</p>
            <a className="button button-dark" href="#informacion">Solicita información <span>↗</span></a>
          </div>
        </div>

        <div className="annual-areas" aria-label="Áreas de trabajo de la Formación Anual">
          <span>Áreas de trabajo</span>
          <p>{annualCourse.areas.join(" · ")}</p>
        </div>
      </section>

      <section className="facilities section-dark" id="instalaciones" aria-labelledby="facilities-title">
        <div className="shell">
          <div className="facilities-heading">
            <div>
              <p className="section-kicker light">03 · {mediaConfig.facilities.eyebrow}</p>
              <h2 id="facilities-title">{mediaConfig.facilities.title}</h2>
            </div>
            <p>{mediaConfig.facilities.description}</p>
          </div>
          <div className="facilities-gallery">
            {[images.facilitiesRoom, images.facilitiesWorkstation, images.facilitiesConsole].map((image) => (
              <figure key={image.src}>
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 100vw, 33vw" style={{ objectPosition: image.position }} />
              </figure>
            ))}
          </div>
          <p className="facilities-credit"><span />{mediaConfig.facilities.collaboration}</p>
        </div>
      </section>

      <section className="direction section-dark" id="direccion">
        <div className="shell">
          <header className="faculty-heading compact-heading">
            <div>
              <p className="section-kicker light">04 · Profesionales</p>
              <h2>Dirección conocida.<br /><em>Seguimiento cercano.</em></h2>
            </div>
          </header>

          <div className="faculty-list compact-faculty" aria-label="Profesionales de la formación">
          {facultyConfig.profiles.map((profile, index) => (
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
            <div><p className="section-kicker">Equipo ampliado</p><h3 id="invited-title">{facultyConfig.invited.title}</h3></div>
            <p>{facultyConfig.invited.introduction}</p>
          </header>
          <div className="invited-grid">
            {facultyConfig.invited.placeholders.map((id) => (
              <article className="invited-profile is-pending" key={id}>
                <figure>
                  <Image src={facultyConfig.placeholderPhoto} alt="" fill sizes="(max-width: 760px) 44vw, 20vw" />
                  <i aria-hidden="true">{id}</i>
                </figure>
                <strong>Por confirmar</strong>
                <span>Profesional invitado</span>
              </article>
            ))}
          </div>
          </aside>
        </div>
      </section>

      <section className="videos section-muted" id="en-sala">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="section-kicker">05 · En sala</p><h2>Así se trabaja.</h2></div>
            <p>Aquí irán los vídeos que muestran cómo se trabaja. Próximamente se sustituirá el material provisional por imágenes reales de MASTER DUB.</p>
          </div>
          <WorkVideos />
        </div>
      </section>

      <section className="information section shell" id="informacion">
        <div className="information-intro">
          <p className="section-kicker">06 · Información</p>
          <h2>Solicita<br /><em>información.</em></h2>
          <p>Cuéntanos qué formación te interesa. Este formulario no inicia una admisión, una valoración ni una matrícula.</p>
          <div className="information-note"><span>Dos propuestas</span><strong>MASTER DUB · Formación Anual</strong><small>Acceso adaptado al nivel de partida</small></div>
        </div>
        <InformationForm />
      </section>

      <section className="contact" id="contacto">
        <div className="shell contact-grid">
          <div><p className="section-kicker light">07 · Contacto</p><h2>¿Hablamos?</h2></div>
          <div className="contact-items">
            <p><small>Email</small><strong>{siteConfig.contact.email || "Disponible próximamente"}</strong></p>
            <p><small>Teléfono</small><strong>{siteConfig.contact.phone || "Disponible próximamente"}</strong></p>
            <p><small>Ubicación</small><strong>{siteConfig.contact.address || `${siteConfig.location} · Dirección por confirmar`}</strong></p>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer-top">
          <a href="#inicio" aria-label={`${siteConfig.brand.name}, inicio`}><Brand full /></a>
          <p className="footer-identity">{siteConfig.brand.descriptor}<br /><small>{siteConfig.brand.signature}</small><br /><span>{siteConfig.contact.email}</span></p>
          <nav className="footer-nav" aria-label="Navegación de pie">
            <a href="#master-dub">MASTER DUB</a><a href="#curso">Formación anual</a><a href="#direccion">Profesionales</a><a href="#en-sala">En sala</a><a href="#informacion">Información</a>
          </nav>
          <SocialLinks />
        </div>
        <div className="shell footer-bottom">
          <p>© {new Date().getFullYear()} {siteConfig.brand.name} · {siteConfig.brand.domain}</p>
          <div><a href="/aviso-legal">Aviso legal</a><a href="/politica-de-privacidad">Privacidad</a><a href="/politica-de-cookies">Cookies</a></div>
          <p>Material provisional claramente identificado</p>
        </div>
      </footer>
    </main>
  );
}
