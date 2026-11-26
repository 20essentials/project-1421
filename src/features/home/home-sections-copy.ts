import type { Locale } from "@/features/i18n/locale";

interface TitleLine {
  before: string;
  em: string;
  after: string;
}

interface TextStep {
  title: string;
  copy: string;
}

interface MethodStep {
  eyebrow: string;
  copy: string;
}

interface DeliveryStep {
  number: string;
  unit: string;
  title: string;
  copy: string;
}

interface Region {
  name: string;
  places: string;
}

interface Stat {
  value: string;
  label: string;
}

export interface HomeSectionsCopy {
  gridTitle: string;
  method: {
    eyebrow: string;
    title: string;
    lead: string;
    body: string;
    steps: MethodStep[];
    cta: string;
  };
  percorso: {
    eyebrow: string;
    title: TitleLine[];
    intro: string;
    steps: TextStep[];
  };
  delivery: {
    eyebrow: string;
    title: string;
    steps: DeliveryStep[];
  };
  where: {
    eyebrow: string;
    title: string;
    regions: Region[];
    closing: string;
  };
  stats: {
    ariaLabel: string;
    items: Stat[];
  };
  reviews: {
    eyebrow: string;
    title: string;
    intro: string;
    cta: string;
    newlyweds: string;
  };
  faq: {
    intro: string;
    readMore: string;
  };
  imageAlts: {
    hero: string;
    heroSecondary: string;
    art: string;
    veil: string;
    about: string;
    method: string;
  };
  video: {
    title: string;
    playLabel: string;
    posterAlt: string;
    ariaLabel: string;
  };
}

export const HOME_SECTIONS_COPY: Record<Locale, HomeSectionsCopy> = {
  it: {
    gridTitle: "MOMENTI VERI, composti con eleganza",
    method: {
      eyebrow: "Il mio metodo",
      title: "IL METODO Fusion",
      lead: "L'eleganza della moda, la naturalezza del reportage.",
      body: "È per questo che le vostre fotografie avranno la cura di un editoriale e la verità di un racconto. Un modo di lavorare costruito in anni di reportage e di fotografia d'autore, pensato per chi desidera immagini belle e insieme autentiche.",
      steps: [
        {
          eyebrow: "Una regia invisibile",
          copy: "Vi guido solo quando serve: una luce, un gesto, un punto in cui fermarvi. Poi mi faccio da parte e lascio accadere la giornata. Per gran parte del tempo non vi accorgerete nemmeno che ci sono.",
        },
        {
          eyebrow: "Il tempo della pellicola",
          copy: "Un rullino ha trentasei scatti, e questo cambia il modo in cui guardo una stanza. Non inseguo la fotografia giusta: la aspetto.",
        },
        {
          eyebrow: "Pellicola e digitale, insieme",
          copy: "Ogni matrimonio lo fotografo su pellicola e in digitale. Non dovete scegliere: la pellicola porta il carattere, il digitale racconta tutto il resto della giornata.",
        },
      ],
      cta: "Leggi tutto il metodo",
    },
    percorso: {
      eyebrow: "IL PERCORSO INSIEME",
      title: [
        { before: "CI VEDIAMO ", em: "tre", after: "" },
        { before: "", em: "volte", after: " PRIMA DEL" },
        { before: "GRANDE GIORNO", em: "", after: "" },
      ],
      intro:
        "Il giorno del matrimonio non sarò un fornitore appena arrivato, ma una presenza che conoscete già. E questo si vede in ogni fotografia.",
      steps: [
        {
          title: "Ci conosciamo:",
          copy: "Parliamo di voi prima che del matrimonio: come vi siete incontrati, chi sarà con voi, cosa vi mette a vostro agio davanti all'obiettivo.",
        },
        {
          title: "Disegniamo la giornata:",
          copy: "Ripercorriamo insieme il programma: luoghi, orari, la luce che troveremo. Così quel giorno potrò guardare voi, non l'orologio.",
        },
        {
          title: "Gli ultimi dettagli:",
          copy: "Qualche giorno prima ci risentiamo per chiudere ogni cosa. Arrivate al matrimonio sereni, senza pensieri e senza sorprese.",
        },
      ],
    },
    delivery: {
      eyebrow: "COSA RICEVETE",
      title: "LE VOSTRE FOTOGRAFIE, con i tempi giusti",
      steps: [
        {
          number: "7",
          unit: "GIORNI",
          title: "Un'anteprima",
          copy: "Una prima selezione, mentre l'emozione della giornata è ancora viva.",
        },
        {
          number: "15",
          unit: "GIORNI",
          title: "Il racconto completo",
          copy: "Tutto il matrimonio, su pellicola e in digitale, sviluppato e selezionato da me.",
        },
        {
          number: "3",
          unit: "SETTIMANE",
          title: "Da tenere tra le mani",
          copy: "Un album, una scatola di stampe fine art o una piccola mostra: lo scegliamo insieme.",
        },
      ],
    },
    where: {
      eyebrow: "Dove fotografo",
      title: "Friuli, Veneto e Austria",
      regions: [
        {
          name: "Friuli Venezia Giulia",
          places: "Udine · Pordenone · Trieste · Gorizia · Collio · Lignano",
        },
        {
          name: "Veneto",
          places: "Treviso · Venezia · Padova · Belluno · Colli Asolani",
        },
        {
          name: "Austria",
          places: "Carinzia · Villach · Klagenfurt · Wörthersee · Stiria · Graz",
        },
      ],
      closing: "e ovunque vi porti la vostra storia.",
    },
    reviews: {
      eyebrow: "Le parole degli sposi",
      title: "Le recensioni, una per una",
      intro: "Storie vere, raccontate con le parole di chi le ha vissute.",
      cta: "Tutte le recensioni",
      newlyweds: "Sposi",
    },
    faq: {
      intro:
        "Le risposte che cercate prima ancora di scrivere: come lavoriamo, gli incontri, le trasferte, i tempi di consegna. Tre in anteprima qui, tutte nella pagina FAQ.",
      readMore: "Leggi la risposta completa",
    },
    stats: {
      ariaLabel: "Numeri e riconoscimenti",
      items: [
        { value: "40+", label: "Riconoscimenti internazionali" },
        { value: "QEP", label: "Qualified European Photographer" },
        { value: "Dal 2012", label: "Matrimoni in Italia e in Austria" },
        { value: "25", label: "Matrimoni l'anno, non di più" },
      ],
    },
    imageAlts: {
      hero: "Fotografia di matrimonio fine art — Stefano Lunardi",
      heroSecondary: "Fotografia d'arte — Stefano Lunardi",
      art: "Fotografia d'arte — opera esposta in galleria, Stefano Lunardi",
      veil: "Coppia in bianco e nero che cammina — fotografia fine art di matrimonio, Stefano Lunardi",
      about: "Stefano Lunardi, fotografo di matrimoni fine art, con la sua macchina fotografica",
      method: "Coppia in bianco e nero che cammina — fotografia fine art di matrimonio, Stefano Lunardi",
    },
    video: {
      title: "Mi presento — Stefano Lunardi",
      playLabel: "Riproduci: Mi presento — Stefano Lunardi",
      posterAlt: "Stefano Lunardi nel suo studio, anteprima del video Mi presento",
      ariaLabel: "Clip in loop: Stefano dipinge e registra la nascita di una sua opera",
    },
  },

  es: {
    gridTitle: "MOMENTOS REALES, compuestos con elegancia",
    method: {
      eyebrow: "Mi método",
      title: "EL MÉTODO Fusion",
      lead: "La elegancia de la moda, la naturalidad del reportaje.",
      body: "Por eso vuestras fotografías tendrán el cuidado de un editorial y la verdad de una historia. Una forma de trabajar construida durante años de reportaje y fotografía de autor, pensada para quien desea imágenes bellas y, al mismo tiempo, auténticas.",
      steps: [
        {
          eyebrow: "Una dirección invisible",
          copy: "Os guío solo cuando hace falta: una luz, un gesto, un punto donde deteneros. Después me aparto y dejo que el día suceda. Casi no notaréis que estoy ahí.",
        },
        {
          eyebrow: "El tiempo de la película",
          copy: "Un carrete tiene treinta y seis disparos, y eso cambia la forma en que miro una sala. No persigo la foto correcta: la espero.",
        },
        {
          eyebrow: "Película y digital, juntos",
          copy: "Cada boda la fotografo en película y en digital. No tenéis que elegir: la película aporta el carácter y el digital cuenta el resto del día.",
        },
      ],
      cta: "Lee todo sobre el método",
    },
    percorso: {
      eyebrow: "EL CAMINO JUNTOS",
      title: [
        { before: "NOS VEMOS ", em: "tres", after: "" },
        { before: "", em: "veces", after: " ANTES DEL" },
        { before: "GRAN DÍA", em: "", after: "" },
      ],
      intro:
        "El día de la boda no seré un proveedor que acaba de llegar, sino una persona a la que ya conocéis. Y eso se ve en cada fotografía.",
      steps: [
        {
          title: "Nos conocemos:",
          copy: "Hablamos de vosotros antes que de la boda: cómo os conocisteis, quién estará con vosotros, qué os pone a gusto frente a la cámara.",
        },
        {
          title: "Diseñamos el día:",
          copy: "Repasamos juntos el programa: lugares, horarios, la luz que encontraremos. Así ese día podré miraros a vosotros, no al reloj.",
        },
        {
          title: "Los últimos detalles:",
          copy: "Unos días antes volvemos a hablar para cerrar todo. Llegad a la boda tranquilos, sin preocupaciones y sin sorpresas.",
        },
      ],
    },
    delivery: {
      eyebrow: "QUÉ RECIBÍS",
      title: "VUESTRAS FOTOGRAFÍAS, con los plazos adecuados",
      steps: [
        {
          number: "7",
          unit: "DÍAS",
          title: "Un adelanto",
          copy: "Una primera selección, mientras la emoción del día sigue viva.",
        },
        {
          number: "15",
          unit: "DÍAS",
          title: "La historia completa",
          copy: "Toda la boda, en película y en digital, revelada y seleccionada por mí.",
        },
        {
          number: "3",
          unit: "SEMANAS",
          title: "Para tener en las manos",
          copy: "Un álbum, una caja de copias fine art o una pequeña exposición: lo elegimos juntos.",
        },
      ],
    },
    where: {
      eyebrow: "Dónde fotografo",
      title: "Friuli, Véneto y Austria",
      regions: [
        {
          name: "Friuli-Venezia Giulia",
          places: "Udine · Pordenone · Trieste · Gorizia · Collio · Lignano",
        },
        {
          name: "Véneto",
          places: "Treviso · Venecia · Padua · Belluno · Colli Asolani",
        },
        {
          name: "Austria",
          places: "Carintia · Villach · Klagenfurt · Wörthersee · Estiria · Graz",
        },
      ],
      closing: "y dondequiera que vuestra historia os lleve.",
    },
    reviews: {
      eyebrow: "Las palabras de los novios",
      title: "Las reseñas, una por una",
      intro: "Historias reales, contadas con las palabras de quienes las vivieron.",
      cta: "Ver todas las reseñas",
      newlyweds: "Novios",
    },
    faq: {
      intro:
        "Las respuestas que buscáis antes incluso de escribir: cómo trabajo, los encuentros, los desplazamientos, los plazos de entrega. Tres aquí, todas en la página de FAQ.",
      readMore: "Leer la respuesta completa",
    },
    stats: {
      ariaLabel: "Cifras y reconocimientos",
      items: [
        { value: "40+", label: "Reconocimientos internacionales" },
        { value: "QEP", label: "Fotógrafo europeo cualificado" },
        { value: "Desde 2012", label: "Bodas en Italia y Austria" },
        { value: "25", label: "Bodas al año, no más" },
      ],
    },
    imageAlts: {
      hero: "Fotografía de boda fine art — Stefano Lunardi",
      heroSecondary: "Fotografía de arte — Stefano Lunardi",
      art: "Fotografía de arte — obra expuesta en galería, Stefano Lunardi",
      veil: "Pareja en blanco y negro caminando — fotografía de boda fine art, Stefano Lunardi",
      about: "Stefano Lunardi, fotógrafo de bodas fine art, con su cámara",
      method: "Pareja en blanco y negro caminando — fotografía de boda fine art, Stefano Lunardi",
    },
    video: {
      title: "Me presento — Stefano Lunardi",
      playLabel: "Reproducir: Me presento — Stefano Lunardi",
      posterAlt: "Stefano Lunardi en su estudio, vista previa del vídeo Me presento",
      ariaLabel: "Vídeo en bucle: Stefano pinta y registra el nacimiento de una de sus obras",
    },
  },

  en: {
    gridTitle: "REAL MOMENTS, composed with elegance",
    method: {
      eyebrow: "My method",
      title: "THE Fusion METHOD",
      lead: "Fashion's elegance, reportage's honesty.",
      body: "That is why your photographs will have the care of an editorial and the truth of a story. A way of working built over years of reportage and fine-art photography, made for people who want images that are beautiful and genuine at once.",
      steps: [
        {
          eyebrow: "An invisible direction",
          copy: "I only guide you when it matters: a light, a gesture, a place to pause. Then I step aside and let the day happen. Most of the time you won't even notice I'm there.",
        },
        {
          eyebrow: "The pace of film",
          copy: "A roll holds thirty-six frames, and that changes how I look at a room. I don't chase the right photograph: I wait for it.",
        },
        {
          eyebrow: "Film and digital, together",
          copy: "I photograph every wedding on both film and digital. You don't have to choose: film brings the character, digital tells the rest of the day.",
        },
      ],
      cta: "Read the whole method",
    },
    percorso: {
      eyebrow: "THE JOURNEY TOGETHER",
      title: [
        { before: "WE MEET ", em: "three", after: "" },
        { before: "", em: "times", after: " BEFORE THE" },
        { before: "BIG DAY", em: "", after: "" },
      ],
      intro:
        "On your wedding day I won't be a supplier who has just arrived, but a presence you already know. And that shows in every photograph.",
      steps: [
        {
          title: "We get to know each other:",
          copy: "We talk about you before we talk about the wedding: how you met, who will be with you, what makes you feel at ease in front of the camera.",
        },
        {
          title: "We design the day:",
          copy: "We walk through the schedule together: places, timings, the light we'll find. So on the day I can look at you, not at my watch.",
        },
        {
          title: "The final details:",
          copy: "A few days earlier we touch base to close every loose end. You arrive at your wedding calm, carefree and with no surprises.",
        },
      ],
    },
    delivery: {
      eyebrow: "WHAT YOU RECEIVE",
      title: "YOUR PHOTOGRAPHS, on the right timeline",
      steps: [
        {
          number: "7",
          unit: "DAYS",
          title: "A first look",
          copy: "An initial selection, while the emotion of the day is still alive.",
        },
        {
          number: "15",
          unit: "DAYS",
          title: "The full story",
          copy: "The whole wedding, on film and digital, developed and selected by me.",
        },
        {
          number: "3",
          unit: "WEEKS",
          title: "Something to hold",
          copy: "An album, a box of fine-art prints or a small exhibition: we choose together.",
        },
      ],
    },
    where: {
      eyebrow: "Where I photograph",
      title: "Friuli, Veneto and Austria",
      regions: [
        {
          name: "Friuli Venezia Giulia",
          places: "Udine · Pordenone · Trieste · Gorizia · Collio · Lignano",
        },
        {
          name: "Veneto",
          places: "Treviso · Venice · Padua · Belluno · Colli Asolani",
        },
        {
          name: "Austria",
          places: "Carinthia · Villach · Klagenfurt · Wörthersee · Styria · Graz",
        },
      ],
      closing: "and wherever your story takes you.",
    },
    reviews: {
      eyebrow: "Words from the newlyweds",
      title: "The reviews, one by one",
      intro: "Real stories, told in the words of the people who lived them.",
      cta: "Read all reviews",
      newlyweds: "Newlyweds",
    },
    faq: {
      intro:
        "The answers you look for before you even write: how I work, the meetings, the travel, the delivery times. Three here, all of them on the FAQ page.",
      readMore: "Read the full answer",
    },
    stats: {
      ariaLabel: "Numbers and awards",
      items: [
        { value: "40+", label: "International awards" },
        { value: "QEP", label: "Qualified European Photographer" },
        { value: "Since 2012", label: "Weddings in Italy and Austria" },
        { value: "25", label: "Weddings a year, no more" },
      ],
    },
    imageAlts: {
      hero: "Fine-art wedding photograph — Stefano Lunardi",
      heroSecondary: "Fine-art photograph — Stefano Lunardi",
      art: "Fine-art photograph — work exhibited in a gallery, Stefano Lunardi",
      veil: "Black-and-white couple walking — fine-art wedding photograph, Stefano Lunardi",
      about: "Stefano Lunardi, fine-art wedding photographer, with his camera",
      method: "Black-and-white couple walking — fine-art wedding photograph, Stefano Lunardi",
    },
    video: {
      title: "Let me introduce myself — Stefano Lunardi",
      playLabel: "Play: Let me introduce myself — Stefano Lunardi",
      posterAlt: "Stefano Lunardi in his studio, preview of the introduction video",
      ariaLabel: "Looping clip: Stefano paints and records the birth of one of his works",
    },
  },

  de: {
    gridTitle: "ECHTE MOMENTE, mit Eleganz komponiert",
    method: {
      eyebrow: "Meine Methode",
      title: "DIE Fusion-METHODE",
      lead: "Die Eleganz der Mode, die Natürlichkeit des Reportage-Stils.",
      body: "Deshalb bekommen Ihre Fotos die Sorgfalt eines Editorials und die Wahrheit einer Geschichte. Eine Arbeitsweise, die über Jahre in Reportage und künstlerischer Fotografie gewachsen ist – für Menschen, die Bilder möchten, die zugleich schön und echt sind.",
      steps: [
        {
          eyebrow: "Unsichtbare Regie",
          copy: "Ich führe Sie nur, wenn es nötig ist: ein Licht, eine Geste, ein Punkt zum Innehalten. Danach trete ich zur Seite und lasse den Tag geschehen. Die meiste Zeit merken Sie gar nicht, dass ich da bin.",
        },
        {
          eyebrow: "Die Zeit des Films",
          copy: "Eine Rolle hat sechsunddreißig Aufnahmen – und das verändert, wie ich einen Raum ansehe. Ich jage nicht das richtige Foto: ich warte darauf.",
        },
        {
          eyebrow: "Film und Digital, zusammen",
          copy: "Jede Hochzeit fotografier ich auf Film und digital. Sie müssen sich nicht entscheiden: der Film bringt den Charakter, das Digitalfoto erzählt den Rest des Tages.",
        },
      ],
      cta: "Die ganze Methode lesen",
    },
    percorso: {
      eyebrow: "DER WEG ZUSAMMEN",
      title: [
        { before: "WIR SEHEN UNS ", em: "dreimal", after: "" },
        { before: "", em: "vor", after: " DEM GROSSEN" },
        { before: "TAG", em: "", after: "" },
      ],
      intro:
        "Am Hochzeitstag bin ich kein gerade angekommener Dienstleister, sondern ein Mensch, den Sie bereits kennen. Und das sieht man in jedem Foto.",
      steps: [
        {
          title: "Wir lernen uns kennen:",
          copy: "Wir sprechen über Sie, bevor wir über die Hochzeit sprechen: wie Sie sich kennengelernt haben, wer bei Ihnen sein wird, was Sie vor der Kamera entspannt.",
        },
        {
          title: "Wir gestalten den Tag:",
          copy: "Wir gehen den Ablauf gemeinsam durch: Orte, Zeiten, das Licht, das wir finden. Damit ich an jenem Tag Sie ansehen kann – nicht die Uhr.",
        },
        {
          title: "Die letzten Details:",
          copy: "Ein paar Tage später melden wir uns noch einmal, um alles abzuschließen. Sie kommen gelassen zur Hochzeit, ohne Sorgen und ohne Überraschungen.",
        },
      ],
    },
    delivery: {
      eyebrow: "WAS SIE BEKOMMEN",
      title: "IHRE FOTOS, im richtigen Tempo",
      steps: [
        {
          number: "7",
          unit: "TAGE",
          title: "Ein erster Blick",
          copy: "Eine erste Auswahl, während die Emotion des Tages noch lebendig ist.",
        },
        {
          number: "15",
          unit: "TAGE",
          title: "Die ganze Geschichte",
          copy: "Die gesamte Hochzeit, auf Film und digital, von mir entwickelt und ausgewählt.",
        },
        {
          number: "3",
          unit: "WOCHEN",
          title: "Zum Anfassen",
          copy: "Ein Album, eine Box mit Fine-Art-Abzügen oder eine kleine Ausstellung: wir entscheiden gemeinsam.",
        },
      ],
    },
    where: {
      eyebrow: "Wo ich fotografiere",
      title: "Friaul, Venetien und Österreich",
      regions: [
        {
          name: "Friaul-Julisch Venetien",
          places: "Udine · Pordenone · Triest · Görz · Collio · Lignano",
        },
        {
          name: "Venetien",
          places: "Treviso · Venedig · Padua · Belluno · Colli Asolani",
        },
        {
          name: "Österreich",
          places: "Kärnten · Villach · Klagenfurt · Wörthersee · Steiermark · Graz",
        },
      ],
      closing: "und überall dorthin, wohin Ihre Geschichte Sie führt.",
    },
    reviews: {
      eyebrow: "Worte der Brautpaare",
      title: "Die Rezensionen, eine nach der anderen",
      intro: "Echte Geschichten, erzählt mit den Worten derer, die sie erlebt haben.",
      cta: "Alle Rezensionen lesen",
      newlyweds: "Brautpaar",
    },
    faq: {
      intro:
        "Die Antworten, die Sie suchen, bevor Sie überhaupt schreiben: wie ich arbeite, die Treffen, die Anreise, die Lieferzeiten. Drei hier, alle auf der FAQ-Seite.",
      readMore: "Die vollständige Antwort lesen",
    },
    stats: {
      ariaLabel: "Zahlen und Auszeichnungen",
      items: [
        { value: "40+", label: "Internationale Auszeichnungen" },
        { value: "QEP", label: "Qualified European Photographer" },
        { value: "Seit 2012", label: "Hochzeiten in Italien und Österreich" },
        { value: "25", label: "Hochzeiten pro Jahr, nicht mehr" },
      ],
    },
    imageAlts: {
      hero: "Fine-Art-Hochzeitsfoto — Stefano Lunardi",
      heroSecondary: "Kunstfoto — Stefano Lunardi",
      art: "Kunstfoto — in einer Galerie ausgestelltes Werk, Stefano Lunardi",
      veil: "Schwarz-weißes Paar beim Spaziergang — Fine-Art-Hochzeitsfoto, Stefano Lunardi",
      about: "Stefano Lunardi, Fine-Art-Hochzeitsfotograf, mit seiner Kamera",
      method: "Schwarz-weißes Paar beim Spaziergang — Fine-Art-Hochzeitsfoto, Stefano Lunardi",
    },
    video: {
      title: "Ich stelle mich vor — Stefano Lunardi",
      playLabel: "Abspielen: Ich stelle mich vor — Stefano Lunardi",
      posterAlt: "Stefano Lunardi in seinem Studio, Vorschau des Vorstellungsvideos",
      ariaLabel: "Endlosschleife: Stefano malt und hält die Entstehung eines seiner Werke fest",
    },
  },
};

/** The CMS stores the Italian source string; a translated overlay may replace it. */
export function localizedGridTitle(locale: Locale, cmsTitle: string): string {
  const fallback = HOME_SECTIONS_COPY[locale].gridTitle;
  if (!cmsTitle) return fallback;
  if (locale === "it") return cmsTitle;
  return cmsTitle === HOME_SECTIONS_COPY.it.gridTitle ? fallback : cmsTitle;
}
