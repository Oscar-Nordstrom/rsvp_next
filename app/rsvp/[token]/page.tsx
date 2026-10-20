import { notFound } from "next/navigation";
import { weddingDetails, isRsvpLocked } from "@/lib/wedding";
import { getPartyByToken } from "@/lib/guests/data";
import { submitRsvp } from "./actions";
import RsvpForm from "./RsvpForm";
import InfoButton from "@/app/_components/InfoButton";

export default async function RsvpPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const party = await getPartyByToken(token);

  if (!party) {
    notFound();
  }

  const hasResponded = party.responded_at !== null;
  const locked = isRsvpLocked();
  const firstName = party.guests[0]?.name ?? "";

  function guestStatus(attending: boolean | null) {
    if (attending === null) return "Inget svar än";
    return attending ? "Kommer ✅" : "Kommer inte ❌";
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Hej {firstName}!
        </h1>
        <p className="mt-1 text-muted">
          Välkommen till vår bröllopsfest! Vi ser fram emot att fira med dig.
        </p>
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <div>
          <div className="font-medium text-foreground">Datum</div>
          <div className="text-muted">{weddingDetails.datum}</div>
        </div>

        <InfoButton label="Visa schema" title="Schema" className="self-start">
          <div className="flex flex-col gap-3">
            {weddingDetails.schema.map((stop, index) => (
              <div key={index}>
                <div className="font-medium text-foreground">
                  {stop.tid} · {stop.plats}
                </div>
                <div className="text-muted">{stop.beskrivning}</div>
                {"adress" in stop && stop.adress && (
                  <div className="text-muted">{stop.adress}</div>
                )}
                {"länk" in stop && stop.länk && (
                  <a
                    href={stop.länk}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-2"
                  >
                    Visa på karta
                  </a>
                )}
              </div>
            ))}
          </div>
        </InfoButton>

        <div>
          <div className="font-medium text-foreground">Klädkod</div>
          <div className="text-muted">{weddingDetails.tema}</div>
        </div>
      </div>

      <RsvpForm
        token={token}
        guests={party.guests}
        defaultNote={party.note}
        locked={locked}
        action={submitRsvp}
      />

      {hasResponded && (
        <div className="rounded-xl border border-border bg-surface-hover p-4">
          <p className="text-lg font-semibold text-foreground">Svar:</p>
          <ul className="mt-1 flex flex-col gap-0.5">
            {party.guests.map((guest) => (
              <li key={guest.id} className="text-sm text-muted">
                {guest.name}: {guestStatus(guest.attending)}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-muted">
            {locked
              ? "Svarsperioden har stängt. Kontakta oss direkt om du behöver ändra ditt svar."
              : `Du kan ändra ditt svar fram till ${weddingDetails.rsvpDeadlineDisplay} genom att skicka in formuläret igen.`}
          </p>
        </div>
      )}

      {!hasResponded && locked && (
        <p className="text-sm text-subtle">
          Svarsperioden har stängt. Kontakta oss direkt om du behöver svara.
        </p>
      )}
    </main>
  );
}
