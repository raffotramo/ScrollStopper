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
  {
    day: 1,
    title: "Chiama un Amico",
    description: "Telefona a un amico e raccontagli di questa sfida che stai iniziando. Condividi le tue motivazioni e chiedigli supporto nel percorso.",
    timeRequired: 15,
    category: "CONNECTION"
  },
  {
    day: 2,
    title: "Cassetto Zen",
    description: "Riordina un cassetto disordinato. Trova almeno 1 cosa da eliminare o donare.",
    timeRequired: 10,
    category: "CONNECTION"
  },
  {
    day: 3,
    title: "Flash Workout",
    description: "Fai 5 esercizi fisici a corpo libero (squat, plank, jumping jack…) per riattivarti.",
    timeRequired: 10,
    category: "MINDFULNESS"
  },
  {
    day: 4,
    title: "Lettera di Gratitudine",
    description: "Esprimi un sentimento che non hai mai condiviso.",
    timeRequired: 15,
    category: "CONNECTION"
  },
  {
    day: 5,
    title: "Sfoglia & Inspira",
    description: "Prendi un libro o una rivista e sfoglialo per il gusto di farlo.",
    timeRequired: 10,
    category: "CREATIVITY"
  },
  {
    day: 6,
    title: "Cucina un Piatto Nuovo",
    description: "Prepara una ricetta che non hai mai provato.",
    timeRequired: 20,
    category: "CREATIVITY"
  },
  {
    day: 7,
    title: "Lettera a Me",
    description: "Scrivi una lettera al tuo io futuro o passato.",
    timeRequired: 10,
    category: "MINDFULNESS"
  },
  {
    day: 8,
    title: "Disegno Libero",
    description: "Disegna qualsiasi cosa ti venga in mente, senza giudizio.",
    timeRequired: 15,
    category: "CREATIVITY"
  },
  {
    day: 9,
    title: "Pulizia Digitale",
    description: "Cancella 10 file, foto o app inutili dal telefono o dal computer.",
    timeRequired: 10,
    category: "CONNECTION"
  },
  {
    day: 10,
    title: "Racconta un Ricordo",
    description: "Rivivi un momento speciale del passato attraverso i sensi.",
    timeRequired: 15,
    category: "MINDFULNESS"
  },
  {
    day: 11,
    title: "Passeggiata Detox",
    description: "Cammina attorno a casa o all'isolato senza telefono. Solo cammino, respiro e osservazione.",
    timeRequired: 10,
    category: "MINDFULNESS"
  },
  {
    day: 12,
    title: "Journaling Mentale",
    description: "Svuota la mente su carta e scopri pensieri nascosti che non sapevi di avere.",
    timeRequired: 15,
    category: "MINDFULNESS"
  },
  {
    day: 13,
    title: "Impara 5 Parole Straniere",
    description: "Scegli una lingua che ti incuriosisce e memorizza 5 parole nuove. Usale durante la giornata per fissarle nella memoria.",
    timeRequired: 10,
    category: "CREATIVITY"
  },
  {
    day: 14,
    title: "Lista dei Desideri",
    description: "Dai forma ai tuoi sogni più profondi. Alcuni ti sorprenderanno, altri ti ispireranno ad agire.",
    timeRequired: 15,
    category: "CREATIVITY"
  },
  {
    day: 15,
    title: "Scrivi una Recensione",
    description: "Recensisci un libro, film o prodotto che hai usato di recente. Condividi la tua esperienza in modo dettagliato e onesto.",
    timeRequired: 20,
    category: "CREATIVITY"
  },
  {
    day: 16,
    title: "Ascolta un Podcast Educativo",
    description: "Trova un episodio su un argomento che non conosci. Prendi appunti sui concetti più interessanti che scopri.",
    timeRequired: 20,
    category: "CONNECTION"
  },
  {
    day: 17,
    title: "Osserva le Stelle",
    description: "Esci la sera e guarda il cielo per 15 minuti. Cerca di riconoscere costellazioni o semplicemente goditi l'immensità.",
    timeRequired: 15,
    category: "MINDFULNESS"
  },
  {
    day: 18,
    title: "Prepara un Tè e Ascolta Musica",
    description: "Scegli il tuo tè preferito, preparalo con cura e ascolta 3 canzoni che ti rilassano. Concentrati solo su sapori e melodie.",
    timeRequired: 15,
    category: "MINDFULNESS"
  },
  {
    day: 19,
    title: "Pensiero Libero",
    description: "Scrivi un pensiero che ti gira in testa. Non giudicare, lascia uscire ciò che c'è.",
    timeRequired: 10,
    category: "CREATIVITY"
  },
  {
    day: 20,
    title: "Scrivi la Tua Bio",
    description: "Racconta chi sei davvero, come se il mondo intero dovesse conoscerti. Un esercizio di autoconsapevolezza profonda.",
    timeRequired: 15,
    category: "CREATIVITY"
  },
  {
    day: 21,
    title: "Crea una Playlist Motivazionale",
    description: "Seleziona 10 canzoni che ti danno energia e ispirazione. Organizzale in una sequenza che ti accompagni nei momenti difficili.",
    timeRequired: 20,
    category: "CREATIVITY"
  },
  {
    day: 22,
    title: "Fai 20 Respiri Profondi",
    description: "Siediti comodamente e fai 20 respiri lenti e profondi. Conta ogni inspirazione ed espirazione, concentrandoti solo sul ritmo.",
    timeRequired: 10,
    category: "MINDFULNESS"
  },
  {
    day: 23,
    title: "Snack Consapevole",
    description: "Prepara uno snack sano e gustalo lentamente, prestando attenzione a ogni sapore.",
    timeRequired: 10,
    category: "MINDFULNESS"
  },
  {
    day: 24,
    title: "Decluttering Armadio",
    description: "Libera spazio fisico e mentale eliminando ciò che non ti rappresenta più.",
    timeRequired: 20,
    category: "CONNECTION"
  },
  {
    day: 25,
    title: "Crea la Tua Routine Mattutina",
    description: "Progetta il perfetto inizio di giornata. Una sequenza che trasformerà ogni tuo risveglio.",
    timeRequired: 15,
    category: "CONNECTION"
  },
  {
    day: 26,
    title: "Esplora il Tuo Quartiere",
    description: "Cammina per strade che non hai mai preso. Osserva dettagli architettonici, negozi e angoli nascosti della tua zona.",
    timeRequired: 20,
    category: "CONNECTION"
  },
  {
    day: 27,
    title: "Riorganizza la Scrivania",
    description: "Sistema completamente il tuo spazio di lavoro. Elimina il superfluo e organizza tutto per massimizzare produttività e ispirazione.",
    timeRequired: 20,
    category: "CONNECTION"
  },
  {
    day: 28,
    title: "Scrivi 3 Cose Positive di Oggi",
    description: "Prima di dormire, scrivi 3 eventi positivi della giornata, anche piccoli. Descrivi perché ti hanno fatto stare bene.",
    timeRequired: 10,
    category: "MINDFULNESS"
  },
  {
    day: 29,
    title: "Scrivi Tre Obiettivi Concreti",
    description: "Definisci 3 traguardi specifici per i prossimi 3 mesi. Per ognuno scrivi il primo passo concreto da fare domani.",
    timeRequired: 15,
    category: "CONNECTION"
  },
  {
    day: 30,
    title: "Crea un Collage Ispirazionale",
    description: "Visualizza la versione migliore di te stesso attraverso immagini e colori. Il finale perfetto per il tuo viaggio.",
    timeRequired: 20,
    category: "CREATIVITY"
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
    "Condividi questo momento con chi ami", // Giorno 1 - Chiama un Amico
    "Libera spazio, libera la mente", // Giorno 2 - Cassetto Zen
    "Energia pura per il tuo corpo", // Giorno 3 - Flash Workout
    "Un piccolo gesto, grande impatto", // Giorno 4 - Lettera di Gratitudine
    "Ritrova la bellezza nell'attesa", // Giorno 5 - Sfoglia & Inspira
    "Sperimenta qualcosa di nuovo", // Giorno 6 - Cucina un Piatto Nuovo
    "Dialoga con il tuo io più profondo", // Giorno 7 - Lettera a Me
    "Libera la tua creatività nascosta", // Giorno 8 - Disegno Libero
    "Fai spazio a ciò che conta", // Giorno 9 - Pulizia Digitale
    "Viaggia nei tuoi ricordi", // Giorno 10 - Racconta un Ricordo
    "Scopri il mondo che ti circonda", // Giorno 11 - Passeggiata Detox
    "Dai voce ai tuoi pensieri", // Giorno 12 - Journaling Mentale
    "Amplia i tuoi orizzonti", // Giorno 13 - Impara 5 Parole Straniere
    "Sogna in grande", // Giorno 14 - Lista dei Desideri
    "Condividi la tua esperienza", // Giorno 15 - Scrivi una Recensione
    "Nutri la tua curiosità", // Giorno 16 - Ascolta un Podcast Educativo
    "Contempla l'infinito", // Giorno 17 - Osserva le Stelle
    "Crea il tuo momento perfetto", // Giorno 18 - Prepara un Tè e Ascolta Musica
    "Lascia fluire i pensieri", // Giorno 19 - Pensiero Libero
    "Racconta la tua storia", // Giorno 20 - Scrivi la Tua Bio
    "Costruisci il tuo soundtrack", // Giorno 21 - Crea una Playlist Motivazionale
    "Trova la tua pace interiore", // Giorno 22 - Fai 20 Respiri Profondi
    "Assapora ogni momento", // Giorno 23 - Snack Consapevole
    "Elimina ciò che non serve", // Giorno 24 - Decluttering Armadio
    "Progetta la giornata perfetta", // Giorno 25 - Crea la Tua Routine Mattutina
    "Esplora nuovi territori", // Giorno 26 - Esplora il Tuo Quartiere
    "Crea il tuo ambiente ideale", // Giorno 27 - Riorganizza la Scrivania
    "Celebra le piccole vittorie", // Giorno 28 - Scrivi 3 Cose Positive di Oggi
    "Definisci i tuoi traguardi", // Giorno 29 - Scrivi Tre Obiettivi Concreti
    "Immagina il tuo futuro" // Giorno 30 - Crea un Collage Ispirazionale
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
