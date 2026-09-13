import { notFound } from "next/navigation";
import { weddingDetails, isRsvpLocked } from "@/lib/wedding";
import { getGuestByToken } from "@/lib/guests/data";
import { submitRsvp } from "./actions";
import RsvpForm from "./RsvpForm";

export default async function RsvpPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const guest = await getGuestByToken(token);

  if (!guest) {
    notFound();
  }

  const hasResponded = guest.attending !== null;
  const locked = isRsvpLocked();

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          Hej {guest.name}!
        </h1>
        <p className="mt-1 text-muted">
          Välkommen till vår bröllopsfest! Vi ser fram emot att fira med dig.
        </p>
      </div>

      {/* <div className="flex aspect-4/3 w-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface-hover text-xs text-subtle">
        Photo coming soon
      </div> */}

      <div className="flex flex-col gap-4 text-sm">
        <div>
          <div className="font-medium text-foreground">Datum</div>
          <div className="text-muted">{weddingDetails.datum}</div>
        </div>

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

        <div>
          <div className="font-medium text-foreground">Klädkod</div>
          <div className="text-muted">{weddingDetails.tema}</div>
        </div>
      </div>

      <RsvpForm
        token={token}
        defaultAttending={guest.attending}
        defaultNote={guest.note}
        partySize={guest.party_size}
        defaultAttendingCount={guest.attending_count}
        locked={locked}
        action={submitRsvp}
      />

      {hasResponded && (
        <p className="text-sm text-subtle">
          Svar:{" "}
          {guest.attending
            ? `Kommer ✅ (${guest.attending_count}/${guest.party_size})`
            : "Kommer inte"}
          <br />
          {locked
            ? "Svarsperioden har stängt. Kontakta oss direkt om du behöver ändra ditt svar."
            : `Du kan ändra ditt svar fram till ${weddingDetails.rsvpDeadlineDisplay} genom att skicka in formuläret igen.`}
        </p>
      )}

      {!hasResponded && locked && (
        <p className="text-sm text-subtle">
          Svarsperioden har stängt. Kontakta oss direkt om du behöver svara.
        </p>
      )}
    </main>
  );
}
