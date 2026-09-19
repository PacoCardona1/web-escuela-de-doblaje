import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: `Política de privacidad | ${siteConfig.brand.name}` };

export default function Page() {
  const { legal } = siteConfig;

  return (
    <LegalPage title="Política de privacidad">
      <p className="legal-updated">Última actualización: 20 de septiembre de 2026</p>

      <h2>1. Responsable del tratamiento</h2>
      <dl className="legal-data">
        <div><dt>Responsable</dt><dd>{legal.owner}</dd></div>
        <div><dt>NIF</dt><dd>{legal.taxId}</dd></div>
        <div><dt>Domicilio</dt><dd>{legal.address}</dd></div>
        <div><dt>Contacto de privacidad</dt><dd>{legal.privacyEmail}</dd></div>
      </dl>

      <h2>2. Datos que pueden tratarse</h2>
      <p>Cuando una persona contacta con MASTER DUB pueden tratarse los datos que facilite directamente: nombre y apellidos, correo electrónico, teléfono, formación de interés, preferencia de contacto y contenido de la consulta. También podrán tratarse los datos técnicos mínimos necesarios para mantener la seguridad y el funcionamiento del servicio, como registros de acceso o incidencias.</p>

      <h2>3. Finalidades</h2>
      <p>Los datos se utilizarán para recibir, atender y gestionar solicitudes de información o contacto; responder por el canal indicado; realizar el seguimiento necesario de la consulta; y proteger el formulario y el sitio frente a usos abusivos o fraudulentos.</p>
      <p>No se utilizarán para enviar publicidad, boletines o comunicaciones comerciales ajenas a la solicitud realizada.</p>

      <h2>4. Base jurídica</h2>
      <p>Cuando la consulta se refiera a una posible contratación o matrícula, el tratamiento se basa en la aplicación de medidas precontractuales solicitadas por la persona interesada. Para consultas generales, se basa en el consentimiento manifestado al remitir voluntariamente la solicitud. Las medidas técnicas de seguridad podrán basarse en el interés legítimo de mantener la integridad y protección del sitio, ponderado frente a los derechos de las personas usuarias.</p>

      <h2>5. Conservación</h2>
      <p>Los datos se conservarán durante el tiempo necesario para atender la solicitud y realizar su seguimiento. Después podrán mantenerse bloqueados durante los plazos legalmente exigibles para atender posibles responsabilidades. Cuando dejen de ser necesarios, se eliminarán de forma segura.</p>

      <h2>6. Destinatarios y proveedores</h2>
      <p>No se venden ni ceden datos con fines comerciales. Para entregar las solicitudes remitidas mediante el formulario se utiliza Resend (Plus Five Five, Inc.) como proveedor de correo electrónico, que trata los datos necesarios por cuenta del responsable. También podrán acceder a ellos los proveedores estrictamente necesarios para el alojamiento y la seguridad del sitio, y podrán comunicarse a administraciones públicas, autoridades o tribunales cuando exista una obligación legal.</p>

      <h2>7. Transferencias internacionales</h2>
      <p>El servicio de Resend puede implicar el tratamiento de datos en Estados Unidos. Resend declara aplicar el Marco de Privacidad de Datos UE–EE. UU. y, cuando procede, las cláusulas contractuales tipo aprobadas por la Comisión Europea como garantías para las transferencias internacionales.</p>

      <h2>8. Derechos</h2>
      <p>La persona interesada puede solicitar el acceso a sus datos, su rectificación o supresión, la limitación del tratamiento, oponerse al mismo y pedir la portabilidad cuando proceda. También puede retirar el consentimiento sin que ello afecte a la licitud del tratamiento anterior.</p>
      <p>Para ejercer estos derechos puede escribir a <strong>{legal.privacyEmail}</strong>, indicando el derecho que desea ejercer e incluyendo la información necesaria para identificar su solicitud. Si considera que sus derechos no han sido atendidos, puede presentar una reclamación ante la Agencia Española de Protección de Datos en <a href="https://www.aepd.es" target="_blank" rel="noreferrer">aepd.es</a>.</p>

      <h2>9. Confidencialidad y seguridad</h2>
      <p>Se aplicarán medidas técnicas y organizativas razonables para proteger los datos frente a pérdida, acceso no autorizado, alteración o divulgación. El acceso quedará limitado a quienes necesiten tratar la información para las finalidades descritas.</p>

      <h2>10. Actualizaciones</h2>
      <p>Esta política podrá actualizarse para reflejar cambios legales, técnicos o en el funcionamiento del servicio. La versión vigente y su fecha de actualización estarán disponibles en esta página.</p>
    </LegalPage>
  );
}
