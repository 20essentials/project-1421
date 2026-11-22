# CLIENT-CAN-DO.md — Cosa può fare il cliente dalla dashboard di Wix

Sito: **Stefano Lunardi** (`b24dc2d0-f24b-4d97-b733-550f7c321876`)
Dashboard: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876>
Live: <https://stefano-lunardi-d960960gm-0f09.wix-site-host.com>

Tutto ciò che il cliente gestisce qui appare **automaticamente** sul sito: le pagine leggono i
dati dalle API di Wix in tempo reale (senza redeploy). Ciò che NON può fare da solo (nuove pagine,
modifiche di layout, nuove sezioni) è alla fine.

## Blog — "Storie" (/blog)

I post che crea compaiono da soli nel feed; quelli eliminati scompaiono dal sito all'istante.

| Cosa fare                                            | Dove                                                                                                       |
| ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Creare/modificare/pubblicare post (incluse le bozze) | [Posts](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/posts)                  |
| Organizzare per categorie (pill del feed)            | [Categorie](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/categories)         |
| Tag (chips ai piedi di ogni post)                    | [Tags](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/tags)                    |
| Moderare i commenti dei post                         | [Commenti](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/comments)            |
| Autori/scrittori (guest writers)                     | [Writers](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/writers)              |
| Statistiche del blog                                 | [Analytics del blog](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/blog/analytics) |

Suggerimenti nell'editor di ogni post:

- **Fissare (pin) un post** perché guidi il feed; è possibile anche **metterlo in evidenza (featured)**.
- **Copertina**: ogni post può cambiare la propria cover (immagine in alto + scheda nel feed).
- **SEO del post**: titolo e descrizione per Google si modificano nell'editor stesso (SEO settings).
- **Commenti per post**: si possono attivare/disattivare articolo per articolo.
- **Post eliminato**: va nel Cestino (scheda Trash in Posts) ed è **ripristinabile**.
- Cambiare l'**URL (slug)** di un post è possibile; Wix crea il reindirizzamento automatico.
- La foto dell'autore (avatar nella byline) si aggiunge nel profilo del membro autore (People/Members);
  oggi viene mostrato solo il nome "Stefano Lunardi".

## FAQ — /faq

Le domande e le categorie si gestiscono dall'app **Wix FAQ**; il cercatore e l'accordion della
pagina si aggiornano da soli.

- Aprire l'app FAQ: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/app/14c92d28-031e-7910-c9a8-a670011e062d>
- Aggiungere/modificare/riordinare domande e categorie; la pagina /faq (e il suo SEO) si alimenta in tempo reale.

## Portfolio — /portfolio e /projects

Le collezioni di progetti e le loro pagine si gestiscono dall'app **Wix Portfolio**.

- Aprire l'app Portfolio: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/app/d90652a2-f5a1-4c7c-84c4-d4cdcc41f130>
- Aggiungere collezioni e progetti (immagini, testi, ordine); /portfolio e /projects si aggiornano in tempo reale.

## Testi di pagina gestiti da CMS

Queste pagine sono collection **Single Item**: un solo record ciascuna, modificabile come un
modulo. I campi di base sono `eyebrow`, `title` e `intro`; le pagine con testo completo hanno
anche `body` (testo formattato) e quelle legali un campo `version`. Ogni salvataggio appare sul
sito in tempo reale, senza redeploy.

| Pagina            | Collezione     | Dove                                                                                                            |
| ----------------- | -------------- | --------------------------------------------------------------------------------------------------------------- |
| `/`               | `Home`         | [Home](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Home)                 |
| `/il-mio-metodo`  | `IlMetodo`     | [Il Metodo](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/IlMetodo)        |
| `/chi-sono`       | `ChiSono`      | [Chi Sono](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/ChiSono)          |
| `/contatti`       | `Contatti`     | [Contatti](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Contatti)         |
| `/video`          | `Video`        | [Video](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Video)               |
| `/fine-art`       | `FineArt`      | [Fine Art](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/FineArt)          |
| `/location`       | `Location`     | [Location](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Location)         |
| `/investimento`   | `Investimento` | [Investimento](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Investimento) |
| `/awards`         | `Awards`       | [Awards](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Awards)             |
| `/recensioni`     | `Recensioni`   | [Recensioni](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/Recensioni)     |
| `/legal` (testata)| `LegalIndex`   | [Documenti legali](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/LegalIndex) |
| `/404`            | `NotFound`     | [404](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/NotFound)              |

Perimetro per pagina: in `/` sono modificabili testo, immagini e video di ogni sezione (slide
hero, presentazione, intro delle gallerie, video di presentazione, i tre tipi di foto, sezione
foto/video, testata del blog, riconoscimenti, citazioni, testata FAQ e invito finale — le
griglie delle gallerie mantengono il loro layout); in `/contatti`, `/video` e `/recensioni`
modifichi il testo dell'intestazione (il modulo, i video e le card delle recensioni restano
fissi); in `/awards` sono modificabili gli elenchi di premi e mostre, la griglia dei sigilli
resta fissa; `/fine-art`, `/location`, `/investimento`, `/il-mio-metodo` e `/chi-sono` sono
completamente modificabili. Il SEO della pagina (titolo e descrizione per Google) NON è più
nel CMS: si gestisce nelle impostazioni SEO, vedi sotto.

## Documenti legali (CMS)

Ogni documento legale ha la sua collezione **Single Item**: testata, versione e corpo completo
sono modificabili. L'elenco su `/legal` si aggiorna da solo da queste collezioni.

| Pagina                          | Collezione              | Dove                                                                                                               |
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
| `/legal/avviso-legale` e `/impressum` | `AvvisoLegale`    | [Avviso legale](https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cms/data/AvvisoLegale)    |

## Modulo di contatto — /contatti

- Il modulo è un'app **Wix Forms**; per modificare il modulo:
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-forms>
- Le **risposte** dei visitatori arrivano a Wix Forms (submissions) e all'elenco contatti:
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/contacts>
- Il campo **Location** del modulo "Heart to Heart" contiene l'elenco completo dei Paesi (246 +
  "Altra destination") e sul sito viene mostrato come un selettore con ricerca e bandiere. Se
  aggiungi/rimuovi opzioni dalla dashboard il picker continua ad alimentarsi in tempo reale (le opzioni
  ≥20 passano alla modalità ricerca; i nuovi nomi che non sono Paesi vengono mostrati
  semplicemente senza bandiera).

## SEO e analisi

- **SEO di ogni pagina statica — titolo, descrizione Google e condivisione social** — si modifica
  nelle impostazioni SEO:
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/seo-home/seo-settings/static-page>
  Scegli la pagina e modifica titolo e descrizione; anche l'immagine social usata quando la pagina
  viene condivisa (og:image) si gestisce lì. Le modifiche vanno live sul sito.
- Anche le pagine dei post e delle categorie del blog hanno il SEO modificabile elemento per
  elemento (nell'editor del post e nelle impostazioni SEO).
- Traffico del sito: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/home> → Analytics.

## Pagamenti e fatture (owner)

- Collegare un metodo di pagamento: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cashier/payments>
- Fatture: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-invoices> · ricorrenti: `…/recurring-invoices`

## Ciò che richiede l'aiuto dello sviluppatore (non è dashboard)

- Nuove pagine o sezioni, modifiche di layout/design, nav/footer.
- Modifiche al tema visivo (token, tipografia, colori).
- Collegare il dominio proprio (`stefanolunardi.it`) — si richiede allo sviluppatore oppure si fa con l'app Domains nella dashboard.
- Qualsiasi cosa nuova: chiedere allo sviluppatore, che la implementerà e pubblicherà (release).
