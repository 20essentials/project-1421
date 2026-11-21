# CLIENT-CAN-DO.md — Lo que el cliente puede hacer desde el dashboard de Wix

Sitio: **Stefano Lunardi** (`b24dc2d0-f24b-4d97-b733-550f7c321876`)
Dashboard: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876>
Live: <https://stefano-lunardi-d960960gm-0f09.wix-site-host.com>

Todo lo que el cliente gestiona aquí aparece **automáticamente** en el sitio: las páginas leen los
datos de la API de Wix en vivo (sin redeploy). Lo que NO puede hacer solo (nuevas páginas, cambios
de layout, secciones nuevas) está al final.

## Blog — "Storie" (/blog)

Los posts que cree aparecen solos en el feed; los borrados desaparecen del sitio al instante.

| Qué hacer | Dónde |
|---|---|
| Crear/editar/publicar posts (borradores incluidos) | [Posts](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/posts) |
| Organizar por categorías (pills del feed) | [Categorías](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/categories) |
| Etiquetas (chips al pie de cada post) | [Tags](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/tags) |
| Moderar comentarios de los posts | [Comentarios](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/comments) |
| Autores/escritores (guest writers) | [Writers](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/writers) |
| Estadísticas del blog | [Analytics del blog](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/analytics) |

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

## Portfolio — /portfolio y /projects

Las colecciones de proyectos y sus páginas se gestionan desde la app **Wix Portfolio**.

- Abrir la app Portfolio: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/app/d90652a2-f5a1-4c7c-84c4-d4cdcc41f130>
- Añadir colecciones y proyectos (imágenes, textos, orden); /portfolio y /projects se actualizan en vivo.

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

- SEO del sitio y por página: app Promote SEO —
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/app/1480c568-5cbd-9392-5604-1148f5faffa0>
- Las páginas de post y de categoría del blog también tienen su SEO editable item por item.
- Tráfico del sitio: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/home> → Analytics.

## Cobros y facturas (owner)

- Conectar método de pago: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cashier/payments>
- Facturas: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-invoices> · recurrentes: `…/recurring-invoices`

## Lo que requiere ayuda del desarrollador (no es dashboard)

- Nuevas páginas o secciones, cambios de layout/diseño, textos de páginas fijas (home, chi-sono, investimento…), nav/footer.
- Cambios en el tema visual (tokens, tipografía, colores).
- Conectar el dominio propio (`stefanolunardi.it`) — se pide al desarrollador o se hace con la app Domains del dashboard.
- Cualquier cosa nueva: pedir al desarrollador, que la implementará y publicará (release).
