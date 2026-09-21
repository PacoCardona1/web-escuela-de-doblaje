# MASTER DUB

Web de **MASTER DUB · Escuela de Doblaje · Sevilla**, creada y dirigida por Paco Cardona. El proyecto está construido con React, TypeScript y vinext, con un endpoint servidor para el formulario público integrado con Resend.

## Requisitos

- Node.js 22.13 o superior
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

La terminal mostrará la dirección local, normalmente `http://localhost:3000`.

## Comprobaciones

```bash
npm run build
npm run lint
npm test
```

## Personalización centralizada

Los datos de identidad y contenidos generales están en [`config/site.ts`](config/site.ts):

- nombre, descriptor, firma, dominio, email previsto y assets de marca;
- ubicación y datos de contacto;
- fechas y condiciones del curso anual;
- redes y datos legales pendientes.

La experiencia MASTER DUB se gestiona desde [`config/intensive.ts`](config/intensive.ts), incluyendo datos, valoración previa y preparación del futuro directorio de talento. El formulario público y su futura integración se modelan en [`config/information.ts`](config/information.ts). El equipo se gestiona desde [`config/faculty.ts`](config/faculty.ts). Las fotografías integradas en las secciones, los vídeos de “En sala” y los testimonios futuros se gestionan desde [`config/media.ts`](config/media.ts). El componente [`components/Brand.tsx`](components/Brand.tsx) centraliza la representación de marca en cabecera, pie y páginas legales.

El enlace de acceso a alumnos y las URLs oficiales de Instagram, TikTok y YouTube también están centralizados en `config/site.ts`. No se publica ningún enlace provisional de Facebook. Mientras una URL permanezca vacía, la interfaz muestra un estado pendiente no interactivo y no genera enlaces rotos.

El formulario envía solicitudes a `info@masterdub.es` mediante Resend. La clave `RESEND_API_KEY` debe existir exclusivamente como secreto del entorno alojado en OpenAI Sites y, para desarrollo local, en un archivo `.env` ignorado por Git. Nunca debe incluirse en el repositorio ni exponerse al cliente.

## Imágenes y contenidos pendientes

Las imágenes de `public/images/` son provisionales y están identificadas como tales dentro de la web. Para sustituirlas por fotografías reales de la sala, el atril, la pantalla, el micrófono, la dirección, el alumnado o el control técnico:

1. Añadir el archivo optimizado a `public/images/`.
2. Actualizar `src`, `alt` y `position` en `config/media.ts` según la sección en la que deba aparecer.
3. Para retratos del equipo, actualizar `photo`, `photoAlt` y `photoPosition` en `config/faculty.ts`.

Los vídeos se incorporarán en `mediaConfig.videos`, completando `src`, `poster`, `captions`, `title`, `description`, `duration` y `accessibilityLabel`. Los testimonios reales se añadirán a `mediaConfig.testimonials` con nombre, edición o curso, comentario, destacado opcional y fotografía opcional. Los vídeos se muestran con controles, requieren subtítulos cuando se incorporen y nunca se reproducen automáticamente.

También permanecen deliberadamente pendientes:

- vídeos reales de clases;
- testimonios verificables;
- fotografías definitivas de cualquier profesional invitado que todavía figure como «Por confirmar»;
- dirección y teléfono públicos, cuando la escuela decida publicarlos;
- activación del dominio y del correo `info@masterdub.es`;
- adaptación de `public/og.png` a la identidad MASTER DUB antes de volver a declararla en metadata social.

## Consentimiento para contenido promocional

Antes de publicar fotografías, vídeos o testimonios identificables de alumnos o antiguos alumnos, la escuela deberá contar con la autorización correspondiente para su uso promocional. Este proyecto no incluye todavía un sistema de consentimiento, almacenamiento de autorizaciones ni textos legales para ese uso.

## Pendiente antes de publicación

- Datos legales de la persona o entidad responsable.
- Política de privacidad definitiva.
- Política de cookies definitiva.
- Aviso legal definitivo.
- Canal de contacto para ejercer derechos sobre datos personales.
- Revisión de las cookies y servicios de terceros realmente utilizados.
- Consentimiento específico para el uso promocional de fotografías, vídeos y testimonios de alumnos.

## Captación pública y futura Gestión Escuela

La web pública utiliza un único formulario sencillo para solicitar información. No gestiona admisiones, matrículas, entrevistas ni pruebas de acceso. Su endpoint valida los datos en servidor y entrega cada solicitud por correo mediante Resend; no guarda los datos en una base de datos.

Cuando se conecte con “Gestión Escuela”, cada envío podrá crear un registro de **Nuevo contacto / candidato potencial** con origen web, formación de interés, datos de contacto, mensaje, preferencia de contacto y fecha. Esa integración no está implementada todavía.

### Modelo conceptual de candidato conservado

El antiguo formulario público de cinco pasos se retira, pero su modelo de información se conserva como referencia para una futura ficha de candidato y entrevista previa dentro de “Gestión Escuela”:

- datos personales y de contacto;
- experiencia y formación previa;
- intereses interpretativos y vocales;
- objetivos de formación;
- disponibilidad;
- perfil pedagógico y motivación;
- expectativas profesionales.

Este modelo pertenece al proceso interno posterior. No debe volver a solicitarse en la web pública ni interpretarse como una admisión o matrícula iniciada online.

## CMS público de MASTER DUB

El repositorio contiene una primera arquitectura completa para administrar exclusivamente el contenido público desde `/admin`:

- D1 (`DB`) almacena borradores, publicaciones, orden, visibilidad, papelera, autorizaciones e historial textual.
- R2 (`BUCKET`) almacena imágenes del CMS; los vídeos, audios y dossiers de talentos se referencian mediante URL externa.
- `/admin` y `/api/cms/*` requieren identidad de Sites y autorización server-side mediante `CMS_ADMIN_EMAILS`.
- Paco Cardona, Ahimsa Sánchez y las secciones esenciales se siembran como registros protegidos; los profesionales invitados se gestionan en la misma colección, con placeholder hasta disponer de retrato.
- el contenido actual del repositorio sigue siendo el fallback público, de modo que activar el almacenamiento no cambia la Home hasta inicializar y publicar contenido.
- las rutas públicas disponibles son `/noticias`, `/noticias/<slug>`, `/talentos` y `/<slug-del-talento>`.
- los perfiles de talento ofrecen las plantillas controladas `cinema`, `editorial` y `studio`; los campos vacíos no se renderizan.
- YouTube se carga con `youtube-nocookie.com` únicamente tras interacción explícita.
- los editores de Web, Talentos, Profesionales, Noticias, Multimedia y Ajustes utilizan formularios visuales específicos; la estructura interna nunca se muestra como JSON al administrador.
- el selector de imágenes reutilizable permite buscar, previsualizar, subir y asociar archivos existentes desde cualquier editor.
- las imágenes JPEG/WebP grandes se reducen en el navegador a un máximo de 2400 px y se convierten a WebP con calidad alta antes de enviarse a R2. PNG y AVIF se conservan para no perder transparencia ni características del original.
- la biblioteca registra dimensiones, peso y asociaciones conocidas. Los vídeos y audios se guardan como enlaces externos; no se suben archivos audiovisuales pesados a R2.
- los talentos publicados pueden generar y descargar localmente un QR a `https://masterdub.es/<slug>` sin utilizar servicios externos.

### Activación pendiente en Sites

1. Revisar y autorizar el commit; no incluir `.dev.vars`, secretos ni datos de prueba.
2. En el proyecto de Sites, provisionar/conectar un recurso D1 al binding lógico `DB` y un bucket R2 al binding lógico `BUCKET`, exactamente como declara `.openai/hosting.json`.
3. Configurar `CMS_ADMIN_EMAILS` como variable solo de servidor con los emails autorizados separados por comas. Confirmar que `CMS_DEV_BYPASS` no existe o no vale `true` en el entorno alojado.
4. Mantener `RESEND_API_KEY` como secreto de servidor ya existente; no copiarlo al repositorio ni a variables públicas.
5. Publicar la versión autorizada. El flujo de Sites aplica las migraciones de `drizzle/` antes de subir el Worker; comprobar que `0000_masterdub_cms.sql` figura como aplicada y no modificar después ese archivo aplicado.
6. Abrir `/admin`, iniciar sesión con ChatGPT usando una cuenta incluida en `CMS_ADMIN_EMAILS` y comprobar que una cuenta no incluida recibe 403.
7. Si D1 está vacío, pulsar **Inicializar CMS** una sola vez. El endpoint rechaza la operación si ya existen registros y no sobrescribe contenido.
8. Verificar en borrador un cambio inocuo, publicarlo y confirmar su efecto público; subir una imagen de prueba, reutilizarla y retirarla después mediante Papelera.
9. Comprobar `/`, `/talentos`, `/noticias`, un perfil, una noticia, el formulario de información y el responsive antes de considerar cerrada la activación.

Para ensayar D1 exclusivamente en local, construir primero el proyecto y aplicar la migración contra el estado local de Wrangler:

```bash
./node_modules/.bin/wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_masterdub_cms.sql
```

Este comando no debe ejecutarse sin `--local` durante una revisión local. La semilla editorial no forma parte de la migración: se crea únicamente desde **Inicializar CMS**.

Para desarrollo local puede copiarse `.dev.vars.example` a `.dev.vars` y activar `CMS_DEV_BYPASS=true`. Este bypass solo se acepta para `localhost`/`127.0.0.1` y nunca debe configurarse en producción.

## Arquitectura del directorio de talento

El directorio público y su modelo CMS están implementados, aunque requieren activar D1/R2 para persistir contenido. `config/intensive.ts` conserva separados los siguientes estados de negocio:

1. Alumno de la escuela.
2. Participante de MASTER DUB.
3. Perfil considerado preparado para el directorio.
4. Consentimiento voluntario para formar parte del directorio.
5. Perfil público o promocionable.

La participación en una formación no activa automáticamente los estados posteriores. En particular, un perfil no podrá publicarse sin una valoración independiente, la voluntad de la persona y una autorización específica de publicación.

La estructura futura `FutureTalentProfile` contempla nombre profesional, fotografía, perfil vocal, idiomas o acentos cuando proceda, demos, especialidades, contacto profesional y autorización de publicación. No contiene datos personales reales ni implica todavía almacenamiento, visibilidad pública o acceso por parte de terceros.

## Estructura principal

- `app/page.tsx`: portada completa y contenido principal.
- `app/globals.css`: sistema visual, responsive y accesibilidad de movimiento.
- `app/*legal*/page.tsx`: páginas legales provisionales.
- `components/`: marca, formulario, medios, enlaces configurables y layout legal reutilizables.
- `config/site.ts`: identidad, cursos y datos generales.
- `config/information.ts`: formulario público y contrato futuro con Gestión Escuela.
- `config/intensive.ts`: contenido de MASTER DUB y arquitectura futura del directorio de talento.
- `config/faculty.ts`: perfiles y fotografías del equipo docente.
- `config/media.ts`: fotografías de sección, vídeos, testimonios y créditos.
- `public/brand/`: logo oficial optimizado y derivado fiel de su símbolo para favicon.
- `public/images/`: fotografías provisionales.

## Publicación

La web pública existente está desplegada en `masterdub.es`. Los cambios de CMS descritos aquí permanecen únicamente en el árbol de trabajo hasta que se autorice expresamente su commit y despliegue.
