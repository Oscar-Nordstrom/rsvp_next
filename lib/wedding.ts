export const weddingDetails = {
  datum: "Lördag, 5 Juni 2027",
  rsvpDeadline: "2027-05-05",
  rsvpDeadlineDisplay: "5 maj 2027",
  schema: [
    {
      plats: "Kyrkan",
      beskrivning: "Vigseln äger rum i St.Giorgios kyrka.",
      tid: "15:00",
      adress: "Birger Jarlsgatan 92, 114 20 Stockholm",
      länk: "https://maps.app.goo.gl/JjPF8fHUKSZCfCDQ8",
    },
    {
      plats: "Fest",
      beskrivning: "Därefter fortsätter firandet med middag, fest på Steninge bruk",
      tid: "17:00",
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
};

export function isRsvpLocked() {
  return Date.now() > new Date(weddingDetails.rsvpDeadline).getTime();
}
