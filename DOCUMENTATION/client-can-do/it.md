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

- SEO del sito e per pagina: app Promote SEO —
  <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/app/1480c568-5cbd-9392-5604-1148f5faffa0>
- Anche le pagine dei post e delle categorie del blog hanno il SEO modificabile elemento per elemento.
- Traffico del sito: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/home> → Analytics.

## Pagamenti e fatture (owner)

- Collegare un metodo di pagamento: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-cashier/payments>
- Fatture: <https://manage.wix.com/dashboard/b24dc2d0-f24b-4d97-b733-550f7c321876/wix-invoices> · ricorrenti: `…/recurring-invoices`

## Ciò che richiede l'aiuto dello sviluppatore (non è dashboard)

- Nuove pagine o sezioni, modifiche di layout/design, testi delle pagine fisse (home, chi-sono, investimento…), nav/footer.
- Modifiche al tema visivo (token, tipografia, colori).
- Collegare il dominio proprio (`stefanolunardi.it`) — si richiede allo sviluppatore oppure si fa con l'app Domains nella dashboard.
- Qualsiasi cosa nuova: chiedere allo sviluppatore, che la implementerà e pubblicherà (release).
