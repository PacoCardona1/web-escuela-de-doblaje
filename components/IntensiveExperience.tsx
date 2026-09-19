import Image from "next/image";
import type { CSSProperties } from "react";
import { intensiveConfig } from "../config/intensive";
import type { ImageAsset } from "../config/media";
import { InformationLink } from "./InformationLink";

type IntensiveExperienceProps = {
  image: ImageAsset;
  lanyard: ImageAsset;
};

export function IntensiveExperience({ image, lanyard }: IntensiveExperienceProps) {
  const masterDub = intensiveConfig;

  return (
    <section className="master-dub" id="master-dub" aria-labelledby="master-dub-title">
      <div className="master-dub-opening shell">
        <div className="master-dub-copy">
          <p className="section-kicker light"><span className="rec-dot" />{masterDub.eyebrow}</p>
          <h2 id="master-dub-title">{masterDub.headline}</h2>
          <p className="master-dub-intro">{masterDub.introduction}</p>
          <p className="master-dub-eligibility">{masterDub.eligibility}</p>
          <dl className="master-dub-facts">
            {masterDub.facts.map((fact) => (
              <div key={fact.label}><dd>{fact.value}</dd><dt>{fact.label}</dt></div>
            ))}
          </dl>
          <div className="master-dub-action">
            <InformationLink className="button button-light" href={masterDub.access.href} interest="intensive">
              {masterDub.access.cta} <span>↓</span>
            </InformationLink>
            <strong>{masterDub.access.availability}</strong>
          </div>
        </div>

        <figure className="master-dub-image" style={{ "--master-dub-position": image.position, "--master-dub-mobile-position": image.mobilePosition } as CSSProperties}>
          <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 760px) 100vw, 46vw" />
        </figure>
      </div>

      <div className="master-dub-method shell">
        <article>
          <p className="section-kicker light">{masterDub.preparation.eyebrow}</p>
          <h3>{masterDub.preparation.title}</h3>
          <p>{masterDub.preparation.description}</p>
          <ul className="master-dub-tags">
            {masterDub.preparation.criteria.map((criterion) => <li key={criterion}>{criterion}</li>)}
          </ul>
          <strong className="master-dub-principle">{masterDub.preparation.principle}</strong>
        </article>

        <article className="master-dub-work">
          <p className="section-kicker light">{masterDub.work.eyebrow}</p>
          <h3>{masterDub.work.title}</h3>
          <p>{masterDub.work.description}</p>
          <ul className="master-dub-dynamics">
            {masterDub.work.dynamics.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <p className="master-dub-adaptation">{masterDub.work.adaptation}</p>
          <p className="master-dub-genres"><span>Material</span>{masterDub.work.genres.join(" · ")}</p>
        </article>

        <article>
          <p className="section-kicker light">{masterDub.outcome.eyebrow}</p>
          <h3>{masterDub.outcome.title}</h3>
          <p>{masterDub.outcome.description}</p>
          <ul className="master-dub-tags">
            {masterDub.outcome.assessment.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <div className="master-dub-accreditation">
            <strong>{masterDub.outcome.accreditation}</strong>
            <p>{masterDub.outcome.observerNote}</p>
            <small>{masterDub.outcome.disclaimer}</small>
          </div>
          <figure className="master-dub-lanyard" style={{ "--master-dub-lanyard-position": lanyard.position } as CSSProperties}>
            <Image src={lanyard.src} alt={lanyard.alt} fill sizes="(max-width: 760px) 100vw, 24vw" />
            <figcaption>Una experiencia dentro de la profesión</figcaption>
          </figure>
        </article>
      </div>

      <aside className="master-dub-direction shell" aria-label="Dirección de MASTER DUB">
        <p>Dirección · {masterDub.director}</p>
        <h3>{masterDub.direction.title}</h3>
        <p>{masterDub.direction.description}</p>
      </aside>
    </section>
  );
}
