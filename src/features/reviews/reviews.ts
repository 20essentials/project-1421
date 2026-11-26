import { languageTag, type Locale } from "@/features/i18n/locale";

export interface Review {
  id: number;
  name: string;
  date: string;
  location: string;
  text: string;
  excerpt: string;
}

export const REVIEWS: Review[] = [
  {
    id: 1,
    name: "Valentina Oliviero",
    date: "13 settembre 2026",
    location: "Castel Formentini",
    text: `Abbiamo avuto la fortuna di lavorare assieme a Stefano, un fotografo bravissimo, professionale che sa farti sentire a tuo agio. Grazie alla nostra location, il castel formentini abbiamo avuto l'onore di conoscerlo e sceglierlo per il nostro grande giorno. Rimarrà la scelta migliore che potessimo fare. Consigliamo a tutti gli sposi di affidarsi a lui.`,
    excerpt:
      "Abbiamo avuto la fortuna di lavorare assieme a Stefano, un fotografo bravissimo, professionale che sa farti sentire a tuo agio.",
  },
  {
    id: 2,
    name: "Felix & Jess",
    date: "22 agosto 2026",
    location: "Castello di Spessa",
    text: `We couldn't be happier with our decision to have Stefano photograph our wedding at Castello di Spessa. From our very first conversation, he was incredibly responsive, easy to communicate with, and genuinely invested in getting to know us. When we happened to be in the area before the wedding, he even invited us to his home so we could meet in person, which was such a thoughtful gesture. In the days leading up to the wedding, he checked in to make sure everything was on track and even offered help beyond photography, which we really appreciated.

One of our biggest concerns when choosing a wedding photographer was ending up with photos that felt too staged or cliché and simply weren't "us." Stefano immediately put those fears to rest. His style captured the atmosphere, emotions, and joy of the day in such a natural and authentic way.

Because Stefano knows both the venue and weddings so well, we never had to worry about what to do or where to go. He confidently guided us throughout the day, allowing us to relax, enjoy the moment, and trust that he would create something beautiful.

One thing that truly exceeded our expectations was how quickly he shared a selection of preview photos. Receiving those beautiful images just days after the wedding allowed us to relive the day while everything was still so fresh, and it meant so much to us.

The final photographs are everything we had hoped for and more. We are incredibly grateful to Stefano for capturing our wedding so beautifully and would recommend him without hesitation to any couple looking for authentic, timeless wedding photography.`,
    excerpt:
      "We couldn't be happier with our decision to have Stefano photograph our wedding at Castello di Spessa.",
  },
  {
    id: 3,
    name: "Denny Perrelli",
    date: "11 luglio 2026",
    location: "Friuli Venezia Giulia",
    text: `Scegliere il fotografo per il matrimonio è sempre una decisione difficile, ma con Stefano c'è stata subito una sintonia perfetta. Ci ha colpito fin da subito il suo modo di ascoltare: voleva capire davvero chi fossimo noi come coppia, a differenza di chi affronta gli sposi come l'ennesimo servizio fotografico di routine. Non abbiamo avuto un semplice fotografo al nostro fianco, ma un vero e proprio alleato.

Nel vivo della festa, in mezzo al caos più bello tra abbracci, baci e invitati che volevano fare selfie nel bel mezzo degli scatti, Stefano non ha mai perso la pazienza. Anzi, ha dimostrato una calma e una diplomazia fuori dal comune, gestendo tutto quell'entusiasmo con un'eleganza incredibile. È stato proprio questo il suo superpotere: ci ha permesso di vivere la giornata con un'immensa tranquillità. Fin dai primi scatti si vedeva chiaramente la differenza tra un professionista con la "P" maiuscola e chi fa le foto "giusto per".

Se non avessimo scelto Stefano, probabilmente avremmo vissuto la giornata con molta più ansia. Lui ha letteralmente protetto la nostra serenità.

A chi è ancora indeciso vogliamo dare un consiglio: non guardate solo la resa delle foto, ma valutate soprattutto come il fotografo sa stare in mezzo alla gente e gestire i momenti imprevedibili. Se tornassimo indietro, lo sceglieremmo altre mille volte!`,
    excerpt:
      "Scegliere il fotografo per il matrimonio è sempre una decisione difficile, ma con Stefano c'è stata subito una sintonia perfetta.",
  },
  {
    id: 4,
    name: "Mattia Mirolo",
    date: "4 luglio 2026",
    location: "Friuli Venezia Giulia",
    text: `Penso che la mia recensione sia molto meno importante che andare a vedere il suo lavoro sui suoi canali. Meritano una visita perché si può vedere l'arte di Stefano come lui la intende. Noi l'abbiamo scelto per il nostro matrimonio perché condividiamo la sua idea di reportage della giornata, dinamico, ma che mette le persone al centro (sempre sotto una bella luce!). Siamo molto soddisfatti delle emozioni che ha saputo catturare sull'obiettivo, certi che accarezzando le foto tra qualche decennio ci riporteranno lì, allora.`,
    excerpt:
      "Penso che la mia recensione sia molto meno importante che andare a vedere il suo lavoro sui suoi canali.",
  },
  {
    id: 5,
    name: "Marta Casarin",
    date: "27 giugno 2026",
    location: "Veneto",
    text: `Abbiamo scelto Stefano Lunardi come fotografo per il nostro matrimonio e, col senno di poi, possiamo dire con certezza che non avremmo potuto fare scelta migliore.

Fin dal primo momento si è dimostrato una persona estremamente professionale, disponibile e capace di metterci a nostro agio. Durante tutta la giornata ci ha seguiti con una presenza costante ma mai invadente, sempre con grande competenza, pazienza e con il sorriso sulle labbra, riuscendo a trasmetterci tranquillità anche nei momenti più emozionanti e frenetici.

Una delle cose che ci ha colpito di più è stata la sua capacità di guidarci davanti all'obiettivo. Noi non siamo assolutamente abituati a fare foto o pose, eppure Stefano è riuscito a tirar fuori da noi spontaneità, naturalezza ed emozioni vere. Ci ha suggerito pose, movenze e sguardi che non avremmo mai immaginato di riuscire a fare, facendoci sentire sempre a nostro agio e mai "costruiti".

Stefano è una persona dinamica, simpatica e molto empatica, ma allo stesso tempo è un professionista serio e preparato, attento a ogni dettaglio. Sa lavorare con discrezione, catturando momenti autentici senza essere invadente, ma quando serve sa anche essere deciso e coinvolgente per ottenere il meglio dagli sposi e dagli invitati.

E sì... ci ha "torchiato" parecchio durante gli scatti! Ma oggi possiamo dire che aveva assolutamente ragione lui: vedere il risultato finale ci ha fatto capire quanto impegno, esperienza e passione metta nel suo lavoro. Ogni fotografia trasmette emozione, eleganza e autenticità.

Non è semplicemente un fotografo, ma una persona che riesce davvero a raccontare una giornata speciale attraverso le immagini. Per questo lo consigliamo senza alcun dubbio a chi cerca un professionista di alto livello, capace di creare ricordi meravigliosi che resteranno per sempre.`,
    excerpt:
      "Abbiamo scelto Stefano Lunardi come fotografo per il nostro matrimonio e, col senno di poi, possiamo dire con certezza che non avremmo potuto fare scelta migliore.",
  },
  {
    id: 6,
    name: "Silke & Stefan",
    date: "11 ottobre 2024",
    location: "The St. Regis Venice",
    text: `I was particularly struck by one thing: Stefano manages to be, at the same time, a discreet photojournalist and a fashion photographer.

On one hand, he captures fleeting, unrepeatable moments: a heartfelt hug, an emotion, a look between me and my parents, the guests. On the other, he can recreate a scene with a modern, editorial, fashion feel: he builds a set and gives you fairytale images. That day I felt like a princess, and with my husband we looked like two Vogue cover models.

On top of that, he is perfectly able to manage and coordinate the whole day. If you don't have a wedding planner, Stefano offers to coordinate all the suppliers, from the make-up artist to the DJ, including the venue. Thanks to his experience, any hiccups are avoided and the timeline and the light are used to their best, always respecting the needs of every supplier.`,
    excerpt:
      "I was particularly struck by one thing: Stefano manages to be, at the same time, a discreet photojournalist and a fashion photographer.",
  },
  {
    id: 7,
    name: "Maximilian Formentini",
    date: "5 maggio 2023",
    location: "Castello di Spessa",
    text: `An Outstanding Wedding Photographer – Highly Recommended!

We couldn't have been happier with our experience with Stefano Lunardi!

Stefano was the photographer for our wedding, and we are truly grateful for the beautiful memories he captured of such an important day in our lives.

The wedding album he created for us is absolutely stunning. Every photograph beautifully captures the emotions, atmosphere, and unforgettable moments of our special day. His attention to detail and artistic talent are truly exceptional.

The wedding video was equally wonderful. Watching it allows us to relive the magic of our wedding day, bringing back all the emotions and happiness we experienced.

Beyond his incredible work, Stefano was a pleasure to work with, making the entire experience enjoyable and memorable.

We wholeheartedly recommend Stefano Lunardi to any couple looking for a talented wedding photographer who can transform their most precious memories into something they will treasure for a lifetime.

Thank you, Stefano, for giving us such beautiful memories that we will cherish forever!`,
    excerpt: "An Outstanding Wedding Photographer – Highly Recommended!",
  },
  {
    id: 8,
    name: "Trine e Alexander",
    date: "18 febbraio 2023",
    location: "Venezia",
    text: `We chose Mr Lunardi as our Wedding Photographer because of his outstanding and incredible work. Stefano Lunardi caught all the right moments and expressions at all the correct times, and the quality of the pictures is excellent. He photographed in colour and in black/white, and they are all incredibly edited. He works extraordinarily with shadows and light and makes every photo live. He chose no less than the very best of his work to return to us perfectly edited and highly thought through. He cared a great deal about us and was very easy to talk to and work with after the wedding, as during the wedding day, to decide which photos to choose for the fantastic photo book he creates. We will highly recommend Stefano Lunardi to any couple who is getting married and of course, to anyone who just wants beautiful photos to keep for life. There is no fear of a rainy day; Stefano Lunardi will make the rain light up the picture!`,
    excerpt:
      "We chose Mr Lunardi as our Wedding Photographer because of his outstanding and incredible work.",
  },
  {
    id: 9,
    name: "Kurt",
    date: "13 agosto 2022",
    location: "Grado",
    text: `Thanks for the amazing photos of our marriage in Grado (Italy). Stefano has outperformed our expectations by far and we are so happy to have so many incredible pictures of our most important day. We met Stefano first time 30 minutes before our wedding ceremony started (Stefano was arranged by our wedding planner). He was so professional and friendly which really helped us to calm down at this exciting moment. We really enjoyed our photo shoot in a pleasant and relaxed way. Again, thank you Stefano for being our photographer - you did a great job!`,
    excerpt:
      "Thanks for the amazing photos of our marriage in Grado (Italy).",
  },
  {
    id: 10,
    name: "Deborah",
    date: "9 luglio 2022",
    location: "Sposi dall'estero",
    text: `A great professional who perfectly knows the value of the "moment". Present and discreet during the whole day, he caught every emotion in a very natural way. Since me and my husband were (and still) live abroad, we could not meet Stefano in person before the wedding day but, no worries: he took care of us by email/chat and together we defined the details of the shooting and the general arrangements. In the shooting he is very attentive and meticulous, I loved his work at first sight especially for the naturalness, dynamic yet timeless style.`,
    excerpt:
      'A great professional who perfectly knows the value of the "moment".',
  },
];

const IT_MONTHS: Record<string, number> = {
  gennaio: 1,
  febbraio: 2,
  marzo: 3,
  aprile: 4,
  maggio: 5,
  giugno: 6,
  luglio: 7,
  agosto: 8,
  settembre: 9,
  ottobre: 10,
  novembre: 11,
  dicembre: 12,
};

export function formatReviewDate(locale: Locale, value: string): string {
  const match = value.trim().match(/^(\d{1,2})\s+([a-zùàèé]+)\s+(\d{4})$/i);
  const month = match ? IT_MONTHS[match[2]?.toLowerCase() ?? ""] : undefined;
  if (!match || !month) return value;
  const date = new Date(Date.UTC(Number(match[3]), month - 1, Number(match[1])));
  return new Intl.DateTimeFormat(languageTag(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

const HOME_PREVIEW_IDS = [1, 2, 3, 4, 5, 6];

export function getHomeReviews(): Review[] {
  return HOME_PREVIEW_IDS.map((id) => REVIEWS.find((review) => review.id === id)).filter(
    (review): review is Review => Boolean(review),
  );
}
