"use client";

import { useState } from "react";
import SubmitButton from "@/app/_components/SubmitButton";
import Button from "@/app/_components/Button";
import GuestRsvpField from "@/app/_components/GuestRsvpField";
import type { Guest } from "@/types";

interface RsvpFormProps {
  token: string;
  guests: Guest[];
  defaultNote: string | null;
  defaultTransport: boolean | null;
  locked: boolean;
  action: (formData: FormData) => void;
}

export default function RsvpForm({
  token,
  guests,
  defaultNote,
  defaultTransport,
  locked,
  action,
}: RsvpFormProps) {
  const [attendingById, setAttendingById] = useState<
    Record<string, boolean | null>
  >(() =>
    Object.fromEntries(guests.map((guest) => [guest.id, guest.attending])),
  );
  const [transport, setTransport] = useState<boolean | null>(defaultTransport);
  const [noteLength, setNoteLength] = useState(defaultNote?.length ?? 0);

  const everyoneAnswered = guests.every(
    (guest) => attendingById[guest.id] !== null,
  );

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />
      <input
        type="hidden"
        name="guestIds"
        value={guests.map((guest) => guest.id).join(",")}
      />

      <div className="flex flex-col gap-3">
        {guests.map((guest) => (
          <GuestRsvpField
            key={guest.id}
            guest={guest}
            attending={attendingById[guest.id] ?? null}
            onAttendingChange={(attending) =>
              setAttendingById((current) => ({
                ...current,
                [guest.id]: attending,
              }))
            }
            locked={locked}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
        <input
          type="hidden"
          name="transport"
          value={transport === null ? "" : String(transport)}
        />

        <div className="font-medium text-foreground">
          Önskar ni transport från kyrkan till festlokalen?
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            variant={transport === true ? "primary" : "secondary"}
            aria-pressed={transport === true}
            onClick={() => setTransport(true)}
            disabled={locked}
            size="sm"
            className="flex-1"
          >
            Ja
          </Button>
          <Button
            type="button"
            variant={transport === false ? "primary" : "secondary"}
            aria-pressed={transport === false}
            onClick={() => setTransport(false)}
            disabled={locked}
            size="sm"
            className="flex-1"
          >
            Nej
          </Button>
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm text-muted">
        Meddelande (frånvarande gäster, övrigt etc.)
        <textarea
          name="note"
          defaultValue={defaultNote ?? ""}
          onChange={(e) => setNoteLength(e.target.value.length)}
          rows={3}
          maxLength={500}
          disabled={locked}
          placeholder="Skriv ett meddelande till oss..."
          className="rounded-md border border-border bg-transparent px-3 py-2 text-sm"
        />
        <span className="self-end text-xs text-subtle">
          {noteLength}/500
        </span>
      </label>

      <SubmitButton disabled={locked || !everyoneAnswered}>
        Skicka
      </SubmitButton>
    </form>
  );
}
