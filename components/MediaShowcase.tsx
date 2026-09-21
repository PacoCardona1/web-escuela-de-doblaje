import Image from "next/image";
import { mediaConfig } from "../config/media";

export function WorkVideos({ videos = mediaConfig.videos }: { videos?: typeof mediaConfig.videos }) {
  return (
    <div className="video-grid">
      {videos.map((video) => (
        <article className="video-card" key={video.id}>
          <div className="video-visual">
            {video.src ? (
              <video controls preload="metadata" poster={video.poster?.src} aria-label={video.accessibilityLabel}>
                <source src={video.src} />
                <track kind="captions" src={video.captions} srcLang="es" label="Español" default />
              </video>
            ) : (
              <div className="video-placeholder" role="img" aria-label={video.accessibilityLabel}>
                {video.poster && <Image src={video.poster.src} alt={video.poster.alt} fill sizes="(max-width: 760px) 100vw, 33vw" style={{ objectPosition: video.poster.position }} />}
                <span className="coming-soon">Próximamente</span>
                <i aria-hidden="true">▶</i>
              </div>
            )}
          </div>
          <div className="video-info">
            <span>{video.id}</span>
            <div>
              <strong>{video.title}</strong>
              <small>{video.description}</small>
            </div>
            {video.duration && <small className="video-duration">{video.duration}</small>}
          </div>
        </article>
      ))}
    </div>
  );
}

export function Testimonials() {
  const hasTestimonials = mediaConfig.testimonials.length > 0;

  return (
    <div className={`testimonial-editorial${hasTestimonials ? " has-content" : " is-pending"}`}>
      {hasTestimonials
        ? mediaConfig.testimonials.map((testimonial) => (
            <article className="testimonial-entry" key={testimonial.id}>
              {testimonial.photo && (
                <figure>
                  <Image src={testimonial.photo.src} alt={testimonial.photo.alt} fill sizes="(max-width: 760px) 100vw, 34vw" style={{ objectPosition: testimonial.photo.position }} />
                </figure>
              )}
              <span className="testimonial-quote" aria-hidden="true">“</span>
              {testimonial.highlight && <p className="testimonial-highlight">{testimonial.highlight}</p>}
              <blockquote><p>{testimonial.comment}</p></blockquote>
              <div className="testimonial-attribution"><strong>{testimonial.name}</strong><small>{testimonial.courseEdition}</small></div>
            </article>
          ))
        : mediaConfig.testimonialPlaceholders.map((placeholder) => (
            <article className="testimonial-entry testimonial-pending" key={placeholder.id}>
              <span className="testimonial-index">{placeholder.id}</span>
              <span className="testimonial-quote" aria-hidden="true">“</span>
              <div>
                <p>{placeholder.label}</p>
                <small>{placeholder.status}</small>
              </div>
            </article>
          ))}
    </div>
  );
}
