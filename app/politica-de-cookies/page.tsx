import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: `Política de cookies | ${siteConfig.brand.name}` };

export default function Page() {
  return (
    <LegalPage title="Política de cookies">
      <p className="legal-updated">Última actualización: 19 de septiembre de 2026</p>

      <h2>1. Situación actual</h2>
      <p>La aplicación web de MASTER DUB no instala actualmente cookies propias ni de terceros. Tampoco utiliza tecnologías equivalentes para analítica, publicidad o seguimiento de personas usuarias.</p>

      <h2>2. Servicios y tecnologías auditados</h2>
      <p>El sitio no incorpora Google Analytics, Google Tag Manager, Meta Pixel, vídeos embebidos de YouTube o Vimeo, mapas externos, reproductores de terceros, herramientas publicitarias ni sistemas de seguimiento. La aplicación tampoco utiliza almacenamiento local del navegador con fines de seguimiento.</p>

      <h2>3. Cookies técnicas</h2>
      <p>El código actual no crea cookies técnicas. La infraestructura de alojamiento puede procesar datos técnicos imprescindibles para servir la página, mantener la seguridad o prevenir abusos, sin utilizarlos para elaborar perfiles publicitarios.</p>

      <h2>4. Consentimiento</h2>
      <p>Al no existir cookies ni tecnologías no necesarias, no se muestra un banner de consentimiento. Si en el futuro se incorporan servicios que requieran consentimiento, no se cargarán antes de obtenerlo y se ofrecerán opciones equivalentes para aceptar o rechazar.</p>

      <h2>5. Cambios en esta política</h2>
      <p>Esta política se revisará cuando cambien las tecnologías utilizadas por el sitio. La versión vigente y su fecha de actualización permanecerán publicadas en esta página.</p>
    </LegalPage>
  );
}
