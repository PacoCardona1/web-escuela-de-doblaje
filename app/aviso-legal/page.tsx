import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: `Aviso legal | ${siteConfig.brand.name}` };

export default function Page() {
  return (
    <LegalPage title="Aviso legal">
      <h2>Datos identificativos</h2>
      <p>Este apartado se completará cuando estén definidos la titularidad de la web, el domicilio, los datos fiscales y los canales de contacto oficiales.</p>
      <h2>Condiciones de uso</h2>
      <p>El texto definitivo será revisado y publicado antes de la puesta en producción de la web.</p>
    </LegalPage>
  );
}
