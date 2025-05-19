import { ChallengeDay } from "../types";

export const challenges: ChallengeDay[] = [
  { day: 1, title: "Scopri la verità", description: "Controlla quanto tempo passi sullo schermo e su quali app. Il primo passo è misurare." },
  { day: 2, title: "Quando scrolli?", description: "Annota i momenti in cui apri i social senza pensarci. Osservati." },
  { day: 3, title: "Come ti senti dopo?", description: "Rifletti su come ti senti subito dopo aver scrollato. Energia o svuotamento?" },
  { day: 4, title: "Trova i tuoi trigger", description: "Identifica i 3 momenti della giornata in cui scrolli di più. E preparati ad agire." },
  { day: 5, title: "Cosa stai evitando?", description: "Scrivi cosa stai rimandando grazie allo scroll. Affronta una piccola cosa oggi." },
  { day: 6, title: "Capisci la dopamina", description: "Scopri perché i social sono progettati per catturarti. La consapevolezza è potere." },
  { day: 7, title: "Fai pulizia digitale", description: "Disinstalla 1 app tossica e silenzia le notifiche che non ti servono." },
  { day: 8, title: "Imposta limiti", description: "Configura un timer giornaliero sulle app che usi di più. Metti un confine." },
  { day: 9, title: "Sostituisci lo scroll", description: "Prepara una lista di 10 attività da fare al posto di scrollare." },
  { day: 10, title: "Crea uno spazio detox", description: "Trova un angolo della casa senza schermo. Rendilo il tuo rifugio." },
  { day: 11, title: "Organizza la settimana", description: "Prepara un planner con orari in cui NON userai i social. Fallo realistico." },
  { day: 12, title: "Allenati alla noia", description: "Resta 10 minuti in silenzio, senza telefono. Guarda cosa succede dentro." },
  { day: 13, title: "Ferma lo scroll in 5 secondi", description: "Appena senti l'impulso, conta 5-4-3-2-1 e fai un'azione alternativa." },
  { day: 14, title: "Premiati", description: "Hai completato due settimane. Fatti un regalo che non includa lo smartphone." },
  { day: 15, title: "Recupera un hobby", description: "Riprendi un'attività creativa che avevi abbandonato (lettura, disegno, scrittura…)." },
  { day: 16, title: "Idee anti-scroll", description: "Scegli una tra 30 attività alternative e falla oggi (ti forniremo la lista)." },
  { day: 17, title: "Allena la concentrazione", description: "Svolgi un'attività per 10 minuti senza distrazioni. Poi aumenta a 15." },
  { day: 18, title: "Metti il telefono al suo posto", description: "Non portarlo a letto, né al bagno, né a tavola. Dai confini fisici." },
  { day: 19, title: "Accetta la noia", description: "Non cercare subito uno stimolo. Lascia spazio alla creatività." },
  { day: 20, title: "Orari digitali fissi", description: "Decidi quando usare i social. Es. 30 minuti alle 19. E basta." },
  { day: 21, title: "Scegli tu", description: "Oggi sei liberə di scegliere come usare il tempo. Ma fallo con intenzione." },
  { day: 22, title: "Preparati alle ricadute", description: "Pianifica: \"Se mi viene voglia di scrollare, allora faccio ___\"." },
  { day: 23, title: "Ripulisci il feed", description: "Segui solo chi ti ispira. Smetti di seguire chi ti prosciuga." },
  { day: 24, title: "Usa app che aiutano", description: "Prova app come One Sec o Forest per bloccare o sostituire lo scroll." },
  { day: 25, title: "Ricompense sane", description: "Fai qualcosa che ti gratifichi davvero: sport, uscita, musica, natura." },
  { day: 26, title: "Nuove abitudini", description: "Scegli 3 nuove abitudini \"senza schermo\" da portare con te." },
  { day: 27, title: "Rivedi la tua relazione con i social", description: "Chiediti: \"Che ruolo voglio che abbiano i social nella mia vita?\"" },
  { day: 28, title: "Coinvolgi qualcuno", description: "Sfida un amico o una persona vicina. Insieme è più facile." },
  { day: 29, title: "Guarda quanto hai guadagnato", description: "Controlla i tuoi dati: quanto tempo hai recuperato in questi 29 giorni?" },
  { day: 30, title: "Scriviti dal futuro", description: "Scrivi una lettera a te stessə tra 3 mesi. Cosa vuoi ricordare di oggi?" }
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
