import { Brand } from "./Brand";
import Link from "next/link";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <main className="legal-page">
      <a className="skip-link" href="#legal-content">Saltar al contenido principal</a>
      <header className="legal-header shell">
        <Link href="/"><Brand dark /></Link>
        <Link href="/" className="back-link">← Volver a la web</Link>
      </header>
      <article className="legal-content narrow-shell" id="legal-content">
        <p className="section-kicker">Información legal</p>
        <h1>{title}</h1>
        {children}
      </article>
    </main>
  );
}
