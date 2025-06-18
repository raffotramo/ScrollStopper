import { ChallengeDay } from "../types";

// Macro categorie per semplificare l'esperienza utente
export const CHALLENGE_CATEGORIES = {
  MINDFULNESS: {
    name: "Mindfulness",
    description: "Ritrova equilibrio e consapevolezza",
    icon: "🧘",
    color: "blue"
  },
  CREATIVITY: {
    name: "Creatività",
    description: "Esprimi il tuo lato artistico",
    icon: "🎨",
    color: "purple"
  },
  CONNECTION: {
    name: "Connessioni",
    description: "Rafforza relazioni e organizzazione",
    icon: "🤝",
    color: "green"
  }
};

export const challenges: ChallengeDay[] = [
  // SETTIMANA 1: Mindfulness (Giorni 1-10)
  {
    day: 1,
    title: "Respirazione Consapevole",
    description: "Fai 20 respiri lenti e profondi. Concentrati solo sul ritmo, lascia che ogni respiro porti calma e presenza.",
    timeRequired: 10,
    category: "MINDFULNESS"
  },
  {
    day: 2,
    title: "Passeggiata Mindful",
    description: "Cammina per 15 minuti senza telefono. Osserva ciò che ti circonda con curiosità, come se vedessi tutto per la prima volta.",
    timeRequired: 15,
    category: "MINDFULNESS"
  },
  {
    day: 3,
    title: "Osservazione Silenziosa",
    description: "Siediti in silenzio per 10 minuti. Osserva pensieri ed emozioni senza giudicarli, come nuvole che passano nel cielo.",
    timeRequired: 10,
    category: "MINDFULNESS"
  },
  {
    day: 4,
    title: "Snack Consapevole",
    description: "Prepara uno snack e gustalo lentamente. Presta attenzione a ogni sapore, texture e sensazione. Riscopri il piacere autentico del cibo.",
    timeRequired: 15,
    category: "MINDFULNESS"
  },
  {
    day: 5,
    title: "Gratitudine Quotidiana",
    description: "Scrivi 3 cose per cui sei grato oggi, anche piccole. Descrivi perché ti fanno sentire bene e come arricchiscono la tua vita.",
    timeRequired: 10,
    category: "MINDFULNESS"
  },
  {
    day: 6,
    title: "Journaling Mentale",
    description: "Svuota la mente su carta per 15 minuti. Scrivi tutto ciò che ti passa per la testa senza censurarti.",
    timeRequired: 15,
    category: "MINDFULNESS"
  },
  {
    day: 7,
    title: "Tè e Musica",
    description: "Prepara il tuo tè preferito e ascolta 3 canzoni rilassanti. Concentrati solo su sapori e melodie.",
    timeRequired: 15,
    category: "MINDFULNESS"
  },
  {
    day: 8,
    title: "Osserva le Stelle",
    description: "Esci la sera e guarda il cielo per 15 minuti. Lasciati ispirare dall'immensità e dalla bellezza dell'universo.",
    timeRequired: 15,
    category: "MINDFULNESS"
  },
  {
    day: 9,
    title: "Movimento Energetico",
    description: "Fai 5 esercizi a corpo libero (squat, plank, jumping jack). Riconnettiti al tuo corpo con energia positiva.",
    timeRequired: 10,
    category: "MINDFULNESS"
  },
  {
    day: 10,
    title: "Riflessione Profonda",
    description: "Scrivi una lettera al tuo io futuro. Racconta come ti senti oggi e i tuoi sogni per il domani.",
    timeRequired: 15,
    category: "MINDFULNESS"
  },

  // SETTIMANA 2: Creatività (Giorni 11-20)
  {
    day: 11,
    title: "Disegno Libero",
    description: "Disegna qualsiasi cosa per 15 minuti senza giudicare il risultato. Lascia fluire la creatività naturalmente.",
    timeRequired: 15,
    category: "CREATIVITY"
  },
  {
    day: 12,
    title: "Ricetta Nuova",
    description: "Prepara un piatto che non hai mai cucinato. Segui ogni passaggio con curiosità e goditi il processo creativo.",
    timeRequired: 25,
    category: "CREATIVITY"
  },
  {
    day: 13,
    title: "Storia Personale",
    description: "Racconta un ricordo speciale del passato. Rivivi quel momento attraverso tutti i sensi.",
    timeRequired: 15,
    category: "CREATIVITY"
  },
  {
    day: 14,
    title: "Playlist dell'Anima",
    description: "Crea una playlist di 8 canzoni che rappresentano i tuoi stati d'animo. Organizzale per raccontare la tua storia.",
    timeRequired: 20,
    category: "CREATIVITY"
  },
  {
    day: 15,
    title: "Scrittura Creativa",
    description: "Scrivi un pensiero che ti gira in testa. Dai voce ai pensieri che ronzano nella tua mente senza censurarti.",
    timeRequired: 15,
    category: "CREATIVITY"
  },
  {
    day: 16,
    title: "La Tua Bio",
    description: "Scrivi chi sei davvero in 200 parole, come se il mondo dovesse conoscerti. Un esercizio di autoconsapevolezza.",
    timeRequired: 15,
    category: "CREATIVITY"
  },
  {
    day: 17,
    title: "Esplorazione Culturale",
    description: "Impara 5 parole di una lingua straniera che ti incuriosisce. Usale durante la giornata per memorizzarle.",
    timeRequired: 15,
    category: "CREATIVITY"
  },
  {
    day: 18,
    title: "Visione del Futuro",
    description: "Scrivi una lista di 10 sogni e desideri. Dai forma alle tue aspirazioni più profonde senza limiti.",
    timeRequired: 20,
    category: "CREATIVITY"
  },
  {
    day: 19,
    title: "Recensione Autentica",
    description: "Scrivi una recensione dettagliata di un libro, film o prodotto che hai usato di recente. Condividi la tua esperienza onesta.",
    timeRequired: 20,
    category: "CREATIVITY"
  },
  {
    day: 20,
    title: "Collage Ispirazionale",
    description: "Crea un collage (fisico o digitale) che rappresenta la versione migliore di te stesso. Usa immagini e colori che ti ispirano.",
    timeRequired: 25,
    category: "CREATIVITY"
  },

  // SETTIMANA 3: Connessioni (Giorni 21-30)
  {
    day: 21,
    title: "Chiamata del Cuore",
    description: "Telefona a una persona importante e condividi questa esperienza. Raccontale del tuo percorso e chiedi il suo supporto.",
    timeRequired: 20,
    category: "CONNECTION"
  },
  {
    day: 22,
    title: "Lettera di Gratitudine",
    description: "Scrivi una lettera di ringraziamento a qualcuno che ha fatto la differenza nella tua vita. Esprimi sentimenti autentici.",
    timeRequired: 20,
    category: "CONNECTION"
  },
  {
    day: 23,
    title: "Decluttering Zen",
    description: "Riordina un cassetto o una zona disordinata. Trova almeno 3 oggetti da eliminare o donare. Crea spazio per il nuovo.",
    timeRequired: 20,
    category: "CONNECTION"
  },
  {
    day: 24,
    title: "Pulizia Digitale",
    description: "Elimina 20 file, foto o app inutili dal telefono. Libera spazio digitale e mentale per ciò che davvero conta.",
    timeRequired: 15,
    category: "CONNECTION"
  },
  {
    day: 25,
    title: "Spazio di Lavoro Ideale",
    description: "Riorganizza completamente la tua scrivania o area di lavoro. Crea un ambiente che ispiri produttività e creatività.",
    timeRequired: 25,
    category: "CONNECTION"
  },
  {
    day: 26,
    title: "Esplorazione Locale",
    description: "Esplora il tuo quartiere prendendo strade nuove. Osserva dettagli architettonici e angoli nascosti della tua zona.",
    timeRequired: 25,
    category: "CONNECTION"
  },
  {
    day: 27,
    title: "Routine Perfetta",
    description: "Progetta la tua routine mattutina ideale. Crea una sequenza di attività che trasformerà ogni tuo risveglio.",
    timeRequired: 20,
    category: "CONNECTION"
  },
  {
    day: 28,
    title: "Apprendimento Attivo",
    description: "Ascolta un podcast o leggi un articolo su un argomento nuovo. Prendi appunti sui concetti più interessanti.",
    timeRequired: 25,
    category: "CONNECTION"
  },
  {
    day: 29,
    title: "Obiettivi Concreti",
    description: "Definisci 3 traguardi specifici per i prossimi 3 mesi. Per ognuno scrivi il primo passo concreto da compiere.",
    timeRequired: 20,
    category: "CONNECTION"
  },
  {
    day: 30,
    title: "Celebrazione Finale",
    description: "Rifletti sul tuo percorso e celebra i progressi fatti. Scrivi una lettera al te stesso di 30 giorni fa.",
    timeRequired: 25,
    category: "CONNECTION"
  }
];

export const getTodaysChallenge = (currentDay: number): ChallengeDay => {
  // Ensure we're within the bounds of the challenge days (1-30)
  const safeDayIndex = Math.min(Math.max(1, currentDay), 30) - 1;
  return challenges[safeDayIndex];
};

// Claim coinvolgenti per le schede attività
export const getActivityClaim = (day: number): string => {
  const claims = [
    "Inizia il tuo cambiamento", // Giorno 1
    "Connettiti con chi conta", // Giorno 2
    "Energia pura per la tua giornata", // Giorno 3
    "Un piccolo gesto, grande impatto", // Giorno 4
    "Ritrova la bellezza nell'attesa", // Giorno 5
    "Sperimenta qualcosa di nuovo", // Giorno 6
    "Dialoga con il tuo io più profondo", // Giorno 7
    "Libera la tua creatività nascosta", // Giorno 8
    "Fai spazio a ciò che conta", // Giorno 9
    "Viaggia nei tuoi ricordi", // Giorno 10
    "Scopri il mondo che ti circonda", // Giorno 11
    "Dai voce ai tuoi pensieri", // Giorno 12
    "Amplia i tuoi orizzonti", // Giorno 13
    "Sogna in grande", // Giorno 14
    "Condividi la tua esperienza", // Giorno 15
    "Nutre la tua curiosità", // Giorno 16
    "Contempla l'infinito", // Giorno 17
    "Crea il tuo momento perfetto", // Giorno 18
    "Lascia fluire i pensieri", // Giorno 19
    "Racconta la tua storia", // Giorno 20
    "Costruisci il tuo soundtrack", // Giorno 21
    "Trova la tua pace interiore", // Giorno 22
    "Assapora ogni momento", // Giorno 23
    "Elimina ciò che non serve", // Giorno 24
    "Progetta la giornata perfetta", // Giorno 25
    "Esplora nuovi territori", // Giorno 26
    "Crea il tuo ambiente ideale", // Giorno 27
    "Celebra le piccole vittorie", // Giorno 28
    "Definisci i tuoi traguardi", // Giorno 29
    "Immagina il tuo futuro" // Giorno 30
  ];
  
  return claims[day - 1] || "Inizia il tuo cambiamento";
};

export const getDailyTip = (day: number): string => {
  const tips = [
    "Inizia la giornata senza guardare subito il telefono. Aspetta almeno 30 minuti dopo il risveglio.",
    "Ogni volta che senti l'impulso di prendere il telefono, fai un respiro profondo e chiediti se è davvero necessario.",
    "Cerca di identificare quali emozioni ti spingono a scrollare: noia, ansia, solitudine?",
    "Prova a notare quanto ti distraggi durante compiti che richiedono concentrazione.",
    "Considera quanto tempo della tua vita stai regalando alle piattaforme social.",
    "La tecnologia è progettata per essere irresistibile. Non è colpa tua se sei dipendente.",
    "Se non ti migliora la vita, forse non merita spazio nel tuo telefono.",
    "I limiti non sono prigioni, ma protezioni per la tua libertà mentale.",
    "Avere un piano di attività alternative rende più facile evitare lo scrolling automatico.",
    "Un ambiente organizzato aiuta a ridurre le distrazioni digitali.",
    "Pianificare in anticipo ti dà più controllo sulle tue giornate.",
    "La noia è un ingrediente essenziale per la creatività.",
    "Ogni volta che interrompi un'abitudine, stai riprogrammando il tuo cervello.",
    "Le piccole vittorie quotidiane costruiscono il cambiamento a lungo termine.",
    "Prova a identificare un'attività creativa che ti appassionava in passato. Anche solo 15 minuti al giorno possono aiutarti a ritrovare la passione.",
    "Tieni una lista di attività che ti danno gioia vera, non solo distrazione momentanea.",
    "La capacità di concentrazione è come un muscolo: più la alleni, più diventa forte.",
    "Gli spazi fisici influenzano i nostri comportamenti. Crea ambienti che favoriscono le abitudini che desideri.",
    "La noia è spesso il portale verso idee creative che non avresti mai avuto scrollando.",
    "Il tempo è la risorsa più preziosa che hai. Come scegli di spenderlo?",
    "Fare scelte consapevoli è diverso dal reagire agli stimoli esterni.",
    "Avere un piano B è fondamentale quando si cambiano abitudini radicate.",
    "Ciò che consumiamo digitalmente influenza le nostre emozioni e pensieri.",
    "Gli strumenti giusti possono fare la differenza nel cambiare le abitudini.",
    "Il piacere immediato non è sempre un buon indicatore di ciò che ci fa stare bene a lungo termine.",
    "Le nuove abitudini diventano permanenti con la pratica costante.",
    "I social media sono strumenti, non padroni. Tu decidi il loro posto nella tua vita.",
    "Il supporto sociale moltiplica le probabilità di successo in qualsiasi cambiamento.",
    "Guarda indietro per apprezzare quanto hai già realizzato nel tuo percorso.",
    "Le intenzioni che fissi oggi daranno forma alle tue abitudini future."
  ];
  
  // Make sure we return a tip that corresponds to the day
  const index = (day - 1) % tips.length;
  return tips[index];
};
