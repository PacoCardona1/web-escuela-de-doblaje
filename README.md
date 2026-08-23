# Escuela de Doblaje

Web provisional de una escuela de doblaje en Sevilla. El proyecto está construido con React, TypeScript y vinext, con una arquitectura preparada para crecer sin haber conectado todavía ningún backend ni servicio externo.

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

- nombre provisional y favicon;
- ubicación y datos de contacto;
- fechas y condiciones del curso anual;
- redes y datos legales pendientes.

El Intensivo Profesional se gestiona desde [`config/intensive.ts`](config/intensive.ts), incluyendo datos, narrativa, valoración previa y preparación del futuro directorio de talento. El formulario público y su futura integración se modelan en [`config/information.ts`](config/information.ts). El equipo docente se gestiona desde [`config/faculty.ts`](config/faculty.ts). Las fotografías integradas en las secciones, los vídeos de “Así se trabaja” y los testimonios se gestionan desde [`config/media.ts`](config/media.ts). El componente [`components/Brand.tsx`](components/Brand.tsx) centraliza la representación de marca en cabecera, pie y páginas legales.

El enlace de acceso a alumnos y las URLs de Instagram, TikTok, Facebook y YouTube también están centralizados en `config/site.ts`. Mientras una URL permanezca vacía, la interfaz muestra un estado pendiente no interactivo y no genera enlaces rotos.

## Imágenes y contenidos pendientes

Las imágenes de `public/images/` son provisionales y están identificadas como tales dentro de la web. Para sustituirlas por fotografías reales de la sala, el atril, la pantalla, el micrófono, la dirección, el alumnado o el control técnico:

1. Añadir el archivo optimizado a `public/images/`.
2. Actualizar `src`, `alt` y `position` en `config/media.ts` según la sección en la que deba aparecer.
3. Para retratos del equipo, actualizar `photo`, `photoAlt` y `photoPosition` en `config/faculty.ts`.

Los vídeos se incorporarán en `mediaConfig.videos`, completando `src`, `poster`, `captions`, `title`, `description`, `duration` y `accessibilityLabel`. Los testimonios reales se añadirán a `mediaConfig.testimonials` con nombre, edición o curso, comentario, destacado opcional y fotografía opcional. Los vídeos se muestran con controles, requieren subtítulos cuando se incorporen y nunca se reproducen automáticamente.

También permanecen deliberadamente pendientes:

- vídeos reales de clases;
- testimonios verificables;
- fotografías de Paco Cardona y del profesorado;
- dirección, teléfono, correo y redes oficiales;
- textos legales y datos fiscales;
- nombre, logotipo e identidad definitivos.

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

La web pública utiliza un único formulario sencillo para solicitar información. No gestiona admisiones, matrículas, entrevistas ni pruebas de acceso, y todavía no envía ni almacena datos porque no existe un backend conectado.

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

## Arquitectura futura del directorio de talento

El directorio no está implementado ni conectado a ningún backend. `config/intensive.ts` deja separados los siguientes estados para una futura integración con la plataforma de gestión de la escuela:

1. Alumno de la escuela.
2. Participante del Intensivo Profesional.
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
- `config/intensive.ts`: contenido del Intensivo y arquitectura futura del directorio de talento.
- `config/faculty.ts`: perfiles y fotografías del equipo docente.
- `config/media.ts`: fotografías de sección, vídeos, testimonios y créditos.
- `public/images/`: fotografías provisionales y tarjeta social.

## Publicación

El proyecto incluye la configuración técnica de Sites, pero no se ha publicado ni se ha configurado hosting, tal como se solicitó.
