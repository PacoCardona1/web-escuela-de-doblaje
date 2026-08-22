import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: `Política de privacidad | ${siteConfig.brand.name}` };

export default function Page() {
  return (
    <LegalPage title="Política de privacidad">
      <h2>Tratamiento de datos</h2>
      <p>La identidad de la persona responsable, la finalidad, la base jurídica, los plazos de conservación y el procedimiento para ejercer derechos se incorporarán cuando el formulario se conecte a un servicio real.</p>
      <h2>Formulario de admisión</h2>
      <p>En esta versión de demostración, el formulario no envía ni almacena datos personales.</p>
    </LegalPage>
  );
}
