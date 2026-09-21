/* eslint-disable @next/next/no-html-link-for-pages -- vinext 1.0.0-beta.2 currently throws while hydrating next/link. */
import { Brand } from "./Brand";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="legal-page">
      <a className="skip-link" href="#legal-content">Saltar al contenido principal</a>
      <header className="legal-header shell">
        <a href="/"><Brand dark /></a>
        <a href="/" className="back-link">← Volver a la web</a>
      </header>
      <article className="legal-content narrow-shell" id="legal-content">
        <p className="section-kicker">Información legal</p>
        <h1>{title}</h1>
        {children}
      </article>
    </main>
  );
}
