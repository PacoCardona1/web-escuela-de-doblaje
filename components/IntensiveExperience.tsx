import Image from "next/image";
import type { CSSProperties } from "react";
import { InformationLink } from "./InformationLink";
import { intensiveConfig } from "../config/intensive";
import type { ImageAsset } from "../config/media";

type IntensiveExperienceProps = {
  image: ImageAsset;
};

export function IntensiveExperience({ image }: IntensiveExperienceProps) {
  const intensive = intensiveConfig;

  return (
    <section className="intensive" id="intensivo" aria-labelledby="intensive-title">
      <div className="intensive-opening">
        <figure className="intensive-image" style={{ "--intensive-position": image.position } as CSSProperties}>
          <Image src={image.src} alt={image.alt} fill sizes="(max-width: 760px) 100vw, 48vw" />
          <figcaption>Fotografía provisional · Pendiente de sustituir</figcaption>
        </figure>

        <div className="intensive-opening-copy">
          <p className="section-kicker light"><span className="rec-dot" /> Intensivo profesional · Acceso mediante valoración</p>
          <h2 id="intensive-title">
            {intensive.headline.lines.map((line) => <span key={line}>{line}</span>)}
            <em>{intensive.headline.emphasis}</em>
          </h2>
          <p className="intensive-director">Dirigido por {intensive.director}</p>
          <p className="intensive-copy">{intensive.introduction}</p>
          <ul className="intensive-experience">
            {intensive.experience.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="intensive-investment">{intensive.investmentStatement}</p>
          <p className="intensive-eligibility">{intensive.eligibility}</p>

          <dl className="intensive-facts">
            {intensive.facts.map((fact) => (
              <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>
            ))}
          </dl>

          <div className="intensive-opening-action">
            <InformationLink className="button button-light" href={intensive.access.href} interest="intensive">{intensive.access.cta} <span>↓</span></InformationLink>
            <strong>{intensive.access.availability}</strong>
          </div>
        </div>
      </div>

      <div className="intensive-story shell">
        <section className="intensive-assessment" aria-labelledby="intensive-assessment-title">
          <header className="intensive-story-heading">
            <p className="intensive-index">01</p>
            <div>
              <p className="section-kicker light">El punto de partida</p>
              <h3 id="intensive-assessment-title">{intensive.assessment.title}</h3>
            </div>
            <p>{intensive.assessment.introduction}</p>
          </header>
          <ol className="intensive-criteria">
            {intensive.assessment.criteria.map((criterion, index) => (
              <li key={criterion}><span>{String(index + 1).padStart(2, "0")}</span>{criterion}</li>
            ))}
          </ol>
          <div className="intensive-principle">
            <strong>{intensive.assessment.principle}</strong>
            <p>{intensive.assessment.conclusion}</p>
          </div>
        </section>

        <section className="intensive-call-sheet" aria-labelledby="intensive-call-sheet-title">
          <header className="intensive-story-heading">
            <p className="intensive-index">02</p>
            <div>
              <p className="section-kicker light">Material y personaje</p>
              <h3 id="intensive-call-sheet-title">{intensive.callSheet.title}</h3>
            </div>
            <p>{intensive.callSheet.introduction}</p>
          </header>
          <ol className="genre-sequence" aria-label="Géneros de trabajo">
            {intensive.callSheet.genres.map((genre, index) => (
              <li key={genre}><span>{String(index + 1).padStart(2, "0")}</span><strong>{genre}</strong></li>
            ))}
          </ol>
          <div className="register-sequence" aria-label="Registros interpretativos">
            <span>Registros</span>
            {intensive.callSheet.registers.map((register) => <strong key={register}>{register}</strong>)}
          </div>
        </section>

        <section className="intensive-days" aria-label="Recorrido de los dos días">
          {intensive.days.map((day) => (
            <article className={`intensive-day day-${day.id}`} key={day.id}>
              <header>
                <span>{day.id}</span>
                <div><p>{day.label}</p><h3>{day.title}</h3></div>
              </header>
              <p className="intensive-day-intro">{day.introduction}</p>
              <ol>
                {day.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span>{step}</li>)}
              </ol>
              {"statement" in day && <blockquote>{day.statement}</blockquote>}
            </article>
          ))}
        </section>

        <section className="intensive-direction" aria-labelledby="intensive-direction-title">
          <div>
            <p className="section-kicker light"><span className="rec-dot" /> Supervisión de todo el proceso</p>
            <h3 id="intensive-direction-title">{intensive.direction.title}</h3>
            <p className="intensive-direction-name">{intensive.director}</p>
          </div>
          <div>
            <p>{intensive.direction.introduction}</p>
            <ol>
              {intensive.direction.responsibilities.map((responsibility, index) => (
                <li key={responsibility}><span>{String(index + 1).padStart(2, "0")}</span>{responsibility}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="intensive-after" aria-labelledby="intensive-after-title">
          <header>
            <p className="intensive-index">03</p>
            <div><p className="section-kicker light">Orientación profesional</p><h3 id="intensive-after-title">{intensive.afterAtril.title}</h3></div>
          </header>
          <div className="intensive-after-copy">
            <p>{intensive.afterAtril.introduction}</p>
            <ol>
              {intensive.afterAtril.guidance.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}
            </ol>
            <strong>{intensive.afterAtril.disclaimer}</strong>
          </div>
        </section>

        <section className="intensive-directory" aria-labelledby="intensive-directory-title">
          <p className="section-kicker light">Futuro directorio de talento</p>
          <div>
            <h3 id="intensive-directory-title">{intensive.directory.title}</h3>
            <div>
              <p>{intensive.directory.description}</p>
              <small>{intensive.directory.status}</small>
            </div>
          </div>
        </section>

        <section className="intensive-access" id="intensive-access" aria-labelledby="intensive-access-title">
          <div>
            <p className="section-kicker light"><span className="rec-dot" /> Proceso independiente del Curso Anual</p>
            <h3 id="intensive-access-title">{intensive.access.title}</h3>
          </div>
          <div>
            <strong>{intensive.access.availability}</strong>
            <p>{intensive.access.description}</p>
            <InformationLink className="button button-light" href={intensive.access.href} interest="intensive">{intensive.access.cta} <span>↓</span></InformationLink>
            <small className="intensive-access-status">{intensive.access.status}</small>
          </div>
        </section>
      </div>
    </section>
  );
}
