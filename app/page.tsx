import { InformationForm } from "../components/InformationForm";
import { Brand } from "../components/Brand";
import { IntensiveExperience } from "../components/IntensiveExperience";
import { Testimonials, WorkVideos } from "../components/MediaShowcase";
import { MobileMenu } from "../components/MobileMenu";
import { SocialLinks, StudentAccess } from "../components/SiteLinks";
import { facultyConfig, facultyTypeLabels } from "../config/faculty";
import { mediaConfig } from "../config/media";
import { siteConfig } from "../config/site";
import Image from "next/image";

const process = ["Entrar al atril", "Interpretar", "Recibir dirección", "Repetir", "Comprender", "Evolucionar"];

export default function Home() {
  const { annualCourse } = siteConfig;
  const { images } = mediaConfig;

  return (
    <main id="main-content">
      <a className="skip-link" href="#curso">Saltar al contenido principal</a>
      <section className="hero" id="inicio" style={{ "--hero-image": `url(${images.hero.src})`, "--hero-position": images.hero.position, "--hero-mobile-position": images.hero.mobilePosition } as React.CSSProperties}>
        <div className="hero-shade" />
        <nav className="nav shell" aria-label="Navegación principal">
          <a href="#inicio" aria-label={`${siteConfig.brand.name}, inicio`}><Brand /></a>
          <div className="nav-links">
            <a href="#curso">Curso anual</a>
            <a href="#metodologia">Metodología</a>
            <a href="#intensivo">Intensivo</a>
            <a href="#direccion">Dirección</a>
            <a className="nav-cta" href="#informacion">Información</a>
            <StudentAccess />
          </div>
          <MobileMenu />
        </nav>
        <div className="hero-content shell">
          <p className="eyebrow"><span /> Formación de doblaje en {siteConfig.location}</p>
          <h1>Aprende doblaje.<br /><em>Trabaja en sala.</em></h1>
          <p className="hero-copy">Una formación práctica para entender el oficio desde el atril, con dirección y seguimiento individual.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#informacion">Solicita información <span>↗</span></a>
            <a className="button button-ghost" href="#curso">Conocer el curso <span>↓</span></a>
          </div>
        </div>
        <div className="hero-facts shell" aria-label="Datos principales del curso">
          <div><small>Curso anual</small><strong>{annualCourse.period}</strong></div>
          <div><small>Trabajo en sala</small><strong>{annualCourse.groupSize}</strong></div>
          <a href="#curso" aria-label="Bajar al contenido">Descubre el curso <span>↓</span></a>
        </div>
      </section>

      <section className="course section shell" id="curso">
        <div className="section-heading">
          <p className="section-kicker">01 · Curso anual</p>
          <h2>El atril no se aprende<br />desde una silla.</h2>
        </div>
        <div className="course-overview">
          <div className="course-details">
            <div className="course-lead">
              <p>Una formación práctica y progresiva. El alumno pasa tiempo real trabajando ante el atril, recibe dirección y aprende a transformar cada indicación en una decisión interpretativa.</p>
              <p>El seguimiento es continuado durante todo el curso, dentro de un grupo fijo y reducido.</p>
              <p>Las plazas son limitadas. Antes de incorporarse, la escuela realiza una entrevista y valoración fuera de la web pública.</p>
              <a className="button button-dark" href="#informacion">Solicita información <span>↗</span></a>
            </div>
            <div className="course-facts">
              <article><span>01</span><strong>{annualCourse.weeklySchedule}</strong><p>Un ritmo constante para integrar lo aprendido.</p></article>
              <article><span>02</span><strong>{annualCourse.classDuration}</strong><p>Tiempo de trabajo compartido y atención individual.</p></article>
              <article><span>03</span><strong>Grupos fijos</strong><p>Una dinámica de sala estable durante el curso.</p></article>
              <article><span>04</span><strong>{annualCourse.groupSize}</strong><p>Más tiempo ante el atril y seguimiento cercano.</p></article>
            </div>
          </div>
          <div className="course-photo photo-frame">
            <Image src={images.annualCourse.src} alt={images.annualCourse.alt} fill sizes="(max-width: 760px) 100vw, 50vw" style={{ objectPosition: images.annualCourse.position }} />
            <span>Fotografía provisional · Pendiente de sustituir</span>
          </div>
        </div>
        <div className="areas">
          <div>
            <p className="section-kicker">Áreas de trabajo</p>
            <h3>Construir oficio,<br /><em>paso a paso.</em></h3>
          </div>
          <ol>
            {annualCourse.areas.map((area, index) => <li key={area}><span>{String(index + 1).padStart(2, "0")}</span>{area}</li>)}
          </ol>
        </div>
      </section>

      <section className="method section-dark" id="metodologia">
        <div className="shell">
          <p className="section-kicker light">02 · Metodología</p>
          <div className="method-title">
            <h2>Aprender<br /><em>haciendo.</em></h2>
            <p>La sala obliga a tomar decisiones. La dirección ayuda a entenderlas, afinarlas y volver a probar.</p>
          </div>
          <div className="process" aria-label="Proceso de aprendizaje">
            {process.map((step, index) => (
              <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < process.length - 1 && <i aria-hidden="true">→</i>}</div>
            ))}
          </div>
          <div className="method-grid">
            <div className="photo-frame dark-frame">
              <Image src={images.methodology.src} alt={images.methodology.alt} fill sizes="(max-width: 760px) 100vw, 58vw" style={{ objectPosition: images.methodology.position }} />
              <span>Imagen de referencia · Pendiente de sustituir</span>
            </div>
            <div className="tracking-note">
              <span className="line-symbol" aria-hidden="true" />
              <p className="section-kicker light">Seguimiento continuado</p>
              <h3>No se trata solo de repetir. Se trata de comprender qué modificar.</h3>
              <p>El progreso se trabaja de forma individual dentro del grupo, atendiendo a la interpretación, la técnica y la capacidad de aplicar indicaciones.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="videos section shell" id="videos">
        <div className="section-heading split-heading">
          <div><p className="section-kicker">03 · Así se trabaja</p><h2>La sala,<br /><em>sin filtros.</em></h2></div>
          <p>Este espacio mostrará próximamente fragmentos reales de clases, dirección y trabajo ante el atril.</p>
        </div>
        <WorkVideos />
      </section>

      <IntensiveExperience image={images.intensive} />

      <section className="direction section shell" id="direccion">
        <header className="faculty-heading">
          <div>
            <p className="section-kicker">04 · Dirección y profesorado</p>
            <h2>Una escuela creada<br />y dirigida por<br /><em>Paco Cardona.</em></h2>
          </div>
          <p>La escuela mantiene una identidad propia y una formación construida desde el trabajo real en sala.</p>
        </header>

        <div className="faculty-list" aria-label="Profesorado estable del Curso Anual">
          {facultyConfig.profiles.map((profile, index) => (
            <article className={`faculty-profile is-${profile.type}`} key={profile.name}>
              <figure className="faculty-portrait" style={{ "--faculty-position": profile.photoPosition } as React.CSSProperties}>
                <Image src={profile.photo} alt={profile.photoAlt} fill sizes="(max-width: 760px) 100vw, 56vw" />
                <span className="faculty-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <figcaption>Fotografía provisional · No representa a {profile.name}</figcaption>
              </figure>
              <div className="faculty-copy">
                <p className="faculty-type"><span />{facultyTypeLabels[profile.type]}</p>
                <h3>{profile.name}</h3>
                <p className="faculty-role">{profile.role}</p>
                <p className="faculty-introduction">{profile.introduction}</p>
              </div>
            </article>
          ))}
        </div>

        <aside className="invited-faculty" aria-labelledby="invited-title">
          <header className="invited-heading">
            <div>
            <p className="section-kicker">Equipo ampliado</p>
            <h3 id="invited-title">{facultyConfig.invited.title}</h3>
            </div>
            <p>{facultyConfig.invited.introduction}</p>
          </header>
          <div className="invited-grid">
            {facultyConfig.invited.profiles.length > 0
              ? facultyConfig.invited.profiles.map((profile) => (
                  <article className="invited-profile" key={profile.id}>
                    <figure>
                      {profile.photo
                        ? <Image src={profile.photo} alt={profile.photoAlt} fill sizes="(max-width: 760px) 50vw, 20vw" style={{ objectPosition: profile.photoPosition }} />
                        : <span>Foto pendiente</span>}
                    </figure>
                    <strong>{profile.name}</strong>
                    <span>{profile.specialty}</span>
                    {profile.label && <small>{profile.label}</small>}
                  </article>
                ))
              : facultyConfig.invited.placeholders.map((id) => (
                  <article className="invited-profile is-pending" key={id}>
                    <figure><span>Foto pendiente</span><i aria-hidden="true">{id}</i></figure>
                    <strong>Perfil pendiente</strong>
                    <span>Profesional invitado</span>
                  </article>
                ))}
          </div>
        </aside>
      </section>

      <section className="testimonials section-muted" id="testimonios">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><p className="section-kicker">05 · Testimonios</p><h2>Experiencias<br /><em>en primera persona.</em></h2></div>
            <p>Los testimonios se publicarán cuando podamos mostrar experiencias reales y verificadas de alumnos.</p>
          </div>
          <Testimonials />
        </div>
      </section>

      <section className="information section shell" id="informacion">
        <div className="information-intro">
          <p className="section-kicker">06 · Información</p>
          <h2>Solicita<br /><em>información.</em></h2>
          <p>Cuéntanos qué formación te interesa y cómo podemos ayudarte. Este formulario sirve únicamente para solicitar información: no inicia una admisión, una prueba de acceso ni una matrícula.</p>
          <div className="information-note"><span>Curso Anual</span><strong>{annualCourse.period}</strong><small>{annualCourse.groupSize} · Plazas limitadas</small></div>
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
          <a href="#inicio"><Brand dark /></a>
          <p>Formación práctica de doblaje<br />en {siteConfig.location}.</p>
          <nav className="footer-nav" aria-label="Navegación de pie">
            <a href="#curso">Curso anual</a><a href="#intensivo">Intensivo</a><a href="#direccion">Dirección</a><a href="#informacion">Información</a>
          </nav>
          <SocialLinks />
        </div>
        <div className="shell footer-bottom">
          <p>© {new Date().getFullYear()} {siteConfig.brand.name} · {siteConfig.brand.status === "provisional" ? "Identidad provisional" : siteConfig.brand.status}</p>
          <div><a href="/aviso-legal">Aviso legal</a><a href="/politica-de-privacidad">Privacidad</a><a href="/politica-de-cookies">Cookies</a></div>
          <p>Imágenes provisionales: {mediaConfig.credits.join(" · ")}</p>
        </div>
      </footer>
    </main>
  );
}
