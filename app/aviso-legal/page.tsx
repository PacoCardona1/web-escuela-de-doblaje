import type { Metadata } from "next";
import { LegalPage } from "../../components/LegalPage";
import { siteConfig } from "../../config/site";

export const metadata: Metadata = { title: `Aviso legal | ${siteConfig.brand.name}` };

export default function Page() {
  const { brand, contact, legal } = siteConfig;

  return (
    <LegalPage title="Aviso legal">
      <p className="legal-updated">Última actualización: 19 de septiembre de 2026</p>

      <h2>1. Identificación del titular</h2>
      <dl className="legal-data">
        <div><dt>Titular</dt><dd>{legal.owner}</dd></div>
        <div><dt>NIF</dt><dd>{legal.taxId}</dd></div>
        <div><dt>Domicilio</dt><dd>{legal.address}</dd></div>
        <div><dt>Correo electrónico</dt><dd>{contact.email}</dd></div>
        <div><dt>Sitio web</dt><dd>{brand.domain}</dd></div>
      </dl>

      <h2>2. Objeto del sitio web</h2>
      <p>Este sitio ofrece información sobre MASTER DUB, sus propuestas de formación en doblaje y sus vías de contacto. La información publicada tiene carácter general y no formaliza por sí sola una matrícula, contratación o relación profesional.</p>

      <h2>3. Condiciones de utilización</h2>
      <p>El acceso al sitio implica utilizarlo de forma lícita, diligente y respetuosa con los derechos de terceros. No está permitido emplear la web para introducir código malicioso, alterar su funcionamiento, intentar acceder sin autorización a sistemas o datos, ni realizar actividades contrarias a la ley.</p>
      <p>La persona usuaria es responsable de que los datos que facilite sean exactos, pertinentes y propios, y de no incluir información de terceros sin autorización.</p>

      <h2>4. Propiedad intelectual e industrial</h2>
      <p>Los textos, elementos gráficos, fotografías, vídeos, diseño, estructura, marcas y demás contenidos del sitio están protegidos por la normativa aplicable y pertenecen a su titular o se utilizan con la autorización correspondiente. El acceso a la web no concede derechos de explotación sobre esos contenidos.</p>
      <p>No se permite reproducir, distribuir, transformar, comunicar públicamente o explotar los contenidos fuera de los límites legalmente admitidos sin autorización previa. Los signos y contenidos pertenecientes a terceros conservan la titularidad que les corresponda.</p>

      <h2>5. Responsabilidad sobre contenidos y disponibilidad</h2>
      <p>Se procura que la información sea clara, actual y correcta. No obstante, puede ser modificada o actualizada y no se garantiza que el sitio esté disponible de forma ininterrumpida ni libre de errores. Podrá suspenderse temporalmente el acceso por mantenimiento, seguridad o causas técnicas.</p>
      <p>El titular no responde del uso contrario a estas condiciones, de las decisiones adoptadas exclusivamente a partir de información general del sitio ni de daños causados por actuaciones de terceros fuera de su control razonable.</p>

      <h2>6. Enlaces externos</h2>
      <p>Los enlaces a sitios de terceros se facilitan únicamente como referencia. El titular no controla sus contenidos, disponibilidad o políticas y no asume responsabilidad por ellos, salvo en los casos previstos legalmente. La inclusión de un enlace no implica aprobación ni relación comercial.</p>

      <h2>7. Legislación aplicable</h2>
      <p>Este aviso se rige por la legislación española. Cualquier controversia se resolverá conforme a las normas imperativas aplicables sobre competencia y jurisdicción, respetando en todo caso los derechos que correspondan a consumidores y usuarios.</p>
    </LegalPage>
  );
}
