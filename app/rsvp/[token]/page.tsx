import { notFound } from "next/navigation";
import { weddingDetails, isRsvpLocked, DeadlineSentence, text } from "@/lib/wedding";
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
    if (attending === null) return text.rsvp.noAnswer;
    return attending ? text.rsvp.attending : text.rsvp.notAttending;
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-8 px-6 py-16">
      <div>
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {text.rsvp.greeting(firstName)}
        </h1>
        <p className="mt-1 text-muted">
          {text.rsvp.welcome}
        </p>
        <p className="mt-1 text-muted">
          {DeadlineSentence}
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <InfoButton label={text.rsvp.detailsButton} title={text.rsvp.detailsTitle}>
          <div>
            <div className="font-medium text-foreground">{text.rsvp.dateLabel}</div>
            <div className="text-muted">{weddingDetails.datum}</div>
          </div>
          <div>
            <div className="font-medium text-foreground">{text.rsvp.dressCodeLabel}</div>
            <div className="text-muted">{weddingDetails.tema}</div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-medium text-foreground">{text.rsvp.scheduleLabel}</div>
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
                    {text.rsvp.showOnMap}
                  </a>
                )}
              </div>
            ))}
          </div>
        </InfoButton>
      </div>

      <RsvpForm
        token={token}
        guests={party.guests}
        defaultNote={party.note}
        defaultTransport={party.transport}
        locked={locked}
        action={submitRsvp}
      />

      {hasResponded && (
        <div className="rounded-xl border border-border bg-surface-hover p-4">
          <p className="text-lg font-semibold text-foreground">{text.rsvp.summaryTitle}</p>
          <ul className="mt-1 flex flex-col gap-0.5">
            {party.guests.map((guest) => (
              <li key={guest.id} className="text-sm text-muted">
                {guest.name}: {guestStatus(guest.attending)}
              </li>
            ))}
          </ul>
          {party.transport !== null && (
            <p className="mt-1 text-sm text-muted">
              {text.rsvp.transportLabel}: {party.transport ? text.rsvp.yes : text.rsvp.no}
            </p>
          )}
          <p className="mt-2 text-sm text-muted">
            {locked
              ? text.rsvp.lockedAfterAnswer
              : text.rsvp.canChangeAnswer}
          </p>
        </div>
      )}

      {!hasResponded && locked && (
        <p className="text-sm text-subtle">
          {text.rsvp.lockedNoAnswer}
        </p>
      )}
    </main>
  );
}
