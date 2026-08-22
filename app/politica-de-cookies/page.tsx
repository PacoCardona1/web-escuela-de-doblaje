import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: `Política de cookies | ${siteConfig.brand.name}` };

export default function Page() {
  return (
    <LegalPage title="Política de cookies">
      <h2>Uso de cookies</h2>
      <p>La web no incorpora por ahora herramientas de analítica, publicidad ni otros servicios que requieran cookies opcionales.</p>
      <h2>Configuración futura</h2>
      <p>Esta política y, si fuera necesario, el panel de consentimiento se actualizarán antes de añadir servicios de terceros.</p>
    </LegalPage>
  );
}
