export interface LegalSection {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  version: string;
  sections: LegalSection[];
}

export const legalDocuments: LegalDocument[] = [
  {
    slug: "termini-e-condizioni",
    title: "Termini e condizioni",
    eyebrow: "Documenti legali",
    summary:
      "Le condizioni generali che regolano l'accesso e l'utilizzo del sito da parte degli utenti.",
    version: "Versione 1.0",
    sections: [
      {
        id: "premessa",
        title: "Premessa",
        paragraphs: [
          "Il presente documento definisce i termini e le condizioni generali che regolano l'accesso al sito e l'utilizzo dei suoi contenuti. Il soggetto che gestisce il sito è indicato di seguito come “il Titolare”.",
          "L'accesso al sito implica la lettura e l'accettazione delle disposizioni riportate nel presente documento. Gli utenti che non intendono accettarle devono interrompere l'utilizzo del sito.",
        ],
      },
      {
        id: "finalita",
        title: "Finalità del sito",
        paragraphs: [
          "Il sito ha finalità informative e, ove previsto, può consentire la richiesta di informazioni, l'iscrizione ad aggiornamenti o l'utilizzo di servizi dedicati. Le funzionalità disponibili possono variare nel tempo.",
          "I contenuti pubblicati sono offerti a scopo generale e non costituiscono, di per sé, un'offerta contrattuale o una garanzia di risultato.",
        ],
      },
      {
        id: "utilizzo-consentito",
        title: "Utilizzo consentito",
        paragraphs: [
          "L'utente si impegna a utilizzare il sito in modo lecito, corretto e rispettoso degli altri utenti e del Titolare.",
        ],
        items: [
          "non alterare, copiare o distribuire contenuti senza autorizzazione;",
          "non introdurre codici, script o strumenti che possano danneggiare il sito o interferire con il suo funzionamento;",
          "non utilizzare il sito per attività illegali, offensive o contrarie all'ordine pubblico;",
          "non aggirare misure di protezione o limitazioni d'accesso.",
        ],
      },
      {
        id: "proprieta-intellettuale",
        title: "Proprietà intellettuale",
        paragraphs: [
          "Testi, immagini, grafiche, loghi e ogni altro elemento presente sul sito sono protetti dalle normative applicabili e restano di titolarità del Titolare o dei rispettivi aventi diritto.",
          "È consentita la consultazione per uso personale e non commerciale. Ogni utilizzo diverso richiede autorizzazione preventiva.",
        ],
      },
      {
        id: "responsabilita",
        title: "Limitazioni di responsabilità",
        paragraphs: [
          "Il Titolare si impegna a mantenere il sito aggiornato e funzionante, ma non può garantire disponibilità continua o assenza di interruzioni dovute a fattori esterni.",
          "Le informazioni pubblicate sono fornite con cura; il Titolare non risponde di danni derivanti da decisioni prese esclusivamente sulla base dei contenuti del sito.",
        ],
      },
      {
        id: "modifiche",
        title: "Modifiche alle condizioni",
        paragraphs: [
          "Il Titolare può aggiornare il presente documento per adeguarlo a esigenze organizzative, tecniche o normative. La versione pubblicata sul sito è quella applicabile.",
        ],
      },
      {
        id: "contatti",
        title: "Contatti",
        paragraphs: [
          "Per chiarimenti relative alle presenti condizioni è possibile utilizzare le informazioni di contatto riportate nel footer del sito.",
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Informativa sulla privacy",
    eyebrow: "Privacy",
    summary:
      "Come vengono trattati i dati personali degli utenti, quali finalità perseguono e quali diritti spettano agli interessati.",
    version: "Versione 1.0",
    sections: [
      {
        id: "premessa",
        title: "Premessa",
        paragraphs: [
          "La presente informativa descrive il trattamento dei dati personali effettuato tramite il sito. Il Titolare del trattamento è il soggetto che gestisce il sito e le relative attività.",
          "Il documento è redatto in modo da poter essere riutilizzato su siti diversi: l'identificazione del Titolare e i recapiti sono disponibili nel footer del sito.",
        ],
      },
      {
        id: "dati-raccolti",
        title: "Tipologie di dati raccolti",
        paragraphs: [
          "Possono essere raccolti dati che l'utente inserisce volontariamente, dati tecnici di navigazione e dati generati dall'utilizzo delle funzionalità disponibili.",
        ],
        items: [
          "dati identificativi e di contatto inseriti in moduli o richieste;",
          "contenuti dei messaggi inviati tramite il sito;",
          "indirizzo IP, tipo di browser, dispositivo e informazioni sulla visita;",
          "preferenze espresse in materia di cookie e privacy.",
        ],
      },
      {
        id: "finalita",
        title: "Finalità e basi giuridiche",
        paragraphs: [
          "I dati sono trattati per rispondere alle richieste dell'utente, erogare i servizi richiesti, migliorare l'esperienza di navigazione, adempiere a obblighi di legge e tutelare la sicurezza del sito.",
          "Le basi giuridiche applicabili sono, a seconda dei casi, il consenso dell'interessato, l'esecuzione di misure precontrattuali o contrattuali, il legittimo interesse del Titolare e l'adempimento di obblighi normativi.",
        ],
      },
      {
        id: "raccolta",
        title: "Modalità di raccolta",
        paragraphs: [
          "I dati vengono raccolti principalmente tramite moduli compilati dall'utente, interazioni con il sito e strumenti tecnici necessari al suo funzionamento. I campi obbligatori sono indicati nelle relative sezioni.",
          "L'utente è responsabile della veridicità delle informazioni fornite e deve evitare l'inserimento di dati non pertinenti o appartenenti a terzi senza autorizzazione.",
        ],
      },
      {
        id: "conservazione",
        title: "Conservazione dei dati",
        paragraphs: [
          "I dati sono conservati per il tempo necessario alle finalità per cui sono stati raccolti, nel rispetto dei principi di minimizzazione e limitazione della conservazione.",
          "Al termine del periodo applicabile, i dati vengono cancellati o resi anonimi, salvo diverso obbligo di legge.",
        ],
      },
      {
        id: "destinatari",
        title: "Destinatari e comunicazione",
        paragraphs: [
          "I dati possono essere trattati da soggetti autorizzati che operano sotto la responsabilità del Titolare e da fornitori di servizi tecnici necessari al funzionamento del sito.",
          "Non sono previste comunicazioni a soggetti non autorizzati né diffusione dei dati per finalità diverse da quelle indicate.",
        ],
      },
      {
        id: "diritti",
        title: "Diritti dell'interessato",
        paragraphs: [
          "L'interessato può esercitare i diritti previsti dalla normativa applicabile, tra cui l'accesso, la rettifica, la cancellazione, la limitazione, la portabilità e l'opposizione al trattamento.",
        ],
        items: [
          "richiedere conferma dell'esistenza dei propri dati e delle relative informazioni;",
          "ottenere la correzione di dati inesatti o incompleti;",
          "richiedere la cancellazione dei dati quando ricorrano i presupposti;",
          "opporsi al trattamento fondato su legittimo interesse;",
          "revocare il consenso prestato, senza pregiudizio per la liceità del trattamento precedente.",
        ],
      },
      {
        id: "cookie",
        title: "Cookie e strumenti simili",
        paragraphs: [
          "Il sito può utilizzare cookie tecnici necessari al funzionamento e, previo consenso, cookie per preferenze, statistiche o integrazioni con servizi di terze parti.",
          "Le modalità di gestione sono descritte nella pagina dedicata all'informativa sui cookie.",
        ],
      },
      {
        id: "sicurezza",
        title: "Sicurezza",
        paragraphs: [
          "Il Titolare adotta misure tecniche e organizzative Appropriate per proteggere i dati da accessi non autorizzati, perdita, alterazione o distruzione.",
          "Nessun sistema, tuttavia, può garantire sicurezza assoluta: in caso di incidente saranno adottate le iniziative previste dalla normativa applicabile.",
        ],
      },
      {
        id: "modifiche",
        title: "Aggiornamenti",
        paragraphs: [
          "La presente informativa può essere aggiornata per riflettere cambiamenti nel sito, nei servizi offerti o nel quadro normativo. La versione pubblicata è quella di riferimento.",
        ],
      },
      {
        id: "contatti",
        title: "Contatti",
        paragraphs: [
          "Per esercitare i propri diritti o ottenere chiarimenti è possibile utilizzare le informazioni di contatto riportate nel footer del sito.",
        ],
      },
    ],
  },
  {
    slug: "accessibilita",
    title: "Dichiarazione sull'accessibilità",
    eyebrow: "Accessibilità",
    summary:
      "L'impegno del sito verso un'esperienza consultabile da tutte le persone e le misure adottate in tale direzione.",
    version: "Versione 1.0",
    sections: [
      {
        id: "impegno",
        title: "Impegno",
        paragraphs: [
          "Il Titolare si impegna a rendere il sito accessibile, comprensibile e utilizzabile dal maggior numero di persone possibile, indipendentemente da dispositivo, abilità o condizione.",
          "L'accessibilità è trattata come parte della qualità complessiva del sito e non come un intervento conclusivo.",
        ],
      },
      {
        id: "ambito",
        title: "Ambito di applicazione",
        paragraphs: [
          "La presente dichiarazione si applica alle pagine e alle funzionalità rese disponibili tramite il sito. Può non includere contenuti ospitati su domini o piattaforme di terze parti.",
        ],
      },
      {
        id: "misure",
        title: "Misure adottate",
        paragraphs: [
          "Le scelte di progettazione e sviluppo seguono i principi generali delle linee guida per l'accessibilità dei contenuti web.",
        ],
        items: [
          "struttura dei contenuti con titoli e punti di riferimento coerenti;",
          "contrasto tra testo e sfondo sufficiente per la lettura;",
          "navigazione utilizzabile da tastiera e indicatori di focus visibili;",
          "testi alternativi per le immagini significative;",
          "link con etichette comprensibili e descrittive;",
          "layout adattivo per diverse dimensioni di schermo.",
        ],
      },
      {
        id: "principi",
        title: "Principi di riferimento",
        paragraphs: [
          "I contenuti dovrebbero essere percepibili, utilizzabili, comprensibili e robusti. Questi principi guidano le verifiche periodiche e gli interventi di miglioramento.",
        ],
      },
      {
        id: "limitazioni",
        title: "Limitazioni note",
        paragraphs: [
          "Alcune funzionalità o contenuti di terze parti possono non essere pienamente conformi agli standard di accessibilità. Il Titolare monitora tali situazioni e interviene quando possibile.",
          "Se si incontra una barriera, è segnalato il difetto riscontrato e il contesto in cui si è verificato, in modo da consentire una valutazione accurata.",
        ],
      },
      {
        id: "feedback",
        title: "Segnalazioni e feedback",
        paragraphs: [
          "Le segnalazioni relative all'accessibilità del sito sono accolte con attenzione e trattate con priorità. È possibile inviarle utilizzando le informazioni di contatto riportate nel footer del sito.",
        ],
      },
      {
        id: "aggiornamenti",
        title: "Aggiornamenti della dichiarazione",
        paragraphs: [
          "Il presente documento può essere rivisto a seguito di verifiche, miglioramenti o cambiamenti tecnici. La versione pubblicata riflette lo stato più recente.",
        ],
      },
    ],
  },
  {
    slug: "carta-accordo-privacy",
    title: "Carta di accordo sulla privacy",
    eyebrow: "Privacy",
    summary:
      "I principi che ispirano il rapporto tra il sito e gli utenti in materia di riservatezza e dati personali.",
    version: "Versione 1.0",
    sections: [
      {
        id: "natura",
        title: "Natura del documento",
        paragraphs: [
          "La presente carta riassume, in forma accessibile, l'impostazione del Titolare in materia di privacy. Non sostituisce l'informativa dettagliata, ma ne condivide i principi essenziali.",
        ],
      },
      {
        id: "principi",
        title: "Principi fondamentali",
        paragraphs: [
          "La gestione dei dati si basa su trasparenza, minimizzazione, finalità determinate e rispetto dei diritti delle persone.",
        ],
        items: [
          "raccogliere solo ciò che è realmente necessario;",
          "spiegare in modo chiaro perché i dati vengono richiesti;",
          "non utilizzare i dati per scopi diversi da quelli dichiarati;",
          "consentire all'interessato di intervenire sui propri dati;",
          "mantenere misure di protezione proporzionate.",
        ],
      },
      {
        id: "raccolta",
        title: "Raccolta e utilizzo",
        paragraphs: [
          "I dati inseriti tramite moduli o richieste vengono impiegati per dare seguito alla richiesta e per le attività ad essa collegate. Le informazioni tecniche di navigazione sono usate per garantire funzionalità e sicurezza.",
        ],
      },
      {
        id: "condivisione",
        title: "Condivisione",
        paragraphs: [
          "I dati non vengono venduti né ceduti per finalità promozionali di terzi. Possono essere coinvolti solo soggetti che forniscono servizi necessari e che operano nel rispetto delle istruzioni ricevute.",
        ],
      },
      {
        id: "conservazione",
        title: "Conservazione",
        paragraphs: [
          "I dati vengono mantenuti per il tempo utile a perseguire le finalità indicate e poi cancellati o anonimizzati, salvo obblighi diversi.",
        ],
      },
      {
        id: "diritti",
        title: "Diritti delle persone",
        paragraphs: [
          "L'interessato può chiedere accesso, rettifica, cancellazione, limitazione, portabilità o opposizione, secondo le condizioni previste dalla normativa applicabile.",
        ],
      },
      {
        id: "contatti",
        title: "Contatti",
        paragraphs: [
          "Per domande su questa carta è possibile utilizzare le informazioni di contatto riportate nel footer del sito.",
        ],
      },
    ],
  },
  {
    slug: "manifesto-soberania-digitale",
    title: "Manifesto di sovranità digitale",
    eyebrow: "Principi",
    summary:
      "I valori che guidano la gestione consapevole di dati, strumenti e relazioni digitali.",
    version: "Versione 1.0",
    sections: [
      {
        id: "premessa",
        title: "Premessa",
        paragraphs: [
          "La sovranità digitale è la capacità di scegliere con consapevolezza gli strumenti utilizzati, di controllare le proprie informazioni e di non dipendere da un unico soggetto per le attività quotidiane.",
          "Questo manifesto descrive l'impostazione che il Titolare intende seguire nella gestione del sito e dei servizi connessi.",
        ],
      },
      {
        id: "possesso",
        title: "Possesso dei dati",
        paragraphs: [
          "Le persone devono poter comprendere quali dati vengono raccolti, perché lo sono e come intervenire. Le informazioni non sono un bene accessorio, ma parte della relazione di fiducia con gli utenti.",
        ],
      },
      {
        id: "scelta",
        title: "Scelta consapevole",
        paragraphs: [
          "Le funzionalità non essenziali che comportano trattamenti di dati dovrebbero essere attivate solo dopo una scelta informata. Le preferenze devono essere modificabili nel tempo.",
        ],
      },
      {
        id: "trasparenza",
        title: "Trasparenza dei processi",
        paragraphs: [
          "La documentazione relativa a privacy, cookie e utilizzo del sito deve essere comprensibile e facilmente raggiungibile. Un testo chiaro è preferibile a una formula generica.",
        ],
      },
      {
        id: "interoperabilita",
        title: "Interoperabilità e portabilità",
        paragraphs: [
          "I dati forniti devono, ove possibile, essere restituibili in formato utilizzabile. L'obiettivo è evitare che l'utente sia costretto a restare in un sistema per motivi tecnici.",
        ],
      },
      {
        id: "dipendenza",
        title: "Riduzione della dipendenza",
        paragraphs: [
          "L'adozione di strumenti esterni deve essere valutata con attenzione. Ove esistano alternative adeguate, si privilegiano soluzioni che limitano la raccolta di dati e la dipendenza da terze parti.",
        ],
      },
      {
        id: "responsabilita",
        title: "Responsabilità",
        paragraphs: [
          "La sovranità digitale non è solo un diritto, ma anche una responsabilità: usare servizi in modo critico, rispettare il lavoro altrui e segnalare problemi quando si riscontrano.",
        ],
      },
      {
        id: "applicazione",
        title: "Applicazione",
        paragraphs: [
          "I principi di questo manifesto orientano le scelte del sito e possono essere aggiornati nel tempo. Il confronto con gli utenti è parte del processo.",
        ],
      },
    ],
  },
  {
    slug: "termini-di-utilizzo",
    title: "Termini di utilizzo",
    eyebrow: "Documenti legali",
    summary:
      "Regole di comportamento, limiti d'uso e tutela dei contenuti nell'interazione con il sito.",
    version: "Versione 1.0",
    sections: [
      {
        id: "ambito",
        title: "Ambito",
        paragraphs: [
          "Le presenti regole si applicano a tutte le persone che accedono al sito o utilizzano una delle sue funzionalità.",
        ],
      },
      {
        id: "regole",
        title: "Regole di comportamento",
        paragraphs: [
          "Ogni utente è tenuto a rispettare le altre persone, la proprietà intellettuale e le regole tecniche del sito.",
        ],
        items: [
          "non pubblicare contenuti diffamatori, discriminatori o illegali;",
          "non inviare messaggi automatici o richieste ripetitive senza motivo;",
          "non tentare di ottenere accessi non autorizzati;",
          "non alterare l'aspetto o il comportamento del sito per altri utenti.",
        ],
      },
      {
        id: "divieti",
        title: "Divieti specifici",
        paragraphs: [
          "È vietato utilizzare il sito per attività che possano comprometterne la sicurezza, la disponibilità o la reputazione, oppure per aggirare le misure di protezione adottate.",
        ],
      },
      {
        id: "contenuti-utente",
        title: "Contenuti degli utenti",
        paragraphs: [
          "I contenuti inviati tramite moduli o strumenti interattivi devono essere pertinenti e leciti. L'utente resta responsabile di quanto invia e garantisce di avere il diritto di farlo.",
          "Il Titolare può rimuovere contenuti che violano le presenti regole o che risultano dannosi per il sito o per terzi.",
        ],
      },
      {
        id: "terze-parti",
        title: "Collegamenti a siti terzi",
        paragraphs: [
          "Il sito può rimandare a risorse esterne. Il Titolare non controlla tali risorse e non risponde dei loro contenuti o delle loro pratiche.",
        ],
      },
      {
        id: "proprieta",
        title: "Proprietà intellettuale",
        paragraphs: [
          "I marchi, le immagini e i testi presenti sul sito non possono essere riprodotti o riutilizzati senza autorizzazione, salvo quanto espressamente consentito dalla legge.",
        ],
      },
      {
        id: "limitazioni",
        title: "Limitazioni di responsabilità",
        paragraphs: [
          "Il Titolare non è responsabile per danni derivanti da un utilizzo del sito non conforme alle presenti regole o da eventi fuori dal proprio controllo.",
        ],
      },
      {
        id: "modifiche",
        title: "Modifiche e cessazione",
        paragraphs: [
          "Il Titolare può modificare le regole o sospendere temporaneamente l'accesso al sito per motivi tecnici, di sicurezza o organizzativi.",
        ],
      },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Informativa sui cookie",
    eyebrow: "Cookie",
    summary:
      "Quali cookie possono essere utilizzati, a cosa servono e come gestire le relative preferenze.",
    version: "Versione 1.0",
    sections: [
      {
        id: "cosa-sono",
        title: "Cosa sono i cookie",
        paragraphs: [
          "I cookie sono piccoli file di testo che i siti possono memorizzare sul dispositivo dell'utente. Possono servire a far funzionare il sito, ricordare preferenze o raccogliere informazioni sull'utilizzo.",
        ],
      },
      {
        id: "tecnici",
        title: "Cookie tecnici",
        paragraphs: [
          "I cookie tecnici sono necessari per funzionalità di base come la navigazione, la sicurezza e la memorizzazione delle preferenze espresse in materia di privacy.",
          "Questi cookie non richiedono consenso perché sono indispensabili per il funzionamento del sito.",
        ],
      },
      {
        id: "preferenze",
        title: "Cookie di preferenza",
        paragraphs: [
          "Possono essere utilizzati per ricordare scelte dell'utente, come la lingua o impostazioni di visualizzazione. Se non vengono accettati, alcune funzionalità potrebbero non essere personalizzate.",
        ],
      },
      {
        id: "statistici",
        title: "Cookie statistici",
        paragraphs: [
          "I cookie statistici aiutano a comprendere in forma aggregata come viene utilizzato il sito, ad esempio quali pagine sono più consultate. Vengono attivati solo previo consenso.",
        ],
      },
      {
        id: "terze-parti",
        title: "Cookie di terze parti",
        paragraphs: [
          "Alcune integrazioni possono installare cookie gestiti da soggetti esterni. L'installazione avviene solo dopo una scelta consapevole dell'utente, quando richiesta.",
        ],
      },
      {
        id: "gestione",
        title: "Gestione delle preferenze",
        paragraphs: [
          "Le preferenze possono essere modificate in qualsiasi momento tramite l'apposito strumento presente nel sito. La revoca del consenso non pregiudica la liceità dei trattamenti effettuati in precedenza.",
          "È possibile, inoltre, intervenire dalle impostazioni del browser per bloccare o rimuovere i cookie memorizzati.",
        ],
      },
      {
        id: "durata",
        title: "Durata",
        paragraphs: [
          "La durata dei cookie dipende dalla loro funzione: alcuni scadono alla chiusura della sessione, altri restano memorizzati fino alla scadenza impostata o fino alla rimozione da parte dell'utente.",
        ],
      },
      {
        id: "aggiornamenti",
        title: "Aggiornamenti",
        paragraphs: [
          "La presente informativa può cambiare se vengono introdotti nuovi strumenti o se mutano le modalità di utilizzo dei cookie.",
        ],
      },
    ],
  },
  {
    slug: "resi-e-rimborsi",
    title: "Politica di resi e rimborsi",
    eyebrow: "Acquisti",
    summary:
      "Le condizioni generali relative a resi, recesso e rimborsi per prodotti o servizi acquistati tramite il sito.",
    version: "Versione 1.0",
    sections: [
      {
        id: "ambito",
        title: "Ambito",
        paragraphs: [
          "La presente politica si applica agli acquisti effettuati tramite il sito, qualora siano disponibili prodotti fisici, servizi digitali o prestazioni personalizzate.",
          "Le condizioni specifiche indicate al momento dell'acquisto prevalgono sulle disposizioni generali riportate di seguito.",
        ],
      },
      {
        id: "prodotti",
        title: "Prodotti e servizi",
        paragraphs: [
          "Per i prodotti fisici è previsto, ove applicabile, il diritto di recesso nei termini stabiliti dalla normativa vigente. Per i servizi digitali e le prestazioni personalizzate possono sussistere eccezioni.",
        ],
      },
      {
        id: "eccezioni",
        title: "Eccezioni",
        paragraphs: [
          "Il diritto di recesso può non applicarsi, a titolo esemplificativo, a beni personalizzati, contenuti digitali forniti in forma immediata o servizi la cui esecuzione è iniziata con il consenso dell'acquirente.",
        ],
      },
      {
        id: "richiesta",
        title: "Modalità di richiesta",
        paragraphs: [
          "Per richiedere un reso o un rimborso è necessario indicare l'ordine di riferimento, la ragione della richiesta e, quando previsto, la documentazione fotografica del prodotto.",
          "Le richieste vengono inviate utilizzando le informazioni di contatto riportate nel footer del sito.",
        ],
      },
      {
        id: "tempi",
        title: "Tempi di lavorazione",
        paragraphs: [
          "Le richieste complete vengono esaminate entro un termine ragionevole. Il rimborso viene disposto dopo la verifica dei presupposti e secondo le tempistiche del metodo di pagamento utilizzato.",
        ],
      },
      {
        id: "spese",
        title: "Spese di spedizione",
        paragraphs: [
          "Le spese di restituzione sono a carico dell'acquirente, salvo diversa disposizione di legge o indicazione contraria al momento dell'acquisto.",
        ],
      },
      {
        id: "contestazioni",
        title: "Contestazioni",
        paragraphs: [
          "In caso di disaccordo sull'esito della richiesta, è possibile fornire ulteriori elementi a supporto. Il Titolare valuta ogni segnalazione con attenzione e cerca una soluzione congrua.",
        ],
      },
    ],
  },
  {
    slug: "protezione-dati",
    title: "Informativa sulla protezione dei dati",
    eyebrow: "Sicurezza",
    summary:
      "Le misure tecniche e organizzative adottate per proteggere i dati trattati tramite il sito.",
    version: "Versione 1.0",
    sections: [
      {
        id: "finalita",
        title: "Finalità del documento",
        paragraphs: [
          "Il presente documento integra l'informativa sulla privacy descrivendo l'impostazione generale del Titolare in materia di sicurezza dei dati.",
        ],
      },
      {
        id: "tecniche",
        title: "Misure tecniche",
        paragraphs: [
          "Le misure tecniche possono includere crittografia delle comunicazioni, gestione degli accessi, separazione degli ambienti, copie di sicurezza regolari e strumenti di monitoraggio.",
        ],
      },
      {
        id: "organizzative",
        title: "Misure organizzative",
        paragraphs: [
          "L'accesso ai dati è limitato alle persone che ne hanno bisogno per svolgere le proprie attività. Le responsabilità sono definite e le procedure vengono riviste periodicamente.",
        ],
      },
      {
        id: "accessi",
        title: "Gestione degli accessi",
        paragraphs: [
          "Gli accessi vengono concessi secondo il principio del minimo privilegio e possono essere revocati quando non sono più necessari.",
        ],
      },
      {
        id: "cancellazione",
        title: "Conservazione e cancellazione",
        paragraphs: [
          "I dati vengono conservati solo per il tempo necessario e successivamente cancellati o anonimizzati, nel rispetto delle disposizioni applicabili.",
        ],
      },
      {
        id: "incidenti",
        title: "Incidenti di sicurezza",
        paragraphs: [
          "In caso di sospetto incidente, vengono adottate misure di contenimento, analisi e ripristino. Le comunicazioni agli interessati e alle autorità avvengono quando previsto dalla legge.",
        ],
      },
      {
        id: "revisione",
        title: "Revisione",
        paragraphs: [
          "Le misure descritte possono evolvere nel tempo. La versione pubblicata riflette l'impostazione più recente.",
        ],
      },
      {
        id: "contatti",
        title: "Contatti",
        paragraphs: [
          "Segnalazioni relative alla sicurezza dei dati possono essere inviate utilizzando le informazioni di contatto riportate nel footer del sito.",
        ],
      },
    ],
  },
  {
    slug: "accordo-utente",
    title: "Accordo dell'utente",
    eyebrow: "Documenti legali",
    summary:
      "I termini che regolano l'eventuale registrazione e l'uso delle funzionalità riservate agli utenti.",
    version: "Versione 1.0",
    sections: [
      {
        id: "parti",
        title: "Parti",
        paragraphs: [
          "L'accordo si conclude tra il Titolare del sito e l'utente che utilizza le funzionalità disponibili, inclusa l'eventuale creazione di un account.",
        ],
      },
      {
        id: "accettazione",
        title: "Accettazione",
        paragraphs: [
          "L'utente accetta il presente accordo utilizzando le funzionalità riservate o confermando l'iscrizione. Se non intende aderire, deve interrompere l'utilizzo.",
        ],
      },
      {
        id: "registrazione",
        title: "Registrazione",
        paragraphs: [
          "Quando è prevista la registrazione, l'utente deve fornire informazioni accurate e mantenere aggiornate le proprie credenziali.",
        ],
      },
      {
        id: "obblighi",
        title: "Obblighi dell'utente",
        paragraphs: [
          "L'utente si impegna a usare le funzionalità in modo lecito, a non condividere le proprie credenziali e a segnalare eventuali utilizzi non autorizzati.",
        ],
      },
      {
        id: "licenza",
        title: "Licenza d'uso",
        paragraphs: [
          "A titolo gratuito, il Titolare concede all'utente una licenza limitata, non esclusiva e revocabile per utilizzare le funzionalità del sito conformemente al presente accordo.",
        ],
      },
      {
        id: "contenuti",
        title: "Contenuti dell'utente",
        paragraphs: [
          "L'utente conserva la titolarità dei contenuti che inserisce e concede al Titolare il diritto di trattarli per fornire il servizio, nel rispetto della normativa applicabile.",
        ],
      },
      {
        id: "sospensione",
        title: "Sospensione e chiusura",
        paragraphs: [
          "Il Titolare può sospendere o chiudere un account in caso di violazione delle regole, richiesta dell'utente o esigenze tecniche e di sicurezza.",
        ],
      },
      {
        id: "limitazioni",
        title: "Limitazioni di responsabilità",
        paragraphs: [
          "Il Titolare non risponde di danni derivanti da un uso non conforme alle regole o da circostanze indipendenti dalla propria volontà.",
        ],
      },
      {
        id: "recesso",
        title: "Recesso",
        paragraphs: [
          "L'utente può recedere dall'accordo in qualsiasi momento interrompendo l'uso delle funzionalità e, dove previsto, richiedendo la chiusura dell'account.",
        ],
      },
      {
        id: "finali",
        title: "Disposizioni finali",
        paragraphs: [
          "Il presente accordo può essere aggiornato; la versione pubblicata sul sito è applicabile. Per chiarimenti è possibile utilizzare le informazioni di contatto riportate nel footer del sito.",
        ],
      },
    ],
  },
  {
    slug: "avviso-legale",
    title: "Avviso legale",
    eyebrow: "Documenti legali",
    summary:
      "Informazioni generali, titolarità dei contenuti e limiti di responsabilità relativi al sito.",
    version: "Versione 1.0",
    sections: [
      {
        id: "informazioni-generali",
        title: "Informazioni generali",
        paragraphs: [
          "Il presente avviso fornisce le informazioni essenziali relative al sito e all'attività del Titolare. I recapiti sono disponibili nel footer del sito.",
        ],
      },
      {
        id: "titolare",
        title: "Titolare del sito",
        paragraphs: [
          "Il Titolare del sito è il soggetto che gestisce la pubblicazione dei contenuti e le attività connesse. L'identificazione completa è riportata nelle informazioni di contatto del sito.",
        ],
      },
      {
        id: "contenuti",
        title: "Contenuti pubblicati",
        paragraphs: [
          "Le informazioni presenti sul sito vengono aggiornate con cura, ma non costituiscono garanzia di completezza o adeguatezza a ogni specifica esigenza.",
        ],
      },
      {
        id: "proprieta",
        title: "Proprietà intellettuale",
        paragraphs: [
          "I contenuti del sito sono protetti e non possono essere riprodotti integralmente o parzialmente senza autorizzazione, salvo quanto consentito dalla legge.",
        ],
      },
      {
        id: "collegamenti",
        title: "Collegamenti esterni",
        paragraphs: [
          "I link verso siti esterni sono forniti a scopo informativo. Il Titolare non esercita controllo su tali siti e non risponde dei loro contenuti.",
        ],
      },
      {
        id: "responsabilita",
        title: "Responsabilità",
        paragraphs: [
          "Il Titolare non risponde per danni derivanti dall'utilizzo del sito non conforme al presente avviso o a eventi al di fuori del proprio controllo.",
        ],
      },
      {
        id: "legge",
        title: "Legge applicabile",
        paragraphs: [
          "Il rapporto tra il Titolare e gli utenti è regolato dalla legge applicabile, fatto salvo il rispetto di eventuali disposizioni imperative.",
        ],
      },
      {
        id: "contatti",
        title: "Contatti",
        paragraphs: [
          "Per richieste o segnalazioni è possibile utilizzare le informazioni di contatto riportate nel footer del sito.",
        ],
      },
    ],
  },
];

export const legalGroups = [
  {
    label: "Fondamentali",
    slugs: ["termini-e-condizioni", "privacy", "accessibilita"],
  },
  {
    label: "Privacy e principi",
    slugs: ["carta-accordo-privacy", "manifesto-soberania-digitale", "protezione-dati"],
  },
  {
    label: "Utilizzo del sito",
    slugs: ["termini-di-utilizzo", "accordo-utente", "cookie-policy", "avviso-legale"],
  },
  {
    label: "Acquisti",
    slugs: ["resi-e-rimborsi"],
  },
];

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((document) => document.slug === slug);
}
