# CLIENT-CAN-DO.md — What the client can do from the Wix dashboard

Site: **Stefano Lunardi** (`b24dc2d0-f24b-4d97-b733-550f7c321876`)
Dashboard: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876>
Live: <https://stefano-lunardi-d960960gm-0f09.wix-site-host.com>

Everything the client manages here appears **automatically** on the site: the pages read
data from the live Wix API (no redeploy). What they cannot do on their own (new pages, layout
changes, new sections) is at the end.

## Blog — "Storie" (/blog)

Posts you create appear in the feed on their own; deleted ones disappear from the site instantly.

| What to do                                   | Where                                                                                                  |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Create/edit/publish posts (including drafts) | [Posts](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/posts)              |
| Organize by categories (feed pills)          | [Categories](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/categories)    |
| Tags (chips at the bottom of each post)      | [Tags](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/tags)                |
| Moderate comments on posts                   | [Comments](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/comments)        |
| Authors/writers (guest writers)              | [Writers](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/writers)          |
| Blog statistics                              | [Blog analytics](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/analytics) |

Tricks inside each post's editor:

- **Pin a post** so it leads the feed; **featuring** it is also possible.
- **Cover image**: each post can change its cover (top image + feed card).
- **Post SEO**: the title and description for Google are edited in the editor itself (SEO settings).
- **Comments per post**: can be enabled/disabled per article.
- **Deleted post**: goes to the trash (Trash tab in Posts) and is **restorable**.
- Changing a post's **URL (slug)** is possible; Wix creates the automatic redirect.
- The author's photo (avatar in the byline) is added in the author member's profile (People/Members);
  today only the name "Stefano Lunardi" is shown.

## FAQ — /faq

Questions and categories are managed from the **Wix FAQ** app; the page's search and accordion
update on their own.

- Open the FAQ app: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/app/14c92d28-031e-7910-c9a8-a670011e062d>
- Add/edit/reorder questions and categories; the /faq page (and its SEO) is populated live.

## Portfolio — /portfolio and the project pages

Project collections and their pages are managed from the **Wix Portfolio** app.

- Open the Portfolio app: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/app/d90652a2-f5a1-4c7c-84c4-d4cdcc41f130>
- Add collections and projects (images, texts, order); the /portfolio gallery and the project pages (`/projects/<project-slug>`) update live. `/projects` on its own does not exist: it redirects to /portfolio.

## CMS-managed page text

These pages are **Single Item** collections: one record each, edited like a form. The base
fields are `eyebrow`, `title` and `intro`; the pages with full text also have `body` (rich
text) and the legal ones a `version` field. Every save appears on the site live, without a
redeploy.

| Page              | Collection     | Where                                                                                                          |
| ----------------- | -------------- | -------------------------------------------------------------------------------------------------------------- |
| `/`              | `Home`         | [Home](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Home)                |
| `/il-mio-metodo`  | `IlMetodo`     | [Il Metodo](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/IlMetodo)       |
| `/chi-sono`       | `ChiSono`      | [Chi Sono](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/ChiSono)         |
| `/contatti`       | `Contatti`     | [Contatti](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Contatti)        |
| `/video`          | `Video`        | [Video](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Video)              |
| `/fine-art`       | `FineArt`      | [Fine Art](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/FineArt)         |
| `/location`       | `Location`     | [Location](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Location)        |
| `/investimento`   | `Investimento` | [Investimento](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Investimento)|
| `/awards`         | `Awards`       | [Awards](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Awards)            |
| `/recensioni`     | `Recensioni`   | [Recensioni](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Recensioni)    |
| `/legal` (header) | `LegalIndex`   | [Documenti legali](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/LegalIndex) |
| `/404`            | `NotFound`     | [404](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/NotFound)             |

Scope per page: on `/` every section's text, images and videos are editable (hero slides,
about, art galleries intro, intro video, the three shot types, photo/video section, blog
preview header, awards strip, quotes, FAQ header and the final call to action — the gallery
grids themselves keep their layout); on `/contatti`, `/video` and `/recensioni` you edit the
header text (the form, the video embeds and the review cards stay fixed); on `/awards` the
awards lists and exhibitions are editable, the seals grid stays fixed; `/fine-art`,
`/location`, `/investimento`, `/il-mio-metodo` and `/chi-sono` are fully editable. The page
SEO (title and description for Google) is NOT in the CMS anymore: it is managed in the SEO
settings, see below.

## Legal documents (CMS)

Each legal document is its own **Single Item** collection: header text, version and full body
are editable. The list of documents on `/legal` updates on its own from these collections.

| Page                            | Collection              | Where                                                                                                              |
| ------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `/legal/termini-e-condizioni`   | `TerminiECondizioni`    | [Termini e condizioni](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/TerminiECondizioni) |
| `/legal/privacy`                | `Privacy`               | [Privacy](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Privacy)              |
| `/legal/accessibilita`          | `Accessibilita`         | [Accessibilità](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Accessibilita)  |
| `/legal/carta-accordo-privacy`  | `CartaAccordoPrivacy`   | [Carta di accordo](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/CartaAccordoPrivacy) |
| `/legal/manifesto-soberania-digitale` | `ManifestoSoberaniaDigitale` | [Manifesto](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/ManifestoSoberaniaDigitale) |
| `/legal/termini-di-utilizzo`    | `TerminiDiUtilizzo`     | [Termini di utilizzo](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/TerminiDiUtilizzo) |
| `/legal/accordo-utente`         | `AccordoUtente`         | [Accordo utente](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/AccordoUtente) |
| `/legal/cookie-policy`          | `CookiePolicy`          | [Cookie policy](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/CookiePolicy)   |
| `/legal/resi-e-rimborsi`        | `ResiERimborsi`         | [Resi e rimborsi](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/ResiERimborsi) |
| `/legal/protezione-dati`        | `ProtezioneDati`        | [Protezione dati](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/ProtezioneDati) |
| `/legal/avviso-legale` and `/impressum` | `AvvisoLegale`  | [Avviso legale](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/AvvisoLegale)   |

## Contact form — /contatti

- The form is a **Wix Forms** app; to edit the form:
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-forms>
- Visitors' **responses** go to Wix Forms (submissions) and the contacts list:
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/contacts>
- The **Location** field of the "Heart to Heart" form stores the full list of countries (246 +
  "Altra destination") and is shown on the site as a selector with search and flags. If
  you add/remove options from the dashboard the picker keeps being populated live (options with
  ≥20 entries switch to search mode; new names that are not countries simply show without a flag).

## SEO and analytics

- **SEO of every static page — title, Google description and social sharing** — is edited in the
  SEO settings:
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/seo-home/seo-settings/static-page>
  Pick the page, edit its title and description; the social image used when the page is shared
  (og:image) is managed there too. Changes go live on the site.
- Blog post and category pages also have their SEO editable item by item (in the post editor and
  the SEO settings).
- Site traffic: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/home> → Analytics.

## Payments and invoices (owner)

- Connect a payment method: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cashier/payments>
- Invoices: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-invoices> · recurring: `…/recurring-invoices`

## What requires developer help (not the dashboard)

- New pages or sections, layout/design changes, nav/footer.
- Changes to the visual theme (tokens, typography, colors).
- Connecting your own domain (`stefanolunardi.it`) — ask the developer or do it with the Domains app in the dashboard.
- Anything new: ask the developer, who will implement and publish it (release).
