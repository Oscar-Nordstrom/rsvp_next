export const Deadline = new Date("2027-05-05"); 
export const DeadlineString = Deadline.toLocaleDateString("sv-SE", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export const weddingDetails = {
  datum: "Lördag, 5 Juni 2027",
  rsvpDeadlineDisplay: DeadlineString,
  schema: [
    {
      plats: "Kyrkan",
      beskrivning: "Vigseln äger rum i Sollentuna kyrka.",
      tid: "16:00",
      adress: "Kyrkvägen 2, 192 72 Sollentuna",
      länk: "https://maps.app.goo.gl/FLwZ5ib6pv8jV2HW9",
    },
    {
      plats: "Fest",
      beskrivning: "Därefter fortsätter firandet med mingel, middag, och fest på Steninge bruk",
      tid: "17:30",
      adress: "Steninge slottsväg 141, Marsta, SE 195 91",
      länk: "https://maps.app.goo.gl/tmmLui74PZrR5wTM6",
    },
    {
      plats: "Hemfärd",
      beskrivning: "Festen avslutas",
      tid: "01:00"
    }
  ],
  tema: "Fri klädsel",
  children: "Barn är välkomna!",
  gift: "Om ni vill ge oss en gåva så är vi glada för ett bidrag till vår bröllopsresa.",
  speach: "Vill du hålla tal......",
};


export const DeadlineSentence = `Sista svarsdatum är ${DeadlineString}.`;

export const text = {
  metadata: {
    title: "RSVP",
    description: "Let us know if you can make it!",
  },
  home: {
    title: "Oscar & Afrodite 2027",
    intro:
      "Använd din personliga kod för svara på inbjudan och se mer information om bröllopet.",
    codePlaceholder: "Din kod",
    submit: "Hitta min inbjudan",
    notFound: "Vi kunde inte hitta någon inbjudan med den koden.",
  },
  rsvp: {
    greeting: (name: string) => `Hej ${name}!`,
    welcome: "Välkommen till vår bröllopsfest! Vi ser fram emot att fira med dig.",
    detailsButton: "Detaljer & schema",
    detailsTitle: "Detaljer & schema",
    dateLabel: "Datum",
    dressCodeLabel: "Klädkod",
    childrenLabel: "Barn",
    giftLabel: "Gåva",
    speachLabel: "Tal",
    scheduleLabel: "Schema",
    showOnMap: "Visa på karta",
    close: "Stäng",
    summaryTitle: "Svar:",
    noAnswer: "Inget svar än",
    attending: "Kommer ✅",
    notAttending: "Kommer inte ❌",
    transportLabel: "Transport",
    yes: "Ja",
    no: "Nej",
    canChangeAnswer: `Du kan ändra ditt svar fram till ${DeadlineString} genom att skicka in formuläret igen.`,
    lockedAfterAnswer:
      "Svarsperioden har stängt. Kontakta oss direkt om du behöver ändra ditt svar.",
    lockedNoAnswer:
      "Svarsperioden har stängt. Kontakta oss direkt om du behöver svara.",
  },
  form: {
    attendingYes: "Ja, kommer!",
    attendingNo: "Kan inte komma",
    allergiesLabel: "Allergier/Avvikelser",
    allergyOtherPlaceholder: "Beskriv allergin...",
    transportQuestion: "Önskar ni transport från kyrkan till festlokalen?",
    noteLabel: "Meddelande (frånvarande gäster, övrigt etc.)",
    notePlaceholder: "Skriv ett meddelande till oss...",
    submit: "Skicka",
  },
};

export function isRsvpLocked() {
  return Date.now() > new Date(Deadline).getTime();
}
