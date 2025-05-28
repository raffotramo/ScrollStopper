import { ChallengeDay } from "../types";

export const challenges: ChallengeDay[] = [
  {
    day: 1,
    title: "Passeggiata Detox",
    description: "Cammina attorno a casa o all'isolato senza telefono. Solo cammino, respiro e osservazione.",
    timeRequired: 10
  },
  {
    day: 2,
    title: "Cassetto Zen",
    description: "Riordina un cassetto disordinato. Trova almeno 1 cosa da eliminare o donare.",
    timeRequired: 10
  },
  {
    day: 3,
    title: "Pensiero Libero",
    description: "Scrivi un pensiero che ti gira in testa. Non giudicare, lascia uscire ciò che c'è.",
    timeRequired: 10
  },
  {
    day: 4,
    title: "Snack Consapevole",
    description: "Prepara uno snack sano e gustalo lentamente, prestando attenzione a ogni sapore.",
    timeRequired: 10
  },
  {
    day: 5,
    title: "Sfoglia & Inspira",
    description: "Prendi un libro o una rivista e sfoglialo per il gusto di farlo. Nessuna meta, solo ispirazione.",
    timeRequired: 10
  },
  {
    day: 6,
    title: "Mini Meditazione",
    description: "Ascolta una meditazione guidata offline oppure medita in silenzio. Concentrati sul respiro.",
    timeRequired: 10
  },
  {
    day: 7,
    title: "Lettera a Me",
    description: "Scrivi una lettera al tuo io futuro o passato. Racconta come ti senti oggi.",
    timeRequired: 10
  },
  {
    day: 8,
    title: "Routine Viso",
    description: "Lavati il viso, applica la crema e massaggia con cura. Trasforma il gesto in un rituale.",
    timeRequired: 10
  },
  {
    day: 9,
    title: "Pulizia Digitale",
    description: "Cancella 10 file, foto o app inutili dal telefono o dal computer.",
    timeRequired: 10
  },
  {
    day: 10,
    title: "Flash Workout",
    description: "Fai 5 esercizi fisici a corpo libero (squat, plank, jumping jack…) per riattivarti.",
    timeRequired: 10
  },
  {
    day: 11,
    title: "Disegno Libero",
    description: "Disegna qualsiasi cosa ti venga in mente, senza giudizio. Sperimenta.",
    timeRequired: 15
  },
  {
    day: 12,
    title: "Journaling Mentale",
    description: "Scrivi tutto quello che ti passa per la testa. Poi sottolinea le frasi importanti.",
    timeRequired: 15
  },
  {
    day: 13,
    title: "Pianifica Domani",
    description: "Organizza la tua giornata di domani con orari, priorità e pause.",
    timeRequired: 15
  },
  {
    day: 14,
    title: "Lista dei Desideri",
    description: "Scrivi 10 cose che sogni di fare nella tua vita. Anche le più pazze.",
    timeRequired: 15
  },
  {
    day: 15,
    title: "Silenzio Visivo",
    description: "Guarda il cielo o un punto naturale per 15 minuti, in completo silenzio.",
    timeRequired: 15
  },
  {
    day: 16,
    title: "Cammina & Ascolta",
    description: "Fai una camminata ascoltando i suoni dell'ambiente, non musica.",
    timeRequired: 15
  },
  {
    day: 17,
    title: "Mini Documentario",
    description: "Guarda un video ispirante già scaricato. Prendi nota di cosa ti ha colpito.",
    timeRequired: 15
  },
  {
    day: 18,
    title: "Bevanda & Coperta",
    description: "Prepara una tisana, siediti con una coperta e rilassati senza schermo.",
    timeRequired: 15
  },
  {
    day: 19,
    title: "Organizza la Settimana",
    description: "Pianifica i prossimi 7 giorni con obiettivi realistici, pause e tempo per te.",
    timeRequired: 15
  },
  {
    day: 20,
    title: "Scrivi la tua bio",
    description: "Descriviti come se fossi su un libro o in un documentario. Chi sei davvero?",
    timeRequired: 15
  },
  {
    day: 21,
    title: "Sistema le tue finanze",
    description: "Controlla le spese recenti e annota quanto hai risparmiato evitando lo scroll.",
    timeRequired: 15
  },
  {
    day: 22,
    title: "Mini yoga flow",
    description: "Esegui una sequenza semplice di yoga per sciogliere tensioni e ritrovare centratura.",
    timeRequired: 15
  },
  {
    day: 23,
    title: "Crea la tua routine mattutina",
    description: "Scrivi una sequenza di 3-4 azioni per iniziare meglio la giornata. Provala domani.",
    timeRequired: 15
  },
  {
    day: 24,
    title: "Racconta un ricordo",
    description: "Scrivi un ricordo intenso della tua infanzia. Focalizzati sui dettagli sensoriali.",
    timeRequired: 15
  },
  {
    day: 25,
    title: "Lettera di gratitudine",
    description: "Scrivi una lettera (vera o simbolica) a qualcuno che ha influenzato positivamente la tua vita.",
    timeRequired: 15
  },
  {
    day: 26,
    title: "Decluttering armadio",
    description: "Svuota una mensola del tuo armadio e tieni solo ciò che ti fa stare bene.",
    timeRequired: 20
  },
  {
    day: 27,
    title: "Esci senza meta",
    description: "Vai a fare una camminata senza destinazione precisa. Segui solo la curiosità.",
    timeRequired: 20
  },
  {
    day: 28,
    title: "Pulisci la scrivania",
    description: "Riordina e rinnova la tua area di lavoro. Aggiungi un oggetto che ti ispira.",
    timeRequired: 20
  },
  {
    day: 29,
    title: "Organizza i tuoi file digitali",
    description: "Sistema le cartelle del desktop, cloud o telefono. Ordine mentale = ordine digitale.",
    timeRequired: 20
  },
  {
    day: 30,
    title: "Crea un collage ispirazionale",
    description: "Ritaglia immagini da riviste e crea una moodboard su come vuoi sentirti nei prossimi 30 giorni.",
    timeRequired: 20
  }
];

export const getTodaysChallenge = (currentDay: number): ChallengeDay => {
  // Ensure we're within the bounds of the challenge days (1-30)
  const safeDayIndex = Math.min(Math.max(1, currentDay), 30) - 1;
  return challenges[safeDayIndex];
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
