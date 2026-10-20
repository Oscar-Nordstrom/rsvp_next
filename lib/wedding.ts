export const weddingDetails = {
  datum: "Lördag, 5 Juni 2027",
  rsvpDeadline: "2027-05-05",
  rsvpDeadlineDisplay: "5 maj 2027",
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
};

export function isRsvpLocked() {
  return Date.now() > new Date(weddingDetails.rsvpDeadline).getTime();
}
