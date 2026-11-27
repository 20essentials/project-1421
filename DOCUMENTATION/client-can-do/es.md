# CLIENT-CAN-DO.md — Lo que el cliente puede hacer desde el dashboard de Wix

Sitio: **Stefano Lunardi** (`b24dc2d0-f24b-4d97-b733-550f7c321876`)
Dashboard: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876>
Live: <https://stefano-lunardi-d960960gm-0f09.wix-site-host.com>

Todo lo que el cliente gestiona aquí aparece **automáticamente** en el sitio: las páginas leen los
datos de la API de Wix en vivo (sin redeploy). Lo que NO puede hacer solo (nuevas páginas, cambios
de layout, secciones nuevas) está al final.

## Blog — "Storie" (/blog)

Los posts que cree aparecen solos en el feed; los borrados desaparecen del sitio al instante.

| Qué hacer                                          | Dónde                                                                                                      |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Crear/editar/publicar posts (borradores incluidos) | [Posts](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/posts)                  |
| Organizar por categorías (pills del feed)          | [Categorías](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/categories)        |
| Etiquetas (chips al pie de cada post)              | [Tags](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/tags)                    |
| Moderar comentarios de los posts                   | [Comentarios](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/comments)         |
| Autores/escritores (guest writers)                 | [Writers](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/writers)              |
| Estadísticas del blog                              | [Analytics del blog](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/analytics) |

Trucos dentro del editor de cada post:

- **Fijar (pin) un post** para que lidere el feed; **destacar (featured)** también es posible.
- **Portada**: cada post puede cambiar su cover (imagen superior + tarjeta del feed).
- **SEO del post**: título y descripción para Google se editan en el propio editor (SEO settings).
- **Comentarios por post**: se pueden activar/desactivar por artículo.
- **Post borrado**: va a la papelera (pestaña Trash en Posts) y es **restaurable**.
- Cambiar la **URL (slug)** de un post es posible; Wix crea la redirección automática.
- La foto del autor (avatar en la byline) se añade en el perfil del miembro autor (People/Members);
  hoy solo se muestra el nombre "Stefano Lunardi".

## FAQ — /faq

Las preguntas y categorías se gestionan desde la app **Wix FAQ**; el buscador y el acordeón de la
página se actualizan solos.

- Abrir la app FAQ: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/app/14c92d28-031e-7910-c9a8-a670011e062d>
- Añadir/editar/reordenar preguntas y categorías; la página /faq (y su SEO) se alimenta en vivo.

## Portfolio — /portfolio y las páginas de proyecto

Las colecciones de proyectos y sus páginas se gestionan desde la app **Wix Portfolio**.

- Abrir la app Portfolio: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/app/d90652a2-f5a1-4c7c-84c4-d4cdcc41f130>
- Añadir colecciones y proyectos (imágenes, textos, orden); la galería /portfolio y las páginas de proyecto (`/projects/<slug-proyecto>`) se actualizan en vivo. `/projects` sola no existe: redirige a /portfolio.

## Textos de página gestionados por CMS

Estas páginas son colecciones **Single Item**: un solo registro cada una, editable como un
formulario. Los campos base son `eyebrow`, `title` e `intro`; las páginas con texto completo
tienen también `body` (texto enriquecido) y las legales un campo `version`. Cada guardado
aparece en el sitio en vivo, sin redeploy.

| Página           | Colección      | Dónde                                                                                                           |
| ----------------- | -------------- | --------------------------------------------------------------------------------------------------------------- |
| `/`              | `Home`         | [Home](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Home)                 |
| `/il-mio-metodo`  | `IlMetodo`     | [Il Metodo](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/IlMetodo)        |
| `/chi-sono`       | `ChiSono`      | [Chi Sono](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/ChiSono)          |
| `/contatti`       | `Contatti`     | [Contatti](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Contatti)         |
| `/fine-art`       | `FineArt`      | [Fine Art](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/FineArt)          |
| `/location`       | `Location`     | [Location](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Location)         |
| `/investimento`   | `Investimento` | [Investimento](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Investimento) |
| `/awards`         | `Awards`       | [Awards](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Awards)             |
| `/recensioni`     | `Recensioni`   | [Recensioni](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Recensioni)     |
| `/legal` (cabecera)| `LegalIndex`  | [Documenti legali](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/LegalIndex) |
| `/404`            | `NotFound`     | [404](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/NotFound)              |

Alcance por página: en `/` son editables el texto y las imágenes de cada sección
(slides del hero, presentación, intro de las galerías, los tres tipos de
foto, sección foto/vídeo, cabecera del blog, muro de reconocimientos (texto y seis primeras
imágenes editables; los otros seis sellos quedan fijos), citas, cabecera FAQ y el llamado final —
las cuadrículas de las galerías mantienen su layout); en `/contatti` y
`/recensioni` editas el texto de la cabecera (el formulario y las tarjetas de
reseñas quedan fijos); en `/awards` son editables las listas de premios y exposiciones, la
cuadrícula de sellos queda fija; `/fine-art`, `/location`, `/investimento`, `/il-mio-metodo` y
`/chi-sono` son totalmente editables. El SEO de la página (título y descripción para Google) ya
NO está en el CMS: se gestiona en los ajustes SEO, ver abajo.

## Documentos legales (CMS)

Cada documento legal tiene su propia colección **Single Item**: cabecera, versión y cuerpo
completo son editables. El listado de `/legal` se actualiza solo desde estas colecciones.

| Página                          | Colección               | Dónde                                                                                                              |
| ------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `/legal/termini-e-condizioni`   | `TerminiECondizioni`    | [Termini e condizioni](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/TerminiECondizioni) |
| `/legal/privacy`                | `Privacy`               | [Privacy](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Privacy)               |
| `/legal/accessibilita`          | `Accessibilita`         | [Accessibilità](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Accessibilita)   |
| `/legal/carta-accordo-privacy`  | `CartaAccordoPrivacy`   | [Carta di accordo](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/CartaAccordoPrivacy) |
| `/legal/manifesto-soberania-digitale` | `ManifestoSoberaniaDigitale` | [Manifesto](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/ManifestoSoberaniaDigitale) |
| `/legal/termini-di-utilizzo`    | `TerminiDiUtilizzo`     | [Termini di utilizzo](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/TerminiDiUtilizzo) |
| `/legal/accordo-utente`         | `AccordoUtente`         | [Accordo utente](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/AccordoUtente)  |
| `/legal/cookie-policy`          | `CookiePolicy`          | [Cookie policy](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/CookiePolicy)    |
| `/legal/resi-e-rimborsi`        | `ResiERimborsi`         | [Resi e rimborsi](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/ResiERimborsi) |
| `/legal/protezione-dati`        | `ProtezioneDati`        | [Protezione dati](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/ProtezioneDati) |
| `/legal/avviso-legale` y `/impressum` | `AvvisoLegale`    | [Avviso legale](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/AvvisoLegale)    |

## Formulario de contacto — /contatti

- El formulario es una app **Wix Forms**; para editar el formulario:
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-forms>
- Las **respuestas** de los visitantes llegan a Wix Forms (submissions) y a la lista de contactos:
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/contacts>
- El campo **Location** del formulario "Heart to Heart" guarda la lista completa de países (246 +
  "Altra destination") y en la web se muestra como un selector con buscador y banderas. Si
  añades/quitas opciones desde el dashboard el picker se sigue alimentando en vivo (las opciones
  ≥20 pasan a modo buscador; los nombres nuevos que no sean países simplemente salen sin bandera).

## SEO y analítica

- **SEO de cada página estática — título, descripción para Google y compartir en redes** — se
  edita en los ajustes SEO:
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/seo-home/seo-settings/static-page>
  Elige la página y edita título y descripción; la imagen social que se usa al compartir la
  página (og:image) también se gestiona ahí. Los cambios salen en vivo.
- Las páginas de post y de categoría del blog también tienen su SEO editable item por item (en el
  editor del post y en los ajustes SEO).
- **robots.txt y llms.txt** (los archivos que leen los buscadores y los asistentes de IA) se editan
  en el dashboard, en SEO Tools ("Robots.txt Editor" y el editor de llms.txt). Nota: el sitemap
  completo del sitio con URLs reales se sirve en `/sitemap-full.xml` (ya referenciado desde
  robots.txt), y el resumen de llms.txt lo regenera y sincroniza el desarrollador tras cambios de
  contenido.
- Tráfico del sitio: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/home> → Analytics.

## Cobros y facturas (owner)

- Conectar método de pago: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cashier/payments>
- Facturas: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-invoices> · recurrentes: `…/recurring-invoices`

## Lo que requiere ayuda del desarrollador (no es dashboard)

- Nuevas páginas o secciones, cambios de layout/diseño, nav/footer.
- Cambios en el tema visual (tokens, tipografía, colores).
- Conectar el dominio propio (`stefanolunardi.it`) — se pide al desarrollador o se hace con la app Domains del dashboard.
- Cualquier cosa nueva: pedir al desarrollador, que la implementará y publicará (release).
